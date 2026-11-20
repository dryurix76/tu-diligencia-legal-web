import { NextResponse } from 'next/server';
import { bcvRate } from '@/lib/bcv';

export const revalidate = 1800;

export async function GET() {
  const r = await bcvRate();
  if (!r) return NextResponse.json({ error: 'Tasa no disponible' }, { status: 503 });
  return NextResponse.json(r, { headers: { 'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600' } });
}
