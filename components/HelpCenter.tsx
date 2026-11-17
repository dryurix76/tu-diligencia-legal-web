'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import kbData from '@/content/kb.json';
import Faq from './Faq';

const KB = kbData.kb as { id: string; cat: string; q: string; a: string; kw: string[]; link?: [string, string] }[];
const CATS = ['Todas', ...Array.from(new Set(KB.map((e) => e.cat)))];
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function HelpCenter() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Todas');
  const items = useMemo(() => {
    const t = norm(q.trim());
    return KB.filter((e) => (cat === 'Todas' || e.cat === cat) && (!t || norm(`${e.q} ${e.a} ${e.kw.join(' ')}`).includes(t)));
  }, [q, cat]);

  return (
    <>
      <div style={{ position: 'relative', maxWidth: 760, margin: '-40px 0 48px' }}>
        <label><span className="sr-only">Buscar una pregunta</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca: apostilla, nietos, Zelle, nómada digital…" style={{ width: '100%', minHeight: 68, borderRadius: 999, border: '1.5px solid rgba(11,31,51,0.15)', padding: '0 28px 0 60px', font: 'inherit', fontSize: 19, color: '#0B1F33', background: '#fff', boxShadow: '0 20px 40px rgba(11,31,51,0.1)' }} />
        </label>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5E584E" strokeWidth="2" aria-hidden="true" style={{ position: 'absolute', left: 24, top: 23 }}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>{CATS.map((c) => <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}</div>
      <p className="mono" style={{ margin: '0 0 8px', fontSize: 12, letterSpacing: '0.14em', color: '#5E584E' }} aria-live="polite">{items.length} {items.length === 1 ? 'RESPUESTA' : 'RESPUESTAS'}</p>
      {items.length ? <Faq key={q + cat} items={items} size={23} /> : (
        <div style={{ background: '#0B1F33', color: '#F4EFE6', borderRadius: 10, padding: 36 }}>
          <p className="serif" style={{ margin: '0 0 10px', fontSize: 30 }}>No encontramos esa pregunta.</p>
          <p style={{ margin: '0 0 20px', color: '#C9CFD6' }}>Pregúntale a Diana en la esquina inferior derecha, o envíala a un abogado: te responde por escrito en 48 h.</p>
          <Link className="btn btn-mint" href="/agendar?tipo=expres">Consulta exprés · USD 35</Link>
        </div>
      )}
    </>
  );
}
