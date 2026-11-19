import { SITE_URL } from '@/lib/env';
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { signToken, ADMIN_COOKIE } from '@/lib/session';
import { limited, ipOf } from '@/lib/rate';

export async function POST(req: Request) {
  if (limited('admin:' + ipOf(req), 5, 5 * 60_000)) return NextResponse.json({ error: 'Demasiados intentos.' }, { status: 429 });
  const { password } = await req.json().catch(() => ({ password: '' }));
  const real = process.env.ADMIN_PASSWORD || '';
  const a = Buffer.from(String(password || '')), b = Buffer.from(real);
  if (!real || a.length !== b.length || !crypto.timingSafeEqual(a, b)) return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await signToken('admin', 'admin', '8h'), { httpOnly: true, secure: SITE_URL.startsWith('https'), sameSite: 'strict', path: '/', maxAge: 8 * 3600 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
