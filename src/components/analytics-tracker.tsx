"use client";

import { useEffect } from 'react';
import { analytics, performance } from '@/lib/analytics';

interface AnalyticsTrackerProps {
  page: string;
  locale?: string;
}

export function AnalyticsTracker({ page }: AnalyticsTrackerProps) {
  useEffect(() => {
    // Track page view - never break page rendering if analytics fails
    try {
      analytics.trackLandingPageView();
    } catch (error) {
      console.warn('Page view tracking failed:', error);
    }
    
    // Track web vitals
    try {
      performance.trackWebVitals();
    } catch (error) {
      console.warn('Web vitals tracking failed:', error);
    }
    
    // Track page load time
    let trackLoadTime = () => {};
    try {
      trackLoadTime = performance.trackPageLoadStart(page);
    } catch (error) {
      console.warn('Page load time tracking setup failed:', error);
    }
    
    // Clean up on unmount
    return () => {
      try {
        trackLoadTime();
      } catch (error) {
        console.warn('Page load time tracking cleanup failed:', error);
      }
    };
  }, [page]);

  return null; // This component doesn't render anything
}

export default AnalyticsTracker;