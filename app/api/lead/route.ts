import { NextResponse, after } from 'next/server';
import { withTimeout, step } from '@/lib/net';
import { z } from 'zod';
import { env } from '@/lib/env';
import { scoreLead, caseIdFrom } from '@/lib/leadScore';
import { upsertContact, createDeal, addNote, setContactProps } from '@/lib/hubspot';
import { sendTemplate } from '@/lib/whatsapp';
import { sendEmail, richEmail, notifyTeam, servicePage, esc } from '@/lib/email';
import { saveSubmission } from '@/lib/db';
import { signToken } from '@/lib/session';
import { GUIDES, guideForService } from '@/lib/guides';
import { limited, ipOf } from '@/lib/rate';

// Receives every form on the site. For each one: stores it, copies it to the team
// mailbox, writes it to HubSpot and sends the person a complete automatic reply.

const Attribution = z.record(z.string(), z.string().max(200)).optional().default({});
const attrProps = (a: Record<string, string>) => ({ tdl_utm_source: a.utm_source, tdl_utm_medium: a.utm_medium, tdl_utm_campaign: a.utm_campaign, tdl_utm_term: a.utm_term, tdl_gclid: a.gclid || a.gbraid || a.wbraid, tdl_fbclid: a.fbclid, tdl_landing_page: a.landing_page, tdl_referrer: a.referrer });

const Lead = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(''),
  country: z.string().max(60).optional().default(''),
  service: z.string().max(120).optional().default('Aún no lo sé'),
  timing: z.enum(['now', '3m', '6m', 'info', '']).optional().default(''),
  light: z.enum(['verde', 'ambar', 'rojo', '']).optional().default(''),
  result: z.object({ title: z.string().max(200), route: z.string().max(200).optional().default(''), confidence: z.string().max(40).optional().default(''), basis: z.string().max(600).optional().default(''), pending: z.array(z.string().max(300)).max(8).optional().default([]) }).optional(),
  answers: z.array(z.string().max(300)).max(14).optional().default([]),
  source: z.enum(['evaluador', 'contacto', 'guia', 'beca']),
  guide: z.string().max(40).optional().default(''),
  message: z.string().max(3000).optional().default(''),
  reason: z.string().max(120).optional().default(''),
  page: z.string().max(200).optional().default(''),
  consent: z.literal(true),
  website: z.string().max(0).optional(), // honeypot
  attribution: Attribution,
  extra: z.record(z.string(), z.string().max(500)).optional().default({}),
});

export const maxDuration = 60;

const TIMING_LABEL: Record<string, string> = { now: 'Ahora mismo', '3m': 'En los próximos 3 meses', '6m': 'En 6 meses o más', info: 'Solo se está informando', '': '' };

