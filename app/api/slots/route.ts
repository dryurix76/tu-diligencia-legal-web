import { NextResponse } from 'next/server';
import { getSlots } from '@/lib/calcom';
import { calEventTypeId } from '@/lib/catalog';

export async function GET(req: Request) {
  const u = new URL(req.url);
  const consult = u.searchParams.get('consult') || 'inicial';
  const area = u.searchParams.get('area') || 'es';
  const tz = u.searchParams.get('tz') || 'America/Caracas';
  const eventTypeId = calEventTypeId(area, consult) ?? 0;
  const start = new Date(Date.now() + (consult === 'urgente' ? 2 : 20) * 3600e3);
  const end = new Date(start.getTime() + 12 * 864e5);
  try {
    const slots = await getSlots(eventTypeId, start.toISOString(), end.toISOString(), tz);
    const days = Object.entries(slots).filter(([, s]) => s.length).slice(0, 6).map(([date, s]) => ({ date, slots: s.map((x) => x.start) }));
    return NextResponse.json({ days, configured: eventTypeId > 0 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ days: [], error: 'No pudimos cargar la agenda.' }, { status: 502 });
  }
}
