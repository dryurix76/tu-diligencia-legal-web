import Link from 'next/link';
import { breadcrumbLd } from '@/lib/seo';

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

// Visible breadcrumbs + BreadcrumbList markup.
export function Breadcrumbs({ items, dark = true }: { items: [string, string][]; dark?: boolean }) {
  const color = dark ? '#F0D9AE' : '#5E584E';
  return (
    <>
      <JsonLd data={breadcrumbLd(items)} />
      <nav aria-label="Migas de pan">
        <ol className="mono" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, listStyle: 'none', padding: 0, margin: '0 0 28px', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color }}>
          {items.map(([name, path], i) => (
            <li key={path} style={{ display: 'flex', gap: 8 }}>
              {i > 0 && <span aria-hidden="true">/</span>}
              {i < items.length - 1 ? <Link href={path} style={{ color, textDecoration: 'none' }}>{name}</Link> : <span aria-current="page">{name}</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
