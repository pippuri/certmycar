"use client";

import { useEffect } from "react";

interface AnalyticsTrackerProps {
  page: string;
  locale: string;
}

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export function AnalyticsTracker({ page, locale }: AnalyticsTrackerProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      // Track page view with language
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID!, {
        page_title: `${page} (${locale})`,
        page_location: window.location.href,
        custom_map: {
          custom_parameter_1: "language",
        },
        language: locale,
      });

      // Track language-specific event
      window.gtag("event", "page_view", {
        event_category: "engagement",
        event_label: `${page}_${locale}`,
        custom_parameter_1: locale,
        page_title: page,
        page_location: window.location.href,
      });

      // Track language performance for SEO
      window.gtag("event", "language_view", {
        event_category: "seo",
        event_label: locale,
        value: 1,
        custom_parameter_1: page,
        custom_parameter_2: locale,
      });
    }
  }, [page, locale]);

  return null;
}
