import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePressureScenario } from './pressureLogic';

test('recommends Rinku Singh in high-RRR death chase (48 needed off 24 balls)', () => {
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
});

test('recommends Tristan Stubbs in moderate-high RRR chase (RRR >= 9, Middle phase)', () => {
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
  assert.equal(res.fitLabel, 'Strong pressure fit');
});

test('recommends Jamie Overton when defending in the death phase', () => {
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
  assert.equal(res.fitLabel, 'Elite pressure fit');
  assert.equal(res.stateText, 'Defending · 18 balls · 4 wickets left');
});

test('recommends Mustafizur Rahman when defending in non-death phases', () => {
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
});

test('recommends Ayush Badoni in low-RRR chase scenario', () => {
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
  assert.equal(res.fitLabel, 'Strong pressure fit');
});
