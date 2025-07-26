import { createServerSupabaseClient } from "./supabase";
import { getStripe } from "./stripe";

export interface StripeProduct {
  id: string;
  product_id: string;
  name: string;
  description: string | null;
  locale: string;
  price_id: string;
  price_id_test?: string; // Optional test mode price ID
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
 * Falls back through a hierarchy of locales if the requested locale is not found
 */
export async function getStripeProduct(
  locale: string
): Promise<StripeProduct | null> {
  const supabase = await createServerSupabaseClient();

  // Define fallback hierarchy for locales
  const getFallbackLocales = (requestedLocale: string): string[] => {
    const fallbacks = [requestedLocale];
    
    // Map full locale codes to simple language codes used in database
    const getLanguageCode = (locale: string): string => {
      return locale.split('-')[0]; // Extract language part (e.g., 'de-DE' -> 'de')
    };
    
    const languageCode = getLanguageCode(requestedLocale);
    
    // Add the simple language code if different from requested locale
    if (languageCode !== requestedLocale) {
      fallbacks.push(languageCode);
    }
    
    // Add English fallbacks if not already English
    if (!requestedLocale.startsWith('en') && languageCode !== 'en') {
      fallbacks.push('en-US', 'en');
    } else if (requestedLocale.startsWith('en') && !fallbacks.includes('en')) {
      fallbacks.push('en');
    }
    
    return [...new Set(fallbacks)]; // Remove duplicates
  };

  const fallbackLocales = getFallbackLocales(locale);
  
  for (const tryLocale of fallbackLocales) {
    const { data: product, error } = await supabase
      .from("stripe_products")
      .select("*, price_id_test")
      .eq("locale", tryLocale)
      .eq("active", true)
      .single();

    if (product && !error) {
      if (tryLocale !== locale) {
        console.log(`Product not found for locale '${locale}', using fallback '${tryLocale}'`);
      }
      return product;
    }
  }

  console.error(`No Stripe product found for locale '${locale}' or any fallback locales`);
  return null;
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
 * Falls back to environment variable price if database is not configured
 */
export async function getPricingForLocale(
  locale: string
): Promise<StripePricing | null> {
  try {
    const product = await getStripeProduct(locale);
    if (!product) {
      console.log(`No Stripe product found for locale: ${locale}, checking for fallback price ID`);
      
      // Fallback to environment variable for development/testing
      const fallbackPriceId = process.env.STRIPE_DEFAULT_PRICE_ID;
      if (fallbackPriceId) {
        console.log(`Using fallback Stripe price ID: ${fallbackPriceId}`);
        
        // Fetch price from Stripe API using fallback price ID
        const stripe = getStripe();
        const price = await stripe.prices.retrieve(fallbackPriceId);

        if (!price.unit_amount || !price.currency) {
          throw new Error(`Invalid fallback price data for ${fallbackPriceId}`);
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
          productName: "Tesla Battery Certificate", // Default name
          description: "Official Tesla battery health certificate with verification QR code",
          priceId: fallbackPriceId,
        };
      }
      
      console.error(`No Stripe product found for locale: ${locale} and no fallback price ID configured`);
      return null;
    }

    // Fetch price from Stripe API
    const stripe = getStripe();
    
    // Determine which price ID to use based on environment
    const isTestMode = process.env.NODE_ENV === 'development' || process.env.STRIPE_PUBLISHABLE_KEY?.includes('pk_test');
    const priceIdToUse = isTestMode && product.price_id_test ? product.price_id_test : product.price_id;
    
    console.log(`Using ${isTestMode ? 'test' : 'live'} price ID: ${priceIdToUse} for locale: ${locale}`);
    
    try {
      const price = await stripe.prices.retrieve(priceIdToUse);

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
        priceId: priceIdToUse,
      };
    } catch (stripeError: unknown) {
      console.warn(`Stripe price ID '${priceIdToUse}' for locale '${locale}' is invalid:`, stripeError instanceof Error ? stripeError.message : stripeError);
      
      // If the price ID is invalid, try to fall back to English product
      if (locale !== 'en') {
        console.log(`Falling back to English product due to invalid price ID`);
        return await getPricingForLocale('en');
      }
      
      // If English also fails, throw the original error
      throw stripeError;
    }
  } catch (error) {
    console.error("Error getting pricing for locale:", error);
    return null;
  }
}
