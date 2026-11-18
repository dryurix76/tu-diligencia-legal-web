import { Breadcrumbs } from './Seo';
import Header from './Header';

export default function PageHero({ crumb, path, a, b, lede, children, code, file, facts }: { crumb: string; path: string; a: string; b: string; lede: string; children?: React.ReactNode; code?: string; file?: string; facts?: [string, string, string?][] }) {
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--paper)', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden="true" className="grid-bg" />
      <div aria-hidden="true" className="glow" style={{ width: 640, height: 640, right: -180, top: -120 }} />
      {code && <span aria-hidden="true" className="ghost-code hide-m" style={{ fontSize: 'clamp(220px, 28vw, 420px)', right: -20, bottom: -50 }}>{code}</span>}
      <Header dark />
      <div className="wrap" style={{ position: 'relative', paddingTop: 64, paddingBottom: facts ? 48 : 88 }}>
        <Breadcrumbs items={[['Inicio', '/'], [crumb, path]]} />
        <p className="meta" style={{ margin: '-8px 0 22px', fontSize: 10.5, color: 'var(--on-dark-2)', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {file && <><span style={{ color: 'var(--green-lt)' }}>{file}</span><span aria-hidden="true">·</span></>}
          <span className="live" style={{ padding: '3px 10px 3px 8px' }}><i />Revisado nov. 2026</span>
        </p>
        <h1 className="h1" style={{ maxWidth: 1000 }}>{a} <em style={{ color: 'var(--green-lt)' }}>{b}</em></h1>
        <p style={{ margin: '32px 0 0', maxWidth: 620, fontSize: 19, color: 'var(--on-dark)' }}>{lede}</p>
        {children}
      </div>
      {facts && (
        <div className="wrap" style={{ position: 'relative', paddingBottom: 56 }}>
          <div className="facts">
            {facts.map(([l, v, d], i) => (
              <div key={l}><span className="n">0{i + 1}</span><p className="l">{l}</p><p className="v">{v}</p>{d && <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--on-dark-2)' }}>{d}</p>}</div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
