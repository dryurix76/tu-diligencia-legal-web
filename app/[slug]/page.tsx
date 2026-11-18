import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import Evaluator from '@/components/Evaluator';
import { TREES } from '@/lib/evaluators';
import Faq from '@/components/Faq';
import Calculator from '@/components/Calculator';
import { GuideForm, ContactSection } from '@/components/Forms';
import { SERVICES, getService, NATS } from '@/lib/services';
import { pageMeta, serviceLd, faqLd, PAGE_SEO, abs } from '@/lib/seo';
import { JsonLd, Breadcrumbs } from '@/components/Seo';
import { LANDINGS } from '@/lib/landings';
import Image from 'next/image';
import fs from 'node:fs';
import path from 'node:path';
import { POSTS } from '@/lib/posts';
import { HERO_FACTS } from '@/lib/heroFacts';

// Focal point of each photo inside the landscape frame (objects sit low in the Portuguese one).
const HERO_POS: Record<string, string> = { 'nacionalidad-portuguesa': '50% 92%' };

const HERO_ALT: Record<string, string> = {
  'nacionalidad-espanola': 'Maleta antigua con una partida de nacimiento española, una foto de emigrantes en un barco y un pasaporte español',
  'nacionalidad-italiana': 'Cartas antiguas atadas, foto familiar frente a una casa de piedra, sello de un comune italiano y pasaporte europeo',
  'nacionalidad-portuguesa': 'Azulejo, pañuelo bordado de Madeira, foto antigua del puerto de Funchal, documento con lazo y pasaporte europeo junto a una ventana al Atlántico',
  'nacionalidad-alemana': 'Documento alemán antiguo con sello, gafas, pluma, edelweiss y pasaporte europeo sobre un escritorio',
  'nacionalidad-croata': 'Libro de registro antiguo, foto de un puerto dálmata, chal tejido y pasaporte europeo frente al Adriático',
  'nacionalidad-britanica': 'Partida de nacimiento británica antigua, sobre de correo aéreo, brújula y pasaporte británico',
};

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return pageMeta(`/${slug}`, { image: abs(`/${slug}/opengraph-image`) });
}

