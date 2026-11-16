/**
 * Smooth composer caret.
 *
 * A contenteditable caret is painted by the browser, so CSS cannot make it
 * glide. While the setting is on, the stylesheet makes that composer's native
 * caret transparent and this module paints one at the collapsed selection's
 * rect, transitioning `transform` between positions. It is scoped to the
 * conversation composer's `[data-composer-input]`; every other editable field
 * keeps its native caret.
 *
 * Compatibility is read from the composer's own hooks and from other caret
 * plugins' `data-*caret*` markers, never from a DSH release number: a build
 * that stops exposing a positioned anchor inside the scrollport, or a foreign
 * caret in the same area, falls back to the native caret and says so in the
 * matching settings row. Nothing here can turn the skin off.
 *
 * `build.mjs` inlines this file into `client.js` the same way as
 * `src/host/runtime.js`, so it must stay free of template internals: it may
 * only touch the DOM and the attributes it documents below.
 */

/** Storage key for the user's preference; on by default. */
export const SMOOTH_CARET_KEY = 'dsh-islands-ui:smooth-caret';
/** Set on `<body>` while the overlay owns the composer caret. */
export const SMOOTH_CARET_ATTR = 'data-islands-smooth-caret';
/** Marks the composer input whose caret the overlay is currently painting. */
export const CARET_ACTIVE_ATTR = 'data-islands-caret-active';
/** The skin's own body attribute; mirrors `SKIN_ATTR` in `./runtime.js`. */
const CARET_SKIN_ATTR = 'data-islands-ui';
const COMPOSER_INPUT_SELECTOR = '[data-composer-input]';
const COMPOSER_SCROLL_SELECTOR = '[data-input-scroll]';
/** The composer card scopes foreign-caret detection to the caret area. */
const COMPOSER_CARD_SELECTOR = '[data-composer-card]';

export function readSmoothCaretSetting() {
  try {
    const stored = window.localStorage.getItem(SMOOTH_CARET_KEY);
    return stored === null ? true : stored === '1';
  } catch {
    return true;
  }
}

/** The user's preference, kept across incompatible builds and foreign carets. */
let smoothCaret = readSmoothCaretSetting();

/**
 * Caret-specific compatibility. This is intentionally separate from the
 * global shell gate: an incompatible composer, or another caret plugin on
 * the same composer, must disable only the smooth caret (and explain
 * itself in the settings row), never the whole skin.
 */
let caretCompat = { status: 'unknown', missing: [] };
const caretCompatListeners = new Set();
let caretProbeInput = null;
let caretForeignObserver = null;
let caretForeignScope = null;

export function subscribeCaretCompat(listener) {
  caretCompatListeners.add(listener);
  return () => caretCompatListeners.delete(listener);
}

export function getCaretCompatSnapshot() {
  return caretCompat;
}


function setCaretCompat(next) {
  if (
    next.status === caretCompat.status &&
    next.missing.length === caretCompat.missing.length &&
    next.missing.every((value, index) => value === caretCompat.missing[index])
  ) {
    return;
  }
  caretCompat = next;
  for (const listener of caretCompatListeners) listener();
  // The user's preference is kept; an incompatible build or a foreign caret
  // taker only suppresses the effective state, so the caret returns later.
  applySmoothCaretSetting();
  syncCaretOverlay();
}

function smoothCaretActive() {
  return smoothCaret && caretCompat.status !== 'missing' && caretCompat.status !== 'yielded';
}

function applySmoothCaretSetting() {
  const body = document.body;
  if (body === null) return;
  if (smoothCaretActive()) body.setAttribute(SMOOTH_CARET_ATTR, '');
  else body.removeAttribute(SMOOTH_CARET_ATTR);
}

export function setSmoothCaret(next) {
  smoothCaret = next === true;
  try {
    window.localStorage.setItem(SMOOTH_CARET_KEY, smoothCaret ? '1' : '0');
  } catch {
    /* private mode: the choice still applies for this page. */
  }
  applySmoothCaretSetting();
  syncCaretOverlay();
}

