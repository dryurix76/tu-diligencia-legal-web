'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PhoneField from './PhoneField';
import { CONSULTS, AREAS } from '@/lib/catalog';
import { postJSON, formValues } from '@/lib/client';
import { track, getAttribution } from '@/lib/track';

const TIM: [string, string][] = [['now', 'Ahora mismo'], ['3m', 'En 3 meses'], ['6m', 'En 6 meses o más'], ['info', 'Solo me informo']];
const PRE: [string, string][] = [['verde', 'Sí, salió viable'], ['ambar', 'Sí, con puntos a revisar'], ['no', 'No la hice']];
const TZS: [string, string][] = [['America/Caracas', 'Caracas (UTC−4)'], ['Europe/Madrid', 'Madrid'], ['America/Bogota', 'Bogotá y Panamá (UTC−5)'], ['America/New_York', 'Miami / Nueva York'], ['America/Santiago', 'Santiago'], ['America/Lima', 'Lima']];
const PAY: [string, string, string][] = [['card', 'Tarjeta', 'Visa, Mastercard, Amex · confirmación inmediata'], ['pagomovil', 'Pago Móvil', 'En bolívares a tasa BCV · desde cualquier banco'], ['zelle', 'Zelle', 'Confirmamos en 1 hora hábil'], ['binance', 'Binance Pay', 'USDT · pago desde tu app de Binance']];
const fmtBs = (n: number) => 'Bs. ' + n.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Booking({ initialType = 'inicial', cancelled = false }: { initialType?: string; cancelled?: boolean }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState(CONSULTS.findIndex((c) => c.id === initialType) >= 0 ? CONSULTS.findIndex((c) => c.id === initialType) : 1);
  const [area, setArea] = useState(0);
  const [tim, setTim] = useState('');
  const [pre, setPre] = useState('');
  const [notes, setNotes] = useState('');
  const [tz, setTz] = useState('America/Caracas');
  const [days, setDays] = useState<{ date: string; slots: string[] }[]>([]);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [pay, setPay] = useState('card');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(cancelled ? 'El pago se canceló. Puedes intentarlo de nuevo.' : '');
  const [manual, setManual] = useState<{ caseId: string; ref: string; email: string; method: string; instructions: string; amountBs?: number; pm?: { bank: string; phone: string; id: string; name: string } } | null>(null);
  const [rate, setRate] = useState<{ usd: number; date: string } | null>(null);
  const [report, setReport] = useState<'' | 'sending' | 'ok' | string>('');

  useEffect(() => {
    if (step !== 4 || pay !== 'pagomovil' || rate) return;
    fetch('/api/rate').then((r) => (r.ok ? r.json() : null)).then((d) => d && setRate(d)).catch(() => {});
  }, [step, pay, rate]);

  const sendReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!manual) return;
    const v = formValues(e.currentTarget);
    setReport('sending');
    const { ok, data } = await postJSON<any>('/api/payment/report', { ref: manual.ref, email: manual.email, reference: v.reference, bank: v.bank, payer: v.payer, date: v.date });
    setReport(ok ? 'ok' : data.error || 'No pudimos enviar el reporte. Escríbenos por WhatsApp.');
  };

  const c = CONSULTS[type];
  const isCall = c.kind === 'call';
  const labels = ['Consulta', 'Tu caso', isCall ? 'Fecha y hora' : 'Tu pregunta', 'Pago'];

  useEffect(() => {
    if (step !== 3 || !isCall) return;
    setLoadingSlots(true); setSlot('');
    fetch(`/api/slots?consult=${c.id}&area=${AREAS[area].id}&tz=${encodeURIComponent(tz)}`).then((r) => r.json()).then((d) => { setDays(d.days || []); setDay(0); }).catch(() => setDays([])).finally(() => setLoadingSlots(false));
  }, [step, isCall, c.id, area, tz]);

  const fmtDay = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('es-VE', { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', timeZone: tz });
  const when = useMemo(() => !isCall ? 'Respuesta en 48 h' : slot ? new Date(slot).toLocaleString('es-VE', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: tz }) : 'Por elegir', [isCall, slot, tz]);

  const next = () => {
    setError('');
    if (step === 2 && !tim) { setError('Dinos cuándo quieres empezar.'); return; }
    if (step === 3 && isCall && !slot) { setError('Elige un horario.'); return; }
    if (step === 3 && !isCall && notes.trim().length < 15) { setError('Escribe tu pregunta (mínimo 15 caracteres).'); return; }
    setStep(step + 1);
  };

  const pay_ = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = formValues(e.currentTarget);
    setBusy(true); setError('');
    track('begin_checkout', { value: c.usd, currency: 'USD', items: [{ item_id: c.id, item_name: c.name, price: c.usd }], payment_type: pay }, { email: v.email, phone: v.phone });
    const { ok, data } = await postJSON<any>('/api/checkout', {
      consult: c.id, area: AREAS[area].id, start: isCall ? slot : '', tz, name: v.name, email: v.email, phone: v.phone, country: v.country,
      notes, timing: tim, pre: pre === 'no' ? 'no' : pre, pay, terms: v.terms === 'on', early: v.early === 'on', attribution: getAttribution(),
    });
    setBusy(false);
    if (!ok) { setError(data.error || 'No pudimos procesar el pago.'); return; }
    if (data.url) { window.location.href = data.url; return; }
    if (data.manual) { setManual({ caseId: data.caseId, ref: data.ref, email: v.email, method: data.method, instructions: data.instructions, amountBs: data.amountBs, pm: data.pm }); setStep(5); }
  };

  const card = (on: boolean): React.CSSProperties => ({ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, padding: '22px 24px', borderRadius: 12, cursor: 'pointer', font: 'inherit', color: 'var(--ink)', background: 'var(--card)', border: on ? '2px solid var(--green)' : '1.5px solid color-mix(in srgb, var(--ink) 15%, transparent)', textAlign: 'left' });

  return (
    <>
      <section style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
        <div className="wrap" style={{ paddingTop: 24, paddingBottom: 56 }}>
          <p className="mono" style={{ margin: '0 0 20px', fontSize: 13, letterSpacing: '0.12em', color: 'var(--green-lt)' }}>AGENDAR CONSULTA</p>
          <h1 className="h1" style={{ fontSize: 'clamp(48px, 7vw, 84px)' }}>Tu caso, con el abogado <em style={{ color: 'var(--green-lt)' }}>que sabe de él</em>.</h1>
          <ol style={{ display: 'flex', gap: 8, marginTop: 40, flexWrap: 'wrap', listStyle: 'none', padding: 0 }}>
            {labels.map((l, i) => <li key={l} aria-current={step === i + 1 ? 'step' : undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minHeight: 40, padding: '0 16px', borderRadius: 999, fontSize: 14, ...(step === i + 1 ? { background: 'var(--green-lt)', color: 'var(--ink)', fontWeight: 600 } : step > i + 1 ? { background: 'color-mix(in srgb, var(--paper) 14%, transparent)' } : { border: '1px solid color-mix(in srgb, var(--paper) 25%, transparent)', color: 'var(--on-dark-2)' }) }}><span className="mono" style={{ fontSize: 12 }}>0{i + 1}</span>{l}</li>)}
          </ol>
        </div>
      </section>

      <section style={{ padding: '72px 0 112px' }}>
        <div className="wrap g-side">
          <div>
            {step === 1 && (
              <div className="fade">
                <h2 className="serif" style={{ margin: '0 0 8px', fontSize: 40, fontWeight: 340 }}>¿Qué consulta necesitas?</h2>
                <p style={{ margin: '0 0 28px', color: 'var(--muted)' }}>Todas las consultas son de pago y se descuentan del servicio si contratas en 30 días.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {CONSULTS.map((x, i) => (
                    <button key={x.id} type="button" style={card(type === i)} onClick={() => { setType(i); setStep(2); }}>
                      <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span className="serif" style={{ fontSize: 24 }}>{x.name}</span><span style={{ fontSize: 14.5, color: 'var(--muted)' }}>{x.desc}</span></span>
                      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}><span className="serif" style={{ fontSize: 30, whiteSpace: 'nowrap' }}>USD {x.usd}</span><span className="mono accent" style={{ fontSize: 11, letterSpacing: '0.1em' }}>{x.tag}</span></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <h2 className="serif" style={{ margin: 0, fontSize: 40, fontWeight: 340 }}>Cuéntanos tu caso</h2>
                <div><p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 500 }}>¿Sobre qué servicio?</p><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{AREAS.map((a, i) => <button key={a.id} type="button" className="chip" aria-pressed={area === i} onClick={() => setArea(i)}>{a.label}</button>)}</div></div>
                <div><p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 500 }}>¿Cuándo quieres empezar?</p><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{TIM.map(([k, l]) => <button key={k} type="button" className="chip" aria-pressed={tim === k} onClick={() => setTim(k)}>{l}</button>)}</div></div>
                <div><p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 500 }}>¿Hiciste la pre-evaluación gratuita?</p><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{PRE.map(([k, l]) => <button key={k} type="button" className="chip" aria-pressed={pre === k} onClick={() => setPre(k)}>{l}</button>)}</div></div>
                {tim === 'info' && c.id !== 'expres' && (
                  <div style={{ background: 'var(--paper)', border: '1px solid var(--green-lt)', borderRadius: 10, padding: '18px 20px', fontSize: 15 }}>
                    <strong>¿Solo te estás informando?</strong> Diana y el centro de respuestas resuelven gratis la mayoría de dudas. Si aun así quieres un abogado, te recomendamos la consulta exprés por escrito (USD 35). <button type="button" onClick={() => { setType(0); }} style={{ background: 'none', border: 0, padding: 0, color: 'var(--green)', textDecoration: 'underline', font: 'inherit', cursor: 'pointer' }}>Cambiar a consulta exprés</button> · <Link href="/ayuda">Centro de respuestas</Link>
                  </div>
                )}
                {isCall && <label className="lbl">Resume tu caso<textarea className="field" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} placeholder="Ej.: mi abuelo nació en Lugo en 1925, tengo su cédula pero no su partida." /></label>}
              </div>
            )}

            {step === 3 && (
              <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {!isCall ? (
                  <>
                    <h2 className="serif" style={{ margin: 0, fontSize: 40, fontWeight: 340 }}>Tu pregunta para el abogado</h2>
                    <label className="lbl">Escribe tu pregunta (máximo 500 caracteres)<textarea className="field" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} placeholder="Sé concreto: el abogado te responderá por escrito en 48 h." /></label>
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>Si necesitas enviar documentos, podrás subirlos en Mi caso tras el pago.</p>
                  </>
                ) : (
                  <>
                    <h2 className="serif" style={{ margin: 0, fontSize: 40, fontWeight: 340 }}>Elige día y hora</h2>
                    <label className="lbl" style={{ maxWidth: 360 }}>Zona horaria<select className="field" value={tz} onChange={(e) => setTz(e.target.value)}>{TZS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
                    {loadingSlots ? <p>Cargando agenda del abogado…</p> : days.length === 0 ? <p className="err">No hay horarios disponibles en los próximos días. Escríbenos por WhatsApp o elige la consulta exprés.</p> : (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10 }}>
                          {days.map((d, i) => <button key={d.date} type="button" className="chip" aria-pressed={day === i} onClick={() => { setDay(i); setSlot(''); }} style={{ minHeight: 64, borderRadius: 12 }}>{fmtDay(d.date)}</button>)}
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{days[day]?.slots.map((s) => <button key={s} type="button" className="chip" aria-pressed={slot === s} onClick={() => setSlot(s)}>{fmtTime(s)}</button>)}</div>
                      </>
                    )}
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>{c.id === 'urgente' ? 'Consulta urgente: horarios desde 2 horas a partir de ahora, hoy o mañana. ' : ''}Te asignamos el abogado especialista en {AREAS[area].label.toLowerCase()}. Recibirás el enlace de la videollamada al confirmar el pago.</p>
                  </>
                )}
              </div>
            )}

            {step === 4 && (
              <form className="fade" onSubmit={pay_} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <h2 className="serif" style={{ margin: 0, fontSize: 40, fontWeight: 340 }}>Tus datos y el pago</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <label className="lbl">Nombre y apellido<input className="field" name="name" required minLength={2} autoComplete="name" /></label>
                  <label className="lbl">Correo electrónico<input className="field" name="email" type="email" required autoComplete="email" /></label>
                  <div style={{ gridColumn: '1 / -1' }}><PhoneField /></div>
                  <label className="lbl">País donde vives<select className="field" name="country">{['Venezuela', 'España', 'Colombia', 'Panamá', 'Estados Unidos', 'Otro'].map((x) => <option key={x}>{x}</option>)}</select></label>
                </div>
                <fieldset style={{ border: 0, padding: 0, margin: 0 }}><legend style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>Medio de pago</legend>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
                    {PAY.map(([k, l, s]) => <button key={k} type="button" aria-pressed={pay === k} onClick={() => setPay(k)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, padding: 16, borderRadius: 12, cursor: 'pointer', font: 'inherit', color: 'var(--ink)', background: 'var(--card)', border: pay === k ? '2px solid var(--green)' : '1.5px solid color-mix(in srgb, var(--ink) 15%, transparent)', textAlign: 'left' }}><span style={{ fontWeight: 600 }}>{l}</span><span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{s}</span></button>)}
                  </div>
                </fieldset>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>{pay === 'pagomovil' ? (rate ? `Pagas ${fmtBs(Math.round(c.usd * rate.usd * 100) / 100)} (USD ${c.usd} a la tasa BCV de ${rate.usd.toLocaleString('es-VE', { maximumFractionDigits: 4 })} Bs., ${rate.date}). Reservamos tu horario, te damos los datos del Pago Móvil y nos reportas la referencia.` : 'Calculamos el monto en bolívares a la tasa BCV del día.') : pay === 'card' ? 'Pagas en la página segura de Stripe. No guardamos los datos de tu tarjeta.' : pay === 'binance' ? 'Te llevamos a Binance Pay para pagar en USDT. Si el pago automático no está disponible, te damos el ID de Binance y tu referencia.' : 'Reservamos tu horario y te enviamos los datos de Zelle con tu referencia. Si no recibimos el pago en 24 horas (o antes de la cita, si es urgente), la reserva puede liberarse.'}</p>
                <label className="check"><input type="checkbox" name="terms" required /><span>Acepto las <Link href="/legal/terminos" target="_blank">condiciones de contratación</Link>, la <Link href="/legal/reembolsos" target="_blank">política de reembolsos</Link> (reprogramación gratis hasta 24 h antes) y la <Link href="/legal/privacidad" target="_blank">privacidad</Link>.</span></label>
                <label className="check"><input type="checkbox" name="early" required /><span>Pido que la consulta se preste antes de que terminen los 14 días de desistimiento y reconozco que, una vez prestada por completo, perderé ese derecho (art. 103.a TRLGDCU). Si cancelo antes, se aplica la política de reembolsos.</span></label>
                {error && <p className="err" role="alert">{error}</p>}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setStep(3)}>Atrás</button>
                  <button type="submit" className="btn btn-green btn-lg" disabled={busy}>{busy ? 'Procesando…' : pay === 'card' ? `Pagar USD ${c.usd}` : pay === 'pagomovil' ? 'Reservar y ver datos del Pago Móvil' : 'Reservar y ver datos de pago'}</button>
                </div>
              </form>
            )}

            {step === 5 && manual && (
              <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <h2 className="h2" style={{ marginBottom: 0 }}>Reserva hecha. <em>Falta el pago.</em></h2>
                <div className="card" style={{ padding: 28, fontSize: 17 }}>
                  <p className="mono accent" style={{ margin: '0 0 12px', fontSize: 12, letterSpacing: '0.12em' }}>REFERENCIA {manual.ref} · CASO {manual.caseId}</p>
                  {manual.method === 'pagomovil' && manual.pm ? (
                    <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 20px', margin: 0 }}>
                      {([['Monto', manual.amountBs ? fmtBs(manual.amountBs) : ''], ['Banco', manual.pm.bank], ['Teléfono', manual.pm.phone], ['RIF / C.I.', manual.pm.id], ...(manual.pm.name ? [['Titular', manual.pm.name]] : []), ['Concepto', manual.ref]] as [string, string][]).map(([k, val]) => (
                        <div key={k} style={{ display: 'contents' }}>
                          <dt style={{ color: 'var(--muted)', fontSize: 14, alignSelf: 'center' }}>{k}</dt>
                          <dd style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><strong className={k === 'Monto' ? 'serif' : undefined} style={k === 'Monto' ? { fontSize: 28, fontWeight: 400 } : undefined}>{val}</strong>
                            <button type="button" className="chip" style={{ minHeight: 30, padding: '0 10px', fontSize: 12.5 }} onClick={() => navigator.clipboard?.writeText(k === 'Monto' ? (manual.amountBs ?? 0).toFixed(2).replace('.', ',') : val)}>Copiar</button></dd>
                        </div>
                      ))}
                    </dl>
                  ) : <p style={{ margin: 0 }}>{manual.instructions}</p>}
                  {manual.method === 'pagomovil' && <p style={{ margin: '16px 0 0', fontSize: 14, color: 'var(--muted)' }}>{manual.instructions.slice(Math.max(0, manual.instructions.indexOf('Monto calculado')))}</p>}
                </div>
                <form onSubmit={sendReport} className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <p className="serif" style={{ margin: 0, fontSize: 24 }}>¿Ya pagaste? Repórtalo aquí</p>
                  <p style={{ margin: 0, fontSize: 14.5, color: 'var(--muted)' }}>Con la referencia lo verificamos en el banco y te confirmamos la cita, normalmente en menos de 1 hora hábil.</p>
                  {report === 'ok' ? <p role="status" style={{ margin: 0, fontWeight: 500, color: 'var(--green)' }}>Recibimos tu reporte. Te avisamos por correo y WhatsApp en cuanto lo verifiquemos.</p> : (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                        <label className="lbl">N.º de referencia o confirmación<input className="field" name="reference" required minLength={4} maxLength={40} inputMode={manual.method === 'pagomovil' ? 'numeric' : 'text'} placeholder={manual.method === 'pagomovil' ? 'Últimos 6 dígitos o completo' : 'ID de la transacción'} /></label>
                        {manual.method === 'pagomovil' && <label className="lbl">Banco desde el que pagaste<input className="field" name="bank" maxLength={60} placeholder="Ej.: Banesco" /></label>}
                        <label className="lbl">{manual.method === 'pagomovil' ? 'Teléfono o cédula del pagador' : manual.method === 'zelle' ? 'Correo o nombre en Zelle' : 'Usuario de Binance'}<input className="field" name="payer" maxLength={40} /></label>
                        <label className="lbl">Fecha del pago<input className="field" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></label>
                      </div>
                      {report && report !== 'sending' && <p className="err" role="alert">{report}</p>}
                      <button type="submit" className="btn btn-green" disabled={report === 'sending'} style={{ alignSelf: 'flex-start' }}>{report === 'sending' ? 'Enviando…' : 'Reportar mi pago'} <span className="arr" aria-hidden="true">→</span></button>
                    </>
                  )}
                </form>
                <p style={{ margin: 0, color: 'var(--ink-80)', fontSize: 15 }}>También te enviamos estos datos por correo y WhatsApp. Tu horario queda reservado mientras verificamos el pago.</p>
              </div>
            )}

            {step >= 2 && step <= 3 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>Atrás</button>
                <button type="button" className="btn btn-ink" onClick={next}>Continuar</button>
              </div>
            )}
            {error && step < 4 && <p className="err" role="alert" style={{ marginTop: 16 }}>{error}</p>}
          </div>

          <aside className="card" style={{ padding: 28, position: 'sticky', top: 24 }}>
            <p className="mono" style={{ margin: '0 0 16px', fontSize: 11.5, letterSpacing: '0.14em', color: 'var(--muted)' }}>RESUMEN</p>
            <p className="serif" style={{ margin: 0, fontSize: 26, lineHeight: 1.1 }}>{c.name}</p>
            <p style={{ margin: '6px 0 18px', fontSize: 14, color: 'var(--muted)' }}>{c.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14.5, borderTop: '1px solid color-mix(in srgb, var(--ink) 10%, transparent)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span style={{ color: 'var(--muted)' }}>Servicio</span><span style={{ textAlign: 'right' }}>{AREAS[area].label}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span style={{ color: 'var(--muted)' }}>Cuándo</span><span style={{ textAlign: 'right' }}>{when}</span></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 18, paddingTop: 16, borderTop: '1px solid color-mix(in srgb, var(--ink) 10%, transparent)' }}><span className="serif" style={{ fontSize: 20 }}>Total</span><span className="serif" style={{ fontSize: 38 }}>USD {c.usd}</span></div>
            {pay === 'pagomovil' && rate && step >= 4 && <p className="mono" style={{ margin: '6px 0 0', fontSize: 12.5, textAlign: 'right', color: 'var(--muted)' }}>≈ {fmtBs(Math.round(c.usd * rate.usd * 100) / 100)} · BCV {rate.date}</p>}
            <p className="accent" style={{ margin: '10px 0 0', fontSize: 13 }}>Se descuenta si contratas el servicio en 30 días.</p>
          </aside>
        </div>
      </section>
    </>
  );
}
