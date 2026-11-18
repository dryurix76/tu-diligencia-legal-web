'use client';

import { useState } from 'react';
import Link from 'next/link';
import { POSTS, CATEGORIES } from '@/lib/posts';
import PostCover from './PostCover';

export default function BlogList({ images = {} }: { images?: Record<string, string> }) {
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
            <PostCover p={p} img={images[p.slug]} height={280} kicker />
            <p className="mono accent" style={{ margin: '20px 0 8px', fontSize: 12, letterSpacing: '0.1em' }}>{p.catLabel} · {p.mins} MIN</p>
            <p className="serif" style={{ margin: '0 0 8px', fontSize: 26, lineHeight: 1.15 }}>{p.title}</p>
            <p style={{ margin: 0, color: '#5E584E', fontSize: 15 }}>{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
