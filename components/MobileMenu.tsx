'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GROUPS: [string, [string, string][]][] = [
  ['Nacionalidades', [['/nacionalidad-espanola', 'Española'], ['/nacionalidad-italiana', 'Italiana'], ['/nacionalidad-portuguesa', 'Portuguesa'], ['/nacionalidad-alemana', 'Alemana'], ['/nacionalidad-croata', 'Croata'], ['/nacionalidad-britanica', 'Británica']]],
  ['Visados y más', [['/visados', 'Visados y residencias'], ['/visa-americana', 'Visa americana'], ['/becas', 'Becas 2026'], ['/negocios', 'Negocios'], ['/caribe', 'Caribe']]],
  ['Ayuda', [['/tarifas', 'Tarifas'], ['/blog', 'Blog'], ['/ayuda', 'Centro de respuestas'], ['/contacto', 'Contacto'], ['/nosotros', 'Nosotros']]],
];

export default function MobileMenu({ dark = true }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open]);
  const color = dark ? 'var(--paper)' : 'var(--ink)';

  return (
    <>
      <button type="button" className="show-m" aria-label="Abrir menú" aria-expanded={open} aria-controls="menu-movil" onClick={() => setOpen(true)} style={{ width: 48, height: 48, borderRadius: 999, border: `1.5px solid ${dark ? 'color-mix(in srgb, var(--paper) 35%, transparent)' : 'color-mix(in srgb, var(--ink) 25%, transparent)'}`, background: 'transparent', color, alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
      {open && (
        <div id="menu-movil" role="dialog" aria-modal="true" aria-label="Menú" style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'var(--ink)', color: 'var(--paper)', overflowY: 'auto', padding: '18px 20px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Link href="/" className="serif" style={{ color: 'var(--paper)', fontSize: 23, textDecoration: 'none' }}>Tu Diligencia <em style={{ color: 'var(--green-lt)' }}>Legal</em></Link>
            <button type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)} style={{ width: 48, height: 48, borderRadius: 999, border: '1.5px solid color-mix(in srgb, var(--paper) 35%, transparent)', background: 'transparent', color: 'var(--paper)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div style={{ display: 'grid', gap: 10, marginBottom: 28 }}>
            <Link className="btn btn-mint btn-lg" href="/nacionalidad-espanola#evaluador">Evaluar mi caso gratis</Link>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Link className="btn btn-ghost-dark" href="/agendar">Agendar consulta</Link>
              <Link className="btn btn-ghost-dark" href="/mi-caso">Mi caso</Link>
            </div>
          </div>
          {GROUPS.map(([g, links]) => (
            <nav key={g} aria-label={g} style={{ marginBottom: 26 }}>
              <p className="mono" style={{ margin: '0 0 8px', fontSize: 11.5, letterSpacing: '0.14em', color: 'var(--green-lt)' }}>{g.toUpperCase()}</p>
              {links.map(([h, t]) => (
                <Link key={h} href={h} aria-current={path === h ? 'page' : undefined} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 48, borderBottom: '1px solid color-mix(in srgb, var(--paper) 12%, transparent)', color: 'var(--paper)', textDecoration: 'none', fontSize: 19 }} className="serif">
                  {t}<span aria-hidden="true" style={{ color: 'var(--green-lt)' }}>→</span>
                </Link>
              ))}
            </nav>
          ))}
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--on-dark-2)' }}>Tu Diligencia Legal · parte de Certia Group</p>
        </div>
      )}
    </>
  );
}
