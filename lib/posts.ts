// Blog index. Each article body lives in content/blog/<slug>.md (written and
// legally reviewed by the team). Articles without a file show as "en revisión".

export interface Post { slug: string; cat: string; catLabel: string; mins: number; word: string; kicker: string; bg: string; fg: string; title: string; excerpt: string; date: string }

// Portadas en la paleta de tres colores: tinta, papel y verde (y sus mezclas).
const T = { wine: ['#0B1F33', '#8BBAA7'], ink: ['#0B1F33', '#F4EFE6'], paper: ['#E4E0D9', '#0B1F33'], sea: ['#0B5148', '#F4EFE6'], green: ['#0B7A59', '#F4EFE6'], sand: ['#F4EFE6', '#0B7A59'] } as const;

const raw: [string, string, string, number, string, string, keyof typeof T, string, string][] = [
  ['nacionalidad-espanola-todas-las-vias', 'es', 'NACIONALIDAD ESPAÑOLA', 6, 'Todas las vías', 'GUÍA ESENCIAL', 'wine', 'Nacionalidad española para venezolanos: todas las vías, explicadas', 'Ascendencia, residencia, opción y carta de naturaleza: quién califica en cada una y qué documentos pide.'],
  ['nietos-de-espanoles', 'es', 'NACIONALIDAD ESPAÑOLA', 5, 'Nietos', 'ASCENDENCIA', 'wine', 'Nietos de españoles: ¿puedo pedir la nacionalidad hoy?', 'Qué dice la ley vigente, qué pasó con la Ley de Memoria Democrática y qué opciones quedan.'],
  ['residencia-dos-anos', 'es', 'NACIONALIDAD ESPAÑOLA', 4, '2 años', 'RESIDENCIA', 'paper', 'Por qué a los venezolanos les bastan 2 años de residencia', 'El régimen especial para iberoamericanos, explicado sin letra pequeña.'],
  ['apostillar-documentos-venezolanos', 'es', 'GUÍA PRÁCTICA', 4, 'Apostilla', 'LA HAYA · 1961', 'ink', 'Qué documentos venezolanos debes apostillar para España', 'Partidas, antecedentes y títulos: el orden correcto y cómo evitar rechazos.'],
  ['partida-nacimiento-abuelo-espana', 'es', 'NACIONALIDAD ESPAÑOLA', 4, 'Folio 214', 'REGISTRO CIVIL', 'sand', 'Cómo conseguir la partida de nacimiento de tu abuelo en España', 'Registros civiles, parroquias y archivos: dónde buscar según el año.'],
  ['examen-ccse-dele', 'es', 'NACIONALIDAD ESPAÑOLA', 4, 'CCSE', 'EXAMEN', 'green', 'Examen CCSE y DELE: quién está exento y cómo prepararse', 'Lo que tienes que estudiar y lo que no, si vienes de un país hispanohablante.'],
  ['errores-denegacion-nacionalidad', 'es', 'NACIONALIDAD ESPAÑOLA', 4, '7 errores', 'DENEGACIONES', 'wine', 'Los 7 errores que hacen que te denieguen la nacionalidad', 'Casos reales de expedientes rechazados y cómo se habrían evitado.'],
  ['italia-reforma-2025', 'it', 'NACIONALIDAD ITALIANA', 6, '2025', 'REFORMA', 'green', 'Nacionalidad italiana después de la reforma de 2025: qué cambió', 'Quién sigue calificando, qué confirmó la Corte Constitucional en 2026 y qué opciones quedan.'],
  ['espana-o-italia', 'otras', 'COMPARATIVA', 4, 'ES vs IT', 'ESTRATEGIA', 'ink', '¿España o Italia? Qué nacionalidad te conviene pedir primero', 'Plazos, costes y requisitos cara a cara, para familias con doble ascendencia.'],
  ['visa-americana-venezolanos-2026', 'visas', 'ESTADOS UNIDOS', 6, 'EE. UU.', 'VISADOS 2026', 'ink', 'Visa americana para venezolanos en 2026: qué está cerrado y qué sigue abierto', 'Proclamaciones, fianza de hasta 20.000 USD, la embajada en Caracas y la vía del pasaporte europeo.'],
  ['visa-nomada-digital-espana', 'visas', 'VISADOS', 4, 'Nómada', 'TRABAJO REMOTO', 'sea', 'Visa de nómada digital en España para venezolanos', 'Ingresos mínimos, documentos y por qué es la puerta a la residencia.'],
];

export const POSTS: Post[] = raw.map(([slug, cat, catLabel, mins, word, kicker, theme, title, excerpt]) => ({ slug, cat, catLabel, mins, word, kicker, bg: T[theme][0], fg: T[theme][1], title, excerpt, date: '2026-11-17' }));

export const CATEGORIES: [string, string][] = [['all', 'Todo'], ['es', 'Nacionalidad española'], ['it', 'Nacionalidad italiana'], ['otras', 'Otras nacionalidades'], ['visas', 'Visados']];
