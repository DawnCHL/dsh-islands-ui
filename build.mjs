/**
 * Build the self-contained browser module.
 *
 * The module loader cannot import package files, so every src/*.css file is
 * concatenated (in filename order) and inlined into client.js. Files under
 * src/variants/ are inlined as a `dialect → css` map instead, so the client can
 * append the one that matches the running DSH shell. Run with `node build.mjs`
 * after editing the styles.
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

// Shell variants are named after the dialect the client selects, not after a
// release: one file per sidebar structure, injected in addition to the base
// stylesheet only when the running DSH reports that structure.
const variantsDir = join(srcDir, 'variants');
const variants = {};
let variantFiles = [];
try {
  variantFiles = (await readdir(variantsDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.css'))
    .map((entry) => entry.name)
    .sort();
} catch {
  /* No variants yet: the base stylesheet has to cover every build. */
}
for (const name of variantFiles) {
  const text = await readFile(join(variantsDir, name), 'utf8');
  variants[name.replace(/\.css$/u, '')] = text.trim();
}

const template = await readFile(join(srcDir, 'client.template.js'), 'utf8');
if (!template.includes("'__ISLANDS_CSS__'")) throw new Error('client.template.js lost its CSS placeholder');
if (!template.includes("'__ISLANDS_CSS_VARIANTS__'")) {
  throw new Error('client.template.js lost its variant placeholder');
}
const built = template
  .replace("'__ISLANDS_CSS_VARIANTS__'", () => JSON.stringify(variants))
  .replace("'__ISLANDS_CSS__'", () => JSON.stringify(css));
const variantBytes = Object.values(variants).reduce((total, text) => total + text.length, 0);
const summary = `${files.length} stylesheets, ${variantFiles.length} variants, ${css.length + variantBytes} bytes of CSS`;

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
