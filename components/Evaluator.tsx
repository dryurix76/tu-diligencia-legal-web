'use client';

import { useState } from 'react';
import Link from 'next/link';
import { postJSON, formValues } from '@/lib/client';
import { TimingChips } from './Forms';
import { track, getAttribution } from '@/lib/track';
import type { Tree } from '@/lib/evaluators';
import { CONSULTS } from '@/lib/catalog';

type Opt = [string, number] | [string, number, 'g' | 'r'];
export interface EvalQuestion { text: string; opts: Opt[] }
export interface EvalResult { tag: string; title: string; body: string; next: string; nextSub: string; cta: string; href: string }

const COLORS = ['#12A37A', '#C98A12', '#A3312A'];
const LIGHTS = ['verde', 'ambar', 'rojo'] as const;

export default function Evaluator({ questions, results, service, tree }: { questions: EvalQuestion[]; results: EvalResult[]; service: string; tree?: Tree }) {
  if (tree) return <TreeEvaluator tree={tree} service={service} />;
  return <LegacyEvaluator questions={questions} results={results} service={service} />;
}

function LegacyEvaluator({ questions, results, service }: { questions: EvalQuestion[]; results: EvalResult[]; service: string }) {
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
          <label className="check"><input type="checkbox" name="consent" required /><span>Acepto la política de privacidad y recibir mi resultado por correo y WhatsApp.</span></label>
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

const LIGHT_IDX = { verde: 0, ambar: 1, rojo: 2 } as const;
const LIGHT_TAG = { verde: 'VIABLE', ambar: 'VIABLE CON PUNTOS A REVISAR', rojo: 'ESTA VÍA NO · HAY ALTERNATIVAS' } as const;

function TreeEvaluator({ tree, service }: { tree: Tree; service: string }) {
  const [path, setPath] = useState<{ node: string; opt: number }[]>([]);
  const [resultId, setResultId] = useState('');
  const [stage, setStage] = useState<'q' | 'contact' | 'result'>('q');
  const [timing, setTiming] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [caseId, setCaseId] = useState('');

  const current = path.length ? tree.nodes[path[path.length - 1].node].opts[path[path.length - 1].opt].next || '' : tree.start;
  const node = resultId ? null : tree.nodes[current];
  const R = resultId ? tree.results[resultId] : null;
  const level = R ? LIGHT_IDX[R.light] : 0;
  const informing = timing === 'info' || timing === '6m';
  const consult = R ? CONSULTS.find((c) => c.id === R.consult) : null;
  const pct = stage === 'result' ? 100 : stage === 'contact' ? 90 : Math.min(80, 12 + path.length * 17);

  const choose = (i: number) => {
    if (!node) return;
    if (!path.length) track('evaluator_start', { service });
    const o = node.opts[i];
    setPath([...path, { node: node.id, opt: i }]);
    if (o.result) { setResultId(o.result); setStage('contact'); }
  };
  const back = () => { setPath(path.slice(0, -1)); setResultId(''); setStage('q'); };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!R) return;
    const v = formValues(e.currentTarget);
    if (!timing) { setError('Dinos cuándo quieres empezar.'); return; }
    setBusy(true); setError('');
    const { ok, data } = await postJSON<any>('/api/lead', {
      name: v.name, email: v.email, phone: `${v.prefix} ${v.phone}`.trim(), service, timing, light: R.light, source: 'evaluador',
      answers: path.map((s) => `${tree.nodes[s.node].text} → ${tree.nodes[s.node].opts[s.opt].label}`),
      result: { title: R.title, route: R.route, confidence: R.confidence, basis: R.basis, pending: R.pending },
      attribution: getAttribution(), consent: v.consent === 'on', page: typeof window !== 'undefined' ? window.location.pathname : '', website: v.website || '',
    });
    setBusy(false);
    if (!ok) { setError(data.error || 'No pudimos guardar tu resultado. Intenta de nuevo.'); return; }
    track('generate_lead', { source: 'evaluador', tier: data.tier, light: R.light, service }, { email: v.email, phone: `${v.prefix}${v.phone}` });
    setCaseId(data.caseId);
    setStage('result');
  };

  return (
    <div className="panel" style={{ padding: 'clamp(24px, 5vw, 44px)', minHeight: 540 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, minHeight: 44 }}>
        <span className="mono" style={{ fontSize: 12, letterSpacing: '0.12em', color: '#5E584E' }}>{stage === 'q' ? `PREGUNTA ${path.length + 1}` : stage === 'result' ? 'TU RESULTADO' : 'ÚLTIMO PASO'}</span>
        {path.length > 0 && stage !== 'result' && <button type="button" onClick={back} style={{ background: 'none', border: 0, color: '#0B7A59', font: 'inherit', fontSize: 14, cursor: 'pointer', minHeight: 44 }}>← Atrás</button>}
      </div>
      <div style={{ height: 4, background: 'rgba(11,31,51,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 36 }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#0B7A59', transition: 'width .4s ease' }} />
      </div>

      {stage === 'q' && node && (
        <div className="fade" key={node.id}>
          <p className="serif" style={{ margin: '0 0 12px', fontSize: 'clamp(26px, 3.4vw, 34px)', lineHeight: 1.12, letterSpacing: '-0.02em' }}>{node.text}</p>
          {node.help && <p style={{ margin: '0 0 22px', fontSize: 14.5, color: '#5E584E' }}>{node.help}</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: node.help ? 0 : 16 }}>
            {node.opts.map((o, i) => <button key={o.label} type="button" className="opt" onClick={() => choose(i)}><span>{o.label}</span><span aria-hidden="true" className="accent">→</span></button>)}
          </div>
        </div>
      )}

      {stage === 'contact' && (
        <form className="fade" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p className="serif" style={{ margin: 0, fontSize: 32, lineHeight: 1.12 }}>Tu resultado está listo. ¿A dónde te lo enviamos?</p>
          <p style={{ margin: 0, fontSize: 14.5, color: '#5E584E' }}>Te lo mostramos aquí y te enviamos por correo la vía probable, su base legal y lo que un abogado debe confirmar.</p>
          <label className="lbl">Nombre y apellido<input className="field" name="name" required minLength={2} autoComplete="name" /></label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <label className="lbl">Correo electrónico<input className="field" name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" /></label>
            <label className="lbl">WhatsApp<span style={{ display: 'flex', gap: 8 }}><select className="field" name="prefix" aria-label="Prefijo" style={{ width: 108, flex: 'none' }}>{['+58', '+34', '+57', '+507', '+1', '+56', '+51', '+39', '+351'].map((p) => <option key={p}>{p}</option>)}</select><input className="field" name="phone" type="tel" required autoComplete="tel" placeholder="412 000 0000" /></span></label>
          </div>
          <TimingChips value={timing} onChange={setTiming} />
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999 }} />
          <label className="check"><input type="checkbox" name="consent" required /><span>Acepto la <a href="/legal/privacidad" target="_blank">política de privacidad</a> y recibir mi resultado por correo y WhatsApp.</span></label>
          {error && <p className="err" role="alert">{error}</p>}
          <button type="submit" className="btn btn-ink" disabled={busy} style={{ minHeight: 56 }}>{busy ? 'Guardando…' : 'Ver mi resultado'}</button>
        </form>
      )}

      {stage === 'result' && R && (
        <div className="fade">
          <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center' }}>
            {COLORS.map((c, i) => <span key={c} aria-hidden="true" style={{ width: 22, height: 22, borderRadius: '50%', background: level === i ? c : 'rgba(11,31,51,0.1)', boxShadow: level === i ? `0 0 0 6px ${c}22` : 'none' }} />)}
            <span className="mono" style={{ marginLeft: 'auto', fontSize: 11.5, letterSpacing: '0.1em', color: '#5E584E' }}>CONFIANZA {R.confidence.toUpperCase()}</span>
          </div>
          <p className="mono" style={{ margin: '0 0 10px', fontSize: 12, letterSpacing: '0.14em', color: COLORS[level] }}>{LIGHT_TAG[R.light]}</p>
          <p className="serif" style={{ margin: '0 0 12px', fontSize: 'clamp(28px, 3.6vw, 38px)', lineHeight: 1.05 }}>{R.title}</p>
          <p style={{ margin: '0 0 6px', fontSize: 15 }}><strong>Vía probable:</strong> {R.route}</p>
          <p style={{ margin: '0 0 18px', color: '#4E4A43' }}>{R.body}</p>
          <div style={{ borderLeft: '3px solid #0B7A59', padding: '4px 0 4px 16px', margin: '0 0 18px' }}>
            <p className="mono" style={{ margin: '0 0 4px', fontSize: 11, letterSpacing: '0.12em', color: '#5E584E' }}>BASE LEGAL</p>
            <p style={{ margin: 0, fontSize: 14.5 }}>{R.basis}{R.source && <> · <a href={R.source[1]} target="_blank" rel="noopener noreferrer">{R.source[0]}</a></>}</p>
          </div>
          {R.pending.length > 0 && (
            <div style={{ margin: '0 0 24px' }}>
              <p className="mono" style={{ margin: '0 0 6px', fontSize: 11, letterSpacing: '0.12em', color: '#5E584E' }}>LO QUE UN ABOGADO DEBE CONFIRMAR</p>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, color: '#4E4A43' }}>{R.pending.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          )}
          {!informing && consult ? (
            <div className="card" style={{ padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div><p className="serif" style={{ margin: 0, fontSize: 22 }}>Siguiente paso: {consult.name.toLowerCase()}</p><p style={{ margin: '2px 0 0', fontSize: 14, color: '#5E584E' }}>{consult.desc} USD {consult.usd}.</p></div>
              <Link className="btn btn-green" href={`/agendar?tipo=${consult.id}`}>Agendar</Link>
            </div>
          ) : (
            <div className="card" style={{ padding: '22px 24px' }}>
              <p className="serif" style={{ margin: '0 0 6px', fontSize: 22 }}>Sin prisa: primero, toda la información</p>
              <p style={{ margin: '0 0 16px', fontSize: 14.5, color: '#5E584E' }}>Te enviamos tu resultado por correo y Diana resuelve tus dudas 24 h. Cuando estés listo, agendas con un abogado.</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><Link className="btn btn-ink" href="/ayuda">Centro de respuestas</Link><Link className="btn btn-ghost" href={`/agendar?tipo=${R.consult}`}>Agendar igualmente</Link></div>
            </div>
          )}
          {R.alt && <p style={{ margin: '16px 0 0' }}><Link href={R.alt[1]} className="accent">{R.alt[0]} →</Link></p>}
          <p style={{ margin: '18px 0 0', fontSize: 13, color: '#5E584E' }}>Caso {caseId}. Resultado orientativo según la normativa vigente a noviembre de 2026. Un abogado confirma la viabilidad con tus documentos.</p>
        </div>
      )}
    </div>
  );
}
