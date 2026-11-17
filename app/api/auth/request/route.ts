import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';
import { findContactByEmail } from '@/lib/hubspot';
import { emailKnown } from '@/lib/db';
import { signToken } from '@/lib/session';
import { sendEmail, richEmail, notifyTeam } from '@/lib/email';
import { limited, ipOf } from '@/lib/rate';

// Mi caso access. Known clients get a login link; anyone else gets a link to
// create their access (registration). The answer on screen is always the same.
export async function POST(req: Request) {
  if (limited('auth:' + ipOf(req), 5)) return NextResponse.json({ ok: true });
  const p = z.object({ email: z.string().trim().email(), name: z.string().trim().max(120).optional() }).safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ error: 'Correo no válido.' }, { status: 400 });
  const email = p.data.email.toLowerCase();
  const site = env.siteUrl.replace(/\/$/, '');
  const known = !!(await findContactByEmail(email).catch(() => null)) || (await emailKnown(email).catch(() => false));

  if (known) {
    const token = await signToken(email, 'login', '30m');
    const link = `${site}/api/auth/verify?token=${encodeURIComponent(token)}`;
    const sent = await sendEmail(email, 'Tu acceso a Mi caso', richEmail({
      title: 'Entra a Mi caso', intro: '<p>Pulsa el botón para entrar a tu expediente. El enlace es personal y caduca en 30 minutos. Si no pediste este acceso, ignora este correo.</p>',
      steps: ['Revisa el estado de tu expediente y el próximo paso.', 'Sube los documentos pendientes.', 'Consulta tus pagos, citas y mensajes de tu abogado.'],
      cta: { label: 'Entrar a Mi caso', href: link },
    }));
    if (!sent) console.info('[auth] enlace de acceso (sin proveedor de correo):', link);
  } else {
    const token = await signToken(email, 'register', '24h', { name: p.data.name || '' });
    const link = `${site}/api/auth/verify?token=${encodeURIComponent(token)}`;
    const sent = await sendEmail(email, 'Crea tu acceso a Mi caso', richEmail({
      title: 'Crea tu acceso a Mi caso',
      intro: '<p>Aún no tenemos un expediente con este correo. Pulsa el botón para crear tu acceso gratuito: podrás guardar tu pre-evaluación, subir documentos y seguir tu caso cuando lo abras. El enlace caduca en 24 horas.</p>',
      steps: ['Confirma tu correo con el botón.', `Haz la <a href="${site}/nacionalidad-espanola#evaluador">pre-evaluación gratuita</a> (2 minutos).`, `Cuando estés listo, <a href="${site}/agendar">agenda tu consulta</a> y tu expediente aparecerá en Mi caso.`],
      cta: { label: 'Crear mi acceso', href: link },
    }));
    if (!sent) console.info('[auth] enlace de registro (sin proveedor de correo):', link);
    await notifyTeam(`Solicitud de registro en Mi caso · ${email}`, { Correo: email, Nombre: p.data.name });
  }
  return NextResponse.json({ ok: true });
}
