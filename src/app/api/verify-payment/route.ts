import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, certificateId } = await request.json();

    if (!sessionId || !certificateId) {
      return NextResponse.json(
        { error: "Session ID and certificate ID are required" },
        { status: 400 }
      );
    }

    // Get the Stripe session to verify payment
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: "Payment not completed", paymentStatus: session.payment_status },
        { status: 400 }
      );
    }

    // Verify this session is for the correct certificate
    if (session.metadata?.certificateId !== certificateId) {
      return NextResponse.json(
        { error: "Session does not match certificate" },
        { status: 400 }
      );
    }

    // Update certificate as paid in database
    const supabase = createServiceRoleSupabaseClient();
    const { error } = await supabase
      .from('certificates')
      .update({ 
        is_paid: true,
        customer_email: session.customer_details?.email,
        stripe_session_id: session.id,
        paid_at: new Date().toISOString()
      })
      .eq('certificate_id', certificateId);

    if (error) {
      console.error('Failed to update certificate:', error);
      return NextResponse.json(
        { error: "Database update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email 
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}