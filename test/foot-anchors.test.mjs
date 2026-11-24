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
  assert.match(css, /--isl-rail-width:\s*48px/u);
  assert.match(css, /--isl-rail-collapsed-width:\s*var\(--isl-rail-width\)/u);
  assert.match(css, /--isl-update-gap:\s*8px/u);
});

test('the collapsed frame track uses the rail token', async () => {
  const css = await read('src/10-shell.css');
  const frame = rule(
    css,
    `[data-islands-part~="layout-frame"]:not(`,
    'var(--isl-rail-collapsed-width)',
  );
  assert.match(frame, /grid-template-columns/u);
  assert.match(frame, /!important/u);
});

test('footer actions normalize guest controls into a rail tile', async () => {
  const css = await read('src/20-sidebar.css');
  const tile = rule(
    css,
    `[data-islands-part~="sidebar-collapsed"] [data-islands-part~="footer-actions"] > [data-slot="sidebar.footer.action"] > :is(button, a, [role='button'])`,
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
    `[data-islands-part~="sidebar-collapsed"] [data-islands-part~="footer-actions"] > [data-slot="sidebar.footer.action"] > :is(button, a, [role='button']):has(svg, img) > span:not(:has(*))`,
    'clip: rect',
  );
  assert.match(label, /position: absolute !important/u);
  assert.doesNotMatch(label, /display: none/u);

  // The inline `background: transparent` most plugins write would erase a
  // plain hover rule, so the guest states must be important too.
  const hover = rule(
    css,
    `[data-islands-part~="sidebar-collapsed"] [data-islands-part~="footer-actions"] > [data-slot="sidebar.footer.action"] > :is(button, a, [role='button']):hover,`,
    'background',
  );
  assert.match(hover, /background: var\(--isl-hover\) !important/u);
});

