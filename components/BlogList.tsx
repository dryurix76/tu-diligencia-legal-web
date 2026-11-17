'use client';

import { useState } from 'react';
import Link from 'next/link';
import { POSTS, CATEGORIES } from '@/lib/posts';

export default function BlogList() {
  const [cat, setCat] = useState('all');
  const list = cat === 'all' ? POSTS.slice(1) : POSTS.filter((p) => p.cat === cat);
  return (
    <>
      <div style={{ borderTop: '1px solid #0B1F33', borderBottom: '1px solid #0B1F33', padding: '12px 0', display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 48 }}>
        {CATEGORIES.map(([k, l]) => <button key={k} type="button" className="chip" aria-pressed={cat === k} onClick={() => setCat(k)}>{l}</button>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px 32px' }}>
        {list.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card-lift" style={{ textDecoration: 'none', color: '#0B1F33' }}>
            <div style={{ height: 280, borderRadius: 4, background: p.bg, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 24 }}>
              <span className="mono" style={{ position: 'absolute', top: 22, left: 24, fontSize: 11, letterSpacing: '0.2em', color: p.fg, opacity: 0.85 }}>{p.kicker}</span>
              <span className="serif" style={{ fontSize: 72, fontStyle: 'italic', lineHeight: 0.88, letterSpacing: '-0.035em', color: p.fg }}>{p.word}</span>
            </div>
            <p className="mono accent" style={{ margin: '20px 0 8px', fontSize: 12, letterSpacing: '0.1em' }}>{p.catLabel} · {p.mins} MIN</p>
            <p className="serif" style={{ margin: '0 0 8px', fontSize: 26, lineHeight: 1.15 }}>{p.title}</p>
            <p style={{ margin: 0, color: '#5E584E', fontSize: 15 }}>{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
