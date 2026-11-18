import test from 'node:test';
import assert from 'node:assert/strict';
import { hostCollapseAction, HOST_NARROW_MAX, RESIZE_GRACE_MS } from '../src/host/collapse.js';

const base = { skinEnabled: true, drawer: false, width: 1400, recentResize: false, skinCollapsed: false };

test('a disabled skin never owns the host collapse', () => {
  assert.equal(hostCollapseAction({ ...base, skinEnabled: false }), 'ignore');
});

test('drawer mode hands the workspace back to the host', () => {
  assert.equal(hostCollapseAction({ ...base, drawer: true, width: 700 }), 'clear');
});

test('automatic collapses only hide the workspace, never toggle it open', () => {
  assert.equal(hostCollapseAction({ ...base, width: 900, skinCollapsed: false }), 'collapse');
  // A user who collapsed the workspace must not get it flipped open by a resize.
  assert.equal(hostCollapseAction({ ...base, width: 900, skinCollapsed: true }), 'collapse');
  assert.equal(hostCollapseAction({ ...base, recentResize: true, skinCollapsed: true }), 'collapse');
  assert.equal(hostCollapseAction({ ...base, width: HOST_NARROW_MAX - 1 }), 'collapse');
});

test('a wide-window collapse with no auto context is the user gesture', () => {
  assert.equal(hostCollapseAction({ ...base, skinCollapsed: false }), 'collapse');
  assert.equal(hostCollapseAction({ ...base, skinCollapsed: true }), 'expand');
  assert.equal(HOST_NARROW_MAX, 1024);
  assert.equal(RESIZE_GRACE_MS, 300);
});
