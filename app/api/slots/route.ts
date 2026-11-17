import { NextResponse } from 'next/server';
import { getSlots } from '@/lib/calcom';
import { calEventTypeId } from '@/lib/catalog';

// Urgent consultations: only slots at least 2 hours from now, within the next 48 h.
// Other consultations: from 20 hours ahead, next 12 days.
export async function GET(req: Request) {
  const u = new URL(req.url);
  const consult = u.searchParams.get('consult') || 'inicial';
  const area = u.searchParams.get('area') || 'es';
  const tz = u.searchParams.get('tz') || 'America/Caracas';
  const urgent = consult === 'urgente';
  const eventTypeId = calEventTypeId(area, consult) ?? 0;
  const minStart = Date.now() + (urgent ? 2 : 20) * 3600e3;
  // Round up to the next quarter hour.
  const start = new Date(Math.ceil(minStart / 900e3) * 900e3);
  const end = new Date(start.getTime() + (urgent ? 2 : 12) * 864e5);
  try {
    const slots = await getSlots(eventTypeId, start.toISOString(), end.toISOString(), tz);
    const days = Object.entries(slots)
      .map(([date, s]) => ({ date, slots: s.map((x) => x.start).filter((iso) => new Date(iso).getTime() >= minStart && new Date(iso).getTime() <= end.getTime()) }))
      .filter((d) => d.slots.length)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, urgent ? 2 : 6);
    return NextResponse.json({ days, configured: eventTypeId > 0, minStart: new Date(minStart).toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ days: [], error: 'No pudimos cargar la agenda.' }, { status: 502 });
  }
}
