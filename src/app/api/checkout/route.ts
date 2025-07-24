import { NextRequest, NextResponse } from 'next/server';
import { stripe, getPricingForLocale } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { certificateId, locale = 'en' } = await request.json();

    if (!certificateId) {
      return NextResponse.json(
        { error: 'Certificate ID is required' },
        { status: 400 }
      );
    }

    // Get pricing for locale
    const pricing = getPricingForLocale(locale);

    // Verify certificate exists and is unpaid
    const supabase = await createServerSupabaseClient();
    const { data: certificate, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('certificate_id', certificateId)
      .single();

    if (error || !certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    if (certificate.is_paid) {
      return NextResponse.json(
        { error: 'Certificate already paid' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: pricing.currency,
            product_data: {
              name: 'Tesla Battery Certificate',
              description: `Verified Tesla battery health certificate for ${certificate.vehicle_name || 'your vehicle'}`,
            },
            unit_amount: pricing.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
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
      url: session.url 
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}