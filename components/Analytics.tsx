'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { captureAttribution } from '@/lib/track';

const GA = process.env.NEXT_PUBLIC_GA_ID || '';
const GADS = process.env.NEXT_PUBLIC_GADS_ID || '';
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
const TAG = GA || GADS;

type Choice = 'all' | 'necessary' | null;

export default function Analytics() {
  const [choice, setChoice] = useState<Choice>(null);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
    try { setChoice((localStorage.getItem('tdl_consent') as Choice) || null); } catch { /* ignore */ }
    setReady(true);
  }, []);

  useEffect(() => { captureAttribution(); }, [pathname]);

  const decide = (c: Exclude<Choice, null>) => {
    try { localStorage.setItem('tdl_consent', c); } catch { /* ignore */ }
    setChoice(c);
    const v = c === 'all' ? 'granted' : 'denied';
    window.gtag?.('consent', 'update', { ad_storage: v, analytics_storage: v, ad_user_data: v, ad_personalization: v });
  };

  return (
    <>
      {TAG && (
        <>
          <Script id="consent-default" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            var c = null; try { c = localStorage.getItem('tdl_consent'); } catch (e) {}
            var v = c === 'all' ? 'granted' : 'denied';
            gtag('consent', 'default', { ad_storage: v, analytics_storage: v, ad_user_data: v, ad_personalization: v, wait_for_update: 500 });
            gtag('set', 'url_passthrough', true);
            gtag('set', 'ads_data_redaction', v === 'denied');
            gtag('js', new Date());
            ${GA ? `gtag('config', '${GA}');` : ''}
            ${GADS ? `gtag('config', '${GADS}', { allow_enhanced_conversions: true });` : ''}
          `}</Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${TAG}`} strategy="afterInteractive" />
        </>
      )}
      {PIXEL && choice === 'all' && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL}'); fbq('track', 'PageView');
        `}</Script>
      )}
      {ready && choice === null && (TAG || PIXEL) && (
        <div role="dialog" aria-label="Preferencias de cookies" style={{ position: 'fixed', left: 16, bottom: 16, zIndex: 70, maxWidth: 440, background: '#fff', color: '#0B1F33', borderRadius: 14, boxShadow: '0 20px 60px rgba(7,20,35,0.3)', padding: 20, fontSize: 14.5 }}>
          <p style={{ margin: '0 0 14px' }}>Usamos cookies propias y de terceros para medir visitas y mejorar nuestros anuncios. Puedes aceptarlas o usar solo las necesarias. <Link href="/legal/cookies">Política de cookies</Link>.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-ink" onClick={() => decide('all')}>Aceptar todas</button>
            <button type="button" className="btn btn-ghost" onClick={() => decide('necessary')}>Solo necesarias</button>
          </div>
        </div>
      )}
    </>
  );
}
