"use client";

import React, { useState } from "react";
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
}

export default function TeslaCheckPageClient({
  region,
  regionName,
  locale,
  links,
}: TeslaCheckPageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BatteryHealthResult | null>(null);
  const [canRetry, setCanRetry] = useState(false);

  // Helper function to determine if user should see miles (US, UK, AU) vs km (rest of world)
  const usesMiles =
    locale.startsWith("en-US") ||
    locale.startsWith("en-GB") ||
    locale.startsWith("en-AU");

  const handleTeslaOAuth = async () => {
    console.log("Tesla OAuth button clicked");
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
  React.useEffect(() => {
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
        setError("Failed to process Tesla authentication results");
        setIsLoading(false);
      }
    }
  }, []);

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
                Back to Home
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
                    Battery Degradation
                  </div>
                  <div
                    className={`text-8xl font-black mb-2 ${getHealthColor(
                      100 - result.battery_health.degradation_percentage
                    )}`}
                  >
                    {result.battery_health.degradation_percentage}%
                  </div>
                  <div className="text-xl font-semibold text-gray-700 mb-4">
                    Battery Health:{" "}
                    {result.battery_health.degradation_percentage < 10
                      ? "Excellent"
                      : result.battery_health.degradation_percentage < 15
                      ? "Good"
                      : "Fair"}
                  </div>
                </div>

                {/* Basic Metrics Only */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {result.battery_health.current_capacity_kwh} kWh
                    </div>
                    <div className="text-sm text-gray-600">
                      Current Capacity
                    </div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-700 mb-1">
                      {result.battery_health.original_capacity_kwh} kWh
                    </div>
                    <div className="text-sm text-gray-600">
                      Original Capacity
                    </div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {result.battery_data.current_charge}%
                    </div>
                    <div className="text-sm text-gray-600">Current Charge</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monetization Section */}
            <Card className="p-8 bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Get Your Official Certificate
                  </h2>
                  <p className="text-blue-100 text-lg">
                    Turn your results into a verified document that increases
                    your Tesla&apos;s value
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">
                      What You Got FREE
                    </h3>
                    <div className="space-y-2 text-blue-100">
                      <div>✓ Battery degradation percentage</div>
                      <div>✓ Current capacity data</div>
                      <div>✓ Current charge level</div>
                    </div>
                  </div>

                  <div className="text-center border-l border-blue-400 pl-8">
                    <h3 className="text-xl font-semibold mb-4">
                      Official Certificate ($10)
                    </h3>
                    <div className="space-y-2 text-white">
                      <div>
                        ✓ <strong>Dated PDF Certificate with VIN</strong>
                      </div>
                      <div>
                        ✓ <strong>Certificate Verification for buyers</strong>
                      </div>
                      <div>
                        ✓ <strong>Option for a physical certificate</strong>
                      </div>
                      <div>
                        ✓ <strong>Peer Comparison vs Similar Vehicles</strong>
                      </div>
                      <div>
                        ✓ <strong>Performance Tier Ranking</strong>
                      </div>
                      <div>
                        ✓ <strong>Legal Document Status</strong>
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
                    <Link href={`/${locale}/certificate/${result.certificate_id}?vin=${result.vehicle.vin}`}>
                      View Certificate Preview
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 border-white text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href={links.check}>Check Another Tesla</Link>
                  </Button>
                </div>

                <div className="text-center mt-6">
                  <p className="text-blue-100 text-sm">
                    💎 Instant download • 🔒 Secure payment • 📄 Valid for
                    resale
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
              Back to Home
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
                Check Your Battery Health
              </h1>
              <p className="text-gray-600 mb-2">
                Connect your Tesla account to get an instant battery health
                assessment
              </p>
              {regionName && (
                <div className="text-center">
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    Using Tesla {regionName} servers
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs text-gray-500 underline"
                    asChild
                  >
                    <Link href={links.region}>
                      Wrong region? Change it here
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
                      Connecting to Tesla...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Connect with Tesla Account
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
                            Connecting to Tesla...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="mr-2 h-5 w-5" />
                            Try Again
                          </>
                        )}
                      </Button>
                      <p className="text-sm text-gray-600 mt-2">
                        Tesla may remember your session and connect faster
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
                    Your Security is Our Priority
                  </h4>
                  <ul className="text-green-800 space-y-1">
                    <li>• We never store your Tesla credentials</li>
                    <li>• Connection is encrypted and secure</li>
                    <li>• We only access battery data, nothing else</li>
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
                  <div className="font-medium">Secure Connection</div>
                  <div>256-bit encryption</div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-xs text-gray-600">
                  <div className="font-medium">No Storage</div>
                  <div>Credentials not saved</div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-xs text-gray-600">
                  <div className="font-medium">Instant Results</div>
                  <div>30 seconds or less</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
