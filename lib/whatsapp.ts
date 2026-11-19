import { env, devLog } from './env';

// WhatsApp Cloud API (Meta). Business-initiated messages must use templates
// approved in WhatsApp Manager (see README for the exact template texts).
// Free-text replies are only allowed within 24 h of the user's last message.

const url = () => `https://graph.facebook.com/${env.waApiVersion}/${env.waPhoneId}/messages`;

export function normalizePhone(raw: string): string {
  return (raw || '').replace(/[^\d]/g, '').replace(/^00/, '');
}

async function send(body: Record<string, unknown>) {
  if (!env.waToken || !env.waPhoneId) { devLog('whatsapp.send', body); return; }
  const res = await fetch(url(), {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.waToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', ...body }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) console.error('WhatsApp error', res.status, await res.text());
}

export async function sendTemplate(to: string, name: string, params: string[]) {
  const phone = normalizePhone(to);
  if (!phone) return;
  await send({
    to: phone,
    type: 'template',
    template: {
      name,
      language: { code: env.waTemplateLang },
      components: params.length ? [{ type: 'body', parameters: params.map((text) => ({ type: 'text', text })) }] : [],
    },
  });
}

export async function sendText(to: string, text: string) {
  const phone = normalizePhone(to);
  if (!phone) return;
  await send({ to: phone, type: 'text', text: { body: text, preview_url: true } });
}
