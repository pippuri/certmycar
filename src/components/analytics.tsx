"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "purchase",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      // Track page view on route change
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID!, {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}

// Simple event tracking function
export function trackEvent(
  action: string,
  category: string = "engagement",
  label?: string,
  value?: number
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}