test('the expanded footer is a wide seat at the bottom of the workspace', async () => {
  const css = await read('src/20-sidebar.css');

  const wrapper = rule(css, `[data-islands-part~="foot-area"] {`, 'display: contents');
  assert.match(wrapper, /display: contents/u);

  const settings = rule(css, `[data-islands-part~="settings-area"] {`, 'grid-area: 4 / 1');
  assert.match(settings, /grid-area: 4 \/ 1/u);
  assert.match(settings, /display: flex/u);

  const region = rule(css, `[data-islands-part~="region-area"] {`, 'grid-area: 3 / 2 / 5 / 3');
  assert.match(region, /grid-area: 3 \/ 2 \/ 5 \/ 3/u);

  const seat = rule(css, `[data-islands-part~="footer-actions"] {`, 'grid-area: 5 / 2');
  assert.match(seat, /grid-area: 5 \/ 2/u);
  assert.match(seat, /height: var\(--isl-footer-height, auto\)/u);
  assert.match(seat, /max-height: var\(--isl-footer-max/u);
  // A vertical stack: `wrap` would turn a tall guest into extra columns and
  // push the other guests horizontally out of the island.
  assert.match(seat, /flex-wrap: nowrap/u);
  assert.match(seat, /overflow-x: hidden/u);
  assert.match(seat, /overflow-y: auto/u);
  // A 5px scrollbar inside the 227px seat is noise; the wheel still scrolls.
  assert.match(seat, /scrollbar-width: none/u);
  assert.match(css, /\[data-islands-part~="footer-actions"\]::-webkit-scrollbar \{[\s\S]*?width: 0/u);
  // The separation is a top gap (which also seats the handle), not a border.
  assert.match(seat, /padding: 20px 8px 8px/u);
  // The floor is published by the controller as min(200px, content height);
  // a fixed 200px floor would pad a short guest with blank space.
  assert.match(seat, /min-height: var\(--isl-footer-min, 0px\)/u);
  assert.doesNotMatch(seat, /min-height: min\(200px/u);
  assert.doesNotMatch(seat, /border-top/u);

  // Direct guests are capped to the seat so none of them can widen it.
  const guest = rule(css, `[data-islands-part~="footer-actions"] > *`, 'max-width: 100%');
  assert.match(guest, /min-width: 0/u);
  assert.match(guest, /max-width: 100%/u);
  // A tall guest scrolls instead of being squashed by a fixed seat height.
  assert.match(guest, /flex-shrink: 0/u);

  // The 1.2.2 tile normalization is now the collapsed rail's contract only.
  const tile = rule(
    css,
    `[data-islands-part~="sidebar-collapsed"] [data-islands-part~="footer-actions"] > [data-slot="sidebar.footer.action"] > :is(button, a, [role='button'])`,
    'width: 36px !important',
  );
  assert.match(tile, /width: 36px !important/u);
});

test('collapsing the workspace hides the footer and its handle', async () => {
  const css = await read('src/20-sidebar.css');
  const hide = rule(css, `[data-islands-workspace-collapsed]`, 'footer-actions');
  assert.match(hide, /footer-actions/u);
  assert.match(hide, /display: none !important/u);

  const source = await read('src/host/footer.js');
  assert.match(source, /data-islands-workspace-collapsed/u);
});

test('the workspace footer controller owns collapse, height and the handle', async () => {
  const source = await read('src/host/footer.js');
  assert.match(source, /export function installFooterPanel/u);
  assert.match(source, /data-islands-footer-collapsed/u);
  assert.match(source, /data-islands-footer-empty/u);
  assert.match(source, /--isl-footer-height/u);
  assert.match(source, /--isl-footer-min/u);
  assert.match(source, /--isl-footer-max/u);
  assert.match(source, /localStorage/u);
  assert.match(source, /pointerdown/u);
  assert.match(source, /ResizeObserver/u);
  // Resize lives on a dedicated 5px strip above the bar, outside the click
  // target, so a click cannot be mistaken for a drag.
  assert.match(source, /FOOTER_RESIZE_STRIP = 5/u);
  assert.match(source, /FOOTER_MIN_HEIGHT = 200/u);
  assert.match(source, /FOOTER_MAX_PX = 800/u);
  assert.match(source, /const verticalInset = state\.collapsed \? 1 : 0/u);
  // The click bar uses aria-label only; no native title tooltip.
  assert.doesNotMatch(source, /handle\.title/u);
  assert.match(source, /rect\.top - FOOTER_RESIZE_STRIP/u);
  assert.match(source, /isl-footerResize/u);
  // The seat can be hidden by the empty state while a plugin mounts; content
  // presence must not depend on a rendered box, or the seat never comes back.
  // The host's `display: contents` anchors are transparent: a guest that
  // renders nothing leaves wrappers behind and must not keep the seat open.
  assert.match(source, /export function footerSlotHasContent/u);
  assert.match(source, /seat\.querySelector\(FOOTER_SLOT_SELECTOR\) \?\? seat/u);
  assert.match(source, /display === 'none'/u);
  assert.match(source, /display !== 'contents'/u);
  assert.match(source, /data-sidebar-drawer/u);
  assert.match(source, /transitionend/u);
  assert.match(source, /aria-controls/u);
  assert.match(source, /isl-footer-seat/u);
  assert.match(source, /documentElement\.lang/u);
  assert.match(source, /aria-label/u);
});

test('every [hidden] rule for a footer affordance carries the body prefix', async () => {
  // Comments quote the competing selectors, so strip them before parsing rules.
  const css = (await read('src/20-sidebar.css')).replace(/\/\*[\s\S]*?\*\//gu, '');
  for (const affordance of ['isl-footerHandle', 'isl-footerResize']) {
    const selectors = [...css.matchAll(/([^{}]+)\{/gu)]
      .map((match) => match[1].trim().replace(/\s+/gu, ' '))
      .filter((selector) => selector.includes(`.${affordance}[hidden]`));
    assert.ok(selectors.length > 0, `${affordance}[hidden] rule`);
    for (const selector of selectors) {
      // A bare `[hidden]` rule loses to `body[data-islands-ui] .isl-... {display}`.
      assert.match(selector, /body\[data-islands-ui\] /u, `${affordance}[hidden] needs the body prefix`);
    }
  }
});

test('the rail seat folds guests into one column above the account', async () => {
  const css = await read('src/20-sidebar.css');
  const row = rule(
    css,
    `[data-islands-part~="settings-trigger-row"] {`,
    'flex-direction: column',
  );
  assert.match(row, /width: auto/u);
  assert.match(row, /height: auto/u);
  assert.match(row, /gap: 2px/u);

  const guest = rule(
    css,
    `[data-islands-part~="settings-area"] > [data-slot="sidebar.settings"] > * > :not([data-slot]):not([data-islands-part]):not([role='status']):not([aria-live]) {`,
    'order: -1',
  );
  assert.match(guest, /max-width: 36px/u);
  assert.match(guest, /flex-wrap: wrap/u);
  assert.match(guest, /box-sizing: border-box/u);
  assert.doesNotMatch(css, /:has\(> a\)/u);

  // Icon guests keep the icon and move a leaf label into the a11y tree.
  const guestLabel = rule(
    css,
    `> :not([data-slot]) :is(a, button) > span:not(:has(*)) {`,
    'clip: rect(0 0 0 0)',
  );
  assert.match(guestLabel, /position: absolute !important/u);

  const label = rule(
    css,
    `button[aria-haspopup] > :not(:first-child):not(:has(*)) {`,
    'clip: rect(0 0 0 0)',
  );
  assert.match(label, /position: absolute !important/u);
});

test('the foot measure publishes a body property and cleans it up', async () => {
  const source = await read('src/host/foot.js');
  assert.match(source, /export function installFootMeasure/u);
  assert.match(source, /settings-area/u);
  assert.match(source, /--isl-foot-height/u);
  assert.match(source, /ResizeObserver/u);
  assert.match(source, /height === 0/u);
  assert.match(source, /body\.style\.setProperty\(FOOT_HEIGHT_PROPERTY/u);
  assert.match(source, /body\.style\.removeProperty\(FOOT_HEIGHT_PROPERTY\)/u);
});
