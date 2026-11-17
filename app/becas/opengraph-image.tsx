import { ogCard, OG_SIZE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Becas 2026 en España, Portugal e Italia';

export default function Image() {
  return ogCard({ kicker: 'Te buscamos tu beca · desde USD 290', title: 'Becas 2026 en España, Portugal e Italia', bg: '#1F5135' });
}
