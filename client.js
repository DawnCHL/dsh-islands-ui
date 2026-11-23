/**
 * Browser half of the Islands UI skin.
 *
 * Publishes the stylesheet, marks the host parts, and registers the skin's own
 * chrome. The stylesheet lives in src/*.css, the host bridge and the two DOM
 * controllers in src/host/, and build.mjs inlines all of them — the module
 * loader has no filesystem access, so the built client.js is self-contained.
 */
window.__ModuleLoader__.load({
  id: 'dsh-islands-ui',
  factory(require) {
    const React = require('react');
    const ReactDOM = require('react-dom');
    const h = React.createElement;
    /**
 * Host bridge for Islands UI.
 *
 * Two layers only:
 *   1. HOST holds the literals the host promises (slot anchors, phase marks,
 *      composer marks, row keys, roles). A hashed class name never appears here.
 *   2. PART_REGIONS maps the host's CSS-module local names to the skin's own
 *      part vocabulary. The walker writes those parts onto the element as
 *      `data-islands-part="sidebar-root sidebar-collapsed"`; stylesheets match
 *      one attribute whole with `~=`.
 *
 * The hash segment in `-l6A3q_root` or `_77Pn0W_navCell` is a build artifact.
 * `localClassName` keeps only the local segment, so a host rebuild changes
 * nothing; a host rename stops the mark from being written and the rule goes
 * quiet instead of matching a neighbour.
 *
 * This file is bundled into client.js by build.mjs, which strips the leading
 * `export ` tokens. The same file is imported by scripts/check-*.mjs.
 */

const PART_ATTR = 'data-islands-part';
const SKIN_ATTR = 'data-islands-ui';

/** Host promises, never hashed class names. */
const HOST = Object.freeze({
  ROOT_SLOT: '[data-slot="root"]',
  SIDEBAR_SLOT: '[data-slot="sidebar"]',
  HEADER_SLOT: '[data-slot="conversation.header"]',
  PHASE: '[data-phase]',
  CONVERSATION_SCROLL: '[data-conversation-scroll]',
  CONVERSATION_CONTENT: '[data-conversation-content]',
  COMPOSER_CARD: '[data-composer-card]',
  COMPOSER_SEAT: '[data-composer-seat]',
  COMPOSER_OVERLAY: '[data-composer-overlay]',
  RIGHTBAR_COL: '[data-rightbar-col]',
  RIGHT_PANEL: '[data-sidebar-right-panel]',
  RIGHT_PANEL_OPEN: '[data-sidebar-right-open]',
  SETTINGS_OVERLAY: '[role="presentation"]:has(> [role="dialog"][data-shortcut-modal="settings"])',
  SETTINGS_DIALOG: '[role="dialog"][aria-modal="true"][data-shortcut-modal="settings"]',
  SETTINGS_TRIGGER: '[data-slot="sidebar"] button[aria-haspopup="dialog"]',
  ACCOUNT_TRIGGER: 'button[data-signed-out]',
  SESSION_ROW: '[data-row-key^="session:"]',
  WORKSPACE_ROW: '[data-row-key^="workspace:"]',
  TURN_TRIGGER: '[data-turn-trigger]',
  MENU: '[role="menu"]',
  MENU_MATERIAL: '[data-menu-material]',
  SHELL_BOTTOM: '[data-shell-bottom]',
  SHELL_OVERLAY: '[data-shell-overlay]',
  SHELL_LEADING: '[data-shell-leading]',
  SIDEBAR_MASK: '[data-sidebar-mask]',
  SIDEBAR_TOGGLE: '[data-sidebar-toggle]',
  WIDTH_HANDLE: '[data-width-handle]',
  PLATFORM: '[data-platform]',
  DARK: '[data-ds-dark-theme]',
  WINDOWS_TITLEBAR: '[data-windows-titlebar]',
});

/**
 * Attributes a stylesheet may read. Everything here is either the host's own
 * mark or the skin's; the CSS gate refuses anything else.
 */
const HOST_ATTRIBUTES = Object.freeze([
  'data-slot',
  'data-phase',
  'data-collapsed',
  'data-conversation-scroll',
  'data-conversation-content',
  'data-conversation-tabs',
  'data-conversation-header-corner',
  'data-conversation-region',
  'data-content-phase',
  'data-composer-card',
  'data-composer-seat',
  'data-composer-overlay',
  'data-composer-dock',
  'data-composer-input',
  'data-composer-composing',
  'data-composer-chip-selected',
  'data-input-scroll',
  'data-rightbar-col',
  'data-sidebar-right-panel',
  'data-sidebar-right-open',
  'data-sidebar-right-expand',
  'data-sidebar-right-toggle',
  'data-sidebar-collapsed',
  'data-sidebar-drawer',
  'data-sidebar-toggle',
  'data-sidebar-scrollport',
  'data-sidebar-mask',
  'data-rightbar-collapsed',
  'data-animating',
  'data-dragging',
  'data-side',
  'data-width-handle',
  'data-shell-bottom',
  'data-shell-overlay',
  'data-shell-leading',
  'data-signed-out',
  'data-row-key',
  'data-turn-trigger',
  'data-shortcut-modal',
  'data-menu-material',
  'data-platform',
  'data-windows-titlebar',
  'data-ds-dark-theme',
]);

/** Host-local name: one camelCase word, which is what the host's CSS modules emit. */
const LOCAL_NAME = /^[a-z][A-Za-z0-9]*$/;

/**
 * Extract the local segment from `<hash>_<local>` or `_<hash>_<local>`.
 * The hash may contain an underscore in the trailing form, so the second
 * segment is tried before the last one.
 */
function localClassName(token) {
  const parts = token.split('_');
  if (parts.length < 2) return null;
  const last = parts[parts.length - 1];
  if (parts[0] !== '') return LOCAL_NAME.test(last) ? last : null;
  return LOCAL_NAME.test(parts[1]) ? parts[1]
    : LOCAL_NAME.test(last) ? last : null;
}

/** Selector for one skin part. */
function partSelector(name) {
  return `[${PART_ATTR}~="${name}"]`;
}

/** The shell frame and its three columns. */
const FRAME_PARTS = {
  centerCol: 'center-column',
  sidebarCol: 'sidebar-column',
  mainPanel: 'main-panel',
};

/** The sidebar shell, its workspace browser, its rows and its foot seats. */
const SIDEBAR_PARTS = {
  topStrip: 'sidebar-top-strip',
  logoRow: 'logo-row',
  brand: 'brand-button',
  brandName: 'brand-name',
  brandMark: 'brand-mark',
  localBuildBrand: 'local-build-brand',
  newSessionRow: 'new-session-row',
  newSession: 'new-session',
  newSessionContent: 'new-session-content',
  panelList: 'panel-list',
  panelRow: 'panel-row',
  panelActive: 'panel-active',
  panelEntryActive: 'panel-entry-active',
  panelTitle: 'panel-title',
  regionArea: 'region-area',
  footArea: 'foot-area',
  settingsArea: 'settings-area',
  footerActions: 'footer-actions',
  toggle: 'sidebar-toggle',
  scrollRegion: 'sidebar-scroll-region',
  scrollArea: 'sidebar-scroll-area',
  scrollFade: 'sidebar-scroll-fade',
  sectionHeader: 'section-header',
  sectionLabel: 'section-label',
  list: 'list',
  fade: 'list-fade',
  searchExpanded: 'search-expanded',
  searchButton: 'search-button',
  treeBody: 'tree-body',
  triggerRow: 'settings-trigger-row',
  pinIndicator: 'pin-indicator',
};

/** The conversation header. */
const HEADER_PARTS = {
  header: 'conversation-header',
  headerBlank: 'conversation-header-blank',
  crumb: 'header-crumb',
  headerUtilities: 'header-utilities',
  headerCorner: 'header-corner',
};

/** The hero frame: its headline and workspace chip. */
const HERO_PARTS = {
  headline: 'hero-headline',
  workspace: 'hero-workspace',
};

/** The composer card's own parts. */
const COMPOSER_PARTS = {
  cardWorkspaceTrigger: 'composer-card-workspace-trigger',
  notice: 'composer-notice',
  // The send circle. Its stock fill is an info token the accent does not
  // remap, so the skin reaches it through a part instead of its class name.
  primary: 'composer-primary',
};

/** The conversation body wrapper, which embeds a second conversation. */
const CONTENT_PARTS = {
  embeddedBody: 'embedded-body',
};

/** The settings dialog and its navigation. */
const SETTINGS_PARTS = {
  overlay: 'settings-overlay',
  mask: 'settings-mask',
  balanceCard: 'account-balance-card',
};

/**
 * The dialog's own four seats. These local names (`header`, `options`,
 * `close`, `nav`) are generic enough to appear inside a settings page's
 * content, so they are only read from the dialog's direct children.
 */
const SETTINGS_SHELL_PARTS = {
  navTitle: 'settings-nav-title',
  nav: 'settings-nav',
  header: 'settings-header',
  options: 'settings-options',
};

/** The header's own close control, one level below the header seat. */
const SETTINGS_HEADER_PARTS = {
  close: 'settings-close',
};

/**
 * The navigation's inner parts. `active` is especially common, so this region
 * is anchored to the navigation itself and never sees page content.
 */
const SETTINGS_NAV_PARTS = {
  navList: 'settings-nav-list',
  navCell: 'settings-nav-cell',
  active: 'settings-nav-active',
  navIcon: 'settings-nav-icon',
};

/** The skin's own update entry, read from the host's foot and toggle seats. */
const FOOT_PARTS = {
  indicator: 'update-indicator',
};

/** The account trigger's label, kept out of the generic `label` name. */
const ACCOUNT_PARTS = {
  label: 'account-label',
};

/** The account wrapper inside the settings area: its root and anchor boxes. */
const ACCOUNT_SHELL_PARTS = {
  root: 'account-root',
  anchor: 'account-anchor',
};

/** The settings trigger's label. */
const SETTINGS_TRIGGER_PARTS = {
  triggerLabel: 'settings-trigger-label',
};

/** The sidebar toggle's update badge. */
const TOGGLE_PARTS = {
  badge: 'update-badge',
};

/**
 * Regions, in walk order. `within` is always a host promise or a part the
 * parent region wrote. `rootParts` reads the anchor's direct children; `skip`
 * keeps a region out of a subtree the host mounts inside its own box.
 */
const PART_REGIONS = Object.freeze([
  {
    id: 'frame',
    within: HOST.ROOT_SLOT,
    parts: FRAME_PARTS,
    rootParts: { frame: 'layout-frame' },
  },
  {
    id: 'sidebar',
    within: HOST.SIDEBAR_SLOT,
    parts: SIDEBAR_PARTS,
    rootParts: { root: 'sidebar-root', collapsed: 'sidebar-collapsed' },
  },
  {
    id: 'settings-trigger',
    within: HOST.SETTINGS_TRIGGER,
    parts: SETTINGS_TRIGGER_PARTS,
  },
  {
    id: 'sidebar-foot',
    within: partSelector('foot-area'),
    parts: FOOT_PARTS,
  },
  {
    id: 'account-shell',
    within: partSelector('settings-area'),
    parts: ACCOUNT_SHELL_PARTS,
  },
  {
    id: 'account-trigger',
    within: HOST.ACCOUNT_TRIGGER,
    parts: ACCOUNT_PARTS,
  },
  {
    id: 'sidebar-toggle',
    within: HOST.SIDEBAR_TOGGLE,
    parts: TOGGLE_PARTS,
  },
  {
    id: 'conversation-header',
    within: HOST.HEADER_SLOT,
    parts: HEADER_PARTS,
  },
  {
    id: 'conversation-content',
    within: HOST.CONVERSATION_CONTENT,
    parts: CONTENT_PARTS,
    skip: HOST.CONVERSATION_SCROLL,
  },
  {
    id: 'hero',
    within: '[data-slot="conversation.hero.frame"]',
    parts: HERO_PARTS,
  },
  {
    id: 'composer-card',
    within: HOST.COMPOSER_CARD,
    parts: COMPOSER_PARTS,
  },
  {
    // `panel` is a root part: only the dialog itself may take it. The plugin
    // settings pages also use a local `.panel` for their tab body, and
    // broadcasting the panel part into page content resized that body to the
    // skin's 860px dialog (issue #5, item 2).
    id: 'settings',
    within: HOST.SETTINGS_OVERLAY,
    parts: SETTINGS_PARTS,
    rootParts: { panel: 'settings-panel' },
  },
  {
    // The dialog's seats are direct children. Keeping them as rootParts stops
    // a page's own `.header`, `.options` or `.close` from inheriting them.
    id: 'settings-shell',
    within: partSelector('settings-panel'),
    parts: {},
    rootParts: SETTINGS_SHELL_PARTS,
  },
  {
    // `navCell`/`active`/`navIcon` stay inside the navigation subtree.
    id: 'settings-nav',
    within: partSelector('settings-nav'),
    parts: SETTINGS_NAV_PARTS,
  },
  {
    // The close button sits inside the header, so it gets its own seat.
    id: 'settings-header',
    within: partSelector('settings-header'),
    parts: {},
    rootParts: SETTINGS_HEADER_PARTS,
  },
]);

/** Every part name the table defines. */
function partNames() {
  const names = new Set();
  for (const region of PART_REGIONS) {
    for (const name of Object.values(region.parts)) names.add(name);
    for (const name of Object.values(region.rootParts ?? {})) names.add(name);
  }
  return [...names].sort();
}

/** Compile one region's lookup once. */
function compile(region) {
  return {
    id: region.id,
    within: region.within,
    parts: new Map(Object.entries(region.parts)),
    rootParts: region.rootParts === undefined ? null : new Map(Object.entries(region.rootParts)),
    skip: region.skip ?? null,
  };
}

/** Read the parts one element plays, or null when it plays none. */
function partsOf(element, regions, skipped) {
  if (element.classList.length === 0) return null;
  let parts = null;
  for (const region of regions) {
    if (skipped.has(region.id)) continue;
    const directChild = region.rootParts !== null && element.parentElement !== null
      && element.parentElement.matches(region.within);
    for (const token of element.classList) {
      const local = localClassName(token);
      if (local === null) continue;
      const part = region.parts.get(local) ?? (directChild ? region.rootParts.get(local) : undefined);
      if (part === undefined) continue;
      parts ??= new Set();
      parts.add(part);
    }
  }
  return parts === null ? null : [...parts].sort().join(' ');
}

/** Write one element's parts, or take the attribute off when it plays none. */
function writeParts(element, regions, skipped) {
  const value = partsOf(element, regions, skipped);
  if (value === null) {
    if (element.hasAttribute(PART_ATTR)) element.removeAttribute(PART_ATTR);
    return;
  }
  if (element.getAttribute(PART_ATTR) !== value) element.setAttribute(PART_ATTR, value);
}

/**
 * Install the marking pass: one walk, then an observer for later mounts and
 * class flips. Returns the teardown.
 */
function installParts() {
  if (typeof document === 'undefined' || document.body === null) return () => {};
  const lookups = PART_REGIONS.map(compile);
  const ANCHORS = lookups.map((lookup) => lookup.within).join(',');
  /** Regions in force for a marked element's subtree. */
  const active = new WeakMap();
  let observer = null;

  function inheritedOf(element) {
    for (let parent = element.parentElement; parent !== null; parent = parent.parentElement) {
      const found = active.get(parent);
      if (found !== undefined) return found;
    }
    return { regions: [], skipped: new Set() };
  }

  function mark(element, inherited) {
    const regions = inherited.regions.slice();
    const skipped = new Set(inherited.skipped);
    const enterRegions = () => {
      if (!element.matches(ANCHORS)) return false;
      let entered = false;
      for (const lookup of lookups) {
        if (regions.includes(lookup)) continue;
        if (element.matches(lookup.within)) {
          regions.push(lookup);
          entered = true;
        }
      }
      for (const lookup of regions) {
        if (lookup.skip !== null && element.matches(lookup.skip)) skipped.add(lookup.id);
      }
      return entered;
    };
    enterRegions();
    writeParts(element, regions, skipped);
    // A region may stand on a part the parent region just wrote (the sidebar
    // foot, the settings panel). Reconsider once the mark exists.
    if (enterRegions()) writeParts(element, regions, skipped);
    active.set(element, { regions, skipped });
    for (const child of element.children) mark(child, { regions, skipped });
  }

  function remark(element) {
    const inherited = inheritedOf(element);
    mark(element, inherited);
  }

  function markAdded(node) {
    if (!(node instanceof Element)) return;
    const inherited = inheritedOf(node);
    mark(node, inherited);
  }

  function onMutations(records) {
    for (const record of records) {
      if (record.type === 'childList') {
        for (const node of record.addedNodes) markAdded(node);
        continue;
      }
      if (record.type === 'attributes' && record.target instanceof Element) {
        // A region anchor's class or contract attribute can change the regions
        // in force below it; a plain element's change only rewrites its parts.
        if (record.target.matches(ANCHORS)) markAdded(record.target);
        else remark(record.target);
      }
    }
  }

  function start() {
    active.delete(document.body);
    mark(document.body, { regions: [], skipped: new Set() });
    observer = new MutationObserver(onMutations);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [
        'class',
        'data-phase',
        'data-content-phase',
        'data-sidebar-collapsed',
        'data-sidebar-drawer',
        'data-rightbar-collapsed',
        'data-sidebar-right-open',
        'data-sidebar-toggle',
        'data-signed-out',
        'data-composer-card',
        'data-conversation-scroll',
        'data-turn-trigger',
      ],
    });
  }

  start();

  return () => {
    observer?.disconnect();
    observer = null;
    for (const element of document.querySelectorAll(`[${PART_ATTR}]`)) {
      element.removeAttribute(PART_ATTR);
    }
  };
}
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
const SMOOTH_CARET_KEY = 'dsh-islands-ui:smooth-caret';
/** Set on `<body>` while the overlay owns the composer caret. */
const SMOOTH_CARET_ATTR = 'data-islands-smooth-caret';
/** Marks the composer input whose caret the overlay is currently painting. */
const CARET_ACTIVE_ATTR = 'data-islands-caret-active';
/** The skin's own body attribute; mirrors `SKIN_ATTR` in `./runtime.js`. */
const CARET_SKIN_ATTR = 'data-islands-ui';
const COMPOSER_INPUT_SELECTOR = '[data-composer-input]';
const COMPOSER_SCROLL_SELECTOR = '[data-input-scroll]';
/** The composer card scopes foreign-caret detection to the caret area. */
const COMPOSER_CARD_SELECTOR = '[data-composer-card]';

function readSmoothCaretSetting() {
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

function subscribeCaretCompat(listener) {
  caretCompatListeners.add(listener);
  return () => caretCompatListeners.delete(listener);
}

function getCaretCompatSnapshot() {
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

function setSmoothCaret(next) {
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
function probeCaretCompatibility() {
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
function maybeProbeCaretCompatibility() {
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

function syncCaretOverlay() {
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

function installCaretController() {
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

function uninstallCaretController() {
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
    /**
 * Rail foot measurement.
 *
 * The skin's rail chrome — the settings gear and the desktop update entry —
 * is fixed to the viewport, while the rail's remaining foot seat (settings and
 * the account launcher) stacks upward. Anchoring those controls with constants
 * assumes the foot is always one account row, so a taller settings row either
 * lands under the gear or pushes the account into it. This module measures the
 * marked settings seat and publishes its height as `--isl-foot-height`; the
 * stylesheets derive every anchor from that value.
 *
 * Contributed `sidebar.footer.action` guests no longer sit in this stack: they
 * live at the bottom of the workspace island (see `src/host/footer.js`), so
 * the rail reserve only has to track the settings/account seat.
 *
 * The walker writes the part asynchronously and the sidebar can remount, so
 * the module watches the part attribute; box changes come from the
 * ResizeObserver. It publishes on `requestAnimationFrame` (before paint) and
 * skips identical values, which keeps streaming conversation DOM out of this
 * path.
 *
 * `build.mjs` inlines this file into `client.js` the same way as
 * `src/host/runtime.js`, `src/host/caret.js` and `src/host/footer.js`, so it
 * must stay free of template internals: it may only touch the DOM and the
 * attribute below.
 */

/** The walker's marker for the host's rail foot seat. */
const FOOT_SELECTOR = '[data-islands-part~="settings-area"]';
/** The property the stylesheets read, with the bare-account fallback. */
const FOOT_HEIGHT_PROPERTY = '--isl-foot-height';

/**
 * Start measuring the foot seat.
 *
 * @returns {() => void} teardown, which removes the published property.
 */
function installFootMeasure() {
  if (typeof document === 'undefined' || document.body === null) return () => {};

  const body = document.body;
  let foot = null;
  let frame = 0;
  let published = '';
  let resize = null;

  const publish = () => {
    frame = 0;
    const next = document.querySelector(FOOT_SELECTOR);
    if (next === null) {
      if (foot !== null) {
        resize?.disconnect();
        foot = null;
      }
      if (published !== '') {
        body.style.removeProperty(FOOT_HEIGHT_PROPERTY);
        published = '';
      }
      return;
    }
    if (foot !== next) {
      foot = next;
      resize?.disconnect();
      resize?.observe(foot);
    }
    const height = foot.getBoundingClientRect().height;
    // Windows hides the foot seat when the sidebar collapses. A hidden seat is
    // not an empty stack: keep the stylesheet fallback instead of anchoring
    // the gear to the canvas edge.
    if (height === 0) {
      if (published !== '') {
        body.style.removeProperty(FOOT_HEIGHT_PROPERTY);
        published = '';
      }
      return;
    }
    const value = `${Math.round(height)}px`;
    if (value !== published) {
      body.style.setProperty(FOOT_HEIGHT_PROPERTY, value);
      published = value;
    }
  };

  const schedule = () => {
    if (frame !== 0) return;
    frame = window.requestAnimationFrame(publish);
  };

  if (typeof ResizeObserver === 'function') resize = new ResizeObserver(schedule);

  // A part write means the seat appeared, moved or was replaced. The seat's
  // own box changes are the ResizeObserver's job, so this observer never sees
  // streaming conversation DOM.
  const mutation = new MutationObserver(schedule);
  mutation.observe(body, {
    attributes: true,
    attributeFilter: ['data-islands-part'],
    subtree: true,
  });
  window.addEventListener('resize', schedule);

  publish();

  return () => {
    if (frame !== 0) window.cancelAnimationFrame(frame);
    resize?.disconnect();
    mutation.disconnect();
    window.removeEventListener('resize', schedule);
    body.style.removeProperty(FOOT_HEIGHT_PROPERTY);
  };
}
    /**
 * Workspace footer panel controller.
 *
 * `sidebar.footer.action` is a wide seat at the bottom of the workspace island
 * (see `src/20-sidebar.css`). The host owns the seat and a plugin owns the
 * content; this module owns the container's *user state*: whether the panel is
 * collapsed, the height the user dragged it to, the height cap, and the two
 * skin-owned affordances — a click bar that toggles the panel and a thin
 * strip above it that resizes. Everything is published on the body as the
 * `data-islands-footer-*` attributes and the `--isl-footer-*` properties, so
 * the stylesheet stays declarative and only the DOM is touched here.
 *
 * Both affordances are `position: fixed` elements appended to `<body>` instead
 * of children of the host's `footerActions`: React owns that container, and
 * injecting nodes into it would be reconciled away on the next render.
 * A body-level overlay also escapes the footer's own scroll clip, so the bar
 * can mask scrolling content and the resize strip can sit above the seam.
 *
 * `build.mjs` inlines this file into `client.js` like the other host modules,
 * so it must stay free of template internals.
 */

/** The walker's marker for the host's contributed-footer seat. */
const FOOTER_SEAT_SELECTOR = '[data-islands-part~="footer-actions"]';
/** The host's outlet wrapper inside that seat. */
const FOOTER_SLOT_SELECTOR = '[data-slot="sidebar.footer.action"]';
/** Persisted `{ v, collapsed, height }`. */
const FOOTER_STORAGE_KEY = 'dsh-islands-ui:footer';
/** Bumped when the stored shape or its meaning changes. */
const FOOTER_STATE_VERSION = 2;
const FOOTER_COLLAPSED_ATTR = 'data-islands-footer-collapsed';
const FOOTER_EMPTY_ATTR = 'data-islands-footer-empty';
const FOOTER_HEIGHT_PROPERTY = '--isl-footer-height';
const FOOTER_MIN_PROPERTY = '--isl-footer-min';
const FOOTER_MAX_PROPERTY = '--isl-footer-max';
const FOOTER_HANDLE_CLASS = 'isl-footerHandle';
const FOOTER_RESIZE_CLASS = 'isl-footerResize';
/** Comfort baseline; a shorter guest keeps only its own height. */
const FOOTER_MIN_HEIGHT = 200;
/** A scrollbar for a few px of content is noise; grow to the content instead. */
const FOOTER_SLIVER_PX = 16;
/** Absolute cap; also capped to a share of the sidebar height. */
const FOOTER_MAX_PX = 800;
const FOOTER_MAX_SHARE = 0.45;
/** The resize strip sits this far above the bar, outside the button itself. */
const FOOTER_RESIZE_STRIP = 5;
/** Must match `.isl-footerHandle { height }`. */
const FOOTER_HANDLE_HEIGHT = 20;

/**
 * The height stored by a previous session. 1.2.x persisted the 200px drag
 * floor whenever a drag ended there; that value cannot be told apart from
 * "never dragged", and it is exactly what keeps a short footer padded to
 * 200px. Normalize it away once. A versioned 200px is a deliberate choice and
 * survives a reload.
 */
function footerStoredHeight(parsed) {
  const height = Number.isFinite(parsed?.height) ? Number(parsed.height) : null;
  if (parsed?.v !== FOOTER_STATE_VERSION && height !== null && height <= FOOTER_MIN_HEIGHT) {
    return null;
  }
  return height;
}

function readFooterState() {
  try {
    const raw = window.localStorage.getItem(FOOTER_STORAGE_KEY);
    if (raw === null) return { collapsed: false, height: null };
    const parsed = JSON.parse(raw);
    const collapsed = parsed?.collapsed === true;
    const height = footerStoredHeight(parsed);
    const state = { collapsed, height };
    // Stamp the current version so a later, deliberate 200px drag survives.
    if (parsed?.v !== FOOTER_STATE_VERSION) writeFooterState(state);
    return state;
  } catch {
    return { collapsed: false, height: null };
  }
}

function writeFooterState(state) {
  try {
    window.localStorage.setItem(
      FOOTER_STORAGE_KEY,
      JSON.stringify({ v: FOOTER_STATE_VERSION, collapsed: state.collapsed, height: state.height }),
    );
  } catch {
    /* private mode / quota: the state simply does not survive the reload */
  }
}

/**
 * The effective height cap: the absolute 800px ceiling or 45% of the sidebar,
 * whichever is smaller.
 */
function footerMaxHeight(sidebarHeight) {
  return sidebarHeight > 0
    ? Math.min(FOOTER_MAX_PX, Math.round(sidebarHeight * FOOTER_MAX_SHARE))
    : FOOTER_MAX_PX;
}

/**
 * The effective floor of the expanded seat: the 200px comfort baseline, or the
 * content's own natural height when that is shorter. The natural height already
 * contains the 20px click-bar gap and the 8px bottom inset, so a short guest
 * never gets padded with blank space. The cap wins on short sidebars.
 */
function footerMinHeight(contentHeight, sidebarHeight) {
  const cap = footerMaxHeight(sidebarHeight);
  const natural = contentHeight > 0 ? contentHeight : FOOTER_MIN_HEIGHT;
  return Math.min(FOOTER_MIN_HEIGHT, natural, cap);
}

/**
 * Clamp a requested footer height. The floor follows the content
 * (`footerMinHeight`), so dragging can never squash a short footer into the
 * old fixed 200px, and the 200px floor still yields to the cap on short
 * sidebars so the workspace is not crushed.
 */
function clampFooterHeight(value, sidebarHeight, contentHeight = FOOTER_MIN_HEIGHT) {
  const cap = footerMaxHeight(sidebarHeight);
  const floor = footerMinHeight(contentHeight, sidebarHeight);
  return Math.min(Math.max(value, floor), cap);
}

/**
 * The fixed height to publish, or `null` for `auto`.
 *
 * A stored height at the content floor is redundant when `auto` already equals
 * the content (a short guest). But when the content is taller than the floor
 * (the 200px baseline or the 45% cap), `auto` means the full content height:
 * keeping the fixed floor is what stops a bottom drag from snapping back to
 * the full content.
 */
function footerRenderedHeight(storedHeight, naturalHeight, sidebarHeight) {
  if (storedHeight === null) return null;
  const cap = footerMaxHeight(sidebarHeight);
  const floor = footerMinHeight(naturalHeight, sidebarHeight);
  if (floor >= naturalHeight && storedHeight <= floor) return null;
  const clamped = Math.ceil(clampFooterHeight(storedHeight, sidebarHeight, naturalHeight));
  // A scrollbar for a sliver of the last guest is just noise. Unless the cap
  // itself forces the scroll, grow to the content when the overflow is small.
  if (clamped < naturalHeight && naturalHeight <= cap && naturalHeight - clamped <= FOOTER_SLIVER_PX) {
    return Math.ceil(naturalHeight);
  }
  return clamped;
}

/**
 * Install the workspace footer panel.
 *
 * @returns {() => void} teardown that restores the host's default footer.
 */
function installFooterPanel() {
  if (typeof document === 'undefined' || document.body === null) return () => {};

  const body = document.body;
  const state = readFooterState();
  let seat = null;
  let handle = null;
  let resize = null;
  let seatObserver = null;
  let bodyObserver = null;
  let langObserver = null;
  let seatResize = null;
  let emptyFrame = 0;
  let placeFrame = 0;
  let drag = null;
  let lastToggle = 0;

  const seatHeight = () => (seat === null ? 0 : seat.getBoundingClientRect().height);

  const rootHeight = () => {
    const root = seat?.closest('[data-islands-part~="sidebar-root"]');
    return root?.getBoundingClientRect().height ?? 0;
  };

  /**
   * The seat's natural height: flow content plus the seat's own vertical
   * padding and row gap. `sidebar.footer.action` is `display: contents`, so its
   * guests are the seat's flex items; recurse through such wrappers instead of
   * reading their zero-height box. Only called when a height has to be clamped
   * (a restored height or the start of a drag), never per frame.
   */
  const measureNatural = () => {
    if (seat === null) return FOOTER_MIN_HEIGHT;
    const style = getComputedStyle(seat);
    const rowGap = parseFloat(style.rowGap) || 0;
    let total = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
    let items = 0;
    const visit = (element) => {
      const childStyle = getComputedStyle(element);
      if (childStyle.display === 'none') return;
      if (childStyle.position === 'absolute' || childStyle.position === 'fixed') return;
      if (childStyle.display === 'contents') {
        for (const child of element.children) visit(child);
        return;
      }
      total +=
        element.getBoundingClientRect().height +
        (parseFloat(childStyle.marginTop) || 0) +
        (parseFloat(childStyle.marginBottom) || 0);
      items += 1;
    };
    const root = seat.querySelector(FOOTER_SLOT_SELECTOR) ?? seat;
    for (const child of root.children) visit(child);
    return total + rowGap * Math.max(0, items - 1);
  };

  /** Natural height, reusing the drag-start measurement during a gesture. */
  const naturalHeight = () => (drag === null ? measureNatural() : drag.content);

  const clampHeight = (value, natural = naturalHeight()) =>
    clampFooterHeight(value, rootHeight(), natural);

  /**
   * Publish the CSS floor. Re-measuring during a drag would read layout every
   * pointer move, so the gesture reuses the height captured at drag start.
   * Returns the unrounded floor so `publish` can tell a meaningful stored
   * height from one that merely sits at the content floor.
   */
  const publishMin = (natural = naturalHeight(), sidebar = rootHeight()) => {
    const floor = footerMinHeight(natural, sidebar);
    body.style.setProperty(FOOTER_MIN_PROPERTY, `${Math.ceil(floor)}px`);
    return floor;
  };

  /** The footer is hidden when the sidebar is in its collapsed rail. */
  const onRail = () =>
    seat === null ? false : seat.closest('[data-islands-part~="sidebar-collapsed"]') !== null;

  /** The host sets documentElement.lang (zh-CN / en), so follow it. */
  const footerLabel = () =>
    (document.documentElement.lang || 'en').toLowerCase().startsWith('zh') ? '底部栏' : 'Footer';

  const place = () => {
    placeFrame = 0;
    if (handle === null) return;
    if (seat === null) {
      handle.hidden = true;
      if (resize !== null) resize.hidden = true;
      return;
    }
    const empty = body.hasAttribute(FOOTER_EMPTY_ATTR);
    const workspaceCollapsed = body.hasAttribute('data-islands-workspace-collapsed');
    const rect = seat.getBoundingClientRect();
    const visible = !empty && !onRail() && !workspaceCollapsed && rect.width > 0 && rect.height > 0;
    handle.hidden = !visible;
    if (resize !== null) resize.hidden = !visible || state.collapsed;
    if (!visible) return;
    const style = getComputedStyle(seat);
    const padLeft = parseFloat(style.paddingLeft) || 0;
    const padRight = parseFloat(style.paddingRight) || 0;
    // The horizontal inset is the footer's own padding in both states, so the
    // bar keeps one width instead of jumping wider when the panel collapses.
    // Collapsed adds a 1px vertical inset to keep the island's bottom border
    // visible instead of covering it.
    const verticalInset = state.collapsed ? 1 : 0;
    const left = rect.left + padLeft;
    const width = Math.max(0, rect.width - padLeft - padRight);
    handle.style.left = `${left}px`;
    handle.style.top = `${rect.top + verticalInset}px`;
    handle.style.width = `${width}px`;
    handle.style.height = state.collapsed ? `${FOOTER_HANDLE_HEIGHT - verticalInset * 2}px` : '';
    if (resize !== null && !state.collapsed) {
      resize.style.left = `${left}px`;
      resize.style.top = `${rect.top - FOOTER_RESIZE_STRIP}px`;
      resize.style.width = `${width}px`;
      resize.style.height = `${FOOTER_RESIZE_STRIP}px`;
    }
  };

  const schedulePlace = () => {
    if (placeFrame !== 0) return;
    placeFrame = window.requestAnimationFrame(place);
  };

  const publish = () => {
    body.toggleAttribute(FOOTER_COLLAPSED_ATTR, state.collapsed);
    const natural = naturalHeight();
    const sidebar = rootHeight();
    publishMin(natural, sidebar);
    body.style.setProperty(FOOTER_MAX_PROPERTY, `${footerMaxHeight(sidebar)}px`);
    const rendered = footerRenderedHeight(state.height, natural, sidebar);
    if (rendered === null) body.style.removeProperty(FOOTER_HEIGHT_PROPERTY);
    else body.style.setProperty(FOOTER_HEIGHT_PROPERTY, `${rendered}px`);
    if (handle !== null) {
      handle.setAttribute('aria-expanded', state.collapsed ? 'false' : 'true');
      handle.setAttribute('aria-label', footerLabel());
    }
    schedulePlace();
  };

  const persist = () => writeFooterState({ collapsed: state.collapsed, height: state.height });

  const setCollapsed = (collapsed) => {
    state.collapsed = collapsed;
    persist();
    publish();
  };

  const applyHeight = (value) => {
    state.height = Math.round(clampHeight(value));
    publish();
  };

  const hasContent = () => {
    if (seat === null) return false;
    const slot = seat.querySelector(FOOTER_SLOT_SELECTOR);
    // Older shells have no [data-slot] anchor; there the guests are the seat's
    // direct children. Presence, not geometry, decides: the empty state hides
    // the seat, so a plugin mounting afterwards has zero-size children and a
    // rect test would keep the seat hidden forever. A child the plugin itself
    // set to display:none is still "empty".
    const root = slot ?? seat;
    for (const child of root.children) {
      if (getComputedStyle(child).display !== 'none') return true;
    }
    return root.textContent.trim() !== '';
  };

  const updateEmpty = () => {
    emptyFrame = 0;
    // Toggle first: a hidden seat measures as zero, so removing the empty
    // marker before measuring is what lets a newly mounted guest report its
    // real height.
    body.toggleAttribute(FOOTER_EMPTY_ATTR, !hasContent());
    // Publish, not just the floor: the rendered height also follows content
    // changes (a sliver may grow, a shrunk guest may reveal a stored height).
    publish();
  };

  const scheduleEmpty = () => {
    if (emptyFrame !== 0) return;
    emptyFrame = window.requestAnimationFrame(updateEmpty);
  };

  const onClick = () => {
    // Some pointer stacks deliver both the pointer click and a synthetic
    // click; swallow the duplicate so one press is one toggle.
    const now = Date.now();
    if (now - lastToggle < 200) return;
    lastToggle = now;
    setCollapsed(!state.collapsed);
  };

  const onResizeDown = (event) => {
    if (event.button !== 0 || seat === null) return;
    // Measure once for the whole gesture: the drag floor follows the content,
    // so a short footer can be pulled back down to its own height.
    drag = {
      id: event.pointerId,
      startY: event.clientY,
      startHeight: seatHeight(),
      content: measureNatural(),
    };
    resize.classList.add('is-dragging');
    handle?.classList.add('is-dragging');
    resize.setPointerCapture?.(event.pointerId);
    resize.addEventListener('pointermove', onResizeMove);
    resize.addEventListener('pointerup', onResizeUp);
    resize.addEventListener('pointercancel', onResizeUp);
    event.preventDefault();
  };

  const onResizeMove = (event) => {
    if (drag === null || event.pointerId !== drag.id) return;
    const delta = event.clientY - drag.startY;
    if (delta === 0) return;
    // The footer is bottom-anchored, so dragging its top edge up grows it.
    applyHeight(drag.startHeight - delta);
  };

  const onResizeUp = () => {
    if (drag === null) return;
    resize.classList.remove('is-dragging');
    handle?.classList.remove('is-dragging');
    resize.removeEventListener('pointermove', onResizeMove);
    resize.removeEventListener('pointerup', onResizeUp);
    resize.removeEventListener('pointercancel', onResizeUp);
    drag = null;
    persist();
  };

  const ensureHandle = () => {
    if (handle === null) {
      handle = document.createElement('button');
      handle.type = 'button';
      handle.className = FOOTER_HANDLE_CLASS;
      handle.innerHTML =
        '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 6.5 5 3.5l3 3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      handle.addEventListener('click', onClick);
      handle.hidden = true;
    }
    if (handle.parentElement !== body) body.appendChild(handle);
    if (seat !== null) {
      if (!seat.id) seat.id = 'isl-footer-seat';
      handle.setAttribute('aria-controls', seat.id);
    }
    if (resize === null) {
      resize = document.createElement('div');
      resize.className = FOOTER_RESIZE_CLASS;
      resize.setAttribute('aria-hidden', 'true');
      resize.addEventListener('pointerdown', onResizeDown);
      resize.hidden = true;
    }
    if (resize.parentElement !== body) body.appendChild(resize);
    publish();
  };

  const observeSeat = () => {
    seatObserver?.disconnect();
    seatResize?.disconnect();
    if (seat === null) return;
    seatObserver = new MutationObserver(scheduleEmpty);
    seatObserver.observe(seat, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden'],
    });
    if (typeof ResizeObserver === 'function') {
      seatResize = new ResizeObserver(() => {
        schedulePlace();
        scheduleEmpty();
      });
      seatResize.observe(seat);
    }
    scheduleEmpty();
    schedulePlace();
  };

  const locate = () => {
    const next = document.querySelector(FOOTER_SEAT_SELECTOR);
    if (next === seat) return;
    seat = next;
    observeSeat();
  };

  const onBodyAttributeChange = (records) => {
    let parts = false;
    let layout = false;
    for (const record of records) {
      if (record.attributeName === 'data-islands-part') parts = true;
      if (record.attributeName === 'data-islands-workspace-collapsed') layout = true;
      if (record.attributeName === 'data-sidebar-drawer') layout = true;
    }
    if (parts) {
      locate();
      ensureHandle();
    }
    if (parts || layout) {
      schedulePlace();
      scheduleEmpty();
    }
  };

  const onResize = () => {
    publish();
    schedulePlace();
  };

  langObserver = new MutationObserver(publish);
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  bodyObserver = new MutationObserver(onBodyAttributeChange);
  bodyObserver.observe(body, {
    attributes: true,
    attributeFilter: ['data-islands-part', 'data-islands-workspace-collapsed', 'data-sidebar-drawer'],
    subtree: true,
  });

  // The narrow workspace drawer opens/closes with a transform, which does not
  // resize the seat. Reposition after the drawer's transition settles.
  const onTransitionEnd = (event) => {
    if (event.target instanceof Element && event.target.closest('[data-islands-part~="layout-frame"], [data-islands-part~="sidebar-root"]')) {
      schedulePlace();
    }
  };

  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', schedulePlace, true);
  document.addEventListener('transitionend', onTransitionEnd, true);

  locate();
  ensureHandle();
  publish();
  scheduleEmpty();

  return () => {
    window.cancelAnimationFrame(placeFrame);
    window.cancelAnimationFrame(emptyFrame);
    seatObserver?.disconnect();
    seatResize?.disconnect();
    bodyObserver?.disconnect();
    langObserver?.disconnect();
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', schedulePlace, true);
    document.removeEventListener('transitionend', onTransitionEnd, true);
    handle?.remove();
    resize?.remove();
    body.removeAttribute(FOOTER_COLLAPSED_ATTR);
    body.removeAttribute(FOOTER_EMPTY_ATTR);
    body.style.removeProperty(FOOTER_HEIGHT_PROPERTY);
    body.style.removeProperty(FOOTER_MIN_PROPERTY);
    body.style.removeProperty(FOOTER_MAX_PROPERTY);
  };
}
    /**
 * Host collapse policy.
 *
 * The skin keeps the host sidebar expanded in both states; the host can still
 * enter `data-sidebar-collapsed` on its own — below the 1024px breakpoint, on
 * a viewport resize, or when the right panel opens on a narrow frame. The
 * conversion must not treat those automatic collapses as the user pressing
 * ⌘B: toggling the skin state there flips the workspace the user explicitly
 * collapsed. Only a collapse with no auto context is a user gesture.
 *
 * `build.mjs` inlines this file into `client.js`; unit tests import it from
 * source.
 */

/** The host's own narrow breakpoint (`SIDEBAR_AUTO_COLLAPSE` in ui-layout). */
const HOST_NARROW_MAX = 1024;
/** How long after a viewport resize the host collapse is considered automatic. */
const RESIZE_GRACE_MS = 300;

/**
 * What the skin should do with its own collapse state for a host collapse.
 *
 * @param {object} input
 * @param {boolean} input.skinEnabled - the skin is on (`body[data-islands-ui]`).
 * @param {boolean} input.drawer - the host is in its narrow drawer mode.
 * @param {number} input.width - viewport width.
 * @param {boolean} input.recentResize - a resize happened within the grace window.
 * @param {boolean} input.skinCollapsed - the skin's workspace is currently hidden.
 * @returns {'ignore' | 'clear' | 'collapse' | 'expand'}
 *   ignore: skin off, do nothing;
 *   clear: drawer mode owns the state, show the workspace;
 *   collapse: hide the workspace (automatic collapse, or the user collapsed it);
 *   expand: the user asked to expand while the skin was collapsed.
 */
function hostCollapseAction({ skinEnabled, drawer, width, recentResize, skinCollapsed }) {
  if (!skinEnabled) return 'ignore';
  if (drawer) return 'clear';
  if (width < HOST_NARROW_MAX || recentResize) return 'collapse';
  return skinCollapsed ? 'expand' : 'collapse';
}
    /**
 * Compatibility gate for the Islands UI skin.
 *
 * The plugin's own chrome is plain React and keeps rendering no matter what
 * DSH does, while every layout rule is keyed to host contracts and skin parts.
 * A renamed anchor therefore yields a half-skinned, overlapping UI instead of
 * a clean fallback, so a mismatched build must stay on the untouched default.
 *
 * Everything here is injected (`doc`, `win`, `now`, the contract probe and the
 * callbacks), which keeps the state machine free of template internals and
 * unit testable from source — the same split as `collapse.js`.
 *
 * Timeline, and why it is shaped this way:
 *   1. the shell mounts *after* the skin boots, and a cold start can take
 *      seconds, so slowness must never be read as a rename — the gate waits
 *      for the root slot up to `timeout`;
 *   2. once it is there, the frame parts get `partGrace` to commit; only their
 *      absence after that counts as a mismatch;
 *   3. a failed gate keeps watching for `healWindow` and turns the skin on by
 *      itself if the anchors arrive late;
 *   4. every deadline is measured on *visible* time and the notice is only
 *      shown to a visible window — a hidden or minimised window throttles
 *      timers (rAF stops outright), and judging it there used to disable the
 *      skin for a user who could not see why.
 */

const COMPAT_TIMING = Object.freeze({
  /** Poll cadence while the gate waits for the shell. */
  poll: 100,
  /** No root slot at all after this long (visible time): the shell never mounted. */
  timeout: 10000,
  /** Root slot present but the frame parts never followed: a rename, not slowness. */
  partGrace: 1500,
  /** Hold the notice back this long so a mount that merely ran late is silent. */
  toastDelay: 1500,
  /** Keep watching a failed gate this long (visible time); a late mount may heal it. */
  healWindow: 60000,
  healInterval: 400,
});

/**
 * @param {object} deps
 * @param {Document} deps.doc            page to observe; only `visibilityState`,
 *                                       `querySelector` and the visibility event are read
 * @param {Window} deps.win              timer host
 * @param {() => string[]} deps.missingAnchors contract probe (empty = the build matches)
 * @param {string} deps.rootSlot         selector that only exists once the shell mounted
 * @param {(state: {status: 'ok'|'missing', missing: string[]}) => void} deps.publish
 * @param {() => boolean} deps.readStored whether the user wants the skin at all
 * @param {() => void} deps.showToast
 * @param {() => void} deps.dismissToast idempotent; a no-op when nothing is on screen
 * @param {() => void} deps.activate
 * @param {(message: string, detail: object) => void} [deps.warn]
 * @param {(message: string) => void} [deps.info]
 * @param {() => number} [deps.now]      injectable clock (tests drive it)
 * @param {Partial<typeof COMPAT_TIMING>} [deps.timing]
 * @returns {{ start: () => void, stop: () => void }}
 */
function createCompatGate(deps) {
  const timing = { ...COMPAT_TIMING, ...(deps.timing ?? {}) };
  const doc = deps.doc;
  const win = deps.win;
  const now = deps.now ?? (() => Date.now());
  const warn = deps.warn ?? (() => {});
  const info = deps.info ?? (() => {});

  let timer = null;
  let toastTimer = null;
  /** 'pending' while waiting, then 'ok' or 'missing' — never back to pending. */
  let decision = 'pending';
  let mountedAt = null;
  let failedAt = 0;
  /** Wall-clock milliseconds spent hidden, so deadlines only burn visible time. */
  let paused = 0;
  let hiddenAt = doc.visibilityState === 'hidden' ? now() : null;
  let pendingToast = false;
  let stopped = false;

  const startedAt = now();

  /** Visible-time clock: frozen while the page is hidden. */
  const clock = () => (hiddenAt === null ? now() : hiddenAt) - paused;

  const clearTimers = () => {
    if (timer !== null) win.clearTimeout(timer);
    if (toastTimer !== null) win.clearTimeout(toastTimer);
    timer = null;
    toastTimer = null;
  };

  const schedule = (run, ms) => {
    if (stopped) return;
    if (timer !== null) win.clearTimeout(timer);
    timer = win.setTimeout(run, ms);
  };

  const showToast = () => {
    if (decision !== 'missing') return;
    // A hidden window would create the notice, never show it and then run its
    // auto-dismiss: keep it owed until someone is actually looking.
    if (doc.visibilityState === 'hidden') {
      pendingToast = true;
      return;
    }
    pendingToast = false;
    deps.showToast();
  };

  const fail = (missing) => {
    if (decision !== 'pending') return;
    decision = 'missing';
    failedAt = clock();
    deps.publish({ status: 'missing', missing });
    warn('[islands-ui] host contracts missing; the skin stayed off:', { missing });
    // Someone who already switched the skin off does not need a popup; the
    // settings page still carries the explanation.
    if (deps.readStored()) {
      if (toastTimer !== null) win.clearTimeout(toastTimer);
      toastTimer = win.setTimeout(() => {
        toastTimer = null;
        showToast();
      }, timing.toastDelay);
    }
    schedule(heal, timing.healInterval);
  };

  const pass = () => {
    if (decision === 'ok') return;
    const recovered = decision === 'missing';
    decision = 'ok';
    clearTimers();
    deps.publish({ status: 'ok', missing: [] });
    if (recovered) {
      // The notice may already be on screen; the skin is about to cover the
      // same surface, so take it down rather than leave it stranded.
      deps.dismissToast();
      info('[islands-ui] host contracts arrived after the gate gave up; the skin turned itself back on');
    }
    deps.activate();
  };

  function heal() {
    timer = null;
    if (stopped || decision !== 'missing') return;
    if (deps.missingAnchors().length === 0) {
      pass();
      return;
    }
    if (clock() - failedAt > timing.healWindow) return;
    schedule(heal, timing.healInterval);
  }

  function tick() {
    timer = null;
    if (stopped || decision !== 'pending') return;
    const missing = deps.missingAnchors();
    if (missing.length === 0) {
      pass();
      return;
    }
    if (doc.querySelector(deps.rootSlot) !== null) {
      // The shell mounted: give its parts the rest of the commit to show up,
      // then treat their absence as a renamed build. Note that `#root` having
      // any child is NOT this signal — the boot skeleton renders there
      // seconds before the shell does.
      if (mountedAt === null) mountedAt = clock();
      if (clock() - mountedAt >= timing.partGrace) {
        fail(missing);
        return;
      }
    } else if (clock() - startedAt >= timing.timeout) {
      fail(missing);
      return;
    }
    schedule(tick, timing.poll);
  }

  const onVisibility = () => {
    if (stopped) return;
    if (doc.visibilityState === 'hidden') {
      if (hiddenAt === null) hiddenAt = now();
      return;
    }
    if (hiddenAt !== null) {
      paused += now() - hiddenAt;
      hiddenAt = null;
    }
    // Waking up after a long hidden stretch: decide immediately instead of
    // waiting out a timer the browser throttled to the next minute.
    if (pendingToast) showToast();
    if (decision === 'pending') schedule(tick, 0);
    else if (decision === 'missing') schedule(heal, 0);
  };

  return {
    start() {
      doc.addEventListener('visibilitychange', onVisibility);
      schedule(tick, 0);
    },
    stop() {
      stopped = true;
      clearTimers();
      doc.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
    /**
 * Runtime yield policy: when the skin should step aside, and when it may return.
 *
 * The skin's layout premise is that the host sidebar stays expanded. Another
 * plugin that owns the shell can meanwhile ask the host to collapse the very
 * same sidebar, and answer every expand with another collapse: measured on
 * 0.2.2-rc.5 with ds-bot in Bot mode, the two trade the sidebar about once a
 * second, and on a build where the trade closes inside one task it freezes the
 * page instead. Neither side is broken on its own, so the skin is the one that
 * has to give way.
 *
 * Deciding *that* cannot live in a timer: a synchronous trade never returns to
 * the event loop, so a `setTimeout` verdict would never run. The counter is
 * therefore fed from the collapse observer itself, on the same synchronous path
 * that does the conversion, and the yield happens from inside that path.
 *
 * Counting only the attribute's *appearance* is enough, and needs no
 * self-filtering: the skin only ever removes `data-sidebar-collapsed` (it
 * expands the sidebar), so an appearance always came from someone else.
 *
 * Everything here is injected (`now`, timers, the collapse probe and the
 * apply/publish callbacks), which keeps the machine free of template internals
 * and unit testable from source — the same split as `collapse.js`.
 *
 * Timing, and why it is shaped this way:
 *   1. a user who presses ⌘B twice in a row must not be read as a fight, so it
 *      takes `strikes` collapses inside `window` before the skin stands down;
 *   2. every attempt waits for the attribute to stay gone for a while, so an
 *      ongoing fight is never probed in the middle of itself. The waits form a
 *      short ladder (500ms, 1s, 1.5s) rather than one long fixed wait: the
 *      counterpart re-collapses 240-280ms after every restore, so half a second
 *      already separates "still fighting" from "done", and someone who just
 *      left Bot mode gets their skin back almost at once;
 *   3. three failed attempts mean this is persistent rather than a race, so the
 *      guard asks the user (`onPrompt`) instead of trading silently. Holding on
 *      a slow `holdGap` afterwards keeps recovery alive if the other side does
 *      eventually leave, without flickering every second until then;
 *   4. surviving one whole window resets the ladder, so a single recovery does
 *      not leave the skin slow to come back for the rest of the session.
 */

const YIELD_TIMING = Object.freeze({
  /** Collapses inside this window count as one contention. */
  window: 3000,
  /** Collapses within the window that stand the skin down. */
  strikes: 3,
  /** How long the attribute must stay gone before attempts 1, 2, 3… */
  ladder: Object.freeze([500, 1000, 1500]),
  /** Wait between attempts once the ladder is used up. */
  holdGap: 30000,
  /** Consecutive failed attempts that make this worth telling the user about. */
  promptAfter: 3,
  /** A hidden window throttles timers; look again later instead of probing. */
  hiddenRetry: 5000,
});

/**
 * @param {object} deps
 * @param {() => number} [deps.now]        injectable clock (tests drive it)
 * @param {(run: () => void, ms: number) => unknown} deps.schedule timer host
 * @param {(id: unknown) => void} deps.cancel           timer host
 * @param {(active: boolean) => void} deps.apply       attach/detach the skin
 * @param {() => boolean} deps.read                    is the host still collapsed?
 * @param {() => boolean} [deps.isHidden]              page hidden?
 * @param {(state: {status: string, since: number|null, attempts: number}) => void} [deps.onChange]
 * @param {(state: {attempts: number}) => void} [deps.onPrompt]  three failures and counting
 * @param {Partial<typeof YIELD_TIMING>} [deps.timing]
 * @returns {{
 *   observe: (collapsed: boolean, now?: number) => 'convert'|'skip',
 *   retry: (now?: number) => boolean,
 *   wake: (now?: number) => void,
 *   snapshot: () => {status: string, since: number|null, attempts: number},
 *   stop: () => void,
 * }}
 */
function createYieldGuard(deps) {
  const timing = { ...YIELD_TIMING, ...(deps.timing ?? {}) };
  const ladder = [...(timing.ladder ?? YIELD_TIMING.ladder)];
  const now = deps.now ?? (() => Date.now());
  const schedule = deps.schedule;
  const cancel = deps.cancel;
  const apply = deps.apply;
  const read = deps.read;
  const isHidden = deps.isHidden ?? (() => false);
  const onChange = deps.onChange ?? (() => {});
  const onPrompt = deps.onPrompt ?? (() => {});

  /** 'active' while the skin shows, 'yielded' while it stands down. */
  let state = 'active';
  /** Collapse timestamps still inside the current window. */
  let strikes = [];
  /** When the attribute was first seen gone, while yielded. */
  let absenceSince = null;
  /** When the skin last stood down. */
  let yieldedSince = null;
  /** Failed attempts since the last recovery; drives the wait and the prompt. */
  let attempts = 0;
  /** While set, a yield counts as a failed attempt. */
  let probationSince = null;
  /** The prompt fires once per hold, not once per failed attempt. */
  let prompted = false;
  let timer = null;
  let stopped = false;

  const snapshot = () => ({ status: state, since: yieldedSince, attempts });

  /** Wait before attempt `attempts + 1` once the sidebar has settled. */
  const waitBefore = (count) =>
    count < ladder.length ? ladder[count] : timing.holdGap;

  const clearTimer = () => {
    if (timer !== null) cancel(timer);
    timer = null;
  };

  /** Re-arm the probe from the current absence. */
  function arm(t) {
    clearTimer();
    if (stopped || state !== 'yielded') return;
    if (absenceSince === null) return;
    timer = schedule(() => probe(now()), Math.max(0, absenceSince + waitBefore(attempts) - t));
  }

  function settle(t) {
    timer = null;
    if (stopped || state !== 'active' || probationSince === null) return;
    const elapsed = t - probationSince;
    if (elapsed < timing.window) {
      timer = schedule(() => settle(now()), timing.window - elapsed);
      return;
    }
    // A whole window without a strike: the contention is over.
    probationSince = null;
    if (attempts !== 0 || prompted) {
      attempts = 0;
      prompted = false;
      onChange(snapshot());
    }
  }

  function standDown(t, fromProbation) {
    if (fromProbation) attempts += 1;
    state = 'yielded';
    strikes = [];
    absenceSince = null;
    probationSince = null;
    yieldedSince = t;
    clearTimer();
    apply(false);
    onChange(snapshot());
    if (fromProbation && attempts >= timing.promptAfter && !prompted) {
      prompted = true;
      onPrompt(snapshot());
    }
  }

  function probe(t) {
    timer = null;
    if (stopped || state !== 'yielded') return;
    if (read()) {
      // Collapsed again while waiting: the wait clock starts over.
      absenceSince = null;
      return;
    }
    if (isHidden()) {
      timer = schedule(() => probe(now()), timing.hiddenRetry);
      return;
    }
    state = 'active';
    strikes = [];
    yieldedSince = null;
    probationSince = t;
    apply(true);
    onChange(snapshot());
    timer = schedule(() => settle(now()), timing.window);
  }

  return {
    /**
     * Feed one observation of the host attribute. `convert` means the caller
     * may run its normal collapse conversion; `skip` means leave it alone.
     */
    observe(collapsed, at) {
      if (stopped) return 'skip';
      const t = typeof at === 'number' ? at : now();
      if (collapsed) {
        if (state === 'yielded') {
          // Still being collapsed while standing down: keep the wait clock off.
          absenceSince = null;
          clearTimer();
          return 'skip';
        }
        strikes = strikes.filter((stamp) => t - stamp < timing.window);
        strikes.push(t);
        if (strikes.length >= timing.strikes) {
          standDown(t, probationSince !== null);
          return 'skip';
        }
        return 'convert';
      }
      if (state === 'yielded') {
        if (absenceSince === null) absenceSince = t;
        arm(t);
      }
      return 'skip';
    },

    /** The settings page's and the toast's "try again": never waits. */
    retry(at) {
      if (stopped || state !== 'yielded' || read()) return false;
      probe(typeof at === 'number' ? at : now());
      return state === 'active';
    },

    /** Re-evaluate after the page became visible again. */
    wake(at) {
      if (stopped || state !== 'yielded') return;
      arm(typeof at === 'number' ? at : now());
    },

    snapshot,

    stop() {
      stopped = true;
      clearTimer();
    },
  };
}
    const CSS = "/* ---- 00-tokens.css ---- */\n/* ==========================================================================\n   Islands UI · 00 tokens\n   One source of truth for the skin. Every rule below reads these variables,\n   so light/dark, radius, elevation and spacing are changed in one place.\n   `--dsw-*` aliases are re-pointed at the Islands scale so shipped components\n   inherit the new language without per-component overrides.\n   ========================================================================== */\n\nbody[data-islands-ui] {\n  /* Canvas: the unified background all islands float on. */\n  --isl-canvas: #f7f7f7;\n  --isl-canvas-veil: rgba(232, 234, 239, 0.72);\n  /* Island surfaces. */\n  --isl-surface: #ffffff;\n  --isl-surface-muted: #f3f5f8;\n  --isl-surface-sunken: #eceef3;\n  /* Hairlines: Islands uses tinted, very quiet borders. */\n  --isl-border-soft: rgba(17, 24, 39, 0.06);\n  --isl-border: rgba(17, 24, 39, 0.09);\n  --isl-border-strong: rgba(17, 24, 39, 0.14);\n  --isl-hover: rgba(17, 24, 39, 0.055);\n  --isl-active: rgba(17, 24, 39, 0.09);\n  --isl-accent: #4176e6;\n  /* Rail hover label: an inverted chip on light canvases. */\n  --isl-tooltip-bg: #17181b;\n  --isl-tooltip-fg: #ffffff;\n  --isl-tooltip-ring: transparent;\n  --isl-tooltip-shadow:\n    0 2px 6px rgba(17, 24, 39, 0.16), 0 10px 24px -12px rgba(17, 24, 39, 0.4);\n  /* Geometry. */\n  --isl-radius-xl: 20px;\n  --isl-radius-lg: 16px;\n  --isl-radius-md: 12px;\n  --isl-radius-sm: 8px;\n  --isl-gap: 5px;\n  --isl-topbar-height: 40px;\n  /* Extra chrome above the app top bar (the Windows title bar). */\n  --isl-chrome-top: 0px;\n  --isl-rail-width: 48px;\n  /* The collapsed track is the rail column by definition. */\n  --isl-rail-collapsed-width: var(--isl-rail-width);\n  /* Rail foot band: the space between the measured foot stack and the gear,\n     and between the gear and the update entry. */\n  --isl-foot-gap: 20px;\n  --isl-update-gap: 8px;\n  /* Elevation: a hairline ring plus one soft, deep shadow. */\n  --isl-shadow-island: none;\n  --isl-shadow-float:\n    0 0 0 1px rgba(17, 24, 39, 0.05), 0 10px 24px -10px rgba(17, 24, 39, 0.14),\n    0 28px 64px -32px rgba(17, 24, 39, 0.3);\n\n  /* ---- DSH alias layer -------------------------------------------------- */\n  --dsw-alias-bg-base: var(--isl-surface);\n  --dsw-alias-bg-layer-1: var(--isl-surface);\n  --dsw-alias-bg-layer-2: var(--isl-surface);\n  --dsw-alias-bg-layer-3: var(--isl-surface-muted);\n  --dsw-alias-bg-overlay: var(--isl-surface);\n  --dsw-alias-bg-module-platform: var(--isl-surface-muted);\n  --dsw-alias-bg-multi-select: var(--isl-surface-muted);\n  --dsw-alias-bg-skeleton: rgba(17, 24, 39, 0.06);\n  --dsw-specific-sidebar-fill: var(--isl-surface);\n  --dsw-specific-input-major: var(--isl-surface);\n  --dsw-specific-selector: var(--isl-surface-muted);\n  --dsw-specific-tip: var(--isl-surface-muted);\n  --dsw-specific-bubble: var(--isl-surface-muted);\n  --dsw-specific-bubble-highlight: #eef1f6;\n  --dsw-specific-sidebar-nav-item-active: var(--isl-surface-muted);\n  --dsw-specific-sidebar-nav-item-active-accent: color-mix(\n    in srgb,\n    var(--dsw-alias-state-business-primary) 16%,\n    transparent\n  );\n  --dsw-specific-menu: color-mix(in srgb, var(--isl-surface) 90%, transparent);\n  --dsw-alias-menu-group-header-fill: color-mix(in srgb, var(--isl-surface-muted) 92%, transparent);\n  --dsw-alias-markdown-code-block: var(--isl-surface-muted);\n  --dsw-alias-markdown-code-block-banner: var(--isl-surface-muted);\n  --dsw-alias-markdown-inline-code: var(--isl-surface-muted);\n  --dsw-alias-markdown-tag: var(--isl-surface-muted);\n  --dsw-alias-settings-card-fill: color-mix(in srgb, var(--isl-surface-muted) 68%, var(--isl-surface));\n  --dsw-alias-settings-card-stroke: var(--isl-border-soft);\n  --dsw-alias-border-l1: var(--isl-border-soft);\n  --dsw-alias-border-l2: var(--isl-border-soft);\n  --dsw-alias-border-l3: var(--isl-border);\n  --dsw-alias-border-l4: var(--isl-border-strong);\n  --dsw-alias-interactive-bg-hover: var(--isl-hover);\n  --dsw-alias-interactive-bg-active: var(--isl-active);\n  --dsw-alias-interactive-bg-hover-solid: var(--isl-surface-muted);\n  --dsw-alias-button-elevated-fill: var(--isl-surface);\n  --dsw-alias-button-floating-fill: var(--isl-surface);\n  --dsw-alias-button-floating-hover: var(--isl-surface-muted);\n  --dsw-radius-xs: 6px;\n  --dsw-radius-sm: 8px;\n  --dsw-radius-md: 10px;\n  --dsw-radius-lg: 14px;\n  --dsw-radius-xl: 18px;\n  --dsw-radius-panel: 20px;\n  --dsw-menu-backdrop-filter: blur(18px) saturate(140%);\n  --dsw-mask-blur: blur(3px);\n  --dsw-alias-bg-mask-1: rgba(107, 114, 128, 0.3);\n  --dsw-alias-bg-mask-2: rgba(107, 114, 128, 0.18);\n\n  background-color: var(--isl-canvas) !important;\n}\n\n/* Elevation tokens are declared on `body, body *` by the shipped theme, so the\n   override has to be declared on descendants too, not only on body. */\nbody[data-islands-ui] * {\n  --dsw-elevation-stroke-color: var(--isl-border);\n  --dsw-elevation-stroke: 0 0 0 0.5px var(--isl-border);\n  --dsw-elevation-soft:\n    0 0 0 0.5px var(--isl-border), 0 6px 16px -6px rgba(17, 24, 39, 0.1),\n    0 18px 40px -24px rgba(17, 24, 39, 0.24);\n  --dsw-elevation-panel:\n    0 0 0 0.5px var(--isl-border), 0 8px 20px -8px rgba(17, 24, 39, 0.12),\n    0 24px 48px -28px rgba(17, 24, 39, 0.24);\n  --dsw-elevation-prominent:\n    0 0 0 0.5px var(--isl-border), 0 12px 28px -10px rgba(17, 24, 39, 0.16),\n    0 32px 64px -32px rgba(17, 24, 39, 0.3);\n  --dsw-shadow-lv1: 0 2px 4px rgba(17, 24, 39, 0.05);\n  --dsw-shadow-lv2: 0 4px 12px rgba(17, 24, 39, 0.06), 0 2px 8px rgba(17, 24, 39, 0.04);\n  --dsw-shadow-lv3:\n    0 0 1px rgba(17, 24, 39, 0.2), 0 12px 32px rgba(17, 24, 39, 0.08);\n}\n\n/* ---- Dark --------------------------------------------------------------- */\nbody[data-islands-ui][data-ds-dark-theme] {\n  --isl-canvas: #0f1012;\n  --isl-canvas-veil: rgba(15, 16, 18, 0.72);\n  --isl-surface: #1b1c1f;\n  --isl-surface-muted: #232428;\n  --isl-surface-sunken: #151619;\n  --isl-border-soft: rgba(255, 255, 255, 0.06);\n  --isl-border: rgba(255, 255, 255, 0.09);\n  --isl-border-strong: rgba(255, 255, 255, 0.16);\n  --isl-hover: rgba(255, 255, 255, 0.06);\n  --isl-active: rgba(255, 255, 255, 0.1);\n  /* On a dark canvas the chip cannot invert, so it lifts instead: one step\n     above the rail surface, a faint ring and a deeper shadow. */\n  --isl-tooltip-bg: #2c2d31;\n  --isl-tooltip-fg: #f4f5f7;\n  --isl-tooltip-ring: rgba(255, 255, 255, 0.09);\n  --isl-tooltip-shadow: 0 10px 26px -12px rgba(0, 0, 0, 0.72);\n  --isl-shadow-island: none;\n  --isl-shadow-float:\n    0 0 0 1px rgba(0, 0, 0, 0.55), 0 12px 28px -12px rgba(0, 0, 0, 0.6),\n    0 32px 72px -36px rgba(0, 0, 0, 0.85);\n\n  --dsw-alias-bg-skeleton: rgba(255, 255, 255, 0.07);\n  --dsw-specific-bubble-highlight: #2a2c31;\n  --dsw-specific-menu: color-mix(in srgb, var(--isl-surface) 88%, transparent);\n  --dsw-alias-bg-mask-1: rgba(0, 0, 0, 0.55);\n  --dsw-alias-bg-mask-2: rgba(0, 0, 0, 0.32);\n}\n\nbody[data-islands-ui][data-ds-dark-theme] * {\n  --dsw-elevation-stroke-color: var(--isl-border);\n  --dsw-elevation-stroke: 0 0 0 0.5px var(--isl-border);\n  --dsw-elevation-soft:\n    0 0 0 0.5px var(--isl-border), 0 8px 20px -8px rgba(0, 0, 0, 0.55),\n    0 20px 44px -24px rgba(0, 0, 0, 0.7);\n  --dsw-elevation-panel:\n    0 0 0 0.5px var(--isl-border), 0 10px 24px -10px rgba(0, 0, 0, 0.55),\n    0 28px 56px -30px rgba(0, 0, 0, 0.75);\n  --dsw-elevation-prominent:\n    0 0 0 0.5px var(--isl-border), 0 14px 32px -12px rgba(0, 0, 0, 0.6),\n    0 36px 72px -36px rgba(0, 0, 0, 0.85);\n  --dsw-shadow-lv1: 0 2px 6px rgba(0, 0, 0, 0.35);\n  --dsw-shadow-lv2: 0 6px 16px rgba(0, 0, 0, 0.4);\n  --dsw-shadow-lv3: 0 0 1px rgba(0, 0, 0, 0.6), 0 16px 40px rgba(0, 0, 0, 0.45);\n}\n\n/* Windows keeps its native title bar above the app top bar. The title bar is\n   the only chrome there: the island top bar is not rendered, so its 40px\n   reservation collapses and the islands start directly below the caption. */\nhtml[data-windows-titlebar] body[data-islands-ui] {\n  --isl-chrome-top: var(--dsh-windows-titlebar-height, 32px);\n  --isl-topbar-height: 0px;\n}\n\n/* User-selected accent: remap the business tokens everywhere. */\nbody[data-islands-ui][data-islands-accent],\nbody[data-islands-ui][data-islands-accent] * {\n  --dsw-alias-state-business-primary: var(--isl-accent);\n  --dsw-alias-state-business-tertiary: color-mix(in srgb, var(--isl-accent) 16%, transparent);\n}\n\n/* macOS ships a tinted, translucent sidebar. Islands wants an opaque canvas\n   instead, so the tint is replaced everywhere it is declared. */\nhtml[data-platform='darwin'] body[data-islands-ui],\nhtml[data-platform='darwin'] body[data-islands-ui][data-ds-dark-theme] {\n  --dsw-specific-menu: color-mix(in srgb, var(--isl-surface) 88%, transparent);\n  --dsw-alias-menu-group-header-fill: color-mix(in srgb, var(--isl-surface-muted) 94%, transparent);\n}\n\n/* DSH shapes every corner through a global `*` rule\n   (`corner-shape: superellipse(1.5)`), which renders a 50% radius as the\n   host's iOS-style squircle instead of a circle. The islands keep that\n   language, but anything the skin means as a true circle — or as a pill whose\n   ends must stay round — opts back to round arcs. Chromium supports\n   `corner-shape`; elsewhere the declaration is ignored and the radius alone\n   already draws a circle. */\nbody[data-islands-ui] .isl-updateButton,\nbody[data-islands-ui] .isl-updateErrorDot,\nbody[data-islands-ui] .isl-railRipple,\nbody[data-islands-ui] .isl-modelBack,\nbody[data-islands-ui] .isl-effortReset,\nbody[data-islands-ui] .isl-effortDot,\nbody[data-islands-ui] .isl-effortSlider::-webkit-slider-thumb,\nbody[data-islands-ui] .isl-switch,\nbody[data-islands-ui] .isl-switchThumb,\nbody[data-islands-ui] .isl-accentSwatch,\nbody[data-islands-ui] .isl-accentCustom {\n  corner-shape: round;\n}\n\n/* ---- 10-shell.css ---- */\n/* ==========================================================================\n   Islands UI · 10 shell\n   The frame becomes a canvas; the three columns become detachable islands.\n   ========================================================================== */\n\nbody[data-islands-ui] [data-islands-part~=\"layout-frame\"] {\n  /* The ocean is a solid surface, never the desktop showing through vibrancy. */\n  background: var(--isl-canvas);\n  padding: calc(var(--isl-chrome-top) + var(--isl-topbar-height) + var(--isl-gap)) var(--isl-gap) var(--isl-gap);\n  /* Column gap only: the empty bottom track must not steal an extra row gap,\n     so the islands stay symmetric top and bottom. */\n  gap: 0 var(--isl-gap);\n}\n\n/* A real bottom panel (terminal, banner) still gets breathing room. */\nbody[data-islands-ui] [data-shell-bottom]:has([data-slot='shell.bottom'] > *) {\n  margin-top: var(--isl-gap);\n}\n\n/* The closed right column is a zero-width track, but the grid still reserves a\n   gap beside it; pull the centre island over that gap so the canvas margin on\n   the right equals the margin on the left. */\nbody[data-islands-ui] [data-islands-part~=\"layout-frame\"][data-rightbar-collapsed] [data-islands-part~=\"center-column\"] {\n  margin-right: calc(-1 * var(--isl-gap));\n}\n\n/* Center column: the conversation island. */\nbody[data-islands-ui] [data-islands-part~=\"center-column\"] {\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  box-shadow: var(--isl-shadow-island);\n  overflow: hidden;\n}\n\n/* Shipped desktop rules paint the sidebar with a gradient and give the center\n   column a left hairline; both are removed so the canvas reads as one plane. */\n[data-platform='darwin'] body[data-islands-ui] [data-islands-part~=\"layout-frame\"] {\n  background: var(--isl-canvas);\n}\n\n[data-platform='darwin'] body[data-islands-ui] [data-islands-part~=\"layout-frame\"]:not([data-sidebar-drawer]) [data-islands-part~=\"sidebar-column\"] {\n  background: transparent;\n  border-right: 0;\n  backdrop-filter: none;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-column\"] {\n  background: transparent;\n  border-right: 0;\n}\n\n[data-platform='darwin'] body[data-islands-ui] [data-islands-part~=\"center-column\"],\nbody[data-islands-ui] [data-islands-part~=\"center-column\"] {\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-left: 1px solid var(--isl-border-soft);\n}\n\nbody[data-islands-ui] [data-islands-part~=\"main-panel\"] {\n  background: transparent;\n}\n\n/* Right workbench: only while a pane is open does the column render an island. */\nbody[data-islands-ui] [data-rightbar-col] {\n  background: transparent;\n}\n\nbody[data-islands-ui] [data-sidebar-right-panel][data-sidebar-right-open]:not([data-sidebar-right-panel='fullscreen']) {\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  box-shadow: var(--isl-shadow-island);\n  overflow: clip;\n}\n\n/* Drawer mask on narrow windows: Islands keeps the veil light and blurred. */\nbody[data-islands-ui] [data-sidebar-mask] {\n  background: var(--dsw-alias-bg-mask-1);\n  backdrop-filter: var(--dsw-mask-blur);\n}\n\n/* A fullscreen right pane is still mounted inside the frame's right track and\n   positioned with `right: 0`. While that track is zero-width the pane covers\n   the window almost by accident; as soon as the track has any width the pane is\n   pushed off-screen, so the window shows plain canvas while the toggle still\n   reports the pane as open. A fullscreen pane owns the window, so pin it to the\n   viewport and stop letting the grid decide where it lands. */\nbody[data-islands-ui] [data-sidebar-right-panel][data-sidebar-right-panel='fullscreen'][data-sidebar-right-open] {\n  position: fixed;\n  inset:\n    calc(var(--isl-chrome-top) + var(--isl-topbar-height) + var(--isl-gap))\n    0\n    var(--isl-gap)\n    0;\n  width: auto !important;\n  height: auto !important;\n  max-width: none !important;\n  max-height: none !important;\n  /* Above the drawer mask (70), the drawer (71) and the shell overlay (72). */\n  z-index: 78;\n}\n\n/* The shell overlay layer is where the rail and window top bar live. In\n   drawer mode it must paint above the drawer mask (70) and the drawer (71),\n   otherwise the persistent rail disappears under the open workspace drawer. */\n@media (width <= 767px) {\n  body[data-islands-ui] [data-shell-overlay] {\n    z-index: 72;\n  }\n}\n\n/* The resize handle is invisible chrome; keep it grabbable but quiet. */\nbody[data-islands-ui] [data-side=\"sidebar\"],\nbody[data-islands-ui] [data-side=\"rightbar\"] {\n  width: 10px;\n  margin-left: -5px;\n}\n\n/* The shell computes the right handle's inline `left` from the frame's\n   border-box width, but its absolute containing block is the padded grid area\n   and the panel itself sits inside the right padding. That shifts the handle\n   two gaps to the right — wholly inside the right island. Cancel the frame's\n   horizontal padding so the strip straddles the right island's left edge\n   (covering the whole canvas gap plus 5px of the panel) like the left one. */\nbody[data-islands-ui] [data-side=\"rightbar\"] {\n  margin-left: calc(-5px - 2 * var(--isl-gap));\n}\n\n/* Windows title bar keeps its native height; the frame padding already gives\n   the rounded content corner room, so only the radius is unified. */\n[data-windows-titlebar] body[data-islands-ui] [data-islands-part~=\"center-column\"] {\n  border-radius: var(--isl-radius-lg);\n}\n\n[data-windows-titlebar] body[data-islands-ui] [data-islands-part~=\"layout-frame\"] {\n  background: var(--isl-canvas);\n}\n\n/* Collapsed sidebar on macOS drops the center column's left hairline; the\n   island keeps its outline regardless. */\n[data-platform='darwin'] body[data-islands-ui] [data-sidebar-collapsed] [data-islands-part~=\"center-column\"] {\n  border-left: 1px solid var(--isl-border-soft);\n}\n\n/* ==========================================================================\n   Workbench panels (better-sidebar bottom dock + native right sidebar)\n   Both must read as independent islands, not as sheets pasted onto the\n   conversation island.\n   ========================================================================== */\n\n/* The bottom workbench reserves its height on the conversation column, not on\n   the inner panel, so the island itself shrinks and a canvas gap opens between\n   the two islands. The peer-specific rules live in 60-peers.css. */\nbody[data-islands-ui] [data-islands-part~=\"center-column\"] {\n  margin-bottom: var(--dsh-sidebar-height, 0px);\n  transition: margin-bottom var(--ds-transition-duration-slow) var(--ds-ease-in-out);\n}\n\n/* The native right sidebar keeps its own width preference, which can exceed\n   the track the frame grants; clamp it to the track so it never hangs over\n   the conversation island. */\nbody[data-islands-ui] [data-sidebar-right-panel][data-sidebar-right-open]:not([data-sidebar-right-panel='fullscreen']) {\n  box-sizing: border-box;\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  body[data-islands-ui] [data-islands-part~=\"center-column\"] {\n    transition: none;\n  }\n}\n\n/* ==========================================================================\n   Independent workspace collapse\n   The DSH collapse swaps the whole sidebar render tree for its rail-only\n   variant. Instead the expanded rail stays mounted and only the workspace\n   column hides, so the left column never re-renders or re-flows.\n   ========================================================================== */\n\n/* The width handle keeps its expanded inline position while the workspace is\n   collapsed, which would leave an invisible drag target over the conversation.\n   The workspace must be expanded to resize it. */\nbody[data-islands-ui][data-islands-workspace-collapsed] [data-side=\"sidebar\"] {\n  display: none;\n}\n\n/* The right column must keep its own track while the workspace is collapsed.\n   Pin it to 0 only while the right pane is closed; when it opens, use the\n   pane's PREFERRED width (published by the client). Reading the current\n   column width here deadlocks: it is 0 while closed, so opening the pane\n   could never grow the track, and the panel's `width: 100%` clamp would keep\n   it at two border pixels. The fallback keeps the pane visible even before\n   the width source has been located. */\nbody[data-islands-ui][data-islands-workspace-collapsed]\n  [data-islands-part~=\"layout-frame\"]:not(\n    :has([data-sidebar-right-panel][data-sidebar-right-open]:not([data-sidebar-right-panel='fullscreen']))\n  ) {\n  grid-template-columns:\n    var(--isl-rail-collapsed-width) minmax(0, 1fr) 0 !important;\n}\n\nbody[data-islands-ui][data-islands-workspace-collapsed]\n  [data-islands-part~=\"layout-frame\"]:has(\n    [data-sidebar-right-panel][data-sidebar-right-open]:not([data-sidebar-right-panel='fullscreen'])\n  ) {\n  grid-template-columns:\n    var(--isl-rail-collapsed-width) minmax(0, 1fr)\n    var(--isl-rightbar-w, max(300px, 45vw)) !important;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"layout-frame\"][data-islands-animating] {\n  transition: grid-template-columns var(--ds-transition-duration-slow) var(--ds-ease-in-out);\n}\n\n/* ---- 15-topbar.css ---- */\n/* ==========================================================================\n   Islands UI · 15 top bar\n   A window-chrome strip above the three islands on platforms that need one.\n   It clears the macOS traffic lights and docks the header tools; Windows\n   renders neither, using its native caption row and conversation header.\n   ========================================================================== */\n\n/* Registered even when the skin is off; the base rule keeps it out of the way. */\n.isl-topbar {\n  display: none;\n}\n\nbody[data-islands-ui] .isl-topbar {\n  position: fixed;\n  inset: var(--isl-chrome-top) 0 auto;\n  z-index: 30;\n  box-sizing: border-box;\n  display: flex;\n  align-items: flex-start;\n  gap: 6px;\n  height: var(--isl-topbar-height);\n  /* macOS centers the traffic lights in its 48px window-chrome band; the\n     controls follow that center (10 + 14 = 24), not the 40px bar's own. */\n  padding: 10px 10px 0 8px;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 13px;\n  line-height: 20px;\n  /* The bar itself must never swallow clicks meant for controls that are\n     docked over it; only the toggle and the drag handle opt back in. */\n  pointer-events: none;\n  -webkit-app-region: no-drag;\n  user-select: none;\n}\n\n/* Left lead (traffic-light strip) and the centre of the bar are draggable;\n   both stop short of the docked controls so clicks keep working. */\n/* The 88px lead exists only for the macOS traffic lights. */\nbody[data-islands-ui] .isl-topbarLead {\n  display: none;\n}\n\nhtml[data-platform='darwin'] body[data-islands-ui] .isl-topbar {\n  padding-left: 88px;\n}\n\nhtml[data-platform='darwin'] body[data-islands-ui] .isl-topbarLead {\n  position: absolute;\n  inset: 0 auto 0 0;\n  display: block;\n  width: 88px;\n  pointer-events: auto;\n  -webkit-app-region: drag;\n}\n\nbody[data-islands-ui] .isl-topbarDrag {\n  flex: 1;\n  align-self: stretch;\n  min-width: 0;\n  margin-right: 250px;\n  pointer-events: auto;\n  -webkit-app-region: drag;\n}\n\n/* Windows has no island top bar: every control lives in the native caption row\n   or the conversation header, so the strip and its 40px reservation are gone. */\nhtml[data-windows-titlebar] body[data-islands-ui] .isl-topbar {\n  display: none;\n}\n\nbody[data-islands-ui] .isl-topbarToggle {\n  box-sizing: border-box;\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: 0;\n  border-radius: var(--isl-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  pointer-events: auto;\n  -webkit-app-region: no-drag;\n}\n\nbody[data-islands-ui] .isl-topbarToggle:hover {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-topbarToggle:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: -2px;\n}\n\n/* Narrow desktop: the top bar remains the window chrome (drag strip + right\n   panel toggle), but the rail's home button owns the workspace drawer. The\n   chrome must paint above the drawer mask (70) and the drawer (71). */\n@media (width <= 767px) {\n  body[data-islands-ui] .isl-topbar {\n    z-index: 72;\n  }\n\n  body[data-islands-ui] .isl-topbarToggle {\n    display: none;\n  }\n\n  body[data-islands-ui] .isl-topbarDrag {\n    margin-right: 40px;\n  }\n}\n\n/* ---- 16-rail.css ---- */\n/* ==========================================================================\n   Islands UI · 16 left rail\n   Every registered panel launcher lives directly in the rail. Drag an icon to\n   reorder it; right-click the rail to show or hide launchers.\n   ========================================================================== */\n\n/* Registered even while the skin is off; the base rule keeps the launchers\n   out of the page until the attribute says otherwise. */\n.isl-rail {\n  display: none;\n}\n\n.isl-railGhost {\n  display: none;\n}\n\nbody[data-islands-ui] .isl-rail {\n  position: fixed;\n  top: calc(var(--isl-chrome-top) + var(--isl-topbar-height) + 10px);\n  left: var(--isl-gap);\n  z-index: 25;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 4px;\n  width: var(--isl-rail-width);\n  /* Reserve the measured foot stack plus the fixed band above it: one foot\n     gap, the gear, and one more gap before the list. The fallback is the bare\n     account row, so a shell without the measure keeps the shipped geometry. */\n  max-height: calc(\n    100vh - var(--isl-chrome-top) - var(--isl-topbar-height)\n      - var(--isl-foot-height, 36px) - var(--isl-foot-gap) - 36px - var(--isl-foot-gap)\n  );\n  padding: 2px 6px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  scrollbar-width: none;\n  pointer-events: auto;\n  user-select: none;\n}\n\nbody[data-islands-ui] .isl-rail::-webkit-scrollbar {\n  width: 0;\n  height: 0;\n}\n\n/* The settings seat on the sidebar foot renders a launcher into a host slot\n   with no skin wrapper, so the button hides itself when the skin is off. */\n.isl-railBtn {\n  display: none;\n}\n\nbody[data-islands-ui] .isl-railBtn {\n  box-sizing: border-box;\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  border: 0;\n  border-radius: var(--isl-radius-md);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  touch-action: none;\n  transition:\n    background-color 0.12s var(--ds-ease-in-out),\n    color 0.12s var(--ds-ease-in-out),\n    opacity 0.12s var(--ds-ease-in-out);\n}\n\nbody[data-islands-ui] .isl-railBtn:hover {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\n/* ---- Hover label ------------------------------------------------------- */\n/* The rail clips horizontally (`overflow-x: hidden`) and scrolls vertically,\n   so the label cannot be a pseudo-element of the tile: it is a fixed-position\n   pill portalled to <body> and parked just right of the hovered tile, centred\n   on it. It never takes pointer events, so it cannot steal the hover it\n   belongs to. */\nbody[data-islands-ui] .isl-railTip {\n  position: fixed;\n  z-index: 1200;\n  box-sizing: border-box;\n  max-width: 220px;\n  padding: 6px 12px;\n  border-radius: 10px;\n  background: var(--isl-tooltip-bg);\n  box-shadow:\n    0 0 0 1px var(--isl-tooltip-ring),\n    var(--isl-tooltip-shadow);\n  color: var(--isl-tooltip-fg);\n  font-family: inherit;\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 18px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  pointer-events: none;\n  user-select: none;\n  transform: translateY(-50%);\n  animation: isl-rail-tip-in 120ms var(--ds-ease-in-out) both;\n}\n\n@keyframes isl-rail-tip-in {\n  from {\n    opacity: 0;\n    transform: translate(-4px, -50%);\n  }\n\n  to {\n    opacity: 1;\n    transform: translate(0, -50%);\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  body[data-islands-ui] .isl-railTip {\n    animation: none;\n  }\n}\n\n/* The house is a pure navigation trigger (conversation / workspace drawer),\n   not a destination in the panel model. It has no persistent selected state;\n   hover keeps the standard rail feedback and a click paints a translucent\n   ripple clipped to the rounded tile. */\nbody[data-islands-ui] .isl-railBtn[data-rail-id='workspace'] {\n  position: relative;\n  overflow: hidden;\n}\n\nbody[data-islands-ui] .isl-railRipple {\n  position: absolute;\n  display: block;\n  border-radius: 50%;\n  background: currentColor;\n  pointer-events: none;\n  transform: translate(-50%, -50%) scale(0.2);\n  animation: isl-rail-ripple 560ms cubic-bezier(0.2, 0.6, 0.3, 1) forwards;\n  will-change: transform, opacity;\n}\n\n@keyframes isl-rail-ripple {\n  0% {\n    transform: translate(-50%, -50%) scale(0.2);\n    opacity: 0.2;\n  }\n\n  100% {\n    transform: translate(-50%, -50%) scale(1);\n    opacity: 0;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  body[data-islands-ui] .isl-railRipple {\n    animation-duration: 1ms;\n  }\n}\n\nbody[data-islands-ui] .isl-railBtn.is-active {\n  background: var(--isl-active);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-railBtn:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: -2px;\n}\n\nbody[data-islands-ui] .isl-rail.is-dragging,\nbody[data-islands-ui] .isl-rail.is-dragging .isl-railBtn {\n  cursor: grabbing;\n}\n\nbody[data-islands-ui] .isl-railBtn.is-dragging {\n  background: var(--isl-active);\n  opacity: 0.45;\n}\n\n/* Floating copy of the dragged icon; follows the pointer at 90% opacity. */\nbody[data-islands-ui] .isl-railGhost {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 1200;\n  box-sizing: border-box;\n  display: grid;\n  place-items: center;\n  width: 36px;\n  height: 36px;\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-md);\n  background: var(--isl-surface);\n  box-shadow: var(--isl-shadow-float);\n  color: var(--dsw-alias-label-primary);\n  opacity: 0.9;\n  pointer-events: none;\n  will-change: transform;\n}\n\nbody[data-islands-ui] .isl-railAdd {\n  color: var(--dsw-alias-label-tertiary);\n}\n\nbody[data-islands-ui] .isl-railDivider {\n  flex: none;\n  width: 24px;\n  height: 1px;\n  margin: 2px 0;\n  background: var(--isl-border-soft);\n}\n\n/* ---- Rail management menu --------------------------------------------- */\nbody[data-islands-ui] .isl-railMenu {\n  position: fixed;\n  z-index: 35;\n  box-sizing: border-box;\n  width: 248px;\n  max-height: min(60vh, 440px);\n  padding: 6px;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  scrollbar-width: thin;\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-md);\n  background: var(--isl-surface);\n  box-shadow: var(--isl-shadow-float);\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  line-height: 20px;\n  user-select: none;\n}\n\nbody[data-islands-ui] .isl-railMenuTitle {\n  padding: 4px 8px 6px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 16px;\n}\n\nbody[data-islands-ui] .isl-railMenuRow {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  min-height: 36px;\n  padding: 5px 8px;\n  border: 0;\n  border-radius: var(--isl-radius-sm);\n  background: transparent;\n  color: inherit;\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-railMenuRow:hover,\nbody[data-islands-ui] .isl-railMenuRow.is-current {\n  background: var(--isl-hover);\n}\n\nbody[data-islands-ui] .isl-railMenuRow.is-hidden .isl-railMenuIcon,\nbody[data-islands-ui] .isl-railMenuRow.is-hidden .isl-railMenuText {\n  opacity: 0.5;\n}\n\nbody[data-islands-ui] .isl-railMenuIcon {\n  display: inline-flex;\n  flex: none;\n  color: var(--dsw-alias-label-secondary);\n}\n\nbody[data-islands-ui] .isl-railMenuText {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  gap: 1px;\n  min-width: 0;\n}\n\nbody[data-islands-ui] .isl-railMenuLabel {\n  min-width: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-railMenuSub {\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 10px;\n  line-height: 14px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-railMenuCheck {\n  box-sizing: border-box;\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 18px;\n  height: 18px;\n  border: 1px solid var(--isl-border-soft);\n  border-radius: 6px;\n  color: transparent;\n}\n\nbody[data-islands-ui] .isl-railMenuCheck.is-on {\n  border-color: transparent;\n  background: color-mix(in srgb, var(--isl-accent) 14%, transparent);\n  color: var(--isl-accent);\n}\n\nbody[data-islands-ui] .isl-railMenuHint {\n  margin-top: 4px;\n  padding: 6px 8px 2px;\n  border-top: 1px solid var(--isl-border-soft);\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 10px;\n  line-height: 14px;\n}\n\nbody[data-islands-ui] .isl-railMenuEmpty {\n  padding: 8px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n}\n\n/* Settings gear pinned above the account avatar. The offset is the measured\n   foot stack plus the rail gap: contributed footer actions grow the stack and\n   the gear moves with it instead of sitting on their row. */\nbody[data-islands-ui] .isl-railSettings {\n  display: none;\n}\n\nbody[data-islands-ui] .isl-railSettings {\n  position: fixed;\n  left: calc(var(--isl-gap) + (var(--isl-rail-width) - 36px) / 2);\n  bottom: calc(var(--isl-foot-height, 36px) + var(--isl-foot-gap));\n  z-index: 26;\n  display: grid;\n  place-items: center;\n}\n\n/* Narrow desktop: the rail is the persistent navigation; the workspace is a\n   drawer opened from its home button. Both the rail and its menus must sit\n   above the drawer (71) and the drawer mask (70). */\n@media (width <= 767px) {\n  body[data-islands-ui] .isl-rail {\n    z-index: 72;\n  }\n\n  body[data-islands-ui] .isl-railSettings {\n    z-index: 72;\n  }\n\n  body[data-islands-ui] .isl-railMenu {\n    z-index: 1100;\n  }\n}\n\n/* ---- 17-update.css ---- */\n/* ==========================================================================\n   Islands UI · 17 desktop update\n   One 30px circular update entry above the settings gear. The skin owns the\n   whole surface: the shipped indicator lives in the settings row, overflows\n   beside the account avatar and exposes no phase attribute.\n\n   Busy phases draw a progress ring inside the disc edge. `downloading` is\n   determinate (`percent` from `dshDesktop.updates`); `verifying` and\n   `installing` carry no percentage, so the same ring runs an indeterminate\n   sweep — steady for verification, faster and breathing while the app\n   prepares to restart.\n   ========================================================================== */\n\n/* The native indicator (and its tiny toggle badge) would duplicate the rail\n   button. The walker marks both seats, so the rules survive a host rebuild\n   without naming a hashed class. */\nbody[data-islands-ui] [data-islands-part~=\"update-indicator\"],\nbody[data-islands-ui] [data-islands-part~=\"update-badge\"] {\n  display: none !important;\n}\n\nbody[data-islands-ui] {\n  /* The update entry is an accent surface like the send button and the caret:\n     it reads the business token, which the skin remaps to the user's accent.\n     Deriving the hover shade here keeps the two in step — a separate literal\n     would stay brand blue while everything else moved. */\n  --isl-update-bg: var(--dsw-alias-state-business-primary);\n  --isl-update-bg-hover: color-mix(in srgb, var(--isl-update-bg) 88%, #111214);\n  --isl-update-danger: #d93a40;\n  /* Ring on the accent disc: white bar, translucent track. */\n  --isl-update-ring-bar: #fff;\n  --isl-update-ring-track: rgba(255, 255, 255, 0.22);\n}\n\nbody[data-islands-ui][data-ds-dark-theme] {\n  --isl-update-bg-hover: color-mix(in srgb, var(--isl-update-bg) 88%, #fff);\n  --isl-update-danger: #ff6369;\n}\n\nbody[data-islands-ui] .isl-updateButton {\n  position: fixed;\n  left: calc(var(--isl-gap) + (var(--isl-rail-width) - 30px) / 2);\n  /* Stacked above the gear, so it follows the measured foot stack too. The\n     36px below is the gear tile, not this button. */\n  bottom: calc(\n    var(--isl-foot-height, 36px) + var(--isl-foot-gap) + 36px + var(--isl-update-gap)\n  );\n  z-index: 26;\n  box-sizing: border-box;\n  display: grid;\n  place-items: center;\n  width: 30px;\n  height: 30px;\n  margin: 0;\n  padding: 0;\n  border: 1px solid transparent;\n  border-radius: 50%;\n  background: var(--isl-update-bg);\n  color: #fff;\n  cursor: default;\n  /* Flat on purpose: the disc is the whole entry, and a coloured shadow made a\n     30px button read as a floating pill that competed with the rail tiles. */\n  box-shadow: none;\n  transition:\n    background-color 0.15s var(--ds-ease-in-out),\n    transform 0.15s var(--ds-ease-in-out),\n    border-color 0.15s var(--ds-ease-in-out);\n}\n\nbody[data-islands-ui] .isl-updateButton.is-clickable {\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-updateButton.is-clickable:hover {\n  background: var(--isl-update-bg-hover);\n  transform: translateY(-1px);\n}\n\nbody[data-islands-ui] .isl-updateButton.is-clickable:active {\n  transform: translateY(0) scale(0.96);\n}\n\nbody[data-islands-ui] .isl-updateButton:focus-visible {\n  outline: 2px solid color-mix(in srgb, var(--isl-update-bg) 40%, transparent);\n  outline-offset: 2px;\n}\n\n/* The click guard between pressing the entry and the update panel opening.\n   It must not fade the element: `opacity` lightened the surface towards the\n   canvas, so the entry read as a pale disc. Keep the surface saturated and\n   drop the lift; the hover state is covered too because the pointer is still\n   resting on the button while the panel opens. */\nbody[data-islands-ui] .isl-updateButton.is-pending,\nbody[data-islands-ui] .isl-updateButton.is-pending.is-clickable:hover {\n  background: var(--isl-update-bg-hover);\n  transform: none;\n  cursor: default;\n}\n\n/* Busy phases keep the circle but let the matrix carry the state. */\nbody[data-islands-ui] .isl-updateButton[aria-busy='true'] {\n  cursor: default;\n}\n\n/* Error: a translucent danger surface, danger stroke, status dot and a retry\n   glyph. The dot keeps the state readable without relying on color alone. */\nbody[data-islands-ui] .isl-updateButton.is-error {\n  border-color: color-mix(in srgb, var(--isl-update-danger) 55%, transparent);\n  background: color-mix(in srgb, var(--isl-update-danger) 14%, transparent);\n  color: var(--isl-update-danger);\n}\n\nbody[data-islands-ui] .isl-updateButton.is-error.is-clickable:hover {\n  border-color: color-mix(in srgb, var(--isl-update-danger) 72%, transparent);\n  background: color-mix(in srgb, var(--isl-update-danger) 22%, transparent);\n}\n\nbody[data-islands-ui] .isl-updateButton.is-error:focus-visible {\n  outline-color: color-mix(in srgb, var(--isl-update-danger) 55%, transparent);\n}\n\n/* Busy phases keep the accent disc: the ring is the state, the disc is the\n   surface it belongs to. */\nbody[data-islands-ui] .isl-updateButton.is-downloading,\nbody[data-islands-ui] .isl-updateButton.is-verifying,\nbody[data-islands-ui] .isl-updateButton.is-installing {\n  cursor: default;\n}\n\nbody[data-islands-ui] .isl-updateErrorDot {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 5px;\n  height: 5px;\n  border-radius: 50%;\n  background: var(--isl-update-danger);\n  box-shadow: 0 0 0 1.5px var(--isl-surface);\n}\n\n/* ---- Progress ring ------------------------------------------------------ */\n\n/* Covers the 1px transparent border as well (`inset: -1px`). The circle is\n   r=12 with a 2px stroke, so the ring sits 2px inside the disc edge: that rim\n   keeps the arc from reading as a border and leaves room for the round caps. */\nbody[data-islands-ui] .isl-updateRing {\n  position: absolute;\n  inset: -1px;\n  /* Start the arc at twelve o’clock. */\n  transform: rotate(-90deg);\n  pointer-events: none;\n}\n\nbody[data-islands-ui] .isl-updateRing circle {\n  fill: none;\n  stroke-width: 2;\n}\n\nbody[data-islands-ui] .isl-updateRingTrack {\n  stroke: var(--isl-update-ring-track);\n}\n\nbody[data-islands-ui] .isl-updateRingBar {\n  stroke: var(--isl-update-ring-bar);\n  stroke-linecap: round;\n  /* The circle carries pathLength=\"100\", so the dash is a plain percentage. */\n  transition: stroke-dasharray 0.3s var(--ds-ease-in-out);\n}\n\n/* Verification: one steady sweep around the ring. */\nbody[data-islands-ui] .isl-updateRing.is-verify .isl-updateRingBar {\n  stroke-dasharray: 24 76;\n  animation: isl-update-ring-sweep 1.6s linear infinite;\n}\n\n/* Installation: the same sweep, faster, breathing while the app packs up. */\nbody[data-islands-ui] .isl-updateRing.is-install .isl-updateRingBar {\n  stroke-dasharray: 24 76;\n  animation:\n    isl-update-ring-sweep 0.9s linear infinite,\n    isl-update-ring-breathe 1.2s var(--ds-ease-in-out) infinite;\n}\n\n@keyframes isl-update-ring-sweep {\n  from {\n    stroke-dashoffset: 0;\n  }\n\n  to {\n    stroke-dashoffset: -100;\n  }\n}\n\n@keyframes isl-update-ring-breathe {\n  0%,\n  100% {\n    opacity: 1;\n  }\n\n  50% {\n    opacity: 0.55;\n  }\n}\n\n/* Narrow desktop: the rail floats above the workspace drawer. */\n@media (width <= 767px) {\n  body[data-islands-ui] .isl-updateButton {\n    z-index: 72;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  body[data-islands-ui] .isl-updateButton {\n    transition: none;\n  }\n\n  body[data-islands-ui] .isl-updateRingBar {\n    transition: none;\n    animation: none !important;\n  }\n\n  /* No sweep: hold a static quarter arc so the ring still reads as \"working\". */\n  body[data-islands-ui] .isl-updateRing.is-verify .isl-updateRingBar,\n  body[data-islands-ui] .isl-updateRing.is-install .isl-updateRingBar {\n    stroke-dasharray: 24 76;\n  }\n}\n\n/* ---- 20-sidebar.css ---- */\n/* ==========================================================================\n   Islands UI · 20 sidebar\n   The expanded sidebar is one full-height island: a persistent icon rail on\n   the left and the workspace browser on the same surface. The island spans the\n   exact same top and bottom edges as the conversation island. Collapsed mode\n   keeps the shipped rail untouched.\n   ========================================================================== */\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"] {\n  background: transparent;\n}\n\n/* ---- Expanded: chrome rail + workspace island --------------------------- */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) {\n  display: grid;\n  grid-template-columns: var(--isl-rail-width) minmax(0, 1fr);\n  grid-template-rows: var(--isl-gap) auto minmax(0, 1fr) auto auto;\n  column-gap: var(--isl-gap);\n  padding: 0;\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  overflow: hidden;\n  position: relative;\n  isolation: isolate;\n}\n\n/* The workspace browser is the sidebar's only island. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"])::after {\n  content: '';\n  position: absolute;\n  z-index: -1;\n  inset: 0 0 0 calc(var(--isl-rail-width) + var(--isl-gap));\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  box-shadow: var(--isl-shadow-island);\n  pointer-events: none;\n}\n\n/* The top band is a small breathing gap inside the sidebar column. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"sidebar-top-strip\"] {\n  grid-area: 1 / 1 / 2 / -1;\n  height: 100%;\n  margin: 0;\n  padding: 0 4px 0 0;\n  justify-content: flex-end;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"logo-row\"] {\n  grid-area: 2 / 1;\n  height: 36px;\n  margin: 0 0 6px;\n  padding: 0;\n  justify-content: center;\n  overflow: visible;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"brand-button\"] {\n  justify-content: center;\n  overflow: visible;\n}\n\n/* The brand wordmark and build stamp belong to window chrome, not the rail. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"brand-name\"],\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"local-build-brand\"] {\n  display: none;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"brand-mark\"] {\n  width: 28px;\n  height: 28px;\n}\n\n/* Two host shapes share this rule set: before 0.2.2-rc.3 the button itself is\n   the sidebar grid item; from rc.3 a `newSessionRow` wrapper carries the\n   session-action slot and is the grid item. The button keeps its grid-area so\n   the older shape still lays out; inside the row the property is inert and the\n   row owns the outer margin. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"new-session\"] {\n  grid-area: 2 / 2;\n  height: 36px;\n  margin: 0 6px 6px;\n  padding: 0 8px;\n  justify-content: flex-start;\n  border: 0;\n  border-radius: var(--isl-radius-md);\n  background: transparent;\n  box-shadow: none;\n  color: var(--dsw-alias-label-primary);\n  font-weight: 400;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"new-session-row\"] {\n  grid-area: 2 / 2;\n  height: 36px;\n  margin: 0 6px 6px;\n  padding: 0;\n  align-items: center;\n}\n\n/* rc.3: the row owns the outer spacing; the button fills it. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"new-session-row\"] [data-islands-part~=\"new-session\"] {\n  margin: 0;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"new-session-content\"] {\n  justify-content: flex-start;\n  width: 100%;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"new-session\"]:hover {\n  background: var(--isl-hover);\n}\n\n/* The global panel list becomes the rail's primary navigation. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"panel-list\"] {\n  grid-area: 3 / 1;\n  align-self: start;\n  align-items: center;\n  gap: 4px;\n  margin: 2px 0 0;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"panel-row\"] {\n  width: 36px;\n  height: 36px;\n  justify-content: center;\n  padding: 0;\n  border: 0;\n  border-radius: var(--isl-radius-md);\n  background-clip: border-box;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"panel-row\"][data-islands-part~=\"panel-active\"] {\n  background: var(--dsw-specific-sidebar-nav-item-active-accent);\n  color: var(--dsw-alias-state-business-primary);\n}\n\n/* The label leaves the visual rail but stays in the accessibility tree. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"panel-title\"] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  clip: rect(0 0 0 0);\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n/* ---- Workspace browser: same surface, full height ----------------------- */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"region-area\"] {\n  grid-area: 3 / 2 / 5 / 3;\n  margin: 0;\n  padding: 0 4px 0;\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  overflow: hidden;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"region-area\"] {\n  --dsh-session-list-edge-inset: 4px;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"section-header\"] {\n  padding-inline: 8px;\n  margin-right: 0;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  letter-spacing: 0.01em;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"section-label\"] {\n  font-weight: 500;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"list\"] {\n  padding-bottom: 8px;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"list-fade\"] {\n  background: linear-gradient(to bottom, transparent, var(--isl-surface));\n}\n\nbody[data-islands-ui] [data-row-key^=\"session:\"],\nbody[data-islands-ui] [data-row-key^=\"workspace:\"] {\n  border-radius: var(--isl-radius-sm);\n  padding-inline: 8px;\n}\n\n/* ---- Rail foot: settings gear ------------------------------------------\n   `foot-area` is the host's wrapper for `footer-actions` + `settings-area`.\n   In the expanded layout the two children take different seats, so the\n   wrapper becomes layout-neutral: settings keeps the rail's bottom-left\n   corner and footer actions take the workspace column's bottom row. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"foot-area\"] {\n  display: contents;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"settings-area\"] {\n  /* Spans the settings row and the footer row, bottom-aligned, so the account\n     stays at the rail's bottom edge whatever height the footer takes. */\n  grid-area: 4 / 1 / 6 / 2;\n  align-self: end;\n  display: flex;\n  flex-direction: column;\n  width: auto;\n  align-items: center;\n  justify-content: center;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"settings-trigger-row\"] {\n  flex-direction: column;\n  width: auto;\n  height: auto;\n  margin: 4px 0 2px;\n  gap: 2px;\n  justify-content: center;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-slot=\"sidebar\"] button[aria-haspopup=\"dialog\"] {\n  flex: none;\n  width: 36px;\n  height: 36px;\n  margin: 0;\n  padding: 0;\n  justify-content: center;\n  border-inline: 0;\n  border-radius: var(--isl-radius-md);\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"settings-trigger-label\"] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  clip: rect(0 0 0 0);\n  white-space: nowrap;\n  overflow: hidden;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-slot=\"sidebar\"] button[aria-haspopup=\"dialog\"]:hover,\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-slot=\"sidebar\"] button[aria-haspopup=\"dialog\"][aria-expanded='true'] {\n  background: var(--isl-hover);\n}\n\n/* ---- Workspace footer: plugin footer actions ----------------------------\n   `sidebar.footer.action` is a WIDE seat at the bottom of the workspace\n   island, not a 48px rail tile. The host already reports `wide` because the\n   sidebar is expanded; giving the seat the workspace column's width makes that\n   contract true again, so wide-aware plugins (cost meters, gateways) render\n   their normal layout instead of overflowing a narrow rail.\n\n   The skin owns the CONTAINER, not the guest: it stacks the footer under the\n   workspace, caps/collapses it, lets it scroll, and remembers the height.\n   Guest geometry is not rewritten here; the 36px-tile normalization now lives\n   on the collapsed rail below. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"footer-actions\"] {\n  grid-area: 5 / 2;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  /* The seat is a vertical stack. `wrap` would turn a vertical overflow into\n     extra columns to the right, pushing the other guests out of the island. */\n  flex-wrap: nowrap;\n  align-items: stretch;\n  gap: 6px;\n  width: 100%;\n  min-width: 0;\n  margin: 0;\n  /* The top gap is the click bar's seat. No border: the gap is the separator. */\n  padding: 20px 8px 8px;\n  /* The controller publishes the floor: min(200px, natural content height).\n     A short guest therefore keeps the seat at its own height instead of\n     carrying blank space, while a restored height can never clip content. */\n  min-height: var(--isl-footer-min, 0px);\n  height: var(--isl-footer-height, auto);\n  max-height: var(--isl-footer-max, 800px);\n  /* Vertical overflow stays inside the seat; a guest that is wider than the\n     island must wrap or scroll inside itself, never widen the footer. The\n     scrollbar is hidden like the rail's: a 5px bar inside a 227px seat is\n     visual noise, and the wheel/trackpad still scrolls. */\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  scrollbar-width: none;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"footer-actions\"]::-webkit-scrollbar {\n  width: 0;\n  height: 0;\n}\n\n/* Direct guests are flex items of that column. Cap their width so a guest with\n   its own intrinsic width cannot push its siblings out of the island, and keep\n   their height: a guest taller than the seat should scroll, not be squashed. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"footer-actions\"] > [data-slot=\"sidebar.footer.action\"] > *,\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"footer-actions\"] > * {\n  min-width: 0;\n  max-width: 100%;\n  flex-shrink: 0;\n}\n\n/* The click bar is the skin's affordance for collapse/expand and the opaque\n   mask over the footer's top gap. It is portalled to <body> so React never\n   reconciles it away and the footer's own scroll clip cannot cut it. */\n.isl-footerHandle {\n  display: none;\n}\n\nbody[data-islands-ui] .isl-footerHandle {\n  position: fixed;\n  z-index: 30;\n  box-sizing: border-box;\n  display: grid;\n  place-items: center;\n  width: auto;\n  min-width: 0;\n  height: 20px;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n  background: var(--isl-surface, #fff);\n  color: var(--dsw-alias-label-tertiary);\n  cursor: pointer;\n  touch-action: none;\n  user-select: none;\n  -webkit-user-select: none;\n  transition: color 0.12s var(--ds-ease-in-out);\n}\n\n/* Rounded full-row highlight drawn above the opaque mask. */\n.isl-footerHandle::before {\n  content: '';\n  position: absolute;\n  inset: 1px 0;\n  border-radius: var(--isl-radius-sm);\n  background: var(--isl-hover);\n  opacity: 0;\n  transition: opacity 0.25s var(--ds-ease-in-out);\n}\n\n.isl-footerHandle:hover::before,\n.isl-footerHandle.is-dragging::before {\n  opacity: 1;\n}\n\n/* The resize strip sits 5px ABOVE the bar, outside the button's hit area, so\n   the click target and the height-drag target never overlap. */\n.isl-footerResize {\n  display: none;\n}\n\nbody[data-islands-ui] .isl-footerResize {\n  position: fixed;\n  z-index: 30;\n  display: block;\n  height: 5px;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  cursor: row-resize;\n  touch-action: none;\n}\n\n.isl-footerResize[hidden] {\n  display: none;\n}\n\n/* Accent bar while the resize strip is hovered or dragged: the trigger area\n   itself lights up, not just the row below it. */\n.isl-footerResize::before {\n  content: '';\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 50%;\n  height: 3px;\n  transform: translateY(-50%);\n  border-radius: 999px;\n  background: var(--dsw-alias-state-business-primary);\n  opacity: 0;\n  transition: opacity 0.12s var(--ds-ease-in-out);\n}\n\n.isl-footerResize:hover::before,\n.isl-footerResize.is-dragging::before {\n  opacity: 1;\n}\n\n.isl-footerHandle svg {\n  position: relative;\n  z-index: 1;\n  transition: transform 0.15s var(--ds-ease-in-out);\n}\n\n.isl-footerHandle[hidden] {\n  display: none;\n}\n\n.isl-footerHandle[aria-expanded='true'] svg {\n  transform: rotate(180deg);\n}\n\n.isl-footerHandle:hover,\n.isl-footerHandle:focus-visible {\n  color: var(--dsw-alias-label-secondary);\n}\n\n.isl-footerHandle:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: 2px;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .isl-footerHandle,\n  .isl-footerHandle::before,\n  .isl-footerHandle svg {\n    transition: none;\n  }\n}\n\n/* Narrow desktop: the workspace is a drawer (mask 70, panel 71, rail 72).\n   The body-level bar and resize strip must paint above it; the controller\n   repositions them on drawer transitions. */\n@media (width <= 767px) {\n  .isl-footerHandle,\n  .isl-footerResize {\n    z-index: 72;\n  }\n}\n\n/* Collapsed: the footer keeps only the handle strip; the workspace gets the\n   space back. The slot content (not the handle, which lives on <body>) is what\n   disappears. */\nbody[data-islands-ui][data-islands-footer-collapsed] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"footer-actions\"] {\n  height: 20px;\n  min-height: 20px;\n  max-height: 20px;\n  /* Keep the same horizontal inset as the expanded footer so the bar does\n     not jump wider when the panel collapses. */\n  padding: 0 8px;\n  overflow: hidden;\n}\n\n/* The collapsed bar is the island's bottom cap: follow the card's bottom\n   rounding instead of covering it with square corners. */\nbody[data-islands-ui][data-islands-footer-collapsed] .isl-footerHandle {\n  border-bottom-left-radius: calc(var(--isl-radius-lg) - 1px);\n  border-bottom-right-radius: calc(var(--isl-radius-lg) - 1px);\n}\n\nbody[data-islands-ui][data-islands-footer-collapsed] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"footer-actions\"] > [data-slot=\"sidebar.footer.action\"] {\n  /* The host writes `style=\"display: contents\"` on the outlet wrapper, so the\n     collapsed hide must beat the inline declaration. */\n  display: none !important;\n}\n\n/* No guest content: hide the seat entirely so the workspace keeps full\n   height; the controller owns the `data-islands-footer-empty` marker. */\nbody[data-islands-ui][data-islands-footer-empty] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"footer-actions\"] {\n  display: none;\n}\n\n/* ---- Collapsed rail: guest footer controls ------------------------------\n   In the 48px rail the host reports a narrow foot of additive actions, so the\n   1.2.2 normalization stays here only: every top-level guest control becomes a\n   36px tile and an icon-bearing control's text label moves to the accessible\n   tree. The expanded footer above is a wide seat and must NOT inherit these\n   pixel rules. The host wraps every slot outlet in a `display: contents`\n   `[data-slot]` anchor, so each rule names the anchor path and the direct\n   child fallback. */\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > [data-slot=\"sidebar.footer.action\"] > :is(button, a, [role='button']),\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > :is(button, a, [role='button']) {\n  box-sizing: border-box !important;\n  flex: none !important;\n  align-items: center !important;\n  justify-content: center !important;\n  gap: 0 !important;\n  width: 36px !important;\n  min-width: 0 !important;\n  max-width: 36px !important;\n  height: 36px !important;\n  min-height: 0 !important;\n  max-height: 36px !important;\n  margin: 3px 0 !important;\n  padding: 0 !important;\n  overflow: clip !important;\n  white-space: nowrap !important;\n  border-radius: var(--isl-radius-md);\n  cursor: pointer;\n  transition: background-color 0.12s var(--ds-ease-in-out);\n}\n\n/* Icon-bearing controls: hide only the bare text span (an icon wrapper may\n   itself be a span and must stay visible). This is a visual hide rather than\n   `display: none`, so a plugin without an aria-label keeps its accessible\n   name. Controls with no icon keep their label and are clipped instead. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > [data-slot=\"sidebar.footer.action\"] > :is(button, a, [role='button']):has(svg, img) > span:not(:has(*)),\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > :is(button, a, [role='button']):has(svg, img) > span:not(:has(*)) {\n  position: absolute !important;\n  width: 1px !important;\n  height: 1px !important;\n  clip: rect(0 0 0 0) !important;\n  white-space: nowrap !important;\n  overflow: hidden !important;\n}\n\n/* Guest tiles borrow the rail's interaction states. The background needs\n   `!important` because plugins commonly write `background: transparent`\n   inline, which would otherwise leave the tile with no feedback. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > [data-slot=\"sidebar.footer.action\"] > :is(button, a, [role='button']):hover,\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > :is(button, a, [role='button']):hover {\n  background: var(--isl-hover) !important;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > [data-slot=\"sidebar.footer.action\"] > :is(button, a, [role='button']):focus-visible,\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > :is(button, a, [role='button']):focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary)) !important;\n  outline-offset: 1px;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > [data-slot=\"sidebar.footer.action\"] > :is(button, a, [role='button'])[aria-pressed='true'],\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > [data-slot=\"sidebar.footer.action\"] > :is(button, a, [role='button'])[aria-expanded='true'],\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > :is(button, a, [role='button'])[aria-pressed='true'],\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > :is(button, a, [role='button'])[aria-expanded='true'] {\n  background: var(--isl-active) !important;\n}\n\n/* A control that expands a panel in place must not clip that panel. The\n   label is clipped by its own rule, so only the panel benefits. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > [data-slot=\"sidebar.footer.action\"] > :is(button, a, [role='button'])[aria-expanded='true'],\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > :is(button, a, [role='button'])[aria-expanded='true'] {\n  overflow: visible !important;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  body[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > [data-slot=\"sidebar.footer.action\"] > :is(button, a, [role='button']),\n  body[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"footer-actions\"] > :is(button, a, [role='button']) {\n    transition: none;\n  }\n}\n\n/* ---- Collapsed rail ------------------------------------------------------ */\n/* Collapsing hides the workspace browser only; the rail keeps its own island. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] {\n  /* The rail is chrome, not an island: it sits directly on the ocean. */\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  padding: 8px 6px 6px;\n  overflow: hidden;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"][data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"sidebar-top-strip\"] {\n  height: 36px;\n  margin: 0;\n  padding: 0;\n  justify-content: center;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-collapsed\"] [data-islands-part~=\"new-session\"] {\n  border-radius: var(--isl-radius-md);\n}\n\n/* The window top bar / rail own the collapse controls; the in-island toggle\n   would duplicate them at every width. Windows is the exception: DSH pins its\n   native toggle in the caption row, so there the skin must not hide or restyle\n   it — the top bar drops its own copy and leaves the native control alone. */\nhtml:not([data-windows-titlebar]) body[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"sidebar-toggle\"] {\n  display: none;\n}\n\n@media (min-width: 768px) {\n  /* On macOS the shipped frame gives a collapsed sidebar zero width, hiding\n     the rail too. Restore one rail-wide track (right panel still closed). */\n  [data-platform='darwin'] body[data-islands-ui] [data-islands-part~=\"layout-frame\"][data-sidebar-collapsed][data-rightbar-collapsed] {\n    grid-template-columns: var(--isl-rail-collapsed-width) minmax(0, 1fr) 0 !important;\n  }\n\n  /* The rail itself is the expand control; do not reserve header space for the\n     floating seat and do not show a second expand button over the island. */\n  [data-platform='darwin'] body[data-islands-ui] [data-islands-part~=\"layout-frame\"][data-sidebar-collapsed] {\n    --dsh-frame-leading-clearance: 0px;\n  }\n}\n\n/* The window chrome and the rail own the sidebar controls; the floating seat\n   is redundant (and at narrow widths would sit under the traffic lights). */\nbody[data-islands-ui] [data-shell-leading] {\n  display: none;\n}\n\n/* ---- Search / section chrome inside the island --------------------------- */\nbody[data-islands-ui] [data-islands-part~=\"search-expanded\"] {\n  border-color: var(--isl-border-soft);\n  background: var(--isl-surface-muted);\n  border-radius: var(--isl-radius-sm);\n}\n\nbody[data-islands-ui] [data-islands-part~=\"search-expanded\"] [data-islands-part~=\"search-button\"]:hover {\n  background: transparent;\n}\n\n/* ---- Narrow drawer ------------------------------------------------------- */\n/* Below the top bar's breakpoint the workspace becomes an overlay drawer. It\n   starts at the frame's content top (below the top bar and its 5px gap) and\n   leaves the window's 5px canvas margin on the left; the workspace card inside\n   keeps the right/bottom 5px so the drawer still reads as an island. */\nbody[data-islands-ui] [data-islands-part~=\"layout-frame\"][data-sidebar-drawer] [data-islands-part~=\"sidebar-column\"] {\n  top: calc(var(--isl-chrome-top) + var(--isl-topbar-height) + var(--isl-gap));\n  bottom: 0;\n  left: var(--isl-gap);\n  background: var(--isl-canvas);\n  border-right: 0;\n  box-shadow: var(--isl-shadow-float);\n}\n\nbody[data-islands-ui] [data-islands-part~=\"layout-frame\"][data-sidebar-drawer] [data-islands-part~=\"sidebar-root\"]::after {\n  inset: 0 var(--isl-gap) var(--isl-gap) calc(var(--isl-rail-width) + var(--isl-gap));\n}\n\n/* The sidebar's grid track is zero in drawer mode, but its column gap remains;\n   shift the conversation island right by the persistent rail so the closed\n   drawer leaves the rail visible and the island keeps its 5px gap. */\nbody[data-islands-ui] [data-islands-part~=\"layout-frame\"][data-sidebar-drawer] [data-islands-part~=\"center-column\"] {\n  margin-left: var(--isl-rail-width);\n}\n\n/* The drawer card keeps a canvas gap at the bottom; the footer row must end at\n   the card's bottom, not below it. */\nbody[data-islands-ui] [data-islands-part~=\"layout-frame\"][data-sidebar-drawer] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"footer-actions\"] {\n  margin-bottom: var(--isl-gap);\n}\n\n/* ---- Account launcher (settings.launcher) --------------------------------\n   In this build the sidebar foot is the account menu rather than the bare\n   settings gear, so the same rail geometry applies to its trigger. The\n   trigger itself is the host's `data-signed-out` button; its label is marked\n   by the walker. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"account-root\"] {\n  flex: none;\n  width: 36px;\n  margin-inline: 0;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"account-anchor\"] {\n  width: 36px;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"foot-area\"] [data-signed-out],\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"foot-area\"] [data-signed-out][data-signed-out='false']:not([data-collapsed='true']),\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"foot-area\"] [data-signed-out][data-signed-out='true']:not([data-collapsed='true']) {\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  justify-content: center;\n  border-inline: 0;\n  border-radius: var(--isl-radius-md);\n  background-clip: border-box;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"foot-area\"] [data-islands-part~=\"account-label\"] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  clip: rect(0 0 0 0);\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n/* ---- Guests in the rail seat --------------------------------------------\n   Plugins add their entries to the host's settings row. The skin's seat is\n   the 48px rail column, cannot hold the account plus a wide action side by\n   side, and the host still reports `wide=true`, so entries arrive in their\n   wide shape. The skin folds every direct guest into one rail tile: natural\n   36px width, wrapping (a multi-icon group becomes a vertical pill), `order:\n   -1` above the account. Guest text moves into the accessibility tree, the\n   same way the rail treats its own tiles. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"settings-area\"] > [data-slot=\"sidebar.settings\"] > * > :not([data-slot]):not([data-islands-part]):not([role='status']):not([aria-live]) {\n  order: -1;\n  flex: none;\n  box-sizing: border-box;\n  min-width: 0;\n  max-width: 36px;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n\n/* An icon-bearing guest keeps its icon and moves a leaf text label into the\n   accessibility tree. Text left in flow would wrap inside the 36px column and\n   grow the foot, pushing the gear and the rail reserve up. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"settings-area\"] > [data-slot=\"sidebar.settings\"] > * > :not([data-slot]) :is(a, button) > span:not(:has(*)) {\n  position: absolute !important;\n  width: 1px !important;\n  height: 1px !important;\n  clip: rect(0 0 0 0) !important;\n  white-space: nowrap !important;\n  overflow: hidden !important;\n}\n\n/* A launcher that replaces the account menu (dsh-quick-restart, DS-Bot) uses\n   flat class names the walker cannot mark, and the host still reports `wide`,\n   so it renders its name. The rail keeps the avatar: every leaf child after\n   the first moves into the accessibility tree. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"settings-area\"] button[aria-haspopup] > :not(:first-child):not(:has(*)) {\n  position: absolute !important;\n  width: 1px !important;\n  height: 1px !important;\n  clip: rect(0 0 0 0) !important;\n  white-space: nowrap !important;\n  overflow: hidden !important;\n}\n\n/* ---- Independent workspace collapse ------------------------------------- */\n/* Hide the workspace island only; the rail keeps its expanded-layout DOM and\n   position, so nothing in the left column is re-rendered by the toggle. */\nbody[data-islands-ui][data-islands-workspace-collapsed] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"new-session-row\"],\nbody[data-islands-ui][data-islands-workspace-collapsed] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"new-session\"],\nbody[data-islands-ui][data-islands-workspace-collapsed] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"region-area\"],\nbody[data-islands-ui][data-islands-workspace-collapsed] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"footer-actions\"],\nbody[data-islands-ui][data-islands-workspace-collapsed] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"])::after {\n  display: none !important;\n}\n\n/* The hidden workspace column no longer needs a layout track; keeping it at 0\n   stops the clipped workspace from laying out behind the 48px rail. */\nbody[data-islands-ui][data-islands-workspace-collapsed] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) {\n  grid-template-columns: var(--isl-rail-width) 0;\n}\n\n/* ---- Custom rail replaces the shipped brand + panel icon column ---------- */\n/* Windows is the one platform that keeps the logo row in the tree: DSH's\n   fixed caption-row toggle is a child, and `display: none` on the ancestor\n   would remove the native button. The row loses its own box below instead. */\nhtml:not([data-windows-titlebar]) body[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"logo-row\"],\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"panel-list\"] {\n  display: none !important;\n}\n\nhtml[data-windows-titlebar] body[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"logo-row\"] {\n  display: contents;\n}\n\nhtml[data-windows-titlebar] body[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) [data-islands-part~=\"logo-row\"] [data-islands-part~=\"brand-button\"] {\n  display: none;\n}\n\n/* ---- Aggregate pinned sessions ------------------------------------------ */\n.isl-pinnedHost {\n  display: none;\n  flex: none;\n}\n\nbody[data-islands-ui] .isl-pinnedHost {\n  display: block;\n}\n\n.isl-pinned {\n  display: none;\n  padding: 2px 4px 0;\n}\n\nbody[data-islands-ui] .isl-pinned {\n  display: block;\n}\n\n/* Pinned rows stay in place in their workspace groups and are also collected\n   in the aggregate block above. The original row keeps a subtle tint. */\nbody[data-islands-ui] [data-islands-part~=\"pin-indicator\"] {\n  color: var(--dsw-alias-state-business-primary);\n}\n\nbody[data-islands-ui] [data-row-key^=\"session:\"]:has([data-islands-part~=\"pin-indicator\"]) {\n  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 6%, transparent);\n}\n\nbody[data-islands-ui] [data-row-key^=\"session:\"]:has([data-islands-part~=\"pin-indicator\"]):hover {\n  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 10%, transparent);\n}\n\n.isl-pinnedHead {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  width: 100%;\n  height: 32px;\n  padding: 0 6px;\n  border: 0;\n  border-radius: var(--isl-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  font: inherit;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 20px;\n  text-align: left;\n  cursor: pointer;\n}\n\n/* Collapsible header mirrors the quiet workspace section header: colour only. */\n.isl-pinnedHead:hover {\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n}\n\n.isl-pinnedChevron {\n  display: inline-flex;\n  flex: none;\n  color: var(--dsw-alias-label-tertiary);\n  transform: rotate(-90deg);\n  transition: transform 0.12s var(--ds-ease-in-out);\n}\n\n.isl-pinned[data-open] .isl-pinnedChevron {\n  transform: rotate(0deg);\n}\n\n.isl-pinnedTitle {\n  min-width: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.isl-pinnedCount {\n  margin-left: auto;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  font-weight: 400;\n}\n\n.isl-pinnedList {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  padding: 1px 0 3px;\n}\n\n.isl-pinnedRow {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  width: 100%;\n  height: 32px;\n  padding: 0 8px 0 34px;\n  border: 0;\n  border-radius: var(--isl-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  font-size: 14px;\n  line-height: 20px;\n  text-align: left;\n  cursor: pointer;\n}\n\n.isl-pinnedRow:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.isl-pinnedName {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\n/* Hover marquee: clip the ellipsis, fade both edges as the title crawls. */\n.isl-pinnedRow:hover .isl-pinnedName {\n  text-overflow: clip;\n}\n\n.isl-pinnedRow .isl-pinnedName[data-scrolled] {\n  mask-image: linear-gradient(90deg, #0000, #000 12px);\n}\n\n.isl-pinnedRow .isl-pinnedName[data-clipped] {\n  mask-image: linear-gradient(270deg, #0000, #000 12px);\n}\n\n.isl-pinnedRow .isl-pinnedName[data-scrolled][data-clipped] {\n  mask-image: linear-gradient(90deg, #0000, #000 12px calc(100% - 12px), #0000);\n}\n\n.isl-pinnedRow:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: -2px;\n}\n\n.isl-pinnedPinBtn,\n.isl-pinnedLocate {\n  display: none;\n  place-items: center;\n  flex: none;\n  width: 24px;\n  height: 24px;\n  margin-left: 4px;\n  padding: 0;\n  border: 0;\n  border-radius: var(--isl-radius-xs, 6px);\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  cursor: pointer;\n  transition:\n    background-color 0.12s var(--ds-ease-in-out),\n    color 0.12s var(--ds-ease-in-out);\n}\n\n.isl-pinnedRow:hover .isl-pinnedPinBtn,\n.isl-pinnedRow:focus-within .isl-pinnedPinBtn,\n.isl-pinnedPinBtn:focus-visible,\n.isl-pinnedRow:hover .isl-pinnedLocate,\n.isl-pinnedRow:focus-within .isl-pinnedLocate,\n.isl-pinnedLocate:focus-visible {\n  display: grid;\n}\n\n.isl-pinnedPinBtn:hover,\n.isl-pinnedLocate:hover {\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n}\n\n.isl-pinnedPinBtn:focus-visible,\n.isl-pinnedLocate:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: -2px;\n}\n\n/* Brief highlight on the session the locate action focuses. */\nbody[data-islands-ui] [data-row-key^=\"session:\"].isl-located {\n  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent) !important;\n}\n\n/* ==========================================================================\n   Sidebar scroll containers\n   Releases from 0.2.2-rc.2 wrap the panel list and workspace browser in\n   `scrollRegion > scrollArea`. The parts are only written when those wrappers\n   exist, so the same sheet covers the older flat shell without a variant.\n   ========================================================================== */\n\n/* The browser column replaces the old direct regionArea grid item. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) > [data-islands-part~=\"sidebar-scroll-region\"] {\n  grid-area: 3 / 2 / 5 / 3;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  min-height: 0;\n  margin: 0;\n}\n\n/* The shipped grid only made sense inside the full-height shell; the island\n   grid wants a plain column so the workspace browser can fill the island. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) > [data-islands-part~=\"sidebar-scroll-region\"] > [data-islands-part~=\"sidebar-scroll-area\"] {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  min-height: 0;\n  margin: 0;\n  overflow: hidden;\n}\n\nbody[data-islands-ui]\n  [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"])\n  > [data-islands-part~=\"sidebar-scroll-region\"]\n  > [data-islands-part~=\"sidebar-scroll-area\"]\n  > [data-islands-part~=\"region-area\"] {\n  flex: 1;\n  min-height: 0;\n}\n\n/* The shipped bottom fade reads as a panel edge; the island supplies its own. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"]:not([data-islands-part~=\"sidebar-collapsed\"]) > [data-islands-part~=\"sidebar-scroll-region\"] > [data-islands-part~=\"sidebar-scroll-fade\"] {\n  display: none;\n}\n\n/* The selected-panel state moved from the row onto the wrapping entry; mirror\n   the base active rule for the shipped rail. */\nbody[data-islands-ui] [data-islands-part~=\"sidebar-root\"] [data-islands-part~=\"panel-entry-active\"] [data-islands-part~=\"panel-row\"] {\n  background: var(--dsw-specific-sidebar-nav-item-active-accent);\n  color: var(--dsw-alias-state-business-primary);\n}\n\n/* ---- 30-conversation.css ---- */\n/* ==========================================================================\n   Islands UI · 30 conversation & composer\n   ========================================================================== */\n\nbody[data-islands-ui] [data-phase] {\n  background: transparent;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"conversation-header\"] {\n  border-bottom-color: var(--isl-border-soft);\n}\n\nbody[data-islands-ui] [data-islands-part~=\"conversation-header-blank\"] {\n  border-bottom-color: transparent;\n}\n\nbody[data-islands-ui] [data-conversation-scroll] {\n  margin-right: 0;\n}\n\n/* Composer: the one element that should visibly float above the island. */\nbody[data-islands-ui] [data-composer-card] {\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  box-shadow: none;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"composer-card-workspace-trigger\"]:after {\n  border-radius: var(--dsw-radius-panel);\n  color: var(--isl-border-strong);\n}\n\nbody[data-islands-ui] [data-islands-part~=\"composer-notice\"] {\n  border-radius: var(--isl-radius-md);\n  background: var(--isl-surface-muted);\n}\n\n/* Sticky composer seat fades into the island surface, not into a raw token. */\nbody[data-islands-ui] [data-phase='active'] [data-composer-seat],\nbody[data-islands-ui] [data-islands-part~=\"embedded-body\"][data-content-phase='active'] [data-composer-seat] {\n  background: linear-gradient(\n    180deg,\n    color-mix(in srgb, var(--isl-surface) 0%, transparent) 0px,\n    var(--isl-surface) 36px\n  );\n}\n\n/* Hero: a calmer, slightly tighter headline on the open island. */\nbody[data-islands-ui] [data-islands-part~=\"hero-headline\"] {\n  letter-spacing: -0.01em;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"hero-workspace\"] {\n  border-radius: 999px;\n  background: var(--isl-surface-muted);\n}\n\nbody[data-islands-ui] [data-islands-part~=\"hero-workspace\"]:hover {\n  background: var(--isl-hover);\n}\n\n/* Tool / turn cards keep their own hierarchy but gain island hairlines. */\nbody[data-islands-ui] [data-turn-trigger] {\n  border-color: var(--isl-border-soft);\n  background: var(--isl-surface-muted);\n}\n\nbody[data-islands-ui] [data-turn-trigger]:hover {\n  background: var(--isl-surface-sunken);\n}\n\n/* Header chips and breadcrumbs. */\nbody[data-islands-ui] [data-islands-part~=\"header-crumb\"] {\n  border-radius: var(--isl-radius-sm);\n}\n\n/* View tabs sit on the island as a quiet segmented row. */\nbody[data-islands-ui] [data-conversation-tabs] {\n  gap: 22px;\n}\n\nbody[data-islands-ui] [data-conversation-tabs] [role=\"tab\"][aria-selected=\"true\"]:after {\n  border-radius: 999px;\n  height: 2px;\n}\n\n/* ==========================================================================\n   Header utilities live in the window bar\n   The three trailing controls (session tools, side panel, right panel) leave\n   the conversation island and dock at the bar's right edge, vertically aligned\n   with the workspace toggle on the left.\n   ========================================================================== */\n@media (min-width: 768px) {\n  /* Windows leaves these controls in the conversation header: the native\n     caption row already exists, so the skin keeps no extra strip to dock\n     them into. */\n  html:not([data-windows-titlebar]) body[data-islands-ui] [data-islands-part~=\"header-utilities\"] {\n    position: fixed;\n    top: calc(var(--isl-chrome-top) + 10px);\n    right: 41px; /* frame gap 5 + corner 28 + gap 8 */\n    z-index: 31;\n    height: 28px;\n    margin: 0;\n    align-items: center;\n  }\n\n  html:not([data-windows-titlebar]) body[data-islands-ui] [data-islands-part~=\"header-corner\"] {\n    position: fixed;\n    top: calc(var(--isl-chrome-top) + 10px);\n    right: var(--isl-gap);\n    z-index: 31;\n    height: 28px;\n    margin: 0;\n    align-items: center;\n  }\n}\n\n/* ==========================================================================\n   Always-visible right sidebar toggle\n   The native header button unmounts while the panel is open and the panel\n   carries its own collapse control. On every platform except Windows the top\n   bar owns one persistent toggle instead, and closes through the native\n   collapse action. Windows keeps DSH's own controls: the header corner opens\n   the panel and the panel header closes it.\n   ========================================================================== */\n/* Body-portaled (see RightPanelToggle): keep it out of the DOM flow while the\n   skin is off, so the base rule cannot leak a raw button into the page. */\n.isl-rightToggle {\n  display: none;\n}\n\n/* z-index 900: above the workbench panel host (dsh-better-sidebar: host 25,\n   dock 40, float 60, floating window 90) and the app's transient tooltip/\n   hovercard layer (100), below menus and dialogs (1000+). The button is\n   portaled to <body>, so this value competes with the body-level layers\n   directly instead of being trapped in the frame's z-index-20 overlay layer. */\nbody[data-islands-ui] .isl-rightToggle {\n  position: fixed;\n  top: calc(var(--isl-chrome-top) + 10px);\n  right: var(--isl-gap);\n  z-index: 900;\n  box-sizing: border-box;\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: 0;\n  border-radius: var(--isl-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  pointer-events: auto;\n  -webkit-app-region: no-drag;\n}\n\nbody[data-islands-ui] .isl-rightToggle:hover,\nbody[data-islands-ui] .isl-rightToggle[aria-pressed='true'] {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-rightToggle:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: -2px;\n}\n\n/* Windows has no island top bar, so the portalled copy steps aside and DSH's\n   own expand/collapse buttons below are left alone. */\nhtml[data-windows-titlebar] body[data-islands-ui] .isl-rightToggle {\n  display: none;\n}\n\n/* Outside Windows the top bar owns open and close; the island's own\n   expand/collapse controls would duplicate it. */\nhtml:not([data-windows-titlebar]) body[data-islands-ui] [data-sidebar-right-expand] {\n  /* Keep the native expand button's box in the layout even though the top\n     bar's toggle paints over it. Other header plugins anchor to this\n     button's rect (dsh-better-sidebar's blank-session dock fallback does),\n     and `display: none` collapses that rect to 0x0, sending them to the\n     top-left corner where they collide with the workspace toggle. */\n  visibility: hidden !important;\n  pointer-events: none !important;\n}\n\nhtml:not([data-windows-titlebar]) body[data-islands-ui] [data-sidebar-right-toggle] {\n  display: none !important;\n}\n\n/* ---- 31-caret.css ---- */\n/* ==========================================================================\n   Islands UI · 31 composer caret\n   The send circle and the smooth caret of the conversation composer. Both are\n   driven by the accent token, so a custom Islands accent reaches them without\n   naming a host class: the send button is read through its skin part, and the\n   caret through the composer's own `data-composer-*` hooks.\n   ========================================================================== */\n\n/* The send circle is the composer's primary action. The stock sheet paints it\n   with the info-fill token, which a custom accent does not remap; use the\n   accent token so the setting reaches it. The stock hover still applies while\n   following the theme; a custom accent derives its own shade in the direction\n   the stock token uses for that theme. */\nbody[data-islands-ui] [data-islands-part~=\"composer-primary\"] {\n  background-color: var(--dsw-alias-state-business-primary);\n}\n\nbody[data-islands-ui][data-islands-accent] [data-islands-part~=\"composer-primary\"]:hover:not(:disabled) {\n  background-color: color-mix(in srgb, var(--isl-accent) 86%, #fff);\n}\n\nbody[data-islands-ui][data-islands-accent][data-ds-dark-theme] [data-islands-part~=\"composer-primary\"]:hover:not(:disabled) {\n  background-color: color-mix(in srgb, var(--isl-accent) 86%, #000);\n}\n\n/* ---- Caret ---------------------------------------------------------------\n   The caret always follows the theme accent: a custom Islands accent remaps\n   `--dsw-alias-state-business-primary`, so both the native caret and the\n   smooth overlay below read the same token. */\n\nbody[data-islands-ui] [data-composer-input] {\n  caret-color: var(--dsw-alias-state-business-primary);\n}\n\n/* Smooth caret: while the overlay is painting a composer, that composer's\n   native caret is hidden. Every fallback state (IME composition, no\n   measurement, a non-collapsed selection) removes the marker first, so the\n   native caret is never lost. A selected command chip suppresses the caret\n   entirely, as in the stock composer. */\nbody[data-islands-ui][data-islands-smooth-caret] [data-composer-input][data-islands-caret-active] {\n  caret-color: transparent;\n}\n\nbody[data-islands-ui][data-islands-smooth-caret] [data-composer-input][data-composer-composing]:not([data-composer-chip-selected]) {\n  caret-color: var(--dsw-alias-state-business-primary);\n}\n\nbody[data-islands-ui] [data-composer-input][data-composer-chip-selected] {\n  caret-color: transparent;\n}\n\n/* The overlay is a sibling of the contenteditable inside its positioned\n   wrapper, so it scrolls and clips with the draft instead of floating over\n   the island. 2px is a deliberate accent treatment at the composer's 14px\n   type size (the native caret is 1px); height matches the text glyph box. */\n.isl-caret {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1;\n  display: block;\n  width: 2px;\n  border-radius: 1px;\n  background: var(--dsw-alias-state-business-primary, var(--isl-accent, #4176e6));\n  opacity: 0;\n  pointer-events: none;\n  will-change: transform;\n  transition: transform 150ms cubic-bezier(0.2, 0.7, 0.2, 1);\n}\n\n.isl-caret.is-jump {\n  transition: none;\n}\n\n.isl-caret.is-on {\n  opacity: 1;\n  animation: isl-caret-blink 1.06s step-end infinite;\n}\n\n/* Keep the caret solid while it is moving; the blink resumes after a short\n   idle, like a native caret. */\n.isl-caret.is-typing {\n  animation: none;\n  opacity: 1;\n}\n\n@keyframes isl-caret-blink {\n  0%,\n  49% {\n    opacity: 1;\n  }\n\n  50%,\n  100% {\n    opacity: 0;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .isl-caret,\n  .isl-caret.is-jump {\n    transition: none;\n  }\n}\n\n/* ---- 40-settings.css ---- */\n/* ==========================================================================\n   Islands UI · 40 settings (and shared dialog surfaces)\n   The settings window is an island; its navigation is a recessed island.\n   ========================================================================== */\n\nbody[data-islands-ui] [data-islands-part~=\"settings-overlay\"] {\n  background: transparent;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"settings-mask\"] {\n  background: var(--dsw-alias-bg-mask-1);\n  backdrop-filter: var(--dsw-mask-blur);\n}\n\nbody[data-islands-ui] [data-islands-part~=\"settings-panel\"] {\n  width: 860px;\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: 24px;\n  box-shadow: var(--isl-shadow-float);\n  padding: 10px;\n  gap: 8px;\n  grid-template-columns: 188px minmax(0, 1fr);\n}\n\nbody[data-islands-ui] [data-islands-part~=\"settings-nav-title\"] {\n  padding: 8px 8px 6px;\n  font-size: 15px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n\n/* The navigation mirrors the workspace list: no recessed panel, quiet rows. */\nbody[data-islands-ui] [data-islands-part~=\"settings-nav\"] {\n  padding: 4px;\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"settings-nav-list\"] {\n  gap: 2px;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"settings-nav-cell\"] {\n  height: 32px;\n  padding: 6px 8px;\n  border-radius: var(--isl-radius-sm);\n  color: var(--dsw-alias-label-secondary);\n  font-size: 13px;\n  line-height: 18px;\n  gap: 8px;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"settings-nav-cell\"]:hover {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] [data-islands-part~=\"settings-nav-cell\"][data-islands-part~=\"settings-nav-active\"] {\n  background: var(--isl-active);\n  color: var(--dsw-alias-label-primary);\n  font-weight: 500;\n  box-shadow: none;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"settings-nav-icon\"] {\n  width: 16px;\n  height: 16px;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"settings-nav-icon\"] svg {\n  width: 100%;\n  height: 100%;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"settings-header\"] {\n  height: 48px;\n  padding: 6px 6px 0 8px;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"settings-options\"] {\n  padding: 0 8px 16px;\n  background: transparent;\n}\n\nbody[data-islands-ui] [data-islands-part~=\"settings-close\"] {\n  border-radius: var(--isl-radius-sm);\n}\n\n/* Cards and sections inside settings pages keep the host's own geometry and\n   use the skin's card tokens (00-tokens). They are deliberately not matched by\n   local class name: the plugin settings pages also ship `.card`/`.section`,\n   and a broad match restyles their internals. */\n\n/* The general-page rows keep their separators but at island quietness. */\nbody[data-islands-ui] [data-slot='settings.general.item'] > * {\n  border-bottom-color: var(--isl-border-soft);\n}\n\nbody[data-islands-ui] [data-slot='settings.general.item']:last-child > * {\n  border-bottom: 0;\n}\n\n/* Dialogs opened from settings (confirmations, pickers). */\nbody[data-islands-ui] [role='dialog'] {\n  border-radius: var(--isl-radius-xl);\n}\n\n/* Account page cards. */\nbody[data-islands-ui] [data-islands-part~=\"account-balance-card\"] {\n  border-radius: var(--isl-radius-lg);\n  border: 1px solid var(--isl-border-soft);\n  background: var(--isl-surface);\n}\n\n/* ---- 45-model-picker.css ---- */\n/* ==========================================================================\n   Islands UI · 45 composer model picker\n   Trigger chip + model list + reasoning slider, in the Islands language.\n   ========================================================================== */\n\n/* Mounted into the composer slot whether or not the skin is on; the base rule\n   keeps a raw chip out of the composer when the attribute is absent. */\n.isl-model {\n  display: none;\n}\n\nbody[data-islands-ui] .isl-model {\n  position: relative;\n  display: flex;\n  align-items: center;\n  min-width: 0;\n}\n\nbody[data-islands-ui] .isl-modelTrigger {\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  max-width: 260px;\n  height: 28px;\n  padding: 0 8px;\n  border: 1px solid transparent;\n  border-radius: 999px;\n  background: var(--isl-surface-muted);\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  line-height: 20px;\n  cursor: pointer;\n  transition: background-color 0.12s var(--ds-ease-in-out);\n}\n\nbody[data-islands-ui] .isl-modelTrigger:hover:not(:disabled) {\n  background: var(--isl-surface-sunken);\n}\n\nbody[data-islands-ui] .isl-modelTrigger:disabled {\n  opacity: 0.55;\n  cursor: default;\n}\n\nbody[data-islands-ui] .isl-modelTrigger:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: 1px;\n}\n\nbody[data-islands-ui] .isl-modelIcon {\n  display: var(--dsh-composer-model-icon-display, none);\n  flex: none;\n  color: var(--dsw-alias-label-secondary);\n}\n\nbody[data-islands-ui] .isl-modelName {\n  display: var(--dsh-composer-model-text-display, inline);\n  min-width: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-modelEffort {\n  display: var(--dsh-composer-model-text-display, inline);\n  flex-shrink: 1000;\n  min-width: 0;\n  color: var(--dsw-alias-label-caption);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-modelChevron {\n  display: inline-flex;\n  flex: none;\n  color: var(--dsw-alias-label-caption);\n  transition: transform 0.12s var(--ds-ease-in-out);\n}\n\nbody[data-islands-ui] .isl-modelChevron.is-open {\n  transform: rotate(180deg);\n}\n\n/* ---- Menu ---------------------------------------------------------------- */\nbody[data-islands-ui] .isl-modelMenu {\n  position: fixed;\n  z-index: 1100;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  max-height: min(460px, calc(100vh - 24px));\n  padding: 6px;\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  background: var(--isl-surface);\n  box-shadow: var(--isl-shadow-float);\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  line-height: 20px;\n  overflow-y: auto;\n  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);\n  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);\n}\n\nbody[data-islands-ui] .isl-modelPaneHead {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  padding: 0 4px 6px;\n}\n\nbody[data-islands-ui] .isl-modelMenuTitle {\n  padding: 2px 4px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\nbody[data-islands-ui] .isl-modelBack {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-modelBack:hover {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-modelBackIcon {\n  display: inline-flex;\n  transform: rotate(90deg);\n}\n\nbody[data-islands-ui] .isl-modelGroups {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\nbody[data-islands-ui] .isl-modelGroup + .isl-modelGroup {\n  margin-top: 6px;\n}\n\nbody[data-islands-ui] .isl-modelGroupName {\n  padding: 6px 8px 2px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 16px;\n}\n\nbody[data-islands-ui] .isl-modelOption {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  min-height: 34px;\n  padding: 6px 8px;\n  border: 0;\n  border-radius: var(--isl-radius-md);\n  background: transparent;\n  color: inherit;\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-modelOption:hover {\n  background: var(--isl-hover);\n}\n\nbody[data-islands-ui] .isl-modelOption.is-selected {\n  background: var(--isl-surface-muted);\n}\n\nbody[data-islands-ui] .isl-modelOptionName {\n  flex: 1;\n  min-width: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-modelCheck {\n  display: inline-flex;\n  flex: none;\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-modelEmpty {\n  padding: 10px 8px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n}\n\n/* ---- Reasoning effort ---------------------------------------------------- */\nbody[data-islands-ui] .isl-effortPopup {\n  position: relative;\n  padding: 9px 10px 8px;\n  text-align: center;\n}\n\nbody[data-islands-ui] .isl-effortReset {\n  position: absolute;\n  top: 5px;\n  right: 5px;\n  display: grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-effortReset:hover:not(:disabled) {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-effortReset:disabled {\n  opacity: 0.4;\n  cursor: default;\n}\n\nbody[data-islands-ui] .isl-effortName {\n  color: var(--dsw-alias-state-business-primary);\n  font-size: 18px;\n  line-height: 24px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n\nbody[data-islands-ui] .isl-effortModel {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  max-width: 100%;\n  margin-top: 1px;\n  padding: 1px 6px;\n  border: 0;\n  border-radius: var(--isl-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 13px;\n  line-height: 18px;\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-effortModel:hover {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-secondary);\n}\n\nbody[data-islands-ui] .isl-effortModelName {\n  min-width: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-effortModelChevron {\n  display: inline-flex;\n  flex: none;\n  color: inherit;\n  transform: rotate(-90deg);\n}\n\nbody[data-islands-ui] .isl-effortSliderWrap {\n  position: relative;\n  margin: 7px 2px 0;\n}\n\nbody[data-islands-ui] .isl-effortSlider {\n  -webkit-appearance: none;\n  appearance: none;\n  display: block;\n  width: 100%;\n  height: 24px;\n  margin: 0;\n  padding: 0;\n  background: transparent;\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-effortSlider::-webkit-slider-runnable-track {\n  height: 20px;\n  border-radius: 999px;\n  background: linear-gradient(\n    90deg,\n    var(--dsw-alias-state-business-primary) 0\n      calc(12px + (100% - 24px) * var(--isl-ratio, 0)),\n    var(--isl-surface-sunken) calc(12px + (100% - 24px) * var(--isl-ratio, 0)) 100%\n  );\n}\n\nbody[data-islands-ui] .isl-effortSlider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  appearance: none;\n  box-sizing: border-box;\n  width: 24px;\n  height: 24px;\n  margin-top: -2px;\n  border: 0;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow:\n    0 1px 4px rgba(17, 24, 39, 0.22),\n    0 0 0 0.5px rgba(17, 24, 39, 0.06);\n}\n\nbody[data-islands-ui] .isl-effortSlider:focus-visible {\n  outline: none;\n}\n\nbody[data-islands-ui] .isl-effortSlider:focus-visible::-webkit-slider-thumb {\n  box-shadow:\n    0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 26%, transparent),\n    0 1px 4px rgba(17, 24, 39, 0.22);\n}\n\nbody[data-islands-ui] .isl-effortDots {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 12px;\n  pointer-events: none;\n}\n\nbody[data-islands-ui] .isl-effortDot {\n  width: 4px;\n  height: 4px;\n  border-radius: 50%;\n  background: var(--isl-border-strong);\n}\n\nbody[data-islands-ui] .isl-effortDot.is-filled {\n  background: rgba(255, 255, 255, 0.55);\n}\n\nbody[data-islands-ui] .isl-modelError {\n  margin: 8px 8px 2px;\n  padding: 6px 8px;\n  border-radius: var(--isl-radius-sm);\n  background: var(--dsw-alias-interactive-bg-hover-danger);\n  color: var(--dsw-alias-state-error-primary);\n  font-size: 11px;\n  line-height: 16px;\n}\n\n/* ---- 50-components.css ---- */\n/* ==========================================================================\n   Islands UI · 50 shared components\n   Small, reusable pieces used by the skin's own surfaces. All values come from\n   the token layer, so nothing here is page-specific.\n   ========================================================================== */\n\n/* ---- Preference row (rendered into settings.general.item) ---------------- */\nbody[data-islands-ui] .isl-prefRow,\n.isl-prefRow {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 24px;\n  padding: 16px 0;\n  border-bottom: 0.5px solid var(--dsw-alias-border-l2);\n  color: var(--dsw-alias-label-primary);\n  font-size: 14px;\n  line-height: 20px;\n}\n\nbody[data-islands-ui] .isl-prefRow:last-child,\n.isl-prefRow:last-child {\n  border-bottom: 0;\n}\n\n.isl-prefText {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  min-width: 0;\n}\n\n.isl-prefTitle {\n  color: var(--dsw-alias-label-primary);\n  font-size: 14px;\n  line-height: 20px;\n}\n\n.isl-prefDesc {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n/* Inline compatibility hint on a preference row (never a global notice). */\n.isl-prefWarn {\n  margin-top: 2px;\n  color: #a86b00;\n  font-size: 11px;\n  line-height: 16px;\n}\n\nbody[data-ds-dark-theme] .isl-prefWarn {\n  color: #f0c274;\n}\n\n/* ---- Switch -------------------------------------------------------------- */\n.isl-switch {\n  position: relative;\n  flex: none;\n  width: 38px;\n  height: 22px;\n  padding: 0;\n  border: 0;\n  border-radius: 999px;\n  cursor: pointer;\n  background: var(--dsw-alias-bg-layer-3);\n  box-shadow: inset 0 0 0 1px var(--dsw-alias-border-l2);\n  transition: background-color 0.15s var(--ds-ease-in-out);\n}\n\n.isl-switch[aria-checked='true'] {\n  background: var(--dsw-alias-state-business-primary);\n  box-shadow: none;\n}\n\n.isl-switch:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: 2px;\n}\n\n.isl-switchThumb {\n  position: absolute;\n  top: 3px;\n  left: 3px;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.25);\n  transition: transform 0.15s var(--ds-ease-in-out);\n}\n\n.isl-switch[aria-checked='true'] .isl-switchThumb {\n  transform: translateX(16px);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .isl-switch,\n  .isl-switchThumb {\n    transition: none;\n  }\n}\n\n/* ---- Popover / menu materials ------------------------------------------- */\nbody[data-islands-ui] [data-menu-material] {\n  border-radius: var(--isl-radius-lg);\n  border: 1px solid var(--isl-border-soft);\n  box-shadow: var(--isl-shadow-float);\n}\n\nbody[data-islands-ui] [role='dialog'],\nbody[data-islands-ui] [role='menu'],\nbody[data-islands-ui] [role='listbox'] {\n  border-radius: var(--isl-radius-lg);\n}\n\n/* ---- Scrollbars ---------------------------------------------------------- */\nbody[data-islands-ui] ::-webkit-scrollbar-thumb {\n  border-radius: 999px;\n}\n\n/* ---- Focus --------------------------------------------------------------- */\nbody[data-islands-ui] :focus-visible {\n  outline-offset: 1px;\n}\n\n/* ---- Dedicated settings page ------------------------------------------- */\n.isl-settingsPage {\n  box-sizing: border-box;\n  max-width: 760px;\n  padding: 4px 8px 24px;\n}\n\n.isl-settingsPageHead {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n\n.isl-settingsPageLogo {\n  display: inline-flex;\n  flex: none;\n}\n\n.isl-settingsPageHeadText {\n  min-width: 0;\n}\n\n.isl-settingsPageTitle {\n  color: var(--dsw-alias-label-primary);\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 22px;\n}\n\n.isl-settingsPageDesc {\n  margin-top: 4px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.isl-settingsPage .isl-prefRow:first-of-type {\n  margin-top: 12px;\n}\n\n/* Detected DSH release + sidebar dialect: diagnosis for support reports. */\n.isl-settingsMeta {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n  margin-top: 10px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 16px;\n}\n\n.isl-settingsMetaValue {\n  padding: 0 5px;\n  border-radius: 4px;\n  background: var(--isl-surface-muted);\n  color: var(--dsw-alias-label-secondary);\n  font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);\n  font-size: 11px;\n}\n\n.isl-settingsMetaSeparator {\n  opacity: 0.6;\n}\n\n.isl-accentPicker {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.isl-accentSwatch {\n  box-sizing: border-box;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 50%;\n  background-clip: padding-box;\n  cursor: pointer;\n  transition:\n    transform 0.12s var(--ds-ease-in-out),\n    box-shadow 0.12s var(--ds-ease-in-out);\n}\n\n.isl-accentSwatch:hover {\n  transform: scale(1.08);\n}\n\n.isl-accentSwatch.is-selected {\n  box-shadow:\n    0 0 0 2px var(--dsw-alias-bg-base),\n    0 0 0 3.5px var(--dsw-alias-label-primary);\n}\n\n.isl-accentSwatch.is-default {\n  background: linear-gradient(135deg, #ffffff 0 47%, #c4c8ce 47% 53%, #1b1c1f 53% 100%);\n}\n\n.isl-accentCustom {\n  position: relative;\n  display: grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  border: 1px dashed var(--dsw-alias-border-l3);\n  border-radius: 50%;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n}\n\n.isl-accentCustom::before {\n  content: '+';\n  font-size: 14px;\n  line-height: 1;\n}\n\n.isl-accentCustom input {\n  position: absolute;\n  inset: -4px;\n  width: 32px;\n  height: 32px;\n  opacity: 0;\n  cursor: pointer;\n}\n\n\n/* ---- Compatibility notice ------------------------------------------------\n   Rendered while the skin is OFF, so nothing here may rely on the `--isl-*`\n   scale or on `body[data-islands-ui]`. Every custom property carries a\n   fallback and every color comes from the public DSH theme tokens. */\n\n.isl-compatToast {\n  position: fixed;\n  right: 16px;\n  bottom: 16px;\n  z-index: 2000;\n  box-sizing: border-box;\n  display: flex;\n  align-items: flex-start;\n  gap: 6px;\n  width: min(380px, calc(100vw - 32px));\n  padding: 12px 10px 12px 14px;\n  border: 1px solid rgba(224, 160, 24, 0.5);\n  border-left: 3px solid #e0a018;\n  border-radius: var(--isl-radius-lg, 16px);\n  background: var(--dsw-alias-bg-overlay, #ffffff);\n  color: var(--dsw-alias-label-primary, #1f2328);\n  box-shadow: 0 14px 36px -14px rgba(0, 0, 0, 0.35);\n  font-size: 13px;\n  line-height: 19px;\n  cursor: pointer;\n  opacity: 0;\n  transform: translateY(10px);\n  transition:\n    opacity 0.16s ease,\n    transform 0.16s ease;\n}\n\n.isl-compatToast.is-visible {\n  opacity: 1;\n  transform: none;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .isl-compatToast {\n    transition: none;\n  }\n}\n\n.isl-compatToastBody {\n  flex: 1;\n  min-width: 0;\n}\n\n.isl-compatToastTitle {\n  font-weight: 600;\n}\n\n.isl-compatToastText {\n  margin-top: 2px;\n  color: var(--dsw-alias-label-secondary, #555b63);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.isl-compatToastAction {\n  margin-top: 6px;\n  color: #a86b00;\n  font-size: 12px;\n  font-weight: 600;\n}\n\n.isl-compatToastClose {\n  flex: none;\n  width: 22px;\n  height: 22px;\n  padding: 0;\n  border: 0;\n  border-radius: 6px;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary, #737a82);\n  font-size: 16px;\n  line-height: 1;\n  cursor: pointer;\n}\n\n.isl-compatToastClose:hover {\n  background: var(--dsw-alias-interactive-bg-hover, rgba(17, 24, 39, 0.06));\n  color: var(--dsw-alias-label-primary, #1f2328);\n}\n\n/* The yield prompt. Same shell as the compatibility toast, but it is a\n   decision rather than a notice: it does not respond to a click anywhere, it\n   has real buttons, and it stays until answered. Blue accent, not amber. */\n.isl-yieldToast {\n  position: fixed;\n  right: 16px;\n  bottom: 16px;\n  z-index: 2001;\n  box-sizing: border-box;\n  display: flex;\n  align-items: flex-start;\n  gap: 6px;\n  width: min(400px, calc(100vw - 32px));\n  padding: 12px 10px 12px 14px;\n  border: 1px solid color-mix(in srgb, var(--isl-accent, #4176e6) 45%, transparent);\n  border-left: 3px solid var(--isl-accent, #4176e6);\n  border-radius: var(--isl-radius-lg, 16px);\n  background: var(--dsw-alias-bg-overlay, #ffffff);\n  color: var(--dsw-alias-label-primary, #1f2328);\n  box-shadow: 0 14px 36px -14px rgba(0, 0, 0, 0.35);\n  font-size: 13px;\n  line-height: 19px;\n  opacity: 0;\n  transform: translateY(10px);\n  /* Clip the countdown bar to the rounded corners. */\n  overflow: hidden;\n  transition:\n    opacity 0.16s ease,\n    transform 0.16s ease;\n}\n\n.isl-yieldToast.is-visible {\n  opacity: 1;\n  transform: none;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .isl-yieldToast {\n    transition: none;\n  }\n}\n\n.isl-yieldToastBody {\n  flex: 1;\n  min-width: 0;\n}\n\n.isl-yieldToastTitle {\n  font-weight: 600;\n}\n\n.isl-yieldToastText {\n  margin-top: 2px;\n  color: var(--dsw-alias-label-secondary, #555b63);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.isl-yieldToastActions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  margin-top: 8px;\n}\n\n.isl-yieldToastPrimary,\n.isl-yieldToastAction {\n  padding: 4px 10px;\n  border-radius: 8px;\n  font-size: 12px;\n  line-height: 18px;\n  cursor: pointer;\n}\n\n.isl-yieldToastPrimary {\n  border: 1px solid transparent;\n  background: var(--isl-accent, #4176e6);\n  color: #ffffff;\n  font-weight: 600;\n}\n\n.isl-yieldToastPrimary:hover {\n  background: color-mix(in srgb, var(--isl-accent, #4176e6) 86%, #000);\n}\n\n.isl-yieldToastAction {\n  border: 1px solid var(--dsw-alias-border-secondary, rgba(17, 24, 39, 0.16));\n  background: transparent;\n  color: var(--dsw-alias-label-primary, #1f2328);\n}\n\n/* Session-only \"don't ask again\": quiet enough to sit beside the buttons. */\n.isl-yieldToastMute {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  margin-left: 2px;\n  color: var(--dsw-alias-label-secondary, #555b63);\n  font-size: 12px;\n  line-height: 18px;\n  cursor: pointer;\n}\n\n.isl-yieldToastMute input {\n  width: 13px;\n  height: 13px;\n  margin: 0;\n  accent-color: var(--isl-accent, #4176e6);\n  cursor: pointer;\n}\n\n/* Countdown: a two-pixel bar draining along the top edge, clipped by the\n   prompt's rounded corners. No digits, nothing round beside the buttons. */\n.isl-yieldToastTimebar {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background: var(--isl-accent, #4176e6);\n  transform: scaleX(1);\n  transform-origin: left center;\n  pointer-events: none;\n  will-change: transform;\n}\n\n/* A dark theme needs the same hue lifted rather than swapped for blue. */\nbody[data-ds-dark-theme] .isl-yieldToastTimebar {\n  background: color-mix(in srgb, var(--isl-accent, #4176e6) 70%, #fff);\n}\n\n/* The drain itself: one compositor-driven transform over the whole window,\n   so it stays smooth no matter what the page's JavaScript is doing. */\n@keyframes isl-yield-countdown {\n  from {\n    transform: scaleX(1);\n  }\n\n  to {\n    transform: scaleX(0);\n  }\n}\n\n.isl-yieldToast.is-counting .isl-yieldToastTimebar {\n  animation: isl-yield-countdown 8000ms linear forwards;\n}\n\n.isl-yieldToast.is-paused .isl-yieldToastTimebar {\n  animation-play-state: paused;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .isl-yieldToast.is-counting .isl-yieldToastTimebar {\n    animation: none;\n  }\n}\n\n.isl-yieldToastAction:hover {\n  background: var(--dsw-alias-interactive-bg-hover, rgba(17, 24, 39, 0.06));\n}\n\n/* The settings-page warning bar. */\n.isl-compatBanner {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  margin: 12px 0 4px;\n  padding: 12px 14px;\n  border: 1px solid rgba(224, 160, 24, 0.45);\n  border-radius: var(--isl-radius-lg, 16px);\n  background: rgba(240, 180, 41, 0.14);\n  background: color-mix(in srgb, #f0b429 14%, transparent);\n  color: var(--dsw-alias-label-primary, #1f2328);\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.isl-compatBannerIcon {\n  flex: none;\n  display: inline-flex;\n  margin-top: 1px;\n  color: #b47400;\n}\n\n.isl-compatBannerText {\n  flex: 1;\n  min-width: 0;\n}\n\n.isl-compatBannerTitle {\n  font-weight: 600;\n}\n\n.isl-compatBannerBody,\n.isl-compatBannerHint {\n  margin-top: 2px;\n  color: var(--dsw-alias-label-secondary, #555b63);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.isl-compatBannerHint {\n  margin-top: 6px;\n}\n\n.isl-compatBannerList {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 4px;\n  margin-top: 6px;\n  color: var(--dsw-alias-label-secondary, #555b63);\n  font-size: 12px;\n}\n\n.isl-compatAnchor {\n  padding: 0 4px;\n  border-radius: 4px;\n  background: rgba(17, 24, 39, 0.06);\n  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;\n  font-size: 11px;\n}\n\n.isl-compatBannerAction,\n.isl-yieldAction {\n  flex: none;\n  align-self: flex-start;\n  padding: 5px 10px;\n  border: 1px solid rgba(224, 160, 24, 0.5);\n  border-radius: 8px;\n  background: transparent;\n  color: #8a5a00;\n  font: inherit;\n  font-size: 12px;\n  cursor: pointer;\n}\n\n.isl-compatBannerAction:hover,\n.isl-yieldAction:hover {\n  background: rgba(240, 180, 41, 0.18);\n}\n\n.isl-compatForced {\n  margin: 8px 0 0;\n  color: var(--dsw-alias-label-tertiary, #737a82);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.isl-switch:disabled {\n  opacity: 0.45;\n  cursor: not-allowed;\n}\n\n/* The notice renders while the skin is off, so darkness is read straight from\n   the host theme attribute its own stylesheet uses. */\nbody[data-ds-dark-theme] .isl-compatBannerIcon {\n  color: #e8b451;\n}\n\nbody[data-ds-dark-theme] .isl-compatBannerAction,\nbody[data-ds-dark-theme] .isl-yieldAction {\n  border-color: rgba(240, 180, 41, 0.45);\n  color: #f2c879;\n}\n\nbody[data-ds-dark-theme] .isl-compatBannerAction:hover,\nbody[data-ds-dark-theme] .isl-yieldAction:hover {\n  background: rgba(240, 180, 41, 0.16);\n}\n\nbody[data-ds-dark-theme] .isl-compatAnchor {\n  background: rgba(255, 255, 255, 0.08);\n}\n\nbody[data-ds-dark-theme] .isl-compatToastAction {\n  color: #f0c274;\n}\n\n/* ---- 60-peers.css ---- */\n/* ==========================================================================\n   Islands UI · 60 peer adapters\n   Rules for plugins that mount their own surfaces inside the frame. These are\n   not host contracts: each peer owns the attributes and class names below, and\n   the core stylesheets never read them. The CSS gate allows [class*=...] only\n   in this file; a peer that renames its internals degrades these rules alone.\n   ========================================================================== */\n\n/* dsh-better-sidebar: the bottom workbench reserves its height on the\n   conversation column, not on the inner panel. `data-dsh-center-col` and\n   `--dsh-sidebar-height` are the peer's own marks. */\nbody[data-islands-ui] #root [data-dsh-center-col] {\n  margin-bottom: 0;\n}\n\nbody[data-islands-ui]:has([data-dsh-bottom-panel]:not([class*='Hidden'])) [data-islands-part~=\"center-column\"] {\n  /* one gap above the panel and one below it */\n  margin-bottom: calc(var(--dsh-sidebar-height, 0px) + var(--isl-gap));\n}\n\nbody[data-islands-ui] [data-dsh-bottom-panel] {\n  box-sizing: border-box;\n  /* Align the panel with the conversation island edges and let the frame\n     padding provide the bottom gap, so every island shares one gap width. */\n  margin: 0;\n  bottom: var(--isl-gap);\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  box-shadow: none;\n  /* The rounded island clips its content, but NOT the height-drag strip: the\n     strip must reach into the canvas gap above the panel to be reachable\n     there. Clip the body instead (below), so the strip can overhang. */\n  overflow: visible;\n}\n\n/* Keep the island's rounded content edge with the panel's own clipping gone:\n   the body carries the radius, while the absolute resize strip and the close\n   control stay outside this clip. */\nbody[data-islands-ui] [data-dsh-bottom-panel] > [class*='panelBody'] {\n  overflow: clip;\n  border-radius: calc(var(--isl-radius-lg) - 1px);\n}\n\n/* The peer centers its strip on the panel's top border (`top: -4px;\n   height: 8px`), which was right before the skin opened a canvas gap between\n   the conversation island and the panel. Anchor the 10px strip to that gap\n   instead: 5px above the border box top (the whole gap) and 5px inside the\n   panel, matching the side handles' straddle. `top` is relative to the panel's\n   padding box, hence the extra 1px border compensation. */\nbody[data-islands-ui] [data-dsh-bottom-panel] > [class*='bottomResize'] {\n  top: calc(-1px - var(--isl-gap));\n  height: 10px;\n}";

    const ATTRIBUTE = SKIN_ATTR;
    const STORAGE_KEY = 'dsh-islands-ui:enabled';
    const WORKSPACE_ATTR = 'data-islands-workspace-collapsed';
    /** Inline no-op that wakes the desktop caption-colour observer. */
    const CAPTION_SYNC_PROPERTY = '--isl-caption-sync';
    /** Escape hatch, session scoped so the next launch re-runs the check. */
    const FORCE_KEY = 'dsh-islands-ui:force';
    /**
     * Contracts every Islands layout depends on. They do not exist when
     * `apply()` runs (the shell mounts afterwards), so the gate waits for the
     * root slot and only then decides whether this build still matches.
     */
    const CORE_CONTRACTS = [HOST.ROOT_SLOT, HOST.SIDEBAR_SLOT];
    const CORE_PARTS = ['layout-frame', 'center-column', 'sidebar-root'];
    const FRAME = partSelector('layout-frame');

    let animateTimer;
    let skinRegistrar = null;
    let publishRightbarWidth = null;
    let activated = false;
    /** Release reported by the client boot, and the structure observed on the page. */
    let shellVersion = null;
    let shellStructure = 'unknown';
    let styleTag = null;
    let compatState = { status: 'checking', missing: [], forced: false, version: null, structure: 'unknown' };
    const compatListeners = new Set();
    /** Dismisses the compatibility toast while one is on screen. */
    let compatToastDismiss = null;
    /** Runtime yield state; `active` until another participant wins the sidebar. */
    let yieldState = { status: 'active', since: null, retries: 0 };
    const yieldListeners = new Set();

    /** Copy for the preference row; the row is the only user-facing string. */
    const COPY = {
      zh: {
        title: 'Islands 界面',
        description: '悬浮岛屿式布局：圆角面板、常驻左侧导航栏与独立的工作区列表。关闭后立即恢复默认外观。',
        topbarCollapse: '折叠工作区',
        topbarExpand: '展开工作区',
        openRight: '打开侧边栏',
        closeRight: '关闭侧边栏',
        workspace: '工作区',
        pinned: '置顶',
        untitled: '未命名会话',
        locate: '定位到会话',
        unpin: '取消置顶',
        schedules: '自动化任务',
        plugins: '插件',
        settings: '设置',
        railTitle: '左侧栏图标',
        railHint: '点击切换显示；按住图标拖动可排序',
        railShow: '显示在左侧栏',
        railHide: '从左侧栏移除',
        builtIn: 'DSH 内置',
        noExtras: '左侧栏还没有图标',
        enable: '启用 Islands 界面',
        enableDesc: '关闭后立即恢复 DSH 默认外观，设置会保留。',
        accent: '强调色',
        accentDesc: '用于选中状态、滑块、发送按钮等。',
        accentDefault: '跟随主题',
        accentCustom: '自定义颜色',
        models: '选择模型',
        effort: '推理等级',
        back: '返回',
        noEffort: '该模型没有可调推理等级',
        reset: '恢复默认',
        loading: '加载中…',
        pick: '选择模型',
        empty: '没有可用模型',
        failed: '切换失败',
        updateAvailable: '发现新版本 {version}',
        updateAvailablePlain: '发现新版本',
        updateDownloading: '正在下载更新 {percent}%',
        updateDownloadingPlain: '正在下载更新',
        updateDownloadingDetail: '正在下载更新：{percent}%\n目标版本：{version}',
        updateVerifying: '正在校验更新文件…',
        updateInstalling: '正在准备重启…',
        updateReady: '安装并重启',
        updateReadyDetail: '新版本 {version} 已准备就绪，点击安装并重启',
        updateRetry: '重试更新',
        updateFailedCheck: '检查更新失败，请稍后重试。',
        updateFailedCheckNetwork: '检查更新失败，请检查网络连接后重试。',
        updateFailedDownload: '下载更新失败，请重试。',
        updateFailedDownloadNetwork: '下载更新失败，请检查网络连接后重试。',
        updateFailedInstall: '安装更新失败，请稍后重试。',
        updateFailedInstallNetwork: '安装更新失败，请检查网络连接后重试。',
        updateFailedStop: '未能安全停止任务，更新尚未安装，请稍后重试。',
        updateFailedTasksChanged: '有新任务开始运行，请重新确认是否停止任务并更新。',
        updateFailedTasksUnavailable: '无法确认任务状态，请在工作区就绪后重试更新。',
        updateFailedFullscreen: '无法退出全屏，请退出全屏后重试更新。',
        updateFailedGeneric: '更新失败，请稍后重试。',
        updateConfigUnavailable: '配置不可用',
        updateConfigRead: '更新已暂停：无法读取配置文件',
        updateConfigFormat: '更新已暂停：配置文件格式有误',
        updateConfigChannel: '更新已暂停：channel 只能是 nightly 或 stable',
        updateConfigCleanup: '更新已暂停：无法清理旧更新，请重启应用',
        updateConfigGeneric: '更新已暂停：配置不可用',
        compatTitle: 'Islands UI 已自动关闭',
        compatBody: '当前 DSH 构建的界面结构与插件不匹配，皮肤已回退到默认外观，以免出现双栏重叠或控件遮挡。',
        compatView: '查看插件设置',
        compatMissing: '缺失的界面契约',
        compatBannerTitle: '皮肤已自动停用：界面结构不匹配',
        compatBannerBody:
          'Islands UI 的样式依赖 DSH 公开的插槽、相位等契约，以及皮肤写回的部件标记。当前构建缺少核心契约，浮岛布局、原生导航隐藏和工作区折叠都会失效，因此插件没有启用皮肤，DSH 保持默认外观。',
        compatFix: '处理方式：把 Islands UI 更新到适配当前 DSH 的版本，或回退 DSH。若确认界面正常，可临时强制启用（下次启动会重新检测）。',
        compatForce: '仍然启用',
        compatForced: '已强制启用，本次会话跳过自动检测。',
        compatDismiss: '关闭提示',
        compatDetected: '检测到 DSH',
        compatStructure: '侧栏结构',
        compatStructureFlat: '平铺',
        compatStructureScroll: '滚动容器',
        yieldTitle: '皮肤已临时让位',
        yieldBody:
          '检测到其他插件或模式在反复收起侧栏，皮肤已暂停显示，避免双方互相打断。你的启用设置没有改变。',
        yieldHint: '侧栏一旦稳定展开就会自动恢复；连续三次失败会询问你怎么处理。也可以立即重试。',
        yieldRetry: '立即重试',
        yieldDisable: '关闭皮肤',
        yieldDismiss: '取消',
        yieldSince: '发生于',
        yieldToastTitle: 'Islands UI 主题没有生效',
        yieldToastBody: '可能是其他插件影响，没有主题生效的条件，你可以关闭主题，或者立即再试一次。',
        yieldMute: '不再提示',
        smoothCaret: '平滑输入光标',
        smoothCaretDesc: '仅作用于对话输入框：光标随文字平滑滑动，颜色跟随强调色；关闭后使用原生输入光标。',
        smoothCaretCompat: '当前 DSH 构建与平滑光标不兼容，已自动回退原生光标；此开关暂不可用。',
        smoothCaretYielded: '检测到其他光标插件，平滑光标已让位；停用该插件后会自动恢复。',
      },
      en: {
        title: 'Islands interface',
        description:
          'Floating-island layout with rounded panels, a persistent rail and an islanded workspace list. Turn off to return to the default look immediately.',
        topbarCollapse: 'Collapse workspace',
        topbarExpand: 'Expand workspace',
        openRight: 'Open side panel',
        closeRight: 'Close side panel',
        workspace: 'Workspace',
        pinned: 'Pinned',
        untitled: 'Untitled session',
        locate: 'Reveal in workspace',
        unpin: 'Unpin session',
        schedules: 'Automation',
        plugins: 'Plugins',
        settings: 'Settings',
        railTitle: 'Left rail icons',
        railHint: 'Click to show or hide; drag an icon to reorder',
        railShow: 'Show in the left rail',
        railHide: 'Remove from the left rail',
        builtIn: 'Built into DSH',
        noExtras: 'No icons on the left rail',
        enable: 'Enable Islands UI',
        enableDesc: 'Turn off to restore the default appearance immediately; your settings are kept.',
        accent: 'Accent color',
        accentDesc: 'Used for selected states, sliders, the send button and more.',
        accentDefault: 'Follow theme',
        accentCustom: 'Custom color',
        models: 'Select model',
        effort: 'Reasoning',
        back: 'Back',
        noEffort: 'This model has no adjustable reasoning level',
        reset: 'Reset to default',
        loading: 'Loading…',
        pick: 'Select model',
        empty: 'No models available',
        failed: 'Selection failed',
        updateAvailable: 'Update {version} available',
        updateAvailablePlain: 'Update available',
        updateDownloading: 'Downloading update {percent}%',
        updateDownloadingPlain: 'Downloading update',
        updateDownloadingDetail: 'Downloading update: {percent}%\nTarget version: {version}',
        updateVerifying: 'Verifying update files…',
        updateInstalling: 'Preparing to restart…',
        updateReady: 'Install and restart',
        updateReadyDetail: 'Version {version} is ready. Click to install and restart.',
        updateRetry: 'Retry update',
        updateFailedCheck: 'Could not check for updates. Please try again later.',
        updateFailedCheckNetwork: 'Could not check for updates. Check your connection and try again.',
        updateFailedDownload: 'Could not download the update. Please try again.',
        updateFailedDownloadNetwork: 'Could not download the update. Check your connection and try again.',
        updateFailedInstall: 'Could not install the update. Please try again later.',
        updateFailedInstallNetwork: 'Could not install the update. Check your connection and try again.',
        updateFailedStop: 'Could not safely stop the tasks. The update has not been installed. Please try again later.',
        updateFailedTasksChanged: 'New tasks have started. Confirm again to stop the tasks and update.',
        updateFailedTasksUnavailable: 'Task status is unavailable. Try updating again when the workspace is ready.',
        updateFailedFullscreen: 'Could not exit fullscreen. Exit fullscreen, then retry the update.',
        updateFailedGeneric: 'The update failed. Please try again later.',
        updateConfigUnavailable: 'Configuration unavailable',
        updateConfigRead: 'Updates paused: cannot read settings file',
        updateConfigFormat: 'Updates paused: invalid settings file',
        updateConfigChannel: 'Updates paused: channel must be nightly or stable',
        updateConfigCleanup: 'Updates paused: cannot discard previous update; restart the app',
        updateConfigGeneric: 'Updates paused: configuration unavailable',
        compatTitle: 'Islands UI turned itself off',
        compatBody:
          'This DSH build no longer matches the plugin, so the skin fell back to the default look instead of overlapping panels.',
        compatView: 'Open plugin settings',
        compatMissing: 'Missing interface contracts',
        compatBannerTitle: 'Skin disabled: interface structure changed',
        compatBannerBody:
          'Islands UI styles itself against the host contracts for slots and phases, plus the part marks the skin writes back. This build is missing the core contracts, so the island layout, the hidden native navigation and the workspace collapse would all break. The skin therefore stayed off and DSH keeps its default look.',
        compatFix:
          'Update Islands UI to a release that matches this DSH build, or roll DSH back. If the interface looks fine, you can enable it anyway for this session.',
        compatForce: 'Enable anyway',
        compatForced: 'Enabled manually; automatic detection is skipped for this session.',
        compatDismiss: 'Dismiss',
        compatDetected: 'Detected DSH',
        compatStructure: 'Sidebar structure',
        compatStructureFlat: 'flat',
        compatStructureScroll: 'scroll containers',
        yieldTitle: 'Skin stepped aside',
        yieldBody:
          'Another plugin or mode keeps collapsing the sidebar, so the skin stopped drawing instead of trading it back and forth. Your enabled setting is unchanged.',
        yieldHint: 'It comes back once the sidebar settles; after three failed attempts it asks you what to do. You can also retry now.',
        yieldRetry: 'Try again',
        yieldDisable: 'Turn skin off',
        yieldDismiss: 'Cancel',
        yieldSince: 'Since',
        yieldToastTitle: 'The Islands UI theme is not applying',
        yieldToastBody: 'Another plugin is probably in the way, so the theme has nothing to apply to. Turn the skin off, or try again now.',
        yieldMute: "Don't ask again",
        smoothCaret: 'Smooth input caret',
        smoothCaretDesc:
          'Applies to the conversation composer: the caret glides between positions and follows the accent color; turn off to use the native caret.',
        smoothCaretCompat:
          'This DSH build is not compatible with the smooth caret; the native caret is used and this switch is unavailable.',
        smoothCaretYielded:
          'Another caret plugin is active; the smooth caret yields to it and resumes when that plugin is disabled.',
      },
    };

    let localeService;
    let layoutService;
    let slotsService;
    let shortcutsService;
    let uiWorkspaceService;
    let workspacesService;
    let modelDirectories;
    const RAIL_PIN_KEY = 'dsh-islands-ui:rail-pins';
    /** Order + visibility of every left-rail panel entry. */
    const RAIL_CONFIG_KEY = 'dsh-islands-ui:rail';
    const ACCENT_KEY = 'dsh-islands-ui:accent';
    const DEFAULT_ACCENT = '#4176e6';
    const ACCENT_PRESETS = ['#4176e6', '#7c5cff', '#1f9d63', '#e07a2e', '#d94f8a', '#d64545'];
    const listeners = new Set();

    function readStored() {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored === null ? true : stored === '1';
      } catch {
        return true;
      }
    }

    let enabled = readStored();

    /**
     * Set while the yield guard has stood the skin down: the host sidebar is
     * being collapsed by someone else faster than the skin can restore it, and
     * keeping the skin on would turn that into a fight. The user's preference
     * (`enabled`) is untouched; only the attribute and the host writes stop.
     */
    let skinSuspended = false;
    /** Filled by the conversion effect so the settings page can ask for a retry. */
    let yieldRetry = null;
    /** Dismisses the yield prompt while one is on screen. */
    let yieldToastDismiss = null;
    /** "Don't ask again" — session only, never persisted, gone on reload. */
    let yieldPromptMuted = false;

    function syncAttribute() {
      const body = document.body;
      if (body === null) return;
      if (enabled && !skinSuspended) {
        body.setAttribute(ATTRIBUTE, '');
        // Desktop colours the Windows caption buttons from a probe that reads
        // --dsw-specific-sidebar-fill. Its observer watches body's style and
        // data-ds-dark-theme, not the skin's data-islands-ui, so the caption is
        // otherwise measured before this attribute turns the token white.
        // Writing the custom property nudges that observer to re-measure.
        body.style.setProperty(CAPTION_SYNC_PROPERTY, '1');
      } else {
        body.removeAttribute(ATTRIBUTE);
        body.style.removeProperty(CAPTION_SYNC_PROPERTY);
        // The skin's collapse is its own state; turning the skin off must hand
        // the sidebar back to the host exactly as it was. Publishing through
        // the helper also resets the top bar's aria state.
        setWorkspaceCollapsed(false);
        body.removeAttribute('data-islands-animating');
      }
    }

    function subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }

    function getSnapshot() {
      return enabled;
    }

    function setEnabled(next) {
      enabled = next === true;
      try {
        window.localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
      } catch {
        /* private mode: the choice still applies for this page. */
      }
      syncAttribute();
      syncCaretOverlay();
      for (const listener of listeners) listener();
    }

    function shortcutKeys(id, fallback = '') {
      try {
        const row = shortcutsService?.catalog?.getSnapshot?.().find((value) => value.id === id);
        const keys = row?.keys;
        if (Array.isArray(keys) && keys.length > 0) {
          const mac =
            document.documentElement.getAttribute('data-platform') === 'darwin' ||
            /Mac/i.test(navigator.platform ?? '');
          return keys.join(mac ? '' : '+');
        }
      } catch {
        /* ignore */
      }
      return fallback;
    }

    function withShortcut(label, id, fallback = '') {
      const keys = shortcutKeys(id, fallback);
      return keys === '' ? label : `${label} (${keys})`;
    }

    function useEnabled() {
      return React.useSyncExternalStore(subscribe, getSnapshot);
    }

    function setCompat(next) {
      compatState = next;
      for (const listener of compatListeners) listener();
    }

    function subscribeCompat(listener) {
      compatListeners.add(listener);
      return () => compatListeners.delete(listener);
    }

    function getCompatSnapshot() {
      return compatState;
    }

    function useCompat() {
      return React.useSyncExternalStore(subscribeCompat, getCompatSnapshot);
    }

    function setYieldState(next) {
      yieldState = next;
      for (const listener of yieldListeners) listener();
    }

    function subscribeYield(listener) {
      yieldListeners.add(listener);
      return () => yieldListeners.delete(listener);
    }

    function getYieldSnapshot() {
      return yieldState;
    }

    function useYield() {
      return React.useSyncExternalStore(subscribeYield, getYieldSnapshot);
    }

    /** The smooth caret keeps its own compatibility state; see src/host/caret.js. */
    function useCaretCompat() {
      return React.useSyncExternalStore(subscribeCaretCompat, getCaretCompatSnapshot);
    }

    function currentCopy() {
      try {
        return String(localeService?.getSnapshot?.().active ?? 'en').toLowerCase().startsWith('zh')
          ? COPY.zh
          : COPY.en;
      } catch {
        return COPY.en;
      }
    }

    function isForced() {
      try {
        return window.sessionStorage.getItem(FORCE_KEY) === '1';
      } catch {
        return false;
      }
    }

    /**
     * The DSH release this page booted with. The client module system publishes
     * it in `window.__DSH_BOOT__.release` (shared with the CLI version), so a
     * plugin can pick the stylesheet written for the running shell without a
     * Host round trip.
     */
    function readDshVersion() {
      try {
        const release = window.__DSH_BOOT__?.release;
        return typeof release?.version === 'string' && release.version !== '' ? release.version : null;
      } catch {
        return null;
      }
    }

    /**
     * Structure the mounted shell actually uses, read from the parts the walker
     * wrote. This is display information only: the stylesheet never branches on
     * a release number.
     */
    function detectStructure() {
      if (document.querySelector(partSelector('sidebar-scroll-region')) !== null) return 'scroll';
      if (document.querySelector(partSelector('region-area')) !== null) return 'flat';
      return 'unknown';
    }

    /** Which host contracts or core parts of the running build are gone. */
    function missingAnchors() {
      const missing = [];
      for (const selector of CORE_CONTRACTS) {
        if (document.querySelector(selector) === null) missing.push(selector);
      }
      for (const part of CORE_PARTS) {
        if (document.querySelector(partSelector(part)) === null) missing.push(partSelector(part));
      }
      return missing;
    }

    function readAccent() {
      try {
        const stored = window.localStorage.getItem(ACCENT_KEY);
        return stored !== null && /^#[0-9a-f]{6}$/iu.test(stored) ? stored : null;
      } catch {
        return null;
      }
    }

    function applyAccent(color) {
      const body = document.body;
      if (body === null) return;
      if (color === null) {
        body.removeAttribute('data-islands-accent');
        body.style.removeProperty('--isl-accent');
      } else {
        body.setAttribute('data-islands-accent', '');
        body.style.setProperty('--isl-accent', color);
      }
    }

    function storeAccent(color) {
      try {
        if (color === null) window.localStorage.removeItem(ACCENT_KEY);
        else window.localStorage.setItem(ACCENT_KEY, color);
      } catch {
        /* private mode: keep the session choice. */
      }
    }

    function useLocale() {
      return React.useSyncExternalStore(
        (listener) => (localeService === undefined ? () => {} : localeService.subscribe(listener)),
        () => (localeService === undefined ? 'en' : localeService.getSnapshot().active),
      );
    }

    /** Sidebar glyph for the window bar (divider on the left, workspace rail). */
    function PanelGlyph() {
      return h(
        'svg',
        { width: 16, height: 16, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('rect', {
          x: 2.5,
          y: 3.5,
          width: 15,
          height: 13,
          rx: 3,
          stroke: 'currentColor',
          strokeWidth: 1.5,
        }),
        h('path', { d: 'M7.5 4v12', stroke: 'currentColor', strokeWidth: 1.5 }),
      );
    }

    /** Mirror glyph for the right sidebar toggle (divider on the right). */
    function RightPanelGlyph() {
      return h(
        'svg',
        { width: 16, height: 16, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('rect', {
          x: 2.5,
          y: 3.5,
          width: 15,
          height: 13,
          rx: 3,
          stroke: 'currentColor',
          strokeWidth: 1.5,
        }),
        h('path', { d: 'M12.5 4v12', stroke: 'currentColor', strokeWidth: 1.5 }),
      );
    }

    /** Small glyphs used by the composer model picker. */
    function ModelGlyph() {
      return h(
        'svg',
        { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('rect', { x: 1.5, y: 1.5, width: 13, height: 13, rx: 4, stroke: 'currentColor', strokeWidth: 1.3 }),
        h('path', { d: 'M5 9.5 6.8 6l1.7 3.5L10.2 6 12 9.5', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      );
    }

    function CheckGlyph() {
      return h(
        'svg',
        { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'm3.5 8.5 3 3 6-6.5', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      );
    }

    function ChevronGlyph() {
      return h(
        'svg',
        { width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'm4 6 4 4 4-4', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      );
    }

    function ResetGlyph() {
      return h(
        'svg',
        { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M3.5 6.5A5 5 0 1 1 3 9.5', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }),
        h('path', { d: 'M3 3.5v3h3', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      );
    }

    function DownloadGlyph({ size = 16 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M10 3.4v8.2', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' }),
        h('path', { d: 'm6.7 8.7 3.3 3.3 3.3-3.3', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }),
        h('path', { d: 'M4.5 15.6h11', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' }),
      );
    }

    function RestartGlyph({ size = 16 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M16.4 8.1A6.5 6.5 0 1 0 16.4 12', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
        h('path', { d: 'M16.4 3.9v4.2h-4.2', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      );
    }

    function CheckGlyph({ size = 16 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('path', {
          d: 'm5.4 10.5 3.1 3.1 6.1-6.8',
          stroke: 'currentColor',
          strokeWidth: 1.8,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

    /** Clamped download percentage, or null when the host reported none. */
    function updatePercent(state) {
      const raw = Number(state?.percent);
      if (!Number.isFinite(raw)) return null;
      return Math.max(0, Math.min(100, Math.round(raw)));
    }

    /**
     * Progress ring drawn inside the disc edge. `downloading` is determinate:
     * the circle carries `pathLength="100"`, so the dash is a percentage and
     * the CSS transition smooths the steps. The other busy phases have no
     * numbers to show, so the same ring sweeps instead — steady while files
     * are verified, faster and breathing while the app prepares to restart.
     */
    function UpdateRing({ phase, percent }) {
      const indeterminate = percent === null || phase !== 'downloading';
      const motion = phase === 'installing' ? 'is-install' : 'is-verify';
      return h(
        'svg',
        {
          className: `isl-updateRing${indeterminate ? ` ${motion}` : ''}`,
          viewBox: '0 0 30 30',
          'aria-hidden': true,
          focusable: 'false',
        },
        h('circle', { className: 'isl-updateRingTrack', cx: 15, cy: 15, r: 12, pathLength: 100 }),
        h('circle', {
          className: 'isl-updateRingBar',
          cx: 15,
          cy: 15,
          r: 12,
          pathLength: 100,
          strokeDasharray: indeterminate ? undefined : `${percent} ${100 - percent}`,
        }),
      );
    }

    /**
     * Glyph for the rail update button. A download in flight has none: the ring
     * is the whole state, and the centre stays clear so the arc reads as
     * progress instead of decoration.
     */
    function UpdateGlyph({ phase, size = 16 }) {
      if (phase === 'downloading') return null;
      if (phase === 'available' || phase === 'error') return h(DownloadGlyph, { size });
      if (phase === 'verifying') return h(CheckGlyph, { size });
      return h(RestartGlyph, { size });
    }

    function readRailPins() {
      try {
        const raw = window.localStorage.getItem(RAIL_PIN_KEY);
        const parsed = raw === null ? [] : JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
      } catch {
        return [];
      }
    }

    function uniqueRailIds(values) {
      const seen = new Set();
      const result = [];
      for (const value of values) {
        if (typeof value !== 'string' || value === '' || seen.has(value)) continue;
        seen.add(value);
        result.push(value);
      }
      return result;
    }

    /**
     * The rail shows every panel entry by default and remembers the user's
     * order and the entries they hid. Configurations written by 1.0.x only
     * stored pins, so they are read once and migrated into an order prefix.
     */
    function readRailConfig() {
      try {
        const raw = window.localStorage.getItem(RAIL_CONFIG_KEY);
        if (raw !== null) {
          const parsed = JSON.parse(raw);
          return {
            order: uniqueRailIds(Array.isArray(parsed?.order) ? parsed.order : []),
            hidden: uniqueRailIds(Array.isArray(parsed?.hidden) ? parsed.hidden : []),
          };
        }
      } catch {
        /* fall through to the legacy pin list */
      }
      return { order: uniqueRailIds(['schedules', 'plugins', ...readRailPins()]), hidden: [] };
    }

    function writeRailConfig(config) {
      try {
        window.localStorage.setItem(RAIL_CONFIG_KEY, JSON.stringify(config));
        // The legacy key only seeds the first migration; drop it once the new
        // configuration exists so clearing that key really resets the rail.
        window.localStorage.removeItem(RAIL_PIN_KEY);
      } catch {
        /* private mode: keep the arrangement for this session only. */
      }
    }

    function HouseGlyph() {
      return h('svg', { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M3 8.6 10 3l7 5.6V16a1 1 0 0 1-1 1h-4v-4.5H8V17H4a1 1 0 0 1-1-1V8.6Z', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round' }));
    }

    function ClockGlyph() {
      return h('svg', { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('circle', { cx: 10, cy: 10, r: 7, stroke: 'currentColor', strokeWidth: 1.5 }),
        h('path', { d: 'M10 6.2V10l2.6 1.6', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }));
    }

    function PluginsGlyph() {
      return h('svg', { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('rect', { x: 3, y: 3, width: 6, height: 6, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.4 }),
        h('rect', { x: 11, y: 3, width: 6, height: 6, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.4 }),
        h('rect', { x: 3, y: 11, width: 6, height: 6, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.4 }),
        h('path', { d: 'M14 11v6M11 14h6', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }));
    }

    function PlugGlyph() {
      return h('svg', { width: 17, height: 17, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M7 3v4M13 3v4M5 7h10v3a5 5 0 0 1-10 0V7ZM10 15v3', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }));
    }

    function CheckGlyph() {
      return h('svg', { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'm3 8.4 3.2 3.2L13 4.8', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }));
    }

    function PlusGlyph() {
      return h('svg', { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M10 4v12M4 10h12', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }));
    }

    function GearGlyph() {
      return h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true },
        h('circle', { cx: 12, cy: 12, r: 3, stroke: 'currentColor', strokeWidth: 1.6 }),
        h('path', {
          d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

    /**
     * Best effort selection of one settings section once the dialog is up. The
     * settings navigation has no service of its own, so the row is matched by
     * its label inside the dialog and simply skipped when it is not there.
     */
    function revealSettingsSection(label) {
      if (typeof label !== 'string' || label === '') return;
      let attempts = 0;
      const tick = () => {
        attempts += 1;
        const scope = document.querySelector(HOST.SETTINGS_DIALOG) ?? document;
        const cells = [
          ...scope.querySelectorAll(`button, a, [role="tab"], [role="option"], ${partSelector('settings-nav-cell')}`),
        ];
        const target = cells.find((cell) => (cell.textContent ?? '').trim() === label);
        if (target instanceof HTMLElement) {
          target.click();
          return;
        }
        if (attempts < 12) window.setTimeout(tick, 120);
      };
      window.setTimeout(tick, 140);
    }

    /** The Settings row inside the account menu, if that menu is open. */
    function accountSettingsItem() {
      return [
        ...document.querySelectorAll('[role="menu"] [role="menuitem"], [role="menu"] [role="menuitemradio"], [role="menu"] button, [role="menu"] a'),
      ].find((element) => /设置|Settings|偏好|Preferences/i.test(element.textContent ?? '')) ?? null;
    }

    function openSettings(options) {
      const section = options?.section;
      // The dialog may already be open (the compatibility banner lives inside
      // it); clicking the toggle again would close it.
      if (document.querySelector(HOST.SETTINGS_DIALOG) !== null) {
        revealSettingsSection(section);
        return;
      }
      // Some builds expose a direct settings trigger in the sidebar foot; the
      // account menu path remains for builds that fold Settings into a menu.
      const direct = document.querySelector(HOST.SETTINGS_TRIGGER);
      if (direct instanceof HTMLElement) {
        direct.click();
        revealSettingsSection(section);
        return;
      }
      const trigger = document.querySelector(`${partSelector('foot-area')} button[aria-haspopup="menu"]`);
      if (trigger instanceof HTMLElement) {
        // Click the account menu's Settings row as soon as it exists. Waiting a
        // fixed delay lets the account menu paint and reads as an extra step.
        // A mutation observer fires before the next paint, so the menu never
        // becomes the visible intermediate state.
        let observer = null;
        let timer = null;
        const stop = () => {
          observer?.disconnect();
          observer = null;
          if (timer !== null) window.clearTimeout(timer);
          timer = null;
        };
        const clickSettings = () => {
          if (document.querySelector(HOST.SETTINGS_DIALOG) !== null) {
            stop();
            return true;
          }
          const item = accountSettingsItem();
          if (!(item instanceof HTMLElement)) return false;
          stop();
          item.click();
          return true;
        };
        if (trigger.getAttribute('aria-expanded') !== 'true') trigger.click();
        if (!clickSettings()) {
          observer = new MutationObserver(() => {
            clickSettings();
          });
          observer.observe(document.body, { childList: true, subtree: true });
          timer = window.setTimeout(stop, 800);
        }
        revealSettingsSection(section);
        return;
      }
      try {
        const row = (shortcutsService?.catalog?.getSnapshot?.() ?? []).find(
          (value) => value.id === 'settings.open' && value.binding !== null && value.binding !== undefined,
        );
        if (row?.binding !== undefined) {
          const modifiers = new Set(row.binding.modifiers ?? []);
          window.dispatchEvent(
            new KeyboardEvent('keydown', {
              code: row.binding.code,
              key: ',',
              metaKey: modifiers.has('meta'),
              ctrlKey: modifiers.has('control'),
              altKey: modifiers.has('alt'),
              shiftKey: modifiers.has('shift'),
              bubbles: true,
              cancelable: true,
            }),
          );
        }
      } catch {
        /* ignore */
      }
      revealSettingsSection(section);
    }

    function LocateGlyph() {
      return h('svg', { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('circle', { cx: 8, cy: 8, r: 4, stroke: 'currentColor', strokeWidth: 1.3 }),
        h('path', { d: 'M8 1.5v2.2M8 12.3v2.2M1.5 8h2.2M12.3 8h2.2', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' }));
    }

    function defaultPinIcon() {
      try {
        const entries = slotsService?.entriesOfSlot?.('contextMenu.icon') ?? [];
        const entry =
          entries.find((value) => value.options?.key === 'workspace.unpin') ??
          entries.find((value) => value.options?.key === 'workspace.pin');
        if (entry?.component !== undefined) return h(entry.component, { size: 14 });
      } catch {
        /* fall back to the local glyph */
      }
      return h(PinGlyph);
    }

    /** A second click while the list is still opening must not race the first. */
    let locating = false;

    /**
     * Escape a value for a quoted attribute selector. Row keys are ids, but a
     * session id never gets concatenated into a selector without this.
     */
    function rowKeyValue(value) {
      return String(value).replaceAll('\\', '\\\\').replaceAll('"', '\\"');
    }

    /** One paint, with a timer fallback for a background window. */
    function nextFrame() {
      return new Promise((resolve) => {
        let settled = false;
        const done = () => {
          if (settled) return;
          settled = true;
          resolve();
        };
        requestAnimationFrame(done);
        window.setTimeout(done, 120);
      });
    }

    /**
     * Reveal a pinned session in the workspace list.
     *
     * The Workspace row is the host's `treeitem` and toggles on a plain click,
     * but its descendants also carry `aria-expanded`: the "..." context-menu
     * trigger and the overflow button. Expanding through a descendant lookup
     * therefore clicked the menu trigger, opened the Workspace menu at the
     * viewport origin (the row actions are hidden until hover, so the trigger
     * has no rect) and left the group collapsed. Match the session by its row
     * key instead of by title, and toggle the row itself.
     */
    async function revealPinnedSession(sessionId, workspaceId) {
      if (locating) return;
      locating = true;
      try {
        const sessionSelector = `[data-row-key="session:${rowKeyValue(sessionId)}"]`;
        const findSession = () => document.querySelector(sessionSelector);
        const projectRows = () => [...document.querySelectorAll(HOST.WORKSPACE_ROW)];
        const expanded = (row) => row.getAttribute('aria-expanded') === 'true';
        const rowKey = (row) => row.getAttribute('data-row-key');
        const findWorkspace = (id) =>
          document.querySelector(`[data-row-key="workspace:${rowKeyValue(id)}"]`);
        // HoverCard wraps both Workspace and session anchors in a span, so a
        // row's parent is not its group section. A section is the child of the
        // tree itself or of an enclosing role=group.
        const sectionOf = (row) => {
          let node = row.parentElement;
          while (node !== null) {
            const parent = node.parentElement;
            if (parent === null) return null;
            const role = parent.getAttribute('role');
            if (role === 'group' || role === 'tree') return node;
            node = parent;
          }
          return null;
        };

        let row = findSession();
        const reopened = new Set();

        // Expand collapsed Workspaces until the target mounts. A single pass
        // is not enough: opening a nested Workspace mounts its children
        // collapsed, and those children need their own click.
        for (let pass = 0; row === null && pass < 16; pass += 1) {
          const collapsed = projectRows().filter((project) => !expanded(project));
          if (collapsed.length === 0) break;
          for (const project of collapsed) {
            if (!project.isConnected || expanded(project)) continue;
            project.click();
            reopened.add(rowKey(project));
          }
          await nextFrame();
          row = findSession();
        }

        // The host only paints a small window of sessions per group. The
        // target is normally pinned to the front, but when it sits behind the
        // overflow button, raise that group's watermark until the row exists.
        for (let step = 0; row === null && step < 10; step += 1) {
          const owner = workspaceId === undefined ? null : findWorkspace(workspaceId);
          const section = owner === null ? null : sectionOf(owner);
          const overflow =
            section?.querySelector(':scope > [data-row-key^="overflow:"]') ??
            (workspaceId === undefined
              ? document.querySelector('[data-row-key="overflow:"]')
              : null);
          if (!(overflow instanceof HTMLElement)) break;
          overflow.click();
          await nextFrame();
          row = findSession();
        }

        // The owning Workspace is the project row in the same group section;
        // nested ancestors are the project rows above each enclosing
        // role=group. Keep them open after undoing the temporary expansion.
        const keep = new Set();
        if (row !== null) {
          let section = sectionOf(row);
          let owner = section?.querySelector(HOST.WORKSPACE_ROW) ?? null;
          while (section !== null && owner !== null) {
            keep.add(rowKey(owner));
            const group = section.parentElement;
            if (!(group instanceof HTMLElement) || group.getAttribute('role') !== 'group') break;
            section = group.parentElement;
            owner = section instanceof HTMLElement ? section.querySelector(HOST.WORKSPACE_ROW) : null;
          }
        }

        // Restore the groups this run opened only to make the target
        // reachable. Walk deepest first so a child's expansion state is
        // reverted before its parent unmounts it.
        for (const key of [...reopened].reverse()) {
          if (keep.has(key)) continue;
          const project = projectRows().find((candidate) => rowKey(candidate) === key);
          if (project !== undefined && project.isConnected && expanded(project)) project.click();
        }

        if (row === null) return;
        await nextFrame();

        const target = findSession();
        if (!(target instanceof HTMLElement)) return;
        target.scrollIntoView({ block: 'center', behavior: 'smooth' });
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.classList.add('isl-located');
        window.setTimeout(() => target.classList.remove('isl-located'), 1400);
      } catch {
        /* The sidebar belongs to the host; a failed locate leaves it as it is. */
      } finally {
        locating = false;
      }
    }

    function PinGlyph() {
      return h('svg', { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M6 2v4L4 8v1.5h3.2V14l.8 1 .8-1V9.5H12V8l-2-2V2', stroke: 'currentColor', strokeWidth: 1.3, strokeLinejoin: 'round' }));
    }

    /** Hover label delay; moving between tiles swaps the label without it. */
    const RAIL_TIP_DELAY_MS = 340;

    /**
     * One hover label for the rail chain (panel tiles and the settings gear).
     * The rail clips horizontally, so the pill is portalled to <body> and
     * parked at fixed coordinates beside the tile that owns it: it must not be
     * a child of the focused button or a sibling inside the scrolling rail.
     */
    function useRailTip() {
      const [tip, setTip] = React.useState(null);
      const timerRef = React.useRef(0);
      const shownRef = React.useRef(false);
      shownRef.current = tip !== null;

      const hide = React.useCallback(() => {
        window.clearTimeout(timerRef.current);
        timerRef.current = 0;
        setTip(null);
      }, []);

      const anchorRef = React.useRef(null);

      // Re-measures the tile that owns the label. Identity is preserved when
      // nothing moved so a scroll elsewhere in the app costs no re-render.
      const place = React.useCallback((node, label) => {
        const rect = node.getBoundingClientRect();
        setTip((prev) => {
          const left = Math.round(rect.right) + 8;
          const top = Math.round(rect.top + rect.height / 2);
          if (prev !== null && prev.left === left && prev.top === top && prev.label === label) return prev;
          return { label, left, top };
        });
      }, []);

      const show = React.useCallback((node, label, immediate = false) => {
        if (!(node instanceof Element) || typeof label !== 'string' || label === '') return;
        window.clearTimeout(timerRef.current);
        anchorRef.current = { node, label };
        // A second tile while the label is already open swaps it in place;
        // only the first hover waits, so the rail never flickers on the way
        // down the column.
        if (immediate || shownRef.current) place(node, label);
        else timerRef.current = window.setTimeout(() => place(node, label), RAIL_TIP_DELAY_MS);
      }, [place]);

      React.useEffect(() => () => window.clearTimeout(timerRef.current), []);

      // Keep the parked label glued to its tile: the rail scrolls, the window
      // resizes, and the transcript streaming above must not evict it either —
      // only a tile that left the document takes the label with it.
      React.useEffect(() => {
        if (tip === null) return undefined;
        const sync = () => {
          const anchor = anchorRef.current;
          if (anchor === null || !anchor.node.isConnected) {
            hide();
            return;
          }
          place(anchor.node, anchor.label);
        };
        window.addEventListener('scroll', sync, true);
        window.addEventListener('resize', sync);
        return () => {
          window.removeEventListener('scroll', sync, true);
          window.removeEventListener('resize', sync);
        };
      }, [tip, hide, place]);

      const node = tip === null
        ? null
        : ReactDOM.createPortal(
            h(
              'div',
              {
                className: 'isl-railTip',
                'aria-hidden': true,
                style: { left: `${tip.left}px`, top: `${tip.top}px` },
              },
              tip.label,
            ),
            document.body,
          );
      return { show, hide, node };
    }

    /**
     * Left rail: the workspace home plus every panel launcher registered in
     * `sidebar.panellist`. Entries are shown directly, reordered by dragging,
     * and shown or hidden from the right-click management menu.
     */
    function IslandsRail({ usePanelInfo }) {
      const active = usePanelInfo((info) => info.activePanelId ?? null);
      const [config, setConfig] = React.useState(readRailConfig);
      const [menu, setMenu] = React.useState(null);
      const [dragId, setDragId] = React.useState(null);
      const [ripples, setRipples] = React.useState([]);
      const rippleSeq = React.useRef(0);
      const [, refreshEntries] = React.useState(0);
      const railRef = React.useRef(null);
      const menuRef = React.useRef(null);
      const itemRefs = React.useRef(new Map());
      const configRef = React.useRef(config);
      const dragRef = React.useRef(null);
      const suppressClickRef = React.useRef(false);
      const tip = useRailTip();
      const lang = useLocale() ?? 'en';
      const copy = String(lang).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
      configRef.current = config;

      const allEntries = (() => {
        try {
          const seen = new Set();
          return (slotsService?.entriesOfSlot('sidebar.panellist') ?? []).flatMap((entry) => {
            const id = entry.options.id;
            if (typeof id !== 'string' || id === '' || seen.has(id)) return [];
            seen.add(id);
            return [{
              id,
              order: entry.options.order ?? 0,
              label: typeof entry.options.label === 'function' ? entry.options.label() : entry.options.label,
              registrant: entry.registrant,
              component: entry.component,
            }];
          });
        } catch {
          return [];
        }
      })();

      const byId = new Map(allEntries.map((entry) => [entry.id, entry]));
      const storedIndex = new Map(config.order.map((id, index) => [id, index]));
      // The two shipped panels lead on a fresh install; every other launcher
      // follows registration order until the user drags it somewhere else.
      const defaultIds = [
        ...['schedules', 'plugins'].filter((id) => byId.has(id)),
        ...allEntries.map((entry) => entry.id).filter((id) => id !== 'schedules' && id !== 'plugins'),
      ];
      const defaultIndex = new Map(defaultIds.map((id, index) => [id, index]));
      const orderedEntries = [...allEntries].sort((left, right) => {
        const leftIndex = storedIndex.get(left.id);
        const rightIndex = storedIndex.get(right.id);
        if (leftIndex !== undefined || rightIndex !== undefined) {
          if (leftIndex === undefined) return 1;
          if (rightIndex === undefined) return -1;
          if (leftIndex !== rightIndex) return leftIndex - rightIndex;
        }
        return (defaultIndex.get(left.id) ?? 0) - (defaultIndex.get(right.id) ?? 0);
      });
      const visible = orderedEntries.filter((entry) => !config.hidden.includes(entry.id));

      // A plugin can register a panel after the shell is already mounted.
      React.useEffect(() => {
        try {
          const unsubscribe = slotsService?.subscribe?.('sidebar.panellist', () => refreshEntries((value) => value + 1));
          return typeof unsubscribe === 'function' ? unsubscribe : undefined;
        } catch {
          return undefined;
        }
      }, []);

      React.useEffect(() => {
        if (menu === null) return;
        const onDown = (event) => {
          if (railRef.current?.contains(event.target) === true) return;
          if (menuRef.current?.contains(event.target) === true) return;
          setMenu(null);
        };
        const onKey = (event) => {
          if (event.key === 'Escape') setMenu(null);
        };
        document.addEventListener('mousedown', onDown, true);
        document.addEventListener('keydown', onKey, true);
        return () => {
          document.removeEventListener('mousedown', onDown, true);
          document.removeEventListener('keydown', onKey, true);
        };
      }, [menu]);

      React.useEffect(
        () => () => {
          dragRef.current?.detach?.();
          dragRef.current = null;
        },
        [],
      );

      const iconFor = (id, size) => {
        const entry = byId.get(id);
        if (entry?.component !== undefined) {
          // The registration contract hands a plugin's `inject` face to its
          // component; the shell renders it through the slot renderer, so this
          // rail resolves the same face itself. A factory that refuses the
          // owner props still renders without them, exactly as before.
          let injected;
          try {
            injected = typeof entry.options?.inject === 'function'
              ? entry.options.inject({ size, active: active === id })
              : undefined;
          } catch {
            injected = undefined;
          }
          try {
            return h(entry.component, { size, active: active === id, ...(injected ?? {}) });
          } catch {
            /* fall back to the generic glyph */
          }
        }
        if (id === 'schedules') return h(ClockGlyph);
        if (id === 'plugins') return h(PluginsGlyph);
        return h(PlugGlyph);
      };

      // Official panels are registered by the bundled web-client fiber, whose
      // internal name is `wc`; that code means nothing in the UI. Third-party
      // entries keep their package name so the owner is still recognizable.
      const ownerFor = (registrant) => {
        if (typeof registrant !== 'string') return undefined;
        const code = registrant.trim();
        if (code === '') return undefined;
        // The bundled client reports the fiber as `WC` (older bundles may use
        // lower case); both are the same internal name, not a plugin name.
        return code.toLowerCase() === 'wc' ? copy.builtIn : code;
      };

      const labelFor = (id) => {
        const entry = byId.get(id);
        const label = entry?.label ?? id;
        const owner = ownerFor(entry?.registrant);
        return owner === undefined ? label : `${label} · ${owner}`;
      };

      const openMenuAt = (x, y, contextId) => {
        tip.hide();
        const width = 248;
        const height = Math.min(window.innerHeight - 16, 76 + orderedEntries.length * 36);
        const left = Math.max(8, Math.min(x, window.innerWidth - width - 8));
        const top = y + height + 8 <= window.innerHeight ? y : Math.max(8, y - height);
        setMenu({ left, top, contextId });
      };

      const toggleHidden = (id) => {
        const current = configRef.current;
        const hidden = current.hidden.includes(id)
          ? current.hidden.filter((value) => value !== id)
          : [...current.hidden, id];
        const next = { order: current.order, hidden };
        configRef.current = next;
        setConfig(next);
        writeRailConfig(next);
      };

      const addRipple = (event) => {
        const button = event.currentTarget;
        if (button === null) return;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2.4;
        // Keyboard activation (Enter/Space) reports detail 0 and no pointer
        // position; centre the ripple on the tile instead.
        const centered = event.detail === 0 || (event.clientX === 0 && event.clientY === 0);
        const x = centered ? rect.width / 2 : event.clientX - rect.left;
        const y = centered ? rect.height / 2 : event.clientY - rect.top;
        const key = `ripple-${rippleSeq.current++}`;
        setRipples((values) => [...values, { key, x, y, size }]);
      };

      const removeRipple = (key) => {
        setRipples((values) => values.filter((value) => value.key !== key));
      };

      const select = (id) => {
        setMenu(null);
        // The home button is the workspace drawer's opener in the narrow
        // layout; on desktop it returns to the conversation as before.
        if (id === null) {
          const frame = document.querySelector(FRAME);
          if (frame !== null && frame.hasAttribute('data-sidebar-drawer')) {
            layoutService?.toggleSidebar();
            return;
          }
        }
        // The rail is the navigation while the workspace is hidden: selecting
        // a destination opens the workspace on it, matching the host's rail.
        if (document.body.hasAttribute(WORKSPACE_ATTR)) toggleWorkspace();
        layoutService?.selectPanel(id);
        // Panels that take over the center column without owning a `main` key
        // (task board, SSH, image studio …) cannot be closed by selecting the
        // conversation alone: they hear it through the activation event the
        // same surfaces already announce themselves with.
        if (id === null) {
          document.dispatchEvent(new CustomEvent('dsh-panel-activate', { detail: null }));
        }
      };

      const autoScroll = (clientY) => {
        const rail = railRef.current;
        if (rail === null) return;
        const rect = rail.getBoundingClientRect();
        if (clientY < rect.top + 32) rail.scrollTop -= 12;
        else if (clientY > rect.bottom - 32) rail.scrollTop += 12;
      };

      const beforeIdAt = (clientY, id) => {
        for (const entry of visible) {
          if (entry.id === id) continue;
          const node = itemRefs.current.get(entry.id);
          if (node === undefined) continue;
          const rect = node.getBoundingClientRect();
          if (clientY < rect.top + rect.height / 2) return entry.id;
        }
        return null;
      };

      const moveEntryBefore = (id, beforeId) => {
        const current = configRef.current;
        const baseOrder = orderedEntries.map((entry) => entry.id);
        const currentOrder = uniqueRailIds([...current.order, ...baseOrder]);
        const without = currentOrder.filter((value) => value !== id);
        let index = beforeId === null ? without.length : without.indexOf(beforeId);
        if (index === -1) index = without.length;
        without.splice(index, 0, id);
        if (without.length === currentOrder.length && without.every((value, at) => value === currentOrder[at])) return;
        const next = { order: without, hidden: current.hidden };
        configRef.current = next;
        setConfig(next);
      };

      const beginDrag = (event, id) => {
        if (event.button !== 0 || dragRef.current !== null) return;
        tip.hide();
        const pointerId = event.pointerId;
        const startX = event.clientX;
        const startY = event.clientY;
        const source = event.currentTarget;
        const origin = source.getBoundingClientRect();
        const state = {
          id,
          active: false,
          detach: null,
          ghost: null,
          offsetX: startX - origin.left,
          offsetY: startY - origin.top,
        };
        const positionGhost = (x, y) => {
          if (state.ghost === null) return;
          state.ghost.style.transform = `translate3d(${x - state.offsetX}px, ${y - state.offsetY}px, 0)`;
        };
        const detach = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp, true);
          window.removeEventListener('pointercancel', onUp, true);
          if (state.ghost !== null) {
            state.ghost.remove();
            state.ghost = null;
          }
        };
        const onMove = (moveEvent) => {
          if (moveEvent.pointerId !== pointerId) return;
          if (!state.active) {
            if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < 4) return;
            state.active = true;
            suppressClickRef.current = true;
            setDragId(id);
            setMenu(null);
            // Clone the rendered icon so the ghost keeps the exact glyph and
            // size of the row, then park it under the pointer at the grab
            // offset. It must never intercept pointer events.
            const ghost = source.cloneNode(true);
            ghost.className = 'isl-railGhost';
            ghost.removeAttribute('data-rail-id');
            ghost.removeAttribute('data-draggable');
            ghost.removeAttribute('title');
            ghost.removeAttribute('aria-label');
            ghost.removeAttribute('aria-pressed');
            ghost.setAttribute('aria-hidden', 'true');
            ghost.tabIndex = -1;
            state.ghost = ghost;
            positionGhost(moveEvent.clientX, moveEvent.clientY);
            document.body.appendChild(ghost);
          }
          moveEvent.preventDefault();
          positionGhost(moveEvent.clientX, moveEvent.clientY);
          autoScroll(moveEvent.clientY);
          moveEntryBefore(id, beforeIdAt(moveEvent.clientY, id));
        };
        const onUp = (upEvent) => {
          if (upEvent.pointerId !== pointerId) return;
          detach();
          dragRef.current = null;
          if (!state.active) return;
          upEvent.preventDefault();
          setDragId(null);
          writeRailConfig(configRef.current);
          // The click that follows a drag must not select the icon; clear the
          // guard after the browser has dispatched it.
          window.setTimeout(() => {
            suppressClickRef.current = false;
          }, 0);
        };
        state.detach = detach;
        dragRef.current = state;
        window.addEventListener('pointermove', onMove, { passive: false });
        window.addEventListener('pointerup', onUp, true);
        window.addEventListener('pointercancel', onUp, true);
      };

      const button = (id, label, glyph, extraClass, draggable = false) => {
        // The house is a navigation trigger (conversation / workspace drawer),
        // not a destination in the panel model. It therefore never carries the
        // persistent selected fill; hover and focus still show that it is live.
        const selected = id !== null && active === id;
        // `dragId` is null while idle, so the house (id null) must not match it.
        const dragging = id !== null && dragId === id;
        // The pill names the destination only; the owner suffix stays in the
        // aria-label and the right-click menu.
        const tipLabel = id === null ? copy.workspace : byId.get(id)?.label ?? id;
        return h(
          'button',
          {
            type: 'button',
            key: id ?? 'workspace',
            ref: draggable
              ? (node) => {
                  if (node === null) itemRefs.current.delete(id);
                  else itemRefs.current.set(id, node);
                }
              : undefined,
            className:
              'isl-railBtn' +
              (selected ? ' is-active' : '') +
              (dragging ? ' is-dragging' : '') +
              (extraClass ? ` ${extraClass}` : ''),
            'aria-label': label,
            'aria-pressed': id === null ? undefined : selected,
            'data-rail-id': id ?? 'workspace',
            'data-draggable': draggable ? '' : undefined,
            onClick: (event) => {
              if (suppressClickRef.current) {
                suppressClickRef.current = false;
                return;
              }
              if (id === null) addRipple(event);
              tip.hide();
              select(id);
            },
            onPointerEnter: (event) => {
              if (event.pointerType === 'touch' || dragRef.current !== null) return;
              tip.show(event.currentTarget, tipLabel);
            },
            onPointerLeave: tip.hide,
            onPointerCancel: tip.hide,
            // Keyboard focus gets the label at once; a mouse click focuses the
            // tile without `:focus-visible`, so it does not pop the pill back.
            onFocus: (event) => {
              if (event.currentTarget.matches(':focus-visible')) {
                tip.show(event.currentTarget, tipLabel, true);
              }
            },
            onBlur: tip.hide,
            onPointerDown: draggable ? (event) => beginDrag(event, id) : undefined,
          },
          glyph,
          id === null
            ? ripples.map((ripple) =>
                h('span', {
                  key: ripple.key,
                  className: 'isl-railRipple',
                  'aria-hidden': true,
                  style: {
                    left: `${ripple.x}px`,
                    top: `${ripple.y}px`,
                    width: `${ripple.size}px`,
                    height: `${ripple.size}px`,
                  },
                  onAnimationEnd: () => removeRipple(ripple.key),
                }),
              )
            : null,
        );
      };

      const menuNode = menu !== null
        ? ReactDOM.createPortal(
            h(
              'div',
              {
                ref: menuRef,
                className: 'isl-railMenu',
                role: 'menu',
                style: { left: menu.left, top: menu.top },
                onContextMenu: (event) => event.preventDefault(),
              },
              h('div', { className: 'isl-railMenuTitle' }, copy.railTitle),
              orderedEntries.length === 0
                ? h('div', { className: 'isl-railMenuEmpty' }, copy.noExtras)
                : orderedEntries.map((entry) => {
                    const shown = !config.hidden.includes(entry.id);
                    const owner = ownerFor(entry.registrant);
                    return h(
                      'button',
                      {
                        type: 'button',
                        key: entry.id,
                        className:
                          'isl-railMenuRow' +
                          (menu.contextId === entry.id ? ' is-current' : '') +
                          (shown ? '' : ' is-hidden'),
                        role: 'menuitemcheckbox',
                        'aria-checked': shown,
                        title: shown ? copy.railHide : copy.railShow,
                        onClick: () => toggleHidden(entry.id),
                      },
                      h('span', { className: 'isl-railMenuIcon' }, iconFor(entry.id, 16)),
                      h(
                        'span',
                        { className: 'isl-railMenuText' },
                        h('span', { className: 'isl-railMenuLabel' }, entry.label ?? entry.id),
                        owner === undefined
                          ? null
                          : h('span', { className: 'isl-railMenuSub' }, owner),
                      ),
                      h(
                        'span',
                        { className: 'isl-railMenuCheck' + (shown ? ' is-on' : ''), 'aria-hidden': true },
                        shown ? h(CheckGlyph) : null,
                      ),
                    );
                  }),
              h('div', { className: 'isl-railMenuHint' }, copy.railHint),
            ),
            document.body,
          )
        : null;

      return h(
        'nav',
        {
          ref: railRef,
          className: 'isl-rail' + (dragId === null ? '' : ' is-dragging'),
          'data-islands-rail': '',
          'aria-label': copy.workspace,
          // Safety net: a tile removed mid-hover never fires `pointerleave`.
          onPointerLeave: tip.hide,
          onContextMenu: (event) => {
            event.preventDefault();
            const target = event.target instanceof Element ? event.target.closest('[data-rail-id]') : null;
            const id = target?.getAttribute('data-rail-id') ?? null;
            const anchor = target?.getBoundingClientRect() ?? railRef.current?.getBoundingClientRect();
            // Shift+F10 and the context-menu key dispatch a contextmenu event
            // without a pointer position; anchor that menu on the focused row.
            const point = event.clientX === 0 && event.clientY === 0
              ? { x: (anchor?.right ?? 48) + 8, y: anchor?.top ?? 8 }
              : { x: event.clientX, y: event.clientY };
            openMenuAt(point.x, point.y, id === 'workspace' ? null : id);
          },
        },
        button(null, copy.workspace, h(HouseGlyph)),
        h('div', { className: 'isl-railDivider', 'aria-hidden': true }),
        visible.map((entry) => button(entry.id, labelFor(entry.id), iconFor(entry.id, 18), null, true)),
        visible.length === 0
          ? h(
              'button',
              {
                type: 'button',
                className: 'isl-railBtn isl-railAdd',
                'aria-label': copy.railTitle,
                'aria-haspopup': 'menu',
                'aria-expanded': menu !== null,
                onClick: (event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  openMenuAt(rect.right + 8, rect.top, null);
                },
                onPointerEnter: (event) => {
                  if (event.pointerType === 'touch') return;
                  tip.show(event.currentTarget, copy.railTitle);
                },
                onPointerLeave: tip.hide,
                onPointerCancel: tip.hide,
                onFocus: (event) => {
                  if (event.currentTarget.matches(':focus-visible')) {
                    tip.show(event.currentTarget, copy.railTitle, true);
                  }
                },
                onBlur: tip.hide,
              },
              h(PlusGlyph),
            )
          : null,
        menuNode,
        tip.node,
      );
    }

    function IslandsRailSettings() {
      const lang = useLocale() ?? 'en';
      const copy = String(lang).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
      const tip = useRailTip();
      const label = withShortcut(copy.settings, 'settings.open');
      // The host's modal restores focus to its own account trigger, not to the
      // rail gear that opened it. Hand focus back to the gear once the dialog
      // is gone; if the dialog never appears, do nothing.
      const openFromGear = (event) => {
        const gear = event.currentTarget;
        openSettings?.();
        let seen = false;
        let tries = 0;
        const tick = () => {
          if (!(gear instanceof HTMLElement) || !gear.isConnected) return;
          if (document.querySelector(HOST.SETTINGS_OVERLAY) !== null) {
            seen = true;
          } else if (seen) {
            gear.focus({ preventScroll: true });
            return;
          }
          if (tries++ >= 300) return;
          window.setTimeout(tick, 100);
        };
        window.setTimeout(tick, 100);
      };
      return h(
        'button',
        {
          type: 'button',
          className: 'isl-railBtn isl-railSettings',
          'aria-label': label,
          onClick: openFromGear,
          onPointerEnter: (event) => {
            if (event.pointerType === 'touch') return;
            tip.show(event.currentTarget, label);
          },
          onPointerLeave: tip.hide,
          onPointerCancel: tip.hide,
          onFocus: (event) => {
            if (event.currentTarget.matches(':focus-visible')) {
              tip.show(event.currentTarget, label, true);
            }
          },
          onBlur: tip.hide,
        },
        h(GearGlyph),
        tip.node,
      );
    }

    /**
     * The desktop preload exposes update state only to the product page. Keep
     * the lookup optional so the same bundle stays inert in a plain browser.
     */
    function desktopUpdateBridge() {
      try {
        const bridge = globalThis.dshDesktop;
        return bridge?.protocolVersion === 1 ? bridge.updates : undefined;
      } catch {
        return undefined;
      }
    }

    function formatCopy(template, values) {
      return String(template).replace(/\{(\w+)\}/g, (match, key) =>
        values[key] === undefined ? match : String(values[key]),
      );
    }

    const UPDATE_FAILURE_KEYS = {
      check: 'updateFailedCheck',
      'check-network': 'updateFailedCheckNetwork',
      download: 'updateFailedDownload',
      'download-network': 'updateFailedDownloadNetwork',
      install: 'updateFailedInstall',
      'install-network': 'updateFailedInstallNetwork',
      'stop-failed': 'updateFailedStop',
      'tasks-changed': 'updateFailedTasksChanged',
      'tasks-unavailable': 'updateFailedTasksUnavailable',
      'fullscreen-timeout': 'updateFailedFullscreen',
    };

    function updateFailureCopy(state, copy) {
      const key = UPDATE_FAILURE_KEYS[state?.failure] ?? 'updateFailedGeneric';
      return copy[key] ?? copy.updateFailedGeneric;
    }

    const UPDATE_CONFIGURATION_KEYS = {
      read: 'updateConfigRead',
      format: 'updateConfigFormat',
      channel: 'updateConfigChannel',
      cleanup: 'updateConfigCleanup',
    };

    /** DSH 0.2.2-rc.2 added channel configuration failures to the presentation. */
    function updateConfigurationCopy(state, copy) {
      const key = UPDATE_CONFIGURATION_KEYS[state?.configurationError] ?? 'updateConfigGeneric';
      return {
        label: copy.updateConfigUnavailable,
        detail: copy[key] ?? copy.updateConfigGeneric,
      };
    }

    function updatePresentationCopy(state, failed, copy) {
      if (failed) return { label: copy.updateRetry, detail: copy.updateRetry };
      if (typeof state?.configurationError === 'string') return updateConfigurationCopy(state, copy);
      const version = typeof state?.version === 'string' ? state.version : undefined;
      switch (state?.phase) {
        case 'available': {
          const label = version === undefined
            ? copy.updateAvailablePlain
            : formatCopy(copy.updateAvailable, { version });
          return { label, detail: label };
        }
        case 'downloading': {
          const percent = updatePercent(state);
          const label = percent === null
            ? copy.updateDownloadingPlain
            : formatCopy(copy.updateDownloading, { percent });
          return {
            label,
            detail: percent === null || version === undefined
              ? label
              : formatCopy(copy.updateDownloadingDetail, { percent, version }),
          };
        }
        case 'verifying':
          return { label: copy.updateVerifying, detail: copy.updateVerifying };
        case 'installing':
          return { label: copy.updateInstalling, detail: copy.updateInstalling };
        case 'ready':
          return {
            label: copy.updateReady,
            detail: version === undefined
              ? copy.updateReady
              : formatCopy(copy.updateReadyDetail, { version }),
          };
        case 'error':
          return { label: copy.updateRetry, detail: updateFailureCopy(state, copy) };
        default:
          return { label: '', detail: '' };
      }
    }

    /** One subscription shared by the rail button; null until the bridge answers. */
    function useDesktopUpdate() {
      const updates = React.useMemo(() => desktopUpdateBridge(), []);
      const [view, setView] = React.useState({ state: undefined, failed: false });

      React.useEffect(() => {
        if (updates === undefined) return undefined;
        let live = true;
        let received = false;
        const apply = (state) => {
          if (!live) return;
          received = true;
          setView({ state, failed: false });
        };
        let unsubscribe;
        try {
          unsubscribe = updates.subscribe?.(apply);
        } catch {
          /* a bridge without a subscriber still gets the status probe */
        }
        Promise.resolve()
          .then(() => updates.status())
          .then(
            (state) => {
              if (live && !received) apply(state);
            },
            () => {
              if (live && !received) setView({ state: undefined, failed: true });
            },
          );
        return () => {
          live = false;
          try {
            unsubscribe?.();
          } catch {
            /* already detached by the shell */
          }
        };
      }, [updates]);

      return { updates, ...view };
    }

    /**
     * Desktop update entry above the settings gear. Available and ready are
     * actionable; busy phases are a 3x3 dot-matrix animation; failures keep
     * the same footprint with a danger tint and a retry glyph.
     */
    function IslandsUpdateButton() {
      const { updates, state, failed } = useDesktopUpdate();
      const [pending, setPending] = React.useState(false);
      const enabled = useEnabled();
      const lang = useLocale() ?? 'en';
      const copy = String(lang).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
      const configurationError = typeof state?.configurationError === 'string';
      const phase = failed || configurationError ? 'error' : state?.phase;
      if (!enabled || updates === undefined || phase === undefined || phase === 'idle') return null;
      if (!['available', 'downloading', 'verifying', 'installing', 'ready', 'error'].includes(phase)) return null;

      const clickable = phase === 'available' || phase === 'ready' || phase === 'error';
      const ringed = phase === 'downloading' || phase === 'verifying' || phase === 'installing';
      const busy = pending || ringed;
      const percent = updatePercent(state);
      const { label, detail } = updatePresentationCopy(state, failed, copy);
      const open = () => {
        if (!clickable || pending) return;
        setPending(true);
        Promise.resolve()
          .then(() => updates.open())
          .catch(() => {})
          .finally(() => setPending(false));
      };

      return h(
        'button',
        {
          type: 'button',
          className: `isl-updateButton is-${phase}${clickable ? ' is-clickable' : ''}${pending ? ' is-pending' : ''}`,
          // Not `data-phase`: that is a host contract, and the conversation
          // sheet's `[data-phase] { background: transparent }` rule has the same
          // specificity as this button's own surface — it landed later in the
          // sheet and erased the entry's fill.
          'data-update-phase': phase,
          'data-clickable': clickable ? 'true' : 'false',
          title: detail,
          'aria-label': label,
          'aria-disabled': clickable ? undefined : 'true',
          'aria-busy': busy ? 'true' : undefined,
          onClick: open,
        },
        ringed ? h(UpdateRing, { phase, percent }) : null,
        h(UpdateGlyph, { phase, size: ringed ? 14 : 16 }),
        phase === 'error' ? h('span', { className: 'isl-updateErrorDot', 'aria-hidden': true }) : null,
      );
    }

    const EMPTY_MENU_STATE = Object.freeze({ current: null, groups: [], status: 'idle', retainedEffort: undefined, error: null });

    function modelIn(groups, selection) {
      for (const group of groups) {
        if (group.id !== selection.provider) continue;
        const model = group.models.find((entry) => entry.id === selection.model);
        if (model !== undefined) return model;
      }
      return undefined;
    }

    /**
     * Composer model + reasoning picker. Replaces the shipped two-level menu:
     * the trigger is a chip, the menu opens straight onto the model list, and
     * reasoning effort lives on a stepped slider.
     */
    function ModelPicker({ sessionId, locked }) {
      const active = useLocale() ?? 'en';
      const copy = String(active).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
      const directory = React.useMemo(() => {
        try {
          return modelDirectories !== undefined && sessionId !== undefined
            ? modelDirectories.directoryFor(sessionId)
            : null;
        } catch {
          return null;
        }
      }, [sessionId]);
      const subscribe = React.useCallback(
        (listener) => (directory === null ? () => {} : directory.store.subscribe(listener)),
        [directory],
      );
      const getSnapshot = React.useCallback(
        () => (directory === null ? EMPTY_MENU_STATE : directory.store.getSnapshot()),
        [directory],
      );
      const state = React.useSyncExternalStore(subscribe, getSnapshot);
      const [open, setOpen] = React.useState(false);
      const [position, setPosition] = React.useState(null);
      const [pane, setPane] = React.useState('effort');
      const [draft, setDraft] = React.useState(null);
      const [busy, setBusy] = React.useState(false);
      const [error, setError] = React.useState('');
      const rootRef = React.useRef(null);
      const triggerRef = React.useRef(null);
      const panelRef = React.useRef(null);

      React.useEffect(() => {
        if (directory !== null) directory.load().catch(() => {});
      }, [directory]);

      const current = state.current ?? null;
      const groups = Array.isArray(state.groups) ? state.groups : [];
      const reasoning = current !== null && directory !== null ? directory.catalog.reasoningFor(current) : undefined;
      const efforts = Array.isArray(reasoning?.efforts) ? reasoning.efforts : [];
      const effective = current?.reasoningEffort ?? reasoning?.defaultEffort;
      const effortName = efforts.find((level) => level.id === effective)?.name ?? state.retainedEffort;
      const modelName = current === null
        ? state.status === 'loading' ? copy.loading : copy.pick
        : modelIn(groups, current)?.name ?? current.model;

      const close = () => {
        setOpen(false);
        setError('');
        setDraft(null);
      };

      const openMenu = () => {
        if (locked || directory === null) return;
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect === undefined) return;
        setPosition({
          bottom: Math.max(8, window.innerHeight - rect.top + 8),
          right: Math.max(8, window.innerWidth - rect.right),
          width: Math.min(300, window.innerWidth - 24),
        });
        setPane('effort');
        setDraft(null);
        setError('');
        setOpen(true);
        directory.load().catch(() => {});
      };

      React.useEffect(() => {
        const onOpen = () => openMenu();
        window.addEventListener('islands:model-open', onOpen);
        return () => window.removeEventListener('islands:model-open', onOpen);
      }, [openMenu]);

      React.useEffect(() => {
        if (!open) return;
        const onDown = (event) => {
          if (rootRef.current?.contains(event.target) === true) return;
          if (panelRef.current?.contains(event.target) === true) return;
          close();
        };
        const onKey = (event) => {
          if (event.key !== 'Escape') return;
          event.stopPropagation();
          close();
        };
        document.addEventListener('mousedown', onDown, true);
        document.addEventListener('keydown', onKey, true);
        return () => {
          document.removeEventListener('mousedown', onDown, true);
          document.removeEventListener('keydown', onKey, true);
        };
      }, [open]);

      const choose = (selection, stayOpen = false) => {
        if (directory === null || busy) return;
        setBusy(true);
        setError('');
        directory
          .select(selection)
          .then((result) => {
            setBusy(false);
            if (result.ok) {
              if (stayOpen) {
                setPane('effort');
                setDraft(null);
              } else {
                close();
              }
            } else {
              setError(result.error?.message ?? copy.failed);
            }
          })
          .catch((problem) => {
            setBusy(false);
            setError(String(problem?.message ?? problem));
          });
      };

      const chooseEffort = (effortId) => {
        if (directory === null || current === null || busy) return;
        setDraft(effortId);
        setBusy(true);
        setError('');
        directory
          .select({ provider: current.provider, model: current.model, reasoningEffort: effortId })
          .then((result) => {
            setBusy(false);
            if (!result.ok) setError(result.error?.message ?? copy.failed);
          })
          .catch((problem) => {
            setBusy(false);
            setError(String(problem?.message ?? problem));
          });
      };

      const sliderId = draft ?? effective;
      const sliderIndex = Math.max(0, efforts.findIndex((level) => level.id === sliderId));
      const percent = efforts.length > 1 ? Math.round((sliderIndex / (efforts.length - 1)) * 100) : 0;

      const trigger = h(
        'button',
        {
          ref: triggerRef,
          type: 'button',
          className: 'isl-modelTrigger',
          'aria-haspopup': 'menu',
          'aria-expanded': open,
          'aria-label': modelName,
          title: withShortcut(
            effortName === undefined ? modelName : `${modelName} · ${effortName}`,
            'islands.model.open',
            /Mac/i.test(navigator.platform ?? '') ? '⌘⇧M' : 'Ctrl+Shift+M',
          ),
          disabled: locked || directory === null,
          onClick: () => (open ? close() : openMenu()),
        },
        h('span', { className: 'isl-modelIcon' }, h(ModelGlyph)),
        h('span', { className: 'isl-modelName' }, modelName),
        effortName === undefined ? null : h('span', { className: 'isl-modelEffort' }, effortName),
        h('span', { className: 'isl-modelChevron' + (open ? ' is-open' : '') }, h(ChevronGlyph)),
      );

      const modelPane = h(
        React.Fragment,
        null,
        h(
          'div',
          { className: 'isl-modelPaneHead' },
          h(
            'button',
            {
              type: 'button',
              className: 'isl-modelBack',
              title: copy.back,
              'aria-label': copy.back,
              onClick: () => setPane('effort'),
            },
            h('span', { className: 'isl-modelBackIcon' }, h(ChevronGlyph)),
          ),
          h('span', { className: 'isl-modelMenuTitle' }, copy.models),
        ),
        h(
          'div',
          { className: 'isl-modelGroups' },
          groups.length === 0
            ? h('div', { className: 'isl-modelEmpty' }, state.status === 'loading' ? copy.loading : copy.empty)
            : groups.map((group) =>
                h(
                  'div',
                  { className: 'isl-modelGroup', key: group.id },
                  h('div', { className: 'isl-modelGroupName' }, group.name),
                  group.models.map((model) => {
                    const selected = current !== null && current.provider === group.id && current.model === model.id;
                    return h(
                      'button',
                      {
                        type: 'button',
                        role: 'menuitemradio',
                        'aria-checked': selected,
                        className: 'isl-modelOption' + (selected ? ' is-selected' : ''),
                        key: model.id,
                        onClick: () => choose({ provider: group.id, model: model.id }, true),
                      },
                      h('span', { className: 'isl-modelOptionName' }, model.name),
                      selected ? h('span', { className: 'isl-modelCheck' }, h(CheckGlyph)) : null,
                    );
                  }),
                ),
              ),
        ),
      );

      const ratio = efforts.length > 1 ? sliderIndex / (efforts.length - 1) : 0;

      const effortPane = h(
        React.Fragment,
        null,
        h(
          'div',
          { className: 'isl-effortPopup' },
          h(
            'button',
            {
              type: 'button',
              className: 'isl-effortReset',
              title: copy.reset,
              'aria-label': copy.reset,
              disabled: reasoning?.defaultEffort === undefined,
              onClick: () => chooseEffort(reasoning?.defaultEffort),
            },
            h(ResetGlyph),
          ),
          h('div', { className: 'isl-effortName' }, effortName ?? ''),
          h(
            'button',
            { type: 'button', className: 'isl-effortModel', onClick: () => setPane('model'), title: copy.models },
            h('span', { className: 'isl-effortModelName' }, modelName),
            h('span', { className: 'isl-effortModelChevron' }, h(ChevronGlyph)),
          ),
          efforts.length > 1
            ? h(
                'div',
                { className: 'isl-effortSliderWrap' },
                h('input', {
                  type: 'range',
                  className: 'isl-effortSlider',
                  min: 0,
                  max: Math.max(0, efforts.length - 1),
                  step: 1,
                  value: sliderIndex,
                  'aria-label': copy.effort,
                  style: { '--isl-ratio': String(ratio) },
                  onChange: (event) => setDraft(efforts[Number(event.target.value)]?.id),
                  onPointerUp: () => {
                    if (draft !== null && draft !== effective) chooseEffort(draft);
                  },
                  onKeyUp: () => {
                    if (draft !== null && draft !== effective) chooseEffort(draft);
                  },
                }),
                h(
                  'div',
                  { className: 'isl-effortDots', 'aria-hidden': true },
                  efforts.map((level, index) =>
                    h('span', {
                      key: level.id,
                      className: 'isl-effortDot' + (index <= sliderIndex ? ' is-filled' : ''),
                    }),
                  ),
                ),
              )
            : h('div', { className: 'isl-modelEmpty' }, copy.noEffort),
        ),
      );

      const panel = open && position !== null
        ? ReactDOM.createPortal(
            h(
              'div',
              {
                ref: panelRef,
                className: 'isl-modelMenu',
                role: 'menu',
                style: { right: position.right, bottom: position.bottom, width: position.width },
              },
              pane === 'model' ? modelPane : effortPane,
              error === '' ? null : h('div', { className: 'isl-modelError' }, error),
            ),
            document.body,
          )
        : null;

      return h('div', { className: 'isl-model', ref: rootRef }, trigger, panel);
    }

    /** Live open/closed state of the native right sidebar, read from its attribute. */
    function useRightPanelOpen() {
      const [open, setOpen] = React.useState(false);
      React.useEffect(() => {
        const read = () => setOpen(document.querySelector(HOST.RIGHT_PANEL_OPEN) !== null);
        read();
        const observer = new MutationObserver(read);
        // The pane can mount already open (restored layout), in which case no
        // attribute mutation for its open state is ever observed. Watch for
        // insertion too, not only later attribute flips.
        observer.observe(document.getElementById('root') ?? document.body, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ['data-sidebar-right-open'],
        });
        return () => observer.disconnect();
      }, []);
      return open;
    }

    function rightPanelOpenNow() {
      return document.querySelector(HOST.RIGHT_PANEL_OPEN) !== null;
    }

    /**
     * The shipped control is a button that the skin hides and DSH can disable
     * (it is `disabled` whenever the layout already counts the pane as open),
     * so clicking it is not a dependable contract. Ask the layout service
     * first and only fall back to the control when the service ignored us.
     */
    function toggleRightPanel() {
      const wantOpen = !rightPanelOpenNow();
      try {
        if (wantOpen) layoutService?.openRightbar?.(true, false);
        else layoutService?.closeRightbar?.();
      } catch {
        /* fall through to the shipped control */
      }
      window.setTimeout(() => {
        if (rightPanelOpenNow() === wantOpen) {
          // The pane can be mounted with its width preference already set;
          // republish so a collapsed workspace gets the right grid track.
          if (wantOpen) publishRightbarWidth?.();
          return;
        }
        const selector = wantOpen ? '[data-sidebar-right-expand]' : '[data-sidebar-right-toggle]';
        const target = document.querySelector(selector);
        if (target instanceof HTMLElement) target.click();
      }, 120);
    }

    /**
     * Always-visible right sidebar toggle; drives the native open/collapse actions.
     *
     * Rendered into `document.body`, not into the top bar: the frame's overlay
     * layer is z-index 20, while the workbench panel host (dsh-better-sidebar)
     * is a full-viewport fixed layer at z-index 25 and re-enables pointer
     * events on its dock strip — the same top-right band the native expand
     * button used to occupy. Anything painted inside the frame therefore sits
     * UNDER that strip: the toggle still renders (the strip is transparent
     * there) but never sees hover or clicks. A body-level portal escapes both
     * stacking contexts; the stylesheet keeps it above the workbench
     * (25/40/60/90) and below the app's menus and dialogs (1000+).
     */
    function RightPanelToggle() {
      const open = useRightPanelOpen();
      const active = useLocale() ?? 'en';
      const copy = String(active).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
      const label = open ? copy.closeRight : copy.openRight;
      return ReactDOM.createPortal(
        h(
          'button',
          {
            type: 'button',
            className: 'isl-rightToggle',
            'aria-label': withShortcut(label, 'sidebar.right.toggle'),
            title: withShortcut(label, 'sidebar.right.toggle'),
            'aria-pressed': open,
            onClick: toggleRightPanel,
          },
          h(RightPanelGlyph),
        ),
        document.body,
      );
    }

    /** Animation length shared with the host's own sidebar transition. */
    const WORKSPACE_ANIMATION_MS = 360;

    /** The focus target used when the hidden workspace owned the focus. */
    function workspaceFocusTarget() {
      const toggle = document.querySelector('[data-islands-topbar-toggle]');
      if (toggle instanceof HTMLElement && toggle.getClientRects().length > 0) return toggle;
      const home = document.querySelector('[data-rail-id="workspace"]');
      return home instanceof HTMLElement ? home : null;
    }

    /**
     * Publish the skin's collapse state. This is the single write point: the
     * host's `data-sidebar-collapsed` is only a transient mirror (the
     * conversion restores it), and the top bar listens to this event so the
     * toggle carries `aria-expanded` and an accurate label.
     */
    function setWorkspaceCollapsed(collapsed) {
      const next = collapsed === true;
      const root = document.querySelector(partSelector('sidebar-root'));
      const seat = document.querySelector('[data-islands-part~="settings-area"]');
      const active = document.activeElement;
      const wasCollapsed = document.body.hasAttribute(WORKSPACE_ATTR);
      if (next) document.body.setAttribute(WORKSPACE_ATTR, '');
      else document.body.removeAttribute(WORKSPACE_ATTR);
      window.dispatchEvent(new CustomEvent('islands:workspace-collapsed', { detail: next }));
      if (!next || wasCollapsed) return;
      // Hiding the workspace removes the focused row from the layout; the host
      // only restores focus for its own collapse, so the skin does it here.
      if (!(active instanceof HTMLElement)) return;
      if (!(root instanceof HTMLElement) || !root.contains(active)) return;
      if (active.closest('[data-islands-rail], [data-islands-topbar]') !== null) return;
      if (seat instanceof HTMLElement && seat.contains(active)) return;
      window.requestAnimationFrame(() => workspaceFocusTarget()?.focus({ preventScroll: true }));
    }

    /**
     * Collapse the workspace island without asking DSH to swap the sidebar for
     * its rail-only render tree. The expanded rail stays mounted, the workspace
     * column is hidden, and the frame track shrinks to the rail width.
     */
    function toggleWorkspace() {
      const frame = document.querySelector(FRAME);
      if (frame !== null && frame.hasAttribute('data-sidebar-drawer')) {
        // Narrow layout: the workspace is a drawer, owned by DSH's native
        // narrow expansion state. The rail's home button and the shortcut both
        // open/close it here.
        layoutService?.toggleSidebar();
        return;
      }
      if (frame !== null && frame.hasAttribute('data-sidebar-collapsed')) {
        // A host collapse is in flight (the conversion will mirror it into the
        // skin state); expand the host and show the workspace.
        layoutService?.toggleSidebar();
        setWorkspaceCollapsed(false);
        return;
      }
      setWorkspaceCollapsed(!document.body.hasAttribute(WORKSPACE_ATTR));
      if (frame !== null) {
        frame.setAttribute('data-islands-animating', '');
        window.clearTimeout(animateTimer);
        animateTimer = window.setTimeout(() => {
          frame.removeAttribute('data-islands-animating');
        }, WORKSPACE_ANIMATION_MS);
      }
    }

    /** Window chrome strip above the islands; owns the workspace toggle. */
    function IslandsTopBar() {
      const active = useLocale() ?? 'en';
      const copy = String(active).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
      const [collapsed, setCollapsed] = React.useState(
        () => document.body.hasAttribute(WORKSPACE_ATTR),
      );
      React.useEffect(() => {
        const onState = (event) => setCollapsed(Boolean(event.detail));
        window.addEventListener('islands:workspace-collapsed', onState);
        return () => window.removeEventListener('islands:workspace-collapsed', onState);
      }, []);
      const label = collapsed ? copy.topbarExpand : copy.topbarCollapse;
      return h(
        'header',
        { className: 'isl-topbar', 'data-islands-topbar': '' },
        h('div', { className: 'isl-topbarLead', 'aria-hidden': true }),
        h(
          'button',
          {
            type: 'button',
            className: 'isl-topbarToggle',
            'data-islands-topbar-toggle': '',
            'aria-label': withShortcut(label, 'sidebar.left.toggle'),
            'aria-expanded': !collapsed,
            title: withShortcut(label, 'sidebar.left.toggle'),
            onClick: () => toggleWorkspace(),
          },
          h(PanelGlyph),
        ),
        h('div', { className: 'isl-topbarDrag', 'aria-hidden': true }),
        h(RightPanelToggle),
      );
    }

    function IslandsLogo({ size = 30 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 64 64', fill: 'none', 'aria-hidden': true },
        h('rect', { width: 64, height: 64, rx: 16, fill: '#0f1115' }),
        h('rect', { x: 10, y: 10, width: 44, height: 44, rx: 11, fill: '#22252b' }),
        h('rect', { x: 16, y: 16, width: 14, height: 32, rx: 6, fill: '#4176e6' }),
        h('rect', { x: 34, y: 16, width: 14, height: 14, rx: 6, fill: '#f5f7fa' }),
        h('rect', { x: 34, y: 34, width: 14, height: 14, rx: 6, fill: '#7aaaff' }),
      );
    }

    /** One pinned row: hover reveals unpin + locate, and a clipped title marquees. */
    function PinnedRow({ session, workspaceId, copy, pinIcon }) {
      const titleRef = React.useRef(null);
      const frameRef = React.useRef(0);
      const revealingRef = React.useRef(false);
      const id = session.id ?? session.sessionId;
      const title = String(session.title ?? '').trim() || copy.untitled;

      React.useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

      const place = (left, range) => {
        const element = titleRef.current;
        if (element === null) return;
        if (typeof element.scrollTo === 'function') element.scrollTo({ left, behavior: 'instant' });
        else element.scrollLeft = left;
        if (left > 0) element.dataset.scrolled = '';
        else delete element.dataset.scrolled;
        if (left < range) element.dataset.clipped = '';
        else delete element.dataset.clipped;
      };

      const enter = (event) => {
        if (event?.pointerType === 'touch') return;
        if (titleRef.current === null || revealingRef.current) return;
        revealingRef.current = true;
        cancelAnimationFrame(frameRef.current);
        // Measure after hover has laid out the two action buttons; otherwise
        // the title still has its resting width and the marquee never starts.
        frameRef.current = requestAnimationFrame(() => {
          const element = titleRef.current;
          if (element === null) return;
          const range = element.scrollWidth - element.clientWidth;
          if (range <= 8) return;
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            place(range, range);
            return;
          }
          let previous;
          let position = 0;
          const step = (now) => {
            position += previous === undefined ? 0 : (now - previous) * 0.03;
            previous = now;
            place(Math.min(position, range), range);
            if (position < range) frameRef.current = requestAnimationFrame(step);
          };
          frameRef.current = requestAnimationFrame(step);
        });
      };

      const leave = () => {
        revealingRef.current = false;
        cancelAnimationFrame(frameRef.current);
        place(0, 0);
      };

      return h(
        'div',
        {
          className: 'isl-pinnedRow',
          role: 'button',
          tabIndex: 0,
          title,
          onClick: () => uiWorkspaceService?.openSession(id),
          onKeyDown: (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            uiWorkspaceService?.openSession(id);
          },
          onPointerEnter: enter,
          onPointerLeave: leave,
        },
        h('span', { className: 'isl-pinnedName', ref: titleRef }, title),
        h(
          'button',
          {
            type: 'button',
            className: 'isl-pinnedPinBtn',
            title: copy.unpin,
            'aria-label': copy.unpin,
            onClick: (event) => {
              event.stopPropagation();
              workspacesService?.unpinSession?.(id).catch?.(() => {});
            },
          },
          pinIcon,
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'isl-pinnedLocate',
            title: copy.locate,
            'aria-label': copy.locate,
            onClick: (event) => {
              event.stopPropagation();
              // Locating also makes the session current. Open first so the
              // switch still happens when the list cannot show the row.
              uiWorkspaceService?.openSession(id);
              revealPinnedSession(id, workspaceId);
            },
          },
          h(LocateGlyph),
        ),
      );
    }

    /**
     * Aggregate pinned sessions above the workspace groups. The block lives
     * in a host div inserted before the DSH workspace list, so it participates
     * in the sidebar flow while rendering as React through a portal.
     */
    function IslandsPinnedSection({ useWorkspaces, useSessions }) {
      const pinnedIds = useWorkspaces((state) => state.pinnedSessionIds ?? []);
      const sessions = useSessions((state) => state.byId ?? {});
      const workspaceItems = useWorkspaces((state) => state.items ?? []);
      const [host, setHost] = React.useState(null);
      const [collapsed, setCollapsed] = React.useState(() => {
        try {
          return window.localStorage.getItem('dsh-islands-ui:pinned-collapsed') === '1';
        } catch {
          return false;
        }
      });
      const lang = useLocale() ?? 'en';
      const copy = String(lang).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;

      React.useEffect(() => {
        let current = null;
        const attach = () => {
          const header = document.querySelector(partSelector('section-header'));
          const tree = document.querySelector(partSelector('tree-body')) ?? document.querySelector(partSelector('list'));
          const target = header?.parentElement ?? tree?.parentElement;
          if (target === null || target === undefined) return;
          let anchor = target.querySelector(':scope > .isl-pinnedHost');
          if (anchor === null || !anchor.isConnected) {
            anchor = document.createElement('div');
            anchor.className = 'isl-pinnedHost';
          }
          // Sit between the New Session row and the Workspace section header.
          if (header !== null && header !== undefined) {
            if (anchor.nextElementSibling !== header) target.insertBefore(anchor, header);
          } else if (tree !== null && tree !== undefined) {
            if (anchor.nextElementSibling !== tree) target.insertBefore(anchor, tree);
          } else {
            target.appendChild(anchor);
          }
          if (current !== anchor) {
            current = anchor;
            setHost(anchor);
          }
        };
        attach();
        const timer = window.setInterval(attach, 800);
        return () => {
          window.clearInterval(timer);
          current?.remove();
        };
      }, []);

      const rows = pinnedIds.map((id) => sessions[id]).filter((session) => session !== undefined);
      const pinIcon = defaultPinIcon();
      if (host === null || rows.length === 0) return null;

      const toggle = () => {
        const next = !collapsed;
        setCollapsed(next);
        try {
          window.localStorage.setItem('dsh-islands-ui:pinned-collapsed', next ? '1' : '0');
        } catch {
          /* ignore */
        }
      };

      return ReactDOM.createPortal(
        h(
          'div',
          { className: 'isl-pinned', 'data-open': collapsed ? undefined : '' },
          h(
            'button',
            {
              type: 'button',
              className: 'isl-pinnedHead',
              'aria-expanded': !collapsed,
              title: copy.pinned,
              onClick: toggle,
            },
            h('span', { className: 'isl-pinnedChevron' }, h(ChevronGlyph)),
            h('span', { className: 'isl-pinnedTitle' }, copy.pinned),
            h('span', { className: 'isl-pinnedCount' }, String(rows.length)),
          ),
          collapsed
            ? null
            : h(
                'div',
                { className: 'isl-pinnedList' },
                rows.map((session) => {
                  const id = session.id ?? session.sessionId;
                  const owner = workspaceItems.find(
                    (item) => Array.isArray(item?.sessionIds) && item.sessionIds.includes(id),
                  );
                  return h(PinnedRow, {
                    key: id,
                    session,
                    workspaceId: owner?.workspaceId,
                    copy,
                    pinIcon,
                  });
                }),
              ),
        ),
        host,
      );
    }

    function WarningGlyph() {
      return h(
        'svg',
        { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M8 2.4 14.2 13H1.8L8 2.4Z', stroke: 'currentColor', strokeWidth: 1.4, strokeLinejoin: 'round' }),
        h('path', { d: 'M8 6.4v3', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }),
        h('circle', { cx: 8, cy: 11.3, r: 0.9, fill: 'currentColor' }),
      );
    }

    /** Amber bar at the top of the Islands page explaining the auto-disable. */
    function CompatibilityBanner({ copy, compat, onForce }) {
      if (compat.status !== 'missing') return null;
      return h(
        'div',
        { className: 'isl-compatBanner', role: 'alert' },
        h('span', { className: 'isl-compatBannerIcon' }, h(WarningGlyph)),
        h(
          'div',
          { className: 'isl-compatBannerText' },
          h('div', { className: 'isl-compatBannerTitle' }, copy.compatBannerTitle),
          h('div', { className: 'isl-compatBannerBody' }, copy.compatBannerBody),
          h(
            'div',
            { className: 'isl-compatBannerList' },
            h('span', null, `${copy.compatMissing}:`),
            compat.missing.map((selector) => h('code', { key: selector, className: 'isl-compatAnchor' }, selector)),
          ),
          h('div', { className: 'isl-compatBannerHint' }, copy.compatFix),
        ),
        h('button', { type: 'button', className: 'isl-compatBannerAction', onClick: onForce }, copy.compatForce),
      );
    }

    function activate() {
      if (activated || skinRegistrar === null) return;
      activated = true;
      syncAttribute();
      applyAccent(readAccent());
      try {
        skinRegistrar();
      } catch (error) {
        console.warn('[islands-ui] failed to mount the skin', error);
        document.body?.removeAttribute(ATTRIBUTE);
      }
    }

    function forceEnable() {
      try {
        window.sessionStorage.setItem(FORCE_KEY, '1');
      } catch {
        /* private mode: the choice still applies for this page. */
      }
      shellStructure = detectStructure();
      setCompat({ status: 'ok', missing: [], forced: true, version: shellVersion, structure: shellStructure });
      activate();
    }

    /**
     * Plain-DOM toast: it must work while the shell is in an unknown state, so
     * it is appended to `body`, styled by the always-injected stylesheet and
     * removed without React.
     */
    function showCompatibilityToast() {
      if (document.body === null) return;
      const copy = currentCopy();
      const host = document.createElement('div');
      host.className = 'isl-compatToast';
      host.setAttribute('role', 'status');
      host.setAttribute('aria-live', 'polite');
      host.tabIndex = 0;
      host.title = copy.compatView;

      const body = document.createElement('div');
      body.className = 'isl-compatToastBody';
      const title = document.createElement('div');
      title.className = 'isl-compatToastTitle';
      title.textContent = copy.compatTitle;
      const text = document.createElement('div');
      text.className = 'isl-compatToastText';
      text.textContent = copy.compatBody;
      const action = document.createElement('div');
      action.className = 'isl-compatToastAction';
      action.textContent = copy.compatView;
      body.append(title, text, action);

      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'isl-compatToastClose';
      close.setAttribute('aria-label', copy.compatDismiss);
      close.textContent = '\u00d7';

      let timer = null;
      let closed = false;
      const dismiss = () => {
        if (closed) return;
        closed = true;
        if (timer !== null) window.clearTimeout(timer);
        document.removeEventListener('visibilitychange', onVisibility);
        if (compatToastDismiss === dismiss) compatToastDismiss = null;
        host.classList.remove('is-visible');
        window.setTimeout(() => host.remove(), 200);
      };
      // The five-second life runs on visible time: a hidden window throttles
      // timers, and the notice used to expire before anyone could see it.
      const armDismiss = () => {
        if (closed) return;
        if (timer !== null) window.clearTimeout(timer);
        timer = window.setTimeout(dismiss, 5000);
      };
      function onVisibility() {
        if (document.visibilityState === 'visible') armDismiss();
      }
      compatToastDismiss = dismiss;

      const openSection = () => {
        dismiss();
        openSettings({ section: 'Islands UI' });
      };

      document.addEventListener('visibilitychange', onVisibility);
      if (document.visibilityState === 'visible') armDismiss();
      close.addEventListener('click', (event) => {
        event.stopPropagation();
        dismiss();
      });
      host.addEventListener('click', openSection);
      host.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openSection();
      });

      host.append(body, close);
      document.body.append(host);
      // Force the first layout so the entrance transition runs without waiting
      // for an animation frame: a hidden window never delivers one, and the
      // toast used to be created, never shown, then removed five seconds later.
      void host.offsetWidth;
      host.classList.add('is-visible');
    }

    /**
     * The yield prompt: three failed attempts mean the other side is not going
     * to give way on its own, so the user picks a side. Plain DOM like the
     * compatibility toast — the skin is off while this shows, so none of its
     * React chrome is mounted.
     */
    function showYieldToast() {
      if (document.body === null || yieldToastDismiss !== null) return;
      const copy = currentCopy();
      const host = document.createElement('div');
      host.className = 'isl-yieldToast';
      host.setAttribute('role', 'alertdialog');
      host.setAttribute('aria-live', 'assertive');

      const body = document.createElement('div');
      body.className = 'isl-yieldToastBody';
      const title = document.createElement('div');
      title.className = 'isl-yieldToastTitle';
      title.textContent = copy.yieldToastTitle;
      const text = document.createElement('div');
      text.className = 'isl-yieldToastText';
      text.textContent = copy.yieldToastBody;

      const actions = document.createElement('div');
      actions.className = 'isl-yieldToastActions';
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'isl-yieldToastPrimary';
      retry.textContent = copy.yieldRetry;
      const disable = document.createElement('button');
      disable.type = 'button';
      disable.className = 'isl-yieldToastAction';
      disable.textContent = copy.yieldDisable;

      // Session-only: the flag lives in memory, so closing or reloading DSH
      // brings the prompt back. Ticking it takes effect immediately.
      const mute = document.createElement('label');
      mute.className = 'isl-yieldToastMute';
      const muteBox = document.createElement('input');
      muteBox.type = 'checkbox';
      muteBox.checked = yieldPromptMuted;
      muteBox.addEventListener('change', () => { yieldPromptMuted = muteBox.checked; });
      const muteText = document.createElement('span');
      muteText.textContent = copy.yieldMute;
      mute.append(muteBox, muteText);

      actions.append(retry, disable, mute);

      body.append(title, text, actions);

      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'isl-compatToastClose';
      close.setAttribute('aria-label', copy.yieldDismiss);
      close.textContent = '\u00d7';

      // Auto-close after eight seconds, drawn as a bar draining along the top
      // edge of the prompt — no number, and nothing round competing with the
      // buttons for attention. Closing this way is the same as cancelling:
      // nothing was chosen, so nothing changes.
      const COUNTDOWN_MS = 8000;
      const timebar = document.createElement('span');
      timebar.className = 'isl-yieldToastTimebar';
      timebar.setAttribute('aria-hidden', 'true');

      // The bar is drained by a CSS animation, not by JavaScript: a transform
      // animation runs on the compositor at display refresh rate, while a timer
      // loop can only manage a handful of visible steps per second and stalls
      // whenever the main thread is busy. JavaScript keeps only the deadline, so
      // the prompt still closes on time if the animation is throttled.
      let deadline = performance.now() + COUNTDOWN_MS;
      let expiry = null;
      let hiddenAt = null;

      function clearExpiry() {
        if (expiry !== null) window.clearTimeout(expiry);
        expiry = null;
      }

      function armExpiry() {
        clearExpiry();
        expiry = window.setTimeout(() => dismiss(), Math.max(0, deadline - performance.now()));
      }

      function startCountdown() {
        // A hidden window pauses compositing and throttles timers; freeze both
        // clocks and shift the deadline by the time spent away, so the bar
        // resumes exactly where it stopped.
        if (document.visibilityState === 'hidden') {
          if (hiddenAt === null) hiddenAt = performance.now();
          return;
        }
        if (hiddenAt !== null) {
          deadline += performance.now() - hiddenAt;
          hiddenAt = null;
        }
        host.classList.add('is-counting');
        host.classList.remove('is-paused');
        armExpiry();
      }

      function onVisibility() {
        if (document.visibilityState === 'hidden') {
          clearExpiry();
          if (hiddenAt === null) hiddenAt = performance.now();
          host.classList.add('is-paused');
          return;
        }
        startCountdown();
      }

      const dismiss = () => {
        if (yieldToastDismiss !== dismiss) return;
        yieldToastDismiss = null;
        clearExpiry();
        document.removeEventListener('visibilitychange', onVisibility);
        host.classList.remove('is-visible');
        window.setTimeout(() => host.remove(), 200);
      };
      yieldToastDismiss = dismiss;
      document.addEventListener('visibilitychange', onVisibility);

      // A retry that the guard refuses (the sidebar is still collapsed) keeps
      // the prompt: silently swallowing the click would look like a dead button.
      retry.addEventListener('click', () => {
        if (yieldRetry?.()) dismiss();
      });
      disable.addEventListener('click', () => {
        setEnabled(false);
        dismiss();
      });
      close.addEventListener('click', dismiss);

      host.append(timebar, body, close);
      document.body.append(host);
      void host.offsetWidth;
      host.classList.add('is-visible');
      startCountdown();
    }

    /** Islands settings page: skin switch + accent color. */
    function IslandsSettingsPage() {
      const on = useEnabled();
      const compat = useCompat();
      const yielded = useYield();
      const caretCompat = useCaretCompat();
      const lang = useLocale() ?? 'en';
      const copy = String(lang).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
      const blocked = compat.status === 'missing';
      const caretYielded = caretCompat.status === 'yielded';
      const caretBlocked = caretCompat.status === 'missing' || caretYielded;
      const [accent, setAccent] = React.useState(readAccent);
      const [smooth, setSmooth] = React.useState(readSmoothCaretSetting);
      const smoothActive = smooth && !caretBlocked;
      // Opening the page re-probes: the composer may have mounted since the
      // controller's last look, and the row must not keep a stale verdict.
      React.useEffect(() => {
        probeCaretCompatibility();
      }, []);
      const chooseAccent = (color) => {
        setAccent(color);
        applyAccent(color);
        storeAccent(color);
      };
      const chooseSmoothCaret = (next) => {
        setSmooth(next);
        setSmoothCaret(next);
      };
      return h(
        'div',
        { className: 'isl-settingsPage' },
        h(
          'div',
          { className: 'isl-settingsPageHead' },
          h('span', { className: 'isl-settingsPageLogo' }, h(IslandsLogo, { size: 30 })),
          h(
            'div',
            { className: 'isl-settingsPageHeadText' },
            h('div', { className: 'isl-settingsPageTitle' }, copy.title),
            h('div', { className: 'isl-settingsPageDesc' }, copy.description),
          ),
        ),
        h(
          'div',
          { className: 'isl-settingsMeta' },
          h('span', null, copy.compatDetected),
          h('code', { className: 'isl-settingsMetaValue' }, shellVersion ?? 'unknown'),
          h('span', { className: 'isl-settingsMetaSeparator', 'aria-hidden': true }, '·'),
          h('span', null, copy.compatStructure),
          h(
            'code',
            { className: 'isl-settingsMetaValue' },
            shellStructure === 'scroll' ? copy.compatStructureScroll : copy.compatStructureFlat,
          ),
        ),
        h(CompatibilityBanner, { copy, compat, onForce: forceEnable }),
        compat.forced ? h('div', { className: 'isl-compatForced' }, copy.compatForced) : null,
        h(
          'div',
          { className: 'isl-prefRow' },
          h(
            'div',
            { className: 'isl-prefText' },
            h('div', { className: 'isl-prefTitle' }, copy.enable),
            h('div', { className: 'isl-prefDesc' }, copy.enableDesc),
          ),
          h(
            'button',
            {
              type: 'button',
              role: 'switch',
              className: 'isl-switch',
              'aria-checked': on,
              'aria-label': copy.enable,
              title: blocked ? copy.compatBannerTitle : copy.enable,
              disabled: blocked,
              onClick: () => setEnabled(!on),
            },
            h('span', { className: 'isl-switchThumb' }),
          ),
        ),
        // Only worth explaining while the skin is still wanted: a user who
        // turned it off themselves should not be told it stepped aside.
        on && yielded.status === 'yielded'
          ? h(
              'div',
              { className: 'isl-prefRow isl-yieldRow' },
              h(
                'div',
                { className: 'isl-prefText' },
                h('div', { className: 'isl-prefTitle' }, copy.yieldTitle),
                h('div', { className: 'isl-prefDesc' }, copy.yieldBody),
                h(
                  'div',
                  { className: 'isl-prefWarn' },
                  copy.yieldHint,
                  typeof yielded.since === 'number'
                    ? ` · ${copy.yieldSince} ${new Date(yielded.since).toLocaleTimeString()}`
                    : '',
                ),
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'isl-yieldAction',
                  onClick: () => yieldRetry?.(),
                },
                copy.yieldRetry,
              ),
            )
          : null,
        h(
          'div',
          { className: 'isl-prefRow' },
          h(
            'div',
            { className: 'isl-prefText' },
            h('div', { className: 'isl-prefTitle' }, copy.accent),
            h('div', { className: 'isl-prefDesc' }, copy.accentDesc),
          ),
          h(
            'div',
            { className: 'isl-accentPicker' },
            h('button', {
              type: 'button',
              className: 'isl-accentSwatch is-default' + (accent === null ? ' is-selected' : ''),
              title: copy.accentDefault,
              'aria-label': copy.accentDefault,
              'aria-pressed': accent === null,
              onClick: () => chooseAccent(null),
            }),
            ACCENT_PRESETS.map((color) =>
              h('button', {
                type: 'button',
                key: color,
                className:
                  'isl-accentSwatch' + (accent !== null && accent.toLowerCase() === color.toLowerCase() ? ' is-selected' : ''),
                style: { background: color },
                title: color,
                'aria-label': color,
                'aria-pressed': accent !== null && accent.toLowerCase() === color.toLowerCase(),
                onClick: () => chooseAccent(color),
              }),
            ),
            h(
              'label',
              { className: 'isl-accentCustom', title: copy.accentCustom },
              h('input', {
                type: 'color',
                value: accent ?? DEFAULT_ACCENT,
                'aria-label': copy.accentCustom,
                onChange: (event) => chooseAccent(event.target.value),
              }),
            ),
          ),
        ),
        h(
          'div',
          { className: 'isl-prefRow' },
          h(
            'div',
            { className: 'isl-prefText' },
            h('div', { className: 'isl-prefTitle' }, copy.smoothCaret),
            h('div', { className: 'isl-prefDesc' }, copy.smoothCaretDesc),
            caretBlocked
              ? h(
                  'div',
                  {
                    className: 'isl-prefWarn',
                    title: caretCompat.missing.length > 0 ? caretCompat.missing.join(' · ') : undefined,
                  },
                  caretYielded ? copy.smoothCaretYielded : copy.smoothCaretCompat,
                )
              : null,
          ),
          h(
            'button',
            {
              type: 'button',
              role: 'switch',
              className: 'isl-switch',
              'aria-checked': smoothActive,
              'aria-label': copy.smoothCaret,
              title: caretBlocked
                ? caretYielded
                  ? copy.smoothCaretYielded
                  : copy.smoothCaretCompat
                : copy.smoothCaret,
              disabled: caretBlocked,
              onClick: () => chooseSmoothCaret(!smooth),
            },
            h('span', { className: 'isl-switchThumb' }),
          ),
        ),
      );
    }

    function IslandsSectionIcon({ size = 16 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('rect', { x: 1.5, y: 1.5, width: 5.5, height: 5.5, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.3 }),
        h('rect', { x: 9, y: 1.5, width: 5.5, height: 5.5, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.3 }),
        h('rect', { x: 1.5, y: 9, width: 5.5, height: 5.5, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.3 }),
        h('rect', { x: 9, y: 9, width: 5.5, height: 5.5, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.3 }),
      );
    }

    return {
      inject: ['slots', 'locale', 'layout'],
      apply(ctx) {
        ctx.inject(['uiWorkspace', 'workspaces'], (scope) => {
          uiWorkspaceService = scope.uiWorkspace;
          workspacesService = scope.workspaces;
        });

        pluginCtx = ctx;
        localeService = ctx.locale;
        layoutService = ctx.layout;
        slotsService = ctx.slots;
        applyAccent(readAccent());

        // The stylesheet is one sheet for every build. Structure differences
        // are expressed by the parts the walker writes, not by a release map.
        shellVersion = readDshVersion();

        ctx.effect(() => {
          const tag = document.createElement('style');
          tag.dataset.plugin = 'dsh-islands-ui';
          tag.dataset.pluginCss = 'dsh-islands-ui/islands.css';
          tag.textContent = CSS;
          styleTag = tag;
          document.head.appendChild(tag);
          return () => {
            styleTag = null;
            tag.remove();
            document.body?.removeAttribute(ATTRIBUTE);
          };
        }, 'dsh-islands-ui: stylesheet');

        // Mark host nodes before the gate reads them. The walker is the only
        // place that turns a host local class name into a skin part.
        ctx.effect(() => installParts(), 'dsh-islands-ui: host parts');

        // Everything below turns the chrome on, so it runs only after the gate
        // has confirmed this build still matches the stylesheet.
        const registerSkinChrome = (ctx) => {
          // The rail's fixed anchors read the measured foot stack. Install
          // before the chrome that uses it so the first paint already has the
          // value; the stylesheet's 36px fallback covers a missing seat.
          ctx.effect(() => installFootMeasure(), 'dsh-islands-ui: rail foot measure');

          // The workspace footer panel owns collapse, the remembered height
          // and the drag handle. It only runs while the chrome is on, because
          // it writes the skin's body attributes.
          ctx.effect(() => installFooterPanel(), 'dsh-islands-ui: workspace footer panel');

          // The caret controller only runs with the chrome on: it paints into
          // the composer and reads the skin's body attribute on every frame.
          ctx.effect(() => {
            installCaretController();
            return () => uninstallCaretController();
          }, 'dsh-islands-ui: smooth composer caret');

          ctx.effect(() => {
            const root = document.documentElement;
            let panel = null;
            let styleObserver = null;
            let mountObserver = null;
            let locateFrame = null;
            let retryTimer = null;

            // Publish the right pane's PREFERRED width, not the width the column
            // currently has. The column is 0 while the pane is closed (and while
            // the independent workspace collapse pins the right track), so a
            // measurement-based value can never recover after the pane opens:
            // the track would stay 0 and the panel clamp would keep it hidden.
            // The panel itself always carries its resolved width in
            // `--dsh-sidebar-width` (and its inline width), even while closed.
            const publish = () => {
              if (panel === null) return;
              const value = (panel.style.getPropertyValue('--dsh-sidebar-width') || panel.style.width || '').trim();
              if (value !== '') root.style.setProperty('--isl-rightbar-w', value);
            };

            const watch = (next) => {
              if (next === panel) return;
              styleObserver?.disconnect();
              styleObserver = null;
              panel = next;
              if (panel === null) return;
              styleObserver = new MutationObserver(publish);
              styleObserver.observe(panel, { attributes: true, attributeFilter: ['style'] });
              publish();
            };

            const locate = () => {
              locateFrame = null;
              const next = document.querySelector(HOST.RIGHT_PANEL);
              watch(next);
              if (next === null) return;
              mountObserver?.disconnect();
              mountObserver = null;
              if (retryTimer !== null) {
                clearTimeout(retryTimer);
                retryTimer = null;
              }
            };

            const scheduleLocate = () => {
              if (locateFrame !== null) return;
              locateFrame = requestAnimationFrame(locate);
            };

            locate();
            publishRightbarWidth = locate;
            // The client applies before the shell mounts, so the first query can
            // miss the right pane. Watch until it appears (bounded: a profile
            // without the right pane must not keep a document-wide observer).
            if (panel === null && document.body !== null) {
              mountObserver = new MutationObserver(scheduleLocate);
              mountObserver.observe(document.body, { childList: true, subtree: true });
              retryTimer = setTimeout(() => {
                mountObserver?.disconnect();
                mountObserver = null;
                retryTimer = null;
              }, 10_000);
            }

            return () => {
              if (locateFrame !== null) cancelAnimationFrame(locateFrame);
              if (retryTimer !== null) clearTimeout(retryTimer);
              mountObserver?.disconnect();
              styleObserver?.disconnect();
              if (publishRightbarWidth === locate) publishRightbarWidth = null;
              root.style.removeProperty('--isl-rightbar-w');
            };
          }, 'dsh-islands-ui: rightbar width');

          ctx.slots.inject('shell.overlay', () =>
            ctx.slots.register({ name: 'shell.overlay', id: 'islands-topbar', order: -100 }, IslandsTopBar),
          );

          ctx.slots.inject('shell.overlay', () =>
            ctx.slots.register({ name: 'shell.overlay', id: 'islands-rail', order: -90 }, IslandsRail),
          );

          ctx.slots.inject('shell.overlay', () =>
            ctx.slots.register({ name: 'shell.overlay', id: 'islands-rail-settings', order: -89 }, IslandsRailSettings),
          );

          ctx.slots.inject('shell.overlay', () =>
            ctx.slots.register({ name: 'shell.overlay', id: 'islands-update', order: -87 }, IslandsUpdateButton),
          );

          ctx.slots.inject('shell.overlay', () =>
            ctx.slots.register({ name: 'shell.overlay', id: 'islands-pinned', order: -88 }, IslandsPinnedSection),
          );

          ctx.inject(['slots', 'modelDirectories'], (scope) => {
            modelDirectories = scope.modelDirectories;
            // Single slots render the lowest priority; a negative priority shadows
            // the shipped selector without colliding with it.
            scope.slots.inject('conversation.input.model', () =>
              scope.slots.register({ name: 'conversation.input.model', priority: -1 }, ModelPicker),
            );
          });

          // Take the workspace shortcut over at the shortcut service layer: fixed
          // input listeners run before the catalog dispatch, so the DSH
          // sidebar.left.toggle never swaps in its rail-only render tree.
          ctx.inject(['shortcuts'], (scope) => {
            shortcutsService = scope.shortcuts;

            ctx.effect(
              () => {
                try {
                  return scope.shortcuts.register({
                    id: 'islands.model.open',
                    label: () => 'Model picker',
                    aliases: [],
                    defaults: {
                      'desktop:macos': { code: 'KeyM', modifiers: ['primary', 'shift'] },
                      'desktop:windows': { code: 'KeyM', modifiers: ['primary', 'shift'] },
                      'desktop:linux': { code: 'KeyM', modifiers: ['primary', 'shift'] },
                    },
                    regions: ['page', 'editable'],
                    modals: [],
                    resolve: () => ({
                      status: 'handled',
                      run: () => window.dispatchEvent(new CustomEvent('islands:model-open')),
                    }),
                  });
                } catch (error) {
                  console.warn('[islands-ui] model picker shortcut unavailable', error);
                  return undefined;
                }
              },
              'dsh-islands-ui: model picker shortcut',
            );

            if (typeof scope.shortcuts.observeFixedInput !== 'function') return;
          const off = scope.shortcuts.observeFixedInput((input) => {
              if (input.type !== 'keydown') return;
              if (!document.body.hasAttribute(ATTRIBUTE)) return;
              const gesture = input.gesture;
              if (gesture.code !== 'KeyB' || gesture.repeat || gesture.composing) return;
              if (!(gesture.meta || gesture.control) || gesture.alt || gesture.shift) return;
              const modal = input.context?.modal;
              if (modal !== null && modal !== undefined && modal !== 'sidebar') return;
              // Desktop delivers the platform's primary chord through the native
              // keyboard bridge, bypassing fixed input. Let that path collapse the
              // DSH and let the frame observer below convert it; intercepting both
              // would toggle twice. The secondary chord is handled here.
              const runtime = scope.shortcuts.runtime;
              const platform = scope.shortcuts.platform;
              const nativeOwned =
                runtime === 'desktop' &&
                ((platform === 'macos' && gesture.meta && !gesture.control) ||
                  (platform !== 'macos' && gesture.control && !gesture.meta));
              if (nativeOwned) return;
              input.consume();
              toggleWorkspace();
            });
            scope.effect(() => off, 'dsh-islands-ui: workspace collapse shortcut');
          });

          // The native primary chord reaches DSH's own sidebar collapse before
          // any fixed listener. Convert that collapse into the skin's workspace
          // state and restore the expanded sidebar render tree so the host rail
          // never stays on screen. Not every host collapse is a user gesture:
          // below 1024px, across a breakpoint resize, or when a narrow right
          // panel opens, the host collapses on its own. Those automatic
          // collapses always HIDE the workspace (never toggle it), so a user
          // who collapsed the workspace does not get it flipped back open by a
          // resize. `hostCollapseAction` owns that decision and is unit tested.
          //
          // Another participant can own the shell as well: a plugin that wants
          // the sidebar collapsed asks the host for it and answers every restore
          // with another collapse. Converting those turns two plugins into one
          // loop — measured at about one round a second against ds-bot's Bot
          // mode on 0.2.2-rc.5 — so the counter that decides when to stand down
          // sits on this same synchronous path. A timer would never run if the
          // loop closed inside a single task. `createYieldGuard` owns that call.
          ctx.effect(() => {
            let observer;
            let timer;
            let resizedAt = 0;

            const guard = createYieldGuard({
              schedule: (run, ms) => window.setTimeout(run, ms),
              cancel: (id) => window.clearTimeout(id),
              apply: (active) => {
                // Standing down hands the host back untouched; returning
                // re-applies the attribute the components and styles read.
                skinSuspended = !active;
                syncAttribute();
              },
              read: () => document.querySelector(FRAME)?.hasAttribute('data-sidebar-collapsed') === true,
              isHidden: () => document.visibilityState === 'hidden',
              onChange: (state) => setYieldState(state),
              onPrompt: () => {
                if (!yieldPromptMuted) showYieldToast();
              },
            });
            yieldRetry = () => guard.retry(Date.now());

            const onResize = () => { resizedAt = Date.now(); };
            const onVisibility = () => {
              resizedAt = Date.now();
              guard.wake(Date.now());
            };
            window.addEventListener('resize', onResize);
            document.addEventListener('visibilitychange', onVisibility);

            const fix = () => {
              const frame = document.querySelector(FRAME);
              if (frame === null) return;
              const collapsed = frame.hasAttribute('data-sidebar-collapsed');
              // The guard sees every observation, including the ones it answers
              // with `skip`: while stood down it is the only thing watching for
              // the moment the sidebar stays expanded again.
              if (guard.observe(collapsed, Date.now()) !== 'convert') return;
              const action = hostCollapseAction({
                skinEnabled: document.body.hasAttribute(ATTRIBUTE),
                drawer: frame.hasAttribute('data-sidebar-drawer'),
                width: window.innerWidth,
                recentResize: resizedAt !== 0 && Date.now() - resizedAt < RESIZE_GRACE_MS,
                skinCollapsed: document.body.hasAttribute(WORKSPACE_ATTR),
              });
              if (action === 'ignore') return;
              if (action === 'clear') {
                // Drawer mode owns the workspace; the independent skin
                // collapse must never hide the drawer's workspace.
                setWorkspaceCollapsed(false);
                return;
              }
              setWorkspaceCollapsed(action === 'collapse');
              layoutService?.toggleSidebar();
            };
            const attach = () => {
              const frame = document.querySelector(FRAME);
              if (frame === null) {
                timer = window.setTimeout(attach, 200);
                return;
              }
              fix();
              observer = new MutationObserver(fix);
              observer.observe(frame, {
                attributes: true,
                attributeFilter: ['data-sidebar-collapsed', 'data-sidebar-drawer'],
              });
            };
            attach();
            return () => {
              window.clearTimeout(timer);
              guard.stop();
              yieldRetry = null;
              observer?.disconnect();
              window.removeEventListener('resize', onResize);
              document.removeEventListener('visibilitychange', onVisibility);
            };
          }, 'dsh-islands-ui: native collapse conversion');

          // Windows keeps DSH's native toggle in the caption row. The native
          // layout action closes the sidebar by setting its width to 0 and
          // reopens it at the contract default, forgetting the user's drag
          // width. Run the skin's width-preserving workspace collapse from
          // that same control instead; the native button stays where it is.
          ctx.effect(() => {
            const onClick = (event) => {
              if (!(event.target instanceof Element)) return;
              if (!document.body.hasAttribute(ATTRIBUTE)) return;
              if (!document.documentElement.hasAttribute('data-windows-titlebar')) return;
              if (!(event.target.closest(HOST.SIDEBAR_TOGGLE) instanceof HTMLElement)) return;
              // React delegates its onClick at the root; stop the click before
              // it reaches that listener so DSH's toggleSidebar never runs.
              event.preventDefault();
              event.stopImmediatePropagation();
              toggleWorkspace();
            };
            document.addEventListener('click', onClick, true);
            return () => document.removeEventListener('click', onClick, true);
          }, 'dsh-islands-ui: windows workspace toggle');
        };
        skinRegistrar = () => registerSkinChrome(ctx);

        ctx.slots.inject('settings.section', () =>
          ctx.slots.register(
            { name: 'settings.section', id: 'islands-ui', order: 30, label: 'Islands UI' },
            IslandsSettingsPage,
          ),
        );

        ctx.slots.inject('settings.section.icon', () =>
          ctx.slots.register({ name: 'settings.section.icon', id: 'islands-ui' }, IslandsSectionIcon),
        );

        if (isForced()) {
          shellStructure = detectStructure();
          setCompat({ status: 'ok', missing: [], forced: true, version: shellVersion, structure: shellStructure });
          activate();
          return;
        }
        ctx.effect(() => {
          const gate = createCompatGate({
            doc: document,
            win: window,
            missingAnchors,
            rootSlot: HOST.ROOT_SLOT,
            publish: ({ status, missing }) => {
              shellStructure = detectStructure();
              setCompat({ status, missing, forced: isForced(), version: shellVersion, structure: shellStructure });
            },
            readStored,
            showToast: showCompatibilityToast,
            dismissToast: () => {
              if (compatToastDismiss !== null) compatToastDismiss();
            },
            activate,
            warn: (message, detail) =>
              console.warn(message, { version: shellVersion, structure: shellStructure, ...detail }),
            info: (message) => console.info(message),
          });
          gate.start();
          return () => gate.stop();
        }, 'dsh-islands-ui: compatibility gate');      },
    };
  },
});
