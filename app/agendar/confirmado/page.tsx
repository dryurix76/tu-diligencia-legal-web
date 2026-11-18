import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { stripe } from '@/lib/stripe';
import { CONSULTS } from '@/lib/catalog';
import PurchaseTracker from '@/components/PurchaseTracker';
import { getByRef } from '@/lib/db';

export const metadata: Metadata = pageMeta('/agendar/confirmado', { title: 'Pago confirmado', description: 'Confirmación', noindex: true });

export default async function Confirmado({ searchParams }: { searchParams: Promise<{ session_id?: string; ref?: string }> }) {
  const sp = await searchParams;
  const id = sp.session_id || sp.ref || '';
  const st = stripe();
  let paid = false, name = '', consult = '', when = '', caseId = '', value = 0, item = '';
  if (st && id.startsWith('cs_')) {
    try {
      const s = await st.checkout.sessions.retrieve(id);
      paid = s.payment_status === 'paid';
      value = (s.amount_total || 0) / 100;
      item = s.metadata?.consult || '';
      name = (s.metadata?.name || '').split(' ')[0];
      caseId = s.metadata?.caseId || '';
      const c = CONSULTS.find((x) => x.id === s.metadata?.consult);
      consult = c?.name || 'Consulta';
      if (s.metadata?.start) when = new Date(s.metadata.start).toLocaleString('es-VE', { timeZone: s.metadata.tz || 'America/Caracas', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    } catch { /* invalid session */ }
  } else if (sp.ref) {
    const row = await getByRef(sp.ref).catch(() => null);
    if (row) {
      const p = row.payload;
      paid = row.status === 'pagado';
      name = String(p.name || '').split(' ')[0];
      caseId = row.case_id || '';
      value = Number(row.amount_usd) || 0;
      item = p.consult || '';
      consult = CONSULTS.find((x) => x.id === p.consult)?.name || 'Consulta';
      if (p.start) when = new Date(p.start).toLocaleString('es-VE', { timeZone: p.tz || 'America/Caracas', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    }
  }
  return (
    <>
      <div style={{ background: 'var(--ink)' }}><Header dark /></div>
      <section className="section">
        <div className="wrap" style={{ maxWidth: 880 }}>
          {paid ? (
            <>
              <PurchaseTracker id={id} value={value} item={item} />
              <svg width="96" height="96" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="94" fill="none" stroke="var(--green)" strokeWidth="5" /><circle cx="100" cy="100" r="80" fill="none" stroke="var(--green)" strokeWidth="1.5" strokeDasharray="3 5" /><path d="M62 104 L88 130 L140 72" fill="none" stroke="var(--green)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <h1 className="h2" style={{ margin: '24px 0 12px' }}>{when ? 'Cita confirmada.' : 'Consulta recibida.'} {name && <em>Gracias, {name}.</em>}</h1>
              <p style={{ fontSize: 18, color: 'var(--ink-80)' }}>{consult}{when ? ` · ${when}` : ' · tu abogado responderá por escrito en 48 h'}. Caso {caseId}.</p>
              <div className="g-3" style={{ marginTop: 32 }}>
                {[['AHORA', 'Confirmación por correo y WhatsApp, con el enlace de la videollamada.'], ['ANTES DE LA CITA', 'Sube tus documentos en Mi caso: el abogado los revisa antes.'], ['RECORDATORIOS', 'Te avisamos 24 h y 1 h antes.']].map(([k, t]) => (
                  <div key={k} className="card" style={{ padding: 24 }}><p className="mono accent" style={{ margin: '0 0 8px', fontSize: 11.5, letterSpacing: '0.12em' }}>{k}</p><p style={{ margin: 0, fontSize: 15 }}>{t}</p></div>
                ))}
              </div>
              <Link className="btn btn-ink" href="/mi-caso" style={{ marginTop: 28 }}>Ir a Mi caso</Link>
            </>
          ) : (
            <>
              <h1 className="h2">Estamos confirmando tu pago.</h1>
              <p style={{ fontSize: 18, color: 'var(--ink-80)' }}>Si ya pagaste, recibirás la confirmación por correo y WhatsApp en unos minutos. Si algo falló, puedes <Link href="/agendar">intentarlo de nuevo</Link>.</p>
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
