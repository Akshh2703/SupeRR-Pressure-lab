export interface ScenarioInput {
  target: number;
  score: number;
  balls: number;
  wickets: number;
  situation: 'Chasing' | 'Defending';
  phase: 'Death' | 'Middle' | 'Powerplay';
}

export type ConvergenceState = 'Aligned' | 'Partly aligned' | 'In tension';

export interface PlayerReading {
  archetype: string;
  motif: string;
  confidence: string;
  convergence: ConvergenceState;
  convergenceLeftPct: number;
  convergenceRightPct: number;
  conflictNote: string;
  mindChange: string;
}

export interface RecommendationResult {
  name: string;
  fit: number;
  fitLabel: 'Elite pressure fit' | 'Strong pressure fit' | 'Situational fit';
  role: string;
  why: string;
  chips: string[];
  stateText: string;
  guardNote: string;
  reading: PlayerReading;
}

export const INTERPRETATION_REGISTER: Record<string, PlayerReading> = {
  'Rinku Singh': {
    archetype: 'The Compensator',
    motif: 'Carries the death overs as if repaying an old debt — the burden is where he feels most himself.',
    confidence: 'Reading confidence: LOW — narrative inference, not measurement.',
    convergence: 'Aligned',
    convergenceLeftPct: 50,
    convergenceRightPct: 50,
    conflictNote: 'Both lenses converge in steep chases (+0.301 chase lift), though defending states (−0.088) break the debt-repayment pattern.',
    mindChange: 'A multi-season drop in high-RRR boundary percentage or a shift to first-innings setting where the deficit cue disappears.',
  },
  'Tristan Stubbs': {
    archetype: 'The Unburdened',
    motif: 'No scar tissue yet; freedom under pressure, but untested when failure repeats.',
    confidence: 'Reading confidence: LOW — narrative inference, not measurement.',
    convergence: 'Partly aligned',
    convergenceLeftPct: 58,
    convergenceRightPct: 42,
    conflictNote: 'Numbers show elite chase lift (+0.317), while the interpretive lens flags shorter multi-season exposure to repeated collapse.',
    mindChange: 'Sustained positive lift across two more high-pressure tournament cycles after early-innings top-order collapses.',
  },
  'Jamie Overton': {
    archetype: 'The Enforcer',
    motif: 'Aggression as armour — control through confrontation rather than containment.',
    confidence: 'Reading confidence: LOW — narrative inference, not measurement.',
    convergence: 'Partly aligned',
    convergenceLeftPct: 56,
    convergenceRightPct: 44,
    conflictNote: 'Death-phase lift (+0.441) is elite, but medium sample depth means hard-length confrontation can leak runs on flat surfaces.',
    mindChange: 'Two consecutive death spells where batters successfully target his hard-length armour on low-bounce wickets.',
  },
  'Ayush Badoni': {
    archetype: 'The Chaos-Native',
    motif: 'Settles when the situation is least settled; comfort found in extremity.',
    confidence: 'Reading confidence: LOW — narrative inference, not measurement.',
    convergence: 'Aligned',
    convergenceLeftPct: 50,
    convergenceRightPct: 50,
    conflictNote: 'Top overall reliability (86.6) and extreme-band lift (+0.290) align directly with his calm response in broken middle-to-death states.',
    mindChange: 'Evidence of strike-rate stagnation when entering before the 60–70 pressure threshold is reached.',
  },
  'Mustafizur Rahman': {
    archetype: 'The Contained',
    motif: 'Emotion held deliberately flat; pressure absorbed rather than expressed.',
    confidence: 'Reading confidence: LOW — narrative inference, not measurement.',
    convergence: 'Aligned',
    convergenceLeftPct: 50,
    convergenceRightPct: 50,
    conflictNote: 'Strong defending (+0.356) and death (+0.367) lift match his repeatable, low-variance cutter execution under scoreboard squeeze.',
    mindChange: 'Dew-heavy conditions or flat tracks that neutralise off-pace grip and force pace-on adjustments.',
  },
};

