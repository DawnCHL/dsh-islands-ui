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

export const COMPAT_TIMING = Object.freeze({
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
export function createCompatGate(deps) {
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
