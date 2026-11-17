import { isAdmin } from '@/lib/session';
import { listSubmissions } from '@/lib/db';

export async function GET() {
  if (!(await isAdmin())) return new Response('No autorizado', { status: 401 });
  const rows = await listSubmissions({ limit: 1000 });
  const cols = ['id', 'created_at', 'kind', 'status', 'case_id', 'ref', 'name', 'email', 'phone', 'service', 'amount_usd'];
  const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [cols.join(','), ...rows.map((r: any) => [...cols.map((c) => q(r[c])), q(JSON.stringify(r.payload))].join(','))].join('\n');
  return new Response('﻿' + csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="solicitudes.csv"' } });
}
