import Anthropic from '@anthropic-ai/sdk';
import { env } from './env';
import { KB, matchKB } from './kb';

// Diana's answer engine, shared by the web chat and WhatsApp.
// 1) Claude answers using ONLY the site's knowledge base, with strict rules.
// 2) Without an API key (or on error) it falls back to keyword matching.

export interface DianaAnswer {
  text: string;
  link?: [string, string];
  intent: 'info' | 'lawyer' | 'unknown';
}

const LINKS: Record<string, [string, string]> = {
  agendar: ['Agendar consulta', '/agendar'],
  expres: ['Consulta exprés · USD 35', '/agendar?tipo=expres'],
  tarifas: ['Ver tarifas', '/tarifas'],
  ayuda: ['Centro de respuestas', '/ayuda'],
  micaso: ['Ir a Mi caso', '/mi-caso'],
  es: ['Pre-evaluación España', '/nacionalidad-espanola#evaluador'],
  it: ['Pre-evaluación Italia', '/nacionalidad-italiana#evaluador'],
  pt: ['Pre-evaluación Portugal', '/nacionalidad-portuguesa#evaluador'],
  de: ['Pre-evaluación Alemania', '/nacionalidad-alemana#evaluador'],
  hr: ['Pre-evaluación Croacia', '/nacionalidad-croata#evaluador'],
  uk: ['Pre-evaluación Reino Unido', '/nacionalidad-britanica#evaluador'],
  visas: ['Ver visados', '/visados'],
  negocios: ['Visas de negocios', '/negocios'],
  caribe: ['Visados Caribe', '/caribe'],
};

const SYSTEM = `Eres Diana, la asistente virtual de Tu Diligencia Legal (consultora de derecho migratorio, parte de Certia Group) para venezolanos que quieren nacionalidad europea o visados.

REGLAS ESTRICTAS:
- Responde SOLO con la información de la BASE DE CONOCIMIENTO. Si no está ahí, dilo y ofrece la consulta exprés por escrito (USD 35) o agendar con un abogado.
- Nunca des asesoría legal personalizada ni digas "sí calificas": di "tu perfil parece viable, un abogado debe confirmarlo".
- Nunca garantices resultados. Nunca inventes precios, plazos ni requisitos.
- Nunca des datos de contacto personales de abogados.
- Español neutro, cercano, frases cortas. Máximo 70 palabras.
- Si la persona quiere hablar con un abogado, contratar, o su caso es concreto, intent = "lawyer".
- Termina orientando al siguiente paso útil (pre-evaluación gratuita, centro de respuestas o consulta pagada).

Devuelve SOLO JSON válido: {"text": "...", "link": "<una de: ${Object.keys(LINKS).join(', ')} o vacío>", "intent": "info" | "lawyer" | "unknown"}

BASE DE CONOCIMIENTO:
${KB.map((e) => `- [${e.cat}] ${e.q} → ${e.a}`).join('\n')}`;

let client: Anthropic | null = null;

export async function answer(question: string, topic = 'general', history: { role: 'user' | 'assistant'; content: string }[] = []): Promise<DianaAnswer> {
  const q = question.slice(0, 600);
  if (env.anthropicKey) {
    try {
      client = client || new Anthropic({ apiKey: env.anthropicKey });
      const msg = await client.messages.create({
        model: env.anthropicModel,
        max_tokens: 400,
        system: SYSTEM + `\n\nLa persona está en la sección: ${topic}.`,
        messages: [...history.slice(-6), { role: 'user', content: q }],
      });
      const raw = msg.content.map((b) => (b.type === 'text' ? b.text : '')).join('').trim();
      const json = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1));
      return { text: String(json.text || ''), link: LINKS[json.link] || undefined, intent: json.intent === 'lawyer' ? 'lawyer' : json.intent === 'unknown' ? 'unknown' : 'info' };
    } catch (e) {
      console.error('Diana LLM error, usando respaldo', e);
    }
  }
  if (/abogad|asesor|humano|contratar|hablar con/.test(q.toLowerCase())) return { text: 'Con gusto te paso con un abogado.', intent: 'lawyer' };
  const e = matchKB(q, topic);
  if (e) return { text: e.a, link: e.link, intent: 'info' };
  return { text: 'No tengo una respuesta segura para eso y prefiero no adivinar. Un abogado puede responderte por escrito en 48 h por USD 35.', link: LINKS.expres, intent: 'unknown' };
}
