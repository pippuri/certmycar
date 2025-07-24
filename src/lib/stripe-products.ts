import { createServerSupabaseClient } from "./supabase";
import { getStripe } from "./stripe";

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
 * Get Stripe product for a specific locale
 * Falls back to 'en' if the requested locale is not found
 */
export async function getStripeProduct(
  locale: string
): Promise<StripeProduct | null> {
  const supabase = await createServerSupabaseClient();

  // Try to get product for the requested locale
  let { data: product, error } = await supabase
    .from("stripe_products")
    .select("*")
    .eq("locale", locale)
    .eq("active", true)
    .single();

  // If not found and not already trying 'en', fall back to 'en'
  if (!product && error && locale !== "en") {
    console.log(
      `Product not found for locale '${locale}', falling back to 'en'`
    );
    const { data: fallbackProduct, error: fallbackError } = await supabase
      .from("stripe_products")
      .select("*")
      .eq("locale", "en")
      .eq("active", true)
      .single();

    product = fallbackProduct;
    error = fallbackError;
  }

  if (error) {
    console.error("Error fetching Stripe product:", error);
    return null;
  }

  return product;
}

/**
 * Get all active Stripe products
 */
export async function getAllStripeProducts(): Promise<StripeProduct[]> {
  const supabase = await createServerSupabaseClient();

  const { data: products, error } = await supabase
    .from("stripe_products")
    .select("*")
    .eq("active", true)
    .order("locale", { ascending: true });

  if (error) {
    console.error("Error fetching Stripe products:", error);
    return [];
  }

  return products || [];
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
 * Fetches product data from database and price from Stripe API
 */
export async function getPricingForLocale(
  locale: string
): Promise<StripePricing | null> {
  try {
    const product = await getStripeProduct(locale);
    if (!product) {
      console.error(`No Stripe product found for locale: ${locale}`);
      return null;
    }

    // Fetch price from Stripe API
    const stripe = getStripe();
    const price = await stripe.prices.retrieve(product.price_id);

    if (!price.unit_amount || !price.currency) {
      throw new Error(`Invalid price data for ${product.price_id}`);
    }

    const formattedPrice = formatPrice(
      price.unit_amount,
      price.currency,
      locale
    );

    return {
      price: price.unit_amount,
      currency: price.currency,
      formattedPrice,
      productName: product.name,
      description: product.description,
      priceId: product.price_id,
    };
  } catch (error) {
    console.error("Error getting pricing for locale:", error);
    return null;
  }
}
