'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postJSON } from '@/lib/client';

export function AdminLogin() {
  const [error, setError] = useState('');
  const router = useRouter();
  return (
    <form onSubmit={async (e) => { e.preventDefault(); const password = new FormData(e.currentTarget).get('password'); const { ok, data } = await postJSON<any>('/api/admin/login', { password }); if (ok) router.refresh(); else setError(data.error || 'Error'); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label className="lbl">Contraseña<input className="field" type="password" name="password" required autoComplete="current-password" /></label>
      {error && <p className="err">{error}</p>}
      <button className="btn btn-ink" type="submit">Entrar</button>
    </form>
  );
}

export function AdminLogout() {
  const router = useRouter();
  return <button type="button" className="btn btn-ghost" onClick={async () => { await fetch('/api/admin/login', { method: 'DELETE' }); router.refresh(); }}>Salir</button>;
}

export function AdminActions({ id, kind, status }: { id: number; kind: string; status: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const act = async (url: string, body: object, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true); await postJSON(url, body); setBusy(false); router.refresh();
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {kind === 'consulta' && status === 'pendiente_pago' && <button type="button" className="btn btn-green" disabled={busy} style={{ minHeight: 36, padding: '0 12px', fontSize: 13 }} onClick={() => act('/api/admin/confirm', { id }, '¿Confirmar que el pago llegó? Se enviará la confirmación al cliente por correo y WhatsApp.')}>Confirmar pago</button>}
      <select className="field" defaultValue="" disabled={busy} style={{ minHeight: 36, fontSize: 13 }} onChange={(e) => e.target.value && act('/api/admin/status', { id, status: e.target.value })}>
        <option value="">Cambiar estado…</option>
        {['contactado', 'cerrado', 'cancelado', 'nuevo'].map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}
