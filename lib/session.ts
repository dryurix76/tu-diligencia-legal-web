import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { env } from './env';

const key = () => new TextEncoder().encode(env.sessionSecret);
export const SESSION_COOKIE = 'tdl_session';

export async function signToken(email: string, purpose: 'login' | 'session', ttl: string) {
  return new SignJWT({ email, purpose }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime(ttl).sign(key());
}

export async function verifyToken(token: string, purpose: 'login' | 'session'): Promise<string | null> {
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
