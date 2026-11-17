'use client';

import { useState } from 'react';
import Link from 'next/link';
import { postJSON, formValues } from '@/lib/client';
import { TimingChips } from './Forms';
import { track, getAttribution } from '@/lib/track';

type Opt = [string, number] | [string, number, 'g' | 'r'];
export interface EvalQuestion { text: string; opts: Opt[] }
export interface EvalResult { tag: string; title: string; body: string; next: string; nextSub: string; cta: string; href: string }

const COLORS = ['#12A37A', '#C98A12', '#A3312A'];
const LIGHTS = ['verde', 'ambar', 'rojo'] as const;

export default function Evaluator({ questions, results, service }: { questions: EvalQuestion[]; results: EvalResult[]; service: string }) {
  const [ans, setAns] = useState<number[]>([]);
  const [stage, setStage] = useState<'q' | 'contact' | 'result'>('q');
  const [timing, setTiming] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [caseId, setCaseId] = useState('');

  const idx = ans.length;
  const total = questions.length;
  const inQ = idx < total;
  const q = questions[Math.min(idx, total - 1)];

  let score = 0, max = 0, forceG = false, forceR = false;
  questions.forEach((qq, i) => {
    max += Math.max(...qq.opts.map((o) => o[1]));
    if (i < ans.length) { const o = qq.opts[ans[i]]; score += o[1]; if (o[2] === 'g') forceG = true; if (o[2] === 'r') forceR = true; }
  });
  const ratio = max ? score / max : 0;
  const level = forceR ? 2 : forceG ? 0 : ratio >= 0.7 ? 0 : ratio >= 0.4 ? 1 : 2;
  const R = results[level];
  const informing = timing === 'info' || timing === '6m';
  const showResult = !inQ && stage === 'result';
  const pct = showResult ? 100 : Math.round(((inQ ? idx : total) / (total + 1)) * 100) + 6;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = formValues(e.currentTarget);
    if (!timing) { setError('Dinos cuándo quieres empezar.'); return; }
    setBusy(true); setError('');
    const { ok, data } = await postJSON<any>('/api/lead', {
      name: v.name, email: v.email, phone: `${v.prefix} ${v.phone}`.trim(), service, timing, light: LIGHTS[level], source: 'evaluador',
      answers: questions.map((qq, i) => `${qq.text} → ${qq.opts[ans[i]][0]}`), attribution: getAttribution(), consent: v.consent === 'on', page: typeof window !== 'undefined' ? window.location.pathname : '', website: v.website || '',
    });
    setBusy(false);
    if (!ok) { setError(data.error || 'No pudimos guardar tu resultado. Intenta de nuevo.'); return; }
    track('generate_lead', { source: 'evaluador', tier: data.tier, light: LIGHTS[level], service }, { email: v.email, phone: `${v.prefix}${v.phone}` });
    setCaseId(data.caseId);
    setStage('result');
  };

  return (
    <div className="panel" style={{ padding: 44, minHeight: 540 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, minHeight: 44 }}>
        <span className="mono" style={{ fontSize: 12, letterSpacing: '0.12em', color: '#5E584E' }}>{inQ ? `PREGUNTA ${idx + 1} DE ${total}` : showResult ? 'TU RESULTADO' : 'ÚLTIMO PASO'}</span>
        {ans.length > 0 && !showResult && <button type="button" onClick={() => { setAns(ans.slice(0, -1)); setStage('q'); }} style={{ background: 'none', border: 0, color: '#0B7A59', font: 'inherit', fontSize: 14, cursor: 'pointer', minHeight: 44 }}>← Atrás</button>}
      </div>
      <div style={{ height: 4, background: 'rgba(11,31,51,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 36 }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#0B7A59', transition: 'width .4s ease' }} />
      </div>

      {inQ && (
        <div className="fade" key={idx}>
          <p className="serif" style={{ margin: '0 0 28px', fontSize: 34, lineHeight: 1.12, letterSpacing: '-0.02em' }}>{q.text}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {q.opts.map((o, i) => <button key={o[0]} type="button" className="opt" onClick={() => { if (idx === 0) track('evaluator_start', { service }); setAns([...ans, i]); if (idx + 1 === total) setStage('contact'); }}><span>{o[0]}</span><span aria-hidden="true" className="accent">→</span></button>)}
          </div>
        </div>
      )}

      {!inQ && stage === 'contact' && (
        <form className="fade" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p className="serif" style={{ margin: 0, fontSize: 32, lineHeight: 1.12 }}>¿A dónde te enviamos tu resultado?</p>
          <label className="lbl">Nombre y apellido<input className="field" name="name" required minLength={2} autoComplete="name" /></label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <label className="lbl">Correo electrónico<input className="field" name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" /></label>
            <label className="lbl">WhatsApp<span style={{ display: 'flex', gap: 8 }}><select className="field" name="prefix" aria-label="Prefijo" style={{ width: 108, flex: 'none' }}>{['+58', '+34', '+57', '+507', '+1', '+56', '+51'].map((p) => <option key={p}>{p}</option>)}</select><input className="field" name="phone" type="tel" required autoComplete="tel" placeholder="412 000 0000" /></span></label>
          </div>
          <TimingChips value={timing} onChange={setTiming} />
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999 }} />
          <label className="check"><input type="checkbox" name="consent" required />Acepto la política de privacidad y recibir mi resultado por correo y WhatsApp.</label>
          {error && <p className="err" role="alert">{error}</p>}
          <button type="submit" className="btn btn-ink" disabled={busy} style={{ minHeight: 56 }}>{busy ? 'Guardando…' : 'Ver mi resultado'}</button>
        </form>
      )}

      {showResult && (
        <div className="fade">
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }} aria-hidden="true">
            {COLORS.map((c, i) => <span key={c} style={{ width: 22, height: 22, borderRadius: '50%', background: level === i ? c : 'rgba(11,31,51,0.1)', boxShadow: level === i ? `0 0 0 6px ${c}22` : 'none' }} />)}
          </div>
          <p className="mono" style={{ margin: '0 0 10px', fontSize: 12, letterSpacing: '0.14em', color: COLORS[level] }}>{R.tag}</p>
          <p className="serif" style={{ margin: '0 0 14px', fontSize: 38, lineHeight: 1.05 }}>{R.title}</p>
          <p style={{ margin: '0 0 28px', color: '#4E4A43' }}>{R.body}</p>
          {!informing ? (
            <div className="card" style={{ padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div><p className="serif" style={{ margin: 0, fontSize: 22 }}>{R.next}</p><p style={{ margin: '2px 0 0', fontSize: 14, color: '#5E584E' }}>{R.nextSub}</p></div>
              <Link className="btn btn-green" href={R.href === '/agendar' ? `/agendar?tipo=${level === 1 ? 'estrategia' : 'inicial'}` : R.href}>{R.cta}</Link>
            </div>
          ) : (
            <div className="card" style={{ padding: '22px 24px' }}>
              <p className="serif" style={{ margin: '0 0 6px', fontSize: 22 }}>Sin prisa: primero, toda la información</p>
              <p style={{ margin: '0 0 16px', fontSize: 14.5, color: '#5E584E' }}>Te enviamos la guía en PDF y Diana resuelve tus dudas 24 h. Cuando estés listo, agendas con un abogado.</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><Link className="btn btn-ink" href="/ayuda">Centro de respuestas</Link><Link className="btn btn-ghost" href={R.href}>Agendar igualmente</Link></div>
            </div>
          )}
          <p style={{ margin: '18px 0 0', fontSize: 13, color: '#5E584E' }}>Caso {caseId}. Resultado orientativo: un abogado confirma la viabilidad en la consulta.</p>
        </div>
      )}
    </div>
  );
}
