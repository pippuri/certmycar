/**
 * Client-side Stripe products utility
 * This version uses API calls instead of direct database access
 */

export interface StripeProduct {
  id: string;
  product_id: string;
  name: string;
  description: string | null;
  locale: string;
  price_id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StripePricing {
  price: number;
  currency: string;
  formattedPrice: string;
  productName: string;
  description: string | null;
  priceId: string;
}

/**
 * Get Stripe product for a specific locale via API
 */
export async function getStripeProduct(
  locale: string
): Promise<StripeProduct | null> {
  try {
    const response = await fetch(`/api/stripe-products?locale=${locale}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error("Error fetching Stripe product:", error);
    return null;
  }
}

/**
 * Format price for display
 */
export function formatPrice(
  unitAmount: number,
  currency: string,
  locale: string = "en"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(unitAmount / 100);
}

/**
 * Get pricing information for a locale
 */
export async function getPricingForLocale(
  locale: string
): Promise<StripePricing | null> {
  try {
    const response = await fetch(`/api/stripe-products?locale=${locale}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const data = await response.json();
    return data.pricing;
  } catch (error) {
    console.error(`No Stripe product found for locale: ${locale}`, error);
    return null;
  }
}
