import data from '@/content/services.json';
import type { EvalQuestion, EvalResult } from '@/components/Evaluator';

export interface ServicePageData {
  slug: string; title: string; topic: string; nat?: boolean; bg: string; crumb: string;
  h1a: string; h1b: string; lede: string; from: string; motif: string; service_name: string;
  vias_title: string; vias_lede: string; vias: { title: string; text: string; tag: string }[];
  eval_title: string; questions: EvalQuestion[]; results: EvalResult[];
  steps_lede: string; steps: { title: string; text: string; who: 'n' | 't' }[];
  docs: { head: string; items: string[] }[]; prices: { name: string; includes: string; price: string }[];
  faqs: { q: string; a: string }[]; placeholder: string; close_a: string; close_b: string;
}

export const SERVICES = data as unknown as ServicePageData[];
export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const NATS: [string, string, string][] = [
  ['/nacionalidad-espanola', 'Española', 'es'], ['/nacionalidad-italiana', 'Italiana', 'it'], ['/nacionalidad-portuguesa', 'Portuguesa', 'pt'],
  ['/nacionalidad-alemana', 'Alemana', 'de'], ['/nacionalidad-croata', 'Croata', 'hr'], ['/nacionalidad-britanica', 'Británica', 'uk'],
];
