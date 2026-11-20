import { NextResponse, after } from 'next/server';
import { z } from 'zod';
import { getByRef, setStatus } from '@/lib/db';
import { notifyTeam } from '@/lib/email';
import { step } from '@/lib/net';
import { limited, ipOf } from '@/lib/rate';

// El cliente reporta un pago manual (Pago Móvil, Zelle o Binance sin API) con su número de referencia.
// Queda guardado en el expediente y el equipo lo verifica y confirma desde el panel.
const Body = z.object({
  ref: z.string().trim().min(4).max(60),
  email: z.string().trim().email(),
  reference: z.string().trim().min(4).max(40),
  bank: z.string().trim().max(60).optional().default(''),
  payer: z.string().trim().max(40).optional().default(''),
  date: z.string().trim().max(20).optional().default(''),
});

export async function POST(req: Request) {
  if (limited('payreport:' + ipOf(req), 8)) return NextResponse.json({ error: 'Demasiados intentos. Espera un minuto.' }, { status: 429 });
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos del pago.' }, { status: 400 });
  const d = parsed.data;
  const row = await getByRef(d.ref);
  if (!row || (row.email || '').toLowerCase() !== d.email.toLowerCase()) return NextResponse.json({ error: 'No encontramos una reserva con esa referencia y ese correo.' }, { status: 404 });
  if (row.status === 'pagado') return NextResponse.json({ ok: true, already: true });
  const report = { reference: d.reference, bank: d.bank, payer: d.payer, date: d.date, at: new Date().toISOString() };
  await setStatus(row.id, row.status, { payment_report: report });
  const p = row.payload || {};
  after(() => step('email.notifyTeam', () => notifyTeam(`Pago reportado ${row.case_id} · ${p.method || ''} · ref ${d.reference}`, {
    Caso: row.case_id, Referencia: row.ref, Cliente: row.name, Email: row.email, 'Medio de pago': p.method,
    Importe: p.amountBs ? `Bs. ${p.amountBs} (USD ${p.amountUsd}, tasa ${p.bcvRate})` : `USD ${p.amountUsd}`,
    'N.º de referencia bancaria': d.reference, 'Banco de origen': d.bank, 'Teléfono / cédula del pagador': d.payer, 'Fecha del pago': d.date,
    Acción: 'Verifica el pago en el banco y pulsa «Confirmar pago» en el panel.',
  }, row.email || undefined)));
  return NextResponse.json({ ok: true });
}
