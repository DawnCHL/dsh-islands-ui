/**
 * Build the self-contained browser module.
 *
 * The module loader cannot import package files, so every src/*.css file is
 * concatenated (in filename order) and inlined into client.js. Run with
 * `node build.mjs` after editing the styles.
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
const template = await readFile(join(srcDir, 'client.template.js'), 'utf8');
if (!template.includes("'__ISLANDS_CSS__'")) throw new Error('client.template.js lost its CSS placeholder');
const built = template.replace("'__ISLANDS_CSS__'", () => JSON.stringify(css));
const summary = `${files.length} stylesheets, ${css.length} bytes of CSS`;

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
