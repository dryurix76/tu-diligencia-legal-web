import Link from 'next/link';
import { Lockup, Certia } from './Brand';
import MobileMenu from './MobileMenu';

const NAV = [
  ['/nacionalidad-espanola', 'Nacionalidades'], ['/visados', 'Visados'], ['/becas', 'Becas'], ['/negocios', 'Negocios'], ['/caribe', 'Caribe'],
  ['/tarifas', 'Tarifas'], ['/blog', 'Blog'], ['/ayuda', 'Ayuda'],
];

export default function Header({ dark = true, ctaHref = '/agendar', ctaBg = '#3DD1A0', ctaFg = '#0B1F33' }: { dark?: boolean; ctaHref?: string; ctaBg?: string; ctaFg?: string }) {
  const color = dark ? '#F4EFE6' : '#0B1F33';
  return (
    <header className="wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 84, gap: 16, flexWrap: 'nowrap', color }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Lockup dark={dark} />
        <span className="hide-m hdr-certia" style={{ paddingLeft: 20, borderLeft: `1px solid ${dark ? 'rgba(244,239,230,0.25)' : 'rgba(11,31,51,0.2)'}` }}><Certia dark={dark} /></span>
      </span>
      <nav className="nav-links hide-m" aria-label="Principal">
        {NAV.map(([h, t]) => <Link key={h} href={h} className={h === '/caribe' || h === '/blog' ? 'nav-x' : h === '/negocios' || h === '/ayuda' ? 'nav-y' : undefined}>{t}</Link>)}
      </nav>
      <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Link className={`btn hide-m ${dark ? 'btn-ghost-dark' : 'btn-ghost'}`} href="/mi-caso">Mi caso</Link>
        <Link className="btn hdr-cta" href={ctaHref} style={{ background: ctaBg, color: ctaFg }}>Evaluar mi caso</Link>
        <MobileMenu dark={dark} />
      </span>
    </header>
  );
}
