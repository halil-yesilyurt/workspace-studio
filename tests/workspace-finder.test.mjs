import test from 'node:test';
import assert from 'node:assert/strict';
import {
  comparisonCopy, matchItems, matchWorkspace,
} from '../src/lib/workspace-finder.ts';
import { isSetup, totalFor } from '../src/lib/catalog.ts';

const pick = (work, space, priority, plan = 'month') =>
  matchWorkspace({ work, space, priority }, plan);

test('engineering + compact + value recommends the essentials', () => {
  const result = pick('engineering', 'compact', 'value');
  assert.equal(result.setup.desk, 'electric');
  assert.equal(result.setup.chair, 'mesh');
  assert.deepEqual(result.setup.accessories, ['monitor', 'keyboard']);
  assert.equal(result.title, 'The Deep Work Desk');
});

test('creative + roomy + screens prioritizes an ultrawide display and desk space', () => {
  const { setup, title } = pick('creative', 'roomy', 'screens');
  assert.equal(setup.desk, 'dual');
  assert.ok(setup.accessories.includes('ultrawide'));
  assert.ok(!setup.accessories.includes('monitor'));
  assert.ok(setup.accessories.includes('keyboard'));
  assert.equal(title, 'The Creative Flow');
});

test('compact room prevents an ultrawide recommendation even with screen priority', () => {
  const { setup } = pick('creative', 'compact', 'screens');
  assert.equal(setup.desk, 'electric');
  assert.ok(setup.accessories.includes('monitor'));
  assert.ok(!setup.accessories.includes('ultrawide'));
});

test('value priority avoids premium desks and nonessential extras', () => {
  const { setup } = pick('creative', 'roomy', 'value');
  assert.equal(setup.desk, 'electric');
  assert.ok(!setup.accessories.includes('ultrawide'));
  assert.ok(!setup.accessories.includes('plant'));
  assert.ok(!setup.accessories.includes('lamp'));
});

test('comfort priority changes the chair and lighting choices', () => {
  const { setup } = pick('everyday', 'compact', 'comfort');
  assert.equal(setup.chair, 'comfort');
  assert.ok(setup.accessories.includes('lamp'));
});

test('all 36 possible answer/period combinations produce valid purchasable compositions', () => {
  for (const work of ['engineering', 'creative', 'everyday']) {
    for (const space of ['compact', 'roomy']) {
      for (const priority of ['value', 'screens', 'comfort']) {
        for (const plan of ['week', 'month']) {
          const { setup, rationale } = pick(work, space, priority, plan);
          assert.equal(isSetup(setup), true, `Invalid: ${work}/${space}/${priority}/${plan}`);
          assert.ok(totalFor(setup) > 0);
          assert.equal(rationale.length, 3);
          assert.ok(rationale.every((entry) => entry.length > 25));
        }
      }
    }
  }
});

test('recommendations keep the users chosen rental period', () => {
  assert.equal(pick('engineering', 'roomy', 'screens', 'week').setup.plan, 'week');
});

test('price difference copy is honest about increases, reductions, and equal prices', () => {
  const cheap = pick('engineering', 'compact', 'value').setup;
  const costly = pick('creative', 'roomy', 'screens').setup;
  assert.ok(totalFor(costly) > totalFor(cheap));
  assert.match(comparisonCopy(cheap, costly), /more per month/);
  assert.match(comparisonCopy(costly, cheap), /less per month/);
  assert.match(comparisonCopy(cheap, cheap), /Same estimated/);
});

test('summary describes selected gear, not an invented score', () => {
  const { setup } = pick('engineering', 'compact', 'value');
  const summary = matchItems(setup);
  assert.match(summary, /Electric Standing Desk/);
  assert.match(summary, /27” 4K Monitor/);
  assert.doesNotMatch(summary, /%|AI score/i);
});
