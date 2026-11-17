import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import Faq from '@/components/Faq';
import CountrySelector from '@/components/CountrySelector';
import { ContactSection } from '@/components/Forms';
import { Certia } from '@/components/Brand';
import { POSTS } from '@/lib/posts';
import { pageMeta, faqLd } from '@/lib/seo';
import { JsonLd } from '@/components/Seo';

export const metadata = pageMeta('/');

const FAQS = [
  { q: '¿Por qué cobran la consulta?', a: 'Porque es asesoría legal real con un abogado especialista, no una llamada comercial. Y si contratas el servicio en los 30 días siguientes, te descontamos lo que pagaste.' },
  { q: '¿Puedo saber gratis si califico?', a: 'Sí. La pre-evaluación es gratuita y te da un semáforo orientativo en 2 minutos. La confirmación la da un abogado en la consulta.' },
  { q: '¿Tengo que viajar a España?', a: 'Depende de la vía. Muchas gestiones se hacen desde el consulado del país donde vives. Te lo decimos con exactitud en la consulta.' },
  { q: '¿Cómo pago desde Venezuela?', a: 'Con tarjeta internacional, Zelle, Binance Pay (USDT) o transferencia en euros. Los servicios se pagan en 2 o 3 cuotas.' },
  { q: '¿Y si no encuentro la partida de mi abuelo?', a: 'La buscamos por ti en registros civiles y parroquiales de España. Es un servicio aparte, desde USD 180 por acta.' },
  { q: '¿Cuánto tarda el proceso?', a: 'Depende de la vía y del consulado. En la propuesta te damos un plazo estimado por escrito y lo sigues en tiempo real desde Mi caso.' },
];

const STEPS = [
  ['i', 'Pre-evaluación', 'GRATIS · 2 MIN', 'Respondes unas preguntas y recibes un semáforo de viabilidad.'],
  ['ii', 'Consulta pagada', 'DESDE USD 60', 'Videollamada con el abogado especialista en tu país.'],
  ['iii', 'Propuesta', 'PRECIO CERRADO', 'Por escrito: vía, documentos, plazos estimados y cuotas.'],
  ['iv', 'Expediente', 'PORTAL 24/7', 'Buscamos partidas, apostillamos y armamos todo. Lo sigues en línea.'],
  ['v', 'Pasaporte', 'TU NUEVA ETAPA', 'Te acompañamos hasta la cita y la jura o inscripción.'],
];

