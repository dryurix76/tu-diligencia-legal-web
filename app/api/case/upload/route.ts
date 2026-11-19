import { SITE_URL } from '@/lib/env';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { env } from '@/lib/env';
import { currentEmail } from '@/lib/session';
import { findContactByEmail, setContactProps, addNote } from '@/lib/hubspot';
import { parseDocs } from '@/lib/portal';
import { notifyTeam, sendEmail, richEmail } from '@/lib/email';

const MAX = 15 * 1024 * 1024;
const TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/webp'];

export async function POST(req: Request) {
  const email = await currentEmail();
  if (!email) return NextResponse.json({ error: 'Inicia sesión.' }, { status: 401 });
  const form = await req.formData();
  const file = form.get('file');
  const index = Number(form.get('index'));
  if (!(file instanceof File)) return NextResponse.json({ error: 'Falta el archivo.' }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: 'Máximo 15 MB.' }, { status: 400 });
  if (!TYPES.includes(file.type)) return NextResponse.json({ error: 'Sube PDF o imagen (JPG, PNG, HEIC).' }, { status: 400 });

  const contact = await findContactByEmail(email);
  if (!contact) return NextResponse.json({ error: 'No encontramos tu expediente.' }, { status: 404 });
  if (!env.blobToken) return NextResponse.json({ error: 'Almacenamiento no configurado.' }, { status: 503 });

  const safe = file.name.replace(/[^\w.\-]+/g, '_').slice(-80);
  const blob = await put(`expedientes/${contact.properties.tdl_case_id || contact.id}/${Date.now()}-${safe}`, file, { access: 'public', addRandomSuffix: true, token: env.blobToken });

  const docs = parseDocs(contact.properties.tdl_docs_json);
  if (docs[index]) docs[index].status = 'recibido';
  await setContactProps(contact.id, { tdl_docs_json: JSON.stringify(docs) });
  await addNote(contact.id, `Documento subido por el cliente: <b>${docs[index]?.name || safe}</b><br><a href="${blob.url}">${safe}</a>`);
  const caseId = contact.properties.tdl_case_id || contact.id;
  const docName = docs[index]?.name || safe;
  await notifyTeam(`Documento recibido · ${caseId} · ${docName}`, { Caso: caseId, Cliente: email, Documento: docName, Archivo: blob.url }, email);
  await sendEmail(email, `Recibimos tu documento · ${caseId}`, richEmail({
    title: 'Documento recibido', caseId,
    intro: `<p>Hemos recibido <strong>${docName.replace(/</g, '&lt;')}</strong> en tu expediente. Tu abogado lo revisará y, si hace falta corregir algo, te avisaremos por correo y WhatsApp.</p>`,
    steps: ['Puedes seguir subiendo documentos desde Mi caso.', 'Revisa que los documentos venezolanos estén apostillados y legibles.'],
    cta: { label: 'Ir a Mi caso', href: `${SITE_URL}/mi-caso` },
  }));
  return NextResponse.json({ ok: true });
}
