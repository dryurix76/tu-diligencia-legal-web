import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMeta, serviceLd, faqLd } from '@/lib/seo';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import Evaluator from '@/components/Evaluator';
import Faq from '@/components/Faq';
import { ContactSection } from '@/components/Forms';
import { JsonLd } from '@/components/Seo';
import { TREES } from '@/lib/evaluators';
import { US_STATUS, US_FACTS, US_SERVICES, US_UPDATED } from '@/lib/usvisa';

export const metadata: Metadata = pageMeta('/visa-americana');

const COLOR = { cerrado: 'var(--ink)', parcial: 'var(--muted)', abierto: 'var(--green)' } as const;
const LABEL = { cerrado: 'SUSPENDIDA', parcial: 'MUY LIMITADA', abierto: 'ABIERTA' } as const;

const FAQS = [
  { q: '¿Puedo sacar hoy la visa de turista con pasaporte venezolano?', a: 'No. Desde el 9 de junio de 2025 Estados Unidos no emite visas B1/B2, F, M ni J a venezolanos, y la Proclamación 10998 mantuvo la suspensión desde el 1 de enero de 2026. Desconfía de quien te cobre por "conseguirla".' },
  { q: '¿Me sirve vivir en Colombia, Panamá o España?', a: 'No por sí solo: la restricción depende de la nacionalidad del pasaporte con el que solicitas, no del país de residencia. Lo que sí cambia la situación es tener otra nacionalidad.' },
  { q: 'Tengo nacionalidad española o italiana, ¿qué necesito?', a: 'Viajar con tu pasaporte europeo y pedir un ESTA en línea antes del viaje, para estancias de turismo o negocios de hasta 90 días. Si quieres invertir y dirigir un negocio, puedes optar a la visa E-2.' },
  { q: '¿Ya abrió la embajada de Estados Unidos en Caracas?', a: 'Reanudó operaciones el 30 de marzo de 2026, pero a noviembre de 2026 no ofrece servicios de visa. Las visas de no inmigrante se solicitan en consulados fuera de Venezuela.' },
  { q: '¿Qué es la fianza de visa de hasta 20.000 USD?', a: 'Un depósito reembolsable que el cónsul puede exigir a nacionales de los países de la lista, entre ellos Venezuela, si califican para una visa B1/B2. Desde el 3 de agosto de 2026 los importes son 10.000, 15.000 o 20.000 USD.' },
  { q: '¿Me avisan si cambian las reglas?', a: 'Sí. Déjanos tus datos en el formulario de esta página y te escribimos en cuanto el Departamento de Estado publique cambios para venezolanos.' },
];

