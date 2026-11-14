/**
 * Part-table gate.
 *
 * The stylesheet may only read part names the table defines, and every part
 * the table defines has to be read by the stylesheet or the browser half.
 * Local names are camelCase words; selectors are host promises or parts.
 */
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  HOST, HOST_ATTRIBUTES, PART_ATTR, PART_REGIONS, localClassName, partNames,
} from '../src/host/runtime.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const partPattern = /^[a-z][a-z0-9-]*$/u;
const namePattern = /^[a-z][A-Za-z0-9]*$/u;
const hashedClass = /\.[A-Za-z0-9-]+_[A-Za-z0-9_-]+/u;

const defined = partNames();
const definedSet = new Set(defined);
if (definedSet.size === 0) problems.push('the part table defines no names');

const owners = new Map();
for (const region of PART_REGIONS) {
  if (typeof region.id !== 'string' || region.id === '') problems.push(`region ${JSON.stringify(region)} has no id`);
  for (const side of [region.within, region.skip].filter(Boolean)) {
    if (hashedClass.test(side)) problems.push(`${region.id}: selector "${side}" names a hashed class`);
    if (side.includes('[class*=')) problems.push(`${region.id}: selector "${side}" uses a substring match`);
    if (/\.[A-Za-z][A-Za-z0-9-]*/u.test(side) && !side.includes('[data-')) {
      problems.push(`${region.id}: selector "${side}" names a host class instead of a contract`);
    }
  }
  for (const [local, part] of [
    ...Object.entries(region.parts),
    ...Object.entries(region.rootParts ?? {}),
  ]) {
    if (!namePattern.test(local)) problems.push(`${region.id}: local name "${local}" is not a camelCase word`);
    if (!partPattern.test(part)) problems.push(`${region.id}: part name "${part}" is not kebab-case`);
    const owner = owners.get(part);
    if (owner !== undefined) problems.push(`${region.id}: part "${part}" is already defined by ${owner}`);
    else owners.set(part, region.id);
  }
}

for (const value of Object.values(HOST)) {
  if (hashedClass.test(value)) problems.push(`HOST names a hashed class: ${value}`);
  if (value.includes('[class*=')) problems.push(`HOST uses a substring match: ${value}`);
}

// Every part the table defines must be read by a stylesheet or a browser query.
const cssFiles = (await readdir(join(root, 'src'))).filter((name) => name.endsWith('.css'));
let css = '';
for (const name of cssFiles) css += await readFile(join(root, 'src', name), 'utf8');
const browser = await readFile(join(root, 'src', 'client.template.js'), 'utf8');
if (/\[class\*=/.test(browser)) problems.push('the browser half uses a class substring match');
const readInCss = new Set([...css.matchAll(new RegExp(`\\[${PART_ATTR}~="([^"]+)"\\]`, 'g'))].map((match) => match[1]));
// DOM queries may only take a contract or a part selector, never a class.
for (const match of browser.matchAll(/querySelector(?:All)?\(\s*['"`]\.([^'"`]+)/g)) {
  problems.push(`the browser half queries the class ".${match[1]}"; read a contract or a part instead`);
}
for (const match of browser.matchAll(/closest\(\s*['"`]\.([^'"`]+)/g)) {
  problems.push(`the browser half climbs to the class ".${match[1]}"; read a contract or a part instead`);
}
const readInBrowser = new Set([...browser.matchAll(/partSelector\('([^']+)'\)/g)].map((match) => match[1]));
for (const part of readInCss) {
  if (!definedSet.has(part)) problems.push(`a stylesheet reads "${part}", which the table does not define`);
}
for (const part of readInBrowser) {
  if (!definedSet.has(part)) problems.push(`the browser half reads "${part}", which the table does not define`);
}
for (const part of defined) {
  if (!readInCss.has(part) && !readInBrowser.has(part)) problems.push(`the table defines "${part}", which nothing reads`);
}

// The contracts are literals; no host hash and no local class may leak in.
for (const name of Object.values(HOST_ATTRIBUTES)) {
  if (!/^data-[a-z0-9-]+$/u.test(name)) problems.push(`host attribute "${name}" is not a data attribute`);
}

// The local-name examples the host actually emits, including the two shapes
// where the hash contains the underscore or starts with a digit.
const examples = new Map([
  ['-l6A3q_root', 'root'],
  ['_77Pn0W_navCell', 'navCell'],
  ['Kjh-qa_searchExpanded', 'searchExpanded'],
  ['_itemWrap_smoke_1', 'itemWrap'],
  ['G-tjAW_indicator', 'indicator'],
  ['_7lc4_a_balanceCard', 'balanceCard'],
  ['isl-pinnedRow', null],
]);
for (const [token, expected] of examples) {
  const actual = localClassName(token);
  if (actual !== expected) problems.push(`localClassName(${JSON.stringify(token)}) returned ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
}

if (problems.length > 0) {
  console.error(`check:parts failed:\n- ${problems.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`check:parts ok (${defined.length} parts, ${PART_REGIONS.length} regions)`);
}
