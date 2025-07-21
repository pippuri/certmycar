import { Handler } from "@netlify/functions";

// Types for Tesla API responses
interface TeslaVehicle {
  id: number;
  vin: string;
  display_name: string;
  model: string;
  year: number;
}

interface TeslaBatteryData {
  charge_state: {
    battery_level: number;
    usable_battery_level: number;
    charge_limit_soc: number;
  };
}

// Mock function - In production, this would call the actual Tesla API
async function getTeslaVehicles(token: string): Promise<TeslaVehicle[]> {
  // This is a mock implementation
  // In reality, you would call: https://owner-api.teslamotors.com/api/1/vehicles
  return [
    {
      id: 12345,
      vin: "5YJ3E1EB4JF000001",
      display_name: "My Tesla",
      model: "Model 3",
      year: 2023,
    },
  ];
}

// Mock function - In production, this would call the actual Tesla API
async function getBatteryData(
  token: string,
  vehicleId: number
): Promise<TeslaBatteryData> {
  // This is a mock implementation
  // In reality, you would call: https://owner-api.teslamotors.com/api/1/vehicles/{id}/vehicle_data
  return {
    charge_state: {
      battery_level: 84,
      usable_battery_level: 69,
      charge_limit_soc: 90,
    },
  };
}

function calculateBatteryHealth(batteryData: TeslaBatteryData, vin: string) {
  const currentSoC = batteryData.charge_state.battery_level;
  const availableEnergy = batteryData.charge_state.usable_battery_level;

  // Calculate total capacity based on current state
  const totalCapacity = availableEnergy / (currentSoC / 100);

  // Get original capacity (this would come from database in production)
  const originalCapacity = 82; // Model 3 LR example

  const degradation = (1 - totalCapacity / originalCapacity) * 100;
  const health = degradation < 10 ? "Good" : degradation < 15 ? "Fair" : "Poor";

  return {
    status: health,
    degradation: Math.round(degradation),
    currentCapacity: Math.round(totalCapacity),
    originalCapacity,
  };
}

export const handler: Handler = async (event, context) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { authUrl } = JSON.parse(event.body || "{}");

    if (!authUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing authUrl parameter" }),
      };
    }

    // Extract token from Tesla callback URL (mock implementation)
    const token = "mock-token-" + Date.now();

    // Get vehicle data via Tesla Owner API (mock)
    const vehicles = await getTeslaVehicles(token);
    if (vehicles.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "No vehicles found" }),
      };
    }

    const vehicle = vehicles[0];
    const batteryData = await getBatteryData(token, vehicle.id);

    // Calculate health using simple SoC method
    const health = calculateBatteryHealth(batteryData, vehicle.vin);

    // In production, store assessment in Supabase
    const assessment = {
      id: "assessment-" + Date.now(),
      tesla_vin: vehicle.vin,
      battery_health: health.status,
      degradation_pct: health.degradation,
      assessment_date: new Date().toISOString(),
      user_id: null, // Anonymous for now
      user_agent: event.headers["user-agent"],
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        assessment,
        vehicle: {
          id: vehicle.id,
          vin: vehicle.vin,
          model: vehicle.model,
          year: vehicle.year,
          display_name: vehicle.display_name,
        },
        battery_details: {
          current_capacity: health.currentCapacity,
          original_capacity: health.originalCapacity,
          degradation_pct: health.degradation,
          health_status: health.status,
        },
      }),
    };
  } catch (error) {
    console.error("Tesla auth error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to authenticate with Tesla",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
