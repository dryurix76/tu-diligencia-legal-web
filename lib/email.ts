import { Resend } from 'resend';
import { env, devLog } from './env';

let client: Resend | null = null;

export async function sendEmail(to: string, subject: string, html: string) {
  if (!to) return;
  if (!env.resendKey) { devLog('email', { to, subject }); return; }
  client = client || new Resend(env.resendKey);
  const { error } = await client.emails.send({ from: env.emailFrom, to, subject, html });
  if (error) console.error('Resend error', error);
}

export function layout(title: string, body: string, cta?: { label: string; href: string }) {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#F4EFE6;font-family:Arial,Helvetica,sans-serif;color:#0B1F33">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
<p style="font-family:Georgia,serif;font-size:20px;margin:0 0 24px">Tu Diligencia <em style="color:#0B7A59">Legal</em></p>
<h1 style="font-family:Georgia,serif;font-weight:normal;font-size:28px;line-height:1.15;margin:0 0 16px">${title}</h1>
<div style="font-size:16px;line-height:1.6">${body}</div>
${cta ? `<p style="margin:28px 0"><a href="${cta.href}" style="background:#0B7A59;color:#fff;text-decoration:none;padding:14px 24px;border-radius:999px;font-weight:bold;display:inline-block">${cta.label}</a></p>` : ''}
<p style="font-size:12px;color:#5E584E;margin-top:40px">Tu Diligencia Legal · parte de Certia Group. Información orientativa, no constituye asesoría jurídica.</p>
</div></body></html>`;
}
