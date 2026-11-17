// Decision trees for the pre-evaluation. Each answer leads to another question
// or to a result with: traffic light, probable route, confidence, legal basis and
// what a lawyer must still confirm. Reviewed against the rules in force in
// November 2026; the legal team must re-check them every six months.

export type Light = 'verde' | 'ambar' | 'rojo';
export type Confidence = 'Alta' | 'Media' | 'Baja';

export interface Opt { label: string; next?: string; result?: string }
export interface Node { id: string; text: string; help?: string; opts: Opt[] }
export interface Result {
  light: Light; title: string; route: string; confidence: Confidence; body: string; basis: string;
  pending: string[]; consult: 'inicial' | 'estrategia' | 'expres' | 'revision'; alt?: [string, string]; source?: [string, string];
}
export interface Tree { start: string; nodes: Record<string, Node>; results: Record<string, Result> }

const n = (id: string, text: string, opts: Opt[], help?: string): Node => ({ id, text, opts, help });

// ---------------------------------------------------------------- ESPAÑA
const ES: Tree = {
  start: 'q1',
  nodes: Object.fromEntries([
    n('q1', '¿Qué describe mejor tu situación?', [
      { label: 'Mi padre o mi madre es o era español/a', next: 'p_when' },
      { label: 'Mi abuelo o mi abuela era español/a', next: 'g_lmd' },
      { label: 'Mi bisabuelo o bisabuela era español/a', next: 'b_chain' },
      { label: 'Estoy casado/a con un español o española', next: 's_res' },
      { label: 'No tengo familia española, pero vivo legalmente en España', next: 'r_years' },
      { label: 'No tengo familia española ni vivo en España', result: 'visas' },
    ]),
    n('p_when', '¿Tu padre o madre ya tenía la nacionalidad española cuando tú naciste?', [
      { label: 'Sí, ya era español/a', result: 'origen' },
      { label: 'No, la obtuvo después', next: 'p_born' },
      { label: 'No lo sé', next: 'p_born' },
    ], 'Si ya lo era, la nacionalidad se transmite por nacimiento aunque nacieras en Venezuela.'),
    n('p_born', '¿Tu padre o madre español/a nació en España?', [
      { label: 'Sí, nació en España', result: 'opcion_b' },
      { label: 'No, nació fuera de España', next: 'p_minor' },
    ]),
    n('p_minor', 'Cuando tu padre o madre obtuvo la nacionalidad, ¿tú eras menor de edad?', [
      { label: 'Sí, y hoy tengo menos de 20 años', result: 'opcion_a' },
      { label: 'Sí, pero hoy tengo 20 años o más', result: 'res1' },
      { label: 'No, yo ya era mayor de edad', result: 'res1' },
      { label: 'No lo sé', result: 'estrategia' },
    ]),
    n('g_lmd', '¿Presentaste tu solicitud por la Ley de Memoria Democrática antes de que cerrara en octubre de 2025?', [
      { label: 'Sí, la presenté a tiempo', result: 'lmd' },
      { label: 'No', next: 'g_chain' },
    ]),
    n('g_chain', '¿Tu abuelo o abuela seguía siendo español/a cuando nació tu padre o madre? (es decir, no se había nacionalizado venezolano antes)', [
      { label: 'Sí, seguía siendo español/a', next: 'g_parent' },
      { label: 'No, se nacionalizó antes', result: 'res1' },
      { label: 'No lo sé', result: 'res1_check' },
    ]),
    n('g_parent', '¿Tu padre o madre ha tramitado o ya tiene la nacionalidad española?', [
      { label: 'Sí, ya es español/a', next: 'p_minor' },
      { label: 'No, nunca la ha tramitado', result: 'cadena' },
    ]),
    n('b_chain', '¿Sabes si tu bisabuelo, tu abuelo y tu padre o madre conservaron la nacionalidad española en cada generación?', [
      { label: 'Creo que sí, nadie se nacionalizó antes de tener hijos', result: 'cadena' },
      { label: 'No, alguien se nacionalizó venezolano', result: 'bis_res' },
      { label: 'No lo sé', result: 'bis_res' },
    ]),
    n('s_res', '¿Vivís en España con residencia legal y lleváis al menos 1 año casados?', [
      { label: 'Sí, 1 año casados y 1 año de residencia legal en España', result: 'matrimonio' },
      { label: 'Estamos casados, pero vivimos fuera de España', result: 'matrimonio_fuera' },
      { label: 'Todavía no cumplimos el año', result: 'matrimonio_fuera' },
    ]),
    n('r_years', '¿Cuánto tiempo llevas con residencia legal en España?', [
      { label: 'Menos de 1 año', result: 'res_wait' },
      { label: 'Entre 1 y 2 años', result: 'res_wait' },
      { label: '2 años o más', next: 'r_type' },
    ], 'Cuenta la residencia legal, continuada e inmediatamente anterior a la solicitud.'),
    n('r_type', '¿Durante ese tiempo tuviste estancia o autorización por estudios?', [
      { label: 'No, residencia por trabajo, familia, arraigo u otra', result: 'res2' },
      { label: 'Sí, parte o todo el tiempo fue por estudios', result: 'res2_estudios' },
    ]),
  ].map((x) => [x.id, x])),
  results: {
    origen: { light: 'verde', title: 'Probablemente ya eres español de origen.', route: 'Inscripción de nacimiento en el Registro Civil consular', confidence: 'Alta', body: 'Si tu padre o madre era español cuando naciste, la nacionalidad española se transmite por filiación aunque hayas nacido fuera. No hay que pedirla: hay que inscribir tu nacimiento.', basis: 'Código Civil, art. 17.1.a (son españoles de origen los nacidos de padre o madre españoles).', pending: ['Que tu progenitor no hubiera perdido la nacionalidad antes de tu nacimiento.', 'Si tienes 18 años o más y vives fuera: si se aplicó la pérdida por no declarar la conservación (art. 24.3).'], consult: 'inicial', source: ['Código Civil (BOE)', 'https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763'] },
    opcion_b: { light: 'verde', title: 'Tu perfil encaja con la nacionalidad por opción.', route: 'Opción (padre o madre español de origen nacido en España)', confidence: 'Alta', body: 'Quien tiene un padre o una madre originariamente español y nacido en España puede optar a la nacionalidad sin límite de edad ni requisito de residencia.', basis: 'Código Civil, art. 20.1.b.', pending: ['Partida literal de nacimiento española del progenitor.', 'Que tu progenitor fuera español de origen (no por residencia).'], consult: 'inicial', source: ['Código Civil (BOE)', 'https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763'] },
    opcion_a: { light: 'verde', title: 'Puedes optar por patria potestad, pero con plazo.', route: 'Opción por haber estado bajo la patria potestad de un español', confidence: 'Alta', body: 'Quien estuvo bajo la patria potestad de un español puede optar hasta cumplir 20 años (o en los 2 años siguientes a la emancipación, según la ley personal). Es urgente: el plazo se pierde con la edad.', basis: 'Código Civil, arts. 20.1.a y 20.2.c.', pending: ['Fecha exacta en que tu progenitor adquirió la nacionalidad.', 'Tu edad y fecha de emancipación.'], consult: 'inicial' },
    res1: { light: 'ambar', title: 'Tu camino más claro es la residencia de solo 1 año.', route: 'Nacionalidad por residencia con 1 año (descendiente de español de origen)', confidence: 'Media', body: 'Quien nació fuera de España de padre, madre, abuelo o abuela originariamente españoles puede pedir la nacionalidad con 1 año de residencia legal en España. Primero necesitas una residencia legal (por ejemplo, un visado de estudios, de nómada digital o de familiar).', basis: 'Código Civil, art. 22.2.f.', pending: ['Probar que tu abuelo/a o progenitor era español de origen (partida española).', 'Elegir el visado para residir en España.', 'Revisar si existe alguna vía de opción que evite la residencia.'], consult: 'estrategia', alt: ['Ver visados para residir en España', '/visados'] },
    res1_check: { light: 'ambar', title: 'Hay un camino, pero hay que revisar tu línea familiar.', route: 'Residencia de 1 año o transmisión por filiación', confidence: 'Baja', body: 'Si tu abuelo/a no se nacionalizó antes de tener a tu padre o madre, la nacionalidad pudo transmitirse por nacimiento. Si se nacionalizó, el camino es la residencia de 1 año en España. Hay que mirar las fechas en los documentos.', basis: 'Código Civil, arts. 17.1.a, 24 y 22.2.f.', pending: ['Fecha de naturalización venezolana del abuelo/a (si la hubo).', 'Fecha de nacimiento de tu padre o madre.', 'Partida española del abuelo/a.'], consult: 'estrategia' },
    cadena: { light: 'ambar', title: 'Es posible que tu familia ya sea española sin saberlo.', route: 'Transmisión de la nacionalidad de origen por filiación (generación a generación)', confidence: 'Media', body: 'Si ningún eslabón perdió la nacionalidad (por naturalizarse antes de tener hijos o por no declarar su conservación), cada generación nació española. Se empieza inscribiendo a la primera generación nacida fuera y luego a las siguientes.', basis: 'Código Civil, arts. 17.1.a y 24 (pérdida); normativa histórica aplicable a cada fecha.', pending: ['Fechas de naturalización de cada generación.', 'Si alguien perdió la nacionalidad por no declarar su conservación (art. 24.3).', 'Partidas de toda la línea.'], consult: 'estrategia' },
    lmd: { light: 'verde', title: 'Tu expediente de Memoria Democrática sigue vigente.', route: 'Seguimiento de solicitud por la Ley 20/2022 (disposición adicional 8.ª)', confidence: 'Alta', body: 'Las solicitudes presentadas dentro del plazo se resuelven aunque el plazo ya haya cerrado. Podemos revisar el estado, subsanar requerimientos y preparar la inscripción.', basis: 'Ley 20/2022 de Memoria Democrática, DA 8.ª (plazo cerrado en octubre de 2025).', pending: ['Justificante de presentación y número de expediente.', 'Requerimientos pendientes del consulado.'], consult: 'revision' },
    bis_res: { light: 'ambar', title: 'Por bisabuelo no hay una vía directa: hay alternativas.', route: 'Residencia en España (2 años como iberoamericano) o revisión de la cadena familiar', confidence: 'Media', body: 'El bisabuelo por sí solo no da derecho a opción ni a la residencia de 1 año. Si la nacionalidad se rompió en alguna generación, el camino es residir legalmente en España 2 años. Si no se rompió, podría haber transmisión de origen.', basis: 'Código Civil, arts. 17, 20, 22.1 y 22.2.f.', pending: ['Revisar si algún eslabón conservó la nacionalidad.', 'Elegir visado para residir en España.'], consult: 'estrategia', alt: ['Ver visados', '/visados'] },
    matrimonio: { light: 'verde', title: 'Tu perfil encaja con la nacionalidad por matrimonio.', route: 'Residencia de 1 año casado/a con español/a', confidence: 'Alta', body: 'El cónyuge de un español que lleva 1 año casado, sin separación, y 1 año de residencia legal en España puede pedir la nacionalidad.', basis: 'Código Civil, art. 22.2.d.', pending: ['Inscripción del matrimonio en el Registro Civil español.', 'Examen CCSE y antecedentes penales.'], consult: 'inicial' },
    matrimonio_fuera: { light: 'ambar', title: 'El matrimonio ayuda, pero hace falta residir en España.', route: 'Tarjeta de familiar de ciudadano español y después nacionalidad con 1 año', confidence: 'Media', body: 'Casarse con un español no da la nacionalidad desde el extranjero. Primero se obtiene la residencia como familiar y, con 1 año de residencia legal y de matrimonio, se puede solicitar.', basis: 'Código Civil, art. 22.2.d; normativa de familiares de ciudadanos españoles.', pending: ['Inscripción del matrimonio en España.', 'Solicitud de residencia como familiar.'], consult: 'inicial' },
    res_wait: { light: 'ambar', title: 'Vas en camino: te falta tiempo de residencia.', route: 'Nacionalidad por residencia (2 años para venezolanos)', confidence: 'Alta', body: 'Los nacionales de países iberoamericanos pueden pedir la nacionalidad con 2 años de residencia legal y continuada. Si tienes padre, madre, abuelo o abuela españoles de origen, basta 1 año. Conviene preparar desde ya el CCSE y los antecedentes.', basis: 'Código Civil, arts. 22.1 y 22.2.f.', pending: ['Fecha de tu primera autorización de residencia.', 'Si tienes ascendencia española (reduce a 1 año).'], consult: 'expres' },
    res2: { light: 'verde', title: 'Tu perfil encaja con la nacionalidad por residencia.', route: 'Residencia de 2 años (nacional iberoamericano)', confidence: 'Alta', body: 'Con 2 años de residencia legal, continuada e inmediatamente anterior, buena conducta e integración (examen CCSE), puedes solicitarla. Como venezolano estás exento del DELE y no tienes que renunciar a tu nacionalidad.', basis: 'Código Civil, arts. 21, 22.1 y 23.b.', pending: ['Que no haya interrupciones ni salidas largas de España.', 'Antecedentes penales de Venezuela y España.', 'Diploma CCSE.'], consult: 'inicial' },
    res2_estudios: { light: 'ambar', title: 'Hay que revisar si tu tiempo como estudiante cuenta.', route: 'Residencia de 2 años: cómputo del periodo de estudios', confidence: 'Media', body: 'El tiempo con estancia o autorización por estudios ha generado dudas sobre si computa como residencia legal para la nacionalidad, y las reformas recientes del reglamento de extranjería han cambiado el régimen. Lo revisamos antes de presentar para evitar una denegación.', basis: 'Código Civil, art. 22.3; Reglamento de Extranjería vigente.', pending: ['Tipo de autorización de cada periodo.', 'Fechas de modificación a residencia.'], consult: 'estrategia' },
    estrategia: { light: 'ambar', title: 'Tu caso tiene varias vías posibles.', route: 'Diagnóstico de vía (opción, residencia u origen)', confidence: 'Baja', body: 'Las fechas exactas de nacionalidad de tus padres y tu edad deciden la vía. Con los documentos delante, un abogado lo resuelve en una consulta.', basis: 'Código Civil, arts. 17, 20 y 22.', pending: ['Fecha de adquisición de la nacionalidad de tu progenitor.', 'Tu fecha de nacimiento.'], consult: 'estrategia' },
    visas: { light: 'rojo', title: 'La nacionalidad no es tu primer paso.', route: 'Visado de residencia → nacionalidad en 2 años', confidence: 'Alta', body: 'Sin ascendencia española ni residencia, hoy no hay vía de nacionalidad. Pero con un visado (nómada digital, no lucrativa, estudios o trabajo) empiezas a sumar residencia: como venezolano, en 2 años puedes pedir la nacionalidad.', basis: 'Código Civil, art. 22.1.', pending: ['Elegir el visado según tus ingresos y plan.'], consult: 'expres', alt: ['Ver visados y residencias', '/visados'] },
  },
};

