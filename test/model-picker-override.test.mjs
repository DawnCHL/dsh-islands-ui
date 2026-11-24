import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the model picker override is opt-in and off by default', async () => {
  const source = await read('src/client.template.js');

  assert.match(source, /const MODEL_OVERRIDE_KEY = 'dsh-islands-ui:model-override';/u);
  const reader = source.slice(
    source.indexOf('function readModelOverride()'),
    source.indexOf('function subscribeModelOverride'),
  );
  // Only an explicit '1' turns the override on. No stored value — every
  // profile that predates the switch — keeps the native selector.
  assert.match(reader, /localStorage\.getItem\(MODEL_OVERRIDE_KEY\) === '1'/u);
  assert.doesNotMatch(reader, /stored === null/u);
});

test('the settings page exposes the override switch in both locales', async () => {
  const source = await read('src/client.template.js');

  assert.match(source, /modelOverride: '覆写模型选择器'/u);
  assert.match(source, /modelOverride: 'Override the model selector'/u);
  const page = source.slice(source.indexOf('function IslandsSettingsPage()'));
  assert.match(page, /const modelOverrideOn = useModelOverride\(\);/u);
  assert.match(page, /'aria-label': copy\.modelOverride/u);
  assert.match(page, /onClick: \(\) => setModelOverride\(!modelOverrideOn\)/u);
});

test('the slot occupant only exists while the override is active', async () => {
  const source = await read('src/client.template.js');
  const controller = source.slice(
    source.indexOf('const sync = () => {\n              const active = modelOverride'),
    source.indexOf("'dsh-islands-ui: model picker override'"),
  );

  // The switch and the skin's own attribute both gate the registration. The
  // attribute matters because a skin that stepped aside must hand the native
  // selector back instead of leaving an invisible occupant on the slot.
  assert.match(controller, /const active = modelOverride && document\.body\?\.hasAttribute\(ATTRIBUTE\) === true;/u);
  assert.match(controller, /if \(slotOff === null\)/u);
  assert.match(controller, /conversation\.input\.model/u);
  assert.match(controller, /priority: -1/u);
  // The switch and the skin on/off both re-run the decision, and unregistering
  // disposes the slot effect instead of only hiding the component.
  assert.match(controller, /subscribeModelOverride\(sync\)/u);
  assert.match(controller, /const offEnabled = subscribe\(sync\)/u);
  assert.match(controller, /off\(\);/u);
  // The shortcut belongs to the override; it must not survive into the native
  // selector state and dispatch into a menu nobody mounted.
  assert.match(controller, /id: 'islands\.model\.open'/u);
});

test('the skin attribute change re-syncs the override', async () => {
  const source = await read('src/client.template.js');
  const sync = source.slice(source.indexOf('function syncAttribute()'), source.indexOf('function subscribe(listener)'));

  assert.match(sync, /syncModelPickerOverride\?\.\(\);/u);
});

test('the override installs after the model directory service is ready', async () => {
  const source = await read('src/client.template.js');

  assert.match(source, /ctx\.inject\(\['slots', 'modelDirectories', 'shortcuts'\], \(scope\) => \{/u);
  const controller = source.slice(
    source.indexOf("ctx.inject(['slots', 'modelDirectories', 'shortcuts']"),
    source.indexOf("'dsh-islands-ui: model picker override'"),
  );
  assert.match(controller, /modelDirectories = scope\.modelDirectories;/u);
});
