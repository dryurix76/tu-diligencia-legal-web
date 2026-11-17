import type { Metadata } from 'next';
import fs from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import { POSTS } from '@/lib/posts';
import { pageMeta, articleLd, abs } from '@/lib/seo';
import { JsonLd, Breadcrumbs } from '@/components/Seo';

export function generateStaticParams() { return POSTS.map((p) => ({ slug: p.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  return p ? pageMeta(`/blog/${p.slug}`, { title: p.title, description: p.excerpt, type: 'article', image: abs(`/blog/${p.slug}/opengraph-image`) }) : {};
}

// Minimal Markdown: ## headings, paragraphs, - lists, **bold**, [links](url).
function md(src: string) {
  const inline = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[(.+?)\]\((\/[^)\s]*|https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>');
  return src.trim().split(/\n{2,}/).map((b) => {
    if (b.startsWith('## ')) return `<h2 class="serif" style="font-size:34px;font-weight:400;margin:48px 0 12px">${inline(b.slice(3))}</h2>`;
    if (b.split('\n').every((l) => l.startsWith('- '))) return `<ul>${b.split('\n').map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`;
    return `<p>${inline(b.replace(/\n/g, ' '))}</p>`;
  }).join('');
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  if (!p) notFound();
  const body = await fs.readFile(path.join(process.cwd(), 'content/blog', `${p.slug}.md`), 'utf8').catch(() => '');
  return (
    <>
      <div style={{ borderBottom: '1px solid rgba(11,31,51,0.15)' }}><Header dark={false} ctaBg="#0B7A59" ctaFg="#fff" ctaHref="/nacionalidad-espanola#evaluador" /></div>
      <article className="wrap" style={{ maxWidth: 820, paddingTop: 64, paddingBottom: 120 }}>
        <JsonLd data={articleLd(`/blog/${p.slug}`, p.title, p.excerpt, p.date, process.env.NEXT_PUBLIC_DEFAULT_AUTHOR || 'Equipo legal de Tu Diligencia Legal')} />
        <Breadcrumbs dark={false} items={[['Inicio', '/'], ['El Archivo', '/blog'], [p.title, `/blog/${p.slug}`]]} />
        <p className="mono accent" style={{ margin: '0 0 16px', fontSize: 12, letterSpacing: '0.14em' }}>{p.catLabel} · {p.mins} MIN · <time dateTime={p.date}>{new Date(p.date + 'T12:00:00').toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })}</time></p>
        <h1 className="h2" style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>{p.title}</h1>
        <p style={{ fontSize: 20, color: '#4E4A43', margin: '24px 0 40px' }}>{p.excerpt}</p>
        <div style={{ height: 320, borderRadius: 4, background: p.bg, display: 'flex', alignItems: 'flex-end', padding: 32, marginBottom: 48 }}><span className="serif" style={{ fontSize: 96, fontStyle: 'italic', color: p.fg, lineHeight: 0.85 }}>{p.word}</span></div>
        {body ? <div style={{ fontSize: 18, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: md(body) }} /> : <p style={{ background: '#EBE3D5', padding: 24, borderRadius: 8 }}>Este artículo está en revisión legal y se publicará pronto. Mientras tanto, pregúntale a Diana o haz la pre-evaluación gratuita.</p>}
        <div style={{ marginTop: 56, background: '#0B1F33', color: '#F4EFE6', borderRadius: 8, padding: 32 }}>
          <p className="serif" style={{ margin: '0 0 10px', fontSize: 28 }}>¿Quieres saber si tu caso califica?</p>
          <p style={{ margin: '0 0 20px', color: '#C9CFD6' }}>Pre-evaluación gratuita en 2 minutos, con semáforo de viabilidad.</p>
          <Link className="btn btn-mint" href="/nacionalidad-espanola#evaluador">Hacer la pre-evaluación</Link>
        </div>
      </article>
      <Footer />
      <Diana topic={p.cat === 'it' ? 'it' : p.cat === 'visas' ? 'visas' : 'es'} />
    </>
  );
}
