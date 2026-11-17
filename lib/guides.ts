// Downloadable PDF guides. Files live in content/guides/<slug>.pdf (not public):
// they are only reachable through a signed link sent by email.

export const GUIDES: Record<string, { title: string; desc: string; service: string }> = {
  'nacionalidad-espanola': { title: 'Guía 2026: nacionalidad española para venezolanos', desc: 'Todas las vías (origen, opción, residencia, carta de naturaleza), requisitos, documentos y errores frecuentes.', service: 'Nacionalidad española' },
  'italia-2025': { title: 'Guía: ciudadanía italiana tras la reforma de 2025', desc: 'Qué cambió con la Ley 74/2025, quién sigue calificando y qué alternativas existen.', service: 'Nacionalidad italiana' },
  'portugal-2026': { title: 'Guía: nacionalidad portuguesa con la ley de 2026', desc: 'Hijos, nietos y bisnietos de portugueses tras la Lei Orgânica 1/2026.', service: 'Nacionalidad portuguesa' },
  'apostillas': { title: 'Guía: documentos venezolanos y apostillas', desc: 'Qué apostillar, en qué orden y cómo evitar rechazos.', service: 'Aún no lo sé' },
  'becas-2026': { title: 'Guía de becas 2026: España, Portugal e Italia', desc: 'Las principales becas para venezolanos, universidades, plazos y costes reales.', service: 'Becas y estudios' },
  'visados': { title: 'Guía: visados y residencias en Europa', desc: 'Nómada digital, no lucrativa, D7, estudios y arraigo: requisitos y documentos.', service: 'Visados y residencias' },
};

export function guideForService(service = ''): string {
  if (/beca|estudi/i.test(service)) return 'becas-2026';
  if (/ital/i.test(service)) return 'italia-2025';
  if (/portug/i.test(service)) return 'portugal-2026';
  if (/visad|resid|negoc|carib/i.test(service)) return 'visados';
  if (/espa/i.test(service)) return 'nacionalidad-espanola';
  return 'nacionalidad-espanola';
}
