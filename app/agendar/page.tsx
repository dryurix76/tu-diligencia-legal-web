import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Diana from '@/components/Diana';
import Booking from '@/components/Booking';

export const metadata: Metadata = pageMeta('/agendar');

export default async function Agendar({ searchParams }: { searchParams: Promise<{ tipo?: string; cancelado?: string }> }) {
  const sp = await searchParams;
  return (
    <>
      <div style={{ background: 'var(--ink)' }}><Header dark ctaHref="/nacionalidad-espanola#evaluador" /></div>
      <Booking initialType={sp.tipo || 'inicial'} cancelled={sp.cancelado === '1'} />
      <Footer />
      <Diana topic="general" />
    </>
  );
}
