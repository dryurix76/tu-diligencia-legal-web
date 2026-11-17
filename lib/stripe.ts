import Stripe from 'stripe';
import { env } from './env';

let client: Stripe | null = null;

export function stripe(): Stripe | null {
  if (!env.stripeSecret) return null;
  client = client || new Stripe(env.stripeSecret);
  return client;
}
