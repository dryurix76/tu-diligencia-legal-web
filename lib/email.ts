import { Resend } from 'resend';
import nodemailer, { type Transporter } from 'nodemailer';
import { env, devLog } from './env';
import { KB } from './kb';

// Email delivery. Uses, in this order: SMTP (e.g. the info@ mailbox of your own
// hosting), Resend, or a console log in development.

let resend: Resend | null = null;
let smtp: Transporter | null = null;

export const TEAM_EMAIL = process.env.TEAM_NOTIFICATION_EMAIL || 'info@tudiligencialegal.com';

export function emailProvider(): 'smtp' | 'resend' | null {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) return 'smtp';
  if (env.resendKey) return 'resend';
  return null;
}

export async function sendEmail(to: string, subject: string, html: string, opts: { replyTo?: string; attachments?: { filename: string; content: Buffer }[] } = {}): Promise<boolean> {
  if (!to) return false;
  const provider = emailProvider();
  if (!provider) { devLog('email', { to, subject }); return false; }
  if (provider === 'smtp') {
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = (process.env.SMTP_SECURE || (port === 465 ? 'true' : 'false')) === 'true';
    try {
      smtp = smtp || nodemailer.createTransport({
        host: process.env.SMTP_HOST, port, secure,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
      });
      await smtp.sendMail({ from: env.emailFrom, to, subject, html, replyTo: opts.replyTo, attachments: opts.attachments });
      return true;
    } catch (e) {
      // Sin datos secretos: solo host, puerto y modo, para poder diagnosticar en los logs.
      console.error(`Email error (SMTP ${process.env.SMTP_HOST}:${port}, secure=${secure})`, (e as Error)?.message || e);
      smtp = null;
      if (!env.resendKey) return false;
      console.info('Email: SMTP falló, reintentando con Resend');
    }
  }
  try {
    resend = resend || new Resend(env.resendKey);
    const { error } = await resend.emails.send({ from: env.emailFrom, to, subject, html, replyTo: opts.replyTo, attachments: opts.attachments });
    if (error) { console.error('Resend error', error); return false; }
    return true;
  } catch (e) {
    console.error('Email error (Resend)', e);
    return false;
  }
}

// ---------- Rich templates ----------

