// Prices, consultation types and service routing. Edit prices here.

export type ConsultKind = 'written' | 'call';

export const CONSULTS = [
  { id: 'expres', name: 'Consulta exprés por escrito', desc: 'Una pregunta concreta. El abogado responde por escrito en 48 h.', usd: 35, tag: 'PARA DUDAS PUNTUALES', kind: 'written' as ConsultKind },
  { id: 'inicial', name: 'Consulta inicial', desc: '30 minutos por videollamada con el abogado especialista.', usd: 60, tag: 'LA MÁS PEDIDA', kind: 'call' as ConsultKind },
  { id: 'estrategia', name: 'Consulta de estrategia', desc: '60 minutos + informe de viabilidad por escrito.', usd: 120, tag: 'CASOS COMPLEJOS', kind: 'call' as ConsultKind },
  { id: 'revision', name: 'Revisión documental', desc: 'Revisamos hasta 10 documentos y te enviamos un informe.', usd: 150, tag: 'ANTES DE PRESENTAR', kind: 'written' as ConsultKind },
  { id: 'urgente', name: 'Consulta urgente', desc: 'Videollamada el mismo día o el siguiente.', usd: 100, tag: 'PRIORIDAD', kind: 'call' as ConsultKind },
] as const;

export type ConsultId = (typeof CONSULTS)[number]['id'];

// Service areas. Each maps to the Cal.com event types of the lawyer(s) who handle it.
// Set one env var per area and consultation type, e.g. CALCOM_EVENT_ES_INICIAL=123456.
export const AREAS = [
  { id: 'es', label: 'Nacionalidad española' },
  { id: 'it', label: 'Nacionalidad italiana' },
  { id: 'pt', label: 'Nacionalidad portuguesa' },
  { id: 'otras', label: 'Otras nacionalidades' },
  { id: 'visas', label: 'Visados y residencias' },
  { id: 'negocios', label: 'Negocios' },
  { id: 'caribe', label: 'Caribe' },
] as const;

export type AreaId = (typeof AREAS)[number]['id'];

export function calEventTypeId(area: string, consult: string): number | null {
  const key = `CALCOM_EVENT_${area.toUpperCase()}_${consult.toUpperCase()}`;
  const fallback = `CALCOM_EVENT_DEFAULT_${consult.toUpperCase()}`;
  const v = process.env[key] || process.env[fallback];
  return v ? Number(v) : null;
}

export const SERVICE_PRICES: [string, number][] = [
  ['Nacionalidad española por ascendencia u opción', 1200], ['Nacionalidad española por residencia', 900], ['Nacionalidad italiana · vía consular', 1800],
  ['Nacionalidad italiana · vía judicial', 4500], ['Nacionalidad portuguesa', 1500], ['Nacionalidad alemana', 2200], ['Nacionalidad croata', 1800],
  ['Nacionalidad británica', 1600], ['Visa nómada digital (ES/PT)', 1100], ['Residencia no lucrativa o D7', 1000], ['Visa de estudios', 600], ['Te buscamos tu beca', 290], ['Beca: acompañamiento de solicitud', 490], ['Pack beca + admisión', 890],
  ['Arraigo o reagrupación familiar', 800], ['Visa de emprendedor o inversor', 2500], ['Visado Caribe', 250], ['Diagnóstico Estados Unidos', 60], ['ESTA con pasaporte europeo', 49], ['Visa EE. UU. con otro pasaporte', 190],
];

export const TIMING = [
  ['now', 'Ahora mismo'], ['3m', 'En los próximos 3 meses'], ['6m', 'En 6 meses o más'], ['info', 'Solo me estoy informando'],
] as const;

export const SERVICE_OPTIONS = [
  'Nacionalidad española', 'Nacionalidad italiana', 'Nacionalidad portuguesa', 'Nacionalidad alemana', 'Nacionalidad croata',
  'Nacionalidad británica', 'Visados y residencias', 'Visa americana', 'Becas y estudios', 'Visas de negocios', 'Visados Caribe', 'Aún no lo sé',
];

export const COUNTRIES = ['Venezuela', 'España', 'Colombia', 'Panamá', 'Estados Unidos', 'Chile', 'Perú', 'Otro'];
