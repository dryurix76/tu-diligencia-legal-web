import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { answer } from '@/lib/diana';
import { sendText } from '@/lib/whatsapp';

// Meta webhook: verification (GET) and incoming messages (POST).
// Diana answers WhatsApp messages with the same knowledge base as the website.

export async function GET(req: Request) {
  const u = new URL(req.url);
  if (u.searchParams.get('hub.mode') === 'subscribe' && u.searchParams.get('hub.verify_token') === env.waVerifyToken) {
    return new Response(u.searchParams.get('hub.challenge') || '', { status: 200 });
  }
  return new Response('forbidden', { status: 403 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const messages = body?.entry?.flatMap((e: any) => e.changes?.flatMap((c: any) => c.value?.messages || []) || []) || [];
  for (const msg of messages) {
    if (msg.type !== 'text') {
      await sendText(msg.from, 'Por ahora solo puedo leer mensajes de texto. Escríbeme tu pregunta y te respondo al instante.');
      continue;
    }
    const r = await answer(msg.text?.body || '', 'general');
    let text = r.text;
    if (r.intent === 'lawyer') text += `\n\nPara hablar con un abogado, agenda aquí (desde USD 35, descontable): ${env.siteUrl}/agendar`;
    else if (r.link) text += `\n\n${r.link[0]}: ${env.siteUrl}${r.link[1]}`;
    await sendText(msg.from, text);
  }
  return NextResponse.json({ ok: true });
}
