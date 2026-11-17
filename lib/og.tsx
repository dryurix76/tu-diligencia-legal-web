import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

// Shared social card: brand seal, kicker and headline on the page's colour.
export function ogCard({ kicker, title, bg = '#0B1F33' }: { kicker: string; title: string; bg?: string }) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: bg, color: '#F4EFE6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, border: '3px solid #F4EFE6', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: 36, fontStyle: 'italic' }}>
            d<div style={{ position: 'absolute', right: 12, bottom: 14, width: 10, height: 10, borderRadius: 5, background: '#E0574C' }} />
          </div>
          <div style={{ fontSize: 30, display: 'flex' }}>Tu Diligencia&nbsp;<span style={{ color: '#E8D3AE', fontStyle: 'italic' }}>Legal</span></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 24, letterSpacing: 4, color: '#E8D3AE', textTransform: 'uppercase' }}>{kicker}</div>
          <div style={{ fontSize: 68, lineHeight: 1.04, letterSpacing: -2, maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#C9CFD6' }}>
          <span>Pre-evaluación gratuita en 2 minutos</span><span>Parte de Certia Group</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
