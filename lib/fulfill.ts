import { env } from './env';
import { CONSULTS, AREAS, calEventTypeId } from './catalog';
import { createBooking } from './calcom';
import { updateDealStage, addNote } from './hubspot';
import { sendTemplate } from './whatsapp';
import { sendEmail, richEmail, notifyTeam } from './email';
import { getByRef, setStatus } from './db';

// One place that confirms a paid consultation, whatever the payment method
// (Stripe card, Binance Pay API, or manual Zelle/Binance confirmed in /admin).

export interface PaidOrder {
  ref: string; caseId: string; consult: string; area: string; start?: string; tz?: string;
  name: string; email: string; phone?: string; notes?: string; dealId?: string; contactId?: string;
  amountUsd: number; method: 'tarjeta' | 'binance' | 'zelle' | 'manual'; providerId?: string; alreadyBooked?: boolean;
}

export async function confirmPaid(o: PaidOrder) {
  const c = CONSULTS.find((x) => x.id === o.consult);
  const area = AREAS.find((a) => a.id === o.area);
  const first = (o.name || '').split(' ')[0];
  const site = env.siteUrl.replace(/\/$/, '');
  let whenText = 'Respuesta del abogado por escrito en un máximo de 48 horas';
  let meetingUrl = '';

  // Idempotency: skip if this order was already confirmed.
  const row = await getByRef(o.ref);
  if (row?.status === 'pagado') return { already: true };

  if (c?.kind === 'call' && o.start && area && !o.alreadyBooked) {
    const evt = calEventTypeId(area.id, c.id);
    if (evt) {
      const b = await createBooking({ eventTypeId: evt, start: o.start, name: o.name, email: o.email, phone: o.phone, timeZone: o.tz || 'America/Caracas', notes: `${o.caseId} · pagado (${o.method})\n${o.notes || ''}`, metadata: { caseId: o.caseId, ref: o.ref } });
      meetingUrl = b?.meetingUrl || '';
      await addNote(o.contactId || null, b ? `Reserva Cal.com ${b.uid} creada tras el pago.` : 'ERROR: no se pudo crear la reserva en Cal.com. Contactar al cliente.', o.dealId || null);
    }
  }
  if (c?.kind === 'call' && o.start) {
    whenText = new Date(o.start).toLocaleString('es-VE', { timeZone: o.tz || 'America/Caracas', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ` (hora de ${(o.tz || 'America/Caracas').split('/').pop()?.replace('_', ' ')})`;
  }

  if (o.dealId) await updateDealStage(o.dealId, env.hubspotStages.consultaPagada);
  await addNote(o.contactId || null, `Pago confirmado: USD ${o.amountUsd} vía ${o.method}${o.providerId ? ` (${o.providerId})` : ''}.`, o.dealId || null);
  if (row) await setStatus(row.id, 'pagado', { paidAt: new Date().toISOString(), method: o.method, providerId: o.providerId || '', meetingUrl });

  if (o.phone) await sendTemplate(o.phone, c?.kind === 'call' ? 'tdl_cita_confirmada' : 'tdl_pregunta_recibida', c?.kind === 'call' ? [first, whenText, meetingUrl || `${site}/mi-caso`] : [first, o.caseId]);

  await sendEmail(o.email, c?.kind === 'call' ? `Cita confirmada · ${o.caseId}` : `Consulta recibida · ${o.caseId}`, richEmail({
    title: c?.kind === 'call' ? `Tu cita está confirmada, ${first}` : `Recibimos tu consulta, ${first}`,
    caseId: o.caseId,
    service: area?.label,
    intro: `<p>Confirmamos el pago de tu <strong>${c?.name || 'consulta'}</strong> (USD ${o.amountUsd}, ${o.method}). Recuerda: si contratas el servicio en los próximos 30 días, este importe se descuenta del total.</p>`,
    summary: [['Consulta', c?.name || ''], ['Servicio', area?.label || ''], ['Cuándo', whenText], ['Enlace de la videollamada', meetingUrl], ['Importe', `USD ${o.amountUsd}`], ['Referencia', o.ref]],
    steps: c?.kind === 'call'
      ? ['Entra en <a href="' + site + '/mi-caso">Mi caso</a> y sube tus documentos (pasaporte, partidas): el abogado los revisa antes de la cita.', 'Prepara tus preguntas y, si puedes, el árbol familiar con fechas y lugares.', 'Te enviaremos recordatorios 24 h y 1 h antes por correo y WhatsApp.', 'Puedes reprogramar gratis hasta 24 h antes respondiendo a este correo.']
      : ['El abogado responde por escrito en un máximo de 48 horas hábiles.', 'Si quieres añadir documentos, súbelos en <a href="' + site + '/mi-caso">Mi caso</a>.', 'Si tu respuesta requiere una consulta más amplia, el importe pagado se descuenta.'],
    cta: { label: 'Ir a Mi caso', href: `${site}/mi-caso` },
  }));

  await notifyTeam(`Pago confirmado ${o.caseId} · ${c?.name} · USD ${o.amountUsd} (${o.method})`, {
    Caso: o.caseId, Referencia: o.ref, Cliente: o.name, Email: o.email, WhatsApp: o.phone, Consulta: c?.name, Servicio: area?.label, Cuándo: whenText, Método: o.method, 'ID pago': o.providerId, Notas: o.notes,
  }, o.email);
  return { ok: true };
}
