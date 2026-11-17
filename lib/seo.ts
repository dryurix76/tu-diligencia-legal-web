import type { Metadata } from 'next';

// Central SEO configuration: titles, descriptions, canonical URLs and schema.org JSON-LD.

export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  name: 'Tu Diligencia Legal',
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME || 'Tu Diligencia Legal',
  phone: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || '',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  // Public profiles that confirm the entity (Google Business Profile, LinkedIn, Instagram…). Comma-separated.
  sameAs: (process.env.NEXT_PUBLIC_SAME_AS || '').split(',').map((s) => s.trim()).filter(Boolean),
  parent: { name: 'Certia Group', url: process.env.NEXT_PUBLIC_CERTIA_URL || '' },
};

export const abs = (path = '/') => `${SITE.url}${path.startsWith('/') ? path : '/' + path}`;

// SEO titles (≤ 60 characters before the brand) and descriptions (≤ 155 characters).
export const PAGE_SEO: Record<string, { title: string; description: string }> = {
  '/': { title: 'Nacionalidad española y europea para venezolanos', description: 'Abogados de extranjería para venezolanos: nacionalidad española, italiana y portuguesa, visados y residencias. Pre-evaluación gratis en 2 minutos y precios públicos.' },
  '/nacionalidad-espanola': { title: 'Nacionalidad española para venezolanos: vías y precios', description: 'Ascendencia, residencia de 2 años, opción o carta de naturaleza. Descubre en 2 minutos qué vía te corresponde. Expediente completo desde USD 900.' },
  '/nacionalidad-italiana': { title: 'Ciudadanía italiana para venezolanos tras la reforma 2025', description: '¿Sigues calificando después de la reforma de 2025? Vía consular y judicial, búsqueda de actas en Italia. Evalúa tu línea familiar gratis.' },
  '/nacionalidad-portuguesa': { title: 'Nacionalidad portuguesa para venezolanos (hijos y nietos)', description: 'Nacionalidad portuguesa para hijos y nietos de portugueses y madeirenses en Venezuela. Búsqueda de registros y transcripciones. Desde USD 1.500.' },
  '/nacionalidad-alemana': { title: 'Ciudadanía alemana por descendencia para venezolanos', description: 'Declaración §5 StAG y restitución art. 116 para descendientes de alemanes. Alemania permite la doble nacionalidad. Análisis de tu caso.' },
  '/nacionalidad-croata': { title: 'Nacionalidad croata para descendientes de emigrantes', description: 'Pasaporte europeo para descendientes de croatas en Venezuela: búsqueda de registros en Croacia y solicitud completa. Evalúa tu caso gratis.' },
  '/nacionalidad-britanica': { title: 'Nacionalidad británica por descendencia: ¿ya lo eres?', description: 'Hijos de británicos nacidos en el extranjero y registro para hijos de madre británica antes de 1983. Análisis de elegibilidad para venezolanos.' },
  '/visados': { title: 'Visados para venezolanos: nómada digital, no lucrativa, D7', description: 'Visados y residencias en España, Portugal e Italia para venezolanos: nómada digital, no lucrativa, D7, estudios y arraigo. Elige el correcto.' },
  '/negocios': { title: 'Visa de emprendedor e inversor en Europa para venezolanos', description: 'Alternativas a la golden visa: visa de emprendedor, inversión en empresas, D2 de Portugal y traslado intraempresa, con apoyo societario de Certia.' },
  '/caribe': { title: 'Visas al Caribe para venezolanos: Dominicana, Panamá, Aruba', description: 'Visados de turismo, negocios y residencia en el Caribe para venezolanos. Verificamos requisitos vigentes antes de cada solicitud. Desde USD 250.' },
  '/tarifas': { title: 'Tarifas de abogados de extranjería: precios cerrados', description: 'Todas nuestras tarifas a la vista: consultas desde USD 35, nacionalidades, visados y servicios. Calculadora de presupuesto con cuotas.' },
  '/agendar': { title: 'Agendar consulta con abogado de extranjería', description: 'Elige consulta por escrito o videollamada, día y hora, y paga en línea con tarjeta, Zelle o Binance. Se descuenta si contratas el servicio.' },
  '/ayuda': { title: 'Preguntas sobre nacionalidad española, visados y pagos', description: 'Respuestas revisadas por abogados: requisitos, documentos, apostillas, plazos, precios y pagos desde Venezuela. Busca tu pregunta.' },
  '/contacto': { title: 'Contacto: WhatsApp, correo y formulario', description: 'Escríbenos por WhatsApp o formulario y recibe respuesta automática al instante con tu número de caso. Oficinas en Caracas y Madrid.' },
  '/nosotros': { title: 'Quiénes somos: abogados de extranjería de Certia Group', description: 'Tu Diligencia Legal es la consultora de derecho migratorio de Certia Group: precio cerrado, abogado responsable y expediente visible en línea.' },
  '/blog': { title: 'El Archivo: blog de nacionalidad y extranjería', description: 'Guías prácticas sobre nacionalidad española, italiana y portuguesa, visados y documentos venezolanos, escritas y revisadas por abogados.' },
};

