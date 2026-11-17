'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { postJSON } from '@/lib/client';

interface CaseData {
  auth: boolean; empty?: boolean; name?: string; caseId?: string; service?: string;
  deal?: { name: string; stageIndex: number } | null; stages?: string[];
  docs?: { name: string; who: string; status: string }[];
  bookings?: { title: string; start: string; meetingUrl?: string; uid: string }[];
  notes?: { date: string; body: string }[];
  payments?: { name: string; date: string; usd: number; status: string }[];
  requests?: { date: string; kind: string; status: string; service: string; amount: number | null; ref: string }[];
}

const badge = (s: string): React.CSSProperties => ({ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', padding: '5px 9px', borderRadius: 4, ...(s === 'recibido' || s === 'pagado' ? { background: '#E3F5EE', color: '#0B7A59' } : s === 'gestion' ? { background: '#EAF0F7', color: '#1F3B6B' } : { background: '#FFF1DC', color: '#8A5A00' }) });
const LABEL: Record<string, string> = { recibido: 'RECIBIDO', gestion: 'EN GESTIÓN', pendiente: 'PENDIENTE', pagado: 'PAGADO' };

export default function Portal({ linkError = false }: { linkError?: boolean }) {
  const [data, setData] = useState<CaseData | null>(null);
  const [tab, setTab] = useState<'docs' | 'pay' | 'msg' | 'citas'>('docs');
  const [sent, setSent] = useState(false);
  const [uploading, setUploading] = useState(-1);
  const [error, setError] = useState(linkError ? 'El enlace caducó o no es válido. Pide uno nuevo.' : '');

  const load = () => fetch('/api/case').then((r) => r.json()).then(setData).catch(() => setData({ auth: false }));
  useEffect(() => { load(); }, []);

  if (!data) return <p className="wrap" style={{ padding: '120px 20px' }}>Cargando…</p>;

  if (!data.auth) return (
    <section style={{ padding: '120px 0' }}><div className="wrap" style={{ maxWidth: 560 }}>
      <h1 className="h2" style={{ marginBottom: 12 }}>Mi <em>caso</em></h1>
      {sent ? <div className="fade" style={{ fontSize: 18 }}><p>Revisa tu correo (y la carpeta de spam o promociones).</p><p>Si ya eres cliente, te llegó un <strong>enlace para entrar</strong>. Si es tu primera vez, te llegó un <strong>enlace para crear tu acceso</strong>.</p></div> : (
        <form onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const { ok, data: d } = await postJSON<any>('/api/auth/request', { email: fd.get('email'), name: fd.get('name') || undefined }); if (ok) setSent(true); else setError(d.error || 'Revisa tu correo.'); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ margin: '0 0 16px', color: '#5E584E' }}>Entra o regístrate con tu correo: te enviamos un enlace, sin contraseñas.</p>
          <label className="lbl">Correo electrónico<input className="field" name="email" type="email" required autoComplete="email" /></label>
          <label className="lbl">Nombre (solo si es tu primera vez)<input className="field" name="name" autoComplete="name" /></label>
          {error && <p className="err" role="alert">{error}</p>}
          <button type="submit" className="btn btn-ink" style={{ minHeight: 56 }}>Recibir enlace</button>
        </form>
      )}
      <p style={{ margin: '24px 0 0', fontSize: 14, color: '#5E584E' }}>¿Aún no eres cliente? <Link href="/agendar">Agenda tu consulta</Link> o haz la <Link href="/nacionalidad-espanola#evaluador">pre-evaluación gratuita</Link>.</p>
    </div></section>
  );

  if (data.empty) return <section className="section"><div className="wrap"><h1 className="h2">Aún no tenemos un expediente con {'tu correo'}.</h1><p className="lede">Si acabas de pagar tu consulta, puede tardar unos minutos. Si no, <Link href="/agendar">agenda tu consulta</Link>.</p></div></section>;

  const stages = data.stages || [];
  const cur = data.deal?.stageIndex ?? 0;
  const docs = data.docs || [];
  const pend = docs.filter((d) => d.who === 'cliente' && d.status === 'pendiente').length;
  const progress = Math.round(((cur + 0.5) / Math.max(stages.length, 1)) * 100);

  const upload = async (i: number, file: File) => {
    setUploading(i); setError('');
    const fd = new FormData(); fd.append('file', file); fd.append('index', String(i));
    const r = await fetch('/api/case/upload', { method: 'POST', body: fd });
    const d = await r.json().catch(() => ({}));
    setUploading(-1);
    if (!r.ok) setError(d.error || 'No se pudo subir.'); else load();
  };

  return (
    <section style={{ padding: '48px 0 112px' }}>
      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
          <div>
            <p className="mono accent" style={{ margin: '0 0 10px', fontSize: 12, letterSpacing: '0.14em' }}>EXPEDIENTE {data.caseId}</p>
            <h1 className="h2">Hola, <em>{data.name}</em></h1>
            <p style={{ margin: '10px 0 0', color: '#5E584E' }}>{data.deal?.name || data.service}</p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); setData({ auth: false }); }}>Cerrar sesión</button>
        </div>

        {!data.deal && (
          <div style={{ background: '#0B1F33', color: '#F4EFE6', borderRadius: 10, padding: 28, marginBottom: 24 }}>
            <p className="serif" style={{ margin: '0 0 8px', fontSize: 26 }}>Aún no tienes un expediente abierto.</p>
            <p style={{ margin: '0 0 18px', color: '#C9CFD6' }}>Tu acceso está creado. El expediente se abre cuando agendas tu consulta y aparecerá aquí con su estado.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><Link className="btn btn-mint" href="/nacionalidad-espanola#evaluador">Hacer la pre-evaluación</Link><Link className="btn btn-ghost-dark" href="/agendar">Agendar consulta</Link></div>
          </div>
        )}
        {(data.requests || []).length > 0 && (
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <p className="mono" style={{ margin: '0 0 12px', fontSize: 11.5, letterSpacing: '0.14em', color: '#5E584E' }}>TUS SOLICITUDES</p>
            {data.requests!.map((r) => (
              <div key={r.date + r.ref} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(11,31,51,0.08)', flexWrap: 'wrap', fontSize: 15 }}>
                <span>{new Date(r.date).toLocaleDateString('es-VE')} · {r.kind === 'consulta' ? 'Consulta' : r.kind === 'evaluador' ? 'Pre-evaluación' : r.kind === 'guia' ? 'Guía descargada' : r.kind === 'beca' ? 'Búsqueda de becas' : 'Mensaje'} · {r.service}</span>
                <span style={badge(r.status === 'pagado' ? 'pagado' : r.status === 'pendiente_pago' ? 'pendiente' : 'gestion')}>{r.status === 'pendiente_pago' ? 'PAGO PENDIENTE' : r.status.toUpperCase()}{r.amount ? ` · USD ${r.amount}` : ''}</span>
              </div>
            ))}
          </div>
        )}
        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <p className="mono" style={{ margin: '0 0 24px', fontSize: 11.5, letterSpacing: '0.14em', color: '#5E584E' }}>ESTADO DEL EXPEDIENTE</p>
          <ol style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, listStyle: 'none', padding: 0, margin: 0 }}>
            {stages.map((s, i) => (
              <li key={s} aria-current={i === cur ? 'step' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ height: 6, borderRadius: 6, background: i < cur ? '#0B7A59' : i === cur ? '#3DD1A0' : 'rgba(11,31,51,0.1)' }} />
                <span className="mono" style={{ fontSize: 11, color: '#5E584E' }}>0{i + 1}</span>
                <span style={{ fontSize: 14.5, fontWeight: i === cur ? 600 : 400, color: i <= cur ? '#0B1F33' : '#5E584E' }}>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div role="tablist" style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {([['docs', 'Documentos'], ['pay', 'Pagos'], ['msg', 'Mensajes'], ['citas', 'Citas']] as const).map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={tab === k} className={`chip ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{l}</button>)}
        </div>
        {error && <p className="err" role="alert" style={{ marginBottom: 16 }}>{error}</p>}

        <div className="g-side">
          <div>
            {tab === 'docs' && <div className="card">{docs.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '20px 24px', borderBottom: '1px solid rgba(11,31,51,0.08)', flexWrap: 'wrap' }}>
                <div><p style={{ margin: 0, fontWeight: 600 }}>{d.name}</p><p style={{ margin: '2px 0 0', fontSize: 14, color: '#5E584E' }}>{d.who === 'cliente' ? 'Lo subes tú' : 'Lo gestionamos nosotros'}</p></div>
                <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={badge(d.status)}>{LABEL[d.status] || d.status.toUpperCase()}</span>
                  {d.who === 'cliente' && d.status === 'pendiente' && (
                    <label style={{ minHeight: 40, padding: '0 14px', borderRadius: 999, border: '1px solid #0B7A59', color: '#0B7A59', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      {uploading === i ? 'Subiendo…' : 'Subir'}
                      <input type="file" accept="application/pdf,image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && upload(i, e.target.files[0])} />
                    </label>
                  )}
                </span>
              </div>
            ))}</div>}
            {tab === 'pay' && <div className="card">{(data.payments || []).length ? data.payments!.map((p) => (
              <div key={p.date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '20px 24px', borderBottom: '1px solid rgba(11,31,51,0.08)' }}>
                <div><p style={{ margin: 0, fontWeight: 600 }}>{p.name}</p><p style={{ margin: '2px 0 0', fontSize: 14, color: '#5E584E' }}>{new Date(p.date).toLocaleDateString('es-VE')}</p></div>
                <span style={{ display: 'flex', gap: 12, alignItems: 'center' }}><span className="serif" style={{ fontSize: 22 }}>USD {p.usd}</span><span style={badge(p.status)}>{LABEL[p.status] || p.status}</span></span>
              </div>
            )) : <p style={{ padding: 24, margin: 0 }}>Aún no hay pagos con tarjeta registrados. Los pagos por Zelle o Binance los refleja tu abogada en Mensajes.</p>}</div>}
            {tab === 'msg' && <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(data.notes || []).length ? data.notes!.map((n) => <div key={n.date} className="card" style={{ padding: '22px 24px' }}><p className="mono" style={{ margin: '0 0 8px', fontSize: 11.5, color: '#5E584E' }}>{new Date(n.date).toLocaleDateString('es-VE', { day: 'numeric', month: 'long' })}</p><p style={{ margin: 0 }}>{n.body}</p></div>) : <p>Todavía no hay mensajes de tu abogada.</p>}
              <p style={{ fontSize: 14, color: '#5E584E' }}>¿Quieres escribir a tu abogada? Responde al último WhatsApp o correo de tu expediente {data.caseId}.</p>
            </div>}
            {tab === 'citas' && <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(data.bookings || []).length ? data.bookings!.map((b) => (
                <div key={b.uid} className="card" style={{ padding: 28 }}>
                  <p className="mono accent" style={{ margin: '0 0 8px', fontSize: 11.5, letterSpacing: '0.1em' }}>PRÓXIMA CITA</p>
                  <p className="serif" style={{ margin: '0 0 6px', fontSize: 28 }}>{b.title}</p>
                  <p style={{ margin: '0 0 18px', color: '#5E584E' }}>{new Date(b.start).toLocaleString('es-VE', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                  {b.meetingUrl && b.meetingUrl.startsWith('http') && <a className="btn btn-ink" href={b.meetingUrl} target="_blank" rel="noopener noreferrer">Entrar a la videollamada</a>}
                </div>
              )) : <div className="card" style={{ padding: 28 }}><p style={{ margin: '0 0 16px' }}>No tienes citas próximas.</p><Link className="btn btn-ink" href="/agendar">Agendar una consulta</Link></div>}
            </div>}
          </div>
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#0B1F33', color: '#F4EFE6', borderRadius: 10, padding: 26 }}>
              <p className="mono" style={{ margin: '0 0 10px', fontSize: 11.5, letterSpacing: '0.14em', color: '#3DD1A0' }}>TU PRÓXIMO PASO</p>
              <p className="serif" style={{ margin: '0 0 8px', fontSize: 24, lineHeight: 1.15 }}>{pend > 0 ? `Sube ${pend} documento${pend > 1 ? 's' : ''} pendiente${pend > 1 ? 's' : ''}` : 'Todo recibido. Tu abogada avanza con el expediente.'}</p>
              <p style={{ margin: 0, fontSize: 14, color: '#A9B2BE' }}>Te avisamos por WhatsApp en cada cambio de estado.</p>
            </div>
            <div className="card" style={{ padding: 26 }}>
              <p className="mono" style={{ margin: '0 0 10px', fontSize: 11.5, letterSpacing: '0.14em', color: '#5E584E' }}>PROGRESO</p>
              <p className="serif" style={{ margin: 0, fontSize: 48, lineHeight: 1 }}>{progress}%</p>
              <div style={{ height: 6, background: 'rgba(11,31,51,0.1)', borderRadius: 6, overflow: 'hidden', marginTop: 12 }}><div style={{ height: '100%', width: `${progress}%`, background: '#0B7A59' }} /></div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
