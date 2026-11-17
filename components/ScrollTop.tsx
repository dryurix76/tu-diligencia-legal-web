'use client';

import { useEffect, useState } from 'react';

// Floating "back to top" arrow, bottom-left (Diana's chat sits bottom-right).
export default function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <button
      type="button"
      aria-label="Volver arriba"
      className="scroll-top"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
      style={{
        position: 'fixed', left: 24, bottom: 24, zIndex: 55, width: 52, height: 52, borderRadius: '50%', border: '1.5px solid rgba(244,239,230,0.35)',
        background: '#0B1F33', color: '#F4EFE6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        boxShadow: '0 12px 32px rgba(7,20,35,0.32)', opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(12px)', pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity .25s ease, transform .25s ease',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );
}
