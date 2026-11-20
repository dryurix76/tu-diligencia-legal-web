import { NextResponse, after } from 'next/server';
import { withTimeout, step } from '@/lib/net';
import { bcvRate, toBs, fmtBs } from '@/lib/bcv';
import { z } from 'zod';
import { env } from '@/lib/env';
import { CONSULTS, AREAS, calEventTypeId } from '@/lib/catalog';
import { scoreLead, caseIdFrom } from '@/lib/leadScore';
import { upsertContact, createDeal, addNote, setContactProps } from '@/lib/hubspot';
import { stripe } from '@/lib/stripe';
import { createBooking } from '@/lib/calcom';
import { sendTemplate } from '@/lib/whatsapp';
import { sendEmail, richEmail, notifyTeam } from '@/lib/email';
import { saveSubmission } from '@/lib/db';
import { binanceEnabled, createOrder } from '@/lib/binance';
import { limited, ipOf } from '@/lib/rate';

const Attribution = z.record(z.string(), z.string().max(200)).optional().default({});
const attrProps = (a: Record<string, string>) => ({ tdl_utm_source: a.utm_source, tdl_utm_medium: a.utm_medium, tdl_utm_campaign: a.utm_campaign, tdl_utm_term: a.utm_term, tdl_gclid: a.gclid || a.gbraid || a.wbraid, tdl_fbclid: a.fbclid, tdl_landing_page: a.landing_page, tdl_referrer: a.referrer });

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
  pay: z.enum(['card', 'zelle', 'binance', 'pagomovil']),
  terms: z.literal(true),
  early: z.literal(true),
  attribution: Attribution,
});


export const maxDuration = 60;
const PM_LABEL: Record<string, string> = { zelle: 'Zelle', binance: 'Binance Pay', pagomovil: 'Pago Móvil (Bs.)' };

