import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return { name: 'Tu Diligencia Legal', short_name: 'Tu Diligencia', start_url: '/', display: 'standalone', background_color: '#F4EFE6', theme_color: '#0B1F33', lang: 'es', icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }] };
}
