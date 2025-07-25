/**
 * Analytics and Conversion Tracking Utilities
 * Implements comprehensive funnel tracking for batterycert.com
 */

// Google Analytics gtag function declaration
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'purchase',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

/**
 * Conversion Funnel Events
 * Based on CLAUDE.md success metrics:
 * - Landing → Check: Target 15%+ conversion
 * - Check → Result: Target 90%+ completion  
 * - Result → Purchase: Target 8%+ purchase rate
 * - QR → Email: Target 25%+ lead capture
 */

export interface ConversionEvent {
  event_name: string;
  event_category: 'conversion_funnel';
  value?: number;
  currency?: string;
  custom_parameters?: Record<string, any>;
}

// Conversion funnel tracking functions
export const analytics = {
  // Landing Page Events
  trackLandingPageView: (source?: string, medium?: string) => {
    gtag('event', 'page_view', {
      event_category: 'conversion_funnel',
      event_label: 'landing_page_view',
      custom_source: source,
      custom_medium: medium,
    });
  },

  trackHeroCTAClick: () => {
    gtag('event', 'cta_click', {
      event_category: 'conversion_funnel', 
      event_label: 'hero_check_tesla_button',
      funnel_step: 'landing_to_check',
    });
  },

  trackSampleCertificateView: () => {
    gtag('event', 'sample_certificate_view', {
      event_category: 'engagement',
      event_label: 'sample_certificate_click',
    });
  },

  // Tesla Connection Events  
  trackTeslaConnectionAttempt: (region: string) => {
    gtag('event', 'tesla_connection_attempt', {
      event_category: 'conversion_funnel',
      event_label: 'tesla_auth_start',
      funnel_step: 'check_to_auth',
      tesla_region: region,
    });
  },

  trackTeslaConnectionSuccess: (region: string, vehicleCount: number) => {
    gtag('event', 'tesla_connection_success', {
      event_category: 'conversion_funnel',
      event_label: 'tesla_auth_success', 
      funnel_step: 'auth_to_vehicles',
      tesla_region: region,
      vehicle_count: vehicleCount,
    });
  },

  trackTeslaConnectionError: (error: string, region: string) => {
    gtag('event', 'tesla_connection_error', {
      event_category: 'errors',
      event_label: 'tesla_auth_failed',
      error_message: error,
      tesla_region: region,
    });
  },

  // Vehicle Selection Events
  trackVehicleSelection: (vehicleModel: string, vehicleYear: number) => {
    gtag('event', 'vehicle_selected', {
      event_category: 'conversion_funnel',
      event_label: 'vehicle_selection',
      funnel_step: 'vehicles_to_analysis',
      vehicle_model: vehicleModel,
      vehicle_year: vehicleYear,
    });
  },

  // Battery Analysis Events
  trackBatteryAnalysisStart: (vehicleModel: string, vin: string) => {
    gtag('event', 'battery_analysis_start', {
      event_category: 'conversion_funnel',
      event_label: 'analysis_started',
      funnel_step: 'analysis_to_results',
      vehicle_model: vehicleModel,
      vehicle_vin_prefix: vin.substring(0, 8), // First 8 chars for privacy
    });
  },

  trackBatteryAnalysisComplete: (
    vehicleModel: string,
    degradation: number,
    healthScore: string,
    batteryChemistry: string
  ) => {
    gtag('event', 'battery_analysis_complete', {
      event_category: 'conversion_funnel',
      event_label: 'analysis_completed',
      funnel_step: 'results_to_certificate_promo',
      vehicle_model: vehicleModel,
      degradation_percentage: Math.round(degradation),
      health_score: healthScore,
      battery_chemistry: batteryChemistry,
    });
  },

  trackBatteryAnalysisError: (error: string, vehicleModel: string) => {
    gtag('event', 'battery_analysis_error', {
      event_category: 'errors',
      event_label: 'analysis_failed',
      error_message: error,
      vehicle_model: vehicleModel,
    });
  },

  // Certificate Purchase Events
  trackCertificatePurchaseIntent: (certificateId: string, vehicleModel: string, price: number) => {
    gtag('event', 'certificate_purchase_intent', {
      event_category: 'conversion_funnel',
      event_label: 'purchase_button_clicked',
      funnel_step: 'results_to_purchase',
      certificate_id: certificateId,
      vehicle_model: vehicleModel,
      value: price,
      currency: 'USD',
    });
  },

  trackCertificatePurchaseStart: (certificateId: string, sessionId: string) => {
    gtag('event', 'certificate_purchase_start', {
      event_category: 'conversion_funnel',
      event_label: 'stripe_checkout_started',
      funnel_step: 'purchase_to_payment',
      certificate_id: certificateId,
      stripe_session_id: sessionId,
    });
  },

  trackCertificatePurchaseComplete: (
    certificateId: string,
    vehicleModel: string,
    price: number,
    paymentMethod: string
  ) => {
    gtag('event', 'purchase', {
      transaction_id: certificateId,
      value: price,
      currency: 'USD',
      items: [{
        item_id: certificateId,
        item_name: `Tesla Battery Certificate - ${vehicleModel}`,
        category: 'certificate',
        quantity: 1,
        price: price,
      }],
      payment_method: paymentMethod,
      funnel_step: 'purchase_completed',
    });

    // Additional conversion tracking
    gtag('event', 'certificate_purchase_complete', {
      event_category: 'conversion_funnel',
      event_label: 'purchase_completed',
      certificate_id: certificateId,
      vehicle_model: vehicleModel,
      value: price,
      currency: 'USD',
    });
  },

  trackCertificatePurchaseError: (error: string, certificateId: string) => {
    gtag('event', 'certificate_purchase_error', {
      event_category: 'errors',
      event_label: 'purchase_failed',
      error_message: error,
      certificate_id: certificateId,
    });
  },

  // Certificate Access & Sharing Events
  trackCertificateView: (certificateId: string, isPaid: boolean) => {
    gtag('event', 'certificate_view', {
      event_category: 'engagement',
      event_label: isPaid ? 'paid_certificate_view' : 'unpaid_certificate_view',
      certificate_id: certificateId,
      is_paid: isPaid,
    });
  },

  trackCertificateDownload: (certificateId: string, vehicleModel: string) => {
    gtag('event', 'certificate_download', {
      event_category: 'engagement',
      event_label: 'pdf_download',
      certificate_id: certificateId,
      vehicle_model: vehicleModel,
    });
  },

  trackCertificateShare: (certificateId: string, shareMethod: string) => {
    gtag('event', 'certificate_share', {
      event_category: 'engagement',
      event_label: 'certificate_shared',
      certificate_id: certificateId,
      share_method: shareMethod,
    });
  },

  // QR Verification Events (Buyer Journey)
  trackQRVerificationScan: (certificateId: string, source: 'qr_code' | 'url') => {
    gtag('event', 'qr_verification_scan', {
      event_category: 'buyer_verification',
      event_label: 'qr_scanned',
      certificate_id: certificateId,
      verification_source: source,
    });
  },

  trackBuyerEmailCapture: (certificateId: string, vehicleModel: string) => {
    gtag('event', 'buyer_email_capture', {
      event_category: 'conversion_funnel',
      event_label: 'buyer_email_captured',
      funnel_step: 'qr_to_email',
      certificate_id: certificateId,
      vehicle_model: vehicleModel,
    });
  },

  // User Experience Events
  trackErrorPageView: (errorType: string, errorMessage: string) => {
    gtag('event', 'error_page_view', {
      event_category: 'errors',
      event_label: errorType,
      error_message: errorMessage,
    });
  },

  trackPageLoadTime: (page: string, loadTime: number) => {
    gtag('event', 'page_load_time', {
      event_category: 'performance',
      event_label: page,
      value: Math.round(loadTime),
      metric_type: 'timing',
    });
  },

  // Custom Conversion Events
  trackCustomConversion: (eventName: string, parameters: Record<string, any>) => {
    gtag('event', eventName, {
      event_category: 'conversion_funnel',
      ...parameters,
    });
  },
};

