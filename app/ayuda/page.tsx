import type { Metadata } from 'next';
import { pageMeta, faqLd } from '@/lib/seo';
import { JsonLd } from '@/components/Seo';
import { KB } from '@/lib/kb';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import HelpCenter from '@/components/HelpCenter';
import { GuideForm, ContactSection } from '@/components/Forms';
import { GUIDES } from '@/lib/guides';

export const metadata: Metadata = pageMeta('/ayuda');

export default async function Ayuda({ searchParams }: { searchParams: Promise<{ guia?: string }> }) {
  const expired = (await searchParams).guia === 'expirada';
  return (
    <>
      <JsonLd data={faqLd(KB.map((e) => ({ q: e.q, a: e.a })))} />
      <PageHero path="/ayuda" crumb="Centro de respuestas" a="¿En qué te" b="ayudamos?" lede="Respuestas revisadas por nuestros abogados. Si no encuentras la tuya, Diana te responde al instante y, si hace falta, un abogado por escrito en 48 h." />
      <section style={{ padding: '0 0 112px' }}><div className="wrap"><HelpCenter /></div></section>
      <section id="guias" className="dark section">
        <div className="wrap">
          {expired && <p role="alert" className="card" style={{ padding: '14px 18px', marginBottom: 28, color: 'var(--ink)' }}>Ese enlace de descarga caducó o no es válido. Pide la guía otra vez y te enviamos uno nuevo.</p>}
          <h2 className="h2" style={{ marginBottom: 48 }}>Guías gratuitas <em style={{ color: 'var(--green-lt)' }}>en PDF</em></h2>
          <div className="g-3">
            {Object.entries(GUIDES).map(([k, g]) => (
              <div key={k} style={{ background: 'var(--ink-2)', borderRadius: 8, padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}><span className="mono" style={{ fontSize: 11.5, letterSpacing: '0.14em', color: 'var(--green-lt)' }}>{g.service.toUpperCase()}</span><p className="serif" style={{ margin: 0, fontSize: 24 }}>{g.title}</p><p style={{ margin: 0, fontSize: 14.5, color: 'var(--on-dark-2)' }}>{g.desc}</p></div>
            ))}
          </div>
          <div style={{ marginTop: 28, maxWidth: 720 }}><GuideForm choose cta="Enviarme la guía" /></div>
        </div>
      </section>
      <ContactSection kicker="¿NO ENCONTRASTE TU RESPUESTA?" title={<>Escríbenos. <em>Te respondemos en minutos.</em></>} lede="Diana te contesta al instante por WhatsApp. Si tu pregunta necesita un abogado, te proponemos la consulta adecuada con su precio." page="/ayuda" />
      <Footer />
      <Diana topic="general" />
    </>
  );
}
