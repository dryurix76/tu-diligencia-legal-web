'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface FaqItem { q: string; a: string; cat?: string; link?: [string, string] }

export default function Faq({ items, size = 22 }: { items: FaqItem[]; size?: number }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ borderTop: '1px solid color-mix(in srgb, var(--ink) 20%, transparent)' }}>
      {items.map((f, i) => (
        <div key={f.q} style={{ borderBottom: '1px solid color-mix(in srgb, var(--ink) 20%, transparent)' }}>
          <button type="button" className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {f.cat && <span className="mono accent" style={{ fontSize: 11, letterSpacing: '0.12em' }}>{f.cat.toUpperCase()}</span>}
              <span className="serif" style={{ fontSize: size }}>{f.q}</span>
            </span>
            <span aria-hidden="true" className={`faq-icon ${open === i ? 'open' : ''}`}>+</span>
          </button>
          {open === i && (
            <div style={{ margin: '-6px 0 26px', maxWidth: 680 }}>
              <p style={{ margin: 0, color: 'var(--ink-80)' }}>{f.a}</p>
              {f.link && <p style={{ margin: '12px 0 0' }}><Link href={f.link[1]} style={{ fontWeight: 600 }}>{f.link[0]} →</Link></p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
