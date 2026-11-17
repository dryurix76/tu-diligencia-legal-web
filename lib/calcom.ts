import { env, devLog } from './env';

// Cal.com API v2. Each lawyer has event types per consultation (see catalog.ts).
// Reminders 24 h / 1 h before are configured in Cal.com Workflows (email + WhatsApp/SMS).

const API = 'https://api.cal.com/v2';

export interface Slot { start: string }

export async function getSlots(eventTypeId: number, startISO: string, endISO: string, timeZone: string): Promise<Record<string, Slot[]>> {
  if (!env.calApiKey) {
    // Development fallback: hourly slots 8:00–19:00 Caracas time (12:00–23:00 UTC), Monday to Saturday.
    const out: Record<string, Slot[]> = {};
    const from = new Date(startISO).getTime(), to = new Date(endISO).getTime();
    for (let t = Math.floor(from / 3600e3) * 3600e3; t <= to; t += 1800e3) {
      const d = new Date(t);
      const h = d.getUTCHours() + d.getUTCMinutes() / 60;
      if (t < from || d.getUTCDay() === 0 || h < 12 || h > 23) continue;
      const key = d.toISOString().slice(0, 10);
      (out[key] = out[key] || []).push({ start: d.toISOString() });
    }
    return out;
  }
  const qs = new URLSearchParams({ eventTypeId: String(eventTypeId), start: startISO, end: endISO, timeZone });
  const res = await fetch(`${API}/slots?${qs}`, {
    headers: { Authorization: `Bearer ${env.calApiKey}`, 'cal-api-version': '2024-09-04' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Cal.com slots ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return (json.data || {}) as Record<string, Slot[]>;
}

export interface BookingInput {
  eventTypeId: number;
  start: string;
  name: string;
  email: string;
  phone?: string;
  timeZone: string;
  notes?: string;
  metadata?: Record<string, string>;
}

export async function createBooking(b: BookingInput): Promise<{ uid: string; meetingUrl?: string } | null> {
  if (!env.calApiKey) { devLog('calcom.createBooking', b); return { uid: 'dev-booking' }; }
  const res = await fetch(`${API}/bookings`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.calApiKey}`, 'cal-api-version': '2024-08-13', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventTypeId: b.eventTypeId,
      start: b.start,
      attendee: { name: b.name, email: b.email, timeZone: b.timeZone, language: 'es', ...(b.phone ? { phoneNumber: b.phone } : {}) },
      bookingFieldsResponses: b.notes ? { notes: b.notes } : undefined,
      metadata: b.metadata,
    }),
  });
  if (!res.ok) { console.error('Cal.com booking error', res.status, await res.text()); return null; }
  const json = await res.json();
  return { uid: json.data?.uid, meetingUrl: json.data?.meetingUrl || json.data?.location };
}

export async function upcomingBookings(email: string): Promise<{ title: string; start: string; meetingUrl?: string; uid: string }[]> {
  if (!env.calApiKey) return [];
  const qs = new URLSearchParams({ attendeeEmail: email, status: 'upcoming', take: '5' });
  const res = await fetch(`${API}/bookings?${qs}`, {
    headers: { Authorization: `Bearer ${env.calApiKey}`, 'cal-api-version': '2024-08-13' }, cache: 'no-store',
  });
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data || []).map((b: any) => ({ title: b.title, start: b.start, meetingUrl: b.meetingUrl || b.location, uid: b.uid }));
}
