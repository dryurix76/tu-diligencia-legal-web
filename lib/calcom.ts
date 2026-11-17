import { env, devLog } from './env';

// Cal.com API v2. Each lawyer has event types per consultation (see catalog.ts).
// Reminders 24 h / 1 h before are configured in Cal.com Workflows (email + WhatsApp/SMS).

const API = 'https://api.cal.com/v2';

export interface Slot { start: string }

export async function getSlots(eventTypeId: number, startISO: string, endISO: string, timeZone: string): Promise<Record<string, Slot[]>> {
  if (!env.calApiKey) {
    // Development fallback: plausible weekday slots so the booking UI can be tested.
    const out: Record<string, Slot[]> = {};
    const d = new Date(startISO);
    for (let i = 0; i < 10 && Object.keys(out).length < 5; i++) {
      const day = new Date(d.getTime() + i * 864e5);
      if (day.getUTCDay() === 0 || day.getUTCDay() === 6) continue;
      const key = day.toISOString().slice(0, 10);
      out[key] = [13, 14.5, 16, 19, 20.5, 22].map((h) => ({ start: `${key}T${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}:00.000Z` }));
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
