import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createServiceRoleSupabaseClient } from '@/lib/supabase';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const certificateId = session.metadata?.certificateId;
        const customerEmail = session.customer_details?.email;

        if (!certificateId) {
          console.error('No certificate ID in session metadata');
          return NextResponse.json({ error: 'No certificate ID' }, { status: 400 });
        }

        // Update certificate as paid (backup in case direct verification failed)
        const supabase = createServiceRoleSupabaseClient();
        
        // First check if certificate is already marked as paid (from direct verification)
        const { data: existingCert } = await supabase
          .from('certificates')
          .select('is_paid, paid_at')
          .eq('certificate_id', certificateId)
          .single();

        if (existingCert?.is_paid) {
          console.log(`Certificate ${certificateId} already marked as paid, skipping webhook update`);
        } else {
          // Only update if not already paid (backup processing)
          const { error } = await supabase
            .from('certificates')
            .update({ 
              is_paid: true,
              customer_email: customerEmail,
              stripe_session_id: session.id,
              paid_at: new Date().toISOString()
            })
            .eq('certificate_id', certificateId);

          if (error) {
            console.error('Failed to update certificate via webhook:', error);
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
          }

          console.log(`Certificate ${certificateId} marked as paid via webhook backup for ${customerEmail}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}