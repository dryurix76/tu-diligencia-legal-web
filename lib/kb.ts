import data from '@/content/kb.json';

export interface KBEntry { id: string; cat: string; q: string; a: string; kw: string[]; link?: [string, string] }
export interface Topic { hi: string; chips: string[] }

export const KB = data.kb as unknown as KBEntry[];
export const TOPICS = data.topics as Record<string, Topic>;
export const EVAL_HREF = data.evalHref as Record<string, string>;

export const norm = (s: string) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function matchKB(text: string, topic = 'general'): KBEntry | null {
  const t = norm(text);
  const chips = (TOPICS[topic] || TOPICS.general).chips;
  let best: KBEntry | null = null;
  let bestScore = 0;
  for (const e of KB) {
    let s = 0;
    for (const k of e.kw) if (t.includes(norm(k))) s += 1;
    if (s > 0 && chips.includes(e.id)) s += 0.5;
    if (s > bestScore) { bestScore = s; best = e; }
  }
  return best;
}
