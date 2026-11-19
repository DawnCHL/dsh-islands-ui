import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createCompatGate, COMPAT_TIMING } from '../src/host/compat-gate.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Polls a predicate instead of sleeping a fixed window: no CI flake. */
async function waitUntil(predicate, budget = 800) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < budget) {
    if (predicate()) return true;
    await sleep(5);
  }
  return predicate();
}

function createPage({ visibility = 'visible' } = {}) {
  const listeners = new Set();
  const page = {
    visibilityState: visibility,
    rootVisible: false,
    querySelector: () => (page.rootVisible ? { node: true } : null),
    addEventListener: (type, listener) => {
      if (type === 'visibilitychange') listeners.add(listener);
    },
    removeEventListener: (type, listener) => {
      if (type === 'visibilitychange') listeners.delete(listener);
    },
    setVisibility(next) {
      page.visibilityState = next;
      for (const listener of [...listeners]) listener();
    },
    get listenerCount() {
      return listeners.size;
    },
  };
  return page;
}

/**
 * The gate takes its clock, timers, page, contract probe and callbacks as
 * arguments, so a test can drive the whole mount → grace → fail → heal path
 * without a browser and without depending on wall-clock sleeps.
 */
function createHarness({ visibility = 'visible', timing = {} } = {}) {
  const page = createPage({ visibility });
  const state = { missing: ['[data-slot="root"]'] };
  const calls = { publish: [], shown: 0, dismiss: 0, activate: 0, warn: 0, info: 0 };
  let shownOnScreen = 0;
  let clock = 0;

  const gate = createCompatGate({
    doc: page,
    win: { setTimeout, clearTimeout },
    now: () => clock,
    missingAnchors: () => state.missing.slice(),
    rootSlot: '[data-slot="root"]',
    publish: ({ status, missing }) => calls.publish.push({ status, missing }),
    readStored: () => true,
    showToast: () => {
      shownOnScreen += 1;
      calls.shown += 1;
    },
    // Mirrors the real dismiss: a no-op when nothing is on screen.
    dismissToast: () => {
      if (shownOnScreen === 0) return;
      shownOnScreen = 0;
      calls.dismiss += 1;
    },
    activate: () => {
      calls.activate += 1;
    },
    warn: () => {
      calls.warn += 1;
    },
    info: () => {
      calls.info += 1;
    },
    timing: {
      poll: 5,
      timeout: 200,
      partGrace: 40,
      toastDelay: 60,
      healWindow: 400,
      healInterval: 10,
      ...timing,
    },
  });

  return {
    page,
    state,
    calls,
    gate,
    advance: (ms) => {
      clock += ms;
    },
  };
}

test('the gate holds its hand while the shell is still mounting', async (t) => {
  const { state, calls, gate, advance } = createHarness();
  t.after(() => gate.stop());

  gate.start();
  advance(150); // under the timeout, and the shell is not there yet
  await sleep(40);
  assert.equal(calls.publish.length, 0, 'a slow mount is not a decision');
  assert.equal(calls.activate, 0);

  // The shell arrives before the timeout: the skin turns on by itself.
  state.missing = [];
  await waitUntil(() => calls.activate === 1);
  assert.equal(calls.activate, 1);
  assert.deepEqual(calls.publish.at(-1), { status: 'ok', missing: [] });
  assert.equal(calls.shown, 0);
});

test('a shell that never mounts fails once, at the timeout', async (t) => {
  const { calls, gate, advance } = createHarness();
  t.after(() => gate.stop());

  gate.start();
  advance(150);
  await sleep(40);
  assert.equal(calls.publish.length, 0, 'no failure before the timeout');

  advance(100);
  await waitUntil(() => calls.publish.length > 0);
  assert.equal(calls.publish.length, 1);
  assert.equal(calls.publish[0].status, 'missing');
  assert.deepEqual(calls.publish[0].missing, ['[data-slot="root"]']);
  assert.equal(calls.warn, 1);
});

test('a mounted shell without the frame parts is a mismatch, not slowness', async (t) => {
  const { page, state, calls, gate, advance } = createHarness();
  t.after(() => gate.stop());

  page.rootVisible = true;
  state.missing = ['[data-islands-part~="layout-frame"]'];
  gate.start();
  await sleep(20); // let the first tick see the mount, then burn the grace
  advance(60); // past the part grace, measured from the mount
  await waitUntil(() => calls.publish.length > 0);
  assert.equal(calls.publish.length, 1);
  assert.equal(calls.publish[0].status, 'missing');
  assert.equal(calls.activate, 0);
});

