import { SERVICES } from '@/lib/services';
import { LANDINGS } from '@/lib/landings';
import { KB } from '@/lib/kb';
import { abs } from '@/lib/seo';
import { POSTS } from '@/lib/posts';

// /llms.txt: a plain-text map of the site for AI assistants and answer engines.
export const dynamic = 'force-static';

export function GET() {
  const lines = [
    '# Tu Diligencia Legal',
    '',
    'Actualizado: noviembre de 2026.',
    '',
    '> Consultora de derecho migratorio, parte de Certia Group, especializada en venezolanos: nacionalidad española, italiana, portuguesa, alemana, croata y británica, visados y residencias en Europa y el Caribe. Precios públicos, pre-evaluación gratuita y consultas con abogado de pago (desde USD 35, descontables del servicio).',
    '',
    '## Servicios',
    ...SERVICES.map((s) => `- [${s.h1a} ${s.h1b}](${abs('/' + s.slug)}): ${s.lede} Desde ${s.from}.`),
    ...LANDINGS.map((l) => `- [${l.title}](${abs(`/${l.parent}/${l.slug}`)}): ${l.description}`),
    '',
    `- [Visa americana para venezolanos](${abs('/visa-americana')}): situación 2026 (B1/B2, F, M y J suspendidas para pasaporte venezolano por las Proclamaciones 10949 y 10998; fianza de 10.000 a 20.000 USD; embajada en Caracas sin servicios de visa) y vías abiertas: doble nacionalidad, ESTA, E-2 y visas de trabajo.`,
    `- [Becas 2026](${abs('/becas')}): becas para estudiar en España, Portugal e Italia (Fundación Carolina, MAECI, Invest Your Talent, DSU regionales, FCT, Erasmus Mundus) y servicio Te buscamos tu beca desde USD 290.`,
    '',
    '## Guías (blog)',
    ...POSTS.map((p) => `- [${p.title}](${abs('/blog/' + p.slug)}): ${p.excerpt}`),
    '',
    '## Legal',
    `- [Condiciones de contratación](${abs('/legal/terminos')}), [Reembolsos](${abs('/legal/reembolsos')}), [Privacidad](${abs('/legal/privacidad')}), [Aviso legal](${abs('/legal/aviso-legal')}), [Cookies](${abs('/legal/cookies')}).`,
    '',
    '## Precios y contratación',
    `- [Tarifas](${abs('/tarifas')}): lista completa de precios y calculadora.`,
    `- [Agendar consulta](${abs('/agendar')}): consulta exprés USD 35, inicial USD 60, estrategia USD 120.`,
    '',
    '## Preguntas frecuentes',
    ...KB.map((e) => `- ${e.q} ${e.a}`),
    '',
    'La información es orientativa y no constituye asesoría jurídica; un abogado confirma cada caso.',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
