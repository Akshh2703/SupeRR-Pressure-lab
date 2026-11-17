import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePressureScenario, INTERPRETATION_REGISTER } from './pressureLogic';

test('recommends Rinku Singh in high-RRR death chase with Compensator reading', () => {
  const res = evaluatePressureScenario({
    target: 180,
    score: 132,
    balls: 24,
    wickets: 5,
    situation: 'Chasing',
    phase: 'Death',
  });
  assert.equal(res.name, 'Rinku Singh');
  assert.equal(res.fit, 94);
  assert.equal(res.fitLabel, 'Elite pressure fit');
  assert.equal(res.stateText, '48 required · 24 balls · 12.0 RRR');
  assert.equal(res.reading.archetype, 'The Compensator');
  assert.equal(res.reading.confidence, 'Reading confidence: LOW — narrative inference, not measurement.');
});

test('recommends Tristan Stubbs in moderate-high RRR chase with Unburdened reading', () => {
  const res = evaluatePressureScenario({
    target: 180,
    score: 120,
    balls: 36,
    wickets: 6,
    situation: 'Chasing',
    phase: 'Middle',
  });
  assert.equal(res.name, 'Tristan Stubbs');
  assert.equal(res.fit, 91);
  assert.equal(res.reading.archetype, 'The Unburdened');
  assert.equal(res.reading.convergence, 'Partly aligned');
});

test('recommends Jamie Overton when defending in the death phase with Enforcer reading', () => {
  const res = evaluatePressureScenario({
    target: 180,
    score: 145,
    balls: 18,
    wickets: 4,
    situation: 'Defending',
    phase: 'Death',
  });
  assert.equal(res.name, 'Jamie Overton');
  assert.equal(res.fit, 95);
  assert.equal(res.reading.archetype, 'The Enforcer');
});

test('recommends Mustafizur Rahman when defending in non-death phases with Contained reading', () => {
  const res = evaluatePressureScenario({
    target: 180,
    score: 95,
    balls: 54,
    wickets: 7,
    situation: 'Defending',
    phase: 'Middle',
  });
  assert.equal(res.name, 'Mustafizur Rahman');
  assert.equal(res.fit, 92);
  assert.equal(res.reading.archetype, 'The Contained');
});

test('recommends Ayush Badoni in low-RRR chase scenario with Chaos-Native reading', () => {
  const res = evaluatePressureScenario({
    target: 160,
    score: 120,
    balls: 36,
    wickets: 7,
    situation: 'Chasing',
    phase: 'Middle',
  });
  assert.equal(res.name, 'Ayush Badoni');
  assert.equal(res.fit, 88);
  assert.equal(res.reading.archetype, 'The Chaos-Native');
});

test('guards non-finite and negative inputs without NaN', () => {
  const res = evaluatePressureScenario({
    target: Number.NaN,
    score: -20,
    balls: 0,
    wickets: 5,
    situation: 'Chasing',
    phase: 'Death',
  });
  assert.ok(!res.stateText.includes('NaN'));
  assert.ok(res.guardNote.length > 0);
  assert.equal(Object.keys(INTERPRETATION_REGISTER).length, 5);
});
