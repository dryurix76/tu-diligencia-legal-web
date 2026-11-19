'use client';

export async function postJSON<T = any>(url: string, body: unknown): Promise<{ ok: boolean; data: T }> {
  // Nunca dejamos al usuario esperando indefinidamente: a los 30 s cortamos y avisamos.
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal });
    const data = (await res.json().catch(() => ({ error: res.ok ? undefined : 'El servidor no respondió bien. Intenta de nuevo o escríbenos por WhatsApp.' }))) as T;
    return { ok: res.ok, data };
  } catch (e) {
    const timeout = (e as Error)?.name === 'AbortError';
    return { ok: false, data: { error: timeout ? 'La conexión tardó demasiado. Intenta de nuevo o escríbenos por WhatsApp.' : 'Sin conexión. Intenta de nuevo.' } as T };
  } finally {
    clearTimeout(t);
  }
}

export function formValues(form: HTMLFormElement): Record<string, string> {
  const out: Record<string, string> = {};
  new FormData(form).forEach((v, k) => { if (typeof v === 'string') out[k] = v.trim(); });
  return out;
}
