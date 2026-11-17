// Lead qualification. This is the core filter of the site: only leads that are
// viable AND ready to start get pushed to a paid consultation with a lawyer.

export type Timing = 'now' | '3m' | '6m' | 'info' | '';
export type Light = 'verde' | 'ambar' | 'rojo' | '';

export interface LeadSignals {
  light?: Light;
  timing?: Timing;
  source: 'evaluador' | 'contacto' | 'diana' | 'agendar' | 'guia';
  acceptsPaidConsult?: boolean;
}

export interface LeadScore {
  score: number; // 0-100
  tier: 'A' | 'B' | 'C';
  label: string;
  nextAction: 'agendar' | 'expres' | 'nutrir';
}

export function scoreLead(s: LeadSignals): LeadScore {
  let score = 0;
  score += s.light === 'verde' ? 40 : s.light === 'ambar' ? 25 : s.light === 'rojo' ? 5 : 15;
  score += s.timing === 'now' ? 40 : s.timing === '3m' ? 30 : s.timing === '6m' ? 10 : s.timing === 'info' ? 0 : 10;
  if (s.acceptsPaidConsult) score += 20;
  if (s.source === 'agendar') score = 100;
  score = Math.min(100, score);

  if (score >= 70) return { score, tier: 'A', label: 'Listo para consulta', nextAction: 'agendar' };
  if (score >= 40) return { score, tier: 'B', label: 'Interesado, necesita acompañamiento', nextAction: 'expres' };
  return { score, tier: 'C', label: 'Informándose', nextAction: 'nutrir' };
}

export function caseIdFrom(seed: string | number): string {
  const n = typeof seed === 'number' ? seed : Array.from(seed).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return 'TDL-' + String(n % 100000).padStart(5, '0');
}
