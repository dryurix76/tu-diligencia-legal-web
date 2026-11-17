'use client';

import { useState } from 'react';
import Link from 'next/link';

const DATA = [
  { id: 'es', n: '01', name: 'España', price: '900', href: '/nacionalidad-espanola#evaluador', who: 'Hijos y nietos de españoles de origen, y venezolanos con 2 años de residencia legal en España.', vias: 'Ascendencia, residencia, opción, carta de naturaleza y recursos ante denegación.' },
  { id: 'it', n: '02', name: 'Italia', price: '1.800', href: '/nacionalidad-italiana#evaluador', who: 'Descendientes de italianos, según los requisitos vigentes tras la reforma de 2025.', vias: 'Vía consular, vía judicial en Italia y por matrimonio.' },
  { id: 'pt', n: '03', name: 'Portugal', price: '1.500', href: '/nacionalidad-portuguesa#evaluador', who: 'Hijos y nietos de portugueses, incluidas Madeira y Azores.', vias: 'Atribución por descendencia, búsqueda de registros y transcripciones.' },
  { id: 'de', n: '04', name: 'Alemania', price: '2.200', href: '/nacionalidad-alemana#evaluador', who: 'Descendientes de alemanes, incluidas las vías de restitución.', vias: 'Declaración §5 StAG y restitución §15 / art. 116.' },
  { id: 'hr', n: '05', name: 'Croacia', price: '1.800', href: '/nacionalidad-croata#evaluador', who: 'Descendientes de emigrantes croatas.', vias: 'Solicitud por origen, con búsqueda en registros croatas.' },
  { id: 'uk', n: '06', name: 'Reino Unido', price: '1.600', href: '/nacionalidad-britanica#evaluador', who: 'Hijos y, en algunos casos, nietos de ciudadanos británicos.', vias: 'Pasaporte por descendencia y registro.' },
];

export default function CountrySelector() {
  const [sel, setSel] = useState(DATA[0]);
  return (
    <div className="g-sel">
      <div style={{ borderTop: '1px solid rgba(11,31,51,0.2)' }}>
        {DATA.map((c) => (
          <button key={c.id} type="button" className={`row-country ${sel.id === c.id ? 'on' : ''}`} aria-pressed={sel.id === c.id} onClick={() => setSel(c)}>
            <span className="mono" style={{ fontSize: 13, color: '#5E584E', width: 36, flex: 'none' }}>{c.n}</span>
            <span className="country-name">{c.name}</span>
            <span className="mono hide-m" style={{ marginLeft: 'auto', fontSize: 13, color: '#4E4A43' }}>desde USD {c.price}</span>
          </button>
        ))}
        <Link href="/visados" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '22px 0', textDecoration: 'none', color: '#4E4A43', borderBottom: '1px solid rgba(11,31,51,0.2)', flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 13, width: 36 }}>07</span>
          <span className="serif" style={{ fontSize: 28, fontStyle: 'italic' }}>No tengo ascendencia europea</span>
          <span style={{ marginLeft: 'auto', fontSize: 15 }}>Ver visados y residencias →</span>
        </Link>
      </div>
      <div className="fade" key={sel.id} style={{ background: '#0B1F33', color: '#F4EFE6', borderRadius: 4, padding: 44, position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" className="serif" style={{ position: 'absolute', right: -10, top: -40, fontSize: 220, fontStyle: 'italic', color: 'rgba(232,211,174,0.07)', lineHeight: 1 }}>{sel.n}</div>
        <p className="mono" style={{ margin: 0, fontSize: 12, letterSpacing: '0.16em', color: '#C9B48C' }}>NACIONALIDAD</p>
        <p className="serif" style={{ margin: '8px 0 28px', fontSize: 52, fontWeight: 340, lineHeight: 1 }}>{sel.name}</p>
        <p className="mono" style={{ margin: '0 0 6px', fontSize: 11.5, letterSpacing: '0.12em', color: '#A9B2BE' }}>QUIÉN PUEDE CALIFICAR</p>
        <p style={{ margin: '0 0 24px', color: '#E1E4E8' }}>{sel.who}</p>
        <p className="mono" style={{ margin: '0 0 6px', fontSize: 11.5, letterSpacing: '0.12em', color: '#A9B2BE' }}>VÍAS QUE GESTIONAMOS</p>
        <p style={{ margin: '0 0 32px', color: '#E1E4E8' }}>{sel.vias}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, borderTop: '1px solid rgba(244,239,230,0.16)', paddingTop: 24 }}>
          <span style={{ fontSize: 14, color: '#A9B2BE' }}>Servicio completo desde</span>
          <span className="serif" style={{ fontSize: 40, color: '#E8D3AE' }}>USD {sel.price}</span>
        </div>
        <Link className="btn btn-mint" href={sel.href} style={{ marginTop: 28, width: '100%' }}>Evaluar mi caso de {sel.name}</Link>
        <p style={{ margin: '16px 0 0', fontSize: 13, color: '#A9B2BE' }}>Orientación general. Un abogado confirma cada caso en la consulta.</p>
      </div>
    </div>
  );
}
