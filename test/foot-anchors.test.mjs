import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

/** Every rule that starts with `selector`, without nesting. */
function blocks(css, selector) {
  const found = [];
  let from = 0;
  for (;;) {
    const at = css.indexOf(selector, from);
    if (at === -1) return found;
    const open = css.indexOf('{', at);
    const close = css.indexOf('}', open);
    found.push(css.slice(at, close + 1));
    from = close + 1;
  }
}

/** The one rule for a selector that also contains `marker`. */
function rule(css, selector, marker) {
  const hit = blocks(css, selector).find((block) => block.includes(marker));
  assert.ok(hit, `${selector} rule containing ${marker}`);
  return hit;
}

test('the rail list and the fixed rail chrome derive from the measured foot', async () => {
  const css = await read('src/16-rail.css');

  const rail = rule(css, '.isl-rail {', 'max-height');
  assert.match(rail, /var\(--isl-foot-height, 36px\)/u);
  assert.match(rail, /var\(--isl-foot-gap\)/u);
  assert.doesNotMatch(rail, /112px/u);

  const gear = rule(css, '.isl-railSettings {', 'position: fixed');
  assert.match(gear, /bottom: calc\([^;]*var\(--isl-foot-height, 36px\)/u);
  assert.match(gear, /var\(--isl-foot-gap\)/u);
  assert.doesNotMatch(gear, /bottom: 56px/u);
});

test('the update entry stacks above the gear from the same measurement', async () => {
  const css = await read('src/17-update.css');
  const update = rule(css, '.isl-updateButton {', 'position: fixed');
  assert.match(update, /bottom: calc\([^;]*var\(--isl-foot-height, 36px\)[^;]*\)/su);
  assert.match(update, /var\(--isl-foot-gap\)/u);
  assert.match(update, /var\(--isl-update-gap\)/u);
  assert.doesNotMatch(update, /calc\(56px \+ 36px \+ 8px\)/u);
});

test('the foot tokens exist in the token layer', async () => {
  const css = await read('src/00-tokens.css');
  assert.match(css, /--isl-foot-gap:\s*20px/u);
  assert.match(css, /--isl-update-gap:\s*8px/u);
});

test('footer actions normalize guest controls into a rail tile', async () => {
  const css = await read('src/20-sidebar.css');
  const tile = rule(
    css,
    `[data-islands-part~="footer-actions"] > [data-slot="sidebar.footer.action"] > :is(button, a, [role='button'])`,
    'width: 36px !important',
  );
  // The host wraps every slot outlet in a display:contents anchor, so the
  // guest is that anchor's child, not a direct child of footer-actions.
  assert.match(tile, /\[data-slot="sidebar\.footer\.action"\]/u);
  // The raw direct-child path stays as a fallback for a shell without it.
  assert.match(tile, /\[data-islands-part~="footer-actions"\] > :is\(button/u);
  assert.match(tile, /box-sizing: border-box !important/u);
  assert.match(tile, /max-width: 36px !important/u);
  assert.match(tile, /max-height: 36px !important/u);
  assert.match(tile, /overflow: clip !important/u);
  assert.doesNotMatch(tile, /display: (?:none|flex|grid) !important/u);

  const label = rule(
    css,
    `[data-islands-part~="footer-actions"] > [data-slot="sidebar.footer.action"] > :is(button, a, [role='button']):has(svg, img) > span:not(:has(*))`,
    'clip: rect',
  );
  assert.match(label, /position: absolute !important/u);
  assert.doesNotMatch(label, /display: none/u);

  // The inline `background: transparent` most plugins write would erase a
  // plain hover rule, so the guest states must be important too.
  const hover = rule(
    css,
    `[data-islands-part~="footer-actions"] > [data-slot="sidebar.footer.action"] > :is(button, a, [role='button']):hover,`,
    'background',
  );
  assert.match(hover, /background: var\(--isl-hover\) !important/u);
});

test('a guest anchor beside the account stacks as a rail tile', async () => {
  const css = await read('src/20-sidebar.css');
  const row = rule(
    css,
    `[data-islands-part~="settings-trigger-row"]:has(> a) {`,
    'flex-direction: column',
  );
  assert.match(row, /width: auto/u);
  assert.match(row, /height: auto/u);
  assert.match(row, /gap: 2px/u);

  const guest = rule(css, `[data-islands-part~="settings-trigger-row"] > a {`, 'order: -1');
  assert.match(guest, /box-sizing: border-box !important/u);
  assert.match(guest, /width: 36px !important/u);
  assert.match(guest, /height: 36px !important/u);
  assert.match(guest, /margin: 3px 0 !important/u);
  assert.match(guest, /overflow: clip !important/u);
});

test('the foot measure publishes a body property and cleans it up', async () => {
  const source = await read('src/host/foot.js');
  assert.match(source, /export function installFootMeasure/u);
  assert.match(source, /--isl-foot-height/u);
  assert.match(source, /ResizeObserver/u);
  assert.match(source, /height === 0/u);
  assert.match(source, /body\.style\.setProperty\(FOOT_HEIGHT_PROPERTY/u);
  assert.match(source, /body\.style\.removeProperty\(FOOT_HEIGHT_PROPERTY\)/u);
});
