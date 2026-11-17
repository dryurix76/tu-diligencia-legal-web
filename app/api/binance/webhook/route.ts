import { NextResponse } from 'next/server';
import { verifyWebhook, binanceEnabled } from '@/lib/binance';
import { getByRef } from '@/lib/db';
import { confirmPaid } from '@/lib/fulfill';

// Binance Pay order notifications. Configure this URL in the merchant dashboard
// (it is also sent per order in webhookUrl).
export async function POST(req: Request) {
  if (!binanceEnabled()) return NextResponse.json({ returnCode: 'FAIL', returnMessage: 'not configured' }, { status: 503 });
  const raw = await req.text();
  const ok = await verifyWebhook(req.headers, raw).catch(() => false);
  if (!ok) return NextResponse.json({ returnCode: 'FAIL', returnMessage: 'invalid signature' }, { status: 400 });
  const body = JSON.parse(raw);
  if (body.bizType === 'PAY' && body.bizStatus === 'PAY_SUCCESS') {
    const data = typeof body.data === 'string' ? JSON.parse(body.data) : body.data || {};
    const ref: string = data.merchantTradeNo || (() => { try { return JSON.parse(data.passThroughInfo || '{}').ref; } catch { return ''; } })();
    const row = await getByRef(ref);
    if (row) {
      const p = row.payload;
      await confirmPaid({ ref, caseId: p.caseId, consult: p.consult, area: p.area, start: p.start, tz: p.tz, name: p.name, email: p.email, phone: p.phone, notes: p.notes, dealId: p.dealId, contactId: p.contactId, amountUsd: Number(row.amount_usd) || Number(data.totalFee) || 0, method: 'binance', providerId: String(body.bizIdStr || body.bizId || '') });
    } else {
      console.error('Binance webhook: referencia no encontrada', ref);
    }
  }
  return NextResponse.json({ returnCode: 'SUCCESS', returnMessage: null });
}
