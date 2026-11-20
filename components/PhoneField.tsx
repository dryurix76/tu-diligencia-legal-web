'use client';

import { useMemo, useState } from 'react';
import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js/min';
import { COUNTRIES, TOP } from '@/lib/countries';

// Teléfono con selector de país (prefijo) y validación por país.
// Envía en el formulario un campo oculto `name` con el número internacional (+58 412 1234567),
// así que los formularios no necesitan unir prefijo y número.
const BY_ISO = new Map(COUNTRIES.map((c) => [c[0], c]));
const top = TOP.map((iso) => BY_ISO.get(iso)).filter(Boolean) as [string, string, string][];

export default function PhoneField({ name = 'phone', label = 'WhatsApp', required = true, defaultCountry = 'VE' }: { name?: string; label?: string; required?: boolean; defaultCountry?: string }) {
  const [iso, setIso] = useState(defaultCountry);
  const [num, setNum] = useState('');
  const [touched, setTouched] = useState(false);
  const dial = BY_ISO.get(iso)?.[2] || '58';

  const { full, valid } = useMemo(() => {
    const digits = num.replace(/[^\d]/g, '').replace(/^0+/, '');
    if (!digits) return { full: '', valid: false };
    const p = parsePhoneNumberFromString(digits, iso as CountryCode);
    return { full: p ? p.formatInternational() : `+${dial} ${digits}`, valid: !!p?.isValid() };
  }, [num, iso, dial]);

  const showError = touched && num.length > 0 && !valid;
  return (
    <div className="lbl" role="group" aria-label={label}>
      <span>{label}</span>
      <span style={{ display: 'flex', gap: 8 }}>
        {/* El select nativo (accesible, con buscador por teclado en todos los móviles) va invisible encima
            de una cajita compacta que muestra solo «VE +58». */}
        <span className="field" style={{ position: 'relative', width: 112, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, paddingRight: 12 }}>
          <span aria-hidden="true" style={{ display: 'flex', alignItems: 'baseline', gap: 6, whiteSpace: 'nowrap' }}><span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{iso}</span><span>+{dial}</span></span>
          <svg aria-hidden="true" width="10" height="6" viewBox="0 0 10 6" style={{ flex: 'none' }}><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          <select aria-label="País y prefijo telefónico" value={iso} onChange={(e) => setIso(e.target.value)} style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', font: 'inherit' }}>
            <optgroup label="Frecuentes">{top.map(([c, n, d]) => <option key={'t' + c} value={c}>{n} (+{d})</option>)}</optgroup>
            <optgroup label="Todos los países">{COUNTRIES.map(([c, n, d]) => <option key={c} value={c}>{n} (+{d})</option>)}</optgroup>
          </select>
        </span>
        <input className="field" type="tel" inputMode="tel" autoComplete="tel-national" required={required} value={num} onChange={(e) => setNum(e.target.value)} onBlur={() => setTouched(true)}
          aria-label={`${label}: número sin el prefijo`} aria-invalid={showError || undefined} placeholder={iso === 'VE' ? '412 000 0000' : 'Número'} style={{ flex: 1, minWidth: 0 }} />
      </span>
      {/* Número completo para el envío; si no valida, igual se envía para no perder el contacto. */}
      <input type="hidden" name={name} value={full} />
      <input type="hidden" name={`${name}_country`} value={iso} />
      {showError && <span style={{ fontSize: 13, color: 'var(--muted)' }}>Revisa el número: para {BY_ISO.get(iso)?.[1]} no parece completo.</span>}
    </div>
  );
}