export async function POST(req: Request) {
  if (limited('checkout:' + ipOf(req), 6)) return NextResponse.json({ error: 'Demasiados intentos. Espera un minuto.' }, { status: 429 });
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos.', issues: parsed.error.issues.map((i) => i.path.join('.')) }, { status: 400 });
  const d = parsed.data;
  const c = CONSULTS.find((x) => x.id === d.consult)!;
  const area = AREAS.find((a) => a.id === d.area)!;
  if (c.kind === 'call') {
    if (!d.start) return NextResponse.json({ error: 'Elige día y hora.' }, { status: 400 });
    if (new Date(d.start).getTime() < Date.now() + 2 * 3600e3 - 60e3) return NextResponse.json({ error: 'Ese horario ya no está disponible: elige uno con al menos 2 horas de margen.' }, { status: 400 });
  }

  const [firstname, ...rest] = d.name.split(' ');
  const s = scoreLead({ source: 'agendar', timing: d.timing, light: d.pre === 'verde' ? 'verde' : d.pre === 'ambar' ? 'ambar' : '' });
  const contactId = await withTimeout(upsertContact({ email: d.email, firstname, lastname: rest.join(' '), phone: d.phone, props: { tdl_service: area.label, tdl_timing: d.timing, tdl_country: d.country, tdl_lead_score: s.score, tdl_lead_tier: s.tier, tdl_source: 'agendar', ...attrProps(d.attribution) } }), 8000, 'hubspot.upsertContact');
  const caseId = caseIdFrom(contactId || d.email);
  if (contactId) await withTimeout(setContactProps(contactId, { tdl_case_id: caseId }), 6000, 'hubspot.setContactProps');
  const dealId = await withTimeout(createDeal(contactId, `${caseId} · ${c.name} · ${area.label}`, env.hubspotStages.pagoPendiente, c.usd), 8000, 'hubspot.createDeal');

  // Pago Móvil: importe en bolívares a la tasa BCV del momento (queda guardado con la tasa usada).
  let bs: { amount: number; rate: number; date: string } | null = null;
  if (d.pay === 'pagomovil') {
    if (!(env.pmBank && env.pmPhone && env.pmId)) return NextResponse.json({ error: 'Pago Móvil aún no está activo. Elige otro medio o escríbenos por WhatsApp.' }, { status: 503 });
    const r = await bcvRate();
    if (!r) return NextResponse.json({ error: 'No pudimos obtener la tasa BCV en este momento. Intenta en unos minutos o elige otro medio.' }, { status: 503 });
    bs = { amount: toBs(c.usd, r.usd), rate: r.usd, date: r.date };
  }
  const ref = `${caseId.replace(/\W/g, '')}${Date.now().toString(36).toUpperCase()}`;
  const whenText = c.kind === 'call' ? new Date(d.start).toLocaleString('es-VE', { timeZone: d.tz, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : 'Respuesta por escrito en 48 h';
  const order = { ref, caseId, consult: c.id, area: area.id, start: d.start, tz: d.tz, name: d.name, email: d.email, phone: d.phone, notes: d.notes, dealId: dealId || '', contactId: contactId || '', amountUsd: c.usd, method: d.pay, ...(bs ? { amountBs: bs.amount, bcvRate: bs.rate, bcvDate: bs.date } : {}) };

  await withTimeout(saveSubmission({ kind: 'consulta', ref, caseId, email: d.email, name: d.name, phone: d.phone, service: area.label, status: 'pendiente_pago', amountUsd: c.usd, payload: { ...order, country: d.country, timing: d.timing, pre: d.pre, attribution: d.attribution, consents: { terms: true, earlyStart: true, at: new Date().toISOString(), version: 'terminos-2026-11-17' } } }), 8000, 'db.saveSubmission');
  after(() => step('hubspot.addNote', () => addNote(contactId, `Solicitud de <b>${c.name}</b> (${area.label}). Pago: ${d.pay}. Ref ${ref}. ${c.kind === 'call' ? 'Hora: ' + whenText : ''}<br>${d.notes}`, dealId)));
  after(() => step('email.notifyTeam', () => notifyTeam(`Nueva consulta (${d.pay}) ${caseId} · ${c.name} · USD ${c.usd}`, { Caso: caseId, Referencia: ref, Cliente: d.name, Email: d.email, WhatsApp: d.phone, País: d.country, Consulta: c.name, Servicio: area.label, Cuándo: whenText, 'Medio de pago': PM_LABEL[d.pay] || 'Tarjeta', ...(bs ? { 'Importe en Bs.': `${fmtBs(bs.amount)} (tasa BCV ${bs.rate} del ${bs.date})` } : {}), Estado: 'Pendiente de pago', '¿Cuándo empezar?': d.timing, 'Pre-evaluación': d.pre, Notas: d.notes, Consentimientos: 'Condiciones + inicio anticipado (art. 103.a TRLGDCU) aceptados', Origen: d.attribution }, d.email)));

  const site = env.siteUrl.replace(/\/$/, '');
  const meta = { ref, dealId: dealId || '', contactId: contactId || '', caseId, consult: c.id, area: area.id, start: d.start, tz: d.tz, name: d.name, phone: d.phone, notes: d.notes.slice(0, 450), gclid: (d.attribution.gclid || '').slice(0, 200) };

  if (d.pay === 'card') {
    const st = stripe();
    if (!st) return NextResponse.json({ error: 'El pago con tarjeta aún no está activo. Elige Binance Pay o Zelle, o escríbenos por WhatsApp.' }, { status: 503 });
    const session = await st.checkout.sessions.create({
      mode: 'payment', customer_email: d.email, locale: 'es',
      line_items: [{ quantity: 1, price_data: { currency: 'usd', unit_amount: c.usd * 100, product_data: { name: `${c.name} · ${area.label}`, description: 'Se descuenta del servicio si contratas en 30 días.' } } }],
      metadata: meta, payment_intent_data: { metadata: meta },
      success_url: `${site}/agendar/confirmado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/agendar?cancelado=1`,
    });
    return NextResponse.json({ url: session.url });
  }

  if (d.pay === 'binance' && binanceEnabled()) {
    try {
      const o = await createOrder({ ref, amountUsd: c.usd, description: `${c.name} · ${area.label} · ${caseId}`, returnUrl: `${site}/agendar/confirmado?ref=${ref}`, cancelUrl: `${site}/agendar?cancelado=1`, webhookUrl: `${site}/api/binance/webhook`, passThrough: { ref } });
      return NextResponse.json({ url: o.checkoutUrl });
    } catch (e) {
      console.error(e);
      // Falls back to manual payment instructions below.
    }
  }

  // Manual payment (Zelle, or Binance without API): the slot is reserved now and
  // the team confirms the transfer from /admin, which sends the confirmation.
  let bookingNote = '';
  if (c.kind === 'call') {
    const evt = calEventTypeId(area.id, c.id);
    if (evt) {
      const b = await withTimeout(createBooking({ eventTypeId: evt, start: d.start, name: d.name, email: d.email, phone: d.phone, timeZone: d.tz, notes: `PAGO PENDIENTE (${d.pay}) · ${caseId} · ref ${ref}\n${d.notes}`, metadata: { caseId, ref } }), 10000, 'calcom.createBooking');
      bookingNote = b ? `Reserva Cal.com ${b.uid} (pendiente de pago)` : 'No se pudo crear la reserva en Cal.com';
    }
  }
  const instructions = d.pay === 'zelle'
    ? `Envía USD ${c.usd} por Zelle a ${env.zelleEmail} (titular: ${env.zelleName}). En el concepto escribe: ${ref}.`
    : d.pay === 'pagomovil' && bs
      ? `Haz un Pago Móvil por ${fmtBs(bs.amount)} a: banco ${env.pmBank}, teléfono ${env.pmPhone}, ${env.pmId}${env.pmName ? ` (${env.pmName})` : ''}. En el concepto escribe: ${ref}. Monto calculado a la tasa BCV de ${bs.rate.toLocaleString('es-VE', { maximumFractionDigits: 4 })} Bs./USD (${bs.date}); válido hasta las 23:59 de hoy.`
      : `Paga ${c.usd} USDT con Binance Pay al ID ${env.binancePayId}. En la nota escribe: ${ref}.`;
  const amountText = bs ? `${fmtBs(bs.amount)} (USD ${c.usd})` : `USD ${c.usd}`;
  after(async () => {
  await step('hubspot.addNote', () => addNote(contactId, `Pago manual pendiente vía ${d.pay}. Ref ${ref}. ${bookingNote}`, dealId));
  if (d.phone) await step('whatsapp', () => sendTemplate(d.phone, 'tdl_pago_pendiente', [firstname, caseId, amountText, instructions]));
  await step('email.cliente', () => sendEmail(d.email, `Completa tu pago · ${caseId}`, richEmail({
    title: `Reservamos tu ${c.name.toLowerCase()}, ${firstname}`,
    caseId, service: area.label,
    intro: `<p>Tu reserva está hecha. Para confirmarla, completa el pago:</p><p style="background:#F4EFE6;border-radius:8px;padding:14px 16px;font-size:15px"><strong>${instructions}</strong></p><p>Responde a este correo con el comprobante (captura de pantalla) para agilizar la confirmación. Confirmamos en un máximo de 1 hora hábil. Si no recibimos el pago, la reserva se libera.</p>`,
    summary: [['Consulta', c.name], ['Servicio', area.label], ['Cuándo', whenText], ['Importe', amountText], ['Medio de pago', PM_LABEL[d.pay]], ['Referencia', ref]],
    steps: ['Paga con la referencia indicada.', 'Envíanos el comprobante respondiendo a este correo o por WhatsApp.', 'Recibirás la confirmación de la cita y el enlace de la videollamada.', 'Sube tus documentos en Mi caso antes de la cita.'],
    cta: { label: 'Ir a Mi caso', href: `${site}/mi-caso` },
  }), { replyTo: process.env.TEAM_NOTIFICATION_EMAIL || 'info@tudiligencialegal.com' }));
  });
  return NextResponse.json({ manual: true, caseId, ref, instructions, method: d.pay, amountBs: bs?.amount, pm: d.pay === 'pagomovil' ? { bank: env.pmBank, phone: env.pmPhone, id: env.pmId, name: env.pmName } : undefined });
}