const Html = ({ html, as: Tag = 'span', ...rest }: { html: string; as?: any; [k: string]: any }) => <Tag {...rest} dangerouslySetInnerHTML={{ __html: html }} />;

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getService((await params).slug);
  if (!p) notFound();
  const n = p.vias.length;
  const subs = LANDINGS.filter((l) => l.parent === p.slug);
  // Optional hero photo: drop public/heroes/<slug>.webp (or .jpg/.png) and it replaces the line drawing.
  const heroImg = ['webp', 'jpg', 'png'].map((e) => `/heroes/${p.slug}.${e}`).find((f) => fs.existsSync(path.join(process.cwd(), 'public', f)));
  const postCat = p.slug === 'nacionalidad-espanola' ? 'es' : p.slug === 'nacionalidad-italiana' ? 'it' : ['visados', 'negocios', 'caribe'].includes(p.slug) ? 'visas' : 'otras';
  const guides = POSTS.filter((x) => x.cat === postCat || (postCat !== 'es' && x.slug === 'espana-o-italia')).slice(0, 4);
  const hf = HERO_FACTS[p.slug];
  const calcItems: [string, number][] = p.prices.map((r) => [r.name, Number(r.price.replace(/[^0-9]/g, '')) || 0] as [string, number]).filter(([, v]) => v > 0);

  return (
    <>
      <JsonLd data={[serviceLd(`/${p.slug}`, `${p.h1a} ${p.h1b}`, PAGE_SEO[`/${p.slug}`]?.description || p.lede, p.prices), faqLd(p.faqs)]} />
      <section style={{ background: 'var(--ink)', color: 'var(--paper)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" className="grid-bg" />
        <div aria-hidden="true" className="glow" style={{ width: 760, height: 760, right: -200, top: -60 }} />
        {hf && <span aria-hidden="true" className="ghost-code hide-m" style={{ fontSize: 'clamp(240px, 30vw, 460px)', right: -30, bottom: -110 }}>{hf.code}</span>}
        <Header dark ctaHref="#evaluador" />
        {p.nat && (
          <nav className="wrap" aria-label="Otras nacionalidades" style={{ position: 'relative', display: 'flex', gap: 8, overflowX: 'auto', paddingTop: 8, scrollbarWidth: 'none' }}>
            <span className="meta" style={{ fontSize: 11, color: 'var(--green-lt)', alignSelf: 'center', marginRight: 8, whiteSpace: 'nowrap' }}>Nacionalidad</span>
            {NATS.map(([h, l, code]) => (
              <Link key={h} href={h} aria-current={code === p.topic ? 'page' : undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '0 16px', borderRadius: 999, textDecoration: 'none', fontSize: 14, whiteSpace: 'nowrap', ...(code === p.topic ? { background: 'var(--green-lt)', color: 'var(--ink)', fontWeight: 600 } : { color: 'var(--paper)', border: '1px solid var(--line-dark)' }) }}>{code === p.topic && <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ink)' }} />}{l}</Link>
            ))}
          </nav>
        )}
        <div className="wrap g-hero" style={{ position: 'relative', paddingTop: 48, paddingBottom: 56 }}>
          <div>
            <Breadcrumbs items={[['Inicio', '/'], [`${p.h1a} ${p.h1b}`, `/${p.slug}`]]} />
            {hf && <p className="meta" style={{ margin: '-8px 0 22px', fontSize: 10.5, color: 'var(--on-dark-2)', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}><span style={{ color: 'var(--green-lt)' }}>Expediente {hf.file}</span><span aria-hidden="true">·</span><span className="live" style={{ padding: '3px 10px 3px 8px' }}><i />Revisado nov. 2026</span></p>}
            <h1 className="h1">{p.h1a}<br /><em style={{ color: 'var(--green-lt)' }}>{p.h1b}</em></h1>
            <p style={{ margin: '32px 0 0', maxWidth: 580, fontSize: 19, color: 'var(--on-dark)' }}>{p.lede}</p>
            <div style={{ display: 'flex', gap: 16, marginTop: 36, flexWrap: 'wrap', alignItems: 'center' }}>
              <a className="btn btn-mint btn-lg" href="#evaluador">¿Calificas? Descúbrelo en 2 minutos <span className="arr" aria-hidden="true">→</span></a>
              <a href="#precios" style={{ color: 'var(--paper)', fontWeight: 500 }}>Ver tarifas y calcular</a>
            </div>
            <ul className="ticks" style={{ marginTop: 28 }}>
              <li>Pre-evaluación gratis</li>
              <li>Abogado especialista</li>
              <li>Precio cerrado por escrito</li>
            </ul>
          </div>
          <div className="hero-art" aria-hidden={heroImg ? undefined : true} style={{ position: 'relative', height: 480, minWidth: 0 }}>
            {heroImg ? (
              <div className="hero-photo" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 100, borderRadius: 4, overflow: 'hidden', boxShadow: '0 30px 70px color-mix(in srgb, var(--ink) 70%, transparent), 0 0 0 1px var(--line-dark)' }}>
                <Image src={heroImg} alt={HERO_ALT[p.slug] || `${p.h1a} ${p.h1b}`} fill priority sizes="(max-width: 980px) 100vw, 40vw" style={{ objectFit: 'cover', objectPosition: HERO_POS[p.slug] || '50% 50%' }} />
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 62%, color-mix(in srgb, var(--ink) 55%, transparent) 100%)' }} />
                {hf && <span className="meta" style={{ position: 'absolute', left: 14, top: 12, fontSize: 10, color: 'var(--paper)', background: 'color-mix(in srgb, var(--ink) 55%, transparent)', padding: '4px 8px', borderRadius: 2, backdropFilter: 'blur(4px)' }}>Fig. — {hf.caption}</span>}
              </div>
            ) : (
              <svg viewBox="0 0 420 460" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: p.motif }} />
            )}
            <div className="marks hide-m" style={{ inset: heroImg ? '-12px -12px 88px -12px' : '-12px' }} />
            <div className={heroImg ? 'hero-price' : undefined} style={{ position: 'absolute', right: 0, bottom: heroImg ? 0 : 24, background: 'var(--paper)', color: 'var(--ink)', padding: '20px 26px 18px', borderRadius: 4, transform: 'rotate(2.5deg)', boxShadow: '0 24px 50px color-mix(in srgb, var(--ink) 60%, transparent)', borderTop: '3px solid var(--green)' }}>
              <p className="mono" style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--green)', display: 'flex', justifyContent: 'space-between', gap: 18 }}><span>SERVICIO COMPLETO</span>{hf && <span style={{ color: 'var(--muted)' }}>{hf.file}</span>}</p>
              <p className="serif" style={{ margin: '6px 0 0', fontSize: 40, lineHeight: 1 }}>desde <em style={{ color: 'var(--green)' }}>{p.from}</em></p>
              <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--muted)', borderTop: '1px dashed var(--line)', paddingTop: 8 }}>En 2 o 3 cuotas · tasas aparte</p>
            </div>
          </div>
        </div>
        {hf && (
          <div className="wrap" style={{ position: 'relative', paddingBottom: 56 }}>
            <div className="facts">
              {hf.facts.map(([l, v, d], i) => (
                <div key={l}><span className="n">0{i + 1}</span><p className="l">{l}</p><p className="v">{v}</p>{d && <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--on-dark-2)' }}>{d}</p>}</div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="section">
        <div className="wrap">
          <div className="g-2" style={{ alignItems: 'end', marginBottom: 56 }}>
            <Html as="h2" className="h2" html={p.vias_title} />
            <p style={{ margin: 0, color: 'var(--ink-80)', maxWidth: 460 }}>{p.vias_lede}</p>
          </div>
          <div className={n === 4 ? 'g-4' : 'g-3'}>
            {p.vias.map((v, i) => (
              <article key={v.title} className="card-lift" style={i === 0 ? { background: 'var(--ink)', color: 'var(--paper)', borderRadius: 4, padding: 32, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 300 } : { background: 'var(--card)', borderRadius: 4, padding: 32, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 300, border: '1px solid color-mix(in srgb, var(--ink) 8%, transparent)' }}>
                <span className="mono" style={{ fontSize: 13, color: i === 0 ? 'var(--green-lt)' : 'var(--green)' }}>0{i + 1}</span>
                <h3 className="serif" style={{ margin: 0, fontSize: 30, lineHeight: 1.05, fontWeight: 400 }}>{v.title}</h3>
                <p style={{ margin: 0, color: i === 0 ? 'var(--on-dark)' : 'var(--muted)', fontSize: 15 }}>{v.text}</p>
                {v.href && <Link href={v.href} style={{ fontSize: 15, fontWeight: 600, color: i === 0 ? 'var(--green-lt)' : 'var(--green)' }}>{v.href === '/becas' ? 'Te buscamos tu beca →' : 'Ver situación actual →'}</Link>}
                {v.tag && <span className="mono" style={i === 0 ? { marginTop: 'auto', fontSize: 11.5, letterSpacing: '0.1em', color: 'var(--ink)', background: 'var(--green-lt)', alignSelf: 'flex-start', padding: '5px 9px', borderRadius: 2 } : { marginTop: 'auto', fontSize: 11.5, letterSpacing: '0.1em', color: 'var(--green)' }}>{v.tag}</span>}
              </article>
            ))}
          </div>
          <p className="mono" style={{ margin: '24px 0 0', fontSize: 12, color: 'var(--muted)' }}>Requisitos resumidos y orientativos. Tu abogado confirma la vía exacta en la consulta.</p>
          {subs.length > 0 && (
            <nav aria-label="Guías por vía" style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {subs.map((l) => <Link key={l.slug} className="btn btn-ghost" href={`/${p.slug}/${l.slug}`}>{l.navLabel} →</Link>)}
            </nav>
          )}
        </div>
      </section>

      <section id="evaluador" className="sand section">
        <div className="wrap g-eval">
          <div>
            <p className="kicker">Pre-evaluación gratuita · 2 minutos</p>
            <Html as="h2" className="h2" html={p.eval_title} />
            <p className="lede">{TREES[p.slug] ? 'Entre 2 y 5 preguntas que se adaptan a tu historia. Te mostramos el semáforo, la vía probable, su base legal y lo que un abogado debe confirmar.' : `Responde ${p.questions.length} preguntas. Te mostramos un semáforo de viabilidad y el siguiente paso con su precio.`} Sin compromiso.</p>
            <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14, fontSize: 15, color: 'var(--ink-80)' }}>
              {[['var(--green)', 'Verde: tu perfil parece viable'], ['linear-gradient(90deg, var(--green) 50%, var(--ink) 50%)', 'Mixto: viable, con puntos a revisar'], ['var(--ink)', 'Tinta: esta vía no, pero te proponemos otra']].map(([c, t]) => (
                <div key={c} style={{ display: 'flex', gap: 14, alignItems: 'center' }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: c, flex: 'none' }} />{t}</div>
              ))}
            </div>
          </div>
          <Evaluator questions={p.questions} results={p.results} service={p.service_name} tree={TREES[p.slug]} />
        </div>
      </section>

      <section className="section">
        <div className="wrap g-2" style={{ alignItems: 'start' }}>
          <div>
            <h2 className="h2">Quién hace qué, <em className="accent">paso a paso</em>.</h2>
            <p className="lede">{p.steps_lede}</p>
          </div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {p.steps.map((s, i) => {
              const last = i === p.steps.length - 1;
              return (
                <li key={s.title} style={{ display: 'flex', gap: 28, paddingBottom: last ? 0 : 34, position: 'relative' }}>
                  {!last && <span style={{ position: 'absolute', left: 21, top: 44, bottom: 0, width: 1.5, background: 'color-mix(in srgb, var(--ink) 18%, transparent)' }} />}
                  <span className="serif" style={{ width: 44, height: 44, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', fontStyle: 'italic', ...(last ? { background: 'var(--green)', color: 'var(--card)' } : s.who === 'n' ? { background: 'var(--ink)', color: 'var(--paper)' } : { border: '1.5px solid var(--ink)', background: 'var(--paper)' }) }}>{i + 1}</span>
                  <div>
                    <p className="serif" style={{ margin: '6px 0 4px', fontSize: 24 }}>{s.title}</p>
                    <p style={{ margin: '0 0 6px', color: 'var(--muted)', fontSize: 15 }}>{s.text}</p>
                    <p className="mono accent" style={{ margin: 0, fontSize: 11.5, letterSpacing: '0.08em' }}>{s.who === 'n' ? 'LO HACEMOS NOSOTROS' : 'LO HACES TÚ, CON NUESTRA GUÍA'}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="dark section">
        <div className="wrap g-2" style={{ alignItems: 'start' }}>
          <div>
            <h2 className="h2">Lo que vas a <em style={{ color: 'var(--green-lt)' }}>necesitar</em>.</h2>
            <p style={{ margin: '28px 0 0', color: 'var(--on-dark)', maxWidth: 440 }}>Lista orientativa. La definitiva depende de tu vía y la recibes tras la consulta.</p>
            <div style={{ marginTop: 40, background: 'var(--ink-2)', borderRadius: 8, padding: 28 }}>
              <p className="serif" style={{ margin: '0 0 6px', fontSize: 24 }}>Guía completa en PDF</p>
              <p style={{ margin: '0 0 18px', color: 'var(--on-dark-2)', fontSize: 15 }}>Checklist por vía, modelos y los errores que causan denegaciones.</p>
              <GuideForm service={p.service_name} />
            </div>
          </div>
          <div className="g-2" style={{ gap: 40 }}>
            {p.docs.map((d) => (
              <div key={d.head}>
                <p className="mono" style={{ margin: '0 0 18px', fontSize: 12, letterSpacing: '0.14em', color: 'var(--green-lt)' }}>{d.head.toUpperCase()}</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16, fontSize: 16, color: 'var(--on-dark)' }}>
                  {d.items.map((it) => <li key={it} style={{ display: 'flex', gap: 12 }}><span aria-hidden="true" style={{ color: 'var(--green-lt)' }}>□</span>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="precios" className="section">
        <div className="wrap">
          <div className="g-eval" style={{ marginBottom: 64 }}>
            <div>
              <p className="kicker">Calculadora · {p.service_name}</p>
              <h2 className="h2">Precio cerrado. <em>Por escrito.</em></h2>
              <p className="lede">Elige el trámite, cuántos familiares y en cuántas cuotas. Solo ves los precios de {p.service_name.toLowerCase()}; el presupuesto final va por escrito tras la consulta.</p>
              <p style={{ margin: '20px 0 0', fontSize: 15 }}><Link href="/tarifas">Ver todas las tarifas →</Link></p>
            </div>
            <Calculator items={calcItems} title={p.service_name.toUpperCase()} />
          </div>
          <div style={{ overflowX: 'auto', borderTop: '2px solid var(--ink)' }}>
            <table className="prices">
              <thead><tr className="mono" style={{ fontSize: 12, letterSpacing: '0.12em', color: 'var(--muted)', textAlign: 'left' }}><th style={{ padding: '18px 0', fontWeight: 500 }}>SERVICIO</th><th style={{ padding: '18px 0', fontWeight: 500 }}>INCLUYE</th><th style={{ padding: '18px 0', fontWeight: 500, textAlign: 'right' }}>DESDE</th></tr></thead>
              <tbody>
                {p.prices.map((r) => (
                  <tr key={r.name}>
                    <td className="serif" style={{ padding: '26px 24px 26px 0', fontSize: 24 }}>{r.name}</td>
                    <td style={{ padding: '26px 24px 26px 0', color: 'var(--muted)' }}>{r.includes}</td>
                    <td className="serif" style={{ padding: '26px 0', fontSize: 30, textAlign: 'right', whiteSpace: 'nowrap' }}>{r.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginTop: 24 }}>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>Tasas oficiales, traducciones y apostillas aparte. 15% de descuento desde el segundo familiar. La consulta se descuenta si contratas en 30 días.</p>
            <Link href="/tarifas" style={{ fontWeight: 600 }}>Todas las tarifas →</Link>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 120 }}>
        <div className="wrap g-2" style={{ alignItems: 'start' }}>
          <div>
            <h2 className="h2">Preguntas frecuentes</h2>
            <p className="lede">¿No está tu pregunta? Diana responde al instante en la esquina inferior, o búscala en el <Link href="/ayuda">centro de respuestas</Link>.</p>
          </div>
          <Faq items={p.faqs} />
        </div>
      </section>

      {guides.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }} aria-label="Guías relacionadas">
          <div className="wrap">
            <p className="kicker">Guías del Archivo</p>
            <h2 className="h2" style={{ marginBottom: 32 }}>Lee antes de <em>decidir</em>.</h2>
            <div className="g-2" style={{ gap: 16 }}>
              {guides.map((g) => (
                <Link key={g.slug} href={`/blog/${g.slug}`} className="card" style={{ padding: '22px 24px', textDecoration: 'none', color: 'var(--ink)', background: 'var(--card)' }}>
                  <span className="mono accent" style={{ fontSize: 11, letterSpacing: '0.12em' }}>{g.catLabel} · {g.mins} MIN</span>
                  <span className="serif" style={{ display: 'block', fontSize: 23, margin: '6px 0 6px', lineHeight: 1.15 }}>{g.title}</span>
                  <span style={{ fontSize: 15, color: 'var(--muted)' }}>{g.excerpt}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactSection kicker="¿PREFIERES QUE TE ESCRIBAMOS?" title={<>Cuéntanos tu caso. <em>Te respondemos en minutos.</em></>} lede="Diana te escribe por WhatsApp al instante con tu número de caso. Si tu consulta necesita un abogado, te enviamos el enlace para agendar la consulta adecuada, con su precio." service={p.service_name} page={`/${p.slug}`} />

      <section style={{ background: 'var(--green)', color: 'var(--paper)', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" className="grid-bg" style={{ WebkitMaskImage: 'none', maskImage: 'none' }} />
        <div className="wrap" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 40, flexWrap: 'wrap' }}>
          <p className="h2" style={{ fontSize: 'clamp(44px, 7vw, 80px)', lineHeight: 0.95, fontWeight: 300, maxWidth: 820 }}>{p.close_a} <em style={{ color: 'var(--ink)' }}>{p.close_b}</em></p>
          <a className="btn btn-lg" href="#evaluador" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>Empezar mi evaluación <span className="arr" aria-hidden="true">→</span></a>
        </div>
      </section>
      <Footer />
      <Diana topic={p.topic} />
    </>
  );
}
