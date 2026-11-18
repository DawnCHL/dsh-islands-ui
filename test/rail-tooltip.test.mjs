import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

/** The one rule for a selector that also contains `marker`. */
function rule(css, selector, marker) {
  let from = 0;
  for (;;) {
    const at = css.indexOf(selector, from);
    assert.notEqual(at, -1, `${selector} rule containing ${marker}`);
    const open = css.indexOf('{', at);
    const close = css.indexOf('}', open);
    const block = css.slice(at, close + 1);
    if (block.includes(marker)) return block;
    from = close + 1;
  }
}

test('rail labels are a skin pill, never a native title tooltip', async () => {
  const source = await read('src/client.template.js');
  const tile = source.slice(
    source.indexOf('const button = (id, label, glyph'),
    source.indexOf('const menuNode = menu !== null'),
  );
  assert.ok(tile.includes('tip.show'), 'the tiles feed the hover label');
  // The tiles keep their accessible name only: a native tooltip would pop a
  // second, unstyled label next to the skin's own.
  assert.doesNotMatch(tile, /title:/u);
  assert.match(source, /'aria-label': label,/u);
  assert.match(source, /function useRailTip/u);
  // The rail clips horizontally, so the pill has to leave the rail.
  assert.match(source, /ReactDOM\.createPortal/u);
  assert.match(source, /className: 'isl-railTip'/u);
  assert.match(source, /'aria-hidden': true,/u);
  // Parked just right of the tile, vertically centred on it.
  assert.match(source, /const left = Math\.round\(rect\.right\) \+ 8/u);
  assert.match(source, /const top = Math\.round\(rect\.top \+ rect\.height \/ 2\)/u);
  // Hover waits, a second tile swaps in place, keyboard focus shows at once.
  assert.match(source, /const RAIL_TIP_DELAY_MS = 340/u);
  assert.match(source, /if \(immediate \|\| shownRef\.current\) place\(node, label\)/u);
  assert.match(source, /matches\(':focus-visible'\)/u);
  // Anything that moves the tile re-parks the pill instead of evicting it.
  assert.match(source, /addEventListener\('scroll', sync, true\)/u);
  assert.match(source, /addEventListener\('resize', sync\)/u);
});

test('the pill is fixed, token-driven and click-through', async () => {
  const css = await read('src/16-rail.css');
  const tip = rule(css, '.isl-railTip {', 'position: fixed');
  assert.match(tip, /z-index: 1200/u);
  assert.match(tip, /pointer-events: none/u);
  assert.match(tip, /background: var\(--isl-tooltip-bg\)/u);
  assert.match(tip, /color: var\(--isl-tooltip-fg\)/u);
  assert.match(tip, /box-shadow:[^;]*var\(--isl-tooltip-ring\)/u);
  assert.match(tip, /transform: translateY\(-50%\)/u);
  assert.match(tip, /white-space: nowrap/u);
  assert.match(tip, /animation: isl-rail-tip-in/u);
  assert.match(css, /@keyframes isl-rail-tip-in/u);
});

test('the pill has its own light and dark palette', async () => {
  const tokens = await read('src/00-tokens.css');
  const light = tokens.slice(0, tokens.indexOf('[data-ds-dark-theme]'));
  assert.match(light, /--isl-tooltip-bg: #17181b/u);
  assert.match(light, /--isl-tooltip-fg: #ffffff/u);

  const dark = tokens.slice(tokens.indexOf('[data-ds-dark-theme]'));
  assert.match(dark, /--isl-tooltip-bg: #2c2d31/u);
  assert.match(dark, /--isl-tooltip-fg: #f4f5f7/u);
  assert.match(dark, /--isl-tooltip-ring: rgba\(255, 255, 255, 0\.09\)/u);
});
