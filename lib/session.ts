import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { env } from './env';

const key = () => new TextEncoder().encode(env.sessionSecret);
export const SESSION_COOKIE = 'tdl_session';

export type Purpose = 'login' | 'session' | 'register' | 'admin' | 'download';

export async function signToken(email: string, purpose: Purpose, ttl: string, extra: Record<string, string> = {}) {
  return new SignJWT({ email, purpose, ...extra }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime(ttl).sign(key());
}

export async function verifyToken(token: string, purpose: Purpose): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, key());
    return payload.purpose === purpose && typeof payload.email === 'string' ? payload.email : null;
  } catch {
    return null;
  }
}

export async function currentEmail(): Promise<string | null> {
  const jar = await cookies();
  const t = jar.get(SESSION_COOKIE)?.value;
  return t ? verifyToken(t, 'session') : null;
}

export async function readToken(token: string, purpose: Purpose): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, key());
    return payload.purpose === purpose ? (payload as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE = 'tdl_admin';

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const t = jar.get(ADMIN_COOKIE)?.value;
  return !!t && !!(await verifyToken(t, 'admin'));
}
