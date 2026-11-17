// Minimal in-memory rate limiter (per server instance). For high traffic use Upstash/Vercel KV.
const hits = new Map<string, { n: number; t: number }>();

export function limited(key: string, max = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now - h.t > windowMs) { hits.set(key, { n: 1, t: now }); return false; }
  h.n += 1;
  return h.n > max;
}

export function ipOf(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
}
