import { env, devLog } from './env';

// HubSpot CRM v3. Requires a Private App token with scopes:
// crm.objects.contacts.read/write, crm.objects.deals.read/write, crm.objects.notes? (via contacts/deals write)
// Custom contact properties to create (see README): tdl_case_id, tdl_lead_score, tdl_lead_tier,
// tdl_service, tdl_timing, tdl_light, tdl_source, tdl_country, tdl_docs_json.

const API = 'https://api.hubapi.com';

async function hs<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(API + path, {
    ...init,
    headers: { Authorization: `Bearer ${env.hubspotToken}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`HubSpot ${path} ${res.status}: ${await res.text()}`);
  return (res.status === 204 ? (undefined as T) : await res.json()) as T;
}

export interface ContactInput {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  props?: Record<string, string | number | undefined>;
}

export async function findContactByEmail(email: string): Promise<{ id: string; properties: Record<string, string> } | null> {
  if (!env.hubspotToken) return null;
  const r = await hs<{ results: { id: string; properties: Record<string, string> }[] }>('/crm/v3/objects/contacts/search', {
    method: 'POST',
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email.toLowerCase() }] }],
      properties: ['email', 'firstname', 'lastname', 'phone', 'tdl_case_id', 'tdl_service', 'tdl_docs_json', 'tdl_lead_tier'],
      limit: 1,
    }),
  });
  return r.results[0] || null;
}

export async function upsertContact(c: ContactInput): Promise<string | null> {
  const properties: Record<string, string> = { email: c.email.toLowerCase() };
  if (c.firstname) properties.firstname = c.firstname;
  if (c.lastname) properties.lastname = c.lastname;
  if (c.phone) properties.phone = c.phone;
  for (const [k, v] of Object.entries(c.props || {})) if (v !== undefined && v !== '') properties[k] = String(v);

  if (!env.hubspotToken) { devLog('hubspot.upsertContact', properties); return null; }
  const existing = await findContactByEmail(c.email);
  if (existing) {
    await hs(`/crm/v3/objects/contacts/${existing.id}`, { method: 'PATCH', body: JSON.stringify({ properties }) });
    return existing.id;
  }
  const created = await hs<{ id: string }>('/crm/v3/objects/contacts', { method: 'POST', body: JSON.stringify({ properties }) });
  return created.id;
}

export async function createDeal(contactId: string | null, name: string, stage: string, amountUsd?: number, extra: Record<string, string> = {}): Promise<string | null> {
  const properties: Record<string, string> = { dealname: name, pipeline: env.hubspotPipeline, ...extra };
  if (stage) properties.dealstage = stage;
  if (amountUsd) properties.amount = String(amountUsd);
  if (!env.hubspotToken || !contactId) { devLog('hubspot.createDeal', { contactId, properties }); return null; }
  const d = await hs<{ id: string }>('/crm/v3/objects/deals', {
    method: 'POST',
    body: JSON.stringify({
      properties,
      associations: [{ to: { id: contactId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }] }],
    }),
  });
  return d.id;
}

export async function updateDealStage(dealId: string, stage: string) {
  if (!env.hubspotToken || !stage) { devLog('hubspot.updateDealStage', { dealId, stage }); return; }
  await hs(`/crm/v3/objects/deals/${dealId}`, { method: 'PATCH', body: JSON.stringify({ properties: { dealstage: stage } }) });
}

export async function addNote(contactId: string | null, body: string, dealId?: string | null) {
  if (!env.hubspotToken || !contactId) { devLog('hubspot.addNote', { contactId, body }); return; }
  const associations = [{ to: { id: contactId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }] }];
  if (dealId) associations.push({ to: { id: dealId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 214 }] });
  await hs('/crm/v3/objects/notes', {
    method: 'POST',
    body: JSON.stringify({ properties: { hs_timestamp: new Date().toISOString(), hs_note_body: body }, associations }),
  });
}

export async function latestDealForContact(contactId: string): Promise<{ id: string; properties: Record<string, string> } | null> {
  if (!env.hubspotToken) return null;
  const assoc = await hs<{ results: { toObjectId: number }[] }>(`/crm/v4/objects/contacts/${contactId}/associations/deals`);
  const ids = assoc.results.map((r) => String(r.toObjectId));
  if (!ids.length) return null;
  const batch = await hs<{ results: { id: string; properties: Record<string, string> }[] }>('/crm/v3/objects/deals/batch/read', {
    method: 'POST',
    body: JSON.stringify({ properties: ['dealname', 'dealstage', 'amount', 'createdate'], inputs: ids.map((id) => ({ id })) }),
  });
  return batch.results.sort((a, b) => (b.properties.createdate || '').localeCompare(a.properties.createdate || ''))[0] || null;
}

export async function clientNotes(contactId: string): Promise<{ date: string; body: string }[]> {
  if (!env.hubspotToken) return [];
  const assoc = await hs<{ results: { toObjectId: number }[] }>(`/crm/v4/objects/contacts/${contactId}/associations/notes`);
  const ids = assoc.results.slice(-30).map((r) => ({ id: String(r.toObjectId) }));
  if (!ids.length) return [];
  const batch = await hs<{ results: { properties: Record<string, string> }[] }>('/crm/v3/objects/notes/batch/read', {
    method: 'POST', body: JSON.stringify({ properties: ['hs_note_body', 'hs_timestamp'], inputs: ids }),
  });
  // Only notes the team marks with [CLIENTE] are shown in the client portal.
  return batch.results
    .map((n) => ({ date: n.properties.hs_timestamp, body: (n.properties.hs_note_body || '').replace(/<[^>]+>/g, '') }))
    .filter((n) => n.body.startsWith('[CLIENTE]'))
    .map((n) => ({ date: n.date, body: n.body.replace('[CLIENTE]', '').trim() }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function setContactProps(contactId: string, props: Record<string, string>) {
  if (!env.hubspotToken) { devLog('hubspot.setContactProps', { contactId, props }); return; }
  await hs(`/crm/v3/objects/contacts/${contactId}`, { method: 'PATCH', body: JSON.stringify({ properties: props }) });
}
