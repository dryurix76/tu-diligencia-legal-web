'use client';

import { useState } from 'react';
import Link from 'next/link';
import { postJSON, formValues } from '@/lib/client';
import { track, getAttribution } from '@/lib/track';

const SEL = (name: string, label: string, opts: string[]) => (
  <label className="lbl">{label}<select className="field" name={name} required defaultValue="">{[<option key="" value="" disabled>Elige una opción</option>, ...opts.map((o) => <option key={o}>{o}</option>)]}</select></label>
);

export default function BecaForm({ plan = '' }: { plan?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [caseId, setCaseId] = useState('');

  if (caseId) return (
    <div className="fade">
      <p className="serif" style={{ margin: '0 0 10px', fontSize: 32, lineHeight: 1.1 }}>Listo. Revisa tu correo.</p>
      <p style={{ margin: '0 0 18px', color: 'var(--ink-80)' }}>Te enviamos el enlace para descargar la guía de becas 2026 (caso {caseId}). Un asesor revisa tu perfil y te escribe en horario laboral.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><Link className="btn btn-green" href="/agendar?tipo=inicial">Hablar con un asesor</Link><Link className="btn btn-ghost" href="/visados">Visado de estudios</Link></div>
    </div>
  );

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const v = formValues(e.currentTarget);
      setBusy(true); setError('');
      const { ok, data } = await postJSON<any>('/api/lead', {
        name: v.name, email: v.email, phone: `${v.prefix} ${v.phone}`.trim(), service: 'Becas y estudios', source: 'beca', timing: v.plan ? '3m' : 'info', page: '/becas',
        message: v.message, consent: v.consent === 'on', website: v.website || '', attribution: getAttribution(),
        extra: { 'Nivel': v.level, 'País de destino': v.dest, 'Área de estudio': v.area, 'Título y promedio': v.grades, 'Idiomas': v.langs, 'Presupuesto propio': v.budget, 'Servicio de interés': v.plan },
      });
      setBusy(false);
      if (!ok) { setError(data.error || 'No pudimos registrar tu solicitud. Intenta de nuevo.'); return; }
      track('sign_up', { method: 'beca' }, { email: v.email, phone: `${v.prefix}${v.phone}` });
      setCaseId(data.caseId);
    }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <label className="lbl">Nombre y apellido<input className="field" name="name" required minLength={2} autoComplete="name" /></label>
        <label className="lbl">Correo electrónico<input className="field" name="email" type="email" required autoComplete="email" /></label>
        <label className="lbl">WhatsApp<span style={{ display: 'flex', gap: 8 }}><select className="field" name="prefix" aria-label="Prefijo" style={{ width: 108, flex: 'none' }}>{['+58', '+34', '+57', '+507', '+1', '+56', '+51', '+39', '+351'].map((p) => <option key={p}>{p}</option>)}</select><input className="field" name="phone" type="tel" autoComplete="tel" placeholder="412 000 0000" /></span></label>
        {SEL('level', '¿Qué quieres estudiar?', ['Grado', 'Máster', 'Doctorado', 'Curso o idioma'])}
        {SEL('dest', 'País de destino', ['España', 'Portugal', 'Italia', 'Cualquiera de los tres'])}
        <label className="lbl">Área de estudio<input className="field" name="area" required placeholder="Ej.: ingeniería, medicina, derecho" /></label>
        <label className="lbl">Último título y promedio<input className="field" name="grades" placeholder="Ej.: Ing. Civil UCV, 16/20" /></label>
        <label className="lbl">Idiomas<input className="field" name="langs" placeholder="Ej.: inglés B2, italiano A2" /></label>
        {SEL('budget', 'Presupuesto propio al año', ['Ninguno: necesito beca completa', 'Hasta 3.000 €', '3.000 – 8.000 €', 'Más de 8.000 €'])}
        <label className="lbl">Servicio de interés<select className="field" name="plan" defaultValue={plan}><option value="">Solo la guía por ahora</option><option>Te buscamos tu beca (USD 290)</option><option>Acompañamiento de solicitud (USD 490)</option><option>Pack beca + admisión (USD 890)</option></select></label>
      </div>
      <label className="lbl">Cuéntanos tu objetivo (opcional)<textarea className="field" name="message" rows={3} maxLength={1500} /></label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999 }} />
      <label className="check"><input type="checkbox" name="consent" required /><span>Acepto la <a href="/legal/privacidad" target="_blank">política de privacidad</a> y recibir la guía y comunicaciones sobre becas por correo y WhatsApp.</span></label>
      {error && <p className="err" role="alert">{error}</p>}
      <button type="submit" className="btn btn-ink" disabled={busy} style={{ minHeight: 56 }}>{busy ? 'Enviando…' : 'Recibir la guía de becas 2026'}</button>
    </form>
  );
}
