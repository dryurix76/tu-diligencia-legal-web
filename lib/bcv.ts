import { withTimeout } from './net';

// Tasa oficial del BCV (Bs. por USD) para cobrar en bolívares.
// Fuente: bcv.today (API JSON pública que lee bcv.org.ve cada 30 min), con espejo en jsDelivr.
// BCV_RATE en Vercel fija una tasa manual (útil si las fuentes fallan).
const SOURCES = ['https://bcv.today/api/v1/rate.json', 'https://cdn.jsdelivr.net/gh/grupoclip/bcv-api/site/api/v1/rate.json'];
let cache: { usd: number; date: string; at: number; source: string } | null = null;

export async function bcvRate(): Promise<{ usd: number; date: string; source: string } | null> {
  const manual = Number(process.env.BCV_RATE || 0);
  if (manual > 0) return { usd: manual, date: new Date().toISOString().slice(0, 10), source: 'manual' };
  if (cache && Date.now() - cache.at < 30 * 60e3) return cache;
  for (const url of SOURCES) {
    const r = await withTimeout(fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(6000) }).then((x) => (x.ok ? x.json() : null)), 7000, 'bcv ' + url);
    if (r && Number(r.USD) > 0) {
      cache = { usd: Number(r.USD), date: r.effective_date || r.date || '', at: Date.now(), source: url.includes('jsdelivr') ? 'jsdelivr' : 'bcv.today' };
      return cache;
    }
  }
  return cache; // última tasa conocida, aunque tenga más de 30 min
}

export const toBs = (usd: number, rate: number) => Math.round(usd * rate * 100) / 100;
export const fmtBs = (n: number) => 'Bs. ' + n.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
