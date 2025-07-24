import { NextRequest, NextResponse } from "next/server";
import { getStripe, getPricingForLocale } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    console.log("=== CHECKOUT API CALLED ===");
    const { searchParams } = new URL(request.url);
    const certificateId = searchParams.get("certificate_id");
    const vin = searchParams.get("vin");
    const locale = searchParams.get("locale") || "en";

    console.log("Checkout params:", { certificateId, vin, locale });

    if (!certificateId) {
      return NextResponse.json(
        { error: "Certificate ID is required" },
        { status: 400 }
      );
    }

    // Get pricing for locale from database
    const pricing = await getPricingForLocale(locale);

    if (!pricing) {
      return NextResponse.json(
        { error: "Pricing not available for this locale" },
        { status: 400 }
      );
    }

    // Verify certificate exists and is unpaid
    const supabase = await createServerSupabaseClient();
    const { data: certificate, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("certificate_id", certificateId)
      .single();

    if (error || !certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    if (certificate.is_paid) {
      // Redirect to the existing certificate instead of showing an error
      const certificateUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/certificate/${certificateId}?vin=${certificate.tesla_vin}`;
      return NextResponse.redirect(certificateUrl);
    }

    // Create Stripe checkout session using the Price ID
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: pricing.priceId, // Use the Stripe Price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/certificate/${certificateId}?vin=${certificate.tesla_vin}&payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/certificate/${certificateId}?vin=${certificate.tesla_vin}&payment=cancelled`,
      customer_email: undefined, // Let customer enter their email
      metadata: {
        certificateId,
        locale,
      },
    });

    // Redirect to Stripe checkout
    return NextResponse.redirect(session.url!);
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { certificateId, locale = "en" } = await request.json();

    if (!certificateId) {
      return NextResponse.json(
        { error: "Certificate ID is required" },
        { status: 400 }
      );
    }

    // Get pricing for locale from database
    const pricing = await getPricingForLocale(locale);

    if (!pricing) {
      return NextResponse.json(
        { error: "Pricing not available for this locale" },
        { status: 400 }
      );
    }

    // Verify certificate exists and is unpaid
    const supabase = await createServerSupabaseClient();
    const { data: certificate, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("certificate_id", certificateId)
      .single();

    if (error || !certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    if (certificate.is_paid) {
      // Return the certificate URL instead of an error
      const certificateUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/certificate/${certificateId}?vin=${certificate.tesla_vin}`;
      return NextResponse.json({
        url: certificateUrl,
        message: "Certificate already exists",
      });
    }

    // Create Stripe checkout session using the Price ID
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: pricing.priceId, // Use the Stripe Price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/certificate/${certificateId}?vin=${certificate.tesla_vin}&payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/certificate/${certificateId}?vin=${certificate.tesla_vin}&payment=cancelled`,
      customer_email: undefined, // Let customer enter their email
      metadata: {
        certificateId,
        locale,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