export async function POST(req: Request) {
  if (limited('lead:' + ipOf(req), 8)) return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta en un minuto.' }, { status: 429 });
  const parsed = Lead.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los campos del formulario.', issues: parsed.error.issues.map((i) => i.path.join('.')) }, { status: 400 });
  const d = parsed.data;
  const [firstname, ...rest] = d.name.split(' ');
  const s = scoreLead({ light: d.light, timing: d.timing, source: d.source === 'beca' ? 'contacto' : d.source });
  const site = env.siteUrl.replace(/\/$/, '');
  const svc = servicePage(d.service);

  try {
    // 1) Lo imprescindible, con tiempo máximo: identificar el caso y guardarlo.
    const contactId = await withTimeout(upsertContact({
      email: d.email, firstname, lastname: rest.join(' '), phone: d.phone,
      props: { tdl_service: d.service, tdl_timing: d.timing, tdl_light: d.light, tdl_source: d.source, tdl_country: d.country, tdl_lead_score: s.score, tdl_lead_tier: s.tier, ...attrProps(d.attribution) },
    }), 8000, 'hubspot.upsertContact');
    const caseId = caseIdFrom(contactId || d.email);
    const guideSlug = d.source === 'guia' ? (GUIDES[d.guide] ? d.guide : guideForService(d.service)) : d.source === 'beca' ? 'becas-2026' : '';
    await withTimeout(saveSubmission({ kind: d.source, caseId, email: d.email, name: d.name, phone: d.phone, service: d.service, payload: { ...d, website: undefined, caseId, tier: s.tier, score: s.score, guide: guideSlug } }), 8000, 'db.saveSubmission');

    // 2) Todo lo demás (CRM, copia al equipo, respuesta automática, WhatsApp) se hace
    //    después de responder, cada paso por separado: el usuario ve su resultado al instante.
    after(() => deliver());
    return NextResponse.json({ ok: true, caseId, tier: s.tier, nextAction: d.source === 'guia' || d.source === 'beca' ? 'nutrir' : s.nextAction });

    async function deliver() {
    let dealId: string | null = null;
    if (contactId) await step('hubspot.setContactProps', () => setContactProps(contactId, { tdl_case_id: caseId }));
    if (d.source !== 'guia') await step('hubspot.createDeal', async () => { dealId = await createDeal(contactId, `${caseId} · ${d.service} · ${d.name}`, d.source === 'evaluador' ? env.hubspotStages.preevaluado : env.hubspotStages.nuevo); });

    const summary: [string, string][] = [
      ['Nombre', d.name], ['Correo', d.email], ['WhatsApp', d.phone], ['País', d.country], ['Servicio', d.service], ['¿Cuándo empezar?', TIMING_LABEL[d.timing]],
      ['Motivo', d.reason], ['Mensaje', d.message], ...Object.entries(d.extra) as [string, string][],
    ];
    if (d.result) summary.push(['Resultado orientativo', `${d.result.title}${d.result.route ? ' · ' + d.result.route : ''}${d.result.confidence ? ' (confianza ' + d.result.confidence + ')' : ''}`]);

    await step('hubspot.addNote', () => addNote(contactId, [
      `<b>${d.source.toUpperCase()}</b> desde ${d.page || 'web'}`, `Puntuación: ${s.score}/100 · Tier ${s.tier} (${s.label})`,
      ...summary.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), d.answers.length ? `Respuestas: ${d.answers.join(' | ')}` : '',
    ].filter(Boolean).join('<br>'), dealId));

    await step('email.notifyTeam', () => notifyTeam(`${d.source === 'guia' ? 'Descarga de guía' : d.source === 'beca' ? 'Solicitud de becas' : d.source === 'evaluador' ? 'Pre-evaluación' : 'Contacto'} · ${d.name} · ${d.service} · Tier ${s.tier}`, {
      Caso: caseId, Tier: `${s.tier} (${s.label}, ${s.score}/100)`, ...Object.fromEntries(summary.filter(([, v]) => v)), Semáforo: d.light, 'Vía probable': d.result?.route, Fundamento: d.result?.basis, 'Por confirmar': d.result?.pending?.join(' · '), Respuestas: d.answers.join(' | '), Guía: guideSlug, Página: d.page, Origen: d.attribution,
    }, d.email));

    // ---- Automatic reply to the person ----
    if (d.source === 'guia') {
      const token = await signToken(d.email, 'download', '30d', { guide: guideSlug });
      const link = `${site}/descargas/${guideSlug}?t=${encodeURIComponent(token)}`;
      const g = GUIDES[guideSlug];
      await step('email.cliente', () => sendEmail(d.email, `Tu guía: ${g.title}`, richEmail({
        title: `Aquí tienes tu guía, ${firstname}`, service: g.service,
        intro: `<p><strong>${g.title}</strong></p><p>${g.desc}</p><p>Descárgala con el botón de abajo. El enlace es personal y funciona durante 30 días.</p>`,
        steps: ['Lee la guía y marca las vías que creas que te aplican.', `Haz la <a href="${site}${svc.path === '/' ? '/nacionalidad-espanola' : svc.path}#evaluador">pre-evaluación gratuita</a> para tener un semáforo de tu caso.`, 'Si tienes dudas, pregúntale a Diana en la web o por WhatsApp.', `Cuando estés listo, <a href="${site}/agendar">agenda tu consulta</a>: se descuenta si contratas.`],
        cta: { label: 'Descargar la guía (PDF)', href: link },
      })));
      return;
    }

    if (d.source === 'beca') {
      const token = await signToken(d.email, 'download', '30d', { guide: 'becas-2026' });
      const link = `${site}/descargas/becas-2026?t=${encodeURIComponent(token)}`;
      const plan = d.extra['Servicio de interés'] || '';
      await step('email.cliente', () => sendEmail(d.email, `Tus becas 2026: guía y siguiente paso · ${caseId}`, richEmail({
        title: `Hola ${firstname}, ya tienes tu guía de becas`, caseId, service: 'Becas y estudios', summary,
        intro: `<p>Gracias por registrarte. Te enviamos la <strong>Guía de becas 2026 para España, Portugal e Italia</strong>: las principales convocatorias, quién puede pedirlas, qué cubren, plazos, costes reales de matrícula y enlaces oficiales. El enlace es personal y funciona 30 días.</p><p>Un asesor revisará tu perfil${plan ? ` y tu interés en <strong>${esc(plan)}</strong>` : ''} y te escribirá en horario laboral (lunes a viernes, 8:00 a 18:00, hora de Caracas).</p>`,
        steps: [
          `Descarga la guía y revisa el <a href="${site}/becas#calendario">calendario de convocatorias</a>: Erasmus Mundus cierra entre octubre y enero; Fundación Carolina, a comienzos de marzo.`,
          'Prepara tu título y notas apostillados, un CV y un certificado de idioma si estudiarás en inglés o italiano.',
          `Si quieres que lo hagamos por ti: <a href="${site}/becas#servicios">Te buscamos tu beca</a> (USD 290) te entrega en 7 días las becas que mejor encajan contigo, y si no hay ninguna compatible te devolvemos el 100 %.`,
          `Para el visado de estudios, mira <a href="${site}/visados">visados y residencias</a>.`,
        ],
        cta: { label: 'Descargar la guía de becas (PDF)', href: link },
      })));
      if (d.phone) await step('whatsapp', () => sendTemplate(d.phone, 'tdl_guia', [firstname, 'becas y estudios', `${site}/becas`]));
      return;
    }

    const r = d.result; const resultHtml = r ? `<div style="background:#F4EFE6;border-radius:8px;padding:16px 18px;margin:18px 0"><p style="margin:0 0 6px;font-size:12px;letter-spacing:1.5px;color:#5E584E">TU RESULTADO ORIENTATIVO</p><p style="margin:0 0 6px;font-size:17px"><strong>${esc(r.title)}</strong></p>${r.route ? `<p style="margin:0 0 6px">Vía probable: <strong>${esc(r.route)}</strong>${r.confidence ? ` · confianza ${esc(r.confidence)}` : ''}</p>` : ''}${r.basis ? `<p style="margin:0 0 6px;font-size:14px;color:#4E4A43">Base legal: ${esc(r.basis)}</p>` : ''}${r.pending?.length ? `<p style="margin:8px 0 4px;font-size:14px">Lo que un abogado debe confirmar:</p><ul style="margin:0;padding-left:18px;font-size:14px">${r.pending.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}<p style="margin:10px 0 0;font-size:12.5px;color:#5E584E">Resultado orientativo basado en tus respuestas y en la normativa vigente. No sustituye el análisis de un abogado con tus documentos.</p></div>` : '';
    const intro = s.tier === 'A'
      ? `<p>Gracias por confiar en nosotros. Por lo que nos contaste, tu caso está listo para la <strong>consulta con el abogado especialista</strong>: en 30 minutos confirmamos la vía, los documentos y el presupuesto cerrado.</p>`
      : s.tier === 'B'
        ? `<p>Gracias por escribirnos. Un asesor revisará tu caso en horario laboral (lunes a viernes, 8:00 a 18:00, hora de Caracas). Si tienes una duda puntual, la <strong>consulta exprés por escrito</strong> (USD 35) te da la respuesta de un abogado en 48 horas.</p>`
        : `<p>Gracias por escribirnos. Como todavía te estás informando, te dejamos las guías y el centro de respuestas. Diana, nuestra asistente, responde tus dudas al instante en la web y por WhatsApp. Cuando estés listo, te pasamos con un abogado.</p>`;
    await step('email.cliente', () => sendEmail(d.email, s.tier === 'C' ? `Recibimos tu mensaje · ${caseId}` : `Tu caso ${caseId} · Tu Diligencia Legal`, richEmail({
      title: `Hola ${firstname}, recibimos tu ${d.source === 'evaluador' ? 'pre-evaluación' : 'mensaje'}`,
      caseId, service: d.service, intro, summary, extraHtml: resultHtml,
      steps: s.tier === 'A'
        ? [`Agenda tu consulta inicial (USD 60, 30 min) en <a href="${site}/agendar?tipo=inicial">${site.replace(/^https?:\/\//, '')}/agendar</a>.`, 'Ten a mano el árbol familiar con fechas y lugares, y las partidas que tengas.', 'Tras la consulta recibes la propuesta con precio cerrado y plan de cuotas.']
        : s.tier === 'B'
          ? ['Un asesor te escribirá por WhatsApp o correo.', `Mientras, haz la <a href="${site}${svc.path === '/' ? '/nacionalidad-espanola' : svc.path}#evaluador">pre-evaluación gratuita</a> si aún no la hiciste.`, `Para una respuesta rápida de un abogado: <a href="${site}/agendar?tipo=expres">consulta exprés por escrito</a>.`]
          : [`Lee el <a href="${site}/ayuda">centro de respuestas</a> y descarga las guías gratuitas.`, 'Pregúntale a Diana cualquier duda, a cualquier hora.', `Cuando estés listo, <a href="${site}/agendar">agenda con un abogado</a>.`],
      cta: s.tier === 'A' ? { label: 'Agendar mi consulta', href: `${site}/agendar?tipo=inicial` } : s.tier === 'B' ? { label: 'Consulta exprés · USD 35', href: `${site}/agendar?tipo=expres` } : { label: 'Ir al centro de respuestas', href: `${site}/ayuda` },
    })));
    if (d.phone) {
      if (s.tier === 'A') await step('whatsapp', () => sendTemplate(d.phone, 'tdl_caso_listo', [firstname, caseId, d.service, `${site}/agendar`]));
      else if (s.tier === 'B') await step('whatsapp', () => sendTemplate(d.phone, 'tdl_caso_recibido', [firstname, caseId, d.service]));
      else await step('whatsapp', () => sendTemplate(d.phone, 'tdl_guia', [firstname, d.service, `${site}/ayuda`]));
    }
    }
  } catch (e) {
    console.error('lead error', e);
    return NextResponse.json({ error: 'No pudimos registrar tu caso. Escríbenos por WhatsApp.' }, { status: 502 });
  }
}
