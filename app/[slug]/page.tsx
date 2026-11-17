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
  const calcItems: [string, number][] = p.prices.map((r) => [r.name, Number(r.price.replace(/[^0-9]/g, '')) || 0] as [string, number]).filter(([, v]) => v > 0);

  return (
    <>
      <JsonLd data={[serviceLd(`/${p.slug}`, `${p.h1a} ${p.h1b}`, PAGE_SEO[`/${p.slug}`]?.description || p.lede, p.prices), faqLd(p.faqs)]} />
      <section style={{ background: p.bg, color: '#F4EFE6', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 12% 18%, rgba(255,255,255,0.07) 0, transparent 42%), radial-gradient(circle at 88% 92%, rgba(0,0,0,0.28) 0, transparent 50%)' }} />
        <Header dark ctaHref="#evaluador" ctaBg="#F4EFE6" ctaFg={p.bg} />
        {p.nat && (
          <nav className="wrap" aria-label="Otras nacionalidades" style={{ position: 'relative', display: 'flex', gap: 8, overflowX: 'auto', paddingTop: 8 }}>
            <span className="mono" style={{ fontSize: 11.5, letterSpacing: '0.14em', color: '#F0D9AE', alignSelf: 'center', marginRight: 8, whiteSpace: 'nowrap' }}>NACIONALIDAD</span>
            {NATS.map(([h, l, code]) => (
              <Link key={h} href={h} aria-current={code === p.topic ? 'page' : undefined} style={{ display: 'inline-flex', alignItems: 'center', minHeight: 40, padding: '0 16px', borderRadius: 999, textDecoration: 'none', fontSize: 14, whiteSpace: 'nowrap', ...(code === p.topic ? { background: '#F4EFE6', color: p.bg, fontWeight: 600 } : { color: '#F4EFE6', border: '1px solid rgba(244,239,230,0.3)' }) }}>{l}</Link>
            ))}
          </nav>
        )}
        <div className="wrap g-hero" style={{ position: 'relative', paddingTop: 56, paddingBottom: 88 }}>
          <div>
            <Breadcrumbs items={[['Inicio', '/'], [`${p.h1a} ${p.h1b}`, `/${p.slug}`]]} />
            <h1 className="h1">{p.h1a}<br /><em style={{ color: '#F0D9AE' }}>{p.h1b}</em></h1>
            <p style={{ margin: '36px 0 0', maxWidth: 580, fontSize: 19, color: '#EFE6DE' }}>{p.lede}</p>
            <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap', alignItems: 'center' }}>
              <a className="btn btn-lg" href="#evaluador" style={{ background: '#F4EFE6', color: p.bg }}>¿Calificas? Descúbrelo en 2 minutos</a>
              <a href="#precios" style={{ color: '#F4EFE6', fontWeight: 500, textUnderlineOffset: 6 }}>Ver tarifas y calcular</a>
            </div>
          </div>
          <div className="hero-art" aria-hidden={heroImg ? undefined : true} style={{ position: 'relative', height: 460, minWidth: 0 }}>
            {heroImg ? (
              <div style={{ position: 'absolute', inset: 0, borderRadius: 4, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.35)' }}>
                <Image src={heroImg} alt={`${p.h1a} ${p.h1b}: imagen ilustrativa`} fill priority sizes="(max-width: 980px) 100vw, 40vw" style={{ objectFit: 'cover' }} />
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 45%, ${p.bg}cc 100%)` }} />
              </div>
            ) : (
              <svg viewBox="0 0 420 460" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: p.motif }} />
            )}
            <div style={{ position: 'absolute', right: 0, bottom: 24, background: '#F4EFE6', color: '#0B1F33', padding: '22px 26px', borderRadius: 4, transform: 'rotate(3deg)', boxShadow: '0 24px 50px rgba(0,0,0,0.35)' }}>
              <p className="mono" style={{ margin: 0, fontSize: 11, letterSpacing: '0.14em', color: '#5E584E' }}>SERVICIO COMPLETO</p>
              <p className="serif" style={{ margin: '4px 0 0', fontSize: 40, lineHeight: 1 }}>desde <em>{p.from}</em></p>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#5E584E' }}>En 2 o 3 cuotas · tasas aparte</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="g-2" style={{ alignItems: 'end', marginBottom: 56 }}>
            <Html as="h2" className="h2" html={p.vias_title} />
            <p style={{ margin: 0, color: '#4E4A43', maxWidth: 460 }}>{p.vias_lede}</p>
          </div>
          <div className={n === 4 ? 'g-4' : 'g-3'}>
            {p.vias.map((v, i) => (
              <article key={v.title} className="card-lift" style={i === 0 ? { background: '#0B1F33', color: '#F4EFE6', borderRadius: 4, padding: 32, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 300 } : { background: '#fff', borderRadius: 4, padding: 32, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 300, border: '1px solid rgba(11,31,51,0.08)' }}>
                <span className="mono" style={{ fontSize: 13, color: i === 0 ? '#E8D3AE' : '#0B7A59' }}>0{i + 1}</span>
                <h3 className="serif" style={{ margin: 0, fontSize: 30, lineHeight: 1.05, fontWeight: 400 }}>{v.title}</h3>
                <p style={{ margin: 0, color: i === 0 ? '#C9CFD6' : '#5E584E', fontSize: 15 }}>{v.text}</p>
                {v.href && <Link href={v.href} style={{ fontSize: 15, fontWeight: 600, color: i === 0 ? '#3DD1A0' : '#0B7A59' }}>{v.href === '/becas' ? 'Te buscamos tu beca →' : 'Ver situación actual →'}</Link>}
                {v.tag && <span className="mono" style={i === 0 ? { marginTop: 'auto', fontSize: 11.5, letterSpacing: '0.1em', color: '#0B1F33', background: '#E8D3AE', alignSelf: 'flex-start', padding: '5px 9px', borderRadius: 2 } : { marginTop: 'auto', fontSize: 11.5, letterSpacing: '0.1em', color: '#0B7A59' }}>{v.tag}</span>}
              </article>
            ))}
          </div>
          <p className="mono" style={{ margin: '24px 0 0', fontSize: 12, color: '#5E584E' }}>Requisitos resumidos y orientativos. Tu abogado confirma la vía exacta en la consulta.</p>
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
            <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14, fontSize: 15, color: '#4E4A43' }}>
              {[['#12A37A', 'Verde: tu perfil parece viable'], ['#C98A12', 'Ámbar: viable, con puntos a revisar'], ['#A3312A', 'Rojo: esta vía no, pero te proponemos otra']].map(([c, t]) => (
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
                  {!last && <span style={{ position: 'absolute', left: 21, top: 44, bottom: 0, width: 1.5, background: 'rgba(11,31,51,0.18)' }} />}
                  <span className="serif" style={{ width: 44, height: 44, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', fontStyle: 'italic', ...(last ? { background: '#A3312A', color: '#fff' } : s.who === 'n' ? { background: '#0B1F33', color: '#F4EFE6' } : { border: '1.5px solid #0B1F33', background: '#F4EFE6' }) }}>{i + 1}</span>
                  <div>
                    <p className="serif" style={{ margin: '6px 0 4px', fontSize: 24 }}>{s.title}</p>
                    <p style={{ margin: '0 0 6px', color: '#5E584E', fontSize: 15 }}>{s.text}</p>
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
            <h2 className="h2">Lo que vas a <em style={{ color: '#E8D3AE' }}>necesitar</em>.</h2>
            <p style={{ margin: '28px 0 0', color: '#C9CFD6', maxWidth: 440 }}>Lista orientativa. La definitiva depende de tu vía y la recibes tras la consulta.</p>
            <div style={{ marginTop: 40, background: '#15293F', borderRadius: 8, padding: 28 }}>
              <p className="serif" style={{ margin: '0 0 6px', fontSize: 24 }}>Guía completa en PDF</p>
              <p style={{ margin: '0 0 18px', color: '#A9B2BE', fontSize: 15 }}>Checklist por vía, modelos y los errores que causan denegaciones.</p>
              <GuideForm service={p.service_name} />
            </div>
          </div>
          <div className="g-2" style={{ gap: 40 }}>
            {p.docs.map((d) => (
              <div key={d.head}>
                <p className="mono" style={{ margin: '0 0 18px', fontSize: 12, letterSpacing: '0.14em', color: '#C9B48C' }}>{d.head.toUpperCase()}</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16, fontSize: 16, color: '#E1E4E8' }}>
                  {d.items.map((it) => <li key={it} style={{ display: 'flex', gap: 12 }}><span aria-hidden="true" style={{ color: '#E8D3AE' }}>□</span>{it}</li>)}
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
          <div style={{ overflowX: 'auto', borderTop: '2px solid #0B1F33' }}>
            <table className="prices">
              <thead><tr className="mono" style={{ fontSize: 12, letterSpacing: '0.12em', color: '#5E584E', textAlign: 'left' }}><th style={{ padding: '18px 0', fontWeight: 500 }}>SERVICIO</th><th style={{ padding: '18px 0', fontWeight: 500 }}>INCLUYE</th><th style={{ padding: '18px 0', fontWeight: 500, textAlign: 'right' }}>DESDE</th></tr></thead>
              <tbody>
                {p.prices.map((r) => (
                  <tr key={r.name}>
                    <td className="serif" style={{ padding: '26px 24px 26px 0', fontSize: 24 }}>{r.name}</td>
                    <td style={{ padding: '26px 24px 26px 0', color: '#5E584E' }}>{r.includes}</td>
                    <td className="serif" style={{ padding: '26px 0', fontSize: 30, textAlign: 'right', whiteSpace: 'nowrap' }}>{r.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginTop: 24 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#5E584E' }}>Tasas oficiales, traducciones y apostillas aparte. 15% de descuento desde el segundo familiar. La consulta se descuenta si contratas en 30 días.</p>
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
                <Link key={g.slug} href={`/blog/${g.slug}`} className="card" style={{ padding: '22px 24px', textDecoration: 'none', color: '#0B1F33', background: '#fff' }}>
                  <span className="mono accent" style={{ fontSize: 11, letterSpacing: '0.12em' }}>{g.catLabel} · {g.mins} MIN</span>
                  <span className="serif" style={{ display: 'block', fontSize: 23, margin: '6px 0 6px', lineHeight: 1.15 }}>{g.title}</span>
                  <span style={{ fontSize: 15, color: '#5E584E' }}>{g.excerpt}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactSection kicker="¿PREFIERES QUE TE ESCRIBAMOS?" title={<>Cuéntanos tu caso. <em>Te respondemos en minutos.</em></>} lede="Diana te escribe por WhatsApp al instante con tu número de caso. Si tu consulta necesita un abogado, te enviamos el enlace para agendar la consulta adecuada, con su precio." service={p.service_name} page={`/${p.slug}`} />

      <section style={{ background: p.bg, color: '#F4EFE6', padding: '120px 0' }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 40, flexWrap: 'wrap' }}>
          <p className="h2" style={{ fontSize: 'clamp(44px, 7vw, 80px)', lineHeight: 0.95, fontWeight: 300, maxWidth: 820 }}>{p.close_a} <em style={{ color: '#F0D9AE' }}>{p.close_b}</em></p>
          <a className="btn btn-lg" href="#evaluador" style={{ background: '#F4EFE6', color: p.bg }}>Empezar mi evaluación</a>
        </div>
      </section>
      <Footer />
      <Diana topic={p.topic} />
    </>
  );
}
