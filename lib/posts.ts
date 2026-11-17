// Blog index. Each article body lives in content/blog/<slug>.md (written and
// legally reviewed by the team). Articles without a file show as "en revisión".

export interface Post { slug: string; cat: string; catLabel: string; mins: number; word: string; kicker: string; bg: string; fg: string; title: string; excerpt: string; date: string }

const T = { wine: ['#6A1F28', '#F0D9AE'], ink: ['#0B1F33', '#E8D3AE'], paper: ['#E3D6BE', '#0B1F33'], sea: ['#2F5D73', '#F4EFE6'], green: ['#1F5135', '#E8D3AE'], sand: ['#D9C7A5', '#6A1F28'] } as const;

const raw: [string, string, string, number, string, string, keyof typeof T, string, string][] = [
  ['nacionalidad-espanola-todas-las-vias', 'es', 'NACIONALIDAD ESPAÑOLA', 14, 'Todas las vías', 'GUÍA ESENCIAL', 'wine', 'Nacionalidad española para venezolanos: todas las vías, explicadas', 'Ascendencia, residencia, opción y carta de naturaleza: quién califica en cada una y qué documentos pide.'],
  ['nietos-de-espanoles', 'es', 'NACIONALIDAD ESPAÑOLA', 9, 'Nietos', 'ASCENDENCIA', 'wine', 'Nietos de españoles: ¿puedo pedir la nacionalidad hoy?', 'Qué dice la ley vigente, qué pasó con la Ley de Memoria Democrática y qué opciones quedan.'],
  ['residencia-dos-anos', 'es', 'NACIONALIDAD ESPAÑOLA', 7, '2 años', 'RESIDENCIA', 'paper', 'Por qué a los venezolanos les bastan 2 años de residencia', 'El régimen especial para iberoamericanos, explicado sin letra pequeña.'],
  ['apostillar-documentos-venezolanos', 'es', 'GUÍA PRÁCTICA', 8, 'Apostilla', 'LA HAYA · 1961', 'ink', 'Qué documentos venezolanos debes apostillar para España', 'Partidas, antecedentes y títulos: el orden correcto y cómo evitar rechazos.'],
  ['partida-nacimiento-abuelo-espana', 'es', 'NACIONALIDAD ESPAÑOLA', 6, 'Folio 214', 'REGISTRO CIVIL', 'sand', 'Cómo conseguir la partida de nacimiento de tu abuelo en España', 'Registros civiles, parroquias y archivos: dónde buscar según el año.'],
  ['examen-ccse-dele', 'es', 'NACIONALIDAD ESPAÑOLA', 5, 'CCSE', 'EXAMEN', 'green', 'Examen CCSE y DELE: quién está exento y cómo prepararse', 'Lo que tienes que estudiar y lo que no, si vienes de un país hispanohablante.'],
  ['errores-denegacion-nacionalidad', 'es', 'NACIONALIDAD ESPAÑOLA', 10, '7 errores', 'DENEGACIONES', 'wine', 'Los 7 errores que hacen que te denieguen la nacionalidad', 'Casos reales de expedientes rechazados y cómo se habrían evitado.'],
  ['italia-reforma-2025', 'it', 'NACIONALIDAD ITALIANA', 11, '2025', 'REFORMA', 'green', 'Nacionalidad italiana después de la reforma de 2025: qué cambió', 'Quién sigue calificando por ascendencia y qué pasa con los expedientes en curso.'],
  ['espana-o-italia', 'otras', 'COMPARATIVA', 9, 'ES vs IT', 'ESTRATEGIA', 'ink', '¿España o Italia? Qué nacionalidad te conviene pedir primero', 'Plazos, costes y requisitos cara a cara, para familias con doble ascendencia.'],
  ['visa-nomada-digital-espana', 'visas', 'VISADOS', 7, 'Nómada', 'TRABAJO REMOTO', 'sea', 'Visa de nómada digital en España para venezolanos', 'Ingresos mínimos, documentos y por qué es la puerta a la residencia.'],
];

export const POSTS: Post[] = raw.map(([slug, cat, catLabel, mins, word, kicker, theme, title, excerpt]) => ({ slug, cat, catLabel, mins, word, kicker, bg: T[theme][0], fg: T[theme][1], title, excerpt, date: '2026-11-16' }));

export const CATEGORIES: [string, string][] = [['all', 'Todo'], ['es', 'Nacionalidad española'], ['it', 'Nacionalidad italiana'], ['otras', 'Otras nacionalidades'], ['visas', 'Visados']];
