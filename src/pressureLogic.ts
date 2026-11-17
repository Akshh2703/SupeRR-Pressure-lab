export interface ScenarioInput {
  target: number;
  score: number;
  balls: number;
  wickets: number;
  situation: 'Chasing' | 'Defending';
  phase: 'Death' | 'Middle' | 'Powerplay';
}

export interface RecommendationResult {
  name: string;
  fit: number;
  fitLabel: 'Elite pressure fit' | 'Strong pressure fit' | 'Situational fit';
  role: string;
  why: string;
  chips: string[];
  stateText: string;
}

export function evaluatePressureScenario(input: ScenarioInput): RecommendationResult {
  const { target: t, score: s, balls: b, wickets: w, situation: si, phase: ph } = input;
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

  return { name, fit, fitLabel, role, why, chips, stateText };
}