// ---------------------------------------------------------------- ITALIA
const IT: Tree = {
  start: 'q1',
  nodes: Object.fromEntries([
    n('q1', '¿Iniciaste el reconocimiento antes del 27 de marzo de 2025 (cita consular comunicada, solicitud en un comune o demanda judicial)?', [
      { label: 'Sí', result: 'pre2025' },
      { label: 'No', next: 'q2' },
      { label: 'No lo sé', next: 'q2' },
    ], 'Los trámites iniciados hasta las 23:59 (hora de Roma) del 27/03/2025 siguen las reglas anteriores.'),
    n('q2', '¿Quién de tu familia nació en Italia?', [
      { label: 'Mi padre o mi madre', next: 'q3' },
      { label: 'Mi abuelo o mi abuela', next: 'q3' },
      { label: 'Mi bisabuelo o un antepasado anterior', next: 'q_bis' },
      { label: 'Nadie / no lo sé', result: 'nadie' },
    ]),
    n('q3', '¿Esa persona se naturalizó venezolana (u otra) antes de que naciera su hijo/a de tu línea?', [
      { label: 'No', next: 'q4' },
      { label: 'Sí', result: 'rota' },
      { label: 'No lo sé', next: 'q4' },
    ], 'Antes de 1992, adquirir otra nacionalidad voluntariamente hacía perder la italiana.'),
    n('q4', '¿La línea pasa por una mujer que tuvo a su hijo/a antes del 1 de enero de 1948?', [
      { label: 'No', result: 'ok' },
      { label: 'Sí', result: 'judicial' },
      { label: 'No lo sé', result: 'ok_check' },
    ]),
    n('q_bis', '¿Tu padre, madre, abuelo o abuela fue reconocido como ciudadano italiano por nacimiento (aunque naciera fuera de Italia)?', [
      { label: 'Sí', result: 'natur2' },
      { label: 'No / no lo sé', result: 'bis' },
    ]),
  ].map((x) => [x.id, x])),
  results: {
    pre2025: { light: 'verde', title: 'Tu trámite sigue las reglas anteriores a la reforma.', route: 'Reconocimiento iure sanguinis con normativa previa', confidence: 'Alta', body: 'La Ley 74/2025 salva a quienes ya tenían cita comunicada, solicitud presentada o demanda judicial a 27 de marzo de 2025. Seguimos tu expediente con las reglas anteriores.', basis: 'Ley 91/1992, art. 3-bis, introducido por la Ley 74/2025 (en vigor desde el 24/05/2025).', pending: ['Prueba de la fecha de solicitud, cita o demanda.'], consult: 'revision', source: ['Cámara de Diputados de Italia', 'https://temi.camera.it/leg19/temi/d-l-36-2025-disposizioni-urgenti-in-materia-di-cittadinanza.html'] },
    ok: { light: 'verde', title: 'Tu línea encaja con la excepción de la nueva ley.', route: 'Reconocimiento con ascendiente de 1.º o 2.º grado nacido en Italia', confidence: 'Media', body: 'Desde 2025, quien nació fuera y tiene otra nacionalidad solo es italiano automáticamente si cumple una excepción, como tener un padre, madre, abuelo o abuela nacido en Italia. Tu caso parece encajar.', basis: 'Ley 91/1992, art. 3-bis (Ley 74/2025).', pending: ['Acta de nacimiento italiana del ascendiente.', 'Constancia de no naturalización (o su fecha) de cada generación.', 'Criterio vigente del consulado competente.'], consult: 'inicial', source: ['Cámara de Diputados de Italia', 'https://temi.camera.it/leg19/temi/d-l-36-2025-disposizioni-urgenti-in-materia-di-cittadinanza.html'] },
    ok_check: { light: 'ambar', title: 'Probablemente viable, pero falta revisar la línea materna.', route: 'Vía consular o judicial según la línea', confidence: 'Media', body: 'Tienes un ascendiente cercano nacido en Italia. Si la línea pasa por una mujer con hijos antes de 1948, la vía suele ser judicial.', basis: 'Ley 91/1992, art. 3-bis; jurisprudencia sobre transmisión por vía materna anterior a 1948.', pending: ['Fechas de nacimiento de cada generación.'], consult: 'estrategia' },
    judicial: { light: 'ambar', title: 'Tu caso apunta a la vía judicial.', route: 'Demanda ante tribunal italiano (línea materna anterior a 1948)', confidence: 'Media', body: 'Los consulados no reconocen la transmisión por madre de hijos nacidos antes de 1948; los tribunales italianos sí lo han hecho. Además, tu caso debe encajar en las excepciones de la Ley 74/2025.', basis: 'Constitución italiana arts. 3 y 29; Corte de Casación (2009); Ley 91/1992, art. 3-bis.', pending: ['Viabilidad tras la reforma de 2025.', 'Coste y plazos del tribunal competente.'], consult: 'estrategia' },
    rota: { light: 'rojo', title: 'La línea parece interrumpida.', route: 'Revisión de alternativas', confidence: 'Media', body: 'Si tu antepasado se naturalizó antes de que naciera su hijo/a, la ciudadanía no se transmitió. Si el propio emigrante vive y nació en Italia, podría readquirirla hasta el 31/12/2027, lo que abriría vías a sus descendientes.', basis: 'Ley 555/1912 (pérdida por naturalización); Ley 74/2025, art. 1-ter (readquisición hasta 31/12/2027).', pending: ['Fecha exacta de naturalización.', 'Si el emigrante vive.'], consult: 'expres', alt: ['Ver otras nacionalidades', '/#paises'] },
    natur2: { light: 'ambar', title: 'Tienes una vía, pero viviendo en Italia.', route: 'Naturalización con 2 años de residencia legal en Italia', confidence: 'Media', body: 'Desde la reforma, el extranjero cuyo padre, madre, abuelo o abuela sea o haya sido ciudadano italiano por nacimiento puede pedir la ciudadanía con 2 años de residencia legal en Italia (antes eran 3).', basis: 'Ley 91/1992, art. 9.1.a, modificado por la Ley 74/2025 (art. 1-bis).', pending: ['Prueba de la ciudadanía por nacimiento del ascendiente.', 'Visado para residir en Italia.'], consult: 'estrategia', alt: ['Ver visados', '/visados'] },
    bis: { light: 'rojo', title: 'Por bisabuelo, la vía automática se cerró en 2025.', route: 'Alternativas: otra nacionalidad o visado', confidence: 'Media', body: 'Con la Ley 74/2025, los descendientes nacidos fuera con otra nacionalidad ya no son italianos automáticamente si el antepasado nacido en Italia es un bisabuelo o anterior, salvo trámites iniciados antes del 27/03/2025.', basis: 'Ley 91/1992, art. 3-bis (Ley 74/2025).', pending: ['Revisar si otra rama familiar da derecho a España o Portugal.'], consult: 'expres', alt: ['Ver otras nacionalidades', '/#paises'] },
    nadie: { light: 'rojo', title: 'Sin un ascendiente italiano identificado, no hay vía.', route: 'Revisión de otras vías', confidence: 'Alta', body: 'Si no identificas a un familiar nacido en Italia, no podemos plantear la ciudadanía italiana. Revisemos otras nacionalidades o visados.', basis: 'Ley 91/1992.', pending: [], consult: 'expres', alt: ['Ver otras nacionalidades', '/#paises'] },
  },
};

