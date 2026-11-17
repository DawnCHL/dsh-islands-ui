import test from 'node:test';
import assert from 'node:assert/strict';
import { clampFooterHeight, footerMaxHeight } from '../src/host/footer.js';

test('footer max height is the smaller of 800px and 45% of the sidebar', () => {
  // 45% wins on ordinary sidebars ...
  assert.equal(footerMaxHeight(800), 360);
  assert.equal(footerMaxHeight(1200), 540);
  // ... the absolute 800px ceiling wins on very tall ones.
  assert.equal(footerMaxHeight(2000), 800);
  assert.equal(footerMaxHeight(1778), 800);
  // A short sidebar still gets a proportional cap.
  assert.equal(footerMaxHeight(300), 135);
  // No measurement yet: fall back to the absolute cap.
  assert.equal(footerMaxHeight(0), 800);
});

test('the 200px floor yields to the cap on short sidebars', () => {
  // Normal window: 200px floor.
  assert.equal(clampFooterHeight(100, 800), 200);
  assert.equal(clampFooterHeight(500, 800), 360);
  assert.equal(clampFooterHeight(250, 800), 250);
  // Short window: floor and cap collapse to 45% so the workspace survives.
  assert.equal(clampFooterHeight(100, 300), 135);
  assert.equal(clampFooterHeight(300, 300), 135);
  // A stored height below the floor is lifted to it.
  assert.equal(clampFooterHeight(0, 800), 200);
});
