import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HOST, HOST_ATTRIBUTES, PART_REGIONS, localClassName, partNames,
} from '../src/host/runtime.js';

test('localClassName keeps only the local segment', () => {
  const cases = [
    ['-l6A3q_root', 'root'],
    ['_77Pn0W_navCell', 'navCell'],
    ['Kjh-qa_searchExpanded', 'searchExpanded'],
    ['_itemWrap_smoke_1', 'itemWrap'],
    ['G-tjAW_indicator', 'indicator'],
    ['_7lc4_a_balanceCard', 'balanceCard'],
    ['PIRFFq_frame', 'frame'],
    ['isl-pinnedRow', null],
    ['root', null],
  ];
  for (const [token, expected] of cases) {
    assert.equal(localClassName(token), expected, token);
  }
});

test('the host contract table contains no hashed class names', () => {
  for (const value of Object.values(HOST)) {
    assert.doesNotMatch(value, /\.[A-Za-z0-9-]+_[A-Za-z0-9_-]+/u, value);
    assert.ok(!value.includes('[class*='), value);
  }
});

test('part names are unique kebab-case words', () => {
  const all = partNames();
  assert.ok(all.length > 0);
  for (const name of all) assert.match(name, /^[a-z][a-z0-9-]*$/u);
  for (const region of PART_REGIONS) {
    for (const [local, part] of Object.entries(region.parts)) {
      assert.match(local, /^[a-z][A-Za-z0-9]*$/u, `${region.id}:${local}`);
      assert.doesNotMatch(part, /[A-Z_]/u, `${region.id}:${part}`);
    }
  }
});

test('host attributes are data attributes', () => {
  for (const name of HOST_ATTRIBUTES) assert.match(name, /^data-[a-z0-9-]+$/u);
});
