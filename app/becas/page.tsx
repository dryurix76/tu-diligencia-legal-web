import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMeta, serviceLd } from '@/lib/seo';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import BecaForm from '@/components/BecaForm';
import { JsonLd } from '@/components/Seo';
import { BECAS, BECA_SERVICES, CALENDAR } from '@/lib/becas';

export const metadata: Metadata = pageMeta('/becas');

const FIT = { alta: ['#0B7A59', 'ENCAJA MUY BIEN CON VENEZOLANOS'], media: ['#C98A12', 'REQUISITOS ESPECÍFICOS'], baja: ['#A3312A', 'MUY RESTRINGIDA'] } as const;

export default function Becas() {
  return (
    <>
      <JsonLd data={[serviceLd('/becas', 'Te buscamos tu beca en España, Portugal e Italia', 'Búsqueda y solicitud de becas de grado, máster y doctorado para venezolanos y latinoamericanos.', BECA_SERVICES.map((s) => ({ name: s.name, includes: s.desc, price: `USD ${s.usd}` })))]} />
      <PageHero path="/becas" crumb="Becas" a="Te buscamos" b="tu beca." lede="Las principales becas 2026-2027 para estudiar en España, Portugal e Italia, con costes reales y enlaces oficiales. Y si prefieres no hacerlo solo, nuestro equipo de especialistas en becas busca y prepara tu solicitud.">
        <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
          <a className="btn btn-mint" href="#guia">Recibir la guía gratis</a>
          <a className="btn btn-ghost" href="#servicios" style={{ color: '#F4EFE6', borderColor: 'rgba(244,239,230,0.4)' }}>Ver servicios y precios</a>
        </div>
      </PageHero>

      <nav aria-label="Países" className="wrap" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 40 }}>
        {BECAS.map((c) => <a key={c.id} href={`#${c.id}`} className="chip" style={{ textDecoration: 'none' }}>{c.flag} {c.name}</a>)}
        <a href="#calendario" className="chip" style={{ textDecoration: 'none' }}>Calendario</a>
      </nav>

      {BECAS.map((c, ci) => (
        <section key={c.id} id={c.id} className={ci % 2 ? 'sand section' : 'section'}>
          <div className="wrap">
            <p className="kicker">{c.flag} Becas en {c.name}</p>
            <h2 className="h2" style={{ maxWidth: 820 }}>Estudiar en <em>{c.name}</em> en 2026-2027</h2>
            <p className="lede" style={{ maxWidth: 760 }}>{c.intro}</p>
            <div className="g-2" style={{ marginTop: 40, gap: 20 }}>
              {c.becas.map((b) => (
                <article key={b.name} className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 10, background: '#fff' }}>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: FIT[b.fit][0] }}>{FIT[b.fit][1]} · {b.level.toUpperCase()}</span>
                  <h3 className="serif" style={{ margin: 0, fontSize: 25, fontWeight: 400, lineHeight: 1.1 }}>{b.name}</h3>
                  <p style={{ margin: 0, fontSize: 14.5, color: '#4E4A43' }}><strong>Para quién:</strong> {b.who}</p>
                  <p style={{ margin: 0, fontSize: 14.5, color: '#4E4A43' }}><strong>Qué cubre:</strong> {b.covers}</p>
                  <p style={{ margin: 0, fontSize: 14.5 }}><strong>Importe:</strong> {b.amount}</p>
                  <p style={{ margin: 0, fontSize: 14.5, color: '#4E4A43' }}><strong>Última convocatoria:</strong> {b.window}</p>
                  <p style={{ margin: 0, fontSize: 14.5, color: '#0B7A59' }}><strong>Próxima:</strong> {b.next}</p>
                  <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 'auto', fontSize: 14.5 }}>Web oficial →</a>
                </article>
              ))}
            </div>
            <div style={{ marginTop: 40 }}>
              <h3 className="mono accent" style={{ margin: '0 0 8px', fontSize: 13, letterSpacing: '0.14em', fontWeight: 500 }}>CUÁNTO CUESTA ESTUDIAR EN {c.name.toUpperCase()}</h3>
              <div style={{ overflowX: 'auto', borderTop: '2px solid #0B1F33' }}>
                <table className="prices"><tbody>{c.costs.map(([a, b]) => (
                  <tr key={a}><td className="serif" style={{ padding: '16px 24px 16px 0', fontSize: 19 }}>{a}</td><td style={{ padding: '16px 0', color: '#4E4A43', fontSize: 15 }}>{b}</td></tr>
                ))}</tbody></table>
              </div>
            </div>
            <p className="card" style={{ marginTop: 28, padding: '18px 22px', fontSize: 15 }}><strong>Nuestro consejo:</strong> {c.tip}</p>
          </div>
        </section>
      ))}

      <section id="calendario" className="section">
        <div className="wrap g-2" style={{ alignItems: 'start' }}>
          <div>
            <p className="kicker">Calendario</p>
            <h2 className="h2">Las becas se ganan <em>con meses</em> de antelación.</h2>
            <p className="lede">La mayoría cierra entre 6 y 10 meses antes de empezar las clases. Esta es la secuencia de cada año.</p>
          </div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {CALENDAR.map(([w, t]) => <li key={w} style={{ display: 'flex', gap: 20, padding: '16px 0', borderBottom: '1px solid rgba(11,31,51,0.12)' }}><span className="mono accent" style={{ flex: '0 0 150px', fontSize: 13, letterSpacing: '0.06em' }}>{w.toUpperCase()}</span><span>{t}</span></li>)}
          </ol>
        </div>
      </section>

      <section id="servicios" className="sand section">
        <div className="wrap">
          <p className="kicker">Servicio</p>
          <h2 className="h2" style={{ maxWidth: 820 }}>Te buscamos tu beca. <em>Tú te dedicas a estudiar.</em></h2>
          <p className="lede" style={{ maxWidth: 760 }}>Trabajamos con especialistas en admisiones y becas internacionales. Nosotros coordinamos y, cuando consigues la admisión, también te hacemos el visado de estudios.</p>
          <div className="g-3" style={{ marginTop: 40 }}>
            {BECA_SERVICES.map((s, i) => (
              <article key={s.id} className="card-lift" style={{ padding: 32, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 14, ...(i === 0 ? { background: '#0B1F33', color: '#F4EFE6' } : { background: '#fff', border: '1px solid rgba(11,31,51,0.08)' }) }}>
                <h3 className="serif" style={{ margin: 0, fontSize: 28, fontWeight: 400 }}>{s.name}</h3>
                <p className="serif" style={{ margin: 0, fontSize: 44, lineHeight: 1, color: i === 0 ? '#3DD1A0' : '#0B7A59' }}>USD {s.usd}</p>
                <p style={{ margin: 0, fontSize: 15, opacity: 0.85 }}>{s.desc}</p>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, lineHeight: 1.7 }}>{s.items.map((x) => <li key={x}>{x}</li>)}</ul>
                <a className={`btn ${i === 0 ? 'btn-mint' : 'btn-ink'}`} href="#guia" style={{ marginTop: 'auto' }}>Lo quiero</a>
              </article>
            ))}
          </div>
          <p style={{ marginTop: 20, fontSize: 13.5, color: '#5E584E' }}>No garantizamos la concesión: la decide cada entidad convocante. Ver la <Link href="/legal/reembolsos">política de reembolsos</Link>.</p>
        </div>
      </section>

      <section id="guia" className="section">
        <div className="wrap g-2" style={{ alignItems: 'start' }}>
          <div>
            <p className="kicker">Guía gratuita</p>
            <h2 className="h2">Regístrate y recibe la <em>guía de becas 2026</em>.</h2>
            <p className="lede">Te llega por correo un PDF con todas las becas de esta página, requisitos, documentos, costes y el calendario. Si eliges un servicio, un asesor revisa tu perfil y te escribe.</p>
          </div>
          <div className="panel"><BecaForm /></div>
        </div>
      </section>
      <Footer />
      <Diana topic="general" />
    </>
  );
}
