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

test('the update entry is a 30px disc centred in the rail column', async () => {
  const css = await read('src/17-update.css');
  const button = rule(css, '.isl-updateButton {', 'position: fixed');
  assert.match(button, /width: 30px;/u);
  assert.match(button, /height: 30px;/u);
  // Centred on the 48px column, not merely shrunk in place.
  assert.match(button, /left: calc\(var\(--isl-gap\) \+ \(var\(--isl-rail-width\) - 30px\) \/ 2\);/u);
  // Still stacked one gap above the 36px gear tile.
  assert.match(button, /var\(--isl-foot-height, 36px\) \+ var\(--isl-foot-gap\) \+ 36px \+ var\(--isl-update-gap\)/u);
});

test('the busy states draw a ring instead of the dot matrix', async () => {
  const css = await read('src/17-update.css');
  assert.doesNotMatch(css, /isl-dmx/u);

  const ring = rule(css, '.isl-updateRing {', 'position: absolute');
  assert.match(ring, /inset: -1px;/u, 'the ring covers the 1px border, so r=14 meets the disc edge');
  assert.match(rule(css, '.isl-updateRingBar {', 'stroke:'), /stroke-linecap: round;/u);
  assert.match(css, /@keyframes isl-update-ring-sweep/u);
  assert.match(css, /@keyframes isl-update-ring-breathe/u);
  // Steady while verifying, faster plus breathing while installing.
  assert.match(rule(css, '.isl-updateRing.is-verify .isl-updateRingBar {', 'animation:'), /1\.6s linear infinite/u);
  assert.match(rule(css, '.isl-updateRing.is-install .isl-updateRingBar {', 'animation:'), /0\.9s linear infinite/u);

  // Reduced motion keeps a static quarter arc rather than dropping the state.
  const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(reduced, /isl-updateRing\.is-install \.isl-updateRingBar/u);
  assert.match(reduced, /stroke-dasharray: 24 76;/u);
});

test('the ring is driven by the host percentage', async () => {
  const source = await read('src/client.template.js');

  // `pathLength="100"` turns the dash into a percentage, so no arc maths.
  assert.match(source, /function UpdateRing\(\{ phase, percent \}\)/u);
  assert.match(source, /pathLength: 100/u);
  assert.match(source, /strokeDasharray: indeterminate \? undefined : `\$\{percent\} \$\{100 - percent\}`/u);

  // Clamped, and absence falls back to the indeterminate sweep instead of 0%.
  const helper = source.slice(source.indexOf('function updatePercent'), source.indexOf('function UpdateRing'));
  assert.match(helper, /Number\.isFinite/u);
  assert.match(helper, /Math\.max\(0, Math\.min\(100, Math\.round\(raw\)\)\)/u);
  assert.match(source, /updateDownloadingPlain/u);
  assert.match(source, /const percent = updatePercent\(state\);/u);
  assert.match(source, /percent === null\s*\n?\s*\?\s*copy\.updateDownloadingPlain/u);

  // The busy phases keep the disc and let the ring carry the state.
  assert.match(source, /const ringed = phase === 'downloading' \|\| phase === 'verifying' \|\| phase === 'installing';/u);
  assert.match(source, /ringed \? h\(UpdateRing, \{ phase, percent \}\) : null/u);
  assert.match(source, /h\(UpdateGlyph, \{ phase, size: ringed \? 14 : 16 \}\)/u);

  // A download in flight is the ring alone; a failed update offers the
  // download icon again because the click retries the download.
  assert.match(source, /if \(phase === 'downloading'\) return null;/u);
  assert.match(source, /if \(phase === 'available' \|\| phase === 'error'\) return h\(DownloadGlyph, \{ size \}\);/u);

  // The mosaic component is gone, not merely unused.
  assert.doesNotMatch(source, /DotMatrixGlyph/u);
});
