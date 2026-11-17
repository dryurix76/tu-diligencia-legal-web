import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { verifyToken, signToken, SESSION_COOKIE } from '@/lib/session';

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') || '';
  const email = await verifyToken(token, 'login');
  if (!email) return NextResponse.redirect(`${env.siteUrl}/mi-caso?error=enlace`);
  const res = NextResponse.redirect(`${env.siteUrl}/mi-caso`);
  res.cookies.set(SESSION_COOKIE, await signToken(email, 'session', '7d'), { httpOnly: true, secure: env.siteUrl.startsWith('https'), sameSite: 'lax', path: '/', maxAge: 7 * 86400 });
  return res;
}
