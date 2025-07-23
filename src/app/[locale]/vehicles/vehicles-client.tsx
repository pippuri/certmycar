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

export default function VehicleSelectionClient({ locale }: { locale: string }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCheckingBattery, setIsCheckingBattery] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

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
      year: 2020, // TODO: Extract from VIN properly
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
              year: 2022,
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
              year: 2023,
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
              year: 2021,
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
        setError("Failed to load your vehicles. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

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
        error instanceof Error
          ? error.message
          : "Failed to check battery health. Please try again."
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
                Back to Login
              </Link>
            </Button>
          </div>

          <Card className="p-8 text-center shadow-xl">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Loading Your Vehicles...
              </h2>
              <p className="text-gray-600">
                Fetching your Tesla vehicles from your account
              </p>
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
              Back to Login
            </Link>
          </Button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Select Your Tesla
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the vehicle you&apos;d like to check. We&apos;ll analyze its
            battery health in just 30 seconds.
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
                    Checking Battery Health...
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
                No Vehicles Found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn&apos;t find any Tesla vehicles associated with your
                account. Please make sure you have vehicles registered to your
                Tesla account.
              </p>
              <Button variant="outline" asChild>
                <Link href={`/${locale}/check`}>Try Again</Link>
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
                Instant Analysis
              </h3>
              <p className="text-sm text-gray-600">
                Get your battery health results in 30 seconds
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Detailed Report
              </h3>
              <p className="text-sm text-gray-600">
                Analysis with degradation percentage and capacity data
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Verified Certificate
              </h3>
              <p className="text-sm text-gray-600">
                Optional $10 verified certificate for buying/selling protection
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
