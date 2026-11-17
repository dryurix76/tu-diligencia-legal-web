import { ogCard, OG_SIZE } from '@/lib/og';
import { SERVICES, getService } from '@/lib/services';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Tu Diligencia Legal';
export function generateStaticParams() { return SERVICES.map((s) => ({ slug: s.slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getService((await params).slug);
  return ogCard({ kicker: p ? `Desde ${p.from}` : 'Tu Diligencia Legal', title: p ? `${p.h1a} ${p.h1b} para venezolanos` : 'Tu Diligencia Legal', bg: p?.bg });
}
