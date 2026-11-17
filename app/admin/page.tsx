import type { Metadata } from 'next';
import { isAdmin } from '@/lib/session';
import { listSubmissions, dbEnabled } from '@/lib/db';
import { emailProvider, TEAM_EMAIL } from '@/lib/email';
import { binanceEnabled } from '@/lib/binance';
import { AdminLogin, AdminActions, AdminLogout } from '@/components/AdminClient';

export const metadata: Metadata = { title: 'Panel', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const KINDS = ['', 'consulta', 'evaluador', 'contacto', 'guia', 'beca', 'registro'];
const STATUSES = ['', 'pendiente_pago', 'pagado', 'nuevo', 'contactado', 'cerrado', 'cancelado'];

export default async function Admin({ searchParams }: { searchParams: Promise<{ kind?: string; status?: string; q?: string }> }) {
  if (!(await isAdmin())) return <main className="wrap" style={{ maxWidth: 480, padding: '120px 20px' }}><h1 className="h2" style={{ marginBottom: 24 }}>Panel interno</h1><AdminLogin /></main>;
  const sp = await searchParams;
  const rows = await listSubmissions({ kind: sp.kind || undefined, status: sp.status || undefined, q: sp.q || undefined });
  const health: [string, boolean, string][] = [
    ['Base de datos', dbEnabled(), 'DATABASE_URL (Neon en Vercel Marketplace)'],
    ['Correo', !!emailProvider(), `SMTP_* o RESEND_API_KEY · copia a ${TEAM_EMAIL}`],
    ['HubSpot', !!process.env.HUBSPOT_PRIVATE_APP_TOKEN, 'HUBSPOT_PRIVATE_APP_TOKEN'],
    ['Stripe', !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET, 'STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET'],
    ['Binance Pay API', binanceEnabled(), 'BINANCE_PAY_API_KEY + BINANCE_PAY_SECRET'],
    ['Cal.com', !!process.env.CALCOM_API_KEY, 'CALCOM_API_KEY + CALCOM_EVENT_*'],
    ['WhatsApp', !!process.env.WHATSAPP_TOKEN && !!process.env.WHATSAPP_PHONE_NUMBER_ID, 'WHATSAPP_TOKEN + plantillas aprobadas'],
    ['Diana (Claude)', !!process.env.ANTHROPIC_API_KEY, 'ANTHROPIC_API_KEY'],
    ['Archivos Mi caso', !!process.env.BLOB_READ_WRITE_TOKEN, 'Vercel Blob'],
  ];
  const pending = rows.filter((r) => r.status === 'pendiente_pago').length;
  return (
    <main className="wrap" style={{ padding: '48px 20px 120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <h1 className="h2">Panel interno</h1><AdminLogout />
      </div>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, margin: '28px 0' }}>
        {health.map(([n, ok, hint]) => (
          <div key={n} className="card" style={{ padding: 14, borderLeft: `4px solid ${ok ? '#12A37A' : '#A3312A'}` }}>
            <strong>{n}</strong> <span style={{ color: ok ? '#0B7A59' : '#A3312A' }}>{ok ? 'activo' : 'sin configurar'}</span>
            <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#5E584E' }}>{hint}</p>
          </div>
        ))}
      </section>
      {!dbEnabled() && <p className="err">Sin base de datos no se guardan las solicitudes aquí. Conecta Neon desde Vercel → Storage.</p>}
      <form style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '0 0 20px' }}>
        <select className="field" name="kind" defaultValue={sp.kind || ''} style={{ width: 180 }}>{KINDS.map((k) => <option key={k} value={k}>{k || 'Todos los tipos'}</option>)}</select>
        <select className="field" name="status" defaultValue={sp.status || ''} style={{ width: 200 }}>{STATUSES.map((k) => <option key={k} value={k}>{k || 'Todos los estados'}</option>)}</select>
        <input className="field" name="q" defaultValue={sp.q || ''} placeholder="Buscar nombre, correo, caso…" style={{ width: 260 }} />
        <button className="btn btn-ink" type="submit">Filtrar</button>
        <a className="btn btn-ghost" href="/api/admin/export">Exportar CSV</a>
      </form>
      <p style={{ margin: '0 0 12px' }}>{rows.length} registros · <strong>{pending} pagos pendientes</strong></p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 1000 }}>
          <thead><tr style={{ textAlign: 'left', borderBottom: '2px solid #0B1F33' }}>{['Fecha', 'Tipo', 'Estado', 'Caso / ref', 'Cliente', 'Servicio', 'Importe', 'Detalle', 'Acciones'].map((h) => <th key={h} style={{ padding: 8 }}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(11,31,51,0.12)', verticalAlign: 'top' }}>
                <td style={{ padding: 8, whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleString('es-VE', { timeZone: 'America/Caracas' })}</td>
                <td style={{ padding: 8 }}>{r.kind}</td>
                <td style={{ padding: 8 }}><span style={{ padding: '3px 8px', borderRadius: 4, background: r.status === 'pagado' ? '#E3F5EE' : r.status === 'pendiente_pago' ? '#FFF1DC' : '#EEF0F3' }}>{r.status}</span></td>
                <td style={{ padding: 8 }}>{r.case_id}<br /><span style={{ color: '#5E584E', fontSize: 12 }}>{r.ref}</span></td>
                <td style={{ padding: 8 }}>{r.name}<br /><a href={`mailto:${r.email}`}>{r.email}</a><br />{r.phone && <a href={`https://wa.me/${r.phone.replace(/\D/g, '')}`}>{r.phone}</a>}</td>
                <td style={{ padding: 8 }}>{r.service}</td>
                <td style={{ padding: 8 }}>{r.amount_usd ? `USD ${r.amount_usd}` : ''}<br /><span style={{ fontSize: 12 }}>{r.payload?.method}</span></td>
                <td style={{ padding: 8, maxWidth: 320 }}><details><summary>Ver</summary><pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(r.payload, null, 2)}</pre></details></td>
                <td style={{ padding: 8 }}><AdminActions id={r.id} kind={r.kind} status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
