"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Cookie } from "lucide-react";

interface GDPRBannerProps {
  locale: string;
  translations?: {
    title: string;
    message: string;
    accept_all: string;
    decline: string;
    cookie_settings: string;
    essential_only: string;
    settings: {
      essential_cookies: string;
      always_on: string;
      analytics: string;
      marketing: string;
      optional: string;
      back: string;
    };
  };
}

interface GDPRConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

// Country codes that require GDPR compliance (EU + UK GDPR)
const GDPR_COUNTRIES = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GB", // UK GDPR (post-Brexit)
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
];

// Check if locale requires GDPR compliance (EU + UK)
function requiresGDPR(locale: string): boolean {
  // Extract country code from locale (e.g., "en-GB" -> "GB", "de-DE" -> "DE")
  const countryCode = locale.split("-")[1];
  return countryCode ? GDPR_COUNTRIES.includes(countryCode) : false;
}

export function GDPRBanner({ locale, translations }: GDPRBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Fallback translations for backward compatibility
  const t = translations || {
    title: "We respect your privacy",
    message: "We use cookies and similar technologies to improve your experience, analyze site traffic, and personalize content. Your Tesla data is processed securely and never shared with third parties.",
    accept_all: "Accept All",
    decline: "Decline",
    cookie_settings: "Cookie Settings",
    essential_only: "Essential Only",
    settings: {
      essential_cookies: "Essential Cookies",
      always_on: "Always On",
      analytics: "Analytics",
      marketing: "Marketing",
      optional: "Optional",
      back: "Back"
    }
  };

  useEffect(() => {
    // Only show for locales that require GDPR compliance (EU + UK)
    if (!requiresGDPR(locale)) {
      return;
    }

    // Check if user has already made a choice
    const consent = localStorage.getItem("gdpr-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, [locale]);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "gdpr-consent",
      JSON.stringify({
        essential: true,
        analytics: true,
        marketing: true,
        timestamp: Date.now(),
      })
    );
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(
      "gdpr-consent",
      JSON.stringify({
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: Date.now(),
      })
    );
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem(
      "gdpr-consent",
      JSON.stringify({
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: Date.now(),
      })
    );
    setIsVisible(false);
  };

  const handleClose = () => {
    // Treat close as essential only
    handleEssentialOnly();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/20 backdrop-blur-sm">
      <Card className="mx-auto max-w-4xl border-blue-200 bg-white shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Cookie className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {t.title}
                </h3>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            {t.message}
          </p>

          {showSettings ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>{t.settings.essential_cookies}</span>
                  <span className="text-green-600 font-medium">{t.settings.always_on}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>{t.settings.analytics}</span>
                  <span className="text-gray-500">{t.settings.optional}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>{t.settings.marketing}</span>
                  <span className="text-gray-500">{t.settings.optional}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  {t.settings.back}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEssentialOnly}
                >
                  {t.essential_only}
                </Button>
                <Button size="sm" onClick={handleAcceptAll}>
                  {t.accept_all}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={handleDecline}>
                {t.decline}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                {t.cookie_settings}
              </Button>
              <Button size="sm" onClick={handleAcceptAll}>
                {t.accept_all}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Hook to get current consent status
export function useGDPRConsent() {
  const [consent, setConsent] = useState<GDPRConsent | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("gdpr-consent");
    if (stored) {
      try {
        setConsent(JSON.parse(stored));
      } catch (e) {
        console.warn("Failed to parse GDPR consent:", e);
      }
    }
  }, []);

  return consent;
}
