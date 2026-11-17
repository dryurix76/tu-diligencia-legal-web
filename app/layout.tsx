import type { Metadata, Viewport } from 'next';
import { JsonLd } from '@/components/Seo';
import ScrollTop from '@/components/ScrollTop';
import Analytics from '@/components/Analytics';
import { organizationLd, websiteLd } from '@/lib/seo';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource-variable/inter-tight/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/homemade-apple/400.css';
import './globals.css';

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: 'Tu Diligencia Legal · Nacionalidad española y europea para venezolanos', template: '%s · Tu Diligencia Legal' },
  description: 'Abogados de extranjería para venezolanos: nacionalidad española, italiana y portuguesa, visados y residencias. Pre-evaluación gratuita en 2 minutos.',
  applicationName: 'Tu Diligencia Legal',
  openGraph: { type: 'website', locale: 'es_VE', siteName: 'Tu Diligencia Legal' },
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined, other: process.env.NEXT_PUBLIC_BING_VERIFICATION ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION } : undefined },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: '#0B1F33', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <JsonLd data={[organizationLd(), websiteLd()]} />
        {children}
        <ScrollTop />
        <Analytics />
      </body>
    </html>
  );
}
