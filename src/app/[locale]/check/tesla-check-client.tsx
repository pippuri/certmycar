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
  Info,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { getTeslaApiUrl } from "@/lib/tesla-regions";

interface BatteryHealthResult {
  success: boolean;
  vehicle: {
    id: number;
    vin: string;
    name: string;
    model: string;
    trim: string;
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
  region: any;
  regionName: string;
  links: any;
}

export default function TeslaCheckPageClient({ 
  region, 
  regionName, 
  links 
}: TeslaCheckPageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BatteryHealthResult | null>(null);

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
      setError(
        err instanceof Error ? err.message : "OAuth initialization failed"
      );
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
      setError(decodeURIComponent(error));
      setIsLoading(false);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (success === "true" && data) {
      // Handle successful OAuth with Tesla data
      try {
        const teslaData = JSON.parse(decodeURIComponent(data));
        setResult(teslaData);
        setIsLoading(false);
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

  const getHealthColor = (percentage: number) => {
    if (percentage >= 95) return "text-green-600";
    if (percentage >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthStatus = (percentage: number) => {
    if (percentage >= 95) return "Excellent";
    if (percentage >= 90) return "Good";
    if (percentage >= 80) return "Fair";
    return "Poor";
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
            {/* Main Result Card */}
            <Card className="p-8 text-center shadow-xl">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div
                    className={`text-6xl font-bold mb-2 ${getHealthColor(
                      result.battery_health.health_percentage
                    )}`}
                  >
                    {result.battery_health.health_percentage}%
                  </div>
                  <div className="text-2xl font-semibold text-gray-700 mb-2">
                    Battery Health:{" "}
                    {getHealthStatus(result.battery_health.health_percentage)}
                  </div>
                  <div className="text-gray-600">
                    {result.battery_health.degradation_percentage}% degradation
                    detected
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.battery_health.current_capacity_kwh} kWh
                    </div>
                    <div className="text-sm text-gray-600">
                      Current Capacity
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">
                      {result.battery_health.original_capacity_kwh} kWh
                    </div>
                    <div className="text-sm text-gray-600">
                      Original Capacity
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {result.battery_data.current_charge}%
                    </div>
                    <div className="text-sm text-gray-600">Current Charge</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Info */}
            <Card className="p-6">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">
                  Vehicle Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Vehicle:</span>{" "}
                    {result.vehicle.name}
                  </div>
                  <div>
                    <span className="font-medium">Model:</span>{" "}
                    {result.vehicle.model} {result.vehicle.trim}
                  </div>
                  <div>
                    <span className="font-medium">VIN:</span>{" "}
                    {result.vehicle.vin}
                  </div>
                  <div>
                    <span className="font-medium">Assessment Date:</span>{" "}
                    {new Date(result.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Battery Technology Info */}
            <Card className="p-6">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">
                  Battery Technology
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Chemistry & Supplier
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Battery Chemistry:</span>{" "}
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {result.battery_health.battery_chemistry}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Battery Supplier:</span>{" "}
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {result.battery_health.battery_supplier}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Assembly Plant:</span>{" "}
                        <span className="text-gray-600">
                          {result.battery_health.assembly_plant}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Range Impact
                    </h4>
                    <div className="space-y-2 text-sm">
                      {result.battery_health.estimated_range_loss_miles && (
                        <div>
                          <span className="font-medium">
                            Estimated Range Loss:
                          </span>{" "}
                          <span
                            className={`font-semibold ${
                              result.battery_health.estimated_range_loss_miles <
                              20
                                ? "text-green-600"
                                : result.battery_health
                                    .estimated_range_loss_miles < 50
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            ~{result.battery_health.estimated_range_loss_miles}{" "}
                            miles
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Confidence Level:</span>{" "}
                        <span
                          className={`capitalize px-2 py-1 rounded text-xs ${
                            result.battery_health.confidence_level === "high"
                              ? "bg-green-100 text-green-800"
                              : result.battery_health.confidence_level ===
                                "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.battery_health.confidence_level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Methodology Info */}
            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Assessment Methodology
                    </h4>
                    <p className="text-sm text-gray-600">
                      {result.battery_health.methodology}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Download Verified Certificate ($9.99)
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                asChild
              >
                <Link href={links.check}>Check Another Tesla</Link>
              </Button>
            </div>
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
                Check Your Tesla Battery Health
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
                <p className="text-sm text-gray-600 mt-2">
                  Secure OAuth authentication with Tesla
                </p>
              </div>

              {error && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
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