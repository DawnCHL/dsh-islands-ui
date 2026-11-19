import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampFooterHeight,
  footerMaxHeight,
  footerMinHeight,
  footerRenderedHeight,
  footerStoredHeight,
} from '../src/host/footer.js';

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

test('the floor follows the content when it is shorter than 200px', () => {
  // A 36px button plus the 20px bar gap and 8px bottom inset measures 64px.
  assert.equal(footerMinHeight(64, 800), 64);
  assert.equal(footerMinHeight(199, 800), 199);
  // Tall content keeps the comfort baseline.
  assert.equal(footerMinHeight(200, 800), 200);
  assert.equal(footerMinHeight(420, 800), 200);
  // No usable content: fall back to the baseline.
  assert.equal(footerMinHeight(0, 800), 200);
  // The cap still wins on short sidebars.
  assert.equal(footerMinHeight(420, 300), 135);
  assert.equal(footerMinHeight(64, 300), 64);
});

test('a drag cannot squash the footer below its content', () => {
  assert.equal(clampFooterHeight(10, 800, 64), 64);
  assert.equal(clampFooterHeight(64, 800, 64), 64);
  assert.equal(clampFooterHeight(100, 800, 64), 100);
  // Content taller than the baseline still uses the 200px comfort floor.
  assert.equal(clampFooterHeight(100, 800, 420), 200);
  // ... and the cap still applies.
  assert.equal(clampFooterHeight(500, 800, 420), 360);
});

test('the legacy 200px drag floor migrates to an auto height', () => {
  // Unversioned 1.2.x state: 200px was the drag floor, not a choice.
  assert.equal(footerStoredHeight({ collapsed: false, height: 200 }), null);
  assert.equal(footerStoredHeight({ collapsed: false, height: 199 }), null);
  // A larger unversioned height was a real drag and is kept.
  assert.equal(footerStoredHeight({ collapsed: false, height: 320 }), 320);
  // Once versioned, 200px is deliberate and survives.
  assert.equal(footerStoredHeight({ v: 2, height: 200 }), 200);
  assert.equal(footerStoredHeight({ v: 2, height: null }), null);
  assert.equal(footerStoredHeight(null), null);
});

test('a bottom drag on tall content stays at the 200px floor', () => {
  // Content (452px) is taller than the 200px comfort baseline. Auto would
  // mean the full 452px, so a stored height at the floor must stay fixed;
  // otherwise releasing the drag snaps the seat back to the full content.
  assert.equal(footerRenderedHeight(200, 452, 800), 200);
  assert.equal(footerRenderedHeight(150, 452, 800), 200);
  assert.equal(footerRenderedHeight(300, 452, 800), 300);
  assert.equal(footerRenderedHeight(null, 452, 800), null);
  // Short content: the floor *is* the content, so auto is equivalent.
  assert.equal(footerRenderedHeight(64, 64, 800), null);
  assert.equal(footerRenderedHeight(100, 64, 800), 100);
  // The cap can be the floor on short sidebars: keep it fixed as well.
  assert.equal(footerRenderedHeight(135, 200, 300), 135);
  assert.equal(footerRenderedHeight(100, 200, 300), 135);
});

test('a sliver of overflow grows to the content instead of scrolling', () => {
  // 206px of content at a 200px stored height: a 6px scrollbar would only
  // reveal the last few pixels of the button.
  assert.equal(footerRenderedHeight(200, 206, 800), 206);
  assert.equal(footerRenderedHeight(200, 216, 800), 216);
  // Beyond the tolerance it is real overflow: keep the stored height + scroll.
  assert.equal(footerRenderedHeight(200, 217, 800), 200);
  assert.equal(footerRenderedHeight(200, 296, 800), 200);
  // The cap is not a sliver: max-height already forces the scrollbar.
  assert.equal(footerRenderedHeight(200, 400, 800), 200);
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
