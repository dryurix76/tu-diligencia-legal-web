'use client';

import { useEffect, useState } from 'react';
import { track } from '@/lib/track';

type Net = { id: string; label: string; href: (u: string, t: string) => string; icon: React.ReactNode };
const I = (d: string) => <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d={d} fill="currentColor" /></svg>;

const NETS: Net[] = [
  { id: 'whatsapp', label: 'WhatsApp', href: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`, icon: I('M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z') },
  { id: 'telegram', label: 'Telegram', href: (u, t) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`, icon: I('M21.9 4.3 18.8 19c-.2 1-.8 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.2.3-.5.5-1 .5l.3-4.8 8.8-8c.4-.3-.1-.5-.6-.2L6.7 12.8 2 11.3c-1-.3-1-1 .2-1.5l18.3-7c.9-.3 1.6.2 1.4 1.5Z') },
  { id: 'facebook', label: 'Facebook', href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`, icon: I('M14 8V6.3c0-.8.2-1.3 1.4-1.3H17V2h-2.6C11.3 2 10 3.6 10 6.2V8H8v3h2v11h4V11h2.7l.4-3H14Z') },
  { id: 'x', label: 'X', href: (u, t) => `https://x.com/intent/post?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`, icon: I('M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z') },
  { id: 'linkedin', label: 'LinkedIn', href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`, icon: I('M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4V9.5Z') },
  { id: 'email', label: 'Correo', href: (u, t) => `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(`Te comparto este artículo de Tu Diligencia Legal: ${t}\n\n${u}`)}`, icon: I('M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2L4.4 7H4v.6l8 5.4 8-5.4V7h-.4L12 12.2Z') },
];

export default function ShareBar({ url, title, compact = false }: { url: string; title: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [native, setNative] = useState(false);
  useEffect(() => { setNative(typeof navigator !== 'undefined' && typeof navigator.share === 'function'); }, []);
  const btn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44, padding: compact ? '0 12px' : '0 16px', borderRadius: 999, border: '1.5px solid color-mix(in srgb, var(--ink) 16%, transparent)', background: 'var(--card)', color: 'var(--ink)', fontSize: 14, fontWeight: 500, textDecoration: 'none', cursor: 'pointer', font: 'inherit' };
  const done = (net: string) => track('share', { method: net, content_type: 'article', item_id: url });

  return (
    <div role="group" aria-label="Compartir este artículo" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <span className="mono" style={{ fontSize: 11.5, letterSpacing: '0.12em', color: 'var(--muted)', marginRight: 4 }}>COMPARTIR</span>
      {native && (
        <button type="button" style={{ ...btn, background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }} onClick={async () => { try { await navigator.share({ title, text: title, url }); done('native'); } catch { /* cancelled */ } }}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7a3 3 0 0 0 .1.8L8.4 11.2a3 3 0 1 0 0 3.6l6.7 3.4A3 3 0 1 0 18 16Z" fill="currentColor" /></svg>Compartir
        </button>
      )}
      {NETS.map((n) => (
        <a key={n.id} href={n.href(url, title)} target={n.id === 'email' ? undefined : '_blank'} rel="noopener noreferrer" style={btn} aria-label={`Compartir en ${n.label}`} onClick={() => done(n.id)}>
          {n.icon}{!compact && <span>{n.label}</span>}
        </a>
      ))}
      <button type="button" style={btn} onClick={async () => { try { await navigator.clipboard.writeText(url); setCopied(true); done('copy'); setTimeout(() => setCopied(false), 2200); } catch { /* ignore */ } }} aria-live="polite">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.5-3.5a3 3 0 0 1 4.2 4.2l-2.1 2.1a1 1 0 0 1-1.4-1.4l2.1-2.1a1 1 0 0 0-1.4-1.4L12 13.4a1 1 0 0 1-1.4 0Zm2.8-2.8a1 1 0 0 1 0 1.4l-3.5 3.5a3 3 0 0 1-4.2-4.2l2.1-2.1a1 1 0 0 1 1.4 1.4L7.1 12.7a1 1 0 0 0 1.4 1.4L12 10.6a1 1 0 0 1 1.4 0Z" fill="currentColor" /></svg>
        {copied ? '¡Enlace copiado!' : compact ? 'Copiar' : 'Copiar enlace'}
      </button>
    </div>
  );
}