// ---------------------------------------------------------------- PORTUGAL
const PT: Tree = {
  start: 'q1',
  nodes: Object.fromEntries([
    n('q1', '¿Quién de tu familia es o era portugués de origen (incluidas Madeira y Azores)?', [
      { label: 'Mi padre o mi madre', result: 'filho' },
      { label: 'Mi abuelo o mi abuela', next: 'q_lost' },
      { label: 'Mi bisabuelo o bisabuela', result: 'bisneto' },
      { label: 'Nadie', result: 'nadie' },
    ]),
    n('q_lost', '¿Ese abuelo o abuela perdió la nacionalidad portuguesa (por ejemplo, al naturalizarse antes de 1981)?', [
      { label: 'No, nunca la perdió', next: 'q_ties' },
      { label: 'Sí, la perdió', result: 'neto_lost' },
      { label: 'No lo sé', next: 'q_ties' },
    ]),
    n('q_ties', '¿Hablas portugués y tienes vínculos con Portugal (viajes, familia, asociaciones, propiedades)?', [
      { label: 'Sí, ambas cosas', result: 'neto' },
      { label: 'Algo, pero hay que reforzarlo', result: 'neto_prep' },
      { label: 'No', result: 'neto_prep' },
    ], 'Desde mayo de 2026 los nietos deben acreditar vínculos efectivos y conocimiento de lengua y cultura.'),
  ].map((x) => [x.id, x])),
  results: {
    filho: { light: 'verde', title: 'Tu perfil encaja con la atribución como hijo de portugués.', route: 'Atribución de nacionalidad originaria (hijo de portugués nacido en el extranjero)', confidence: 'Alta', body: 'Los hijos de padre o madre portugueses nacidos fuera son portugueses de origen si inscriben el nacimiento en el registro civil portugués o declaran que quieren serlo. La reforma de 2026 no cambió esta regla.', basis: 'Lei n.º 37/81, art. 1.1.c, con la Lei Orgânica n.º 1/2026.', pending: ['Assento de nascimento portugués del progenitor.', 'Transcripción del matrimonio de los padres, si aplica.'], consult: 'inicial', source: ['Diário da República', 'https://diariodarepublica.pt/dr/legislacao-consolidada/lei-organica/2026-1123746975'] },
    neto: { light: 'verde', title: 'Tu perfil parece viable como nieto, con los nuevos requisitos.', route: 'Atribución originaria a nietos (art. 1.1.d)', confidence: 'Media', body: 'Los nietos de portugués de origen que no perdió la nacionalidad siguen teniendo vía, pero desde el 19 de mayo de 2026 deben probar lazos efectivos con la comunidad portuguesa, conocimiento de la lengua y la cultura, y antecedentes penales limpios.', basis: 'Lei n.º 37/81, art. 1.1.d, en la redacción de la Lei Orgânica n.º 1/2026.', pending: ['Prueba de lazos efectivos (documentos concretos).', 'Certificado de lengua portuguesa, según la reglamentación.', 'Criterio del reglamento que desarrolle la ley.'], consult: 'inicial', source: ['Diário da República', 'https://diariodarepublica.pt/dr/legislacao-consolidada/lei-organica/2026-1123746975'] },
    neto_prep: { light: 'ambar', title: 'Tienes la vía, pero hay que preparar lengua y vínculos.', route: 'Atribución a nietos tras preparar los requisitos de 2026', confidence: 'Media', body: 'La ley de 2026 exige a los nietos vínculos efectivos y conocimiento de lengua y cultura portuguesas. Te ayudamos a preparar las pruebas y el certificado de idioma antes de presentar.', basis: 'Lei n.º 37/81, arts. 1.1.d y 6 (Lei Orgânica n.º 1/2026).', pending: ['Plan de idioma y certificación.', 'Documentos que prueben el vínculo.'], consult: 'estrategia' },
    neto_lost: { light: 'ambar', title: 'La pérdida de tu abuelo/a complica la vía de nietos.', route: 'Revisión de la pérdida y de vías alternativas', confidence: 'Baja', body: 'La vía de nietos exige que el abuelo/a no haya perdido la nacionalidad. Hay que revisar si la pérdida fue efectiva según la ley de cada época y si tu padre o madre puede ser reconocido antes.', basis: 'Lei n.º 37/81 y Lei n.º 2098/1959 (régimen anterior).', pending: ['Fecha y forma de la naturalización del abuelo/a.'], consult: 'estrategia' },
    bisneto: { light: 'ambar', title: 'Para bisnietos la ley exige vivir en Portugal.', route: 'Naturalización con 5 años de residencia legal (art. 6.8) o reconocimiento previo de una generación intermedia', confidence: 'Media', body: 'La reforma de 2026 creó una vía para bisnietos de portugueses de origen, pero exige 5 años de residencia legal en Portugal. La alternativa es que primero tu padre o madre obtenga la nacionalidad como nieto y luego tú como hijo.', basis: 'Lei n.º 37/81, art. 6.8, introducido por la Lei Orgânica n.º 1/2026.', pending: ['Si tu padre o madre puede tramitar como nieto.', 'Visado para residir en Portugal (D7, D8).'], consult: 'estrategia', alt: ['Ver visados D7 y D8', '/visados'] },
    nadie: { light: 'rojo', title: 'Sin ascendencia portuguesa, la vía es la residencia.', route: 'Visado D7/D8 y naturalización (10 años)', confidence: 'Alta', body: 'Desde 2026 la naturalización por residencia exige 10 años a nacionales de países fuera de la CPLP y de la UE. Revisemos otras nacionalidades o un visado.', basis: 'Lei n.º 37/81, art. 6 (Lei Orgânica n.º 1/2026).', pending: [], consult: 'expres', alt: ['Ver visados', '/visados'] },
  },
};

