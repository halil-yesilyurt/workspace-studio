import test from 'node:test';
import assert from 'node:assert/strict';
import {
  accessories, accessoryIds, applyPreset, chairIds, desks, deskIds, formatPrice,
  initialSetup, isSetup, parseSetupParams, presets, selectedProducts, serializeSetup,
  setupInsight, totalFor, withAccessory,
} from '../src/lib/catalog.ts';

test('challenge minimums: 2 desks, 2 chairs and multiple accessories', () => {
  assert.ok(deskIds.length >= 2);
  assert.ok(chairIds.length >= 2);
  assert.ok(accessoryIds.length >= 3);
});

test('every product has a usable name, description and prices', () => {
  for (const product of [...Object.values(desks), ...Object.values(accessories)]) {
    assert.ok(product.name && product.detail && product.description);
    assert.ok(product.weekly > 0 && product.monthly > 0);
  }
});

test('starter setup has a valid chair, desk, and display', () => {
  assert.ok(isSetup(initialSetup));
  assert.ok(initialSetup.accessories.includes('monitor'));
});

test('every preset is a valid setup and keeps the selected rental period', () => {
  for (const id of Object.keys(presets)) {
    const setup = applyPreset({ ...initialSetup, plan: 'week' }, id);
    assert.ok(isSetup(setup));
    assert.equal(setup.plan, 'week');
  }
});

test('preset application copies accessories rather than sharing mutable arrays', () => {
  const setup = applyPreset(initialSetup, 'creator');
  setup.accessories.push('monitor');
  assert.deepEqual(presets.creator.setup.accessories, ['ultrawide', 'lamp', 'keyboard', 'plant']);
});

test('accessories toggle on and off without duplicating', () => {
  const added = withAccessory(initialSetup, 'lamp');
  assert.equal(added.accessories.includes('lamp'), true);
  const removed = withAccessory(added, 'lamp');
  assert.equal(removed.accessories.includes('lamp'), false);
  assert.deepEqual(removed, initialSetup);
});

test('selecting a curved display swaps the existing monitor', () => {
  const changed = withAccessory(initialSetup, 'ultrawide');
  assert.ok(changed.accessories.includes('ultrawide'));
  assert.ok(!changed.accessories.includes('monitor'));
  assert.ok(isSetup(changed));
});

test('display can be removed without removing other accessories', () => {
  const changed = withAccessory(initialSetup, 'monitor');
  assert.deepEqual(changed.accessories, ['keyboard']);
});

test('a weekly total equals the exact sum of product prices', () => {
  const setup = { ...initialSetup, plan: 'week' };
  assert.equal(totalFor(setup), selectedProducts(setup).reduce((n, product) => n + product.weekly, 0));
});

test('monthly totals update when a desk and chair are swapped', () => {
  const original = totalFor(initialSetup);
  const changed = { ...initialSetup, desk: 'dual', chair: 'comfort' };
  assert.equal(totalFor(changed) - original, (52 - 39) + (32 - 29));
});

test('price formatting is stable and explicit', () => {
  assert.equal(formatPrice(72), '$72');
});

test('share links round-trip all choices', () => {
  const setup = applyPreset({ ...initialSetup, plan: 'week' }, 'creator');
  const roundtrip = parseSetupParams(serializeSetup(setup));
  assert.deepEqual(roundtrip, setup);
});

test('URL parser accepts an intentionally empty accessories list', () => {
  const parsed = parseSetupParams('?desk=electric&chair=mesh&extras=&plan=month');
  assert.deepEqual(parsed?.accessories, []);
});

test('URL parser rejects invalid or malicious product identifiers', () => {
  assert.equal(parseSetupParams('?desk=evil&chair=mesh&extras=monitor&plan=week'), null);
  assert.equal(parseSetupParams('?desk=electric&chair=mesh&extras=monitor,evil&plan=week'), null);
  assert.equal(parseSetupParams('?desk=electric&chair=mesh&extras=monitor,monitor&plan=week'), null);
  assert.equal(parseSetupParams('?desk=electric&chair=mesh&extras=monitor,ultrawide&plan=week'), null);
  assert.equal(parseSetupParams(''), null);
});

test('invalid local storage objects cannot pass validation', () => {
  assert.equal(isSetup(null), false);
  assert.equal(isSetup({ ...initialSetup, accessories: 'monitor' }), false);
  assert.equal(isSetup({ ...initialSetup, plan: 'year' }), false);
});

test('recommendations respond to missing display and lamp', () => {
  const bare = { ...initialSetup, accessories: [] };
  assert.equal(setupInsight(bare).add, 'monitor');
  assert.equal(setupInsight(initialSetup).add, 'lamp');
  assert.equal(setupInsight(withAccessory(initialSetup, 'lamp')).add, undefined);
});