/** A foreign caret marker is any `data-*caret*` attribute outside our own namespace. */
function foreignCaretAttribute(element) {
  for (const attribute of element.attributes) {
    const name = attribute.name.toLowerCase();
    if (!name.startsWith('data-') || name.startsWith('data-islands-')) continue;
    if (name.includes('caret')) return true;
  }
  return false;
}

/**
 * Whether the composer area already carries another caret plugin's marker.
 * Scoped to the composer card/scrollport so unrelated fields elsewhere in
 * the app cannot make the smooth caret yield.
 */
function foreignCaretIn(scope) {
  if (!(scope instanceof Element)) return false;
  if (foreignCaretAttribute(scope)) return true;
  for (const element of scope.querySelectorAll('*')) {
    if (foreignCaretAttribute(element)) return true;
  }
  return false;
}

function caretScopeFor(input) {
  return (
    input.closest(COMPOSER_CARD_SELECTOR) ??
    input.closest(COMPOSER_SCROLL_SELECTOR) ??
    input.parentElement
  );
}

function caretMutationRelevant(records) {
  for (const record of records) {
    if (record.type === 'attributes') {
      const name = (record.attributeName ?? '').toLowerCase();
      if (name.startsWith('data-') && name.includes('caret') && !name.startsWith('data-islands-')) return true;
      continue;
    }
    if (record.type !== 'childList') continue;
    for (const node of record.addedNodes) {
      if (node instanceof Element && foreignCaretIn(node)) return true;
    }
    for (const node of record.removedNodes) {
      if (node instanceof Element && foreignCaretIn(node)) return true;
    }
  }
  return false;
}

/**
 * Watch the composer area for a foreign caret appearing or leaving. This is
 * what lets islands-ui yield only its own caret, and pick its caret back up
 * when the other plugin is disabled, without turning any other feature off.
 */
function observeForeignCaret(scope) {
  if (typeof MutationObserver !== 'function' || caretForeignScope === scope) return;
  caretForeignObserver?.disconnect();
  caretForeignScope = scope;
  if (!(scope instanceof Element)) return;
  if (caretForeignObserver === null) {
    caretForeignObserver = new MutationObserver((records) => {
      if (caretMutationRelevant(records)) probeCaretCompatibility();
    });
  }
  caretForeignObserver.observe(scope, { childList: true, subtree: true, attributes: true });
}

/**
 * Caret-specific compatibility probe. The global gate protects the shell;
 * this only decides whether the smooth overlay can trust the composer. It
 * checks the public composer hooks the overlay relies on — a positioned
 * anchor inside the scrollport — never a release number and never a
 * CSS-module class name. A foreign caret in the composer area becomes a
 * 'yielded' status rather than a skin failure.
 */
export function probeCaretCompatibility() {
  const missing = [];
  const input = document.querySelector(COMPOSER_INPUT_SELECTOR);
  let foreign = false;
  if (input !== null) {
    const scroll = input.closest(COMPOSER_SCROLL_SELECTOR);
    if (scroll === null) missing.push('composer-scroll');
    const anchor = caretAnchorFor(input);
    if (
      anchor === null ||
      anchor === scroll ||
      window.getComputedStyle(anchor).position === 'static' ||
      (scroll !== null && !scroll.contains(anchor))
    ) {
      missing.push('composer-anchor');
    }
    const scope = caretScopeFor(input);
    observeForeignCaret(scope);
    foreign = foreignCaretIn(scope);
  } else {
    observeForeignCaret(null);
  }
  // With no composer mounted the structure cannot be judged; leave the
  // switch usable and probe again when the composer appears.
  const status =
    missing.length > 0 ? 'missing' : input === null ? 'unknown' : foreign ? 'yielded' : 'ok';
  setCaretCompat({ status, missing: foreign && missing.length === 0 ? ['foreign-caret'] : missing });
}

/** Skip repeated probes while the same composer is known-good. */
export function maybeProbeCaretCompatibility() {
  const input = document.querySelector(COMPOSER_INPUT_SELECTOR);
  if (input !== null && input === caretProbeInput && caretCompat.status === 'ok') return;
  caretProbeInput = input;
  probeCaretCompatibility();
}

