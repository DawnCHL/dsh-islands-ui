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
export function footerStoredHeight(parsed) {
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
export function footerMaxHeight(sidebarHeight) {
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
export function footerMinHeight(contentHeight, sidebarHeight) {
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
export function clampFooterHeight(value, sidebarHeight, contentHeight = FOOTER_MIN_HEIGHT) {
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
export function footerRenderedHeight(storedHeight, naturalHeight, sidebarHeight) {
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
export function installFooterPanel() {
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