// ---------------------------------------------------------------- ALEMANIA
const DE: Tree = {
  start: 'q1',
  nodes: Object.fromEntries([
    n('q1', '¿Qué describe mejor tu historia familiar?', [
      { label: 'Un antepasado fue perseguido por el nazismo (1933–1945) y perdió la nacionalidad', result: 'art116' },
      { label: 'Desciendo de una madre alemana casada con extranjero, o de hijos nacidos fuera de matrimonio de padre alemán', result: 'par5' },
      { label: 'Mi padre o mi madre era alemán cuando nací', next: 'q_parent' },
      { label: 'Mis abuelos o bisabuelos alemanes emigraron', next: 'q_nat' },
      { label: 'Ninguna de estas', result: 'nadie' },
    ]),
    n('q_parent', '¿Tú y tu progenitor alemán nacieron ambos fuera de Alemania después del año 1999?', [
      { label: 'No', result: 'cert' },
      { label: 'Sí', result: 'gen' },
      { label: 'No lo sé', result: 'cert' },
    ]),
    n('q_nat', '¿Tu antepasado alemán se naturalizó venezolano (u otra) antes de que naciera su hijo/a de tu línea?', [
      { label: 'No', result: 'cert' },
      { label: 'Sí', result: 'lost' },
      { label: 'No lo sé', result: 'cert' },
    ]),
  ].map((x) => [x.id, x])),
  results: {
    art116: { light: 'verde', title: 'Tu historia encaja con la restitución.', route: 'Restitución (art. 116.2 de la Ley Fundamental y § 15 StAG)', confidence: 'Media', body: 'Las personas privadas de la nacionalidad por persecución entre 1933 y 1945 y sus descendientes pueden recuperarla. El trámite ante la BVA es gratuito y no exige examen de idioma.', basis: 'Grundgesetz, art. 116.2; StAG § 15.', pending: ['Prueba de la persecución o de la pérdida.', 'Documentos de cada generación.'], consult: 'inicial' },
    par5: { light: 'verde', title: 'Tu caso encaja con la declaración del § 5.', route: 'Declaración de adquisición (§ 5 StAG)', confidence: 'Media', body: 'Corrige exclusiones por normas discriminatorias de género o filiación (por ejemplo, hijos de madre alemana y padre extranjero nacidos antes de 1975). Plazo para declarar: hasta el 19 de agosto de 2031.', basis: 'StAG § 5 (en vigor desde 2021).', pending: ['Fechas de nacimiento y matrimonio de la línea.'], consult: 'inicial' },
    cert: { light: 'ambar', title: 'Es posible que ya seas alemán sin saberlo.', route: 'Certificado de nacionalidad (Staatsangehörigkeitsausweis)', confidence: 'Media', body: 'Si nadie perdió la nacionalidad, se transmite por filiación. Hay que revisar la ley vigente al nacer cada generación. Alemania permite la doble nacionalidad desde junio de 2024.', basis: 'StAG §§ 4, 17 y 25 (redacción histórica); reforma de 2024.', pending: ['Documentos alemanes del antepasado.', 'Naturalizaciones en la línea.'], consult: 'estrategia' },
    gen: { light: 'ambar', title: 'Puede aplicarse el límite generacional.', route: 'Revisión del § 4.4 StAG', confidence: 'Media', body: 'Los hijos nacidos fuera de un alemán también nacido fuera después de 1999 no adquieren la nacionalidad, salvo que se inscriba el nacimiento en el registro alemán en plazo.', basis: 'StAG § 4.4.', pending: ['Si se inscribió tu nacimiento a tiempo.'], consult: 'estrategia' },
    lost: { light: 'rojo', title: 'La línea parece interrumpida.', route: 'Revisión de excepciones', confidence: 'Media', body: 'Antes de 2024, adquirir otra nacionalidad voluntariamente solía hacer perder la alemana, salvo excepciones o permisos. Revisemos si hubo excepción o si aplica otra vía.', basis: 'StAG § 25 (redacción anterior a 2024).', pending: ['Fecha y circunstancias de la naturalización.'], consult: 'expres', alt: ['Ver otras nacionalidades', '/#paises'] },
    nadie: { light: 'rojo', title: 'Sin vínculo alemán, no hay vía de nacionalidad.', route: 'Visados', confidence: 'Alta', body: 'Revisemos otras nacionalidades o visados para Europa.', basis: 'StAG.', pending: [], consult: 'expres', alt: ['Ver visados', '/visados'] },
  },
};

