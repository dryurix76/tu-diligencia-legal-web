'use client';

// Analytics + ads tracking helpers. All calls respect Consent Mode v2: gtag only
// stores cookies after the visitor accepts; Meta Pixel only loads after consent.

declare global {
  interface Window { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void; dataLayer?: unknown[] }
}

const GADS = process.env.NEXT_PUBLIC_GADS_ID || '';
const LABELS: Record<string, string | undefined> = {
  lead_a: process.env.NEXT_PUBLIC_GADS_LABEL_LEAD_A,
  lead: process.env.NEXT_PUBLIC_GADS_LABEL_LEAD,
  purchase: process.env.NEXT_PUBLIC_GADS_LABEL_PURCHASE,
};
const META: Record<string, string> = { generate_lead: 'Lead', begin_checkout: 'InitiateCheckout', purchase: 'Purchase', sign_up: 'CompleteRegistration', chat_lawyer_request: 'Contact' };

export function track(name: string, params: Record<string, unknown> = {}, user?: { email?: string; phone?: string }) {
  if (typeof window === 'undefined') return;
  if (user?.email && window.gtag) window.gtag('set', 'user_data', { email: user.email.trim().toLowerCase(), ...(user.phone ? { phone_number: user.phone.replace(/[^\d+]/g, '') } : {}) });
  window.gtag?.('event', name, params);
  if (META[name]) window.fbq?.('track', META[name], params);
  // Google Ads conversions (enhanced conversions use the user_data above).
  if (GADS && window.gtag) {
    if (name === 'generate_lead') {
      const label = params.tier === 'A' ? LABELS.lead_a : LABELS.lead;
      if (label) window.gtag('event', 'conversion', { send_to: `${GADS}/${label}`, value: params.tier === 'A' ? 20 : 5, currency: 'USD' });
    }
    if (name === 'purchase' && LABELS.purchase) window.gtag('event', 'conversion', { send_to: `${GADS}/${LABELS.purchase}`, value: params.value, currency: 'USD', transaction_id: params.transaction_id });
  }
}

// ---------- First-party attribution (sent with forms to the CRM) ----------
const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid'];

export function captureAttribution() {
  if (typeof window === 'undefined') return;
  try {
    const u = new URL(window.location.href);
    const found: Record<string, string> = {};
    for (const k of KEYS) { const v = u.searchParams.get(k); if (v) found[k] = v.slice(0, 200); }
    const prev = JSON.parse(sessionStorage.getItem('tdl_attr') || 'null');
    if (!prev || Object.keys(found).length) {
      sessionStorage.setItem('tdl_attr', JSON.stringify({ ...found, landing_page: u.pathname, referrer: document.referrer.slice(0, 200) }));
    }
  } catch { /* storage unavailable */ }
}

export function getAttribution(): Record<string, string> {
  try { return JSON.parse(sessionStorage.getItem('tdl_attr') || '{}'); } catch { return {}; }
}