// Helper function to safely call gtag - never throws errors
function gtag(command: string, eventName: string, parameters: Record<string, any>) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag(command as any, eventName, parameters);
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`Analytics Event: ${eventName}`, parameters);
    }
  } catch (error) {
    // Silently fail - never break the page for analytics
    if (process.env.NODE_ENV === 'development') {
      console.warn('Analytics call failed (likely ad blocker):', error);
    }
  }
}

// Performance monitoring utilities
export const performance = {
  trackWebVitals: () => {
    try {
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        // First Contentful Paint
        try {
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (entry.name === 'first-contentful-paint') {
                gtag('event', 'web_vitals', {
                  event_category: 'performance',
                  metric_name: 'FCP',
                  value: Math.round(entry.startTime),
                  metric_rating: entry.startTime < 1200 ? 'good' : entry.startTime < 3000 ? 'needs-improvement' : 'poor',
                });
              }
            }
          }).observe({ entryTypes: ['paint'] });
        } catch (error) {
          // FCP tracking failed, continue silently
        }

        // Largest Contentful Paint
        try {
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            gtag('event', 'web_vitals', {
              event_category: 'performance',
              metric_name: 'LCP',
              value: Math.round(lastEntry.startTime),
              metric_rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs-improvement' : 'poor',
            });
          }).observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
          // LCP tracking failed, continue silently
        }
      }
    } catch (error) {
      // Web Vitals tracking failed entirely, continue silently
    }
  },

  trackPageLoadStart: (page: string) => {
    try {
      if (typeof window !== 'undefined') {
        const startTime = performance.now();
        return () => {
          try {
            const loadTime = performance.now() - startTime;
            analytics.trackPageLoadTime(page, loadTime);
          } catch (error) {
            // Page load time tracking failed, continue silently
          }
        };
      }
    } catch (error) {
      // Performance tracking setup failed, continue silently
    }
    return () => {};
  },
};

export default analytics;