// ---------------------------------------------------------------- CROACIA
const HR: Tree = {
  start: 'q1',
  nodes: Object.fromEntries([
    n('q1', '¿Desde dónde emigró tu antepasado?', [
      { label: 'Desde el territorio de la actual Croacia, antes del 8 de octubre de 1991', next: 'q2' },
      { label: 'Desde otra república de la antigua Yugoslavia', result: 'yugo' },
      { label: 'No lo sé con certeza', result: 'origen' },
    ]),
    n('q2', '¿Puedes documentar cada generación hasta ti con partidas de nacimiento?', [
      { label: 'Sí', result: 'art11' },
      { label: 'Parcialmente', result: 'art11_doc' },
      { label: 'No', result: 'art11_doc' },
    ]),
  ].map((x) => [x.id, x])),
  results: {
    art11: { light: 'verde', title: 'Tu perfil encaja con la vía para descendientes de emigrantes.', route: 'Naturalización privilegiada (art. 11 de la Ley de Ciudadanía croata)', confidence: 'Alta', body: 'Desde 2020 no hay límite de generaciones ni examen de idioma y cultura para descendientes de emigrantes croatas. Hay que probar la emigración y cada vínculo familiar.', basis: 'Ley de Ciudadanía croata, art. 11 (reforma en vigor desde 2020).', pending: ['Prueba de la emigración (pasaporte, registros de llegada).', 'Biografía en croata exigida por el consulado.'], consult: 'inicial', source: ['Ministerio de Exteriores de Croacia', 'https://mvep.gov.hr/croatian-citizenship-264501/264501'] },
    art11_doc: { light: 'ambar', title: 'La vía existe; falta reunir documentos.', route: 'Art. 11 tras búsqueda en registros croatas', confidence: 'Media', body: 'Buscamos los registros parroquiales y civiles en Croacia para completar la cadena.', basis: 'Ley de Ciudadanía croata, art. 11.', pending: ['Pueblo o región de origen.'], consult: 'estrategia' },
    yugo: { light: 'rojo', title: 'El art. 11 no suele aplicar a emigrantes de otras repúblicas.', route: 'Revisión de otras vías', confidence: 'Media', body: 'Revisemos si existe otra base (pertenencia al pueblo croata, art. 16) u otras nacionalidades.', basis: 'Ley de Ciudadanía croata, arts. 11 y 16.', pending: [], consult: 'expres' },
    origen: { light: 'ambar', title: 'Primero hay que confirmar el lugar de origen.', route: 'Investigación genealógica', confidence: 'Baja', body: 'Con el apellido, fechas aproximadas y documentos familiares podemos localizar el origen.', basis: 'Ley de Ciudadanía croata, art. 11.', pending: ['Documentos familiares que tengas.'], consult: 'estrategia' },
  },
};

