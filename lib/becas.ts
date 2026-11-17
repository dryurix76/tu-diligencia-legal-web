// Scholarships for Spain, Portugal and Italy. Checked in November 2026 against
// the 2026-2027 calls. Calls repeat every year; dates shown are the last edition.

export interface Beca {
  name: string; who: string; covers: string; amount: string; window: string; next: string; url: string; level: string; fit: 'alta' | 'media' | 'baja';
}
export interface Country { id: 'es' | 'pt' | 'it'; name: string; flag: string; intro: string; costs: [string, string][]; becas: Beca[]; tip: string }

export const BECAS: Country[] = [
  {
    id: 'es', name: 'España', flag: '🇪🇸',
    intro: 'El destino con más becas pensadas para latinoamericanos. Además, el tiempo de residencia legal cuenta para la nacionalidad (2 años para venezolanos), aunque el periodo como estudiante debe revisarse.',
    costs: [
      ['Máster oficial público en Madrid (residentes)', '≈ 45 € por crédito · 60 créditos ≈ 2.700 €'],
      ['Máster oficial público en Madrid (extracomunitarios no residentes)', '≈ 84 € por crédito · 60 créditos ≈ 5.000 €'],
      ['Cataluña, curso 2026-2027', 'mantiene los precios públicos del curso anterior'],
      ['Máster en universidad privada o escuela de negocio', '8.000 – 25.000 € o más'],
      ['Medios económicos para el visado de estudios', '100 % del IPREM mensual (≈ 600 €/mes) salvo beca que los cubra'],
    ],
    becas: [
      { name: 'Fundación Carolina', who: 'Graduados latinoamericanos (posgrado, doctorado, estancias)', covers: 'Matrícula total o parcial; en muchos programas ayuda mensual de alojamiento y manutención (p. ej. 900 €/mes) y billete', amount: '736 becas en 2026-2027', window: 'Posgrado: 12 ene – 2 mar 2026. Doctorado y estancias: hasta 9 abr 2026', next: 'Enero de 2027 (curso 2027-2028)', url: 'https://www.fundacioncarolina.es/', level: 'Máster · Doctorado', fit: 'alta' },
      { name: 'Becas MAEC-AECID', who: 'Ciudadanía de América Latina; varios programas para empleados públicos', covers: 'Programas específicos: Escuela Diplomática, máster para empleados públicos, lexicografía (ASALE), música (Reina Sofía)', amount: 'Según programa', window: 'Convocatoria 2026-2027 publicada el 21 may 2026 (plazos cortos)', next: 'Mayo de 2027', url: 'https://www.aecid.es/', level: 'Máster · Formación', fit: 'media' },
      { name: 'Universidad de Salamanca: becas internacionales de máster', who: 'Estudiantes latinoamericanos admitidos en un máster oficial de la USAL', covers: 'Plaza financiada en un máster de un año', amount: 'Entre 35 y 48 plazas en convocatorias recientes', window: 'Convocatoria anual de la USAL', next: 'Curso 2027-2028', url: 'https://www.usal.es/', level: 'Máster', fit: 'alta' },
      { name: 'Becas Santander Estudios (por universidad)', who: 'Estudiantes matriculados en universidades adheridas', covers: 'Ayuda económica para estudios', amount: 'Ej.: USAL convoca 600 becas de 1.000 € (2026-2027)', window: 'Según universidad (normalmente tras la matrícula)', next: 'Curso 2027-2028', url: 'https://app.santanderopenacademy.com/', level: 'Grado · Máster', fit: 'media' },
      { name: 'Santander Financial Institute (SANFI)', who: 'Graduados de universidades latinoamericanas', covers: 'Máster en Banca y Mercados Financieros (Universidad de Cantabria)', amount: '2 becas modalidad Latinoamérica; ayuda de 4.000 € en la edición 2025', window: 'Bases publicadas en marzo de 2026', next: 'Edición 2027', url: 'https://app.santanderopenacademy.com/', level: 'Máster', fit: 'media' },
    ],
    tip: 'Carolina es muy competitiva: se puntúa expediente, carta de motivación, cartas de recomendación y el impacto del regreso al país. Preparamos cada pieza.',
  },
  {
    id: 'pt', name: 'Portugal', flag: '🇵🇹',
    intro: 'Matrículas bajas para nacionales y de la UE. Si eres lusodescendiente y obtienes la nacionalidad, pagas como portugués y accedes a las becas sociales del Estado.',
    costs: [
      ['Licenciatura pública, nacionales y UE', 'máximo 697 €/año (tope que sube desde 2026-2027)'],
      ['Licenciatura pública, estudiante internacional', 'ej.: Universidade dos Açores 2.500 €/año en Ciencias Sociales (2026-2027)'],
      ['Doctorado, internacional', 'ej.: Universidade dos Açores 4.250 €/año (frente a 2.535 € nacionales)'],
      ['Reducciones', 'U. Porto: hasta 45 % para países de la CPLP; Universidade Europeia: 40 % para estudiantes de centros extranjeros'],
    ],
    becas: [
      { name: 'FCT: becas de doctorado', who: 'Doctorandos de cualquier nacionalidad con residencia en Portugal al empezar la beca', covers: 'Ayuda mensual, matrícula de doctorado (hasta 3.500 €/año) y subsidio de instalación', amount: '≈ 1.260 €/mes durante hasta 4 años; 1.600 becas en 2026', window: 'Concurso 2026: 2 – 31 mar 2026', next: 'Marzo de 2027', url: 'https://www.fct.pt/', level: 'Doctorado', fit: 'media' },
      { name: 'Incentivos de las universidades', who: 'Estudiantes internacionales con buen expediente', covers: 'Reducción de la matrícula internacional por mérito o cooperación', amount: 'Ej.: U. de Évora (Despacho 41/2026); Universidade Europeia −40 %', window: 'Al solicitar admisión', next: 'Curso 2027-2028', url: 'https://www.uevora.pt/', level: 'Grado · Máster', fit: 'alta' },
      { name: 'Acción social (DGES)', who: 'Estudiantes con nacionalidad portuguesa o equiparados (p. ej. lusodescendientes con la nacionalidad)', covers: 'Beca según renta familiar; nuevo sistema desde 2026-2027', amount: 'Según renta', window: 'Junio – septiembre', next: 'Curso 2027-2028', url: 'https://www.dges.gov.pt/', level: 'Grado · Máster', fit: 'media' },
      { name: 'Erasmus Mundus con universidades portuguesas', who: 'Cualquier nacionalidad', covers: 'Matrícula completa, seguro y ayuda mensual', amount: '1.400 €/mes hasta 24 meses (máx. 33.600 €)', window: 'Octubre 2026 – enero 2027 (para empezar en 2027)', next: 'Abierto ahora en muchos programas', url: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en', level: 'Máster', fit: 'alta' },
    ],
    tip: 'La vía más rentable para muchos venezolanos con abuelos portugueses es tramitar primero la nacionalidad: la matrícula baja de 2.500 € a 697 €.',
  },
  {
    id: 'it', name: 'Italia', flag: '🇮🇹',
    intro: 'Las becas regionales (DSU) están abiertas a estudiantes internacionales y pueden incluir dinero, residencia, comedor y exención de la matrícula. La clave es acreditar el ISEE con documentos del país de origen.',
    costs: [
      ['Universidad pública con ISEE bajo', 'exención total para los becarios DSU; en general, tasas según renta familiar'],
      ['Universidad pública sin beca', 'orientativo: entre 1.000 y 4.000 €/año según ISEE y universidad'],
      ['Universidades privadas', 'precios más altos; muchas tienen becas propias por renta'],
    ],
    becas: [
      { name: 'Becas DSU regionales (ER.GO, DiSCo Lazio, EDISU Piemonte, ESU Veneto, DSU Toscana…)', who: 'Estudiantes de cualquier nacionalidad, con requisitos de renta (ISEE/ISEEU parificato) y mérito', covers: 'Dinero anual + exención de matrícula + residencia y comedor', amount: 'Fuera de sede hasta 7.171 €/año; pendulares 4.190 €; en sede 2.890 € (importes mínimos nacionales 2026-2027)', window: 'Julio – septiembre', next: 'Verano de 2027', url: 'https://www.er-go.it/', level: 'Grado · Máster · Doctorado', fit: 'alta' },
      { name: 'Becas del Gobierno italiano (MAECI)', who: 'Estudiantes extranjeros residentes fuera de Italia', covers: 'Ayuda mensual, seguro y exención de tasas en muchas universidades', amount: '900 €/mes, de 6 a 9 meses (hasta 10.800 €)', window: 'Hasta el 26 mar 2026 a las 14:00 (portal Study in Italy)', next: 'Febrero – marzo de 2027', url: 'https://studyinitaly.esteri.it/', level: 'Máster · Doctorado · Cursos', fit: 'alta' },
      { name: 'Invest Your Talent in Italy', who: 'Estudiantes de países elegibles, másteres en inglés con prácticas en empresas', covers: 'Beca de 9 meses + prácticas obligatorias', amount: '10.800 € anuales', window: '20 abr – 11 may 2026', next: 'Abril – mayo de 2027', url: 'https://investyourtalentapplication.esteri.it/', level: 'Máster', fit: 'media' },
      { name: 'Becas propias de universidades', who: 'Estudiantes internacionales admitidos', covers: 'Dinero o exención de matrícula', amount: 'Ej.: Bari, 40 anualidades para internacionales 2026-2027', window: 'Primavera – verano', next: 'Curso 2027-2028', url: 'https://www.uniba.it/', level: 'Grado · Máster', fit: 'media' },
    ],
    tip: 'Para el ISEE parificato hay que reunir y legalizar ingresos y patrimonio familiar del último año en Venezuela, traducirlos y presentarlos en un CAF. Es el paso donde más solicitudes fallan.',
  },
];

export const BECA_SERVICES = [
  { id: 'busqueda', name: 'Te buscamos tu beca', usd: 290, desc: 'Analizamos tu perfil y te entregamos en 7 días un informe con las 5 a 10 becas abiertas o próximas que mejor encajan, requisitos, plazos, importes y un calendario de trabajo.', items: ['Entrevista de 30 minutos', 'Informe personalizado', 'Calendario de convocatorias', 'Si no hay ninguna convocatoria compatible, te devolvemos el 100 %'] },
  { id: 'solicitud', name: 'Acompañamiento de solicitud', usd: 490, desc: 'Preparamos contigo una solicitud completa: CV europeo, carta de motivación, cartas de recomendación, documentos, traducciones y, en Italia, el ISEE parificato.', items: ['1 beca y 1 universidad', 'Revisión ilimitada de la carta', 'Checklist y revisión final antes de enviar', 'Visado de estudios con 20 % de descuento'] },
  { id: 'pack', name: 'Pack beca + admisión', usd: 890, desc: 'Búsqueda, hasta 3 solicitudes de beca y la admisión en la universidad. Lo más completo para quien empieza de cero.', items: ['Todo lo anterior', 'Hasta 3 solicitudes', 'Admisión en la universidad', 'Simulación de entrevista'] },
] as const;

export const CALENDAR: [string, string][] = [
  ['Octubre – enero', 'Erasmus Mundus (programas que empiezan en septiembre del año siguiente)'],
  ['Enero – marzo', 'Fundación Carolina (posgrado hasta comienzos de marzo, doctorado hasta abril)'],
  ['Febrero – marzo', 'Becas MAECI del Gobierno italiano'],
  ['Marzo', 'Becas de doctorado FCT (Portugal)'],
  ['Abril – mayo', 'Invest Your Talent in Italy'],
  ['Mayo – junio', 'Becas MAEC-AECID'],
  ['Julio – septiembre', 'Becas regionales DSU en Italia y acción social en Portugal'],
];
