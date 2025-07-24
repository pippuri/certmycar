import { NextRequest, NextResponse } from "next/server";
import { getStripeProduct } from "@/lib/stripe-products";
import { getStripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale");

    if (!locale) {
      return NextResponse.json(
        { error: "Locale parameter is required" },
        { status: 400 }
      );
    }

    // Get product from database
    const product = await getStripeProduct(locale);
    if (!product) {
      return NextResponse.json(
        { error: `No product found for locale: ${locale}` },
        { status: 404 }
      );
    }

    // Fetch price from Stripe API
    const stripe = getStripe();
    const price = await stripe.prices.retrieve(product.price_id);

    if (!price.unit_amount || !price.currency) {
      return NextResponse.json(
        { error: `Invalid price data for ${product.price_id}` },
        { status: 500 }
      );
    }

    // Format price for display
    const formattedPrice = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: price.currency.toUpperCase(),
    }).format(price.unit_amount / 100);

    const pricing = {
      price: price.unit_amount,
      currency: price.currency,
      formattedPrice,
      productName: product.name,
      description: product.description,
      priceId: product.price_id,
    };

    return NextResponse.json({ product, pricing });
  } catch (error) {
    console.error("Error fetching Stripe product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
