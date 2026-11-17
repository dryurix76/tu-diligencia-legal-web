import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { env } from '@/lib/env';
import { stripe } from '@/lib/stripe';
import { confirmPaid } from '@/lib/fulfill';

export async function POST(req: Request) {
  const st = stripe();
  if (!st || !env.stripeWebhookSecret) return NextResponse.json({ error: 'not configured' }, { status: 503 });
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = st.webhooks.constructEvent(raw, req.headers.get('stripe-signature') || '', env.stripeWebhookSecret);
  } catch {
    return NextResponse.json({ error: 'firma inválida' }, { status: 400 });
  }
  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as Stripe.Checkout.Session;
    const m = (s.metadata || {}) as Record<string, string>;
    await confirmPaid({
      ref: m.ref || s.id, caseId: m.caseId, consult: m.consult, area: m.area, start: m.start, tz: m.tz, name: m.name,
      email: s.customer_details?.email || s.customer_email || '', phone: m.phone, notes: m.notes, dealId: m.dealId, contactId: m.contactId,
      amountUsd: (s.amount_total || 0) / 100, method: 'tarjeta', providerId: s.id,
    });
  }
  return NextResponse.json({ received: true });
}