// ---------------------------------------------------------------- REINO UNIDO
const UK: Tree = {
  start: 'q1',
  nodes: Object.fromEntries([
    n('q1', '¿Quién es o era británico?', [
      { label: 'Mi padre o mi madre', next: 'q2' },
      { label: 'Mi abuelo o mi abuela', result: 'abuelo' },
      { label: 'Nadie', result: 'nadie' },
    ]),
    n('q2', '¿Tu progenitor británico nació en el Reino Unido (o era británico por nacimiento allí, registro o naturalización)?', [
      { label: 'Sí', next: 'q3' },
      { label: 'No, también nació fuera (británico por descendencia)', result: 'descent2' },
      { label: 'No lo sé', next: 'q3' },
    ]),
    n('q3', '¿Cuál es tu caso?', [
      { label: 'Nací en 1983 o después', result: 'descent' },
      { label: 'Nací antes de 1983 y la británica es mi madre', result: 's4c' },
      { label: 'Nací antes de 1983, el británico es mi padre y estaba casado con mi madre', result: 'descent' },
      { label: 'Nací antes de julio de 2006 y mi padre británico no estaba casado con mi madre', result: 's4g' },
    ]),
  ].map((x) => [x.id, x])),
  results: {
    descent: { light: 'verde', title: 'Probablemente ya eres británico por descendencia.', route: 'Solicitud de pasaporte británico', confidence: 'Alta', body: 'El hijo nacido fuera de un británico "otherwise than by descent" es británico por descendencia automáticamente: no hay que naturalizarse, se pide el pasaporte.', basis: 'British Nationality Act 1981, s. 2(1)(a).', pending: ['Partida británica y pasaporte del progenitor.', 'Partida de nacimiento completa con ambos padres.'], consult: 'inicial' },
    s4c: { light: 'verde', title: 'Tu caso encaja con el registro de la sección 4C.', route: 'Registro como ciudadano británico (hijos de madre británica antes de 1983)', confidence: 'Media', body: 'Corrige la antigua regla que impedía a las madres transmitir la nacionalidad. Requiere solicitud al Home Office y ceremonia.', basis: 'British Nationality Act 1981, s. 4C.', pending: ['Documentos de la madre y fechas.'], consult: 'inicial' },
    s4g: { light: 'verde', title: 'Tu caso encaja con el registro de la sección 4G.', route: 'Registro (hijos de padre británico no casado, nacidos antes de julio de 2006)', confidence: 'Media', body: 'Corrige la exclusión de hijos de padres británicos no casados con la madre.', basis: 'British Nationality Act 1981, ss. 4E–4J.', pending: ['Prueba de paternidad.'], consult: 'inicial' },
    descent2: { light: 'ambar', title: 'Hay que revisar la residencia de tu progenitor.', route: 'Posible registro (s. 3) según residencia en el Reino Unido', confidence: 'Baja', body: 'Si tu progenitor también es británico por descendencia, la transmisión depende de requisitos de residencia en el Reino Unido.', basis: 'British Nationality Act 1981, s. 3.', pending: ['Periodos de residencia del progenitor en el Reino Unido.'], consult: 'estrategia' },
    abuelo: { light: 'rojo', title: 'Por abuelos no suele haber vía directa.', route: 'Revisión de excepciones o de tu progenitor', confidence: 'Media', body: 'La nacionalidad británica por descendencia se limita, en general, a una generación nacida fuera. Revisemos si tu padre o madre ya es británico.', basis: 'British Nationality Act 1981, ss. 2 y 3.', pending: [], consult: 'expres', alt: ['Ver otras nacionalidades', '/#paises'] },
    nadie: { light: 'rojo', title: 'Sin vínculo británico, no hay vía.', route: 'Otras nacionalidades o visados', confidence: 'Alta', body: 'Revisemos otras opciones.', basis: 'British Nationality Act 1981.', pending: [], consult: 'expres', alt: ['Ver otras nacionalidades', '/#paises'] },
  },
};

