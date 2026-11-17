'use client';

import { useState } from 'react';
import Link from 'next/link';
import { postJSON, formValues } from '@/lib/client';
import { TIMING, SERVICE_OPTIONS, COUNTRIES } from '@/lib/catalog';
import { track, getAttribution } from '@/lib/track';

export function TimingChips({ value, onChange, legend = '¿Cuándo quieres empezar?' }: { value: string; onChange: (v: string) => void; legend?: string }) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
      <legend style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{legend}</legend>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {TIMING.map(([k, l]) => <button key={k} type="button" className="chip" aria-pressed={value === k} onClick={() => onChange(k)}>{l}</button>)}
      </div>
    </fieldset>
  );
}

export function Sent({ caseId, tier, service }: { caseId: string; tier: string; service: string }) {
  const msg = tier === 'C'
    ? 'Como aún te estás informando, te enviamos la guía y Diana responde tus dudas al instante. Cuando estés listo, te pasamos con un abogado.'
    : tier === 'A'
      ? 'Por lo que nos cuentas, el siguiente paso es la consulta con el abogado especialista. Te enviamos el enlace por WhatsApp y correo.'
      : 'Un asesor revisa tu mensaje en horario laboral. Si tienes una duda puntual, la consulta exprés por escrito te da la respuesta de un abogado en 48 h.';
  return (
    <div className="fade">
      <svg width="72" height="72" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" fill="none" stroke="#0B7A59" strokeWidth="3" /><path d="M38 62 L54 78 L84 44" fill="none" stroke="#0B7A59" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <p className="serif" style={{ margin: '20px 0 10px', fontSize: 34, lineHeight: 1.1 }}>Recibido. Tu caso es el <em>{caseId}</em>.</p>
      <p style={{ margin: '0 0 24px', color: '#4E4A43' }}>{msg}</p>
      <div className="card" style={{ padding: '18px 20px', fontSize: 14.5 }}>
        <p className="mono" style={{ margin: '0 0 8px', fontSize: 11.5, letterSpacing: '0.12em', color: '#5E584E' }}>WHATSAPP · DIANA</p>
        <p style={{ margin: 0 }}>Hola, soy Diana de Tu Diligencia Legal. Recibimos tu caso {caseId} sobre {service.toLowerCase()}. Te escribo por aquí con el siguiente paso.</p>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
        {tier === 'A' ? <Link className="btn btn-green" href="/agendar">Agendar mi consulta</Link> : tier === 'B' ? <Link className="btn btn-ink" href="/agendar?tipo=expres">Consulta exprés · USD 35</Link> : <Link className="btn btn-ink" href="/ayuda">Centro de respuestas</Link>}
      </div>
    </div>
  );
}

