export const STAGE_LABELS = ['Consulta', 'Propuesta y pago', 'Búsqueda de documentos', 'Expediente', 'Presentación', 'Resolución'];

export interface DocItem { name: string; who: 'cliente' | 'nosotros'; status: 'pendiente' | 'gestion' | 'recibido' }

// Default checklist until the team sets tdl_docs_json on the HubSpot contact.
export const DEFAULT_DOCS: DocItem[] = [
  { name: 'Pasaporte vigente', who: 'cliente', status: 'pendiente' },
  { name: 'Tu partida de nacimiento apostillada', who: 'cliente', status: 'pendiente' },
  { name: 'Partidas de la línea familiar', who: 'cliente', status: 'pendiente' },
  { name: 'Partida del familiar europeo', who: 'nosotros', status: 'gestion' },
];

export function parseDocs(raw?: string): DocItem[] {
  try { const d = JSON.parse(raw || ''); if (Array.isArray(d) && d.length) return d; } catch { /* default */ }
  return DEFAULT_DOCS.map((d) => ({ ...d }));
}
