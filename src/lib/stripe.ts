import { Stripe } from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
    });
  }
  return _stripe;
}

export const STRIPE_CONFIG = {
  // Pricing by locale/currency
  pricing: {
    'en': { currency: 'usd', price: 999 }, // $9.99
    'fi': { currency: 'eur', price: 949 }, // €9.49
    'sv': { currency: 'sek', price: 109 }, // 109 SEK
    'no': { currency: 'nok', price: 109 }, // 109 NOK
    'da': { currency: 'dkk', price: 69 },  // 69 DKK
  }
} as const;

export function getPricingForLocale(locale: string) {
  return STRIPE_CONFIG.pricing[locale as keyof typeof STRIPE_CONFIG.pricing] || STRIPE_CONFIG.pricing['en'];
}