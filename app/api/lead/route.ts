import { NextResponse } from 'next/server';
import { z } from 'zod';

const Attribution = z.record(z.string(), z.string().max(200)).optional().default({});
const attrProps = (a: Record<string, string>) => ({ tdl_utm_source: a.utm_source, tdl_utm_medium: a.utm_medium, tdl_utm_campaign: a.utm_campaign, tdl_utm_term: a.utm_term, tdl_gclid: a.gclid || a.gbraid || a.wbraid, tdl_fbclid: a.fbclid, tdl_landing_page: a.landing_page, tdl_referrer: a.referrer });
import { env } from '@/lib/env';
import { scoreLead, caseIdFrom } from '@/lib/leadScore';
import { upsertContact, createDeal, addNote, setContactProps } from '@/lib/hubspot';
import { sendTemplate } from '@/lib/whatsapp';
import { sendEmail, layout } from '@/lib/email';
import { limited, ipOf } from '@/lib/rate';

// Receives every form on the site: evaluators, contact forms and guide downloads.
// Scores the lead, writes it to HubSpot and answers instantly by WhatsApp and email.

const Lead = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(''),
  country: z.string().max(60).optional().default(''),
  service: z.string().max(120).optional().default('Aún no lo sé'),
  timing: z.enum(['now', '3m', '6m', 'info', '']).optional().default(''),
  light: z.enum(['verde', 'ambar', 'rojo', '']).optional().default(''),
  answers: z.array(z.string().max(200)).max(12).optional().default([]),
  source: z.enum(['evaluador', 'contacto', 'guia']),
  message: z.string().max(3000).optional().default(''),
  reason: z.string().max(120).optional().default(''),
  page: z.string().max(200).optional().default(''),
  consent: z.literal(true),
  website: z.string().max(0).optional(), // honeypot: must stay empty
  attribution: Attribution,
});

export async function POST(req: Request) {
  if (limited('lead:' + ipOf(req), 8)) return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta en un minuto.' }, { status: 429 });
  const parsed = Lead.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los campos del formulario.', issues: parsed.error.issues.map((i) => i.path.join('.')) }, { status: 400 });
  const d = parsed.data;
  const [firstname, ...rest] = d.name.split(' ');
  const s = scoreLead({ light: d.light, timing: d.timing, source: d.source });

  try {
    const contactId = await upsertContact({
      email: d.email, firstname, lastname: rest.join(' '), phone: d.phone,
      props: { tdl_service: d.service, tdl_timing: d.timing, tdl_light: d.light, tdl_source: d.source, tdl_country: d.country, tdl_lead_score: s.score, tdl_lead_tier: s.tier, ...attrProps(d.attribution) },
    });
    const caseId = caseIdFrom(contactId || d.email);
    if (contactId) await setContactProps(contactId, { tdl_case_id: caseId });

    let dealId: string | null = null;
    if (d.source !== 'guia') {
      const stage = d.source === 'evaluador' ? env.hubspotStages.preevaluado : env.hubspotStages.nuevo;
      dealId = await createDeal(contactId, `${caseId} · ${d.service} · ${d.name}`, stage);
    }
    await addNote(contactId, [
      `<b>${d.source.toUpperCase()}</b> desde ${d.page || 'web'}`,
      `Servicio: ${d.service}`, `Semáforo: ${d.light || '—'} · Cuándo empezar: ${d.timing || '—'}`,
      `Puntuación: ${s.score}/100 · Tier ${s.tier} (${s.label})`,
      d.reason ? `Motivo: ${d.reason}` : '', d.answers.length ? `Respuestas: ${d.answers.join(' | ')}` : '', d.message ? `Mensaje: ${d.message}` : '',
    ].filter(Boolean).join('<br>'), dealId);

    // Instant replies, tailored to the tier.
    const agendar = `${env.siteUrl}/agendar`;
    const ayuda = `${env.siteUrl}/ayuda`;
    if (d.phone) {
      if (s.tier === 'A') await sendTemplate(d.phone, 'tdl_caso_listo', [firstname, caseId, d.service, agendar]);
      else if (s.tier === 'B') await sendTemplate(d.phone, 'tdl_caso_recibido', [firstname, caseId, d.service]);
      else await sendTemplate(d.phone, 'tdl_guia', [firstname, d.service, ayuda]);
    }
    const emailBody = s.tier === 'A'
      ? `<p>Hola ${firstname}, recibimos tu caso <b>${caseId}</b> sobre ${d.service.toLowerCase()}. Por lo que nos contaste, el siguiente paso es la consulta con el abogado especialista (desde USD 60, descontable si contratas).</p>`
      : s.tier === 'B'
        ? `<p>Hola ${firstname}, recibimos tu caso <b>${caseId}</b>. Un asesor lo revisa en horario laboral. Si tienes una duda puntual, la consulta exprés por escrito (USD 35) te da la respuesta de un abogado en 48 h.</p>`
        : `<p>Hola ${firstname}, gracias por escribirnos. Te dejamos el centro de respuestas con las guías gratuitas. Cuando estés listo, Diana te ayuda a agendar con un abogado.</p>`;
    await sendEmail(d.email, s.tier === 'C' ? 'Tu guía de Tu Diligencia Legal' : `Recibimos tu caso ${caseId}`,
      layout(s.tier === 'C' ? 'Aquí tienes tu guía' : `Tu caso es el ${caseId}`, emailBody, s.tier === 'C' ? { label: 'Ir al centro de respuestas', href: ayuda } : { label: s.tier === 'A' ? 'Agendar mi consulta' : 'Consulta exprés · USD 35', href: s.tier === 'A' ? agendar : agendar + '?tipo=expres' }));
    if (s.tier === 'A' && env.teamEmail) {
      await sendEmail(env.teamEmail, `Lead prioritario ${caseId}: ${d.service}`, layout(`Lead A · ${d.name}`, `<p>${d.service} · ${d.country} · ${d.phone} · ${d.email}</p><p>Semáforo ${d.light || '—'}, empezar: ${d.timing}</p><p>${d.message}</p>`));
    }
    return NextResponse.json({ ok: true, caseId, tier: s.tier, nextAction: s.nextAction });
  } catch (e) {
    console.error('lead error', e);
    return NextResponse.json({ error: 'No pudimos registrar tu caso. Escríbenos por WhatsApp.' }, { status: 502 });
  }
}
