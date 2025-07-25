"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CreditCard, Loader2 } from "lucide-react";
import { getPricingForLocale } from "@/lib/stripe-products-client";

interface CertificatePaymentProps {
  certificateId: string;
  locale: string;
  vehicleName?: string;
  translations?: {
    payment_required: string;
    certificate_description: string;
    pricing_description: string;
    pricing_loading: string;
    pricing_error: string;
    certificate_price: string;
    payment_button: string;
    payment_processing: string;
    loading: string;
    secure_payment: string;
  };
}

export function CertificatePayment({
  certificateId,
  locale,
  vehicleName,
  translations,
}: CertificatePaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pricing, setPricing] = useState<{
    price: number;
    currency: string;
    formattedPrice: string;
    productName: string;
    description: string | null;
    priceId: string;
  } | null>(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState(true);

  // Fallback translations for backward compatibility
  const t = translations || {
    payment_required: "Payment Required",
    certificate_description: "This certificate requires payment to unlock the full verified report.",
    pricing_description: "Get your official Tesla battery health certificate with verification QR code and fraud protection.",
    pricing_loading: "Loading...",
    pricing_error: "Failed to load pricing information",
    certificate_price: "Certificate Price",
    payment_button: "Complete Payment",
    payment_processing: "Processing...",
    loading: "Loading...",
    secure_payment: "Secure payment powered by Stripe • Instant access after payment • Email receipt included"
  };

  // Load pricing from database
  useEffect(() => {
    async function loadPricing() {
      try {
        const pricingData = await getPricingForLocale(locale);
        setPricing(pricingData);
      } catch (error) {
        console.error("Failed to load pricing:", error);
        setError(t.pricing_error);
      } finally {
        setIsLoadingPricing(false);
      }
    }

    loadPricing();
  }, [locale, t.pricing_error]);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          certificateId,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment failed");
      }

      // Handle case where certificate already exists
      if (data.message === "Certificate already exists") {
        window.location.href = data.url;
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-8 border-yellow-200 bg-yellow-50">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-yellow-800">{t.payment_required}</h3>
        </div>

        <div className="mb-4">
          <p className="text-yellow-700 text-sm mb-2">
            {t.certificate_description}
          </p>
          <p className="text-yellow-700 text-sm mb-4">
            {t.pricing_description}{" "}
            {vehicleName ? `for ${vehicleName}` : ""}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-yellow-600 mb-1">{t.certificate_price}</p>
            {isLoadingPricing ? (
              <p className="text-2xl font-bold text-yellow-800">{t.pricing_loading}</p>
            ) : pricing ? (
              <p className="text-2xl font-bold text-yellow-800">
                {pricing.formattedPrice}
              </p>
            ) : (
              <p className="text-2xl font-bold text-yellow-800">$9.99</p>
            )}
          </div>

          <Button
            onClick={handlePayment}
            disabled={isLoading || isLoadingPricing || !pricing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t.payment_processing}
              </>
            ) : isLoadingPricing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t.loading}
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                {t.payment_button}
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-yellow-200">
          <p className="text-xs text-yellow-600">
            {t.secure_payment}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
