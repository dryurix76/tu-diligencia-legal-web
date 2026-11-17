import type { Metadata } from 'next';
import { pageMeta, faqLd } from '@/lib/seo';
import { JsonLd } from '@/components/Seo';
import { KB } from '@/lib/kb';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import HelpCenter from '@/components/HelpCenter';
import { GuideForm, ContactSection } from '@/components/Forms';

export const metadata: Metadata = pageMeta('/ayuda');

export default function Ayuda() {
  return (
    <>
      <JsonLd data={faqLd(KB.map((e) => ({ q: e.q, a: e.a })))} />
      <PageHero path="/ayuda" crumb="Centro de respuestas" a="¿En qué te" b="ayudamos?" lede="Respuestas revisadas por nuestros abogados. Si no encuentras la tuya, Diana te responde al instante y, si hace falta, un abogado por escrito en 48 h." />
      <section style={{ padding: '0 0 112px' }}><div className="wrap"><HelpCenter /></div></section>
      <section className="dark section">
        <div className="wrap">
          <h2 className="h2" style={{ marginBottom: 48 }}>Guías gratuitas <em style={{ color: '#E8D3AE' }}>en PDF</em></h2>
          <div className="g-3">
            {[['NACIONALIDAD ESPAÑOLA', 'Todas las vías y sus documentos', 'Checklist por vía y errores que causan denegaciones.'], ['ITALIA 2025', 'Qué cambió con la reforma', 'Quién sigue calificando y cómo saberlo.'], ['APOSTILLAS', 'Documentos venezolanos paso a paso', 'Qué apostillar, en qué orden y cómo.']].map(([k, t, d]) => (
              <div key={k} style={{ background: '#15293F', borderRadius: 8, padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}><span className="mono" style={{ fontSize: 11.5, letterSpacing: '0.14em', color: '#C9B48C' }}>{k}</span><p className="serif" style={{ margin: 0, fontSize: 24 }}>{t}</p><p style={{ margin: 0, fontSize: 14.5, color: '#A9B2BE' }}>{d}</p></div>
            ))}
          </div>
          <div style={{ marginTop: 28, maxWidth: 720 }}><GuideForm cta="Recibir las 3 guías" /></div>
        </div>
      </section>
      <ContactSection kicker="¿NO ENCONTRASTE TU RESPUESTA?" title={<>Escríbenos. <em>Te respondemos en minutos.</em></>} lede="Diana te contesta al instante por WhatsApp. Si tu pregunta necesita un abogado, te proponemos la consulta adecuada con su precio." page="/ayuda" />
      <Footer />
      <Diana topic="general" />
    </>
  );
}
