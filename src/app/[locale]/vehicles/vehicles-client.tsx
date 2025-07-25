"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2, AlertTriangle, Zap } from "lucide-react";
import { Logo } from "@/components/logo";
import { VehicleCard } from "@/components/vehicle-card";

interface Vehicle {
  id: string;
  name: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  batteryLevel: number;
  range: number;
  isCharging: boolean;
  lastSeen: string;
  image: string;
  mileage?: number;
  temperature?: number;
  state?: string;
}

interface TeslaVehicle {
  id: number;
  id_s?: string;
  vin: string;
  display_name?: string;
  state?: string; // Tesla vehicle connectivity state: online, asleep, offline
  vehicle_config?: {
    car_type?: string;
    exterior_color?: string;
    trim_badging?: string;
  };
  vehicle_state?: {
    timestamp?: string;
    geocoded_location?: string;
  };
  charge_state?: {
    battery_level?: number;
    rated_battery_range?: number;
    est_battery_range?: number;
    charging_state?: string;
    battery_heater_on?: boolean;
  };
}

interface SessionData {
  vehicles: TeslaVehicle[];
  access_token: string;
  region: string;
  locale: string;
}

interface VehicleSelectionClientProps {
  locale: string;
  translations?: {
    back_to_login: string;
    loading: {
      title: string;
      description: string;
    };
    page: {
      title: string;
      subtitle: string;
    };
    checking_battery: string;
    no_vehicles: {
      title: string;
      description: string;
      try_again: string;
    };
    info_cards: {
      instant_analysis: {
        title: string;
        description: string;
      };
      detailed_report: {
        title: string;
        description: string;
      };
      verified_certificate: {
        title: string;
        description: string;
      };
    };
    errors: {
      failed_to_load: string;
      failed_battery_check: string;
    };
    vehicle_card: {
      charging: string;
      online: string;
      asleep: string;
      offline: string;
      asleep_can_wake: string;
      miles: string;
      kilometers: string;
      vin: string;
      battery_level: string;
      range: string;
      temperature: string;
      last_seen: string;
      odometer: string;
    };
  };
}