export default function VisaAmericana() {
  return (
    <>
      <JsonLd data={[serviceLd('/visa-americana', 'Visa americana para venezolanos', 'Diagnóstico de vías abiertas para viajar a Estados Unidos con pasaporte venezolano o con doble nacionalidad: ESTA, E-2, trabajo y visas con otro pasaporte.', US_SERVICES.map((s) => ({ name: s.name, includes: s.desc, price: `USD ${s.usd}` }))), faqLd(FAQS)]} />
      <PageHero path="/visa-americana" crumb="Visa americana" code="USA" file="US-050" facts={[['B1/B2 · pasaporte VE', 'Suspendida', 'Proclamación 10998'], ['Embajada en Caracas', 'Sin visados', 'reabrió el 30/3/2026'], ['Con pasaporte UE', 'ESTA', 'turismo o negocios, 90 días'], ['Diagnóstico', `USD ${US_SERVICES[0].usd}`, 'qué vía tienes abierta']]} a="Visa americana." b="La verdad, sin humo." lede="Con pasaporte venezolano, las visas de turismo y estudio están suspendidas. Pero hay caminos abiertos: la doble nacionalidad, el ESTA con pasaporte europeo, la E-2 y las visas de trabajo. Te decimos cuál es el tuyo.">
        <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
          <a className="btn btn-mint" href="#evaluador">Ver qué vía tengo <span className="arr" aria-hidden="true">→</span></a>
          <a className="btn btn-ghost" href="#situacion" style={{ color: 'var(--paper)', borderColor: 'color-mix(in srgb, var(--paper) 40%, transparent)' }}>Situación actual</a>
        </div>
      </PageHero>

      <section id="situacion" className="section">
        <div className="wrap">
          <p className="kicker">Actualizado el {US_UPDATED}</p>
          <h2 className="h2" style={{ maxWidth: 860 }}>Qué está <em>cerrado</em> y qué sigue <em>abierto</em> para venezolanos.</h2>
          <div className="g-3" style={{ marginTop: 40 }}>
            {US_STATUS.map((s) => (
              <article key={s.k} className="card" style={{ padding: 26, background: 'var(--card)', borderTop: `4px solid ${COLOR[s.state]}` }}>
                <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: COLOR[s.state] }}>{LABEL[s.state]}</span>
                <h3 className="serif" style={{ margin: '8px 0 6px', fontSize: 23, fontWeight: 400 }}>{s.k}</h3>
                <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 15 }}>{s.t}</p>
                <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-80)' }}>{s.d}</p>
              </article>
            ))}
          </div>
          <h3 className="mono accent" style={{ margin: '64px 0 8px', fontSize: 13, letterSpacing: '0.14em', fontWeight: 500 }}>DISPONIBILIDAD CONSULAR Y COSTES</h3>
          <div style={{ overflowX: 'auto', borderTop: '2px solid var(--ink)' }}>
            <table className="prices"><tbody>{US_FACTS.map(([a, b]) => (
              <tr key={a}><td className="serif" style={{ padding: '18px 24px 18px 0', fontSize: 20, verticalAlign: 'top', minWidth: 220 }}>{a}</td><td style={{ padding: '18px 0', color: 'var(--ink-80)', fontSize: 15.5 }}>{b}</td></tr>
            ))}</tbody></table>
          </div>
          <p style={{ marginTop: 18, fontSize: 13.5, color: 'var(--muted)' }}>Fuentes: Departamento de Estado (travel.state.gov), Proclamaciones 10949 y 10998, Federal Register de 3 de agosto de 2026. Las reglas cambian con frecuencia: confirmamos la situación el día de tu consulta.</p>
        </div>
      </section>

      <section id="evaluador" className="sand section">
        <div className="wrap g-eval">
          <div>
            <p className="kicker">Diagnóstico gratuito · 1 minuto</p>
            <h2 className="h2">¿Qué camino a EE. UU. <em>tienes abierto</em>?</h2>
            <p className="lede">Dos o tres preguntas. Te mostramos la vía, su base legal y lo que hay que confirmar.</p>
            <p className="card" style={{ marginTop: 28, padding: '18px 20px', fontSize: 15 }}><strong>Nuestro compromiso:</strong> no cobramos trámites de visa de turismo o estudio con pasaporte venezolano mientras su emisión esté suspendida.</p>
          </div>
          <Evaluator questions={[]} results={[]} service="Visa americana" tree={TREES['visa-americana']} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="kicker">Servicios</p>
          <h2 className="h2">Lo que sí podemos hacer <em>por ti</em>.</h2>
          <div className="g-2" style={{ marginTop: 40, gap: 20 }}>
            {US_SERVICES.map((s) => (
              <article key={s.id} className="card" style={{ padding: 28, background: 'var(--card)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h3 className="serif" style={{ margin: 0, fontSize: 26, fontWeight: 400 }}>{s.name}</h3>
                <p className="serif" style={{ margin: 0, fontSize: 34, color: 'var(--green)' }}>{s.id === 'trabajo' ? 'Desde ' : ''}USD {s.usd}</p>
                <p style={{ margin: 0, color: 'var(--ink-80)', fontSize: 15 }}>{s.desc}</p>
                <Link className="btn btn-ink" href={`/agendar?tipo=${s.id === 'trabajo' ? 'estrategia' : s.id === 'diagnostico' ? 'inicial' : 'expres'}`} style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>Empezar</Link>
              </article>
            ))}
          </div>
          <div className="card" style={{ marginTop: 32, padding: 28, background: 'var(--ink)', color: 'var(--paper)' }}>
            <p className="serif" style={{ margin: '0 0 8px', fontSize: 26 }}>La llave más segura: un pasaporte europeo.</p>
            <p style={{ margin: '0 0 18px', color: 'var(--on-dark)' }}>Si tienes padres o abuelos españoles, italianos o portugueses, la nacionalidad europea te permite viajar a EE. UU. con ESTA y optar a la E-2. Es lo que mejor sabemos hacer.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><Link className="btn btn-mint" href="/nacionalidad-espanola#evaluador">Evaluar nacionalidad española</Link><Link className="btn btn-ghost" href="/nacionalidad-italiana#evaluador" style={{ color: 'var(--paper)', borderColor: 'color-mix(in srgb, var(--paper) 40%, transparent)' }}>Italiana</Link><Link className="btn btn-ghost" href="/nacionalidad-portuguesa#evaluador" style={{ color: 'var(--paper)', borderColor: 'color-mix(in srgb, var(--paper) 40%, transparent)' }}>Portuguesa</Link></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: 900 }}>
          <h2 className="h2" style={{ marginBottom: 32 }}>Preguntas frecuentes</h2>
          <Faq items={FAQS} />
          <p style={{ marginTop: 24 }}><Link href="/blog/visa-americana-venezolanos-2026">Lee la guía completa: visa americana para venezolanos en 2026 →</Link></p>
        </div>
      </section>

      <ContactSection kicker="AVISO DE CAMBIOS" title={<>Te avisamos cuando <em>cambien las reglas</em>.</>} lede="Déjanos tus datos y cuéntanos tu caso. Recibes respuesta inmediata por correo y te escribimos en cuanto el Departamento de Estado publique cambios para venezolanos." service="Visa americana" page="/visa-americana" />
      <Footer />
      <Diana topic="visas" />
    </>
  );
}
