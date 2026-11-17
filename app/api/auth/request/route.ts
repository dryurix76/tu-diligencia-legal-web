import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';
import { findContactByEmail } from '@/lib/hubspot';
import { signToken } from '@/lib/session';
import { sendEmail, layout } from '@/lib/email';
import { limited, ipOf } from '@/lib/rate';

// Magic-link login for the client portal. Always answers the same way so it
// never reveals whether an email is a client.
export async function POST(req: Request) {
  if (limited('auth:' + ipOf(req), 5)) return NextResponse.json({ ok: true });
  const p = z.object({ email: z.string().trim().email() }).safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ error: 'Correo no válido.' }, { status: 400 });
  const email = p.data.email.toLowerCase();
  const contact = await findContactByEmail(email);
  if (contact || !env.hubspotToken) {
    const token = await signToken(email, 'login', '20m');
    const link = `${env.siteUrl}/api/auth/verify?token=${encodeURIComponent(token)}`;
    await sendEmail(email, 'Tu acceso a Mi caso', layout('Entra a Mi caso', '<p>Usa este botón para entrar. El enlace caduca en 20 minutos.</p>', { label: 'Entrar a Mi caso', href: link }));
    if (!env.resendKey) console.info('[auth] enlace de acceso (dev):', link);
  }
  return NextResponse.json({ ok: true });
}