export default function VehicleSelectionClient({
  locale,
  translations,
}: VehicleSelectionClientProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCheckingBattery, setIsCheckingBattery] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  // Fallback translations for backward compatibility
  const t = translations || {
    back_to_login: "Back to Login",
    loading: {
      title: "Loading Your Vehicles...",
      description: "Fetching your Tesla vehicles from your account",
    },
    page: {
      title: "Select Your Tesla",
      subtitle:
        "Choose the vehicle you'd like to check. We'll analyze its battery health in just 30 seconds.",
    },
    checking_battery: "Checking Battery Health...",
    no_vehicles: {
      title: "No Vehicles Found",
      description:
        "We couldn't find any Tesla vehicles associated with your account. Please make sure you have vehicles registered to your Tesla account.",
      try_again: "Try Again",
    },
    info_cards: {
      instant_analysis: {
        title: "Instant Analysis",
        description: "Get your battery health results in 30 seconds",
      },
      detailed_report: {
        title: "Detailed Report",
        description: "Analysis with degradation percentage and capacity data",
      },
      verified_certificate: {
        title: "Verified Certificate",
        description:
          "Optional $10 verified certificate for buying/selling protection",
      },
    },
    errors: {
      failed_to_load: "Failed to load your vehicles. Please try again.",
      failed_battery_check: "Failed to check battery health. Please try again.",
    },
    vehicle_card: {
      charging: "Charging",
      online: "Online",
      asleep: "Asleep",
      offline: "Offline",
      asleep_can_wake: "Asleep (Can Wake)",
      miles: "miles",
      kilometers: "km",
      vin: "VIN",
      battery_level: "Battery Level",
      range: "Range",
      temperature: "Temperature",
      last_seen: "Last Seen",
      odometer: "Odometer",
    },
  };

  // Function to decode year from VIN (10th character)
  const decodeYearFromVIN = (vin: string): number => {
    if (!vin || vin.length < 10) return 2020; // fallback

    const yearChar = vin.charAt(9); // 10th character (0-indexed)

    // VIN year decoding rules:
    // 1981-2000: B=1981, C=1982, ..., Y=2000 (excluding I, O, Q, U, Z)
    // 2001-2009: 1=2001, 2=2002, ..., 9=2009
    // 2010-2030: A=2010, B=2011, ..., Y=2030 (excluding I, O, Q, U, Z)

    if (yearChar >= "1" && yearChar <= "9") {
      return 2000 + parseInt(yearChar);
    }

    if (yearChar >= "A" && yearChar <= "Y") {
      // Skip I, O, Q, U, Z
      const excludedChars = ["I", "O", "Q", "U", "Z"];
      if (excludedChars.includes(yearChar)) return 2020;

      // A=2010, B=2011, ..., Y=2030
      const yearOffset = yearChar.charCodeAt(0) - "A".charCodeAt(0);
      return 2010 + yearOffset;
    }

    return 2020; // fallback
  };

  // Map Tesla API vehicle to UI Vehicle interface
  const mapTeslaVehicle = (teslaVehicle: TeslaVehicle): Vehicle => {
    // Debug: Log Tesla vehicle data
    console.log("=== MAPPING TESLA VEHICLE ===");
    console.log("Raw Tesla Vehicle:", JSON.stringify(teslaVehicle, null, 2));

    // Extract model info from vehicle_config or fallback to basic info
    const config = teslaVehicle.vehicle_config || {};
    const state = teslaVehicle.vehicle_state || {};
    const charge = teslaVehicle.charge_state || {};

    console.log("Vehicle state from API:", teslaVehicle.state);
    console.log("Has charge_state:", !!charge.battery_level);
    console.log("Has vehicle_state:", !!state.timestamp);

    // Determine model from vehicle_config.car_type or fallback
    let model = "Tesla";
    if (config.car_type) {
      model = config.car_type
        .replace("models", "Model S")
        .replace("model3", "Model 3")
        .replace("modely", "Model Y")
        .replace("modelx", "Model X");
    }

    // Generate vehicle name: use display_name or create one
    const displayName =
      teslaVehicle.display_name ||
      `${model} ${teslaVehicle.vin?.slice(-6) || ""}`;

    const mappedVehicle = {
      id: teslaVehicle.id?.toString() || teslaVehicle.id_s || "",
      name: displayName,
      model: model,
      year: decodeYearFromVIN(teslaVehicle.vin || ""),
      color: config.exterior_color || "Unknown",
      vin: teslaVehicle.vin || "",
      batteryLevel: charge.battery_level || 0,
      range: Math.round(
        charge.rated_battery_range || charge.est_battery_range || 0
      ),
      isCharging: charge.charging_state === "Charging",
      lastSeen: state.timestamp ? "Recently" : "Unknown", // TODO: Format timestamp properly
      image: "/tesla/tesla-card.webp", // Default image
      // mileage removed - only available from vehicle_data API call, not vehicles list
      temperature: charge.battery_heater_on ? 72 : undefined, // Rough estimate
      state: teslaVehicle.state || "unknown", // Tesla vehicle connectivity state
    };

    console.log("Mapped Vehicle:", JSON.stringify(mappedVehicle, null, 2));
    console.log("=== END MAPPING ===");

    return mappedVehicle;
  };

  // Load vehicles from URL data (from Tesla auth callback) or fetch from API
  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        // Check if we have session data from Tesla auth callback
        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get("data");

        if (dataParam) {
          // Parse session data from auth callback
          const sessionInfo = JSON.parse(decodeURIComponent(dataParam));
          setSessionData(sessionInfo);

          // Map Tesla vehicles to UI format
          const mappedVehicles = sessionInfo.vehicles.map(mapTeslaVehicle);
          setVehicles(mappedVehicles);
        } else {
          // Fallback to mock data for development
          const mockVehicles: Vehicle[] = [
            {
              id: "1",
              name: "My Tesla",
              model: "Model 3",
              year: decodeYearFromVIN("5YJ3E1EA4NF123456"), // 2023 from VIN (N = 14th letter)
              color: "Pearl White",
              vin: "5YJ3E1EA4NF123456",
              batteryLevel: 85,
              range: 298,
              isCharging: false,
              lastSeen: "2 hours ago",
              image: "/tesla/tesla-card.webp",
              // mileage removed - not available in vehicle list
              temperature: 72,
              state: "online",
            },
            {
              id: "2",
              name: "Work Tesla",
              model: "Model Y",
              year: decodeYearFromVIN("7SAYGDEF8PF654321"), // 2025 from VIN (P = 16th letter)
              color: "Midnight Silver Metallic",
              vin: "7SAYGDEF8PF654321",
              batteryLevel: 42,
              range: 168,
              isCharging: true,
              lastSeen: "30 minutes ago",
              image: "/tesla/tesla-card.webp",
              // mileage removed - not available in vehicle list
              temperature: 68,
              state: "asleep",
            },
            {
              id: "3",
              name: "Weekend Ride",
              model: "Model S",
              year: decodeYearFromVIN("5YJSA1E4XMF789012"), // 2024 from VIN (M = 13th letter)
              color: "Deep Blue Metallic",
              vin: "5YJSA1E4XMF789012",
              batteryLevel: 91,
              range: 405,
              isCharging: false,
              lastSeen: "1 day ago",
              image: "/tesla/tesla-card.webp",
              // mileage removed - not available in vehicle list
              state: "offline",
            },
          ];

          setVehicles(mockVehicles);
        }
      } catch {
        setError(t.errors.failed_to_load);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [mapTeslaVehicle]);

  const handleVehicleAndCheck = async (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    await handleCheckBattery(vehicleId);
  };

  const handleCheckBattery = async (vehicleId?: string) => {
    const targetVehicleId = vehicleId || selectedVehicleId;
    if (!targetVehicleId || !sessionData) return;

    setIsCheckingBattery(true);
    setError("");

    try {
      // Call Tesla API to get battery data for selected vehicle
      const response = await fetch("/api/tesla-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "process_selected_vehicle",
          access_token: sessionData.access_token,
          vehicle_id: targetVehicleId,
          region: sessionData.region,
          locale: sessionData.locale,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to check battery health");
      }

      const batteryData = await response.json();

      // Encode the battery data and redirect to results page
      const dataParam = encodeURIComponent(JSON.stringify(batteryData));
      window.location.href = `/${locale}/check?success=true&data=${dataParam}`;
    } catch (error) {
      console.error("Battery check error:", error);
      setError(
        error instanceof Error ? error.message : t.errors.failed_battery_check
      );
    } finally {
      setIsCheckingBattery(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Logo size="md" />
            <Button variant="outline" asChild>
              <Link href={`/${locale}/check`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.back_to_login}
              </Link>
            </Button>
          </div>

          <Card className="p-8 text-center shadow-xl">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t.loading.title}
              </h2>
              <p className="text-gray-600">{t.loading.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Logo size="md" />
          <Button variant="outline" asChild>
            <Link href={`/${locale}/check`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.back_to_login}
            </Link>
          </Button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t.page.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.page.subtitle}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Vehicle Grid */}
        {vehicles.length > 0 ? (
          <>
            <div
              className={`grid gap-6 mb-8 ${
                vehicles.length === 1
                  ? "grid-cols-1 max-w-md mx-auto"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isSelected={selectedVehicleId === vehicle.id}
                  onClick={() => handleVehicleAndCheck(vehicle.id)}
                  locale={locale}
                />
              ))}
            </div>

            {/* Status Message */}
            {isCheckingBattery && (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-lg font-medium">
                    {t.checking_battery}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* No Vehicles State */
          <Card className="p-8 text-center shadow-xl max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t.no_vehicles.title}
              </h2>
              <p className="text-gray-600 mb-6">{t.no_vehicles.description}</p>
              <Button variant="outline" asChild>
                <Link href={`/${locale}/check`}>{t.no_vehicles.try_again}</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t.info_cards.instant_analysis.title}
              </h3>
              <p className="text-sm text-gray-600">
                {t.info_cards.instant_analysis.description}
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t.info_cards.detailed_report.title}
              </h3>
              <p className="text-sm text-gray-600">
                {t.info_cards.detailed_report.description}
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t.info_cards.verified_certificate.title}
              </h3>
              <p className="text-sm text-gray-600">
                {t.info_cards.verified_certificate.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
