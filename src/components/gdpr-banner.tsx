"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Cookie } from "lucide-react";

interface GDPRBannerProps {
  locale: string;
}

interface GDPRText {
  title: string;
  message: string;
  accept: string;
  decline: string;
  settings: string;
  essential: string;
}

interface GDPRConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

// EU country codes that require GDPR compliance
const EU_COUNTRIES = [
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

// Check if locale indicates EU region
function isEULocale(locale: string): boolean {
  // Extract country code from locale (e.g., "en-GB" -> "GB", "de-DE" -> "DE")
  const countryCode = locale.split("-")[1];
  return countryCode ? EU_COUNTRIES.includes(countryCode) : false;
}

function getGDPRText(locale: string): GDPRText {
  const langCode = locale.split("-")[0];

  // Localized GDPR text
  const texts: Record<string, GDPRText> = {
    en: {
      title: "We respect your privacy",
      message:
        "We use cookies and similar technologies to improve your experience, analyze site traffic, and personalize content. Your Tesla data is processed securely and never shared with third parties.",
      accept: "Accept All",
      decline: "Decline",
      settings: "Cookie Settings",
      essential: "Essential Only",
    },
    de: {
      title: "Wir respektieren Ihre Privatsphäre",
      message:
        "Wir verwenden Cookies und ähnliche Technologien, um Ihr Erlebnis zu verbessern, den Website-Traffic zu analysieren und Inhalte zu personalisieren. Ihre Tesla-Daten werden sicher verarbeitet und niemals an Dritte weitergegeben.",
      accept: "Alle akzeptieren",
      decline: "Ablehnen",
      settings: "Cookie-Einstellungen",
      essential: "Nur essentiell",
    },
    fr: {
      title: "Nous respectons votre vie privée",
      message:
        "Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, analyser le trafic du site et personnaliser le contenu. Vos données Tesla sont traitées en toute sécurité et ne sont jamais partagées avec des tiers.",
      accept: "Tout accepter",
      decline: "Refuser",
      settings: "Paramètres des cookies",
      essential: "Essentiel uniquement",
    },
    es: {
      title: "Respetamos tu privacidad",
      message:
        "Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el tráfico del sitio y personalizar el contenido. Tus datos de Tesla se procesan de forma segura y nunca se comparten con terceros.",
      accept: "Aceptar todo",
      decline: "Rechazar",
      settings: "Configuración de cookies",
      essential: "Solo esenciales",
    },
    it: {
      title: "Rispettiamo la tua privacy",
      message:
        "Utilizziamo cookie e tecnologie simili per migliorare la tua esperienza, analizzare il traffico del sito e personalizzare i contenuti. I tuoi dati Tesla vengono elaborati in modo sicuro e non vengono mai condivisi con terze parti.",
      accept: "Accetta tutto",
      decline: "Rifiuta",
      settings: "Impostazioni cookie",
      essential: "Solo essenziali",
    },
  };

  // Fallback to English for unsupported languages
  return texts[langCode] || texts["en"];
}

export function GDPRBanner({ locale }: GDPRBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Only show for EU locales
    if (!isEULocale(locale)) {
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

  const text = getGDPRText(locale);

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
                  {text.title}
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
            {text.message}
          </p>

          {showSettings ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Essential Cookies</span>
                  <span className="text-green-600 font-medium">Always On</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Analytics</span>
                  <span className="text-gray-500">Optional</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Marketing</span>
                  <span className="text-gray-500">Optional</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  Back
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEssentialOnly}
                >
                  {text.essential}
                </Button>
                <Button size="sm" onClick={handleAcceptAll}>
                  {text.accept}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={handleDecline}>
                {text.decline}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                {text.settings}
              </Button>
              <Button size="sm" onClick={handleAcceptAll}>
                {text.accept}
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
