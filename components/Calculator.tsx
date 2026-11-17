'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SERVICE_PRICES } from '@/lib/catalog';

const fmt = (v: number) => Math.round(v).toLocaleString('es-ES');

export default function Calculator() {
  const [svc, setSvc] = useState(0);
  const [n, setN] = useState(1);
  const [cuotas, setCuotas] = useState(3);
  const [paid, setPaid] = useState(false);
  const base = SERVICE_PRICES[svc][1];
  const extra = Math.round(base * 0.85 * (n - 1));
  const disc = paid ? 60 : 0;
  const total = base + extra - disc;
  const round: React.CSSProperties = { width: 48, height: 48, borderRadius: '50%', border: '1.5px solid rgba(11,31,51,0.25)', background: '#fff', fontSize: 22, cursor: 'pointer', color: '#0B1F33' };

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <label className="lbl">Servicio
        <select className="field" value={svc} onChange={(e) => setSvc(Number(e.target.value))}>
          {SERVICE_PRICES.map(([l, p], i) => <option key={l} value={i}>{l} · desde USD {fmt(p)}</option>)}
        </select>
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        <div>
          <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 500 }} id="personas">Personas en el expediente</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} aria-labelledby="personas">
            <button type="button" style={round} aria-label="Quitar una persona" onClick={() => setN(Math.max(1, n - 1))}>−</button>
            <span className="serif" style={{ fontSize: 40, minWidth: 40, textAlign: 'center' }} aria-live="polite">{n}</span>
            <button type="button" style={round} aria-label="Añadir una persona" onClick={() => setN(Math.min(8, n + 1))}>+</button>
          </div>
        </div>
        <div>
          <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 500 }}>Cuotas</p>
          <div style={{ display: 'flex', gap: 8 }}>{[1, 2, 3].map((c) => <button key={c} type="button" className="chip" aria-pressed={cuotas === c} onClick={() => setCuotas(c)}>{c === 1 ? 'Un pago' : `${c} cuotas`}</button>)}</div>
        </div>
      </div>
      <label className="check" style={{ fontSize: 15, alignItems: 'center' }}><input type="checkbox" checked={paid} onChange={() => setPaid(!paid)} />Ya pagué la consulta inicial (USD 60) en los últimos 30 días</label>
      <div style={{ background: '#0B1F33', color: '#F4EFE6', borderRadius: 8, padding: 28 }}>
        {[['Servicio base', fmt(base)], [n > 1 ? `${n - 1} familiar${n > 2 ? 'es' : ''} adicional${n > 2 ? 'es' : ''} (−15%)` : 'Familiares adicionales', fmt(extra)], ['Descuento por consulta', '− ' + fmt(disc)]].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#A9B2BE', paddingBottom: 8 }}><span>{l}</span><span>USD {v}</span></div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 16, borderTop: '1px solid rgba(244,239,230,0.15)', gap: 16, flexWrap: 'wrap' }}>
          <span className="serif" style={{ fontSize: 22 }}>Total estimado</span>
          <span className="serif" style={{ fontSize: 52, color: '#3DD1A0', lineHeight: 1 }} aria-live="polite">USD {fmt(total)}</span>
        </div>
        <p style={{ margin: '8px 0 0', textAlign: 'right', fontSize: 14, color: '#C9CFD6' }}>{cuotas === 1 ? 'Un solo pago' : `${cuotas} cuotas de USD ${fmt(total / cuotas)}`} · tasas oficiales aparte</p>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link className="btn btn-green" href="/agendar?tipo=inicial">Agendar la consulta inicial</Link>
        <a className="btn btn-ghost" href="#contacto">Recibir un presupuesto por escrito</a>
      </div>
    </div>
  );
}
