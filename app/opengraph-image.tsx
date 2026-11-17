import { ogCard, OG_SIZE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Tu Diligencia Legal: nacionalidad española y europea para venezolanos';

export default function Image() {
  return ogCard({ kicker: 'Derecho migratorio para venezolanos', title: 'Tu abuelo salió de España. Tú puedes volver con pasaporte.' });
}
