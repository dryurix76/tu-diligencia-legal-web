import fs from 'node:fs/promises';
import path from 'node:path';
import { readToken } from '@/lib/session';
import { GUIDES } from '@/lib/guides';

// Signed download links sent by email: /descargas/<guide>?t=<token>
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = new URL(req.url);
  const t = await readToken(url.searchParams.get('t') || '', 'download');
  if (!GUIDES[slug] || !t || t.guide !== slug) return Response.redirect(new URL('/ayuda?guia=expirada#guias', url), 302);
  try {
    const file = await fs.readFile(path.join(process.cwd(), 'content', 'guides', `${slug}.pdf`));
    return new Response(new Uint8Array(file), { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="tu-diligencia-legal-${slug}.pdf"`, 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex' } });
  } catch {
    return new Response('La guía se está actualizando. Escríbenos a info@tudiligencialegal.com y te la enviamos.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}