export function pageMeta(path: string, override?: { title?: string; description?: string; image?: string; noindex?: boolean; type?: 'website' | 'article' }): Metadata {
  const s = PAGE_SEO[path] || { title: override?.title || SITE.name, description: override?.description || '' };
  const title = override?.title || s.title;
  const description = override?.description || s.description;
  return {
    title,
    description,
    alternates: { canonical: abs(path), languages: { es: abs(path), 'x-default': abs(path) } },
    openGraph: { type: override?.type || 'website', url: abs(path), title, description, siteName: SITE.name, locale: 'es_VE', images: [{ url: override?.image || abs('/opengraph-image'), width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [override?.image || abs('/opengraph-image')] },
    robots: override?.noindex ? { index: false, follow: true } : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  };
}

// ---------- JSON-LD builders ----------

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LegalService', 'Organization'],
    '@id': abs('/#organization'),
    name: SITE.name,
    legalName: SITE.legalName,
    url: abs('/'),
    logo: abs('/icon.svg'),
    image: abs('/opengraph-image'),
    description: 'Consultora de derecho migratorio para venezolanos: nacionalidad española, italiana, portuguesa, alemana, croata y británica, visados y residencias.',
    ...(SITE.email ? { email: SITE.email } : {}),
    ...(SITE.phone ? { telephone: SITE.phone } : {}),
    areaServed: ['VE', 'ES', 'CO', 'PA', 'US', 'CL', 'PE'].map((c) => ({ '@type': 'Country', name: c })),
    knowsLanguage: ['es', 'en', 'it'],
    priceRange: 'USD 35 – USD 4.500',
    parentOrganization: { '@type': 'Organization', name: SITE.parent.name, ...(SITE.parent.url ? { url: SITE.parent.url } : {}) },
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  };
}

export function websiteLd() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), name: SITE.name, inLanguage: 'es', publisher: { '@id': abs('/#organization') } };
}

export function breadcrumbLd(items: [string, string][]) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
  };
}

const usd = (s: string) => Number(String(s).replace(/[^\d]/g, '')) || undefined;

export function serviceLd(path: string, name: string, description: string, prices: { name: string; includes: string; price: string }[]) {
  return {
    '@context': 'https://schema.org', '@type': 'Service', '@id': abs(path + '#service'),
    name, description, serviceType: 'Asesoría en derecho migratorio', url: abs(path),
    provider: { '@id': abs('/#organization') },
    areaServed: { '@type': 'Country', name: 'VE' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name,
      itemListElement: prices.map((p) => ({ '@type': 'Offer', name: p.name, description: p.includes, priceCurrency: 'USD', ...(usd(p.price) ? { price: usd(p.price) } : {}), priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'USD', minPrice: usd(p.price) } })),
    },
  };
}

// FAQ rich results no longer show in Google (2026), but FAQPage markup still helps
// search engines and AI assistants understand the Q&A content.
export function faqLd(faqs: { q: string; a: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
}

export function articleLd(path: string, title: string, description: string, date: string, author: string, reviewer?: string) {
  return {
    '@context': 'https://schema.org', '@type': 'Article', headline: title, description, url: abs(path), mainEntityOfPage: abs(path),
    datePublished: date, dateModified: date, inLanguage: 'es', image: abs(path + '/opengraph-image'),
    author: { '@type': 'Person', name: author, worksFor: { '@id': abs('/#organization') } },
    ...(reviewer ? { reviewedBy: { '@type': 'Person', name: reviewer } } : {}),
    publisher: { '@id': abs('/#organization') },
  };
}
