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
export const HOST_NARROW_MAX = 1024;
/** How long after a viewport resize the host collapse is considered automatic. */
export const RESIZE_GRACE_MS = 300;

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
export function hostCollapseAction({ skinEnabled, drawer, width, recentResize, skinCollapsed }) {
  if (!skinEnabled) return 'ignore';
  if (drawer) return 'clear';
  if (width < HOST_NARROW_MAX || recentResize) return 'collapse';
  return skinCollapsed ? 'expand' : 'collapse';
}
