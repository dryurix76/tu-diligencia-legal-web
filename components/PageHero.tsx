import { Breadcrumbs } from './Seo';
import Header from './Header';

export default function PageHero({ crumb, path, a, b, lede, children }: { crumb: string; path: string; a: string; b: string; lede: string; children?: React.ReactNode }) {
  return (
    <section style={{ background: '#0B1F33', color: '#F4EFE6', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(244,239,230,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(244,239,230,0.04) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      <Header dark />
      <div className="wrap" style={{ position: 'relative', paddingTop: 64, paddingBottom: 88 }}>
        <Breadcrumbs items={[['Inicio', '/'], [crumb, path]]} />
        <h1 className="h1" style={{ maxWidth: 1000 }}>{a} <em style={{ color: '#E8D3AE' }}>{b}</em></h1>
        <p style={{ margin: '32px 0 0', maxWidth: 620, fontSize: 19, color: '#C9CFD6' }}>{lede}</p>
        {children}
      </div>
    </section>
  );
}
