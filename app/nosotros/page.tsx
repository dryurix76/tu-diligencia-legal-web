import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import { Certia } from '@/components/Brand';
import { ContactSection } from '@/components/Forms';

export const metadata: Metadata = pageMeta('/nosotros');

// Replace with the real team (name, role, bar number, photo in /public/equipo/).
const TEAM = [['var(--ink)', 'E', '[Nombre y apellido]', 'Abogada · Nacionalidad española · colegiada [n.º]'], ['var(--green-dk)', 'I', '[Nombre y apellido]', 'Abogado · Nacionalidad italiana'], ['var(--ink)', 'P', '[Nombre y apellido]', 'Abogada · Portugal y visados'], ['var(--ink)', 'C', '[Nombre y apellido]', 'Director · Certia Group']];

export default function Nosotros() {
  return (
    <>
      <PageHero path="/nosotros" crumb="Nosotros" a="Somos los que" b="encuentran el acta." lede="Tu Diligencia Legal es la consultora de derecho migratorio de Certia Group. Ayudamos a venezolanos a volver a Europa con un pasaporte, una residencia o un proyecto." />
      <section className="section">
        <div className="wrap g-2" style={{ alignItems: 'start' }}>
          <p className="serif" style={{ margin: 0, fontSize: 'clamp(40px, 5vw, 60px)', lineHeight: 1, fontWeight: 320, letterSpacing: '-0.035em' }}>“No vendemos esperanza. Vendemos un <em className="accent">expediente</em> bien hecho.”</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: 'var(--ink-80)' }}>
            <p style={{ margin: 0 }}>[Historia de la firma: cuándo nació, por qué y cuántas familias ha acompañado.]</p>
            <p style={{ margin: 0 }}>Desde que formamos parte de Certia Group sumamos estructura corporativa, cumplimiento y apoyo societario, para acompañar también a quien emigra con un negocio.</p>
            <Certia dark={false} h={26} />
          </div>
        </div>
      </section>
      <section className="dark section">
        <div className="wrap">
          <h2 className="h2" style={{ marginBottom: 56 }}>Cómo <em style={{ color: 'var(--green-lt)' }}>trabajamos</em></h2>
          <div className="g-4">
            {[['Diagnóstico primero', 'Nunca empezamos un expediente sin confirmar la vía correcta.'], ['Precio cerrado', 'Por escrito, con lo que incluye y lo que no.'], ['Un abogado responsable', 'Con nombre y número de colegiado, de principio a fin.'], ['Todo a la vista', 'Tu expediente, tus pagos y tus mensajes en Mi caso.']].map(([t, d], i) => (
              <div key={t}><span className="mono" style={{ fontSize: 13, color: 'var(--green-lt)' }}>0{i + 1}</span><p className="serif" style={{ margin: '12px 0 8px', fontSize: 26 }}>{t}</p><p style={{ margin: 0, color: 'var(--on-dark-2)', fontSize: 15 }}>{d}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <h2 className="h2" style={{ marginBottom: 48 }}>El equipo</h2>
          <div className="g-4">
            {TEAM.map(([bg, ini, n, r]) => (
              <div key={r}><div style={{ aspectRatio: '4 / 5', borderRadius: 6, background: bg, position: 'relative', overflow: 'hidden' }}><span className="serif" style={{ fontSize: 120, fontStyle: 'italic', color: 'color-mix(in srgb, var(--paper) 16%, transparent)', position: 'absolute', right: 12, top: -10 }}>{ini}</span></div><p className="serif" style={{ margin: '16px 0 2px', fontSize: 22 }}>{n}</p><p style={{ margin: 0, fontSize: 14.5, color: 'var(--muted)' }}>{r}</p></div>
            ))}
          </div>
        </div>
      </section>
      <ContactSection kicker="TRABAJA CON NOSOTROS" title={<>Empecemos <em>por tu caso</em>.</>} lede="Cuéntanos tu historia familiar o tu proyecto. Diana te responde al instante y un asesor te propone el siguiente paso." page="/nosotros" />
      <Footer />
      <Diana topic="general" />
    </>
  );
}