// ---------------------------------------------------------------- VISADOS
const VISAS: Tree = {
  start: 'q1',
  nodes: Object.fromEntries([
    n('q1', '¿Cuál es tu plan principal?', [
      { label: 'Trabajar en remoto para empresas o clientes de fuera', next: 'q_remote' },
      { label: 'Vivir de rentas, pensión o ahorros', next: 'q_rent' },
      { label: 'Estudiar (grado, máster, doctorado, idiomas)', result: 'estudios' },
      { label: 'Ya estoy en España sin autorización de residencia', result: 'arraigo' },
      { label: 'Reunirme con un familiar que reside legalmente', result: 'familia' },
      { label: 'Buscar trabajo por cuenta ajena allí', result: 'trabajo' },
    ]),
    n('q_remote', '¿Tus ingresos por trabajo remoto son estables desde hace 3 meses o más y superan unos 2.800 € al mes?', [
      { label: 'Sí', result: 'nomada' },
      { label: 'Son menores o recientes', result: 'nomada_prep' },
    ], 'Umbral orientativo para España (200 % del salario mínimo). Portugal (D8) exige unas 4 veces su salario mínimo.'),
    n('q_rent', '¿Tienes ingresos pasivos o ahorros que cubran aproximadamente 2.400 € al mes durante un año?', [
      { label: 'Sí', result: 'nolucrativa' },
      { label: 'Menos, pero cubren el salario mínimo portugués', result: 'd7' },
      { label: 'No', result: 'trabajo' },
    ], 'Orientativo: España pide el 400 % del IPREM; Portugal (D7) pide al menos el salario mínimo portugués.'),
  ].map((x) => [x.id, x])),
  results: {
    nomada: { light: 'verde', title: 'Tu perfil encaja con el visado de nómada digital.', route: 'Visado de teletrabajo internacional (España) o D8 (Portugal)', confidence: 'Media', body: 'Permite residir trabajando en remoto para empresas extranjeras. Exige antigüedad de la relación laboral, titulación o experiencia y seguro médico.', basis: 'Ley 14/2013 (España), tras la Ley 28/2022; Lei 23/2007 (Portugal), visado D8.', pending: ['Contratos y facturas.', 'Umbral de ingresos vigente en 2026.'], consult: 'inicial' },
    nomada_prep: { light: 'ambar', title: 'Puedes calificar si refuerzas ingresos o antigüedad.', route: 'Preparación del visado de nómada digital', confidence: 'Media', body: 'Te ayudamos a documentar ingresos y antigüedad o a comparar con la D8 portuguesa.', basis: 'Ley 14/2013 (España); Lei 23/2007 (Portugal).', pending: ['Ingresos de los últimos meses.'], consult: 'expres' },
    nolucrativa: { light: 'verde', title: 'Tu perfil encaja con la residencia no lucrativa.', route: 'Residencia no lucrativa (España) o D7 (Portugal)', confidence: 'Media', body: 'Para vivir de ingresos propios sin trabajar en el país. Cuenta como residencia para la nacionalidad española (2 años para venezolanos).', basis: 'Reglamento de Extranjería (España); Lei 23/2007 (Portugal).', pending: ['Prueba de medios económicos y seguro médico.'], consult: 'inicial' },
    d7: { light: 'ambar', title: 'Portugal (D7) puede encajar mejor con tus ingresos.', route: 'Visado D7 de Portugal', confidence: 'Media', body: 'Los requisitos de ingresos de la D7 son menores que los de la no lucrativa española.', basis: 'Lei 23/2007 (Portugal).', pending: ['Ingresos pasivos acreditables.'], consult: 'expres' },
    estudios: { light: 'verde', title: 'Estudiar es una gran puerta de entrada.', route: 'Visado de estudios + búsqueda de beca', confidence: 'Alta', body: 'Te ayudamos con la admisión, el visado y la búsqueda de becas en España, Portugal e Italia.', basis: 'Normativa de estancia/residencia por estudios de cada país.', pending: ['Carta de admisión.', 'Medios económicos o beca.'], consult: 'inicial', alt: ['Te buscamos tu beca', '/becas'] },
    arraigo: { light: 'ambar', title: 'La vía habitual es el arraigo.', route: 'Arraigo (Reglamento de Extranjería de 2025)', confidence: 'Media', body: 'El reglamento vigente desde mayo de 2025 reorganizó los tipos de arraigo y fijó en general 2 años de permanencia en España. Revisamos cuál te corresponde.', basis: 'Real Decreto 1155/2024 (Reglamento de Extranjería).', pending: ['Prueba de permanencia (empadronamiento).', 'Antecedentes penales.'], consult: 'inicial' },
    familia: { light: 'verde', title: 'La reagrupación familiar puede ser tu vía.', route: 'Reagrupación familiar o tarjeta de familiar', confidence: 'Media', body: 'Depende de si tu familiar es español, de la UE o extranjero residente, y del parentesco.', basis: 'Reglamento de Extranjería; normativa de familiares de ciudadanos de la UE.', pending: ['Parentesco y situación del familiar.'], consult: 'inicial' },
    trabajo: { light: 'rojo', title: 'Buscar trabajo allí no basta para un visado.', route: 'Visado de búsqueda de empleo, oferta previa o estudios', confidence: 'Media', body: 'Sin oferta de trabajo, ingresos propios o admisión académica, los visados habituales no aplican. Te orientamos sobre el camino más corto.', basis: 'Normativa de extranjería de cada país.', pending: [], consult: 'expres' },
  },
};

