"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Lock,
  Zap,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { getTeslaApiUrl } from "@/lib/tesla-regions";
import { analytics } from "@/lib/analytics";

interface BatteryHealthResult {
  success: boolean;
  certificate_id: string;
  vehicle: {
    id: number;
    vin: string;
    name: string;
    model: string;
    trim: string;
    odometer?: number;
  };
  battery_data: {
    current_charge: number;
    usable_level: number;
    charge_limit: number;
  };
  battery_health: {
    health_percentage: number;
    degradation_percentage: number;
    original_capacity_kwh: number;
    current_capacity_kwh: number;
    confidence_level: "high" | "medium" | "low";
    methodology: string;
    battery_chemistry: string;
    battery_supplier: string;
    assembly_plant: string;
    estimated_range_loss_miles?: number;
  };
  timestamp: string;
}

interface TeslaCheckPageClientProps {
  region: "na" | "eu";
  regionName: string;
  locale: string;
  links: {
    home: string;
    check: string;
    region: string;
    [key: string]: string;
  };
  translations?: {
    back_to_home: string;
    results: {
      battery_degradation: string;
      battery_health: string;
      excellent: string;
      good: string;
      fair: string;
      current_capacity: string;
      original_capacity: string;
      current_charge: string;
    };
    certificate_promo: {
      title: string;
      subtitle: string;
      free_section: {
        title: string;
        degradation: string;
        capacity: string;
        charge: string;
      };
      paid_section: {
        title: string;
        full_dataset: string;
        peer_comparison: string;
        pdf_certificate: string;
        authenticity: string;
        physical_option: string;
        performance_ranking: string;
      };
      purchase_button: string;
      sample_link: string;
      features: string;
    };
    auth_form: {
      title: string;
      subtitle: string;
      region_info: string;
      region_change: string;
      connect_button: string;
      connecting: string;
      try_again: string;
      retry_info: string;
    };
    security: {
      title: string;
      no_storage: string;
      encrypted: string;
      battery_only: string;
    };
    features: {
      secure_connection: {
        title: string;
        subtitle: string;
      };
      no_storage: {
        title: string;
        subtitle: string;
      };
      instant_results: {
        title: string;
        subtitle: string;
      };
    };
  };
}