export function ContactForm({ service = 'Aún no lo sé', withReason = false, page = '' }: { service?: string; withReason?: boolean; page?: string }) {
  const [timing, setTiming] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ caseId: string; tier: string; service: string } | null>(null);
  if (done) return <Sent {...done} />;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = formValues(e.currentTarget);
    if (!timing) { setError('Dinos cuándo quieres empezar.'); return; }
    setBusy(true); setError('');
    const { ok, data } = await postJSON<any>('/api/lead', {
      name: v.name, email: v.email, phone: v.phone, country: v.country, service: v.service, timing, reason: v.reason || '',
      message: v.message, source: 'contacto', page, attribution: getAttribution(), consent: v.consent === 'on', website: v.website || '',
    });
    setBusy(false);
    if (!ok) { setError(data.error || 'No pudimos enviar. Intenta de nuevo.'); return; }
    track('generate_lead', { source: 'contacto', tier: data.tier, service: v.service }, { email: v.email, phone: v.phone });
    setDone({ caseId: data.caseId, tier: data.tier, service: v.service });
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <label className="lbl">Nombre y apellido<input className="field" name="name" required minLength={2} autoComplete="name" /></label>
        <label className="lbl">País donde vives<select className="field" name="country">{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="lbl">Correo electrónico<input className="field" name="email" type="email" required autoComplete="email" /></label>
        <label className="lbl">WhatsApp<input className="field" name="phone" type="tel" required autoComplete="tel" placeholder="+58 412 000 0000" /></label>
      </div>
      {withReason && <label className="lbl">Motivo<select className="field" name="reason"><option>Quiero iniciar un trámite</option><option>Tengo una duda sobre mi caso</option><option>Soy cliente</option><option>Prensa o alianzas</option><option>Otro</option></select></label>}
      <label className="lbl">Servicio<select className="field" name="service" defaultValue={service}>{[service, ...SERVICE_OPTIONS.filter((s) => s !== service)].map((s) => <option key={s}>{s}</option>)}</select></label>
      <TimingChips value={timing} onChange={setTiming} />
      <label className="lbl">Cuéntanos tu caso en pocas líneas<textarea className="field" name="message" maxLength={3000} placeholder="Quién de tu familia era europeo, dónde vives hoy y qué te gustaría lograr." /></label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999 }} />
      <label className="check"><input type="checkbox" name="consent" required />Acepto la política de privacidad y que me contacten por correo y WhatsApp.</label>
      {error && <p className="err" role="alert">{error}</p>}
      <button type="submit" className="btn btn-ink" disabled={busy} style={{ minHeight: 56 }}>{busy ? 'Enviando…' : 'Enviar mi caso'}</button>
    </form>
  );
}

export function GuideForm({ service = 'Aún no lo sé', dark = true, cta = 'Recibir la guía' }: { service?: string; dark?: boolean; cta?: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  if (state === 'done') return <p className="serif fade" style={{ margin: 0, fontSize: 22 }}>Listo. Revisa tu correo: la guía va en camino.</p>;
  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const v = formValues(e.currentTarget);
      setState('busy');
      const { ok } = await postJSON('/api/lead', { name: v.name, email: v.email, source: 'guia', service, consent: true, timing: 'info', attribution: getAttribution() });
      if (ok) track('sign_up', { method: 'guia', service });
      setState(ok ? 'done' : 'error');
    }} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <label style={{ flex: '1 1 160px' }}><span className="sr-only">Nombre</span><input className="field" name="name" required minLength={2} placeholder="Tu nombre" style={{ background: '#F4EFE6' }} /></label>
      <label style={{ flex: '1 1 200px' }}><span className="sr-only">Correo electrónico</span><input className="field" name="email" type="email" required placeholder="tu@correo.com" style={{ background: '#F4EFE6' }} /></label>
      <button type="submit" className={`btn ${dark ? 'btn-mint' : 'btn-ink'}`} disabled={state === 'busy'} style={{ minHeight: 54 }}>{cta}</button>
      {state === 'error' && <p className="err" style={{ width: '100%' }}>No pudimos enviarla. Intenta de nuevo.</p>}
      <p style={{ width: '100%', margin: 0, fontSize: 12.5, color: dark ? '#A9B2BE' : '#5E584E' }}>Al enviarlo aceptas recibir la guía y comunicaciones de Tu Diligencia Legal. Puedes darte de baja cuando quieras.</p>
    </form>
  );
}

export function ContactSection({ kicker, title, lede, service, withReason = false, page = '' }: { kicker: string; title: React.ReactNode; lede: string; service?: string; withReason?: boolean; page?: string }) {
  return (
    <section id="contacto" className="sand section">
      <div className="wrap g-2" style={{ alignItems: 'start' }}>
        <div>
          <p className="kicker">{kicker}</p>
          <h2 className="h2">{title}</h2>
          <p className="lede">{lede}</p>
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 15 }}>
            <span><span className="mono accent">01 </span>Respuesta automática en menos de 1 minuto</span>
            <span><span className="mono accent">02 </span>Un asesor revisa tu mensaje en horario laboral</span>
            <span><span className="mono accent">03 </span>Solo te pasamos con un abogado cuando estás listo</span>
          </div>
        </div>
        <div className="panel"><ContactForm service={service} withReason={withReason} page={page} /></div>
      </div>
    </section>
  );
}
