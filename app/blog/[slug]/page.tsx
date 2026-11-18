import type { Metadata } from 'next';
import fs from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import { POSTS } from '@/lib/posts';
import { pageMeta, articleLd, faqLd, abs } from '@/lib/seo';
import ShareBar from '@/components/ShareBar';
import PostCover from '@/components/PostCover';
import { postImages } from '@/lib/postImages';
import { JsonLd, Breadcrumbs } from '@/components/Seo';

export function generateStaticParams() { return POSTS.map((p) => ({ slug: p.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  return p ? pageMeta(`/blog/${p.slug}`, { title: p.title, description: p.excerpt, type: 'article', image: abs(`/blog/${p.slug}/opengraph-image`) }) : {};
}

// Markdown subset: ## and ### headings, paragraphs, - and 1. lists, > callouts,
// **bold** and [links](url). Headings get ids for the table of contents.
const slugify = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const inline = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[(.+?)\]\((\/[^)\s]*|https?:\/\/[^)\s]+)\)/g, (_m, t, u) => u.startsWith('/') ? `<a href="${u}">${t}</a>` : `<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`);
function md(src: string) {
  const toc: [string, string][] = [];
  const html = src.trim().split(/\n{2,}/).map((b) => {
    if (b.startsWith('## ')) { const t = b.slice(3).trim(); const id = slugify(t); toc.push([id, t]); return `<h2 id="${id}" class="serif" style="font-size:clamp(28px,4vw,34px);font-weight:400;margin:56px 0 14px;scroll-margin-top:24px">${inline(t)}</h2>`; }
    if (b.startsWith('### ')) return `<h3 class="serif" style="font-size:24px;font-weight:400;margin:32px 0 8px">${inline(b.slice(4))}</h3>`;
    if (b.startsWith('> ')) return `<aside style="border-left:4px solid #0B7A59;background:#EBE3D5;padding:18px 22px;border-radius:4px;margin:28px 0">${inline(b.replace(/^> ?/gm, ' ').trim())}</aside>`;
    const lines = b.split('\n');
    if (lines.every((l) => l.startsWith('- '))) return `<ul style="padding-left:22px">${lines.map((l) => `<li style="margin-bottom:8px">${inline(l.slice(2))}</li>`).join('')}</ul>`;
    if (lines.every((l) => /^\d+\. /.test(l))) return `<ol style="padding-left:24px">${lines.map((l) => `<li style="margin-bottom:8px">${inline(l.replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`;
    return `<p>${inline(b.replace(/\n/g, ' '))}</p>`;
  }).join('');
  return { html, toc };
}
function faqsOf(src: string): { q: string; a: string }[] {
  const part = src.split('## Preguntas frecuentes')[1]?.split('\n## ')[0] || '';
  return part.split('### ').slice(1).map((c) => { const [q, ...rest] = c.trim().split('\n'); return { q: q.trim(), a: rest.join(' ').trim().replace(/\*\*/g, '') }; }).filter((f) => f.q && f.a);
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  if (!p) notFound();
  const body = await fs.readFile(path.join(process.cwd(), 'content/blog', `${p.slug}.md`), 'utf8').catch(() => '');
  const { html, toc } = body ? md(body) : { html: '', toc: [] as [string, string][] };
  const words = body.split(/\s+/).length;
  const mins = body ? Math.max(3, Math.round(words / 200)) : p.mins;
  const faqs = body ? faqsOf(body) : [];
  const url = abs(`/blog/${p.slug}`);
  const related = POSTS.filter((x) => x.slug !== p.slug && (x.cat === p.cat || x.cat === 'otras')).slice(0, 3);
  return (
    <>
      <div style={{ borderBottom: '1px solid rgba(11,31,51,0.15)' }}><Header dark={false} ctaBg="#0B7A59" ctaFg="#fff" ctaHref={p.slug.startsWith('visa-americana') ? '/visa-americana#evaluador' : p.cat === 'it' ? '/nacionalidad-italiana#evaluador' : p.cat === 'visas' ? '/visados#evaluador' : '/nacionalidad-espanola#evaluador'} /></div>
      <article className="wrap" style={{ maxWidth: 820, paddingTop: 64, paddingBottom: 120 }}>
        <JsonLd data={[articleLd(`/blog/${p.slug}`, p.title, p.excerpt, p.date, process.env.NEXT_PUBLIC_DEFAULT_AUTHOR || 'Equipo legal de Tu Diligencia Legal'), ...(faqs.length ? [faqLd(faqs)] : [])]} />
        <Breadcrumbs dark={false} items={[['Inicio', '/'], ['El Archivo', '/blog'], [p.title, `/blog/${p.slug}`]]} />
        <p className="mono accent" style={{ margin: '0 0 16px', fontSize: 12, letterSpacing: '0.14em' }}>{p.catLabel} · {mins} MIN DE LECTURA · ACTUALIZADO EL <time dateTime={p.date}>{new Date(p.date + 'T12:00:00').toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })}</time></p>
        <h1 className="h2" style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>{p.title}</h1>
        <p style={{ fontSize: 20, color: '#4E4A43', margin: '24px 0 28px' }}>{p.excerpt}</p>
        <div style={{ marginBottom: 40 }}><ShareBar url={url} title={p.title} compact /></div>
        <div style={{ marginBottom: 48 }}><PostCover p={p} img={postImages()[p.slug]} height="clamp(220px, 52vw, 420px)" word="clamp(60px, 16vw, 96px)" priority sizes="(max-width: 860px) 100vw, 820px" /></div>
        {toc.length > 3 && (
          <nav aria-label="En este artículo" style={{ border: '1px solid rgba(11,31,51,0.14)', borderRadius: 8, padding: '20px 24px', marginBottom: 40 }}>
            <p className="mono" style={{ margin: '0 0 10px', fontSize: 11.5, letterSpacing: '0.12em', color: '#5E584E' }}>EN ESTE ARTÍCULO</p>
            <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9, fontSize: 16 }}>{toc.map(([id, t]) => <li key={id}><a href={`#${id}`}>{t}</a></li>)}</ol>
          </nav>
        )}
        {body ? <div className="article-body" style={{ fontSize: 18, lineHeight: 1.75 }} dangerouslySetInnerHTML={{ __html: html }} /> : <p style={{ background: '#EBE3D5', padding: 24, borderRadius: 8 }}>Este artículo está en revisión legal y se publicará pronto. Mientras tanto, pregúntale a Diana o haz la pre-evaluación gratuita.</p>}
        <div style={{ marginTop: 56, padding: '24px 0', borderTop: '1px solid rgba(11,31,51,0.14)', borderBottom: '1px solid rgba(11,31,51,0.14)' }}>
          <p className="serif" style={{ margin: '0 0 14px', fontSize: 22 }}>¿Te sirvió? Compártelo con quien lo necesite.</p>
          <ShareBar url={url} title={p.title} />
        </div>
        <p style={{ marginTop: 24, fontSize: 14, color: '#5E584E' }}>Información orientativa revisada por el equipo legal de Tu Diligencia Legal a la fecha indicada. No sustituye el análisis de un abogado con tus documentos.</p>
        <div style={{ marginTop: 40, background: '#0B1F33', color: '#F4EFE6', borderRadius: 8, padding: 32 }}>
          <p className="serif" style={{ margin: '0 0 10px', fontSize: 28 }}>¿Quieres saber si tu caso califica?</p>
          <p style={{ margin: '0 0 20px', color: '#C9CFD6' }}>Pre-evaluación gratuita en 2 minutos, con semáforo de viabilidad.</p>
          <Link className="btn btn-mint" href={p.slug.startsWith('visa-americana') ? '/visa-americana#evaluador' : p.cat === 'it' ? '/nacionalidad-italiana#evaluador' : p.cat === 'visas' ? '/visados#evaluador' : '/nacionalidad-espanola#evaluador'}>Hacer la pre-evaluación</Link>
        </div>
        {related.length > 0 && (
          <section style={{ marginTop: 64 }} aria-label="Artículos relacionados">
            <p className="mono" style={{ margin: '0 0 14px', fontSize: 12, letterSpacing: '0.12em', color: '#5E584E' }}>SIGUE LEYENDO</p>
            <div style={{ display: 'grid', gap: 14 }}>{related.map((r) => <Link key={r.slug} href={`/blog/${r.slug}`} className="card" style={{ padding: '18px 22px', textDecoration: 'none', color: '#0B1F33', display: 'block' }}><span className="mono accent" style={{ fontSize: 11, letterSpacing: '0.12em' }}>{r.catLabel}</span><span className="serif" style={{ display: 'block', fontSize: 22, marginTop: 4 }}>{r.title}</span></Link>)}</div>
          </section>
        )}
      </article>
      <Footer />
      <Diana topic={p.cat === 'it' ? 'it' : p.cat === 'visas' ? 'visas' : 'es'} />
    </>
  );
}