export default function Home() {
  return (
    <>
      <JsonLd data={faqLd(FAQS)} />
      <div style={{ background: '#071423', color: '#C9C2B4', fontSize: 13 }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 38, gap: 16, flexWrap: 'wrap' }}>
          <span className="mono">Tu Diligencia Legal es parte de Certia Group</span>
          <span className="mono hide-m">Atención 24 h con Diana · WhatsApp {process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || '+58 [NÚMERO]'}</span>
        </div>
      </div>

      <section style={{ background: '#0B1F33', color: '#F4EFE6', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(244,239,230,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(244,239,230,0.04) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <Header dark ctaHref="/nacionalidad-espanola#evaluador" />
        <div className="wrap g-hero" style={{ position: 'relative', paddingTop: 72, paddingBottom: 96, alignItems: 'center' }}>
          <div>
            <p className="mono" style={{ margin: '0 0 32px', fontSize: 13, letterSpacing: '0.14em', color: '#C9B48C', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ width: 40, height: 1, background: '#B8955A' }} />Expediente N.º 001 — Nacionalidad española</p>
            <h1 className="h1" style={{ fontSize: 'clamp(54px, 7vw, 92px)', lineHeight: 0.98, fontWeight: 340, letterSpacing: '-0.035em' }}>Tu abuelo salió de España.<br /><span style={{ color: '#E8D3AE' }}>Tú puedes <em style={{ fontWeight: 300 }}>volver</em></span> con pasaporte.</h1>
            <p style={{ margin: '36px 0 0', maxWidth: 560, fontSize: 19, color: '#C9CFD6' }}>Gestionamos la nacionalidad española de venezolanos de principio a fin: árbol familiar, partidas, apostillas y expediente. Con precio cerrado y un abogado que firma tu caso.</p>
            <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link className="btn btn-mint btn-lg" href="/nacionalidad-espanola#evaluador">Descubre si calificas <span style={{ opacity: 0.75, fontWeight: 400 }}>— 2 min, gratis</span></Link>
              <Link href="/tarifas" style={{ color: '#F4EFE6', fontWeight: 500, textUnderlineOffset: 6 }}>Ver tarifas</Link>
            </div>
            <div style={{ marginTop: 56, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', fontSize: 14, color: '#A9B2BE' }}>
              <span className="mono" style={{ letterSpacing: '0.1em', fontSize: 11.5, color: '#C9B48C' }}>TAMBIÉN</span>
              {[['/nacionalidad-italiana', 'Italia'], ['/nacionalidad-portuguesa', 'Portugal'], ['/nacionalidad-alemana', 'Alemania'], ['/nacionalidad-croata', 'Croacia'], ['/nacionalidad-britanica', 'Reino Unido']].map(([h, l]) => <Link key={h} href={h} style={{ color: '#A9B2BE', textDecoration: 'none' }}>{l}</Link>)}
            </div>
          </div>
          <HeroArt />
        </div>
        <div className="wrap" style={{ position: 'relative', paddingBottom: 64 }}>
          <div className="g-3" style={{ borderTop: '1px solid rgba(244,239,230,0.16)', paddingTop: 32, gap: 40 }}>
            {[['2 min', 'Pre-evaluación gratuita, con semáforo de viabilidad'], ['$60', 'Consulta con abogado, descontable si contratas'], ['1', 'Abogado responsable que firma tu expediente']].map(([a, b]) => (
              <div key={a} style={{ display: 'flex', gap: 18, alignItems: 'baseline' }}><span className="serif" style={{ fontSize: 44, color: '#E8D3AE', fontWeight: 300, lineHeight: 1 }}>{a}</span><span style={{ color: '#C9CFD6', fontSize: 15 }}>{b}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 112 }}>
        <div className="wrap">
          <div className="g-2" style={{ alignItems: 'end' }}>
            <h2 className="h2" style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>Tu derecho no empieza contigo. Empieza en un <em style={{ color: '#A3312A' }}>acta de 1921</em>.</h2>
            <p style={{ margin: 0, color: '#4E4A43', fontSize: 18, maxWidth: 480 }}>Cada nacionalidad por ascendencia es una cadena de documentos. Nosotros encontramos cada eslabón, lo traducimos, lo apostillamos y lo presentamos ante el consulado.</p>
          </div>
          <div style={{ position: 'relative', marginTop: 80 }}>
            <svg className="hide-m" aria-hidden="true" viewBox="0 0 1184 60" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 34, width: '100%', height: 60 }}><path className="gene-line" d="M20 30 C 200 0, 300 60, 400 30 S 600 0, 790 30 S 1000 60, 1164 30" fill="none" stroke="#B8955A" strokeWidth="1.5" /></svg>
            <div className="g-4" style={{ position: 'relative' }}>
              {[['1921', 'Bisabuelo', 'Nace en Lugo, Galicia. Partida en el Registro Civil.'], ['1953', 'Abuelo', 'Llega a La Guaira en barco. Se casa en Caracas.'], ['1984', 'Madre', 'Nace en Valencia, Carabobo. Partida venezolana apostillada.'], ['2026', 'Tú', 'Expediente completo. Cita en el consulado. Pasaporte.']].map(([y, r, t], i) => (
                <div key={y}>
                  <div style={i === 3 ? { width: 22, height: 22, borderRadius: '50%', background: '#A3312A', margin: '24px 0 26px', boxShadow: '0 0 0 8px rgba(163,49,42,0.14)' } : { width: 18, height: 18, borderRadius: '50%', background: '#F4EFE6', border: '1.5px solid #B8955A', margin: '26px 0 28px' }} />
                  <p style={{ margin: 0, fontSize: 30, color: i === 3 ? '#A3312A' : '#2C3A57', fontFamily: "'Homemade Apple', cursive" }}>{y}</p>
                  <p className="serif" style={{ margin: '14px 0 4px', fontSize: 24 }}>{r}</p>
                  <p style={{ margin: 0, color: '#5E584E', fontSize: 15 }}>{t}</p>
                </div>
              ))}
            </div>
            <p className="mono" style={{ margin: '48px 0 0', fontSize: 12, letterSpacing: '0.08em', color: '#5E584E' }}>EJEMPLO ILUSTRATIVO DE UNA LÍNEA FAMILIAR</p>
          </div>
        </div>
      </section>

      <section id="paises" className="sand section">
        <div className="wrap">
          <p className="kicker">Selecciona un país</p>
          <h2 className="h2" style={{ marginBottom: 64 }}>¿De dónde viene tu familia?</h2>
          <CountrySelector />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 40, flexWrap: 'wrap', marginBottom: 56 }}>
            <h2 className="h2" style={{ maxWidth: 720 }}>Un pasaporte, una residencia o un negocio en Europa.</h2>
            <p style={{ margin: 0, maxWidth: 380, color: '#4E4A43' }}>Cuatro líneas de trabajo. Una sola metodología: diagnóstico pagado, precio cerrado y expediente impecable.</p>
          </div>
          <div className="g-svc">
            <Link href="/nacionalidad-espanola" className="card-lift" style={{ gridRow: 'span 2', background: '#0B1F33', color: '#F4EFE6', borderRadius: 4, padding: 'clamp(24px, 6vw, 40px)', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 'clamp(440px, 100vw, 560px)', position: 'relative', overflow: 'hidden' }}>
              <svg aria-hidden="true" viewBox="0 0 400 260" style={{ position: 'absolute', right: -20, bottom: 120, width: 440, opacity: 0.9 }}><g fill="none" stroke="#B8955A" strokeWidth="1.2"><path d="M20 260 V120 A50 50 0 0 1 120 120 V260" /><path d="M140 260 V120 A50 50 0 0 1 240 120 V260" /><path d="M260 260 V120 A50 50 0 0 1 360 120 V260" /><path d="M0 100 H400" /></g></svg>
              <div style={{ position: 'relative' }}>
                <span className="mono" style={{ fontSize: 11.5, letterSpacing: '0.16em', color: '#0B1F33', background: '#E8D3AE', padding: '6px 10px', borderRadius: 2 }}>SERVICIO PRINCIPAL</span>
                <p className="serif" style={{ margin: '28px 0 14px', fontSize: 'clamp(36px, 9.5vw, 52px)', lineHeight: 1, fontWeight: 340 }}>Nacionalidad <em>española</em></p>
                <p style={{ margin: 0, maxWidth: 360, color: '#C9CFD6' }}>Para hijos y nietos de españoles, y para venezolanos que ya residen legalmente en España.</p>
              </div>
              <div style={{ position: 'relative' }}><span style={{ fontSize: 14, color: '#A9B2BE' }}>desde</span><br /><span className="serif" style={{ fontSize: 44, color: '#E8D3AE' }}>USD 900</span></div>
            </Link>
            {[['/#paises', 'Otras nacionalidades', 'Italiana, portuguesa, alemana, croata y británica por ascendencia.', '1.500'], ['/visados', 'Visados y residencias', 'Nómada digital, no lucrativa, D7, estudios, arraigo y reagrupación.', '600'], ['/negocios', 'Visas de negocios', 'Emprendedor, inversor, traslado intraempresa y Schengen de negocios, con apoyo societario de Certia Group.', '350'], ['/caribe', 'Caribe', 'Visados y residencias en los destinos caribeños con más demanda venezolana.', '250']].map(([h, t, d, p], i) => (
              <Link key={h} href={h} className="card-lift" style={{ background: i === 3 ? '#24596E' : '#fff', color: i === 3 ? '#F4EFE6' : '#0B1F33', borderRadius: 4, padding: 32, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 16, border: i === 3 ? 0 : '1px solid rgba(11,31,51,0.08)' }}>
                <p className="serif" style={{ margin: 0, fontSize: 30, lineHeight: 1.05 }}>{t}</p>
                <p style={{ margin: 0, color: i === 3 ? '#DCE6EA' : '#5E584E', fontSize: 15 }}>{d}</p>
                <p className="mono" style={{ margin: 'auto 0 0', fontSize: 13, color: i === 3 ? '#F4EFE6' : '#0B7A59' }}>desde USD {p} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="dark section">
        <div className="wrap">
          <div className="g-2" style={{ alignItems: 'end', marginBottom: 80 }}>
            <h2 className="h2">Cinco pasos. <em style={{ color: '#E8D3AE' }}>Cero sorpresas.</em></h2>
            <p style={{ margin: 0, color: '#C9CFD6', maxWidth: 460 }}>Toda consulta con abogado es de pago. A cambio, cada minuto es para tu caso y el importe se descuenta si contratas en los 30 días siguientes.</p>
          </div>
          <div className="g-5">
            {STEPS.map(([n, t, k, d], i) => (
              <div key={n}>
                <div className="serif" style={{ width: 64, height: 64, borderRadius: '50%', border: i === 1 ? 0 : '1.5px solid #B8955A', background: i === 1 ? '#3DD1A0' : i === 4 ? '#E8D3AE' : '#0B1F33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontStyle: 'italic', color: i === 1 || i === 4 ? '#0B1F33' : '#E8D3AE' }}>{n}</div>
                <p className="serif" style={{ margin: '28px 0 8px', fontSize: 24 }}>{t}</p>
                <p className="mono" style={{ margin: '0 0 10px', fontSize: 12, color: '#C9B48C', letterSpacing: '0.08em' }}>{k}</p>
                <p style={{ margin: 0, color: '#A9B2BE', fontSize: 15 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap g-2" style={{ alignItems: 'start' }}>
          <div>
            <p className="serif" style={{ margin: 0, fontSize: 'clamp(44px, 6vw, 76px)', lineHeight: 0.98, fontWeight: 320, letterSpacing: '-0.035em' }}>“No vendemos esperanza. Vendemos un <em className="accent">expediente</em> bien hecho.”</p>
            <div style={{ marginTop: 32 }}><Certia dark={false} h={24} /></div>
          </div>
          <div style={{ borderTop: '1px solid rgba(11,31,51,0.2)' }}>
            {[['Respaldo de Certia Group', 'Estructura corporativa, equipo legal y apoyo societario para tus planes en Europa.'], ['Abogados especialistas por país', 'Cada caso lo lleva quien conoce ese consulado y esa ley.'], ['Precio cerrado, por escrito', 'Sabes desde el día uno qué pagas, qué incluye y qué no.'], ['Tu caso, en tu teléfono', 'Portal del cliente con estado, documentos y pagos, y avisos por WhatsApp.']].map(([t, d], i) => (
              <div key={t} style={{ display: 'flex', gap: 24, padding: '26px 0', borderBottom: '1px solid rgba(11,31,51,0.2)' }}><span className="mono accent" style={{ fontSize: 13, paddingTop: 4 }}>0{i + 1}</span><div><p className="serif" style={{ margin: '0 0 6px', fontSize: 24 }}>{t}</p><p style={{ margin: 0, color: '#5E584E', fontSize: 15 }}>{d}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section id="tarifas" className="sand section">
        <div className="wrap g-2" style={{ alignItems: 'start' }}>
          <div>
            <p className="kicker">Tarifas transparentes</p>
            <h2 className="h2">Toda consulta tiene precio. <em>Y ese precio vuelve a ti.</em></h2>
            <p className="lede">Si contratas el servicio en los 30 días siguientes, descontamos el importe de la consulta.</p>
            <Link className="btn btn-ink" href="/tarifas" style={{ marginTop: 36 }}>Ver todas las tarifas</Link>
          </div>
          <div style={{ background: '#F4EFE6', borderRadius: 4, padding: '12px 36px' }}>
            {[['Consulta exprés por escrito', 'Una pregunta, respuesta del abogado en 48 h', '$35', 'expres'], ['Consulta inicial', '30 min por videollamada · descontable', '$60', 'inicial'], ['Consulta de estrategia', '60 min + informe de viabilidad · descontable', '$120', 'estrategia'], ['Revisión documental', 'Hasta 10 documentos + informe · descontable', '$150', 'revision']].map(([t, d, p, id], i) => (
              <Link key={id} href={`/agendar?tipo=${id}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'center', padding: '26px 0', borderBottom: i < 3 ? '1px solid rgba(11,31,51,0.15)' : 0, textDecoration: 'none', color: '#0B1F33' }}>
                <div><p className="serif" style={{ margin: 0, fontSize: 24 }}>{t}</p><p style={{ margin: '4px 0 0', color: '#5E584E', fontSize: 14 }}>{d}</p></div>
                <p className="serif" style={{ margin: 0, fontSize: 32, whiteSpace: 'nowrap' }}>{p}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, flexWrap: 'wrap', marginBottom: 48 }}>
            <h2 className="h2">Del <em>Archivo</em></h2>
            <Link href="/blog" style={{ fontWeight: 500 }}>Ir al blog →</Link>
          </div>
          <div className="g-3">
            {POSTS.slice(0, 3).map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card-lift" style={{ textDecoration: 'none', color: '#0B1F33' }}>
                <div style={{ height: 240, borderRadius: 4, background: p.bg, display: 'flex', alignItems: 'flex-end', padding: 24 }}><span className="serif" style={{ fontSize: 64, fontStyle: 'italic', color: p.fg, lineHeight: 0.9 }}>{p.word}</span></div>
                <p className="mono accent" style={{ margin: '20px 0 8px', fontSize: 12, letterSpacing: '0.1em' }}>{p.catLabel}</p>
                <p className="serif" style={{ margin: 0, fontSize: 24, lineHeight: 1.2 }}>{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 120 }}>
        <div className="wrap g-2" style={{ alignItems: 'start' }}>
          <h2 className="h2">Lo que todos preguntan</h2>
          <Faq items={FAQS} size={23} />
        </div>
      </section>

      <ContactSection kicker="¿PREFIERES QUE TE ESCRIBAMOS?" title={<>Cuéntanos tu caso. <em>Te respondemos en minutos.</em></>} lede="Diana te escribe por WhatsApp al instante con tu número de caso. Si tu caso necesita un abogado, te enviamos el enlace para agendar la consulta adecuada, con su precio." page="/" />

      <section style={{ background: '#0B1F33', color: '#F4EFE6', padding: '144px 0 120px' }}>
        <div className="wrap">
          <p className="serif" style={{ margin: 0, fontSize: 'clamp(52px, 8vw, 112px)', lineHeight: 0.95, fontWeight: 300, letterSpacing: '-0.04em', maxWidth: 1100 }}>Cada año que esperas, los consulados se llenan <em style={{ color: '#E8D3AE' }}>más</em>.</p>
          <div style={{ display: 'flex', gap: 20, marginTop: 56, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link className="btn btn-mint btn-lg" href="/nacionalidad-espanola#evaluador">Empieza tu pre-evaluación</Link>
            <span style={{ color: '#A9B2BE', fontSize: 15 }}>Gratis, 2 minutos, sin compromiso.</span>
          </div>
        </div>
      </section>
      <Footer />
      <Diana topic="general" />
    </>
  );
}

function HeroArt() {
  return (
    <div aria-hidden="true" className="hide-m" style={{ position: 'relative', height: 600, minWidth: 0 }}>
      <div style={{ position: 'absolute', left: '6%', top: 40, width: '78%', height: 470, background: '#EFE6D3', borderRadius: 3, transform: 'rotate(4deg)', boxShadow: '0 30px 60px rgba(0,0,0,0.45)', padding: 34, color: '#2B2A26', backgroundImage: 'repeating-linear-gradient(transparent, transparent 37px, rgba(43,42,38,0.12) 37px, rgba(43,42,38,0.12) 38px)' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(43,42,38,0.4)', paddingBottom: 10 }}><span>REGISTRO CIVIL · LUGO</span><span>FOLIO 214</span></div>
        <p className="serif" style={{ margin: '18px 0 6px', fontSize: 22, fontStyle: 'italic' }}>Partida de nacimiento</p>
        <p style={{ margin: '14px 0 0', fontSize: 17, lineHeight: '38px', color: '#2C3A57', fontFamily: "'Homemade Apple', cursive" }}>Manuel Ferreiro Castro,<br />nacido en San Xoán de Lugo<br />el catorce de marzo de<br />mil novecientos veintiuno.</p>
      </div>
      <div className="passport" style={{ position: 'absolute', left: '36%', top: 210, width: 236, height: 326, borderRadius: '10px 14px 14px 10px', background: 'linear-gradient(135deg, #6A1F28, #4A141B)', boxShadow: '0 40px 70px rgba(0,0,0,0.55), inset 6px 0 0 rgba(0,0,0,0.18)', color: '#D9BC80', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '30px 20px 26px', textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.24em' }}>UNIÓN EUROPEA</div>
        <div className="serif" style={{ fontSize: 26, letterSpacing: '0.12em' }}>ESPAÑA</div>
        <svg width="74" height="74" viewBox="0 0 74 74"><circle cx="37" cy="37" r="33" fill="none" stroke="#D9BC80" strokeWidth="1.2" /><circle cx="37" cy="37" r="26" fill="none" stroke="#D9BC80" strokeWidth="0.6" strokeDasharray="2 3" /><path d="M37 16 L41 31 L56 31 L44 40 L48 55 L37 46 L26 55 L30 40 L18 31 L33 31 Z" fill="none" stroke="#D9BC80" strokeWidth="1.1" /></svg>
        <div className="serif" style={{ fontSize: 19, letterSpacing: '0.3em' }}>PASAPORTE</div>
      </div>
      <div className="stamp" style={{ position: 'absolute', left: 0, top: 330, width: 178, height: 178 }}>
        <svg viewBox="0 0 200 200" width="178" height="178"><defs><path id="hs-c" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" /></defs><circle cx="100" cy="100" r="94" fill="none" stroke="#E0574C" strokeWidth="5" /><circle cx="100" cy="100" r="56" fill="none" stroke="#E0574C" strokeWidth="2" /><text fontFamily="IBM Plex Mono, monospace" fontSize="15" letterSpacing="4" fill="#E0574C"><textPath href="#hs-c">TU DILIGENCIA LEGAL · CERTIA GROUP · </textPath></text><text x="100" y="76" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" letterSpacing="2" fill="#E0574C">EXPEDIENTE</text><line x1="46" y1="86" x2="154" y2="86" stroke="#E0574C" strokeWidth="1.6" /><line x1="46" y1="114" x2="154" y2="114" stroke="#E0574C" strokeWidth="1.6" /><text x="100" y="107" textAnchor="middle" textLength="92" lengthAdjust="spacingAndGlyphs" fontFamily="Fraunces Variable, Fraunces, serif" fontSize="19" fontWeight="700" fill="#E0574C">APROBADO</text><text x="100" y="131" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" letterSpacing="2" fill="#E0574C">2026</text></svg>
      </div>
    </div>
  );
}
