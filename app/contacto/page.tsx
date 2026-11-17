import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import { ContactSection } from '@/components/Forms';

export const metadata: Metadata = pageMeta('/contacto');

const ROUTES = [
  ['/nacionalidad-espanola#evaluador', '01', 'Quiero saber si califico', 'Pre-evaluación gratuita de 2 minutos con semáforo.', 'Empezar', false],
  ['/agendar', '02', 'Quiero hablar con un abogado', 'Consultas desde USD 35, descontables del servicio.', 'Agendar', true],
  ['/mi-caso', '03', 'Ya soy cliente', 'Estado, documentos, pagos y mensajes en Mi caso.', 'Entrar', false],
  ['#contacto', '04', 'Otra consulta', 'Prensa, alianzas o casos que no encajan arriba.', 'Escribir', false],
] as const;

export default function Contacto() {
  return (
    <>
      <PageHero path="/contacto" crumb="Contacto" a="Hablemos de" b="tu caso." lede="Elige qué necesitas y te llevamos al camino más rápido. Las dudas generales las resuelve Diana al instante; los casos concretos, un abogado." />
      <section style={{ padding: '96px 0' }}>
        <div className="wrap">
          <div className="g-4">
            {ROUTES.map(([h, n, t, d, cta, dark]) => (
              <Link key={n} href={h} className="card-lift" style={{ background: dark ? '#0B1F33' : '#fff', color: dark ? '#F4EFE6' : '#0B1F33', borderRadius: 8, padding: 28, textDecoration: 'none', border: dark ? 0 : '1px solid rgba(11,31,51,0.08)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 230 }}>
                <span className="mono" style={{ fontSize: 13, color: dark ? '#3DD1A0' : '#0B7A59' }}>{n}</span>
                <p className="serif" style={{ margin: 0, fontSize: 26, lineHeight: 1.1 }}>{t}</p>
                <p style={{ margin: 0, fontSize: 15, color: dark ? '#C9CFD6' : '#5E584E' }}>{d}</p>
                <span style={{ marginTop: 'auto', fontWeight: 600, color: dark ? '#3DD1A0' : '#0B7A59' }}>{cta} →</span>
              </Link>
            ))}
          </div>
          <div className="g-3" style={{ marginTop: 64 }}>
            <div><p className="mono" style={{ margin: '0 0 10px', fontSize: 12, letterSpacing: '0.14em', color: '#5E584E' }}>WHATSAPP</p><p className="serif" style={{ margin: 0, fontSize: 26 }}>{process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || '+58 [NÚMERO]'}</p><p style={{ margin: '4px 0 0', color: '#5E584E', fontSize: 15 }}>Diana responde 24 h · asesores de lunes a viernes, 8:00 a 18:00 (Caracas)</p></div>
            <div><p className="mono" style={{ margin: '0 0 10px', fontSize: 12, letterSpacing: '0.14em', color: '#5E584E' }}>CORREO</p><p className="serif" style={{ margin: 0, fontSize: 26 }}>{process.env.NEXT_PUBLIC_CONTACT_EMAIL || '[correo]@tudiligencialegal.com'}</p><p style={{ margin: '4px 0 0', color: '#5E584E', fontSize: 15 }}>Respuesta en un día hábil</p></div>
            <div><p className="mono" style={{ margin: '0 0 10px', fontSize: 12, letterSpacing: '0.14em', color: '#5E584E' }}>OFICINAS</p><p className="serif" style={{ margin: 0, fontSize: 26 }}>Caracas · Madrid</p><p style={{ margin: '4px 0 0', color: '#5E584E', fontSize: 15 }}>Atención presencial solo con cita</p></div>
          </div>
        </div>
      </section>
      <ContactSection kicker="FORMULARIO" title={<>Cuéntanos <em>qué necesitas</em>.</>} lede="Respuesta automática al instante con tu número de caso. Un asesor revisa tu mensaje y, si necesitas un abogado, te propone la consulta adecuada." withReason page="/contacto" />
      <Footer />
      <Diana topic="general" />
    </>
  );
}
