'use client';

export async function postJSON<T = any>(url: string, body: unknown): Promise<{ ok: boolean; data: T }> {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = (await res.json().catch(() => ({}))) as T;
    return { ok: res.ok, data };
  } catch {
    return { ok: false, data: { error: 'Sin conexión. Intenta de nuevo.' } as T };
  }
}

export function formValues(form: HTMLFormElement): Record<string, string> {
  const out: Record<string, string> = {};
  new FormData(form).forEach((v, k) => { if (typeof v === 'string') out[k] = v.trim(); });
  return out;
}