/* ---- Smooth composer caret -------------------------------------------
   A contenteditable caret is painted by the browser, so CSS cannot make it
   glide. With the setting on, the native caret is made transparent by the
   stylesheet and this controller paints one at the collapsed selection's
   rect, transitioning `transform` between positions. It is scoped to the
   conversation composer's `[data-composer-input]`; every other editable
   field keeps its native caret. */
let caretInstalled = false;
let caretElement = null;
let caretAnchor = null;
let caretInput = null;
let caretResize = null;
let caretResizeInput = null;
let caretObserver = null;
let caretFrame = 0;
let caretJumpFrame = 0;
let caretIdleTimer = 0;
let caretLastX = Number.NaN;
let caretLastY = Number.NaN;

/** Nearest positioned ancestor of the contenteditable (the composer's wrapper). */
function caretAnchorFor(input) {
  let node = input.parentElement;
  while (node !== null && node !== document.body) {
    if (window.getComputedStyle(node).position !== 'static') return node;
    node = node.parentElement;
  }
  return input.parentElement;
}

function hideCaret() {
  if (caretElement !== null) caretElement.classList.remove('is-on', 'is-typing');
  if (caretIdleTimer !== 0) {
    window.clearTimeout(caretIdleTimer);
    caretIdleTimer = 0;
  }
  if (caretInput !== null) caretInput.removeAttribute(CARET_ACTIVE_ATTR);
  caretLastX = Number.NaN;
  caretLastY = Number.NaN;
}

/** Hold the blink while the caret moves; resume it after a short idle. */
function markCaretMoving() {
  if (caretElement === null) return;
  const element = caretElement;
  element.classList.add('is-typing');
  if (caretIdleTimer !== 0) window.clearTimeout(caretIdleTimer);
  caretIdleTimer = window.setTimeout(() => {
    caretIdleTimer = 0;
    if (caretElement === element) element.classList.remove('is-typing');
  }, 260);
}

function dropCaret() {
  hideCaret();
  if (caretElement !== null) caretElement.remove();
  caretElement = null;
  caretAnchor = null;
  caretInput = null;
  caretResize?.disconnect();
  caretResizeInput = null;
  caretObserver?.disconnect();
}

/** Width/layout changes reflow the draft without a selectionchange. */
function observeCaretInput(input) {
  if (typeof ResizeObserver !== 'function' || caretResizeInput === input) return;
  if (caretResize === null) caretResize = new ResizeObserver(onCaretChange);
  caretResize.disconnect();
  caretResize.observe(input);
  caretResizeInput = input;
}

/**
 * React owns the wrapper's children. If a re-render ever drops our overlay,
 * the input's transparent native caret would otherwise stay invisible until
 * the next keystroke; re-create it on the next frame instead.
 */
function observeCaretHost(anchor) {
  if (typeof MutationObserver !== 'function') return;
  if (caretObserver === null) {
    caretObserver = new MutationObserver(() => {
      if (caretElement !== null && !caretElement.isConnected) scheduleCaretPaint();
    });
  }
  caretObserver.disconnect();
  caretObserver.observe(anchor, { childList: true });
}

function ensureCaret(input) {
  if (caretElement !== null && caretInput === input && caretElement.isConnected) return caretElement;
  dropCaret();
  const anchor = caretAnchorFor(input);
  if (anchor === null) return null;
  const element = document.createElement('span');
  element.className = 'isl-caret';
  element.dataset.islandsCaret = '';
  element.setAttribute('aria-hidden', 'true');
  anchor.append(element);
  caretElement = element;
  caretAnchor = anchor;
  caretInput = input;
  observeCaretInput(input);
  observeCaretHost(anchor);
  return element;
}

/**
 * Caret geometry in viewport coordinates. Some collapsed ranges report no
 * rect at all — an empty paragraph, or a caret sitting on a soft `<br>`
 * line — so the child at the range offset supplies the glyph box, and the
 * editable root is the last resort. The caret is as tall as the text, not
 * the line box, so it reads like a native caret.
 */
