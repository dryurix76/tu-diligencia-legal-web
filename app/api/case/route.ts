import { NextResponse } from 'next/server';
import { currentEmail } from '@/lib/session';
import { findContactByEmail, latestDealForContact, clientNotes } from '@/lib/hubspot';
import { upcomingBookings } from '@/lib/calcom';
import { stripe } from '@/lib/stripe';
import { STAGE_LABELS, parseDocs } from '@/lib/portal';

export async function GET() {
  const email = await currentEmail();
  if (!email) return NextResponse.json({ auth: false }, { status: 401 });
  const contact = await findContactByEmail(email);
  if (!contact) return NextResponse.json({ auth: true, empty: true, email });

  const deal = await latestDealForContact(contact.id);
  // HUBSPOT_STAGE_ORDER: comma-separated deal stage IDs mapped, in order, to STAGE_LABELS.
  const order = (process.env.HUBSPOT_STAGE_ORDER || '').split(',').map((s) => s.trim());
  const stageIndex = Math.max(0, order.indexOf(deal?.properties.dealstage || ''));

  const docs = parseDocs(contact.properties.tdl_docs_json);

  const [bookings, notes] = await Promise.all([upcomingBookings(email), clientNotes(contact.id)]);

  let payments: { name: string; date: string; usd: number; status: string }[] = [];
  const st = stripe();
  if (st) {
    const sessions = await st.checkout.sessions.list({ customer_details: { email }, limit: 20 });
    payments = sessions.data.filter((s) => s.payment_status === 'paid').map((s) => ({
      name: s.metadata?.consult ? `Consulta (${s.metadata.consult})` : 'Pago',
      date: new Date(s.created * 1000).toISOString(), usd: (s.amount_total || 0) / 100, status: 'pagado',
    }));
  }

  return NextResponse.json({
    auth: true,
    name: contact.properties.firstname || '',
    caseId: contact.properties.tdl_case_id || '',
    service: contact.properties.tdl_service || '',
    deal: deal ? { name: deal.properties.dealname, stageIndex } : null,
    stages: STAGE_LABELS,
    docs, bookings, notes, payments,
  });
}
