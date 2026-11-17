import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  trailingSlash: false,
  // PDF guides are read from disk by the signed download route.
  outputFileTracingIncludes: { '/descargas/[slug]': ['./content/guides/**'] },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async redirects() {
    // Common alternative URLs people (and old links) use → canonical pages.
    return [
      { source: '/nacionalidad', destination: '/nacionalidad-espanola', permanent: true },
      { source: '/espana', destination: '/nacionalidad-espanola', permanent: true },
      { source: '/italia', destination: '/nacionalidad-italiana', permanent: true },
      { source: '/portugal', destination: '/nacionalidad-portuguesa', permanent: true },
      { source: '/precios', destination: '/tarifas', permanent: true },
      { source: '/terminos', destination: '/legal/terminos', permanent: true },
      { source: '/privacidad', destination: '/legal/privacidad', permanent: true },
      { source: '/aviso-legal', destination: '/legal/aviso-legal', permanent: true },
      { source: '/cookies', destination: '/legal/cookies', permanent: true },
      { source: '/reembolsos', destination: '/legal/reembolsos', permanent: true },
      { source: '/faq', destination: '/ayuda', permanent: true },
      { source: '/preguntas-frecuentes', destination: '/ayuda', permanent: true },
    ];
  },
};

export default nextConfig;
