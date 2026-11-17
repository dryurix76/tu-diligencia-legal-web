// Long-tail landing pages under each pillar (SEO cluster). Content must be
// reviewed by the legal team before publishing; dates are shown on the page.

export interface Landing {
  parent: string; slug: string; navLabel: string; title: string; description: string;
  h1a: string; h1b: string; lede: string; from: string; reviewed: string; topic: string;
  who: string[]; reqs: string[]; docs: string[]; steps: string[]; faqs: { q: string; a: string }[];
}

export const LANDINGS: Landing[] = [
  {
    parent: 'nacionalidad-espanola', slug: 'nietos-de-espanoles', navLabel: 'Nietos de españoles', topic: 'es',
    title: 'Nacionalidad española para nietos de españoles venezolanos',
    description: 'Si tu abuelo o abuela era español de origen, tienes caminos: opción si tu padre o madre es español de origen, o residencia de solo 1 año en España.',
    h1a: 'Nietos de', h1b: 'españoles', from: 'USD 1.200', reviewed: '2026-11-16',
    lede: 'El plazo general de la Ley de Memoria Democrática terminó en octubre de 2025, pero ser nieto de español sigue abriendo puertas. Te explicamos cuáles y cuál encaja con tu familia.',
    who: ['Nietos cuyo padre o madre ya es español de origen (por ejemplo, porque lo obtuvo por la Ley de Memoria Democrática): pueden explorar la vía de opción.', 'Nietos de abuelo o abuela español de origen que residan legalmente en España: pueden pedir la nacionalidad por residencia con solo 1 año.', 'Quienes presentaron su solicitud por la Ley de Memoria Democrática antes del cierre: el expediente sigue su curso.'],
    reqs: ['Probar la nacionalidad española de origen del abuelo o la abuela (partida de nacimiento española).', 'Probar cada eslabón de la línea familiar con partidas de nacimiento y matrimonio.', 'Según la vía: residencia legal en España, o que tu progenitor sea español de origen.'],
    docs: ['Partida literal de nacimiento del abuelo o la abuela', 'Partida de nacimiento de tu padre o madre', 'Tu partida de nacimiento apostillada', 'Actas de matrimonio de la línea', 'Pasaporte vigente'],
    steps: ['Analizamos la línea y la vía que te corresponde.', 'Buscamos la partida del abuelo en registros civiles o parroquiales de España.', 'Apostillamos y armamos el expediente.', 'Presentamos en el consulado o en línea y seguimos hasta la jura o inscripción.'],
    faqs: [
      { q: '¿Se puede pedir todavía por la Ley de Memoria Democrática?', a: 'El plazo general terminó en octubre de 2025. Si presentaste a tiempo, seguimos tu expediente. Si no, revisamos la opción o la residencia de 1 año.' },
      { q: '¿Qué es la residencia de 1 año para nietos?', a: 'Quien nació fuera de España y tiene un padre, madre, abuelo o abuela originariamente españoles puede pedir la nacionalidad tras 1 año de residencia legal y continuada en España.' },
      { q: '¿Y si mi abuelo se nacionalizó venezolano?', a: 'No impide necesariamente la vía, pero cambia el análisis. Es justo lo que revisamos en la consulta.' },
    ],
  },
  {
    parent: 'nacionalidad-espanola', slug: 'residencia', navLabel: 'Por residencia (2 años)', topic: 'es',
    title: 'Nacionalidad española por residencia para venezolanos: 2 años',
    description: 'Los venezolanos pueden pedir la nacionalidad española con 2 años de residencia legal y continuada (1 año si son hijos o nietos de españoles de origen). Requisitos y documentos.',
    h1a: 'Por residencia,', h1b: 'en 2 años', from: 'USD 900', reviewed: '2026-11-16',
    lede: 'Como nacional de un país iberoamericano, te bastan 2 años de residencia legal en España. Preparamos el expediente para que no lo frene ningún detalle.',
    who: ['Venezolanos con 2 años de residencia legal, continuada e inmediatamente anterior a la solicitud.', 'Hijos o nietos de españoles de origen nacidos fuera de España: 1 año.', 'Cónyuges de españoles que conviven: 1 año de residencia.'],
    reqs: ['Residencia legal y continuada (los periodos de estancia por estudios pueden no contar igual).', 'Buena conducta cívica y ausencia de antecedentes penales.', 'Examen CCSE de conocimientos de España. El DELE no se exige a venezolanos.', 'Pago de la tasa oficial y presentación, normalmente telemática.'],
    docs: ['TIE y certificado de residencia', 'Partida de nacimiento apostillada', 'Antecedentes penales de Venezuela y de España', 'Certificado de empadronamiento', 'Diploma CCSE'],
    steps: ['Comprobamos que tu tiempo de residencia cuenta.', 'Te guiamos con el CCSE y los antecedentes.', 'Armamos y presentamos el expediente.', 'Seguimos el estado hasta la resolución y la jura.'],
    faqs: [
      { q: '¿Pierdo la nacionalidad venezolana?', a: 'No. Como nacional de un país iberoamericano no tienes que renunciar a ella al obtener la española.' },
      { q: '¿Cuenta el tiempo con visado de estudios?', a: 'Depende del caso y del tipo de autorización. Lo revisamos antes de presentar para evitar una denegación.' },
      { q: '¿Qué pasa si tardan en resolver?', a: 'Si pasa el plazo legal sin respuesta, se puede recurrir. Te acompañamos también en esa fase.' },
    ],
  },
  {
    parent: 'nacionalidad-espanola', slug: 'opcion', navLabel: 'Por opción', topic: 'es',
    title: 'Nacionalidad española por opción: quién puede optar',
    description: 'Hijos de padre o madre español de origen nacido en España y personas bajo patria potestad de un español pueden optar a la nacionalidad. Requisitos y plazos.',
    h1a: 'Nacionalidad', h1b: 'por opción', from: 'USD 1.200', reviewed: '2026-11-16',
    lede: 'La opción es un derecho, no una concesión: si cumples los requisitos, no depende de la residencia. Comprobamos si te corresponde y en qué plazo.',
    who: ['Personas cuyo padre o madre fue originariamente español y nacido en España.', 'Personas que estén o hayan estado bajo la patria potestad de un español.', 'Otros supuestos específicos que revisamos caso a caso.'],
    reqs: ['Probar la nacionalidad española del progenitor y su nacimiento en España, según el supuesto.', 'Presentar la declaración dentro del plazo que corresponda (en algunos supuestos hay límite de edad).', 'Inscripción en el Registro Civil consular o central.'],
    docs: ['Partida literal de nacimiento del progenitor español', 'Tu partida de nacimiento apostillada', 'Pasaporte vigente', 'Documentos de la patria potestad, si aplica'],
    steps: ['Revisamos el supuesto y el plazo.', 'Obtenemos las partidas españolas.', 'Preparamos la declaración de opción.', 'Gestionamos la inscripción y el pasaporte.'],
    faqs: [
      { q: '¿Tiene plazo la opción?', a: 'Depende del supuesto. En la opción por patria potestad hay límite de edad; en la de progenitor español nacido en España, no. Lo confirmamos en tu caso.' },
      { q: '¿Necesito vivir en España?', a: 'No. La opción se tramita también desde el consulado español del país donde vives.' },
    ],
  },
  {
    parent: 'nacionalidad-espanola', slug: 'recurso-denegacion', navLabel: 'Recurso si te la denegaron', topic: 'es',
    title: 'Me denegaron la nacionalidad española: recurso y plazos',
    description: 'Si te denegaron la nacionalidad española o no responden, hay recurso de reposición (1 mes) o contencioso-administrativo (2 meses). Te decimos qué conviene.',
    h1a: '¿Te la', h1b: 'denegaron?', from: 'USD 800', reviewed: '2026-11-16',
    lede: 'Una denegación no siempre es el final. Analizamos la resolución, el motivo y los plazos para elegir entre recurso de reposición, contencioso o una nueva solicitud.',
    who: ['Quien recibió una resolución denegatoria de nacionalidad.', 'Quien lleva más del plazo legal sin respuesta (silencio administrativo).', 'Quien quiere saber si es mejor recurrir o volver a presentar.'],
    reqs: ['Actuar dentro de plazo: recurso de reposición en 1 mes o contencioso-administrativo en 2 meses desde la notificación.', 'Identificar el motivo exacto de la denegación.', 'Aportar las pruebas que faltaban o corregir el error.'],
    docs: ['Resolución denegatoria y fecha de notificación', 'Copia del expediente presentado', 'Pruebas nuevas, si las hay'],
    steps: ['Revisamos la resolución en 48 h.', 'Te decimos qué vía conviene y su coste.', 'Redactamos y presentamos el recurso.', 'Seguimos el procedimiento hasta la resolución.'],
    faqs: [
      { q: '¿Cuánto tiempo tengo para recurrir?', a: 'En general, 1 mes para el recurso de reposición y 2 meses para el contencioso-administrativo, contados desde la notificación.' },
      { q: '¿Vale más la pena volver a solicitar?', a: 'A veces sí, sobre todo si el error se corrige fácil. Lo comparamos contigo en la consulta.' },
    ],
  },
];

export const getLanding = (parent: string, slug: string) => LANDINGS.find((l) => l.parent === parent && l.slug === slug);
