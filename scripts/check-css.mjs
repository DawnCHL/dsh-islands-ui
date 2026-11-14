/**
 * Stylesheet gate.
 *
 * A rule that touches the host must be scoped to the skin, may only match a
 * host contract or a skin part, and may not name a hashed class or a class
 * substring. Skin-only rules (`.isl-*`) stay unscoped because the components
 * that carry them are mounted only while the skin is on.
 */
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HOST_ATTRIBUTES, PART_ATTR, partNames } from '../src/host/runtime.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const problems = [];
const parts = new Set(partNames());
const hostAttributes = new Set(HOST_ATTRIBUTES);
const ownAttributes = new Set([
  'data-islands-ui',
  'data-islands-part',
  'data-islands-workspace-collapsed',
  'data-islands-accent',
  'data-islands-animating',
  'data-open',
  'data-scrolled',
  'data-clipped',
  'data-rail-id',
  'data-on',
  'data-ring',
  'data-col',
  'data-span',
]);
const hashedClass = /\.[A-Za-z0-9-]+_[A-Za-z0-9_-]+/u;
const classToken = /\.([A-Za-z][A-Za-z0-9-]*)/gu;

const files = (await readdir(src)).filter((name) => name.endsWith('.css')).sort();
for (const file of files) {
  const label = `src/${file}`;
  const text = (await readFile(join(src, file), 'utf8')).replace(/\/\*[\s\S]*?\*\//gu, '');
  const peer = file === '60-peers.css';
  for (const match of text.matchAll(/([^{}]+)\{/gu)) {
    const selector = match[1].trim();
    if (selector === '' || selector.startsWith('@') || /^(?:from|to|\d+(?:\.\d+)?%)$/u.test(selector)) continue;
    const where = `${label}: "${selector.slice(0, 140)}"`;

    if (!peer && hashedClass.test(selector)) problems.push(`${where}: names a hashed class`);
    if (!peer && selector.includes('[class*=')) problems.push(`${where}: uses a class substring`);
    const selectorWithoutStrings = selector.replace(/'[^']*'/gu, "''").replace(/"[^"]*"/gu, '""');
    if (!peer) {
      for (const token of selectorWithoutStrings.matchAll(classToken)) {
        const name = token[1];
        if (name.startsWith('isl-') || name.startsWith('is-') || name.startsWith('dsh-')) continue;
        problems.push(`${where}: names the host class ".${name}"`);
      }
    }

    const partsRead = [...selector.matchAll(new RegExp(`\\[${PART_ATTR}~="([^"]+)"\\]`, 'gu'))].map((entry) => entry[1]);
    for (const part of partsRead) {
      if (!parts.has(part)) problems.push(`${where}: reads the part "${part}", which the table does not define`);
    }

    const attributes = [...selector.matchAll(/\[(data-[a-z0-9-]+)/gu)].map((entry) => entry[1]);
    if (!peer) {
      for (const attribute of attributes) {
        if (ownAttributes.has(attribute)) continue;
        if (!hostAttributes.has(attribute)) problems.push(`${where}: reads [${attribute}], which is not a host contract`);
      }
    }

    const touchesHost = partsRead.length > 0
      || attributes.some((attribute) => hostAttributes.has(attribute));
    if (touchesHost && !selector.includes('body[data-islands-ui]') && !selector.startsWith('body[data-ds-dark-theme]')) {
      problems.push(`${where}: touches the host without body[data-islands-ui] scope`);
    }
  }
}

if (problems.length > 0) {
  console.error(`check:css failed:\n- ${problems.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`check:css ok (${files.length} stylesheets)`);
}