export function sanitizeNumber(val: unknown): { value: number; clamped: boolean } {
  const num = typeof val === 'number' ? val : Number(val);
  if (!Number.isFinite(num) || num < 0) {
    return { value: 0, clamped: true };
  }
  return { value: num, clamped: false };
}

export function evaluatePressureScenario(input: ScenarioInput): RecommendationResult {
  const tSan = sanitizeNumber(input.target);
  const sSan = sanitizeNumber(input.score);
  const bSan = sanitizeNumber(input.balls);
  const wSan = sanitizeNumber(input.wickets);

  const t = tSan.value;
  const s = sSan.value;
  const b = bSan.value;
  const w = Math.min(wSan.value, 10);
  const si = input.situation === 'Defending' ? 'Defending' : 'Chasing';
  const ph = input.phase === 'Middle' || input.phase === 'Powerplay' ? input.phase : 'Death';

  const hadNonFinite = tSan.clamped || sSan.clamped || bSan.clamped || wSan.clamped;
  const guardNote = hadNonFinite
    ? 'Non-finite or negative input was clamped to 0 to keep the pressure calculation valid.'
    : '';

  const need = Math.max(t - s, 0);
  const rr = (need / Math.max(b, 1)) * 6;

  let name = 'Rinku Singh';
  let fit = 78;
  let role = 'Scenario pressure specialist';
  let why = 'The state is balanced; the recommendation uses the strongest matching pressure profile.';
  let chips = ['Scenario fit', 'Evidence · strong'];

  if (si === 'Chasing' && rr >= 12 && ph === 'Death') {
    name = 'Rinku Singh';
    fit = 94;
    role = 'Chase · High-RRR · Death specialist';
    why = "The scenario is chase-heavy and late. Rinku's strongest pressure profile is in chase and high-required-run-rate situations, with a death-phase lift.";
    chips = ['Chase +0.301', 'High RRR +0.318', 'Evidence · strong'];
  } else if (si === 'Chasing' && rr >= 9) {
    name = 'Tristan Stubbs';
    fit = 91;
    role = 'Chase · High-RRR · Middle / Death';
    why = 'A high required rate makes chase pressure dominant; Stubbs shows a strong chase and high-RRR pressure profile.';
    chips = ['Chase +0.317', 'High RRR +0.324', 'Evidence · strong'];
  } else if (si === 'Defending' && ph === 'Death') {
    name = 'Jamie Overton';
    fit = 95;
    role = 'Death · Defending-pressure bowler';
    why = "Late defending pressure maps directly to Overton's strongest profile: death and defending situations.";
    chips = ['Death +0.441', 'Defend +0.319', 'Evidence · medium'];
  } else if (si === 'Defending') {
    name = 'Mustafizur Rahman';
    fit = 92;
    role = 'Defending · Death-pressure bowler';
    why = 'Defending pressure is a core strength in the model, making Mustafizur a strong trust option.';
    chips = ['Death +0.367', 'Defend +0.356', 'Evidence · strong'];
  } else {
    name = 'Ayush Badoni';
    fit = 88;
    role = 'Pressure finisher';
    why = "The scenario is a chase, and Badoni's overall pressure reliability and extreme-pressure profile make him a strong option.";
    chips = ['Overall +0.198', 'Extreme +0.290', 'Evidence · medium'];
  }

  const fitLabel = fit >= 92 ? 'Elite pressure fit' : fit >= 85 ? 'Strong pressure fit' : 'Situational fit';
  const stateText =
    si === 'Chasing'
      ? `${need} required · ${b} balls · ${rr.toFixed(1)} RRR`
      : `Defending · ${b} balls · ${w} wickets left`;

  const reading = INTERPRETATION_REGISTER[name] || INTERPRETATION_REGISTER['Rinku Singh'];

  return { name, fit, fitLabel, role, why, chips, stateText, guardNote, reading };
}
