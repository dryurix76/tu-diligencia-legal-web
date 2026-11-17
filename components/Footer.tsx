import Link from 'next/link';
import { Lockup, Certia } from './Brand';

const COLS: [string, [string, string][]][] = [
  ['NACIONALIDADES', [['/nacionalidad-espanola', 'Española'], ['/nacionalidad-italiana', 'Italiana'], ['/nacionalidad-portuguesa', 'Portuguesa'], ['/nacionalidad-alemana', 'Alemana'], ['/nacionalidad-croata', 'Croata'], ['/nacionalidad-britanica', 'Británica']]],
  ['SERVICIOS', [['/visados', 'Visados y residencias'], ['/negocios', 'Visas de negocios'], ['/caribe', 'Caribe'], ['/tarifas', 'Tarifas'], ['/agendar', 'Agendar consulta']]],
  ['AYUDA', [['/ayuda', 'Centro de respuestas'], ['/blog', 'Blog El Archivo'], ['/mi-caso', 'Mi caso'], ['/contacto', 'Contacto'], ['/nosotros', 'Nosotros']]],
];

export default function Footer() {
  return (
    <footer style={{ background: '#071423', color: '#A9B2BE', padding: '80px 0 40px', fontSize: 15 }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
          <div>
            <Lockup dark size={44} fs={23} />
            <div style={{ margin: '18px 0 16px' }}><Certia dark /></div>
            <p style={{ margin: 0 }}>Derecho migratorio para venezolanos que vuelven a Europa.</p>
          </div>
          {COLS.map(([t, items]) => (
            <div key={t}>
              <p className="mono" style={{ margin: '0 0 16px', fontSize: 12, letterSpacing: '0.12em', color: '#F4EFE6' }}>{t}</p>
              <p style={{ margin: 0, lineHeight: 2.1 }}>
                {items.map(([h, l], i) => <span key={h}>{i > 0 && <br />}<Link href={h} style={{ color: '#A9B2BE', textDecoration: 'none' }}>{l}</Link></span>)}
              </p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid rgba(244,239,230,0.12)', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
          <span>© {new Date().getFullYear()} Tu Diligencia Legal · Certia Group · WhatsApp {process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || '+58 [NÚMERO]'}</span>
          <span><Link href="/legal/privacidad" style={{ color: '#A9B2BE' }}>Privacidad</Link> · <Link href="/legal/terminos" style={{ color: '#A9B2BE' }}>Términos y reembolsos</Link> · Información orientativa, no constituye asesoría jurídica.</span>
        </div>
      </div>
    </footer>
  );
}