function measureCaret(input) {
  const selection = window.getSelection();
  if (selection === null || selection.rangeCount === 0 || !selection.isCollapsed) return null;
  const range = selection.getRangeAt(0);
  if (!input.contains(range.commonAncestorContainer)) return null;
  const style = window.getComputedStyle(input);
  const lineHeight = Number.parseFloat(style.lineHeight);
  const rects = range.getClientRects();
  let rect = rects.length > 0 ? rects[rects.length - 1] : range.getBoundingClientRect();
  let fallbackBlock = false;
  let emptySurface = false;
  if (rect.width === 0 && rect.height === 0) {
    const node = range.startContainer;
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    let candidate = null;
    if (node.nodeType === Node.ELEMENT_NODE) {
      const children = node.childNodes;
      const at = range.startOffset;
      for (const index of [at, at - 1]) {
        const child = children[index];
        if (child === undefined || child.nodeType !== Node.ELEMENT_NODE) continue;
        const childRect = child.getBoundingClientRect();
        if (childRect.width !== 0 || childRect.height !== 0) {
          candidate = childRect;
          break;
        }
      }
    }
    if (candidate !== null) {
      rect = candidate;
    } else {
      const block = element?.closest('p, li, blockquote, h1, h2, h3, h4, h5, h6') ?? input.firstElementChild ?? input;
      rect = block.getBoundingClientRect();
      fallbackBlock = true;
      emptySurface = block === input;
    }
  }
  if (rect.width === 0 && rect.height === 0) return null;
  const lineBox = Number.isFinite(lineHeight) && lineHeight > 0 ? lineHeight : Math.max(rect.height, 16);
  const fontSize = Number.parseFloat(style.fontSize);
  const fontHeight = Number.isFinite(fontSize) && fontSize > 0 ? fontSize * 1.2 : 16;
  // The caret matches the text height, not the line box: use the glyph box
  // the browser reported when it is smaller than the line box, otherwise
  // the font's own height.
  const glyphHeight = rect.height > 0 && rect.height < lineBox ? rect.height : fontHeight;
  const height = Math.max(1, Math.min(glyphHeight, lineBox));
  let left = rect.left;
  let top;
  if (emptySurface) {
    // An empty Lexical surface has no paragraph at all: its selection sits
    // on the editable root, so align with the padding box the placeholder
    // uses instead of the input's border box.
    left += (Number.parseFloat(style.paddingLeft) || 0) + input.clientLeft;
    const lineTop = rect.top + (Number.parseFloat(style.paddingTop) || 0) + input.clientTop;
    top = lineTop + (lineBox - height) / 2;
  } else if (fallbackBlock) {
    // The block's rect starts at its first line box, not at a glyph box.
    top = rect.top + (lineBox - height) / 2;
  } else {
    // Glyph/candidate box: keep the caret inside that box.
    top = rect.top + (rect.height - height) / 2;
  }
  return { left, top, height };
}

function paintCaret() {
  caretFrame = 0;
  if (!caretInstalled || !smoothCaretActive() || document.body?.hasAttribute(CARET_SKIN_ATTR) !== true) {
    dropCaret();
    return;
  }
  const input = document.activeElement;
  if (
    !(input instanceof HTMLElement) ||
    !input.matches(COMPOSER_INPUT_SELECTOR) ||
    !document.hasFocus()
  ) {
    // The composer may have unmounted between events; drop the overlay and
    // its references with it instead of retaining a detached subtree.
    if (caretElement !== null && !caretElement.isConnected) dropCaret();
    else hideCaret();
    return;
  }
  // IME composition and selected command chips hide the native caret in the
  // stock composer; the overlay defers to the same states. The workspace
  // trigger is a focusable but non-editable div, so it gets no caret either.
  if (
    !input.isContentEditable ||
    input.getAttribute('aria-disabled') === 'true' ||
    input.hasAttribute('data-composer-composing') ||
    input.hasAttribute('data-composer-chip-selected')
  ) {
    hideCaret();
    return;
  }
  const measurement = measureCaret(input);
  if (measurement === null) {
    hideCaret();
    return;
  }
  const element = ensureCaret(input);
  if (element === null || caretAnchor === null) {
    hideCaret();
    return;
  }
  const anchorRect = caretAnchor.getBoundingClientRect();
  // The overlay is positioned against the anchor's padding box; subtract
  // its border so a bordered wrapper still lines up.
  const x = measurement.left - anchorRect.left - caretAnchor.clientLeft;
  const y = measurement.top - anchorRect.top - caretAnchor.clientTop;
  const changed =
    Number.isNaN(caretLastX) || Math.abs(x - caretLastX) > 0.1 || Math.abs(y - caretLastY) > 0.1;
  // Glide along a line; a vertical move is a line change, where a diagonal
  // slide would read as noise. The first placement also jumps into place.
  // 2px absorbs sub-pixel differences between the empty-surface and glyph
  // paths without hiding a real 24px line step.
  const lineChanged = !Number.isNaN(caretLastY) && Math.abs(y - caretLastY) > 2;
  const jumped = Number.isNaN(caretLastX) || lineChanged;
  caretLastX = x;
  caretLastY = y;
  element.style.height = `${measurement.height}px`;
  if (jumped) {
    element.classList.add('is-jump');
    if (caretJumpFrame !== 0) cancelAnimationFrame(caretJumpFrame);
    caretJumpFrame = requestAnimationFrame(() => {
      caretJumpFrame = 0;
      if (caretElement === element) element.classList.remove('is-jump');
    });
  } else {
    element.classList.remove('is-jump');
  }
  element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  input.setAttribute(CARET_ACTIVE_ATTR, '');
  if (changed) markCaretMoving();
  element.classList.add('is-on');
}

