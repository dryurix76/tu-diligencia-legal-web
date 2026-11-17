import { NextResponse } from 'next/server';
import { z } from 'zod';

const Attribution = z.record(z.string(), z.string().max(200)).optional().default({});
const attrProps = (a: Record<string, string>) => ({ tdl_utm_source: a.utm_source, tdl_utm_medium: a.utm_medium, tdl_utm_campaign: a.utm_campaign, tdl_utm_term: a.utm_term, tdl_gclid: a.gclid || a.gbraid || a.wbraid, tdl_fbclid: a.fbclid, tdl_landing_page: a.landing_page, tdl_referrer: a.referrer });
import { env } from '@/lib/env';
import { CONSULTS, AREAS, calEventTypeId } from '@/lib/catalog';
import { scoreLead, caseIdFrom } from '@/lib/leadScore';
import { upsertContact, createDeal, addNote, setContactProps } from '@/lib/hubspot';
import { stripe } from '@/lib/stripe';
import { createBooking } from '@/lib/calcom';
import { sendTemplate } from '@/lib/whatsapp';
import { sendEmail, layout } from '@/lib/email';
import { limited, ipOf } from '@/lib/rate';

const Body = z.object({
  consult: z.enum(CONSULTS.map((c) => c.id) as [string, ...string[]]),
  area: z.enum(AREAS.map((a) => a.id) as [string, ...string[]]),
  start: z.string().max(40).optional().default(''),
  tz: z.string().max(60).default('America/Caracas'),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).default(''),
  country: z.string().max(60).default(''),
  notes: z.string().max(3000).default(''),
  timing: z.enum(['now', '3m', '6m', 'info', '']).default(''),
  pre: z.enum(['verde', 'ambar', 'no', '']).default(''),
  pay: z.enum(['card', 'zelle', 'binance']),
  terms: z.literal(true),
  attribution: Attribution,
});

export async function POST(req: Request) {
  if (limited('checkout:' + ipOf(req), 6)) return NextResponse.json({ error: 'Demasiados intentos. Espera un minuto.' }, { status: 429 });
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos.', issues: parsed.error.issues.map((i) => i.path.join('.')) }, { status: 400 });
  const d = parsed.data;
  const c = CONSULTS.find((x) => x.id === d.consult)!;
  const area = AREAS.find((a) => a.id === d.area)!;
  if (c.kind === 'call' && !d.start) return NextResponse.json({ error: 'Elige día y hora.' }, { status: 400 });

  const [firstname, ...rest] = d.name.split(' ');
  const s = scoreLead({ source: 'agendar', timing: d.timing, light: d.pre === 'verde' ? 'verde' : d.pre === 'ambar' ? 'ambar' : '' });
  const contactId = await upsertContact({ email: d.email, firstname, lastname: rest.join(' '), phone: d.phone, props: { tdl_service: area.label, tdl_timing: d.timing, tdl_country: d.country, tdl_lead_score: s.score, tdl_lead_tier: s.tier, tdl_source: 'agendar', ...attrProps(d.attribution) } });
  const caseId = caseIdFrom(contactId || d.email);
  if (contactId) await setContactProps(contactId, { tdl_case_id: caseId });
  const dealId = await createDeal(contactId, `${caseId} · ${c.name} · ${area.label}`, env.hubspotStages.pagoPendiente, c.usd);
  await addNote(contactId, `Solicitud de <b>${c.name}</b> (${area.label}). Pago: ${d.pay}. ${d.start ? 'Hora: ' + d.start + ' (' + d.tz + ')' : ''}<br>${d.notes}`, dealId);

  const meta = { dealId: dealId || '', contactId: contactId || '', caseId, consult: c.id, area: area.id, start: d.start, tz: d.tz, name: d.name, phone: d.phone, notes: d.notes.slice(0, 450), gclid: (d.attribution.gclid || '').slice(0, 200), utm_campaign: (d.attribution.utm_campaign || '').slice(0, 200) };

  if (d.pay === 'card') {
    const st = stripe();
    if (!st) return NextResponse.json({ error: 'Pagos con tarjeta aún no configurados. Elige Zelle o Binance, o escríbenos por WhatsApp.' }, { status: 503 });
    const session = await st.checkout.sessions.create({
      mode: 'payment',
      customer_email: d.email,
      line_items: [{ quantity: 1, price_data: { currency: 'usd', unit_amount: c.usd * 100, product_data: { name: `${c.name} · ${area.label}`, description: 'Se descuenta del servicio si contratas en 30 días.' } } }],
      metadata: meta,
      payment_intent_data: { metadata: meta },
      locale: 'es',
      success_url: `${env.siteUrl}/agendar/confirmado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.siteUrl}/agendar?cancelado=1`,
    });
    return NextResponse.json({ url: session.url });
  }

  // Manual methods (Zelle / Binance Pay): the slot is booked now and flagged as
  // "pending payment"; the team confirms the transfer and moves the deal in HubSpot.
  let bookingNote = '';
  if (c.kind === 'call') {
    const evt = calEventTypeId(area.id, c.id);
    if (evt) {
      const b = await createBooking({ eventTypeId: evt, start: d.start, name: d.name, email: d.email, phone: d.phone, timeZone: d.tz, notes: `PAGO PENDIENTE (${d.pay}) · ${caseId}\n${d.notes}`, metadata: { caseId, dealId: dealId || '' } });
      bookingNote = b ? `Reserva Cal.com ${b.uid} (pendiente de pago)` : 'No se pudo crear la reserva en Cal.com';
    }
  }
  await addNote(contactId, `Pago manual pendiente vía ${d.pay}. Referencia ${caseId}. ${bookingNote}`, dealId);
  const instructions = d.pay === 'zelle'
    ? `Envía USD ${c.usd} por Zelle a ${env.zelleEmail} (${env.zelleName}) con la referencia ${caseId}.`
    : `Paga USD ${c.usd} en USDT por Binance Pay al ID ${env.binancePayId} con la referencia ${caseId}.`;
  if (d.phone) await sendTemplate(d.phone, 'tdl_pago_pendiente', [firstname, caseId, `USD ${c.usd}`, instructions]);
  await sendEmail(d.email, `Instrucciones de pago · ${caseId}`, layout('Completa tu pago', `<p>Hola ${firstname}, reservamos tu ${c.name.toLowerCase()}.</p><p><b>${instructions}</b></p><p>Confirmamos tu pago en un máximo de 1 hora hábil. Si no recibimos el pago, la reserva se libera.</p>`));
  if (env.teamEmail) await sendEmail(env.teamEmail, `Pago ${d.pay} pendiente ${caseId}`, layout(`Confirmar pago ${caseId}`, `<p>${d.name} · ${d.email} · ${d.phone}</p><p>${c.name} · USD ${c.usd} · ${area.label}</p><p>${bookingNote}</p>`));
  return NextResponse.json({ manual: true, caseId, instructions });
}
