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

export const PART_ATTR = 'data-islands-part';
export const SKIN_ATTR = 'data-islands-ui';

/** Host promises, never hashed class names. */
export const HOST = Object.freeze({
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
export const HOST_ATTRIBUTES = Object.freeze([
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
export function localClassName(token) {
  const parts = token.split('_');
  if (parts.length < 2) return null;
  const last = parts[parts.length - 1];
  if (parts[0] !== '') return LOCAL_NAME.test(last) ? last : null;
  return LOCAL_NAME.test(parts[1]) ? parts[1]
    : LOCAL_NAME.test(last) ? last : null;
}

/** Selector for one skin part. */
export function partSelector(name) {
  return `[${PART_ATTR}~="${name}"]`;
}

/** The shell frame and its three columns. */
export const FRAME_PARTS = {
  centerCol: 'center-column',
  sidebarCol: 'sidebar-column',
  mainPanel: 'main-panel',
};

/** The sidebar shell, its workspace browser, its rows and its foot seats. */
export const SIDEBAR_PARTS = {
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
export const HEADER_PARTS = {
  header: 'conversation-header',
  headerBlank: 'conversation-header-blank',
  crumb: 'header-crumb',
  headerUtilities: 'header-utilities',
  headerCorner: 'header-corner',
};

/** The hero frame: its headline and workspace chip. */
export const HERO_PARTS = {
  headline: 'hero-headline',
  workspace: 'hero-workspace',
};

/** The composer card's own parts. */
export const COMPOSER_PARTS = {
  cardWorkspaceTrigger: 'composer-card-workspace-trigger',
  notice: 'composer-notice',
};

/** The conversation body wrapper, which embeds a second conversation. */
export const CONTENT_PARTS = {
  embeddedBody: 'embedded-body',
};

/** The settings dialog and its navigation. */
export const SETTINGS_PARTS = {
  overlay: 'settings-overlay',
  mask: 'settings-mask',
  panel: 'settings-panel',
  navTitle: 'settings-nav-title',
  nav: 'settings-nav',
  navList: 'settings-nav-list',
  navCell: 'settings-nav-cell',
  active: 'settings-nav-active',
  navIcon: 'settings-nav-icon',
  card: 'settings-card',
  section: 'settings-section',
  balanceCard: 'account-balance-card',
};

/** The skin's own update entry, read from the host's foot and toggle seats. */
export const FOOT_PARTS = {
  indicator: 'update-indicator',
};

/** The account trigger's label, kept out of the generic `label` name. */
export const ACCOUNT_PARTS = {
  label: 'account-label',
};

/** The account wrapper inside the settings area: its root and anchor boxes. */
export const ACCOUNT_SHELL_PARTS = {
  root: 'account-root',
  anchor: 'account-anchor',
};

/** The settings trigger's label. */
export const SETTINGS_TRIGGER_PARTS = {
  triggerLabel: 'settings-trigger-label',
};

/** The sidebar toggle's update badge. */
export const TOGGLE_PARTS = {
  badge: 'update-badge',
};

/**
 * Regions, in walk order. `within` is always a host promise or a part the
 * parent region wrote. `rootParts` reads the anchor's direct children; `skip`
 * keeps a region out of a subtree the host mounts inside its own box.
 */
export const PART_REGIONS = Object.freeze([
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
    id: 'settings',
    within: HOST.SETTINGS_OVERLAY,
    parts: SETTINGS_PARTS,
  },
  {
    id: 'settings-panel',
    within: partSelector('settings-panel'),
    parts: {
      header: 'settings-header',
      options: 'settings-options',
      close: 'settings-close',
    },
  },
]);

/** Every part name the table defines. */
export function partNames() {
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
export function installParts() {
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
