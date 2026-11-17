import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import BlogList from '@/components/BlogList';
import { GuideForm } from '@/components/Forms';
import { POSTS } from '@/lib/posts';

export const metadata: Metadata = pageMeta('/blog');

export default function Blog() {
  const f = POSTS[0];
  return (
    <>
      <div style={{ borderBottom: '1px solid rgba(11,31,51,0.15)' }}><Header dark={false} ctaBg="#0B7A59" ctaFg="#fff" ctaHref="/nacionalidad-espanola#evaluador" /></div>
      <section className="wrap" style={{ paddingTop: 56 }}>
        <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 12, letterSpacing: '0.14em', color: '#4E4A43', borderBottom: '2px solid #0B1F33', paddingBottom: 14 }}>
          <span>VOLUMEN I</span><span className="hide-m">NACIONALIDADES, VISADOS Y CAMBIOS DE LEY, EXPLICADOS POR ABOGADOS</span><span>EDICIÓN VENEZUELA</span>
        </div>
        <h1 className="serif" style={{ margin: 0, padding: '18px 0 10px', fontSize: 'clamp(84px, 15vw, 220px)', lineHeight: 0.88, fontWeight: 300, letterSpacing: '-0.055em', textAlign: 'center' }}>El <em className="accent">Archivo</em></h1>
      </section>
      <section className="wrap" style={{ paddingTop: 32, paddingBottom: 72 }}>
        <Link href={`/blog/${f.slug}`} className="g-hero" style={{ textDecoration: 'none', color: '#0B1F33', alignItems: 'center' }}>
          <div style={{ height: 460, borderRadius: 4, background: f.bg, display: 'flex', alignItems: 'flex-end', padding: 36 }}><span className="serif" style={{ fontSize: 'clamp(64px, 9vw, 120px)', fontStyle: 'italic', color: '#F0D9AE', lineHeight: 0.85, letterSpacing: '-0.04em' }}>{f.word}</span></div>
          <div>
            <p className="mono accent" style={{ margin: '0 0 16px', fontSize: 12, letterSpacing: '0.14em' }}>{f.catLabel} · {f.mins} MIN DE LECTURA</p>
            <h2 className="h2" style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}>{f.title}</h2>
            <p style={{ margin: '24px 0 0', color: '#4E4A43', fontSize: 18 }}>{f.excerpt}</p>
          </div>
        </Link>
      </section>
      <section className="wrap g-side" style={{ paddingBottom: 120 }}>
        <div><BlogList /></div>
        <aside style={{ background: '#0B1F33', color: '#F4EFE6', borderRadius: 6, padding: 32 }}>
          <p className="mono" style={{ margin: '0 0 12px', fontSize: 11.5, letterSpacing: '0.16em', color: '#C9B48C' }}>ALERTAS DE CAMBIOS DE LEY</p>
          <p className="serif" style={{ margin: '0 0 12px', fontSize: 30, lineHeight: 1.05 }}>Entérate antes de que el consulado se llene.</p>
          <p style={{ margin: '0 0 22px', color: '#A9B2BE', fontSize: 15 }}>Un aviso por correo cuando cambia una ley o se abren citas. Sin spam.</p>
          <GuideForm cta="Quiero las alertas" />
        </aside>
      </section>
      <Footer />
      <Diana topic="general" />
    </>
  );
}
