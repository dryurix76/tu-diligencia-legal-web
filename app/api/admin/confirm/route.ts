import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/session';
import { getById } from '@/lib/db';
import { confirmPaid } from '@/lib/fulfill';

// Manual payment confirmation (Zelle / Binance without API) from the admin panel.
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { id } = await req.json().catch(() => ({ id: 0 }));
  const row = await getById(Number(id));
  if (!row || row.kind !== 'consulta') return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  const p = row.payload;
  const r = await confirmPaid({ ref: row.ref || '', caseId: p.caseId, consult: p.consult, area: p.area, start: p.start, tz: p.tz, name: p.name, email: p.email, phone: p.phone, notes: p.notes, dealId: p.dealId, contactId: p.contactId, amountUsd: Number(row.amount_usd) || 0, method: p.method === 'zelle' ? 'zelle' : 'binance', providerId: 'confirmado en panel', alreadyBooked: true });
  return NextResponse.json(r);
}
