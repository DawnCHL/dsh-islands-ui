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

export const YIELD_TIMING = Object.freeze({
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
export function createYieldGuard(deps) {
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
