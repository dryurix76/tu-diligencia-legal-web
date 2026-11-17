// U.S. visa situation for Venezuelan nationals. Checked in November 2026.
// Review monthly: proclamations, bond lists and consular status change often.

export const US_UPDATED = '17 de noviembre de 2026';

export const US_STATUS: { k: string; state: 'cerrado' | 'abierto' | 'parcial'; t: string; d: string }[] = [
  { k: 'B1/B2 turismo y negocios', state: 'cerrado', t: 'Suspendida para pasaporte venezolano', d: 'Suspendida desde el 9 de junio de 2025 (Proclamación 10949) y mantenida desde el 1 de enero de 2026 por la Proclamación 10998.' },
  { k: 'F, M y J estudios e intercambio', state: 'cerrado', t: 'Suspendidas para pasaporte venezolano', d: 'Incluidas en la misma restricción parcial.' },
  { k: 'Visas de inmigrante', state: 'parcial', t: 'Suspendidas, con excepciones muy limitadas', d: 'La Proclamación 10998 estrechó las excepciones para familiares. Revisión caso por caso.' },
  { k: 'Trabajo: H-1B, L-1, O-1, P y otras', state: 'abierto', t: 'No están en la suspensión', d: 'Requieren empleador o petición aprobada y entrevista fuera de Venezuela.' },
  { k: 'Doble nacionalidad', state: 'abierto', t: 'Excepción expresa', d: 'Quien viaja con un pasaporte de un país no restringido queda fuera de la proclamación. Con pasaporte europeo: ESTA o E-2.' },
  { k: 'Visas ya emitidas', state: 'abierto', t: 'Siguen siendo válidas', d: 'Las visas vigentes no se revocaron por la proclamación.' },
];

export const US_FACTS: [string, string][] = [
  ['Embajada en Caracas', 'Reanudó operaciones el 30 de marzo de 2026, pero sin servicios de visa. Las visas de no inmigrante se piden en un consulado fuera de Venezuela; Bogotá está designada para visas de inmigrante de residentes en Venezuela.'],
  ['Espera de cita B1/B2 en Bogotá', 'Unos 7 meses según el Departamento de Estado (septiembre de 2026). Solo útil para quien solicita con otro pasaporte.'],
  ['Tasas', 'Solicitud (MRV) de 185 USD para B1/B2, más la Visa Integrity Fee de 250 USD que algunos consulados ya cobran al emitir la visa.'],
  ['Fianza de visa', 'Venezuela está en la lista desde el 21 de enero de 2026. Desde el 3 de agosto de 2026 el programa es permanente, con fianzas de 10.000, 15.000 o 20.000 USD para quien califique a una B1/B2.'],
  ['ESTA (pasaporte europeo)', 'Unos 40 USD, estancias de hasta 90 días. España, Italia, Portugal, Alemania, Croacia y el Reino Unido están en el programa.'],
  ['E-2 inversionista', 'Disponible con pasaporte de España, Italia, Alemania, Croacia, Reino Unido o Portugal (desde 2024). Venezuela no tiene tratado.'],
];

export const US_SERVICES = [
  { id: 'diagnostico', name: 'Diagnóstico Estados Unidos', usd: 60, desc: 'Videollamada de 30 minutos: qué vía tienes abierta hoy (ESTA, visa con otro pasaporte, trabajo, E-2) y un plan por escrito.' },
  { id: 'esta', name: 'ESTA con pasaporte europeo', usd: 49, desc: 'Revisamos tu elegibilidad y preparamos la solicitud oficial. La tasa del gobierno se paga aparte en la web oficial.' },
  { id: 'visa', name: 'Visa con tu otro pasaporte', usd: 190, desc: 'Para dobles nacionales no europeos: DS-160, estrategia de consulado y cita, simulación de entrevista y revisión de documentos.' },
  { id: 'trabajo', name: 'Trabajo o inversión (E-2, H-1B, L-1, O-1)', usd: 120, desc: 'Consulta de estrategia y coordinación con un abogado de inmigración colegiado en EE. UU. Honorarios del caso según presupuesto.' },
] as const;
