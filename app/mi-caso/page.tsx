import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import Portal from '@/components/Portal';

export const metadata: Metadata = pageMeta('/mi-caso', { title: 'Mi caso', description: 'Portal del cliente', noindex: true });

export default async function MiCaso({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const sp = await searchParams;
  return (
    <>
      <div style={{ background: '#0B1F33' }}><Header dark /></div>
      <Portal linkError={sp.error === 'enlace'} />
      <Footer />
      <Diana topic="cliente" />
    </>
  );
}
