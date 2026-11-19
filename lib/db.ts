import { neon } from '@neondatabase/serverless';

// Every form, registration and payment is stored here, so nothing is lost even if
// an email or WhatsApp provider fails. Uses Postgres (Neon via Vercel Marketplace).
// The table is created automatically on first use.

const URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
export const dbEnabled = () => !!URL;

let ready: Promise<unknown> | null = null;
function sql() { return neon(URL); }

async function init() {
  if (!ready) {
    const q = sql();
    ready = (async () => {
      await q`CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        kind TEXT NOT NULL,
        ref TEXT,
        case_id TEXT,
        email TEXT,
        name TEXT,
        phone TEXT,
        service TEXT,
        status TEXT NOT NULL DEFAULT 'nuevo',
        amount_usd NUMERIC,
        payload JSONB NOT NULL DEFAULT '{}'::jsonb
      )`;
      await q`CREATE INDEX IF NOT EXISTS submissions_email_idx ON submissions (lower(email))`;
      await q`CREATE INDEX IF NOT EXISTS submissions_ref_idx ON submissions (ref)`;
    })().catch((e) => { ready = null; throw e; }); // si falla, se reintenta en la próxima petición
  }
  return ready;
}

export type Kind = 'evaluador' | 'contacto' | 'guia' | 'registro' | 'consulta' | 'beca';
export type Status = 'nuevo' | 'pendiente_pago' | 'pagado' | 'contactado' | 'cerrado' | 'cancelado';

export interface Submission {
  id: number; created_at: string; updated_at: string; kind: Kind; ref: string | null; case_id: string | null;
  email: string | null; name: string | null; phone: string | null; service: string | null; status: Status;
  amount_usd: string | null; payload: Record<string, any>;
}

export async function saveSubmission(s: { kind: Kind; ref?: string; caseId?: string; email?: string; name?: string; phone?: string; service?: string; status?: Status; amountUsd?: number; payload?: Record<string, unknown> }): Promise<number | null> {
  if (!URL) { console.info('[db] (sin DATABASE_URL, no guardado)', s.kind, s.email); return null; }
  try {
    await init();
    const rows = await sql()`INSERT INTO submissions (kind, ref, case_id, email, name, phone, service, status, amount_usd, payload)
      VALUES (${s.kind}, ${s.ref || null}, ${s.caseId || null}, ${(s.email || '').toLowerCase() || null}, ${s.name || null}, ${s.phone || null}, ${s.service || null}, ${s.status || 'nuevo'}, ${s.amountUsd ?? null}, ${JSON.stringify(s.payload || {})}::jsonb)
      RETURNING id`;
    return rows[0]?.id ?? null;
  } catch (e) {
    console.error('[db] error al guardar', e);
    return null;
  }
}

export async function getByRef(ref: string): Promise<Submission | null> {
  if (!URL || !ref) return null;
  await init();
  const rows = await sql()`SELECT * FROM submissions WHERE ref = ${ref} ORDER BY id DESC LIMIT 1`;
  return (rows[0] as Submission) || null;
}

export async function getById(id: number): Promise<Submission | null> {
  if (!URL) return null;
  await init();
  const rows = await sql()`SELECT * FROM submissions WHERE id = ${id}`;
  return (rows[0] as Submission) || null;
}

export async function setStatus(id: number, status: Status, extra: Record<string, unknown> = {}) {
  if (!URL) return;
  await init();
  await sql()`UPDATE submissions SET status = ${status}, updated_at = now(), payload = payload || ${JSON.stringify(extra)}::jsonb WHERE id = ${id}`;
}

export async function emailKnown(email: string): Promise<boolean> {
  if (!URL) return false;
  await init();
  const rows = await sql()`SELECT 1 FROM submissions WHERE lower(email) = ${email.toLowerCase()} LIMIT 1`;
  return rows.length > 0;
}

export async function byEmail(email: string): Promise<Submission[]> {
  if (!URL) return [];
  await init();
  return (await sql()`SELECT * FROM submissions WHERE lower(email) = ${email.toLowerCase()} ORDER BY id DESC LIMIT 50`) as Submission[];
}

export async function listSubmissions(opts: { kind?: string; status?: string; q?: string; limit?: number } = {}): Promise<Submission[]> {
  if (!URL) return [];
  await init();
  const lim = Math.min(opts.limit || 200, 1000);
  const q = opts.q ? `%${opts.q.toLowerCase()}%` : null;
  return (await sql()`SELECT * FROM submissions
    WHERE (${opts.kind || null}::text IS NULL OR kind = ${opts.kind || null})
      AND (${opts.status || null}::text IS NULL OR status = ${opts.status || null})
      AND (${q}::text IS NULL OR lower(coalesce(email,'') || ' ' || coalesce(name,'') || ' ' || coalesce(case_id,'') || ' ' || coalesce(ref,'')) LIKE ${q})
    ORDER BY id DESC LIMIT ${lim}`) as Submission[];
}
