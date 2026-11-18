import Link from 'next/link';

export const CERTIA_DARK = '/certia-dark.png';
export const CERTIA_LIGHT = '/certia-light.png';

export function Mark({ dark = true, size = 46 }: { dark?: boolean; size?: number }) {
  const fg = dark ? 'var(--paper)' : 'var(--ink)';
  const ring = dark ? 'var(--green-lt)' : 'var(--ink)';
  const dot = dark ? 'var(--green-lt)' : 'var(--green)';
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="none" stroke={fg} strokeWidth="3" />
      <circle cx="60" cy="60" r="47" fill="none" stroke={ring} strokeWidth="1.2" strokeDasharray="2 3.5" />
      <text x="55" y="80" textAnchor="middle" fontFamily="Fraunces Variable, Fraunces, serif" fontStyle="italic" fontWeight="300" fontSize="62" fill={fg}>d</text>
      <circle cx="83" cy="76" r="6" fill={dot} />
    </svg>
  );
}

export function Lockup({ dark = true, size = 46, fs = 25 }: { dark?: boolean; size?: number; fs?: number }) {
  return (
    <Link href="/" aria-label="Tu Diligencia Legal, inicio" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: dark ? 'var(--paper)' : 'var(--ink)' }}>
      <Mark dark={dark} size={size} />
      <span className="serif" style={{ fontSize: fs, lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 380, whiteSpace: 'nowrap' }}>
        Tu Diligencia <em style={{ fontWeight: 300, color: dark ? 'var(--green-lt)' : 'var(--green)' }}>Legal</em>
      </span>
    </Link>
  );
}

export const CERTIA_URL = process.env.NEXT_PUBLIC_CERTIA_URL || 'https://certia.group';

export function Certia({ dark = true, h = 18 }: { dark?: boolean; h?: number }) {
  return (
    <a href={CERTIA_URL} target="_blank" rel="noopener" aria-label="Certia Group (abre en una pestaña nueva)" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.14em', color: dark ? 'var(--on-dark-2)' : 'var(--muted)' }}>PARTE DE</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dark ? CERTIA_DARK : CERTIA_LIGHT} alt="Certia Group" style={{ height: h, width: 'auto', display: 'block' }} />
    </a>
  );
}