export default function TeslaCheckPageClient({
  region,
  regionName,
  locale,
  links,
  translations,
}: TeslaCheckPageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BatteryHealthResult | null>(null);
  const [canRetry, setCanRetry] = useState(false);

  // Fallback translations for backward compatibility
  const t = translations || {
    back_to_home: "Back to Home",
    results: {
      battery_degradation: "Battery Degradation",
      battery_health: "Battery Health",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      current_capacity: "Current Capacity",
      original_capacity: "Original Capacity",
      current_charge: "Current Charge"
    },
    certificate_promo: {
      title: "Get Your Official Certificate",
      subtitle: "Turn your results into a verified document that increases your Tesla's value",
      free_section: {
        title: "What You Got FREE",
        degradation: "✓ Battery degradation percentage",
        capacity: "✓ Current capacity data",
        charge: "✓ Current charge level"
      },
      paid_section: {
        title: "Official Certificate ($10)",
        full_dataset: "✓ Full dataset for your vehicle",
        peer_comparison: "✓ Peer Comparison vs Similar Vehicles",
        pdf_certificate: "✓ Dated PDF Certificate with VIN",
        authenticity: "✓ Authenticity Verification for buyers",
        physical_option: "✓ Option for a physical certificate",
        performance_ranking: "✓ Performance Tier Ranking"
      },
      purchase_button: "Purchase Certificate",
      sample_link: "Sample Certificate",
      features: "💎 Instant download • 🔒 Secure payment • 📄 Valid for 3 months"
    },
    auth_form: {
      title: "Check Your Battery Health",
      subtitle: "Connect your Tesla account to get an instant battery health assessment",
      region_info: "Using Tesla {regionName} servers",
      region_change: "Wrong region? Change it here",
      connect_button: "Connect with Tesla Account",
      connecting: "Connecting to Tesla...",
      try_again: "Try Again",
      retry_info: "Tesla may remember your session and connect faster"
    },
    security: {
      title: "Your Security is Our Priority",
      no_storage: "• We never store your Tesla credentials",
      encrypted: "• Connection is encrypted and secure",
      battery_only: "• We only access battery data, nothing else"
    },
    features: {
      secure_connection: {
        title: "Secure Connection",
        subtitle: "256-bit encryption"
      },
      no_storage: {
        title: "No Storage",
        subtitle: "Credentials not saved"
      },
      instant_results: {
        title: "Instant Results",
        subtitle: "30 seconds or less"
      }
    }
  };


  const handleTeslaOAuth = async () => {
    console.log("Tesla OAuth button clicked");
    
    // Track Tesla connection attempt - don't break auth if analytics fails
    try {
      analytics.trackTeslaConnectionAttempt(region);
    } catch (analyticsError) {
      console.warn('Tesla connection attempt tracking failed:', analyticsError);
    }
    
    setIsLoading(true);
    setError("");

    try {
      console.log("Starting OAuth flow...");
      // Start OAuth flow
      const response = await fetch("/api/tesla-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "start_oauth",
          region: region,
          locale: locale,
          apiUrl: getTeslaApiUrl(region),
        }),
      });

      console.log("OAuth response status:", response.status);
      const data = await response.json();
      console.log("OAuth response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to start OAuth");
      }

      if (data.oauth_available && data.auth_url) {
        console.log("Redirecting to Tesla OAuth:", data.auth_url);
        // Store state for verification
        sessionStorage.setItem("tesla_oauth_state", data.state);
        // Redirect to Tesla OAuth
        window.location.href = data.auth_url;
      } else {
        console.log("OAuth not available, showing error");
        throw new Error(data.message || "OAuth not available");
      }
    } catch (err) {
      console.error("OAuth error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "OAuth initialization failed";
      setError(errorMessage);

      // Check if this is a timeout error that could benefit from retry
      if (
        errorMessage.includes("timeout") ||
        errorMessage.includes("sleeping")
      ) {
        setCanRetry(true);
      }

      setIsLoading(false);
    }
  };

  // Handle OAuth callback results when returning from Tesla
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const data = urlParams.get("data");
    const error = urlParams.get("error");

    if (error) {
      // Handle OAuth error
      const errorMessage = decodeURIComponent(error);
      setError(errorMessage);

      // Check if this is a timeout error that could benefit from retry
      if (
        errorMessage.includes("timeout") ||
        errorMessage.includes("sleeping") ||
        errorMessage.includes("taking longer")
      ) {
        setCanRetry(true);
      }

      setIsLoading(false);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (success === "true" && data) {
      // Handle successful OAuth with Tesla data
      try {
        const teslaData = JSON.parse(decodeURIComponent(data));
        
        // Track Tesla connection success - don't break results if analytics fails
        try {
          const vehicleCount = teslaData.vehicle ? 1 : 0;
          analytics.trackTeslaConnectionSuccess(region, vehicleCount);
          
          // Track battery analysis completion
          if (teslaData.battery_health) {
            analytics.trackBatteryAnalysisComplete(
              teslaData.vehicle?.model || 'Unknown',
              teslaData.battery_health.degradation_percentage,
              teslaData.battery_health.health_percentage > 90 ? 'excellent' : 
              teslaData.battery_health.health_percentage > 80 ? 'good' : 'fair',
              teslaData.battery_health.battery_chemistry || 'Unknown'
            );
          }
        } catch (analyticsError) {
          console.warn('Tesla success/analysis tracking failed:', analyticsError);
        }
        
        setResult(teslaData);
        setIsLoading(false);
        setCanRetry(false); // Clear retry state on success
        // Clean up URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } catch (parseError) {
        console.error("Failed to parse Tesla data:", parseError);
        
        // Track Tesla auth parsing error - don't break error handling if analytics fails
        try {
          analytics.trackTeslaConnectionError("Failed to parse Tesla data", region);
        } catch (analyticsError) {
          console.warn('Tesla error tracking failed:', analyticsError);
        }
        
        setError("Failed to process Tesla authentication results");
        setIsLoading(false);
      }
    }
  }, [region]);

  const handleRetry = async () => {
    console.log("Retrying Tesla OAuth...");
    setError("");
    setCanRetry(false);

    // Simply restart the OAuth flow - Tesla should remember the session
    await handleTeslaOAuth();
  };

  const getHealthColor = (percentage: number) => {
    if (percentage >= 95) return "text-green-600";
    if (percentage >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  // If we have results, show them
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Logo size="md" />
            <Button variant="outline" asChild>
              <Link href={links.home}>
                <ArrowLeft className="mr-2 h-4 w-4" />
{t.back_to_home}
              </Link>
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Simple Results Card */}
            <Card className="p-8 text-center shadow-xl">
              <CardContent className="pt-6">
                <div className="mb-8">
                  <div className="text-lg font-semibold text-gray-600 mb-2">
                    {t.results.battery_degradation}
                  </div>
                  <div
                    className={`text-8xl font-black mb-2 ${getHealthColor(
                      100 - result.battery_health.degradation_percentage
                    )}`}
                  >
                    {result.battery_health.degradation_percentage}%
                  </div>
                  <div className="text-xl font-semibold text-gray-700 mb-4">
                    {t.results.battery_health}:{" "}
                    {result.battery_health.degradation_percentage < 10
                      ? t.results.excellent
                      : result.battery_health.degradation_percentage < 15
                      ? t.results.good
                      : t.results.fair}
                  </div>
                </div>

                {/* Basic Metrics Only */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {result.battery_health.current_capacity_kwh} kWh
                    </div>
                    <div className="text-sm text-gray-600">
                      {t.results.current_capacity}
                    </div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-700 mb-1">
                      {result.battery_health.original_capacity_kwh} kWh
                    </div>
                    <div className="text-sm text-gray-600">
                      {t.results.original_capacity}
                    </div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {result.battery_data.current_charge}%
                    </div>
                    <div className="text-sm text-gray-600">{t.results.current_charge}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monetization Section */}
            <Card className="p-8 bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    {t.certificate_promo.title}
                  </h2>
                  <p className="text-blue-100 text-lg">
                    {t.certificate_promo.subtitle}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">
                      {t.certificate_promo.free_section.title}
                    </h3>
                    <div className="space-y-2 text-blue-100">
                      <div>{t.certificate_promo.free_section.degradation}</div>
                      <div>{t.certificate_promo.free_section.capacity}</div>
                      <div>{t.certificate_promo.free_section.charge}</div>
                    </div>
                  </div>

                  <div className="text-center border-l border-blue-400 pl-8">
                    <h3 className="text-xl font-semibold mb-4">
                      {t.certificate_promo.paid_section.title}
                    </h3>
                    <div className="space-y-2 text-white">
                      <div>
                        {t.certificate_promo.paid_section.full_dataset}
                      </div>
                      <div>
                        {t.certificate_promo.paid_section.peer_comparison}
                      </div>
                      <div>
                        {t.certificate_promo.paid_section.pdf_certificate}
                      </div>
                      <div>
                        {t.certificate_promo.paid_section.authenticity}
                      </div>
                      <div>
                        {t.certificate_promo.paid_section.physical_option}
                      </div>
                      <div>
                        {t.certificate_promo.paid_section.performance_ranking}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-50 font-bold"
                    asChild
                  >
                    <Link
                      href={`/api/checkout?certificate_id=${result.certificate_id}&vin=${result.vehicle.vin}&locale=${locale}`}
                      onClick={() => {
                        // Track certificate purchase intent
                        analytics.trackCertificatePurchaseIntent(
                          result.certificate_id,
                          result.vehicle.model,
                          10.00 // Price in USD
                        );
                      }}
                    >
                      {t.certificate_promo.purchase_button}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
                <div className="text-center">
                  {/* subtle link to check the sample */}
                  <p className="text-blue-100 text-sm">
                    See{" "}
                    <Link
                      href="/certificate/CMB-2025-DEF456JKL?vin=5YJYGDEE2BF000001"
                      className="underline"
                      target="_blank"
                    >
                      {t.certificate_promo.sample_link}
                    </Link>
                  </p>
                </div>

                <div className="text-center mt-6">
                  <p className="text-blue-100 text-sm">
                    {t.certificate_promo.features}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Authentication form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Logo size="md" />
          <Button variant="outline" asChild>
            <Link href={links.home}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.back_to_home}
            </Link>
          </Button>
        </div>

        {/* Main Form Card */}
        <Card className="p-8 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t.auth_form.title}
              </h1>
              <p className="text-gray-600 mb-2">
                {t.auth_form.subtitle}
              </p>
              {regionName && (
                <div className="text-center">
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    {t.auth_form.region_info.replace('{regionName}', regionName)}
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs text-gray-500 underline"
                    asChild
                  >
                    <Link href={links.region}>
                      {t.auth_form.region_change}
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <Button
                  type="button"
                  size="lg"
                  className="w-full text-lg py-6 bg-red-600 hover:bg-red-700"
                  onClick={handleTeslaOAuth}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t.auth_form.connecting}
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      {t.auth_form.connect_button}
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>

                  {canRetry && (
                    <div className="text-center">
                      <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        className="w-full text-lg py-6 border-blue-600 text-blue-600 hover:bg-blue-50"
                        onClick={handleRetry}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t.auth_form.connecting}
                          </>
                        ) : (
                          <>
                            <ArrowRight className="mr-2 h-5 w-5" />
                            {t.auth_form.try_again}
                          </>
                        )}
                      </Button>
                      <p className="text-sm text-gray-600 mt-2">
                        {t.auth_form.retry_info}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-medium text-green-900 mb-1">
                    {t.security.title}
                  </h4>
                  <ul className="text-green-800 space-y-1">
                    <li>{t.security.no_storage}</li>
                    <li>{t.security.encrypted}</li>
                    <li>{t.security.battery_only}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Privacy Features */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Lock className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-xs text-gray-600">
                  <div className="font-medium">{t.features.secure_connection.title}</div>
                  <div>{t.features.secure_connection.subtitle}</div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-xs text-gray-600">
                  <div className="font-medium">{t.features.no_storage.title}</div>
                  <div>{t.features.no_storage.subtitle}</div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-xs text-gray-600">
                  <div className="font-medium">{t.features.instant_results.title}</div>
                  <div>{t.features.instant_results.subtitle}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
