import type { MetadataRoute } from 'next';
import { SERVICES } from '@/lib/services';
import { POSTS } from '@/lib/posts';
import { LANDINGS } from '@/lib/landings';
import { abs } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const e = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' = 'monthly', lastModified: Date = now) => ({ url: abs(path), lastModified, changeFrequency, priority });
  return [
    e('/', 1, 'weekly'),
    ...SERVICES.map((s) => e(`/${s.slug}`, s.slug === 'nacionalidad-espanola' ? 0.95 : 0.85, 'weekly')),
    ...LANDINGS.map((l) => e(`/${l.parent}/${l.slug}`, 0.8, 'monthly', new Date(l.reviewed))),
    e('/tarifas', 0.8), e('/becas', 0.7, 'monthly'), e('/ayuda', 0.7, 'weekly'), e('/blog', 0.7, 'weekly'), e('/agendar', 0.6), e('/contacto', 0.5), e('/nosotros', 0.5),
    ...POSTS.map((p) => e(`/blog/${p.slug}`, 0.6, 'monthly', new Date(p.date))),
    ...['aviso-legal', 'privacidad', 'cookies', 'terminos', 'reembolsos'].map((d) => e(`/legal/${d}`, 0.2)),
  ];
}
