/**
 * Build the self-contained browser module.
 *
 * The module loader cannot import package files, so every src/*.css file is
 * concatenated (in filename order) and inlined into client.js. The host bridge
 * in src/host/runtime.js is inlined the same way, with its ESM `export` tokens
 * stripped; the same file is imported by the build checks and the tests.
 *
 * Run with `node build.mjs` after editing the styles or the host table.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const srcDir = join(root, 'src');

const entries = await readdir(srcDir, { withFileTypes: true });
const files = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith('.css'))
  .map((entry) => entry.name)
  .sort();

const parts = [];
for (const name of files) {
  const text = await readFile(join(srcDir, name), 'utf8');
  parts.push(`/* ---- ${name} ---- */\n${text.trim()}`);
}

const css = parts.join('\n\n');

const runtime = await readFile(join(srcDir, 'host', 'runtime.js'), 'utf8');
const hostRuntime = runtime.replace(/^export\s+/gmu, '').trim();

const template = await readFile(join(srcDir, 'client.template.js'), 'utf8');
if (!template.includes("'__ISLANDS_CSS__'")) throw new Error('client.template.js lost its CSS placeholder');
if (!template.includes('/*__HOST_RUNTIME__*/')) {
  throw new Error('client.template.js lost its host-runtime placeholder');
}
const built = template
  .replace('/*__HOST_RUNTIME__*/', () => hostRuntime)
  .replace("'__ISLANDS_CSS__'", () => JSON.stringify(css));
const summary = `${files.length} stylesheets, ${css.length + hostRuntime.length} bytes of CSS and host bridge`;

if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = await readFile(join(root, 'client.js'), 'utf8');
  } catch {
    /* report the missing artifact through the same stale-build message */
  }
  if (current !== built) {
    console.error(`client.js is stale (${summary}); run \`node build.mjs\` and commit the result.`);
    process.exitCode = 1;
  } else {
    console.log(`client.js is up to date (${summary}).`);
  }
} else {
  await writeFile(join(root, 'client.js'), built, 'utf8');
  console.log(`client.js: ${summary}`);
}
