// Ningún proveedor externo (CRM, correo, WhatsApp, base de datos) puede dejar
// un formulario colgado: cada llamada tiene un tiempo máximo.
export async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T | null> {
  let t: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([p, new Promise<null>((resolve) => { t = setTimeout(() => { console.error(`[timeout] ${label} tardó más de ${ms} ms`); resolve(null); }, ms); })]);
  } catch (e) {
    console.error(`[error] ${label}`, e);
    return null;
  } finally {
    if (t) clearTimeout(t);
  }
}

// Ejecuta cada paso por separado: si uno falla, los demás siguen.
export async function step(label: string, fn: () => Promise<unknown>, ms = 15000) {
  await withTimeout(fn(), ms, label);
}
