import { Stripe } from "stripe";
import { getPricingForLocale as getPricingFromDB } from "./stripe-products";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-06-30.basil",
    });
  }
  return _stripe;
}

// Fallback pricing configuration (used if database lookup fails)
export const STRIPE_CONFIG = {
  pricing: {
    en: { currency: "usd", price: 999 }, // $9.99
    fi: { currency: "eur", price: 949 }, // €9.49
    sv: { currency: "sek", price: 109 }, // 109 SEK
    no: { currency: "nok", price: 109 }, // 109 NOK
    da: { currency: "dkk", price: 69 }, // 69 DKK
  },
} as const;

// Database-driven pricing per locale
export async function getPricingForLocale(locale: string) {
  try {
    const pricing = await getPricingFromDB(locale);

    if (pricing) {
      return pricing; // Return the full pricing object
    }
  } catch (error) {
    console.warn(
      `Database pricing lookup failed for locale '${locale}':`,
      error
    );
  }

  // If no pricing found, return null instead of fallback
  console.warn(`No pricing found for locale '${locale}'`);
  return null;
}
