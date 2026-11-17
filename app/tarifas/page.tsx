import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import Calculator from '@/components/Calculator';
import { ContactSection } from '@/components/Forms';

export const metadata: Metadata = pageMeta('/tarifas');

const TABLES: [string, [string, string, string][]][] = [
  ['Consultas · todas de pago', [['Pre-evaluación con Diana', 'Cuestionario automático, 2 minutos. Orientativa.', 'Gratis'], ['Consulta exprés por escrito', 'Una pregunta, respuesta del abogado en 48 h', 'USD 35'], ['Consulta inicial', '30 min por videollamada · descontable', 'USD 60'], ['Consulta de estrategia', '60 min + informe de viabilidad · descontable', 'USD 120'], ['Revisión documental', 'Hasta 10 documentos + informe · descontable', 'USD 150'], ['Consulta urgente', 'El mismo día o el siguiente', 'USD 100']]],
  ['Nacionalidades', [['Española · ascendencia u opción', 'Expediente completo y presentación', 'USD 1.200'], ['Española · residencia', 'Expediente, CCSE y seguimiento', 'USD 900'], ['Española · recurso ante denegación', 'Reposición o contencioso', 'USD 800'], ['Italiana · consular', 'Análisis, actas, expediente y cita', 'USD 1.800'], ['Italiana · judicial', 'Abogado en Italia hasta sentencia', 'USD 4.500'], ['Portuguesa', 'Registros, transcripciones y solicitud', 'USD 1.500'], ['Alemana', 'Archivos y declaración', 'USD 2.200'], ['Croata', 'Búsqueda y solicitud', 'USD 1.800'], ['Británica', 'Elegibilidad y solicitud', 'USD 1.600']]],
  ['Visados y residencias', [['Nómada digital (ES/PT)', 'Ingresos, expediente y presentación', 'USD 1.100'], ['No lucrativa o D7', 'Expediente y presentación', 'USD 1.000'], ['Estudios', 'Expediente y cita', 'USD 600'], ['Arraigo o reagrupación', 'Expediente y seguimiento', 'USD 800'], ['Renovación', 'Revisión y presentación', 'USD 450']]],
  ['Negocios y Caribe', [['Emprendedor o inversor', 'Plan, expediente y apoyo societario Certia Group', 'USD 2.500'], ['Traslado intraempresa', 'Expediente y presentación', 'USD 1.500'], ['Schengen de negocios', 'Expediente y carta de invitación', 'USD 350'], ['Visado Caribe', 'Verificación, expediente y solicitud', 'USD 250']]],
  ['Servicios sueltos', [['Búsqueda de acta en Europa', 'Localización y envío', 'USD 180 por acta'], ['Apostilla o legalización', 'Gestión', 'USD 60 por documento'], ['Traducción jurada', 'Certificada', 'USD 35 por página']]],
];

export default function Tarifas() {
  return (
    <>
      <PageHero path="/tarifas" crumb="Tarifas" a="Tarifas." b="Todas, a la vista." lede="Toda consulta con abogado se cobra por adelantado y se descuenta si contratas en 30 días. Los servicios tienen precio cerrado y se pagan en 2 o 3 cuotas." />
      <section className="sand section">
        <div className="wrap g-eval">
          <div>
            <p className="kicker">Calculadora</p>
            <h2 className="h2">¿Cuánto me <em>costaría</em>?</h2>
            <p className="lede">Elige el servicio, cuántos familiares y en cuántas cuotas. Es una estimación: el precio final va por escrito en tu propuesta.</p>
          </div>
          <Calculator />
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <h2 className="h2" style={{ marginBottom: 56 }}>Lista completa de precios</h2>
          {TABLES.map(([title, rows]) => (
            <div key={title} style={{ marginBottom: 56 }}>
              <h3 className="mono accent" style={{ margin: '0 0 8px', fontSize: 13, letterSpacing: '0.14em', fontWeight: 500 }}>{title.toUpperCase()}</h3>
              <div style={{ overflowX: 'auto', borderTop: '2px solid #0B1F33' }}>
                <table className="prices"><tbody>{rows.map(([a, b, c]) => (
                  <tr key={a}><td className="serif" style={{ padding: '20px 24px 20px 0', fontSize: 21 }}>{a}</td><td style={{ padding: '20px 24px 20px 0', color: '#5E584E', fontSize: 15 }}>{b}</td><td className="serif" style={{ padding: '20px 0', fontSize: 24, textAlign: 'right', whiteSpace: 'nowrap' }}>{c}</td></tr>
                ))}</tbody></table>
              </div>
            </div>
          ))}
          <div className="g-3">
            {[['Pago antes de la cita', 'Sin pago no hay hueco en el calendario. Reprogramas gratis hasta 24 h antes.'], ['15% desde el segundo familiar', 'Cuando varios miembros de la familia comparten expediente.'], ['Pagas como te sea fácil', 'Tarjeta internacional, Zelle, Binance Pay (USDT) o transferencia en euros.']].map(([t, d]) => (
              <div key={t} className="card" style={{ padding: 28 }}><p className="serif" style={{ margin: '0 0 8px', fontSize: 22 }}>{t}</p><p style={{ margin: 0, color: '#5E584E', fontSize: 15 }}>{d}</p></div>
            ))}
          </div>
        </div>
      </section>
      <ContactSection kicker="¿TIENES UN CASO CONCRETO?" title={<>Te enviamos un <em>presupuesto por escrito</em>.</>} lede="Cuéntanos tu caso y te enviamos la estimación y la consulta recomendada. Las dudas generales las resuelve Diana al instante." page="/tarifas" />
      <Footer />
      <Diana topic="general" />
    </>
  );
}
