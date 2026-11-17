import { ogCard, OG_SIZE } from '@/lib/og';
import { POSTS } from '@/lib/posts';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'El Archivo · Tu Diligencia Legal';
export function generateStaticParams() { return POSTS.map((p) => ({ slug: p.slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  return ogCard({ kicker: p ? `El Archivo · ${p.catLabel}` : 'El Archivo', title: p?.title || 'El Archivo', bg: p?.bg && p.bg !== '#E3D6BE' && p.bg !== '#D9C7A5' ? p.bg : '#0B1F33' });
}