// Negocios and Caribe keep shorter trees.
const NEG: Tree = {
  start: 'q1',
  nodes: Object.fromEntries([
    n('q1', '¿Qué quieres hacer en Europa?', [
      { label: 'Crear una empresa innovadora', next: 'q_cap' }, { label: 'Invertir en una empresa existente', next: 'q_cap' },
      { label: 'Trasladarme dentro de mi empresa', result: 'ict' }, { label: 'Viajes de negocio cortos', result: 'schengen' },
    ]),
    n('q_cap', '¿Tienes capital y un plan de negocio?', [
      { label: 'Sí, ambos', result: 'empr' }, { label: 'Solo uno de los dos', result: 'empr_prep' }, { label: 'Ninguno todavía', result: 'no' },
    ]),
  ].map((x) => [x.id, x])),
  results: {
    empr: { light: 'verde', title: 'Tu proyecto encaja con la visa de emprendedor o inversor.', route: 'Emprendedor (Ley 14/2013, España) o D2 (Portugal)', confidence: 'Media', body: 'España eliminó la golden visa inmobiliaria en abril de 2025; la vía es emprender o invertir en actividad productiva. Certia Group apoya la parte societaria.', basis: 'Ley 14/2013; Ley Orgánica 1/2025 (supresión de la residencia por inversión inmobiliaria).', pending: ['Informe favorable del plan de negocio.'], consult: 'inicial' },
    empr_prep: { light: 'ambar', title: 'Viable, pero hay que completar el proyecto.', route: 'Preparación de plan y capital', confidence: 'Media', body: 'Te ayudamos a estructurar el plan y la financiación.', basis: 'Ley 14/2013.', pending: [], consult: 'estrategia' },
    ict: { light: 'verde', title: 'Encaja con el traslado intraempresarial.', route: 'Traslado intraempresarial (ICT)', confidence: 'Media', body: 'Para directivos, especialistas o formación dentro de un grupo empresarial.', basis: 'Ley 14/2013; Directiva 2014/66/UE.', pending: ['Antigüedad en la empresa.'], consult: 'inicial' },
    schengen: { light: 'verde', title: 'Necesitas un visado Schengen de negocios.', route: 'Visado de corta duración (tipo C)', confidence: 'Alta', body: 'Para reuniones, ferias o visitas comerciales de hasta 90 días.', basis: 'Código de visados de la UE.', pending: ['Carta de invitación.'], consult: 'expres' },
    no: { light: 'rojo', title: 'Aún no hay base para una visa de negocios.', route: 'Preparación del proyecto', confidence: 'Media', body: 'Una consulta exprés te dice qué preparar primero.', basis: 'Ley 14/2013.', pending: [], consult: 'expres' },
  },
};

const CARIBE: Tree = {
  start: 'q1',
  nodes: Object.fromEntries([
    n('q1', '¿Tu pasaporte venezolano está vigente con al menos 6 meses?', [
      { label: 'Sí', next: 'q2' }, { label: 'Vence pronto o está prorrogado', result: 'pasaporte' }, { label: 'No tengo pasaporte vigente', result: 'sin' },
    ]),
    n('q2', '¿Te han negado una visa antes?', [{ label: 'No', result: 'ok' }, { label: 'Sí', result: 'negada' }]),
  ].map((x) => [x.id, x])),
  results: {
    ok: { light: 'verde', title: 'Tu perfil parece listo para solicitar.', route: 'Visado de turismo, negocios o residencia según destino', confidence: 'Media', body: 'Verificamos con el consulado los requisitos vigentes del destino antes de presentar.', basis: 'Normativa migratoria de cada país.', pending: ['Requisitos actuales del destino.'], consult: 'inicial' },
    pasaporte: { light: 'ambar', title: 'Revisemos si tu pasaporte sirve para ese destino.', route: 'Verificación de documento', confidence: 'Media', body: 'Algunos destinos no aceptan pasaportes prorrogados o próximos a vencer.', basis: 'Normativa de cada destino.', pending: [], consult: 'expres' },
    negada: { light: 'ambar', title: 'Una negativa previa exige preparar mejor el expediente.', route: 'Expediente reforzado', confidence: 'Media', body: 'Analizamos el motivo y reforzamos la solicitud.', basis: 'Normativa de cada destino.', pending: ['Carta de negativa.'], consult: 'estrategia' },
    sin: { light: 'rojo', title: 'Primero necesitas un pasaporte válido.', route: 'Pasaporte', confidence: 'Alta', body: 'Sin pasaporte vigente no es posible solicitar el visado.', basis: '—', pending: [], consult: 'expres' },
  },
};

export const TREES: Record<string, Tree> = {
  'nacionalidad-espanola': ES, 'nacionalidad-italiana': IT, 'nacionalidad-portuguesa': PT, 'nacionalidad-alemana': DE,
  'nacionalidad-croata': HR, 'nacionalidad-britanica': UK, visados: VISAS, negocios: NEG, caribe: CARIBE,
};
