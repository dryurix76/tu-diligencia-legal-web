'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import kbData from '@/content/kb.json';
import { postJSON } from '@/lib/client';
import { track } from '@/lib/track';

type Msg = { from: 'bot' | 'me'; text: string; link?: [string, string] };
type Flow = '' | 'timing' | 'pay';

const KB = kbData.kb as { id: string; q: string; a: string; link?: [string, string] }[];
const TOPICS = kbData.topics as Record<string, { hi: string; chips: string[] }>;
const EVAL = kbData.evalHref as Record<string, string>;

const TIMING: [string, string][] = [['now', 'Ahora mismo'], ['3m', 'En los próximos 3 meses'], ['6m', 'En 6 meses o más'], ['info', 'Solo me estoy informando']];

export default function Diana({ topic = 'general' }: { topic?: string }) {
  const T = TOPICS[topic] || TOPICS.general;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: T.hi }]);
  const [peek, setPeek] = useState(true);
  useEffect(() => { const t = setTimeout(() => setPeek(false), 9000); return () => clearTimeout(t); }, []);
  const [draft, setDraft] = useState('');
  const [flow, setFlow] = useState<Flow>('');
  const [timing, setTiming] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, open]);

  const push = (...m: Msg[]) => setMsgs((prev) => [...prev, ...m]);

  const startLawyer = (text = 'Quiero hablar con un abogado') => {
    track('chat_lawyer_request', { topic });
    setFlow('timing');
    push({ from: 'me', text }, { from: 'bot', text: 'Con gusto. Dos preguntas rápidas para darte la consulta adecuada. ¿Cuándo quieres empezar tu trámite?' });
  };

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setDraft('');
    if (/abogad|asesor|humano|hablar con|contratar/i.test(q)) { startLawyer(q); return; }
    push({ from: 'me', text: q });
    setBusy(true);
    const history = msgs.slice(-6).map((m) => ({ role: m.from === 'me' ? 'user' as const : 'assistant' as const, content: m.text }));
    const { data } = await postJSON<{ text: string; link?: [string, string]; intent?: string }>('/api/chat', { message: q, topic, history });
    setBusy(false);
    push({ from: 'bot', text: data.text || 'No pude responder ahora. Intenta de nuevo.', link: data.link });
    if (data.intent === 'lawyer') startLawyer('Quiero hablar con un abogado');
  };

  let options: { label: string; strong?: boolean; onClick: () => void }[] = [];
  if (flow === 'timing') {
    options = TIMING.map(([k, l]) => ({ label: l, onClick: () => { setTiming(k); setFlow('pay'); push({ from: 'me', text: l }, { from: 'bot', text: 'Las consultas con abogado son de pago: USD 35 por escrito o USD 60 por videollamada, y se descuentan si contratas. ¿Quieres agendar?' }); } }));
  } else if (flow === 'pay') {
    const soon = timing === 'now' || timing === '3m';
    options = [
      { label: 'Sí, quiero agendar', strong: true, onClick: () => { setFlow(''); push({ from: 'me', text: 'Sí, quiero agendar' }, soon ? { from: 'bot', text: 'Perfecto. Te reservo con el abogado especialista. Elige el tipo de consulta, la hora y el medio de pago.', link: ['Agendar consulta', '/agendar'] } : { from: 'bot', text: 'Como tu plan es a más largo plazo, te recomiendo la consulta exprés por escrito (USD 35): resuelves tu duda sin pagar más de lo necesario.', link: ['Consulta exprés', '/agendar?tipo=expres'] }); } },
      { label: 'Prefiero informarme primero', onClick: () => { setFlow(''); push({ from: 'me', text: 'Prefiero informarme primero' }, { from: 'bot', text: 'Entendido. Haz la pre-evaluación gratuita y revisa el centro de respuestas. Sigo aquí 24 h.', link: ['Pre-evaluación gratis', EVAL[topic] || '/nacionalidad-espanola#evaluador'] }); } },
    ];
  } else {
    options = T.chips.map((id) => KB.find((e) => e.id === id)).filter(Boolean).map((e) => ({ label: e!.q, onClick: () => push({ from: 'me', text: e!.q }, { from: 'bot', text: e!.a, link: e!.link }) }));
    options.push({ label: 'Quiero hablar con un abogado', strong: true, onClick: () => startLawyer() });
  }

  const chip: React.CSSProperties = { textAlign: 'left', minHeight: 42, padding: '9px 14px', borderRadius: 12, border: '1px solid rgba(11,122,89,0.45)', background: '#fff', color: '#0B7A59', font: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer' };
  const strong: React.CSSProperties = { ...chip, border: 0, background: '#0B7A59', color: '#fff', fontWeight: 600 };

  return (
    <div style={{ fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.45 }}>
      {open && (
        <div role="dialog" aria-label="Chat con Diana" className="diana-chat" style={{ position: 'fixed', right: 24, bottom: 108, width: 'min(390px, calc(100vw - 32px))', height: 'min(600px, calc(100vh - 140px))', background: '#F4EFE6', borderRadius: 18, boxShadow: '0 30px 80px rgba(7,20,35,0.38)', overflow: 'hidden', zIndex: 60, border: '1px solid rgba(11,31,51,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#0B1F33', color: '#F4EFE6', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar />
            <div style={{ flex: 1 }}><p style={{ margin: 0, fontWeight: 600 }}>Diana</p><p style={{ margin: 0, fontSize: 12.5, color: '#A9B2BE' }}>Asistente virtual con IA · responde al instante</p></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar chat" style={{ background: 'none', border: 0, color: '#F4EFE6', cursor: 'pointer', width: 44, height: 44, fontSize: 24 }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }} aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
                <div style={m.from === 'me' ? { maxWidth: '85%', background: '#0B1F33', color: '#F4EFE6', padding: '10px 14px', borderRadius: '16px 16px 4px 16px' } : { maxWidth: '88%', background: '#fff', border: '1px solid rgba(11,31,51,0.08)', padding: '10px 14px', borderRadius: '16px 16px 16px 4px' }}>{m.text}</div>
                {m.link && <Link href={m.link[1]} onClick={() => setOpen(false)} style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', minHeight: 40, padding: '0 14px', borderRadius: 999, background: '#0B1F33', color: '#F4EFE6', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>{m.link[0]} →</Link>}
              </div>
            ))}
            {busy && <div style={{ color: '#5E584E', fontSize: 14 }}>Diana está escribiendo…</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {options.map((o) => <button key={o.label} type="button" onClick={o.onClick} style={o.strong ? strong : chip}>{o.label}</button>)}
            </div>
            <div ref={endRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(draft); }} style={{ borderTop: '1px solid rgba(11,31,51,0.1)', padding: 12, display: 'flex', gap: 8, background: '#fff' }}>
            <label style={{ flex: 1, display: 'flex' }}><span className="sr-only">Escribe tu pregunta</span>
              <input value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={600} placeholder="Escribe tu pregunta…" style={{ flex: 1, minHeight: 46, borderRadius: 999, border: '1.5px solid rgba(11,31,51,0.15)', padding: '0 16px', font: 'inherit', background: '#F4EFE6', color: '#0B1F33' }} />
            </label>
            <button type="submit" aria-label="Enviar" disabled={busy} style={{ width: 46, height: 46, borderRadius: '50%', border: 0, background: '#0B7A59', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
          <p style={{ margin: 0, padding: '8px 16px 10px', fontSize: 11.5, color: '#5E584E', background: '#fff' }}>Orientación general, no constituye asesoría jurídica.</p>
        </div>
      )}
      {!open && peek && <div className="diana-peek" role="button" tabIndex={0} onClick={() => setPeek(false)} onKeyDown={(e) => { if (e.key === 'Escape' || e.key === 'Enter') setPeek(false); }} style={{ cursor: 'pointer', position: 'fixed', right: 24, bottom: 102, zIndex: 59, background: '#fff', padding: '12px 16px', borderRadius: '14px 14px 4px 14px', boxShadow: '0 14px 40px rgba(7,20,35,0.2)', fontSize: 14, maxWidth: 260 }}>{T.hi.replace('Hola, soy Diana. ', '')}</div>}
      <button type="button" onClick={() => { if (!open) track('chat_open', { topic }); setOpen(!open); }} aria-label={open ? 'Cerrar chat' : 'Abrir chat con Diana'} className="diana-btn" style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 61, height: 64, padding: '0 22px 0 10px', borderRadius: 999, border: 0, background: '#0B1F33', color: '#F4EFE6', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', font: 'inherit', fontWeight: 600, boxShadow: '0 14px 40px rgba(7,20,35,0.35)' }}>
        <Avatar size={44} /><span className="diana-label">{open ? 'Cerrar' : 'Pregúntale a Diana'}</span>
      </button>
    </div>
  );
}

function Avatar({ size = 42 }: { size?: number }) {
  return (
    <span style={{ position: 'relative', width: size, height: size, borderRadius: '50%', background: '#E8D3AE', color: '#0B1F33', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 21, flex: 'none' }}>
      D<span style={{ position: 'absolute', right: 0, bottom: 0, width: 11, height: 11, borderRadius: '50%', background: '#3DD1A0', border: '2px solid #0B1F33' }} />
    </span>
  );
}
