import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { verifyToken, readToken, signToken, SESSION_COOKIE } from '@/lib/session';
import { upsertContact } from '@/lib/hubspot';
import { saveSubmission } from '@/lib/db';

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') || '';
  const site = env.siteUrl.replace(/\/$/, '');
  let email = await verifyToken(token, 'login');
  if (!email) {
    const reg = await readToken(token, 'register');
    if (reg && typeof reg.email === 'string') {
      email = reg.email;
      const name = String(reg.name || '');
      await upsertContact({ email, firstname: name.split(' ')[0] || undefined, props: { tdl_source: 'registro' } });
      await saveSubmission({ kind: 'registro', email, name, payload: { at: new Date().toISOString() } });
    }
  }
  if (!email) return NextResponse.redirect(`${site}/mi-caso?error=enlace`);
  const res = NextResponse.redirect(`${site}/mi-caso`);
  res.cookies.set(SESSION_COOKIE, await signToken(email, 'session', '7d'), { httpOnly: true, secure: site.startsWith('https'), sameSite: 'lax', path: '/', maxAge: 7 * 86400 });
  return res;
}
