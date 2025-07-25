/**
 * Server-side Analytics Utilities
 * For tracking events in API routes and server components
 */

export interface ServerAnalyticsEvent {
  event_name: string;
  certificate_id?: string;
  session_id?: string;
  vehicle_model?: string;
  price?: number;
  currency?: string;
  error_message?: string;
  [key: string]: any;
}

// Server-side event logging (can be extended to send to analytics services)
export const serverAnalytics = {
  logEvent: (event: ServerAnalyticsEvent) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Server Analytics Event:', {
        timestamp: new Date().toISOString(),
        ...event,
      });
    }
    
    // In production, you could send to analytics services like:
    // - Google Analytics Measurement Protocol
    // - PostHog
    // - Mixpanel
    // - Custom analytics endpoint
    
    // For now, just log the event structure
    // TODO: Implement actual analytics service integration
  },

  trackCheckoutSessionCreated: (certificateId: string, sessionId: string, vehicleModel: string, price: number) => {
    serverAnalytics.logEvent({
      event_name: 'checkout_session_created',
      certificate_id: certificateId,
      session_id: sessionId,
      vehicle_model: vehicleModel,
      price: price,
      currency: 'USD',
      event_category: 'conversion_funnel',
      funnel_step: 'purchase_to_payment',
    });
  },

  trackPaymentSuccess: (certificateId: string, sessionId: string, vehicleModel: string, price: number) => {
    serverAnalytics.logEvent({
      event_name: 'payment_success',
      certificate_id: certificateId,
      session_id: sessionId,
      vehicle_model: vehicleModel,
      price: price,
      currency: 'USD',
      event_category: 'conversion_funnel',
      funnel_step: 'payment_completed',
    });
  },

  trackPaymentVerification: (certificateId: string, sessionId: string, verificationMethod: 'immediate' | 'webhook') => {
    serverAnalytics.logEvent({
      event_name: 'payment_verification',
      certificate_id: certificateId,
      session_id: sessionId,
      verification_method: verificationMethod,
      event_category: 'payment_processing',
    });
  },

  trackCertificateUnlock: (certificateId: string, vehicleModel: string) => {
    serverAnalytics.logEvent({
      event_name: 'certificate_unlocked',
      certificate_id: certificateId,
      vehicle_model: vehicleModel,
      event_category: 'certificate_access',
    });
  },

  trackCheckoutError: (error: string, certificateId?: string) => {
    serverAnalytics.logEvent({
      event_name: 'checkout_error',
      certificate_id: certificateId,
      error_message: error,
      event_category: 'errors',
    });
  },

  trackCertificatePDFGenerated: (certificateId: string, vehicleModel: string) => {
    serverAnalytics.logEvent({
      event_name: 'certificate_pdf_generated',
      certificate_id: certificateId,
      vehicle_model: vehicleModel,
      event_category: 'certificate_access',
    });
  },

  trackQRVerification: (certificateId: string, source: 'qr_code' | 'direct_url') => {
    serverAnalytics.logEvent({
      event_name: 'qr_verification_server',
      certificate_id: certificateId,
      verification_source: source,
      event_category: 'buyer_verification',
    });
  },
};

export default serverAnalytics;