import { SERVICES } from '@/lib/services';
import { LANDINGS } from '@/lib/landings';
import { KB } from '@/lib/kb';
import { abs } from '@/lib/seo';

// /llms.txt: a plain-text map of the site for AI assistants and answer engines.
export const dynamic = 'force-static';

export function GET() {
  const lines = [
    '# Tu Diligencia Legal',
    '',
    '> Consultora de derecho migratorio, parte de Certia Group, especializada en venezolanos: nacionalidad española, italiana, portuguesa, alemana, croata y británica, visados y residencias en Europa y el Caribe. Precios públicos, pre-evaluación gratuita y consultas con abogado de pago (desde USD 35, descontables del servicio).',
    '',
    '## Servicios',
    ...SERVICES.map((s) => `- [${s.h1a} ${s.h1b}](${abs('/' + s.slug)}): ${s.lede} Desde ${s.from}.`),
    ...LANDINGS.map((l) => `- [${l.title}](${abs(`/${l.parent}/${l.slug}`)}): ${l.description}`),
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
