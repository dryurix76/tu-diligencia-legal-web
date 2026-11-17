import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/session';
import { setStatus, type Status } from '@/lib/db';

const OK: Status[] = ['nuevo', 'pendiente_pago', 'pagado', 'contactado', 'cerrado', 'cancelado'];

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { id, status } = await req.json().catch(() => ({}));
  if (!OK.includes(status)) return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
  await setStatus(Number(id), status, { [`${status}At`]: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
