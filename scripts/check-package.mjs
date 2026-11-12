/**
 * Pre-publish checks for the npm package.
 *
 * The skin is a pure client bundle, so most packaging mistakes are silent:
 * a stale client.js, a row name that no longer matches the package name, a
 * screenshot that exists only in the working tree, or files the tarball would
 * omit. This script fails loudly on all of them.
 */
import { access, readFile } from 'node:fs/promises';
import { dirname, join, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const notices = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

async function exists(path) {
  try {
    await access(join(root, path));
    return true;
  } catch {
    return false;
  }
}

const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));

/* ---- identity and publishability ---------------------------------------- */

check(pkg.name === 'dsh-islands-ui', `package name must be dsh-islands-ui (got ${pkg.name})`);
check(pkg.private !== true, 'package.json must not be private');
check(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(pkg.version), `version is not semver: ${pkg.version}`);
check(typeof pkg.description === 'string' && pkg.description.length >= 40, 'description is too short for a store listing');
check(pkg.license === 'MIT', 'license must be MIT');
check(typeof pkg.repository?.url === 'string', 'repository.url is required and must point at the GitHub repo');
check(pkg.repository?.url?.includes('DawnCHL/dsh-islands-ui'), 'repository.url must point at DawnCHL/dsh-islands-ui');
check(Array.isArray(pkg.keywords) && pkg.keywords.includes('dsh-plugin'), 'keywords must include dsh-plugin');
check(Array.isArray(pkg.keywords) && pkg.keywords.includes('theme'), 'keywords must include theme');
check(pkg.engines?.node !== undefined, 'engines.node is required');
check(typeof pkg.engines?.dsh === 'string', 'engines.dsh is required for plugin-manager compatibility checks');
check(typeof pkg.dsh?.compatibility?.dsh === 'string', 'dsh.compatibility.dsh is required for store listings');
check(pkg.publishConfig?.registry === 'https://registry.npmjs.org/', 'publishConfig.registry must be npmjs (the local npm mirror is read-only)');

/* ---- DSH manifest -------------------------------------------------------- */

check(pkg.dsh?.manifestVersion === 1, 'dsh.manifestVersion must be 1');
check(typeof pkg.dsh?.bundle?.patch === 'string', 'dsh.bundle.patch is required (dsh.client alone is not installable)');
check(pkg.dsh?.client?.platform === 'web', 'dsh.client.platform must be web');
check(Array.isArray(pkg.dsh?.client?.inject), 'dsh.client.inject must be an array');
check(pkg.dsh?.client?.immediately === true, 'dsh.client.immediately should stay true so the skin lands before the first paint');

const patchPath = pkg.dsh?.bundle?.patch ?? './cordis.patch.yml';
check(await exists(patchPath), `missing bundle patch: ${patchPath}`);
if (await exists(patchPath)) {
  const patch = await readFile(join(root, patchPath), 'utf8');
  const names = [...patch.matchAll(/^\s*name:\s*['"]?([^'"\n]+)['"]?\s*$/gmu)].map((match) => match[1].trim());
  check(names.includes(pkg.name), `${patchPath} must mount ${pkg.name} (found: ${names.join(', ') || 'none'})`);
  check(!patch.includes('@local/'), `${patchPath} still contains a local-only package name`);
}

/* ---- built client -------------------------------------------------------- */

check(await exists('client.js'), 'missing client.js; run node build.mjs');
if (await exists('client.js')) {
  const client = await readFile(join(root, 'client.js'), 'utf8');
  check(client.includes(`id: '${pkg.name}'`), `client.js must register the module id ${pkg.name}`);
  check(!client.includes('__ISLANDS_CSS__'), 'client.js still contains the CSS placeholder; run node build.mjs');
  check(!client.includes('@local/'), 'client.js still contains a local-only package name');
}

/* ---- store-facing assets ------------------------------------------------- */

check(await exists('skin.json'), 'missing skin.json (theme managers read it)');
if (await exists('skin.json')) {
  const skin = JSON.parse(await readFile(join(root, 'skin.json'), 'utf8'));
  check(skin.id === 'islands-ui', 'skin.json id must be islands-ui');
  check(skin.package === pkg.name, 'skin.json package must equal the npm package name');
  check(skin.bodyAttr === 'data-islands-ui', 'skin.json bodyAttr must match the CSS attribute');
  check(skin.wiring?.id === 'islands-ui', 'skin.json wiring.id must match the cordis row id');
}

check(await exists(pkg.icon ?? ''), `missing package icon: ${pkg.icon}`);
check((pkg.icon ?? '').endsWith('.png'), 'package icon must be a PNG for storefront tiles');

const screenshots = JSON.parse(await readFile(join(root, 'screenshots.json'), 'utf8'));
const screenshotList = Array.isArray(screenshots) ? screenshots : screenshots.screenshots;
check(Array.isArray(screenshotList), 'screenshots.json must be an array or { screenshots: [...] }');
check(screenshotList.length >= 1 && screenshotList.length <= 8, 'screenshots.json must list 1-8 images');
for (const path of screenshotList) {
  check(typeof path === 'string' && path.length > 0, `invalid screenshot entry: ${String(path)}`);
  if (typeof path !== 'string' || path.length === 0) continue;
  check(!isAbsolute(path), `screenshot path must be relative: ${path}`);
  const resolved = join(root, path);
  check(!relative(root, resolved).startsWith('..'), `screenshot path escapes the package: ${path}`);
  check(await exists(path), `missing screenshot: ${path}`);
}

/* ---- files the tarball must carry --------------------------------------- */

const required = [
  'index.js',
  'client.js',
  'cordis.patch.yml',
  'skin.json',
  'screenshots.json',
  'icon.svg',
  'assets/icon-180.png',
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
];

for (const path of required) {
  check(await exists(path), `missing publish file: ${path}`);
  const listed = (pkg.files ?? []).some((entry) => entry === path || entry === `${path}/` || (entry.endsWith('/') && path.startsWith(entry)));
  check(listed, `package.json files[] does not include ${path}`);
}

check((pkg.files ?? []).some((entry) => entry === 'locale/*.json' || entry === 'locale/'), 'package.json files[] must include locale/*.json');
check((pkg.files ?? []).some((entry) => entry === 'assets/' || entry === 'assets'), 'package.json files[] must include assets/ so npm renders the README screenshots');

/* ---- report -------------------------------------------------------------- */

if (errors.length > 0) {
  console.error(`package check failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exitCode = 1;
} else {
  for (const notice of notices) console.log(notice);
  console.log(`package check passed: ${pkg.name}@${pkg.version}, ${screenshotList.length} screenshots.`);
}
