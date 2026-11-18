import Link from 'next/link';
import PostCover from '@/components/PostCover';
import { postImages } from '@/lib/postImages';
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
  const blogImgs = postImages();
  return (
    <>
      <JsonLd data={faqLd(FAQS)} />
      <div style={{ background: 'var(--ink)', color: 'var(--paper-3)', fontSize: 13 }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 38, gap: 16, flexWrap: 'wrap' }}>
          <span className="mono">Tu Diligencia Legal es parte de Certia Group</span>
          <span className="mono hide-m">Atención 24 h con Diana · WhatsApp {process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || '+58 [NÚMERO]'}</span>
        </div>
      </div>

      <section style={{ background: 'var(--ink)', color: 'var(--paper)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" className="grid-bg" />
        <div aria-hidden="true" className="glow" style={{ width: 720, height: 720, right: -160, top: 40 }} />
        <span aria-hidden="true" className="ghost-code hide-m" style={{ fontSize: 'clamp(260px, 30vw, 460px)', left: -30, bottom: -60 }}>1921</span>
        <Header dark ctaHref="/nacionalidad-espanola#evaluador" />
        <div className="wrap" style={{ position: 'relative', paddingTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <p className="meta" style={{ margin: 0, color: 'var(--green-lt)', display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ width: 40, height: 1, background: 'var(--green-lt)' }} />Expediente N.º 001 — Nacionalidad española</p>
          <span className="live meta" style={{ fontSize: 10.5 }}><i />Consulados y normas revisados · nov. 2026</span>
        </div>
        <div className="wrap g-hero" style={{ position: 'relative', paddingTop: 40, paddingBottom: 72, alignItems: 'center' }}>
          <div>
            <h1 className="h1" style={{ fontSize: 'clamp(54px, 7vw, 92px)', lineHeight: 0.98, fontWeight: 340, letterSpacing: '-0.035em' }}>Tu abuelo salió de España.<br /><span style={{ color: 'var(--green-lt)' }}>Tú puedes <em style={{ fontWeight: 300, color: 'inherit' }}>volver</em></span> con pasaporte.</h1>
            <p style={{ margin: '32px 0 0', maxWidth: 560, fontSize: 19, color: 'var(--on-dark)' }}>Gestionamos la nacionalidad española de venezolanos de principio a fin: árbol familiar, partidas, apostillas y expediente. Con precio cerrado y un abogado que firma tu caso.</p>
            <div style={{ display: 'flex', gap: 16, marginTop: 36, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link className="btn btn-mint btn-lg" href="/nacionalidad-espanola#evaluador">Descubre si calificas <span style={{ opacity: 0.7, fontWeight: 400 }}>— 2 min, gratis</span> <span className="arr" aria-hidden="true">→</span></Link>
              <Link href="/tarifas" style={{ color: 'var(--paper)', fontWeight: 500 }}>Ver tarifas</Link>
            </div>
            <ul className="ticks" style={{ marginTop: 32 }}>
              <li>Precio cerrado por escrito</li>
              <li>Pago en 2 o 3 cuotas</li>
              <li>Zelle, tarjeta o Binance Pay</li>
            </ul>
            <div style={{ marginTop: 36, paddingTop: 22, borderTop: '1px solid var(--line-dark)', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', fontSize: 14, color: 'var(--on-dark-2)' }}>
              <span className="meta" style={{ fontSize: 10.5, color: 'var(--green-lt)' }}>También</span>
              {[['/nacionalidad-italiana', 'Italia'], ['/nacionalidad-portuguesa', 'Portugal'], ['/nacionalidad-alemana', 'Alemania'], ['/nacionalidad-croata', 'Croacia'], ['/nacionalidad-britanica', 'Reino Unido']].map(([h, l]) => <Link key={h} href={h} style={{ color: 'var(--on-dark)', textDecoration: 'none' }}>{l}</Link>)}
            </div>
          </div>
          <HeroArt />
        </div>
        <div className="wrap" style={{ position: 'relative', paddingBottom: 56 }}>
          <div className="route hide-m" style={{ marginBottom: 28 }} aria-hidden="true">
            <span>LA GUAIRA · 10.60°N 66.93°W</span><span className="ln" /><span style={{ color: 'var(--green-lt)' }}>1953 → 2026</span><span className="ln" /><span>MADRID · 40.42°N 3.70°W</span>
          </div>
          <div className="facts">
            {[['Pre-evaluación', <>2 min, <em>gratis</em></>], ['Consulta con abogado', <>USD 60, <em>descontable</em></>], ['Responsable', <>1 abogado <em>firma</em> tu caso</>], ['Nacionalidades', <>6 países <em>de la UE</em> y UK</>]].map(([l, v], i) => (
              <div key={i}><span className="n">0{i + 1}</span><p className="l">{l}</p><p className="v">{v}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 112 }}>
        <div className="wrap">
          <div className="g-2" style={{ alignItems: 'end' }}>
            <div><p className="kicker">§ 01 · La cadena de documentos</p><h2 className="h2" style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>Tu derecho no empieza contigo. Empieza en un <em style={{ color: 'var(--green)' }}>acta de 1921</em>.</h2></div>
            <p style={{ margin: 0, color: 'var(--ink-80)', fontSize: 18, maxWidth: 480 }}>Cada nacionalidad por ascendencia es una cadena de documentos. Nosotros encontramos cada eslabón, lo traducimos, lo apostillamos y lo presentamos ante el consulado.</p>
          </div>
          <div style={{ position: 'relative', marginTop: 80 }}>
            <svg className="hide-m" aria-hidden="true" viewBox="0 0 1184 60" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 34, width: '100%', height: 60 }}><path className="gene-line" d="M20 30 C 200 0, 300 60, 400 30 S 600 0, 790 30 S 1000 60, 1164 30" fill="none" stroke="var(--green)" strokeWidth="1.5" /></svg>
            <div className="g-4" style={{ position: 'relative' }}>
              {[['1921', 'Bisabuelo', 'Nace en Lugo, Galicia. Partida en el Registro Civil.'], ['1953', 'Abuelo', 'Llega a La Guaira en barco. Se casa en Caracas.'], ['1984', 'Madre', 'Nace en Valencia, Carabobo. Partida venezolana apostillada.'], ['2026', 'Tú', 'Expediente completo. Cita en el consulado. Pasaporte.']].map(([y, r, t], i) => (
                <div key={y}>
                  <div style={i === 3 ? { width: 22, height: 22, borderRadius: '50%', background: 'var(--green)', margin: '24px 0 26px', boxShadow: '0 0 0 8px color-mix(in srgb, var(--green) 14%, transparent)' } : { width: 18, height: 18, borderRadius: '50%', background: 'var(--paper)', border: '1.5px solid var(--green)', margin: '26px 0 28px' }} />
                  <p style={{ margin: 0, fontSize: 30, color: i === 3 ? 'var(--green)' : 'var(--ink-80)', fontFamily: "'Homemade Apple', cursive" }}>{y}</p>
                  <p className="serif" style={{ margin: '14px 0 4px', fontSize: 24 }}>{r}</p>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: 15 }}>{t}</p>
                </div>
              ))}
            </div>
            <p className="mono" style={{ margin: '48px 0 0', fontSize: 12, letterSpacing: '0.08em', color: 'var(--muted)' }}>EJEMPLO ILUSTRATIVO DE UNA LÍNEA FAMILIAR</p>
          </div>
        </div>
      </section>

      <section id="paises" className="sand section">
        <div className="wrap">
          <p className="kicker">§ 02 · Selecciona un país</p>
          <h2 className="h2" style={{ marginBottom: 64 }}>¿De dónde viene tu familia?</h2>
          <CountrySelector />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 40, flexWrap: 'wrap', marginBottom: 56 }}>
            <div><p className="kicker">§ 03 · Líneas de trabajo</p><h2 className="h2" style={{ maxWidth: 720 }}>Un pasaporte, una residencia o un negocio en Europa.</h2></div>
            <p style={{ margin: 0, maxWidth: 380, color: 'var(--ink-80)' }}>Cuatro líneas de trabajo. Una sola metodología: diagnóstico pagado, precio cerrado y expediente impecable.</p>
          </div>
          <div className="g-svc">
            <Link href="/nacionalidad-espanola" className="card-lift" style={{ gridRow: 'span 2', background: 'var(--ink)', color: 'var(--paper)', borderRadius: 4, padding: 'clamp(24px, 6vw, 40px)', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 'clamp(440px, 100vw, 560px)', position: 'relative', overflow: 'hidden' }}>
              <svg aria-hidden="true" viewBox="0 0 400 260" style={{ position: 'absolute', right: -20, bottom: 120, width: 440, opacity: 0.9 }}><g fill="none" stroke="var(--green)" strokeWidth="1.2"><path d="M20 260 V120 A50 50 0 0 1 120 120 V260" /><path d="M140 260 V120 A50 50 0 0 1 240 120 V260" /><path d="M260 260 V120 A50 50 0 0 1 360 120 V260" /><path d="M0 100 H400" /></g></svg>
              <div style={{ position: 'relative' }}>
                <span className="mono" style={{ fontSize: 11.5, letterSpacing: '0.16em', color: 'var(--ink)', background: 'var(--green-lt)', padding: '6px 10px', borderRadius: 2 }}>SERVICIO PRINCIPAL</span>
                <p className="serif" style={{ margin: '28px 0 14px', fontSize: 'clamp(36px, 9.5vw, 52px)', lineHeight: 1, fontWeight: 340 }}>Nacionalidad <em>española</em></p>
                <p style={{ margin: 0, maxWidth: 360, color: 'var(--on-dark)' }}>Para hijos y nietos de españoles, y para venezolanos que ya residen legalmente en España.</p>
              </div>
              <div style={{ position: 'relative' }}><span style={{ fontSize: 14, color: 'var(--on-dark-2)' }}>desde</span><br /><span className="serif" style={{ fontSize: 44, color: 'var(--green-lt)' }}>USD 900</span></div>
            </Link>
            {[['/#paises', 'Otras nacionalidades', 'Italiana, portuguesa, alemana, croata y británica por ascendencia.', '1.500'], ['/visados', 'Visados y residencias', 'Nómada digital, no lucrativa, D7, estudios, arraigo y reagrupación.', '600'], ['/negocios', 'Visas de negocios', 'Emprendedor, inversor, traslado intraempresa y Schengen de negocios, con apoyo societario de Certia Group.', '350'], ['/caribe', 'Caribe', 'Visados y residencias en los destinos caribeños con más demanda venezolana.', '250']].map(([h, t, d, p], i) => (
              <Link key={h} href={h} className="card-lift" style={{ background: i === 3 ? 'var(--green-dk)' : 'var(--card)', color: i === 3 ? 'var(--paper)' : 'var(--ink)', borderRadius: 4, padding: 32, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 16, border: i === 3 ? 0 : '1px solid color-mix(in srgb, var(--ink) 8%, transparent)' }}>
                <p className="serif" style={{ margin: 0, fontSize: 30, lineHeight: 1.05 }}>{t}</p>
                <p style={{ margin: 0, color: i === 3 ? 'var(--paper-2)' : 'var(--muted)', fontSize: 15 }}>{d}</p>
                <p className="mono" style={{ margin: 'auto 0 0', fontSize: 13, color: i === 3 ? 'var(--paper)' : 'var(--green)' }}>desde USD {p} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="dark section">
        <div className="wrap">
          <div className="g-2" style={{ alignItems: 'end', marginBottom: 80 }}>
            <div><p className="kicker" style={{ color: 'var(--green-lt)' }}>§ 04 · Método</p><h2 className="h2">Cinco pasos. <em style={{ color: 'var(--green-lt)' }}>Cero sorpresas.</em></h2></div>
            <p style={{ margin: 0, color: 'var(--on-dark)', maxWidth: 460 }}>Toda consulta con abogado es de pago. A cambio, cada minuto es para tu caso y el importe se descuenta si contratas en los 30 días siguientes.</p>
          </div>
          <div className="g-5" style={{ position: 'relative' }}>
            <span aria-hidden="true" className="hide-m" style={{ position: 'absolute', left: 32, right: '10%', top: 32, height: 1, backgroundImage: 'linear-gradient(90deg, var(--green-lt) 50%, transparent 50%)', backgroundSize: '8px 1px', opacity: 0.6 }} />
            {STEPS.map(([n, t, k, d], i) => (
              <div key={n}>
                <div className="serif" style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', border: i === 1 ? 0 : '1.5px solid var(--green)', background: i === 1 ? 'var(--green-lt)' : i === 4 ? 'var(--green-lt)' : 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontStyle: 'italic', color: i === 1 || i === 4 ? 'var(--ink)' : 'var(--green-lt)' }}>{n}</div>
                <p className="serif" style={{ margin: '28px 0 8px', fontSize: 24 }}>{t}</p>
                <p className="mono" style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--green-lt)', letterSpacing: '0.08em' }}>{k}</p>
                <p style={{ margin: 0, color: 'var(--on-dark-2)', fontSize: 15 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap g-2" style={{ alignItems: 'start' }}>
          <div>
            <p className="kicker">§ 05 · Por qué nosotros</p>
            <p className="serif" style={{ margin: 0, fontSize: 'clamp(44px, 6vw, 76px)', lineHeight: 0.98, fontWeight: 320, letterSpacing: '-0.035em' }}>“No vendemos esperanza. Vendemos un <em className="accent">expediente</em> bien hecho.”</p>
            <div style={{ marginTop: 32 }}><Certia dark={false} h={24} /></div>
          </div>
          <div style={{ borderTop: '1px solid color-mix(in srgb, var(--ink) 20%, transparent)' }}>
            {[['Respaldo de Certia Group', 'Estructura corporativa, equipo legal y apoyo societario para tus planes en Europa.'], ['Abogados especialistas por país', 'Cada caso lo lleva quien conoce ese consulado y esa ley.'], ['Precio cerrado, por escrito', 'Sabes desde el día uno qué pagas, qué incluye y qué no.'], ['Tu caso, en tu teléfono', 'Portal del cliente con estado, documentos y pagos, y avisos por WhatsApp.']].map(([t, d], i) => (
              <div key={t} style={{ display: 'flex', gap: 24, padding: '26px 0', borderBottom: '1px solid color-mix(in srgb, var(--ink) 20%, transparent)' }}><span className="mono accent" style={{ fontSize: 13, paddingTop: 4 }}>0{i + 1}</span><div><p className="serif" style={{ margin: '0 0 6px', fontSize: 24 }}>{t}</p><p style={{ margin: 0, color: 'var(--muted)', fontSize: 15 }}>{d}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section id="tarifas" className="sand section">
        <div className="wrap g-2" style={{ alignItems: 'start' }}>
          <div>
            <p className="kicker">§ 06 · Tarifas transparentes</p>
            <h2 className="h2">Toda consulta tiene precio. <em>Y ese precio vuelve a ti.</em></h2>
            <p className="lede">Si contratas el servicio en los 30 días siguientes, descontamos el importe de la consulta.</p>
            <Link className="btn btn-ink" href="/tarifas" style={{ marginTop: 36 }}>Ver todas las tarifas</Link>
          </div>
          <div style={{ background: 'var(--paper)', borderRadius: 4, padding: '12px 36px' }}>
            {[['Consulta exprés por escrito', 'Una pregunta, respuesta del abogado en 48 h', '$35', 'expres'], ['Consulta inicial', '30 min por videollamada · descontable', '$60', 'inicial'], ['Consulta de estrategia', '60 min + informe de viabilidad · descontable', '$120', 'estrategia'], ['Revisión documental', 'Hasta 10 documentos + informe · descontable', '$150', 'revision']].map(([t, d, p, id], i) => (
              <Link key={id} href={`/agendar?tipo=${id}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'center', padding: '26px 0', borderBottom: i < 3 ? '1px solid color-mix(in srgb, var(--ink) 15%, transparent)' : 0, textDecoration: 'none', color: 'var(--ink)' }}>
                <div><p className="serif" style={{ margin: 0, fontSize: 24 }}>{t}</p><p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 14 }}>{d}</p></div>
                <p className="serif" style={{ margin: 0, fontSize: 32, whiteSpace: 'nowrap' }}>{p}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, flexWrap: 'wrap', marginBottom: 48 }}>
            <div><p className="kicker">§ 07 · Blog</p><h2 className="h2">Del <em>Archivo</em></h2></div>
            <Link href="/blog" style={{ fontWeight: 500 }}>Ir al blog →</Link>
          </div>
          <div className="g-3">
            {POSTS.slice(0, 3).map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card-lift" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
                <PostCover p={p} img={blogImgs[p.slug]} height={240} word={64} />
                <p className="mono accent" style={{ margin: '20px 0 8px', fontSize: 12, letterSpacing: '0.1em' }}>{p.catLabel}</p>
                <p className="serif" style={{ margin: 0, fontSize: 24, lineHeight: 1.2 }}>{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 120 }}>
        <div className="wrap g-2" style={{ alignItems: 'start' }}>
          <div><p className="kicker">§ 08 · Preguntas</p><h2 className="h2">Lo que todos preguntan</h2></div>
          <Faq items={FAQS} size={23} />
        </div>
      </section>

      <ContactSection kicker="¿PREFIERES QUE TE ESCRIBAMOS?" title={<>Cuéntanos tu caso. <em>Te respondemos en minutos.</em></>} lede="Diana te escribe por WhatsApp al instante con tu número de caso. Si tu caso necesita un abogado, te enviamos el enlace para agendar la consulta adecuada, con su precio." page="/" />

      <section style={{ background: 'var(--green)', color: 'var(--paper)', padding: '144px 0 120px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" className="grid-bg" style={{ WebkitMaskImage: 'none', maskImage: 'none' }} />
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="serif" style={{ margin: 0, fontSize: 'clamp(52px, 8vw, 112px)', lineHeight: 0.95, fontWeight: 300, letterSpacing: '-0.04em', maxWidth: 1100 }}>Cada año que esperas, los consulados se llenan <em style={{ color: 'var(--ink)' }}>más</em>.</p>
          <div style={{ display: 'flex', gap: 20, marginTop: 56, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link className="btn btn-lg" href="/nacionalidad-espanola#evaluador" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>Empieza tu pre-evaluación <span className="arr" aria-hidden="true">→</span></Link>
            <span style={{ color: 'var(--paper)', opacity: 0.85, fontSize: 15 }}>Gratis, 2 minutos, sin compromiso.</span>
          </div>
        </div>
      </section>
      <Footer />
      <Diana topic="general" />
    </>
  );
}

function HeroArt() {
  const g = 'var(--green-lt)';
  return (
    <div aria-hidden="true" className="hide-m" style={{ position: 'relative', height: 620, minWidth: 0 }}>
      <div className="marks" style={{ inset: '0 -8px 8px 0' }} />
      <span className="meta" style={{ position: 'absolute', top: -2, left: 26, fontSize: 10, color: 'var(--on-dark-2)' }}>Fig. 01 — Expediente de nacionalidad</span>
      <span className="meta" style={{ position: 'absolute', bottom: -6, right: 4, fontSize: 10, color: 'var(--on-dark-2)' }}>Escala 1:1 · Caracas</span>

      {/* Pasaje del barco (1953), detrás de la partida */}
      <div style={{ position: 'absolute', right: -4, top: 26, width: 220, height: 96, background: 'var(--paper-3)', color: 'var(--ink)', borderRadius: 3, transform: 'rotate(-9deg)', boxShadow: '0 18px 30px color-mix(in srgb, var(--ink) 50%, transparent)', display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '12px 14px', borderRight: '1.5px dashed color-mix(in srgb, var(--ink) 35%, transparent)' }}>
          <div className="mono" style={{ fontSize: 8.5, letterSpacing: '0.16em', color: 'var(--green)' }}>PASAJE · 3.ª CLASE</div>
          <div className="serif" style={{ fontSize: 17, marginTop: 6, letterSpacing: '0.02em' }}>Vigo <span style={{ color: 'var(--green)' }}>→</span> La Guaira</div>
          <div className="mono" style={{ fontSize: 8.5, letterSpacing: '0.1em', marginTop: 6, color: 'var(--muted)' }}>VAPOR «SANTA MARÍA» · 1953</div>
        </div>
        <div className="mono" style={{ width: 42, display: 'grid', placeItems: 'center', fontSize: 9, letterSpacing: '0.2em', writingMode: 'vertical-rl', color: 'var(--muted)' }}>N.º 0417</div>
      </div>

      {/* Partida de nacimiento */}
      <div style={{ position: 'absolute', left: '6%', top: 92, width: '74%', height: 470, background: 'var(--paper)', borderRadius: 3, transform: 'rotate(4deg)', boxShadow: '0 30px 60px color-mix(in srgb, var(--ink) 55%, transparent)', padding: '34px 34px 34px 52px', color: 'var(--ink-80)', backgroundImage: 'linear-gradient(90deg, transparent 38px, color-mix(in srgb, var(--green) 55%, transparent) 38px, color-mix(in srgb, var(--green) 55%, transparent) 39px, transparent 39px), repeating-linear-gradient(transparent, transparent 37px, color-mix(in srgb, var(--ink) 11%, transparent) 37px, color-mix(in srgb, var(--ink) 11%, transparent) 38px)' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid color-mix(in srgb, var(--ink) 40%, transparent)', paddingBottom: 10 }}><span>REGISTRO CIVIL · LUGO</span><span>F. 214</span></div>
        <p className="serif" style={{ margin: '18px 0 6px', fontSize: 22, fontStyle: 'italic', color: 'var(--ink)' }}>Partida de nacimiento</p>
        <p style={{ margin: '14px 0 0', fontSize: 17, lineHeight: '38px', color: 'var(--ink-80)', fontFamily: "'Homemade Apple', cursive" }}>Manuel Ferreiro Castro,<br />nacido en San Xoán de Lugo<br />el catorce de marzo de<br />mil novecientos veintiuno.</p>
        <svg width="64" height="64" viewBox="0 0 64 64" style={{ position: 'absolute', right: 26, bottom: 26, opacity: 0.55 }}><circle cx="32" cy="32" r="29" fill="none" stroke="var(--ink)" strokeWidth="1" /><circle cx="32" cy="32" r="22" fill="none" stroke="var(--ink)" strokeWidth="0.6" strokeDasharray="1.5 2.5" /><text x="32" y="36" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1.5" fill="var(--ink)">R.C.</text></svg>
      </div>

      {/* Pasaporte (verde profundo, letras en verde claro) */}
      <div className="passport" style={{ position: 'absolute', left: '40%', top: 250, width: 236, height: 326, borderRadius: '10px 14px 14px 10px', background: 'linear-gradient(145deg, var(--green) 0%, var(--green-dk) 55%, var(--ink) 120%)', boxShadow: '0 40px 70px color-mix(in srgb, var(--ink) 65%, transparent), inset 7px 0 0 color-mix(in srgb, var(--ink) 30%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--paper) 10%, transparent)', color: g, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '30px 20px 26px', textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.24em' }}>UNIÓN EUROPEA</div>
        <div className="serif" style={{ fontSize: 26, letterSpacing: '0.12em', color: 'var(--paper)' }}>ESPAÑA</div>
        <svg width="78" height="78" viewBox="0 0 74 74"><circle cx="37" cy="37" r="33" fill="none" stroke={g} strokeWidth="1.2" /><circle cx="37" cy="37" r="26" fill="none" stroke={g} strokeWidth="0.6" strokeDasharray="2 3" /><path d="M37 16 L41 31 L56 31 L44 40 L48 55 L37 46 L26 55 L30 40 L18 31 L33 31 Z" fill="none" stroke={g} strokeWidth="1.1" /></svg>
        <div className="serif" style={{ fontSize: 19, letterSpacing: '0.3em' }}>PASAPORTE</div>
      </div>

      {/* Sello */}
      <div className="stamp" style={{ position: 'absolute', left: 0, top: 360, width: 178, height: 178 }}>
        <svg viewBox="0 0 200 200" width="178" height="178"><defs><path id="hs-c" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" /></defs><circle cx="100" cy="100" r="94" fill="color-mix(in srgb, var(--paper) 6%, transparent)" stroke={g} strokeWidth="5" /><circle cx="100" cy="100" r="56" fill="none" stroke={g} strokeWidth="2" /><text fontFamily="IBM Plex Mono, monospace" fontSize="15" letterSpacing="4" fill={g}><textPath href="#hs-c">TU DILIGENCIA LEGAL · CERTIA GROUP · </textPath></text><text x="100" y="76" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" letterSpacing="2" fill={g}>EXPEDIENTE</text><line x1="46" y1="86" x2="154" y2="86" stroke={g} strokeWidth="1.6" /><line x1="46" y1="114" x2="154" y2="114" stroke={g} strokeWidth="1.6" /><text x="100" y="107" textAnchor="middle" textLength="92" lengthAdjust="spacingAndGlyphs" fontFamily="Fraunces Variable, Fraunces, serif" fontSize="19" fontWeight="700" fill={g}>APROBADO</text><text x="100" y="131" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" letterSpacing="2" fill={g}>2026</text></svg>
      </div>

      {/* Anotaciones */}
      <span className="annot" style={{ left: -4, top: 36, ['--len' as string]: '36px' }}><b>1</b>Partida literal</span>
      <span className="annot" style={{ right: 232, top: 62, ['--len' as string]: '26px' }}><b>2</b>Pasaje · 1953</span>
      <span className="annot l" style={{ right: -6, top: 486, ['--len' as string]: '46px' }}>Pasaporte UE<b>3</b></span>
    </div>
  );
}