test('the notice waits for the hold-back delay and appears once', async (t) => {
  const { page, state, calls, gate, advance } = createHarness();
  t.after(() => gate.stop());

  page.rootVisible = true;
  state.missing = ['[data-slot="sidebar"]'];
  gate.start();
  await sleep(20); // let the first tick see the mount, then burn the grace
  advance(60);
  await waitUntil(() => calls.publish.length > 0);
  assert.equal(calls.shown, 0, 'nothing is shown while the hold-back runs');

  await waitUntil(() => calls.shown === 1);
  assert.equal(calls.shown, 1);
  await sleep(120);
  assert.equal(calls.shown, 1, 'the notice is never shown twice');
});

test('a late mount after a failure heals the gate and takes the notice down', async (t) => {
  const { page, state, calls, gate, advance } = createHarness();
  t.after(() => gate.stop());

  page.rootVisible = true;
  state.missing = ['[data-slot="sidebar"]'];
  gate.start();
  await sleep(20); // let the first tick see the mount, then burn the grace
  advance(60);
  await waitUntil(() => calls.publish.length > 0);
  await waitUntil(() => calls.shown === 1);

  state.missing = [];
  await waitUntil(() => calls.activate === 1);
  assert.equal(calls.activate, 1);
  assert.deepEqual(calls.publish.at(-1), { status: 'ok', missing: [] });
  assert.equal(calls.dismiss, 1, 'the notice on screen is withdrawn');
  assert.equal(calls.info, 1);
});

test('a failure that heals before the delay never shows a notice', async (t) => {
  const { page, state, calls, gate, advance } = createHarness();
  t.after(() => gate.stop());

  page.rootVisible = true;
  state.missing = ['[data-slot="sidebar"]'];
  gate.start();
  await sleep(20); // let the first tick see the mount, then burn the grace
  advance(60);
  await waitUntil(() => calls.publish.length > 0);

  state.missing = [];
  await waitUntil(() => calls.activate === 1);
  assert.equal(calls.shown, 0, 'a recovered gate stays quiet');
  assert.equal(calls.dismiss, 0, 'there was nothing on screen to dismiss');
});

test('a hidden page defers the notice until it is visible again', async (t) => {
  const { page, state, calls, gate, advance } = createHarness();
  t.after(() => gate.stop());

  page.rootVisible = true;
  state.missing = ['[data-slot="sidebar"]'];
  gate.start();
  await sleep(20); // let the first tick see the mount, then burn the grace
  advance(60);
  await waitUntil(() => calls.publish.length > 0);

  page.setVisibility('hidden');
  await sleep(120);
  assert.equal(calls.shown, 0, 'a hidden page is not shown a notice it cannot see');

  page.setVisibility('visible');
  await waitUntil(() => calls.shown === 1);
  assert.equal(calls.shown, 1);
});

test('the hidden stretch is subtracted when the page comes back', async (t) => {
  const { page, calls, gate, advance } = createHarness({ visibility: 'hidden' });
  t.after(() => gate.stop());

  gate.start();
  advance(5000);
  await sleep(40);
  assert.equal(calls.publish.length, 0);

  page.setVisibility('visible');
  advance(150); // still under the 200ms timeout
  await sleep(40);
  assert.equal(calls.publish.length, 0, 'the hidden stretch did not burn the budget');

  advance(100);
  await waitUntil(() => calls.publish.length > 0);
  assert.equal(calls.publish[0].status, 'missing');
});

test('stop() unbinds the page and cancels every pending decision', async (t) => {
  const { page, calls, gate, advance } = createHarness();
  t.after(() => gate.stop());

  gate.start();
  assert.equal(page.listenerCount, 1);
  gate.stop();
  assert.equal(page.listenerCount, 0);

  advance(5000);
  await sleep(120);
  assert.equal(calls.publish.length, 0);
  assert.equal(calls.activate, 0);
});

test('the shipped timing keeps the reviewed budgets', () => {
  assert.deepEqual(COMPAT_TIMING, {
    poll: 100,
    timeout: 10000,
    partGrace: 1500,
    toastDelay: 1500,
    healWindow: 60000,
    healInterval: 400,
  });
});

test('the template wires the gate and no longer carries its own state machine', async (t) => {
  const source = await readFile(new URL('../src/client.template.js', import.meta.url), 'utf8');

  assert.match(source, /createCompatGate\(\{/u);
  assert.match(source, /gate\.start\(\)/u);
  assert.match(source, /forced: isForced\(\)/u, 'the forced label survives a heal');
  assert.doesNotMatch(source, /startCompatibilityGate/u);
  assert.doesNotMatch(source, /COMPAT_CONTENT_GRACE_MS|childElementCount > 0/u);

  // The notice must not depend on an animation frame to become visible.
  const toastFrom = source.indexOf('function showCompatibilityToast');
  const toast = source.slice(toastFrom, source.indexOf('function IslandsSettingsPage'));
  assert.doesNotMatch(toast, /requestAnimationFrame/u);
  assert.match(toast, /void host\.offsetWidth;/u);
  assert.match(toast, /visibilitychange/u);
});
