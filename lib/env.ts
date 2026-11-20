// Central access to environment variables.
// Every integration degrades gracefully: if its keys are missing, the site keeps
// working and the call is logged instead of sent (useful in local development).

// Dirección pública del sitio. Si falta NEXT_PUBLIC_SITE_URL en un entorno, se usa el
// dominio de producción que Vercel expone, y si tampoco existe, el dominio oficial.
// (Antes caía en localhost: enlaces de correos, canónicas y sitemap quedaban rotos.)
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  || (process.env.NODE_ENV === 'production' ? 'https://www.tudiligencialegal.com' : 'http://localhost:3000')).replace(/\/$/, '');

export const env = {
  siteUrl: SITE_URL,

  hubspotToken: process.env.HUBSPOT_PRIVATE_APP_TOKEN || '',
  hubspotPipeline: process.env.HUBSPOT_PIPELINE_ID || 'default',
  hubspotStages: {
    nuevo: process.env.HUBSPOT_STAGE_NUEVO || '',
    preevaluado: process.env.HUBSPOT_STAGE_PREEVALUADO || '',
    consultaPagada: process.env.HUBSPOT_STAGE_CONSULTA_PAGADA || '',
    pagoPendiente: process.env.HUBSPOT_STAGE_PAGO_PENDIENTE || '',
  },

  stripeSecret: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',

  calApiKey: process.env.CALCOM_API_KEY || '',

  waToken: process.env.WHATSAPP_TOKEN || '',
  waPhoneId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  waVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN || '',
  waApiVersion: process.env.WHATSAPP_API_VERSION || 'v23.0',
  waTemplateLang: process.env.WHATSAPP_TEMPLATE_LANG || 'es',

  anthropicKey: process.env.ANTHROPIC_API_KEY || '',
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',

  resendKey: process.env.RESEND_API_KEY || '',
  emailFrom: process.env.EMAIL_FROM || 'Tu Diligencia Legal <hola@tudiligencialegal.com>',
  teamEmail: process.env.TEAM_NOTIFICATION_EMAIL || '',

  sessionSecret: process.env.SESSION_SECRET || 'dev-only-change-me-dev-only-change-me',
  blobToken: process.env.BLOB_READ_WRITE_TOKEN || '',

  zelleEmail: process.env.ZELLE_EMAIL || '[correo Zelle]',
  zelleName: process.env.ZELLE_NAME || '[Titular Zelle]',
  binancePayId: process.env.BINANCE_PAY_ID || '[Binance Pay ID]',

  // Pago Móvil (bolívares). Datos de la cuenta que recibe; se muestran al cliente.
  pmBank: process.env.PAGOMOVIL_BANCO || '',          // p. ej. "0134 Banesco"
  pmPhone: process.env.PAGOMOVIL_TELEFONO || '',      // p. ej. "0414-0000000"
  pmId: process.env.PAGOMOVIL_RIF || '',              // RIF o cédula del titular, p. ej. "J-00000000-0"
  pmName: process.env.PAGOMOVIL_TITULAR || '',
};

export function devLog(service: string, payload: unknown) {
  console.info(`[${service}] (sin credenciales, no enviado)`, JSON.stringify(payload).slice(0, 800));
}