const SITE = () => env.siteUrl.replace(/\/$/, '');
export const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function socialLinks(): [string, string][] {
  const s: [string, string | undefined][] = [
    ['WhatsApp', process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/\D/g, '')}` : undefined],
    ['Instagram', process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM], ['Facebook', process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK], ['TikTok', process.env.NEXT_PUBLIC_SOCIAL_TIKTOK],
    ['YouTube', process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE], ['LinkedIn', process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN], ['X', process.env.NEXT_PUBLIC_SOCIAL_X],
  ];
  return s.filter((x): x is [string, string] => !!x[1]);
}

const SERVICE_PAGES: [RegExp, string, string][] = [
  [/espa/i, '/nacionalidad-espanola', 'es'], [/ital/i, '/nacionalidad-italiana', 'it'], [/portug/i, '/nacionalidad-portuguesa', 'pt'],
  [/alem/i, '/nacionalidad-alemana', 'de'], [/croa/i, '/nacionalidad-croata', 'hr'], [/brit|reino/i, '/nacionalidad-britanica', 'uk'],
  [/beca|estudi/i, '/becas', 'visas'], [/visad|resid/i, '/visados', 'visas'], [/negoc/i, '/negocios', 'negocios'], [/carib/i, '/caribe', 'caribe'],
];

export function servicePage(service = ''): { path: string; topic: string } {
  const m = SERVICE_PAGES.find(([r]) => r.test(service));
  return m ? { path: m[1], topic: m[2] } : { path: '/', topic: 'general' };
}

function faqsFor(service = '', n = 3) {
  const { topic } = servicePage(service);
  const pref = topic === 'general' ? [] : KB.filter((e) => e.id.startsWith(topic + '-') || (topic === 'visas' && ['nomada', 'nolucrativa', 'estudios', 'arraigo'].includes(e.id)));
  const base = KB.filter((e) => ['cobro', 'pagos', 'plazos'].includes(e.id));
  return [...pref, ...base].slice(0, n);
}

export interface RichEmail {
  title: string;
  intro: string;              // HTML allowed (already escaped by caller where needed)
  caseId?: string;
  summary?: [string, string][];
  steps?: string[];
  cta?: { label: string; href: string };
  service?: string;
  extraHtml?: string;
}

export function richEmail(e: RichEmail) {
  const site = SITE();
  const { path } = servicePage(e.service);
  const links: [string, string][] = [
    ['Tu servicio', site + path], ['Pre-evaluación gratuita', `${site}${path === '/' ? '/nacionalidad-espanola' : path}#evaluador`], ['Tarifas y calculadora', `${site}/tarifas`],
    ['Agendar consulta', `${site}/agendar`], ['Centro de respuestas', `${site}/ayuda`], ['Mi caso', `${site}/mi-caso`], ['Blog El Archivo', `${site}/blog`],
  ];
  const faqs = faqsFor(e.service);
  const socials = socialLinks();
  const row = (k: string, v: string) => `<tr><td style="padding:8px 12px 8px 0;color:#515D69;font-size:14px;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0;font-size:14px">${esc(v)}</td></tr>`;
  return `<!doctype html><html lang="es"><body style="margin:0;background:#F4EFE6;font-family:Arial,Helvetica,sans-serif;color:#0B1F33">
<div style="max-width:600px;margin:0 auto;padding:32px 22px">
<table role="presentation" width="100%"><tr><td style="font-family:Georgia,serif;font-size:21px">Tu Diligencia <em style="color:#0B7A59">Legal</em></td><td align="right" style="font-size:11px;color:#515D69;letter-spacing:1px">PARTE DE CERTIA GROUP</td></tr></table>
<div style="background:#FBF9F6;border-radius:10px;padding:28px;margin-top:20px">
${e.caseId ? `<p style="margin:0 0 8px;font-size:12px;letter-spacing:1.5px;color:#0B7A59">CASO ${esc(e.caseId)}</p>` : ''}
<h1 style="font-family:Georgia,serif;font-weight:normal;font-size:27px;line-height:1.15;margin:0 0 16px">${esc(e.title)}</h1>
<div style="font-size:15.5px;line-height:1.6">${e.intro}</div>
${e.summary?.length ? `<p style="margin:24px 0 6px;font-size:12px;letter-spacing:1.5px;color:#515D69">LO QUE NOS ENVIASTE</p><table role="presentation" style="border-collapse:collapse;width:100%">${e.summary.filter(([, v]) => v).map(([k, v]) => row(k, v)).join('')}</table>` : ''}
${e.steps?.length ? `<p style="margin:24px 0 6px;font-size:12px;letter-spacing:1.5px;color:#515D69">PRÓXIMOS PASOS</p><ol style="margin:0;padding-left:20px;font-size:15px;line-height:1.6">${e.steps.map((s) => `<li style="margin-bottom:6px">${s}</li>`).join('')}</ol>` : ''}
${e.extraHtml || ''}
${e.cta ? `<p style="margin:28px 0 4px"><a href="${e.cta.href}" style="background:#0B7A59;color:#FBF9F6;text-decoration:none;padding:14px 26px;border-radius:999px;font-weight:bold;display:inline-block">${esc(e.cta.label)}</a></p>` : ''}
</div>
${faqs.length ? `<div style="background:#FBF9F6;border-radius:10px;padding:24px 28px;margin-top:16px"><p style="margin:0 0 10px;font-size:12px;letter-spacing:1.5px;color:#515D69">RESPUESTAS RÁPIDAS</p>${faqs.map((f) => `<p style="margin:0 0 4px;font-weight:bold;font-size:14.5px">${esc(f.q)}</p><p style="margin:0 0 14px;font-size:14px;line-height:1.55;color:#304050">${esc(f.a)}</p>`).join('')}</div>` : ''}
<div style="padding:22px 6px 0;font-size:13.5px;line-height:1.9">
${links.map(([l, h]) => `<a href="${h}" style="color:#0B7A59;text-decoration:none;margin-right:14px;white-space:nowrap">${l} →</a>`).join(' ')}
</div>
<div style="padding:18px 6px 0;font-size:13px;color:#304050;line-height:1.7">
<strong>Contacto:</strong> ${esc(process.env.NEXT_PUBLIC_CONTACT_EMAIL || TEAM_EMAIL)}${process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY ? ` · WhatsApp ${esc(process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY)}` : ''} · <a href="${site}" style="color:#0B7A59">${site.replace(/^https?:\/\//, '')}</a>
${socials.length ? `<br>${socials.map(([n, h]) => `<a href="${h}" style="color:#0B1F33;margin-right:12px">${n}</a>`).join('')}` : ''}
${process.env.NEXT_PUBLIC_CERTIA_URL || 'https://certia.group' ? `<br>Una empresa de <a href="${process.env.NEXT_PUBLIC_CERTIA_URL || 'https://certia.group'}" style="color:#0B1F33">Certia Group</a>` : ''}
</div>
<p style="font-size:11.5px;color:#515D69;margin-top:22px;line-height:1.5">La información de este correo es orientativa y no constituye asesoría jurídica hasta la consulta con un abogado. Puedes ejercer tus derechos de protección de datos escribiendo a ${esc(TEAM_EMAIL)}. <a href="${site}/legal/privacidad" style="color:#515D69">Privacidad</a> · <a href="${site}/legal/terminos" style="color:#515D69">Condiciones</a> · <a href="${site}/legal/reembolsos" style="color:#515D69">Reembolsos</a> · <a href="${site}/legal/aviso-legal" style="color:#515D69">Aviso legal</a></p>
</div></body></html>`;
}

// Back-compat simple layout.
export function layout(title: string, body: string, cta?: { label: string; href: string }) {
  return richEmail({ title, intro: body, cta });
}

// Every submission is copied to the team mailbox with all its data.
export async function notifyTeam(subject: string, data: Record<string, unknown>, replyTo?: string) {
  const rows = Object.entries(data).filter(([, v]) => v !== undefined && v !== '' && v !== null)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#515D69;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0">${esc(typeof v === 'object' ? JSON.stringify(v) : v)}</td></tr>`).join('');
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#0B1F33;font-size:14px"><h2 style="font-family:Georgia,serif;font-weight:normal">${esc(subject)}</h2><table style="border-collapse:collapse">${rows}</table><p style="color:#515D69;font-size:12px;margin-top:20px">Enviado automáticamente por ${SITE()} · <a href="${SITE()}/admin">Abrir panel</a></p></body></html>`;
  return sendEmail(TEAM_EMAIL, `[Web] ${subject}`, html, { replyTo });
}
