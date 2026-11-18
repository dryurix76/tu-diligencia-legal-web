// Detalle de los heroes de servicio: código fantasma, expediente y cuatro datos clave.
// Solo datos que ya sostiene el contenido del sitio (services.json, blog y evaluadores).
export interface HeroFacts { code: string; file: string; caption: string; facts: [string, string, string?][] }

export const HERO_FACTS: Record<string, HeroFacts> = {
  'nacionalidad-espanola': {
    code: 'ES', file: 'ES-001', caption: 'Partida, pasaje y pasaporte',
    facts: [['Vías', '4', 'origen, residencia, opción y carta'], ['Residencia exigida', '2 años', 'iberoamericanos'], ['Examen (residencia)', 'CCSE', 'venezolanos, exentos del DELE'], ['Servicio completo', 'USD 900', 'en 2 o 3 cuotas']],
  },
  'nacionalidad-italiana': {
    code: 'IT', file: 'IT-002', caption: 'Cartas, comune y pasaporte',
    facts: [['Norma vigente', 'Ley 74/2025', 'reforma de la ciudadanía'], ['Generaciones', 'Padre o abuelo', 'con solo ciudadanía italiana'], ['Tasa consular', '€600', 'por solicitante'], ['Vías', 'Consular', 'o judicial (pre-1948)']],
  },
  'nacionalidad-portuguesa': {
    code: 'PT', file: 'PT-003', caption: 'Azulejo, Funchal y pasaporte',
    facts: [['Hijos', 'Atribución', 'directa por padre o madre'], ['Nietos', 'Vínculo', 'con la comunidad portuguesa'], ['Registro', 'Transcripción', 'de actas venezolanas'], ['Servicio completo', 'USD 1.500', 'en 2 o 3 cuotas']],
  },
  'nacionalidad-alemana': {
    code: 'DE', file: 'DE-004', caption: 'Archivo, sello y pasaporte',
    facts: [['Doble nacionalidad', 'Desde 2024', 'sin renunciar a la venezolana'], ['Declaración', '§5 StAG', 'p. ej. madre alemana antes de 1975'], ['Restitución', 'Art. 116', 'perseguidos 1933–1945'], ['Servicio completo', 'USD 2.200', 'en 2 o 3 cuotas']],
  },
  'nacionalidad-croata': {
    code: 'HR', file: 'HR-005', caption: 'Registro, Adriático y pasaporte',
    facts: [['Vía principal', 'Origen', 'descendientes de emigrantes'], ['Hijos', 'Inscripción', 'por nacimiento'], ['Archivos', 'Parroquias', 'y registros de origen'], ['Servicio completo', 'USD 1.800', 'en 2 o 3 cuotas']],
  },
  'nacionalidad-britanica': {
    code: 'UK', file: 'UK-006', caption: 'Partida, correo aéreo y pasaporte',
    facts: [['Por descendencia', 'Directa', 'hijos de británicos'], ['Registro', 'Antes de 1983', 'hijos de madre británica'], ['Resultado', 'Pasaporte', 'británico'], ['Servicio completo', 'USD 1.600', 'en 2 o 3 cuotas']],
  },
  visados: {
    code: 'Visa', file: 'VS-010', caption: 'Residencias en España y Portugal',
    facts: [['Más pedida', 'Nómada digital', 'España y Portugal (D8)'], ['Sin trabajar', 'No lucrativa', 'y D7 en Portugal'], ['Estudios', 'Con beca', 'España, Portugal, Italia'], ['Desde', 'USD 600', 'precio cerrado']],
  },
  negocios: {
    code: 'Neg', file: 'NG-020', caption: 'Plan, sociedad y residencia',
    facts: [['Emprendedor', 'España', 'plan de negocio'], ['Inversor', 'D2', 'en Portugal'], ['Apoyo', 'Certia Group', 'estructura societaria'], ['Desde', 'USD 350', 'precio cerrado']],
  },
  caribe: {
    code: 'Mar', file: 'CB-030', caption: 'Destinos cerca de casa',
    facts: [['Destinos', 'RD, Panamá', 'Aruba, Curazao y más'], ['Tipos', 'Turismo', 'negocios y residencia'], ['Requisitos', 'Verificados', 'antes de cada solicitud'], ['Desde', 'USD 250', 'precio cerrado']],
  },
};
