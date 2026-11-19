/**
 * Build the self-contained browser module.
 *
 * The module loader cannot import package files, so every src/*.css file is
 * concatenated (in filename order) and inlined into client.js. The host
 * modules in src/host/*.js are inlined the same way, with their ESM `export`
 * tokens stripped; runtime.js is also imported by the build checks and tests.
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

// The smooth caret is a DOM controller with no template internals, so it is
// inlined as its own module rather than living in the (much larger) template.
const caret = await readFile(join(srcDir, 'host', 'caret.js'), 'utf8');
const caretModule = caret.replace(/^export\s+/gmu, '').trim();

// The rail foot measure is another DOM controller with no template internals:
// it publishes the measured foot height the fixed rail anchors read.
const foot = await readFile(join(srcDir, 'host', 'foot.js'), 'utf8');
const footModule = foot.replace(/^export\s+/gmu, '').trim();

// The workspace footer panel is a DOM controller as well: it owns collapse,
// the remembered height and the drag handle, and publishes body attributes
// the stylesheet reads.
const footer = await readFile(join(srcDir, 'host', 'footer.js'), 'utf8');
const footerModule = footer.replace(/^export\s+/gmu, '').trim();

// The host collapse policy is a pure decision function (host auto-collapse vs
// a user gesture); it is unit tested from source and inlined for the client.
const collapse = await readFile(join(srcDir, 'host', 'collapse.js'), 'utf8');
const collapseModule = collapse.replace(/^export\s+/gmu, '').trim();

// The compatibility gate is a state machine with injected timers, visibility,
// contract probe and callbacks, so it is unit tested from source as well.
const compatGate = await readFile(join(srcDir, 'host', 'compat-gate.js'), 'utf8');
const compatGateModule = compatGate.replace(/^export\s+/gmu, '').trim();

// The runtime yield guard is another injected state machine: it decides when
// the skin has to stop contesting the host sidebar with another plugin, and
// when it may come back.
const yieldGuard = await readFile(join(srcDir, 'host', 'yield.js'), 'utf8');
const yieldGuardModule = yieldGuard.replace(/^export\s+/gmu, '').trim();

const template = await readFile(join(srcDir, 'client.template.js'), 'utf8');
if (!template.includes("'__ISLANDS_CSS__'")) throw new Error('client.template.js lost its CSS placeholder');
if (!template.includes('/*__HOST_RUNTIME__*/')) {
  throw new Error('client.template.js lost its host-runtime placeholder');
}
if (!template.includes('/*__CARET_MODULE__*/')) {
  throw new Error('client.template.js lost its caret placeholder');
}
if (!template.includes('/*__FOOT_MODULE__*/')) {
  throw new Error('client.template.js lost its foot-measure placeholder');
}
if (!template.includes('/*__FOOTER_MODULE__*/')) {
  throw new Error('client.template.js lost its footer-panel placeholder');
}
if (!template.includes('/*__COLLAPSE_MODULE__*/')) {
  throw new Error('client.template.js lost its collapse-policy placeholder');
}
if (!template.includes('/*__COMPAT_GATE_MODULE__*/')) {
  throw new Error('client.template.js lost its compatibility-gate placeholder');
}
if (!template.includes('/*__YIELD_MODULE__*/')) {
  throw new Error('client.template.js lost its yield-guard placeholder');
}
const built = template
  .replace('/*__HOST_RUNTIME__*/', () => hostRuntime)
  .replace('/*__CARET_MODULE__*/', () => caretModule)
  .replace('/*__FOOT_MODULE__*/', () => footModule)
  .replace('/*__FOOTER_MODULE__*/', () => footerModule)
  .replace('/*__COLLAPSE_MODULE__*/', () => collapseModule)
  .replace('/*__COMPAT_GATE_MODULE__*/', () => compatGateModule)
  .replace('/*__YIELD_MODULE__*/', () => yieldGuardModule)
  .replace("'__ISLANDS_CSS__'", () => JSON.stringify(css));
const summary = `${files.length} stylesheets, ${css.length + hostRuntime.length + caretModule.length + footModule.length + footerModule.length + collapseModule.length + compatGateModule.length + yieldGuardModule.length} bytes of CSS, host bridge and controllers`;

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
