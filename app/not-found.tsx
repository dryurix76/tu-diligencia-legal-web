import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <div style={{ background: 'var(--ink)' }}><Header dark /></div>
      <section className="section"><div className="wrap">
        <h1 className="h2">Este folio <em>no está en el archivo</em>.</h1>
        <p className="lede">La página que buscas no existe o cambió de lugar.</p>
        <Link className="btn btn-ink" href="/" style={{ marginTop: 24 }}>Volver al inicio</Link>
      </div></section>
      <Footer />
    </>
  );
}
