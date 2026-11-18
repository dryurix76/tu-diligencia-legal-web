import Link from 'next/link';
import { Lockup, Certia } from './Brand';

const COLS: [string, [string, string][]][] = [
  ['NACIONALIDADES', [['/nacionalidad-espanola', 'Española'], ['/nacionalidad-italiana', 'Italiana'], ['/nacionalidad-portuguesa', 'Portuguesa'], ['/nacionalidad-alemana', 'Alemana'], ['/nacionalidad-croata', 'Croata'], ['/nacionalidad-britanica', 'Británica']]],
  ['SERVICIOS', [['/visados', 'Visados y residencias'], ['/becas', 'Becas 2026'], ['/visa-americana', 'Visa americana'], ['/negocios', 'Visas de negocios'], ['/caribe', 'Caribe'], ['/tarifas', 'Tarifas'], ['/agendar', 'Agendar consulta']]],
  ['AYUDA', [['/ayuda', 'Centro de respuestas'], ['/blog', 'Blog El Archivo'], ['/mi-caso', 'Mi caso'], ['/contacto', 'Contacto'], ['/nosotros', 'Nosotros']]],
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--on-dark-2)', padding: '80px 0 40px', fontSize: 15 }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
          <div>
            <Lockup dark size={44} fs={23} />
            <div style={{ margin: '18px 0 16px' }}><Certia dark /></div>
            <p style={{ margin: 0 }}>Derecho migratorio para venezolanos que vuelven a Europa.</p>
          </div>
          {COLS.map(([t, items]) => (
            <div key={t}>
              <p className="mono" style={{ margin: '0 0 16px', fontSize: 12, letterSpacing: '0.12em', color: 'var(--paper)' }}>{t}</p>
              <p style={{ margin: 0, lineHeight: 2.1 }}>
                {items.map(([h, l], i) => <span key={h}>{i > 0 && <br />}<Link href={h} style={{ color: 'var(--on-dark-2)', textDecoration: 'none' }}>{l}</Link></span>)}
              </p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid color-mix(in srgb, var(--paper) 12%, transparent)', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
          <span>© {new Date().getFullYear()} Tu Diligencia Legal · <a href={process.env.NEXT_PUBLIC_CERTIA_URL || 'https://certia.group'} target="_blank" rel="noopener" style={{ color: 'inherit' }}>Certia Group</a> · WhatsApp {process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || '+58 [NÚMERO]'}</span>
          <span>{[['aviso-legal', 'Aviso legal'], ['privacidad', 'Privacidad'], ['cookies', 'Cookies'], ['terminos', 'Condiciones'], ['reembolsos', 'Reembolsos']].map(([k, l]) => <span key={k}><Link href={`/legal/${k}`} style={{ color: 'var(--on-dark-2)' }}>{l}</Link> · </span>)} Información orientativa, no constituye asesoría jurídica.</span>
        </div>
      </div>
    </footer>
  );
}
