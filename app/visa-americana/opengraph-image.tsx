import { ogCard, OG_SIZE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Visa americana para venezolanos: qué sigue abierto';

export default function Image() {
  return ogCard({ kicker: 'Actualizado noviembre de 2026', title: 'Visa americana para venezolanos: qué sigue abierto', bg: '#0B1F33' });
}
