import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LEGAL, CO } from '@/lib/legal';
import { pageMeta } from '@/lib/seo';
import CookieReset from '@/components/CookieReset';

export function generateStaticParams() { return Object.keys(LEGAL).map((doc) => ({ doc })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const doc = (await params).doc;
  const d = LEGAL[doc];
  return { ...pageMeta(`/legal/${doc}`), title: d?.title, description: d?.summary };
}

const NAV: [string, string][] = [['aviso-legal', 'Aviso legal'], ['privacidad', 'Privacidad'], ['cookies', 'Cookies'], ['terminos', 'Condiciones'], ['reembolsos', 'Reembolsos']];

export default async function Legal({ params }: { params: Promise<{ doc: string }> }) {
  const doc = (await params).doc;
  const d = LEGAL[doc];
  if (!d) notFound();
  return (
    <>
      <div style={{ background: '#0B1F33' }}><Header dark /></div>
      <section className="section"><div className="wrap" style={{ maxWidth: 860 }}>
        <nav aria-label="Documentos legales" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {NAV.map(([k, l]) => <Link key={k} href={`/legal/${k}`} className="chip" aria-current={k === doc ? 'page' : undefined} style={{ padding: '8px 14px', borderRadius: 999, fontSize: 14, textDecoration: 'none', border: '1.5px solid rgba(11,31,51,0.18)', background: k === doc ? '#0B1F33' : 'transparent', color: k === doc ? '#F4EFE6' : '#0B1F33' }}>{l}</Link>)}
        </nav>
        <h1 className="h2" style={{ marginBottom: 12 }}>{d.title}</h1>
        <p className="lede" style={{ marginBottom: 8 }}>{d.summary}</p>
        <p className="mono" style={{ fontSize: 12, letterSpacing: '0.1em', color: '#5E584E', marginBottom: 36 }}>ÚLTIMA ACTUALIZACIÓN: {CO.updated.toUpperCase()}</p>
        {d.sections.map((s) => (
          <section key={s.h} style={{ marginBottom: 30 }}>
            <h2 className="serif" style={{ fontSize: 24, fontWeight: 400, margin: '0 0 10px' }}>{s.h}</h2>
            {s.p.map((b, i) => Array.isArray(b)
              ? <ul key={i} style={{ margin: '0 0 12px', paddingLeft: 20, lineHeight: 1.65 }}>{b.map((x) => <li key={x} style={{ marginBottom: 6 }}>{x}</li>)}</ul>
              : <p key={i} style={{ margin: '0 0 12px', lineHeight: 1.65 }}>{b}</p>)}
          </section>
        ))}
        {doc === 'cookies' && <CookieReset />}
        <p style={{ marginTop: 40, fontSize: 14, color: '#5E584E' }}>¿Dudas sobre este documento? Escríbenos a <a href={`mailto:${CO.email}`}>{CO.email}</a>.</p>
      </div></section>
      <Footer />
    </>
  );
}
