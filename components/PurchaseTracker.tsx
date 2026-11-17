'use client';

import { useEffect } from 'react';
import { track } from '@/lib/track';

export default function PurchaseTracker({ id, value, item }: { id: string; value: number; item: string }) {
  useEffect(() => {
    const key = 'tdl_purchase_' + id;
    try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch { /* ignore */ }
    track('purchase', { transaction_id: id, value, currency: 'USD', items: [{ item_id: item, price: value }] });
  }, [id, value, item]);
  return null;
}
