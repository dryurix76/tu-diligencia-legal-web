import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { env } from '@/lib/env';
import { stripe } from '@/lib/stripe';
import { CONSULTS, AREAS, calEventTypeId } from '@/lib/catalog';
import { createBooking } from '@/lib/calcom';
import { updateDealStage, addNote } from '@/lib/hubspot';
import { sendTemplate } from '@/lib/whatsapp';
import { sendEmail, layout } from '@/lib/email';

// Stripe → (Cal.com booking) → HubSpot stage "Consulta pagada" → WhatsApp + email confirmations.

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
    const c = CONSULTS.find((x) => x.id === m.consult);
    const area = AREAS.find((a) => a.id === m.area);
    const email = s.customer_details?.email || s.customer_email || '';
    const first = (m.name || '').split(' ')[0];
    let whenText = 'respuesta por escrito en 48 h';
    let meetingUrl = '';

    if (c?.kind === 'call' && m.start && area) {
      const evt = calEventTypeId(area.id, c.id);
      if (evt) {
        const b = await createBooking({ eventTypeId: evt, start: m.start, name: m.name, email, phone: m.phone, timeZone: m.tz || 'America/Caracas', notes: `${m.caseId} · pagado con Stripe\n${m.notes || ''}`, metadata: { caseId: m.caseId, dealId: m.dealId } });
        meetingUrl = b?.meetingUrl || '';
        await addNote(m.contactId || null, b ? `Reserva Cal.com ${b.uid} creada tras el pago.` : 'ERROR: no se pudo crear la reserva en Cal.com. Contactar al cliente.', m.dealId || null);
      }
      whenText = new Date(m.start).toLocaleString('es-VE', { timeZone: m.tz || 'America/Caracas', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    }

    if (m.dealId) await updateDealStage(m.dealId, env.hubspotStages.consultaPagada);
    await addNote(m.contactId || null, `Pago recibido: USD ${(s.amount_total || 0) / 100} (Stripe ${s.id}).`, m.dealId || null);
    if (m.phone) await sendTemplate(m.phone, c?.kind === 'call' ? 'tdl_cita_confirmada' : 'tdl_pregunta_recibida', c?.kind === 'call' ? [first, whenText, meetingUrl || `${env.siteUrl}/mi-caso`] : [first, m.caseId]);
    await sendEmail(email, c?.kind === 'call' ? 'Tu cita está confirmada' : 'Recibimos tu consulta', layout(
      c?.kind === 'call' ? 'Cita confirmada' : 'Consulta recibida',
      `<p>Hola ${first}, tu ${c?.name.toLowerCase() || 'consulta'} (${m.caseId}) está pagada.</p><p><b>${whenText}</b></p><p>Sube tus documentos en Mi caso antes de la cita: el abogado los revisa con antelación.</p>`,
      { label: 'Ir a Mi caso', href: `${env.siteUrl}/mi-caso` }));
  }
  return NextResponse.json({ received: true });
}
