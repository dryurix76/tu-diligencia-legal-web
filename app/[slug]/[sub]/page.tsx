import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import Faq from '@/components/Faq';
import { ContactSection } from '@/components/Forms';
import { JsonLd, Breadcrumbs } from '@/components/Seo';
import { LANDINGS, getLanding } from '@/lib/landings';
import { getService } from '@/lib/services';
import { pageMeta, faqLd, serviceLd, abs } from '@/lib/seo';

export function generateStaticParams() { return LANDINGS.map((l) => ({ slug: l.parent, sub: l.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string; sub: string }> }): Promise<Metadata> {
  const { slug, sub } = await params;
  const l = getLanding(slug, sub);
  return l ? pageMeta(`/${slug}/${sub}`, { title: l.title, description: l.description, image: abs(`/${slug}/opengraph-image`) }) : {};
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string; sub: string }> }) {
  const { slug, sub } = await params;
  const l = getLanding(slug, sub);
  const parent = getService(slug);
  if (!l || !parent) notFound();
  const path = `/${slug}/${sub}`;
  const siblings = LANDINGS.filter((x) => x.parent === slug && x.slug !== sub);
  const list = (items: string[], dark = false) => (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map((it) => <li key={it} style={{ display: 'flex', gap: 12 }}><span aria-hidden="true" style={{ color: dark ? '#E8D3AE' : '#0B7A59' }}>—</span><span>{it}</span></li>)}
    </ul>
  );

  return (
    <>
      <JsonLd data={[faqLd(l.faqs), serviceLd(path, l.title, l.description, [{ name: l.title, includes: 'Expediente completo', price: l.from }])]} />
      <section style={{ background: parent.bg, color: '#F4EFE6', position: 'relative', overflow: 'hidden' }}>
        <Header dark ctaHref={`/${slug}#evaluador`} ctaBg="#F4EFE6" ctaFg={parent.bg} />
        <div className="wrap" style={{ position: 'relative', paddingTop: 48, paddingBottom: 88 }}>
          <Breadcrumbs items={[['Inicio', '/'], [`${parent.h1a} ${parent.h1b}`, `/${slug}`], [l.navLabel, path]]} />
          <h1 className="h1">{l.h1a} <em style={{ color: '#F0D9AE' }}>{l.h1b}</em></h1>
          <p style={{ margin: '32px 0 0', maxWidth: 640, fontSize: 19, color: '#EFE6DE' }}>{l.lede}</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link className="btn btn-lg" href={`/${slug}#evaluador`} style={{ background: '#F4EFE6', color: parent.bg }}>¿Calificas? Descúbrelo en 2 minutos</Link>
            <span style={{ color: '#F0D9AE' }}>Servicio completo desde <strong>{l.from}</strong></span>
          </div>
          <p className="mono" style={{ margin: '32px 0 0', fontSize: 12, color: '#F0D9AE', opacity: 0.85 }}>Información revisada por nuestro equipo legal el {new Date(l.reviewed + 'T12:00:00').toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap g-3" style={{ alignItems: 'start', gap: 48 }}>
          <div><h2 className="serif" style={{ margin: '0 0 20px', fontSize: 32, fontWeight: 400 }}>¿Quién puede?</h2>{list(l.who)}</div>
          <div><h2 className="serif" style={{ margin: '0 0 20px', fontSize: 32, fontWeight: 400 }}>Requisitos clave</h2>{list(l.reqs)}</div>
          <div style={{ background: '#0B1F33', color: '#E1E4E8', borderRadius: 8, padding: 32 }}><h2 className="serif" style={{ margin: '0 0 20px', fontSize: 32, fontWeight: 400, color: '#F4EFE6' }}>Documentos</h2>{list(l.docs, true)}</div>
        </div>
      </section>

      <section className="sand section">
        <div className="wrap g-2" style={{ alignItems: 'start' }}>
          <div>
            <h2 className="h2">Cómo lo <em className="accent">hacemos</em></h2>
            <ol style={{ margin: '32px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {l.steps.map((s, i) => <li key={s} style={{ display: 'flex', gap: 18 }}><span className="serif" style={{ width: 40, height: 40, borderRadius: '50%', background: '#0B1F33', color: '#F4EFE6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', fontStyle: 'italic' }}>{i + 1}</span><span style={{ paddingTop: 8 }}>{s}</span></li>)}
            </ol>
            <div style={{ display: 'flex', gap: 10, marginTop: 36, flexWrap: 'wrap' }}>
              <Link className="btn btn-green" href={`/${slug}#evaluador`}>Hacer la pre-evaluación</Link>
              <Link className="btn btn-ghost" href="/agendar?tipo=inicial">Consulta inicial · USD 60</Link>
            </div>
          </div>
          <div>
            <h2 className="h2" style={{ marginBottom: 24 }}>Preguntas frecuentes</h2>
            <Faq items={l.faqs} />
            <p style={{ marginTop: 32, fontSize: 15 }}>Otras vías: {siblings.map((s, i) => <span key={s.slug}>{i > 0 && ' · '}<Link href={`/${slug}/${s.slug}`}>{s.navLabel}</Link></span>)} · <Link href={`/${slug}`}>Todas las vías de la {parent.h1a.toLowerCase()} {parent.h1b}</Link></p>
          </div>
        </div>
      </section>

      <ContactSection kicker="¿PREFIERES QUE TE ESCRIBAMOS?" title={<>Cuéntanos tu caso. <em>Te respondemos en minutos.</em></>} lede="Diana te escribe por WhatsApp al instante con tu número de caso. Si tu consulta necesita un abogado, te enviamos el enlace para agendar." service={parent.service_name} page={path} />
      <Footer />
      <Diana topic={l.topic} />
    </>
  );
}
