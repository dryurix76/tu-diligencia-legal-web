import { NextResponse } from 'next/server';
import { z } from 'zod';
import { answer } from '@/lib/diana';
import { limited, ipOf } from '@/lib/rate';

const Body = z.object({
  message: z.string().trim().min(1).max(600),
  topic: z.string().max(20).optional().default('general'),
  history: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(1200) })).max(12).optional().default([]),
});

export async function POST(req: Request) {
  if (limited('chat:' + ipOf(req), 25)) return NextResponse.json({ text: 'Vas muy rápido. Espera un momento y vuelve a preguntar.', intent: 'info' }, { status: 429 });
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ text: 'No entendí tu mensaje.', intent: 'unknown' }, { status: 400 });
  const r = await answer(parsed.data.message, parsed.data.topic, parsed.data.history);
  return NextResponse.json(r);
}
