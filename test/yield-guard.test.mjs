import test from 'node:test';
import assert from 'node:assert/strict';
import { createYieldGuard, YIELD_TIMING } from '../src/host/yield.js';

/** A guard on a fake clock with a tiny timer queue. */
function harness(options = {}) {
  let t = 0;
  let seq = 0;
  const timers = new Map();
  const applied = [];
  const states = [];
  const prompts = [];
  const host = { collapsed: false, hidden: false };

  const guard = createYieldGuard({
    now: () => t,
    schedule: (run, ms) => {
      const id = ++seq;
      timers.set(id, { at: t + ms, run });
      return id;
    },
    cancel: (id) => timers.delete(id),
    apply: (on) => applied.push({ on, t }),
    read: () => host.collapsed,
    isHidden: () => host.hidden,
    onChange: (state) => states.push({ ...state }),
    onPrompt: (state) => prompts.push({ ...state, t }),
    timing: options.timing,
  });

  /** Run every timer that comes due inside the next `ms`. */
  const advance = (ms) => {
    const end = t + ms;
    for (;;) {
      const due = [...timers.entries()]
        .filter(([, timer]) => timer.at <= end)
        .sort((a, b) => a[1].at - b[1].at)[0];
      if (due === undefined) break;
      const [id, timer] = due;
      timers.delete(id);
      t = Math.max(t, timer.at);
      timer.run();
    }
    t = end;
  };

  /** One observed collapse: the attribute appears, then goes away. */
  const collapse = () => {
    host.collapsed = true;
    const verdict = guard.observe(true, t);
    host.collapsed = false;
    guard.observe(false, t);
    return verdict;
  };

  /** Three collapses inside one window: the contention the guard exists for. */
  const fight = () => [collapse(), collapse(), collapse()];

  /** Step the clock until a probe runs, then report where it landed. */
  const untilProbe = (limit = 60000) => {
    const start = t;
    while (guard.snapshot().status === 'yielded' && t - start < limit) advance(1);
    return t;
  };

  const probes = () => applied.filter((entry) => entry.on).map((entry) => entry.t);

  return { guard, host, advance, collapse, fight, untilProbe, probes, applied, states, prompts, at: () => t };
}

test('a normal gesture still converts', () => {
  const h = harness();
  assert.equal(h.collapse(), 'convert');
  assert.equal(h.guard.snapshot().status, 'active');
  assert.deepEqual(h.applied, []);
});

test('collapses older than the window never add up', () => {
  const h = harness();
  // 4s apart: each falls out of the 3s window before the next arrives.
  assert.equal(h.collapse(), 'convert');
  h.advance(4000);
  assert.equal(h.collapse(), 'convert');
  h.advance(4000);
  assert.equal(h.collapse(), 'convert');
  assert.equal(h.guard.snapshot().status, 'active');
});

test('the third collapse inside the window stands the skin down, unconverted', () => {
  const h = harness();
  const verdicts = h.fight();
  assert.deepEqual(verdicts, ['convert', 'convert', 'skip']);
  assert.equal(h.guard.snapshot().status, 'yielded');
  assert.equal(h.guard.snapshot().attempts, 0);
  assert.deepEqual(h.applied.map((entry) => entry.on), [false]);
});

test('a yielded skin neither converts nor probes a host that is still collapsed', () => {
  const h = harness();
  h.fight();
  // The other side keeps asking: the attribute is back before the wait ends.
  h.host.collapsed = true;
  assert.equal(h.guard.observe(true, h.at()), 'skip');
  h.advance(120000);
  assert.equal(h.guard.snapshot().status, 'yielded');
  assert.deepEqual(h.applied.map((entry) => entry.on), [false]);
});

test('the first attempt comes back in half a second', () => {
  const h = harness();
  assert.deepEqual([...YIELD_TIMING.ladder], [500, 1000, 1500]);
  h.fight();
  h.guard.observe(false, h.at());

  h.advance(499);
  assert.equal(h.guard.snapshot().status, 'yielded');
  h.advance(1);
  assert.equal(h.guard.snapshot().status, 'active');
  assert.deepEqual(h.applied.map((entry) => entry.on), [false, true]);
});

test('a collapse during the wait restarts it', () => {
  const h = harness();
  h.fight();
  h.guard.observe(false, h.at());
  h.advance(400);

  h.host.collapsed = true;
  h.guard.observe(true, h.at());
  h.host.collapsed = false;
  h.guard.observe(false, h.at());

  h.advance(499);
  assert.equal(h.guard.snapshot().status, 'yielded');
  h.advance(1);
  assert.equal(h.guard.snapshot().status, 'active');
});

test('failed attempts climb the ladder, then hold at the slow gap', () => {
  const h = harness({ timing: { ladder: [100, 200, 300], holdGap: 1000, window: 200 } });
  for (let round = 0; round < 5; round += 1) {
    h.fight();
    h.guard.observe(false, h.at());
    h.untilProbe();
  }
  const probes = h.probes();
  const gaps = probes.slice(1).map((at, index) => at - probes[index]);
  // 500ms → 1s → 1.5s in the shipped numbers; the shape is what matters here.
  assert.deepEqual(gaps, [200, 300, 1000, 1000]);
});

test('three failed attempts ask the user once, not once per attempt', () => {
  const h = harness({ timing: { ladder: [100, 200, 300], holdGap: 1000, window: 200 } });
  for (let round = 0; round < 6; round += 1) {
    h.fight();
    h.guard.observe(false, h.at());
    h.untilProbe();
  }
  assert.equal(h.prompts.length, 1);
  assert.equal(h.prompts[0].attempts, 3);
});

test('a real recovery re-arms the prompt for the next episode', () => {
  const h = harness({ timing: { ladder: [100, 200, 300], holdGap: 1000, window: 200 } });
  // Four rounds: the stand-down itself does not count, the three failed
  // probes after it do.
  for (let round = 0; round < 4; round += 1) {
    h.fight();
    h.guard.observe(false, h.at());
    h.untilProbe();
  }
  assert.equal(h.prompts.length, 1);

  // Let it recover for real: survive a whole window.
  h.advance(200);
  assert.equal(h.guard.snapshot().attempts, 0);

  for (let round = 0; round < 4; round += 1) {
    h.fight();
    h.guard.observe(false, h.at());
    h.untilProbe();
  }
  assert.equal(h.prompts.length, 2);
});

test('a hidden window defers the probe instead of spending it', () => {
  const h = harness({ timing: { hiddenRetry: 400, ladder: [200] } });
  h.fight();
  h.guard.observe(false, h.at());
  h.host.hidden = true;
  h.advance(200);
  assert.equal(h.guard.snapshot().status, 'yielded');

  h.host.hidden = false;
  h.advance(400);
  assert.equal(h.guard.snapshot().status, 'active');
});

test('the manual retry refuses while the host is still collapsed', () => {
  const h = harness();
  h.fight();
  h.host.collapsed = true;
  assert.equal(h.guard.retry(h.at()), false);
  h.host.collapsed = false;
  assert.equal(h.guard.retry(h.at()), true);
  assert.equal(h.guard.snapshot().status, 'active');
});

test('a stopped guard ignores everything', () => {
  const h = harness();
  h.guard.stop();
  assert.equal(h.guard.observe(true, 0), 'skip');
  assert.equal(h.guard.retry(0), false);
  h.advance(100000);
  assert.deepEqual(h.applied, []);
});