function scheduleCaretPaint() {
  if (!caretInstalled || caretFrame !== 0) return;
  caretFrame = requestAnimationFrame(paintCaret);
}

export function syncCaretOverlay() {
  if (!caretInstalled) return;
  if (!smoothCaretActive() || document.body?.hasAttribute(CARET_SKIN_ATTR) !== true) {
    dropCaret();
    return;
  }
  scheduleCaretPaint();
}

function onCaretChange() {
  maybeProbeCaretCompatibility();
  scheduleCaretPaint();
}

export function installCaretController() {
  if (caretInstalled) return;
  caretInstalled = true;
  probeCaretCompatibility();
  applySmoothCaretSetting();
  document.addEventListener('selectionchange', onCaretChange);
  document.addEventListener('focusin', onCaretChange);
  document.addEventListener('focusout', onCaretChange);
  document.addEventListener('input', onCaretChange, true);
  document.addEventListener('keyup', onCaretChange, true);
  document.addEventListener('mouseup', onCaretChange, true);
  document.addEventListener('compositionstart', onCaretChange, true);
  document.addEventListener('compositionend', onCaretChange, true);
  document.addEventListener('scroll', onCaretChange, true);
  document.addEventListener('visibilitychange', onCaretChange);
  window.addEventListener('resize', onCaretChange, { passive: true });
  // Cmd-Tab can deactivate the window without a DOM focus event; the paint
  // hides the overlay and restores it when the window comes back.
  window.addEventListener('blur', onCaretChange);
  window.addEventListener('focus', onCaretChange);
  scheduleCaretPaint();
}

export function uninstallCaretController() {
  if (!caretInstalled) return;
  caretInstalled = false;
  document.removeEventListener('selectionchange', onCaretChange);
  document.removeEventListener('focusin', onCaretChange);
  document.removeEventListener('focusout', onCaretChange);
  document.removeEventListener('input', onCaretChange, true);
  document.removeEventListener('keyup', onCaretChange, true);
  document.removeEventListener('mouseup', onCaretChange, true);
  document.removeEventListener('compositionstart', onCaretChange, true);
  document.removeEventListener('compositionend', onCaretChange, true);
  document.removeEventListener('scroll', onCaretChange, true);
  document.removeEventListener('visibilitychange', onCaretChange);
  window.removeEventListener('resize', onCaretChange);
  window.removeEventListener('blur', onCaretChange);
  window.removeEventListener('focus', onCaretChange);
  if (caretFrame !== 0) {
    cancelAnimationFrame(caretFrame);
    caretFrame = 0;
  }
  if (caretJumpFrame !== 0) {
    cancelAnimationFrame(caretJumpFrame);
    caretJumpFrame = 0;
  }
  caretResize?.disconnect();
  caretResize = null;
  caretResizeInput = null;
  caretObserver?.disconnect();
  caretObserver = null;
  caretForeignObserver?.disconnect();
  caretForeignObserver = null;
  caretForeignScope = null;
  dropCaret();
}