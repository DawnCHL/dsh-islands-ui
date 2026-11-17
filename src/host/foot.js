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
export function installFootMeasure() {
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
