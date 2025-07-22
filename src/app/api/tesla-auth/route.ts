import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Rate limiting - simple in-memory store (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

// Types for Tesla API responses
interface TeslaAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

interface TeslaVehicle {
  id: number;
  vin: string;
  display_name: string;
  state: string;
  vehicle_config: {
    car_type: string;
    trim_badging: string;
  };
}

interface TeslaBatteryData {
  battery_level: number; // Current State of Charge (SoC) as percentage
  usable_battery_level: number; // Usable battery percentage
  charge_energy_added: number; // Energy added in last charging session (kWh)
  charge_limit_soc: number; // Charge limit setting
  est_battery_range: number; // Estimated range (unreliable for degradation)
  rated_battery_range: number; // EPA rated range (unreliable for degradation)
}

// Tesla VIN structure and decoding
interface TeslaVinData {
  model: "S" | "3" | "X" | "Y";
  bodyType: string;
  restraintSystem: string;
  driveUnit: string;
  trimLevel: string;
  year: number;
  assemblyPlant: "F" | "P" | "B" | "A" | string;
  assemblyLocation: string;
}

// Battery chemistry types
type BatteryChemistry = "NCA" | "NCM" | "LFP";
type BatterySupplier = "Panasonic" | "LG" | "CATL" | "Tesla" | "Unknown";

interface TeslaVehicleSpec {
  model: "S" | "3" | "X" | "Y";
  year_start: number;
  year_end?: number;
  assembly_plant: string[];
  trim: string;
  battery_capacity_kwh: number;
  usable_capacity_kwh?: number;
  battery_chemistry: BatteryChemistry;
  battery_supplier: BatterySupplier;
  market?: string[];
  vin_patterns?: {
    position_7?: string[]; // Drive unit patterns
    position_8?: string[]; // Trim patterns
  };
}

interface TeslaBatteryHealth {
  health_percentage: number;
  degradation_percentage: number;
  original_capacity_kwh: number;
  current_capacity_kwh: number;
  confidence_level: "high" | "medium" | "low";
  methodology: string;
  battery_chemistry: BatteryChemistry;
  battery_supplier: BatterySupplier;
  assembly_plant: string;
  estimated_range_loss_miles?: number;
}

// Comprehensive Tesla vehicle specifications database
const TESLA_VEHICLE_SPECS: TeslaVehicleSpec[] = [
  // Model S (2012-2024)
  {
    model: "S",
    year_start: 2012,
    year_end: 2015,
    assembly_plant: ["F"],
    trim: "60",
    battery_capacity_kwh: 60,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },
  {
    model: "S",
    year_start: 2012,
    year_end: 2016,
    assembly_plant: ["F"],
    trim: "75",
    battery_capacity_kwh: 75,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },
  {
    model: "S",
    year_start: 2012,
    year_end: 2016,
    assembly_plant: ["F"],
    trim: "85",
    battery_capacity_kwh: 85,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },
  {
    model: "S",
    year_start: 2015,
    year_end: 2016,
    assembly_plant: ["F"],
    trim: "90D",
    battery_capacity_kwh: 90,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },
  {
    model: "S",
    year_start: 2016,
    year_end: 2019,
    assembly_plant: ["F"],
    trim: "75D",
    battery_capacity_kwh: 75,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },
  {
    model: "S",
    year_start: 2016,
    year_end: 2019,
    assembly_plant: ["F"],
    trim: "100D",
    battery_capacity_kwh: 100,
    usable_capacity_kwh: 95,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },
  {
    model: "S",
    year_start: 2019,
    year_end: 2021,
    assembly_plant: ["F"],
    trim: "Long Range",
    battery_capacity_kwh: 100,
    usable_capacity_kwh: 95,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },
  {
    model: "S",
    year_start: 2021,
    assembly_plant: ["F"],
    trim: "Plaid",
    battery_capacity_kwh: 100,
    usable_capacity_kwh: 95,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },

  // Model 3 - Fremont (US Market)
  {
    model: "3",
    year_start: 2017,
    year_end: 2020,
    assembly_plant: ["F"],
    trim: "Standard Range",
    battery_capacity_kwh: 50,
    usable_capacity_kwh: 47,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },
  {
    model: "3",
    year_start: 2017,
    year_end: 2020,
    assembly_plant: ["F"],
    trim: "Long Range",
    battery_capacity_kwh: 75,
    usable_capacity_kwh: 72,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },
  {
    model: "3",
    year_start: 2018,
    assembly_plant: ["F"],
    trim: "Performance",
    battery_capacity_kwh: 75,
    usable_capacity_kwh: 72,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },
  {
    model: "3",
    year_start: 2020,
    assembly_plant: ["F"],
    trim: "Standard Range+",
    battery_capacity_kwh: 55,
    usable_capacity_kwh: 52,
    battery_chemistry: "LFP",
    battery_supplier: "CATL",
  },
  {
    model: "3",
    year_start: 2020,
    assembly_plant: ["F"],
    trim: "Long Range",
    battery_capacity_kwh: 82,
    usable_capacity_kwh: 77,
    battery_chemistry: "NCM",
    battery_supplier: "LG",
  },
  {
    model: "3",
    year_start: 2021,
    assembly_plant: ["F"],
    trim: "Performance",
    battery_capacity_kwh: 82,
    usable_capacity_kwh: 77,
    battery_chemistry: "NCM",
    battery_supplier: "LG",
  },

  // Model 3 - Shanghai (China/Export)
  {
    model: "3",
    year_start: 2020,
    assembly_plant: ["P"],
    trim: "Standard Range+",
    battery_capacity_kwh: 55,
    usable_capacity_kwh: 52,
    battery_chemistry: "LFP",
    battery_supplier: "CATL",
    market: ["CN", "EU", "AU"],
  },
  {
    model: "3",
    year_start: 2021,
    assembly_plant: ["P"],
    trim: "Long Range",
    battery_capacity_kwh: 78,
    usable_capacity_kwh: 75,
    battery_chemistry: "NCM",
    battery_supplier: "LG",
    market: ["CN", "EU", "AU"],
  },
  {
    model: "3",
    year_start: 2021,
    assembly_plant: ["P"],
    trim: "Performance",
    battery_capacity_kwh: 78,
    usable_capacity_kwh: 75,
    battery_chemistry: "NCM",
    battery_supplier: "LG",
    market: ["CN", "EU", "AU"],
  },
  {
    model: "3",
    year_start: 2022,
    assembly_plant: ["P"],
    trim: "RWD",
    battery_capacity_kwh: 60,
    usable_capacity_kwh: 57,
    battery_chemistry: "LFP",
    battery_supplier: "CATL",
    market: ["CN", "EU", "AU"],
  },

  // Model X
  {
    model: "X",
    year_start: 2015,
    year_end: 2016,
    assembly_plant: ["F"],
    trim: "90D",
    battery_capacity_kwh: 90,
    usable_capacity_kwh: 85,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },
  {
    model: "X",
    year_start: 2016,
    year_end: 2019,
    assembly_plant: ["F"],
    trim: "75D",
    battery_capacity_kwh: 75,
    usable_capacity_kwh: 72,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },
  {
    model: "X",
    year_start: 2016,
    year_end: 2019,
    assembly_plant: ["F"],
    trim: "100D",
    battery_capacity_kwh: 100,
    usable_capacity_kwh: 95,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },
  {
    model: "X",
    year_start: 2019,
    year_end: 2021,
    assembly_plant: ["F"],
    trim: "Long Range",
    battery_capacity_kwh: 100,
    usable_capacity_kwh: 95,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },
  {
    model: "X",
    year_start: 2021,
    assembly_plant: ["F"],
    trim: "Plaid",
    battery_capacity_kwh: 100,
    usable_capacity_kwh: 95,
    battery_chemistry: "NCA",
    battery_supplier: "Panasonic",
  },

  // Model Y - Fremont
  {
    model: "Y",
    year_start: 2020,
    assembly_plant: ["F"],
    trim: "Long Range",
    battery_capacity_kwh: 75,
    usable_capacity_kwh: 72,
    battery_chemistry: "NCM",
    battery_supplier: "LG",
  },
  {
    model: "Y",
    year_start: 2020,
    assembly_plant: ["F"],
    trim: "Performance",
    battery_capacity_kwh: 75,
    usable_capacity_kwh: 72,
    battery_chemistry: "NCM",
    battery_supplier: "LG",
  },
  {
    model: "Y",
    year_start: 2022,
    assembly_plant: ["F"],
    trim: "Long Range",
    battery_capacity_kwh: 82,
    usable_capacity_kwh: 77,
    battery_chemistry: "NCM",
    battery_supplier: "LG",
  },

  // Model Y - Shanghai
  {
    model: "Y",
    year_start: 2021,
    assembly_plant: ["P"],
    trim: "Standard Range",
    battery_capacity_kwh: 60,
    usable_capacity_kwh: 57,
    battery_chemistry: "LFP",
    battery_supplier: "CATL",
    market: ["CN"],
  },
  {
    model: "Y",
    year_start: 2021,
    assembly_plant: ["P"],
    trim: "Long Range",
    battery_capacity_kwh: 78,
    usable_capacity_kwh: 75,
    battery_chemistry: "NCM",
    battery_supplier: "LG",
    market: ["CN", "EU", "AU"],
  },
  {
    model: "Y",
    year_start: 2021,
    assembly_plant: ["P"],
    trim: "Performance",
    battery_capacity_kwh: 78,
    usable_capacity_kwh: 75,
    battery_chemistry: "NCM",
    battery_supplier: "LG",
    market: ["CN", "EU", "AU"],
  },

  // Model Y - Berlin
  {
    model: "Y",
    year_start: 2022,
    assembly_plant: ["B"],
    trim: "Long Range",
    battery_capacity_kwh: 82,
    usable_capacity_kwh: 77,
    battery_chemistry: "NCM",
    battery_supplier: "LG",
    market: ["EU"],
  },
  {
    model: "Y",
    year_start: 2022,
    assembly_plant: ["B"],
    trim: "Performance",
    battery_capacity_kwh: 82,
    usable_capacity_kwh: 77,
    battery_chemistry: "NCM",
    battery_supplier: "LG",
    market: ["EU"],
  },
  {
    model: "Y",
    year_start: 2024,
    assembly_plant: ["B"],
    trim: "Standard Range",
    battery_capacity_kwh: 60,
    usable_capacity_kwh: 57,
    battery_chemistry: "LFP",
    battery_supplier: "CATL",
    market: ["EU"],
  },

  // Model Y - Austin (4680 cells)
  {
    model: "Y",
    year_start: 2022,
    assembly_plant: ["A"],
    trim: "Long Range",
    battery_capacity_kwh: 82,
    usable_capacity_kwh: 77,
    battery_chemistry: "NCM",
    battery_supplier: "Tesla",
    market: ["US"],
  },
];

// Tesla API Configuration
const TESLA_AUTH_URL = "https://auth.tesla.com/oauth2/v3/token";
const TESLA_API_BASE = "https://fleet-api.prd.na.vn.cloud.tesla.com"; // Fleet API endpoint

// Fleet API credentials from environment
const TESLA_CLIENT_ID = process.env.TESLA_CLIENT_ID;
const TESLA_CLIENT_SECRET = process.env.TESLA_CLIENT_SECRET;
const TESLA_REDIRECT_URI = process.env.TESLA_REDIRECT_URI;

// Mock Tesla data for development/testing
const MOCK_TESLA_VEHICLES = [
  {
    id: 12345,
    vin: "5YJ3E1EA4PF000001", // Shanghai Model 3 LFP
    display_name: "Tesla Model 3",
    state: "online",
    vehicle_config: {
      car_type: "Model 3",
      trim_badging: "Standard Range+",
    },
  },
  {
    id: 12346,
    vin: "7SAYGDEE9MF000001", // Fremont Model S
    display_name: "Tesla Model S",
    state: "online",
    vehicle_config: {
      car_type: "Model S",
      trim_badging: "Plaid",
    },
  },
  {
    id: 12347,
    vin: "5YJYGDEE2BF000001", // Berlin Model Y
    display_name: "Tesla Model Y",
    state: "online",
    vehicle_config: {
      car_type: "Model Y",
      trim_badging: "Long Range",
    },
  },
  {
    id: 12348,
    vin: "5YJXCAE2XPF000001", // Shanghai Model Y LFP
    display_name: "Tesla Model Y",
    state: "online",
    vehicle_config: {
      car_type: "Model Y",
      trim_badging: "Standard Range",
    },
  },
];

const MOCK_BATTERY_DATA: { [key: number]: TeslaBatteryData } = {
  12345: {
    // Shanghai Model 3 LFP - Good condition
    battery_level: 78,
    usable_battery_level: 92,
    charge_energy_added: 42.5,
    charge_limit_soc: 90,
    est_battery_range: 220,
    rated_battery_range: 240,
  },
  12346: {
    // Model S - Some degradation
    battery_level: 85,
    usable_battery_level: 88,
    charge_energy_added: 65.2,
    charge_limit_soc: 90,
    est_battery_range: 350,
    rated_battery_range: 405,
  },
  12347: {
    // Berlin Model Y - Excellent condition
    battery_level: 82,
    usable_battery_level: 95,
    charge_energy_added: 55.8,
    charge_limit_soc: 100,
    est_battery_range: 310,
    rated_battery_range: 330,
  },
  12348: {
    // Shanghai Model Y LFP - Moderate degradation
    battery_level: 65,
    usable_battery_level: 85,
    charge_energy_added: 38.2,
    charge_limit_soc: 90,
    est_battery_range: 200,
    rated_battery_range: 244,
  },
};

// Mock user database for testing different scenarios
const MOCK_USERS = {
  "test@example.com": {
    password: "testpass123",
    vehicles: [MOCK_TESLA_VEHICLES[0]], // Shanghai Model 3
  },
  "owner@tesla.com": {
    password: "tesla123",
    vehicles: MOCK_TESLA_VEHICLES, // All vehicles
  },
  "degraded@example.com": {
    password: "battery123",
    vehicles: [MOCK_TESLA_VEHICLES[3]], // Degraded Model Y
  },
  "premium@example.com": {
    password: "plaid123",
    vehicles: [MOCK_TESLA_VEHICLES[1]], // Model S Plaid
  },
};

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  if (!clientData) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (now > clientData.resetTime) {
    // Reset the rate limit window
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }

  clientData.count++;
  return true;
}

// Tesla VIN decoder
function decodeTeslaVin(vin: string): TeslaVinData {
  if (vin.length !== 17) {
    throw new Error("Invalid VIN length");
  }

  const model = vin.charAt(3) as "S" | "3" | "X" | "Y";
  const bodyType = vin.charAt(4);
  const restraintSystem = vin.charAt(5);
  const driveUnit = vin.charAt(6);
  const trimLevel = vin.charAt(7);
  const yearCode = vin.charAt(9);
  const assemblyPlant = vin.charAt(10);
  const year = getYearFromVinCode(yearCode);

  const assemblyLocations: { [key: string]: string } = {
    F: "Fremont, CA, USA",
    P: "Shanghai, China (Giga Shanghai)",
    B: "Berlin, Germany (Giga Berlin)",
    A: "Austin, TX, USA (Giga Texas)",
  };

  return {
    model,
    bodyType,
    restraintSystem,
    driveUnit,
    trimLevel,
    year,
    assemblyPlant,
    assemblyLocation:
      assemblyLocations[assemblyPlant] || "Unknown Assembly Plant",
  };
}

// Convert VIN year code to actual year
function getYearFromVinCode(code: string): number {
  const yearCodes: { [key: string]: number } = {
    A: 2010,
    B: 2011,
    C: 2012,
    D: 2013,
    E: 2014,
    F: 2015,
    G: 2016,
    H: 2017,
    J: 2018,
    K: 2019,
    L: 2020,
    M: 2021,
    N: 2022,
    P: 2023,
    R: 2024,
    S: 2025,
    T: 2026,
    V: 2027,
    W: 2028,
    X: 2029,
    Y: 2030,
  };
  return yearCodes[code.toUpperCase()] || 2020; // Default to 2020 if unknown
}

// Get vehicle specification with comprehensive VIN-based lookup
function getVehicleSpecification(
  vehicle: TeslaVehicle
): TeslaVehicleSpec | null {
  const vinData = decodeTeslaVin(vehicle.vin);

  // Find matching specifications
  const matchingSpecs = TESLA_VEHICLE_SPECS.filter((spec) => {
    return (
      spec.model === vinData.model &&
      vinData.year >= spec.year_start &&
      (!spec.year_end || vinData.year <= spec.year_end) &&
      spec.assembly_plant.includes(vinData.assemblyPlant)
    );
  });

  if (matchingSpecs.length === 0) {
    console.warn(`No specification found for VIN: ${vehicle.vin}`);
    return null;
  }

  // If multiple specs match, use trim badging to narrow down
  if (matchingSpecs.length > 1) {
    const trimBadge = vehicle.vehicle_config?.trim_badging?.toLowerCase() || "";

    // Try to match trim exactly
    for (const spec of matchingSpecs) {
      if (
        trimBadge.includes(spec.trim.toLowerCase()) ||
        spec.trim.toLowerCase().includes(trimBadge)
      ) {
        return spec;
      }
    }

    // Try to match common patterns
    if (trimBadge.includes("performance")) {
      const perfSpec = matchingSpecs.find((s) =>
        s.trim.toLowerCase().includes("performance")
      );
      if (perfSpec) return perfSpec;
    }

    if (trimBadge.includes("long range") || trimBadge.includes("dual motor")) {
      const lrSpec = matchingSpecs.find((s) =>
        s.trim.toLowerCase().includes("long range")
      );
      if (lrSpec) return lrSpec;
    }

    if (
      trimBadge.includes("standard") ||
      trimBadge.includes("single motor") ||
      trimBadge.includes("rwd")
    ) {
      const srSpec = matchingSpecs.find(
        (s) =>
          s.trim.toLowerCase().includes("standard") ||
          s.trim.toLowerCase().includes("rwd")
      );
      if (srSpec) return srSpec;
    }

    console.warn(`Multiple specs found for ${vehicle.vin}, using first match`);
  }

  return matchingSpecs[0];
}

// Get original battery capacity with comprehensive VIN decoding
function getOriginalBatteryCapacity(vehicle: TeslaVehicle): number {
  const spec = getVehicleSpecification(vehicle);

  if (spec) {
    return spec.battery_capacity_kwh;
  }

  // Fallback to basic mapping for unknown vehicles
  const vinData = decodeTeslaVin(vehicle.vin);
  const basicCapacityMap: { [key: string]: number } = {
    S: 100,
    "3": 75,
    X: 100,
    Y: 75,
  };

  console.warn(`Using fallback capacity for ${vehicle.vin}`);
  return basicCapacityMap[vinData.model] || 75;
}

// Estimate base range for range loss calculation
function getEstimatedRange(
  model: string,
  capacity: number,
  chemistry: BatteryChemistry
): number {
  // Approximate EPA range estimates based on model and capacity
  const rangeEstimates: { [key: string]: { [key: number]: number } } = {
    S: { 75: 259, 85: 265, 90: 270, 100: 405 },
    "3": { 50: 220, 55: 240, 75: 310, 78: 340, 82: 358 },
    X: { 75: 237, 90: 257, 100: 348 },
    Y: { 60: 244, 75: 326, 78: 330, 82: 330 },
  };

  const modelRanges = rangeEstimates[model] || rangeEstimates["3"];
  const baseRange = modelRanges[capacity] || modelRanges[75] || 300;

  // LFP batteries typically have slightly lower range efficiency
  return chemistry === "LFP" ? baseRange * 0.95 : baseRange;
}

// Advanced battery health calculation accounting for different battery chemistries
function calculateBatteryHealth(
  batteryData: TeslaBatteryData,
  vehicle: TeslaVehicle
): TeslaBatteryHealth {
  const originalCapacity = getOriginalBatteryCapacity(vehicle);
  const spec = getVehicleSpecification(vehicle);
  const vinData = decodeTeslaVin(vehicle.vin);

  const currentSoC = batteryData.battery_level;
  const usableAtCurrentSoC = batteryData.usable_battery_level;

  // Get battery chemistry and supplier info
  const batteryChemistry = spec?.battery_chemistry || "NCM";
  const batterySupplier = spec?.battery_supplier || "Unknown";

  let estimatedCurrentCapacity: number;
  let methodology: string;
  let confidenceLevel: "high" | "medium" | "low" = "medium";

  // Different calculation methods based on battery chemistry
  if (batteryChemistry === "LFP") {
    // LFP battery calculation (CATL cells, mainly Shanghai/Berlin)
    const lfpBufferFactor = 0.95; // LFP typically has smaller buffer
    estimatedCurrentCapacity =
      (usableAtCurrentSoC / lfpBufferFactor) * (originalCapacity / 100);
    methodology = "LFP Battery Analysis (CATL chemistry)";

    // LFP batteries are more accurate across wider SoC range
    if (currentSoC > 20 && currentSoC < 90) {
      confidenceLevel = "high";
    } else if (currentSoC < 10 || currentSoC > 95) {
      confidenceLevel = "low";
    }
  } else {
    // NCA/NCM battery calculation (Panasonic/LG cells)
    let bufferFactor: number;
    if (batterySupplier === "Panasonic") {
      bufferFactor = 0.9; // Panasonic cells tend to have larger buffers
      methodology = "NCA Battery Analysis (Panasonic cells)";
    } else if (batterySupplier === "LG") {
      bufferFactor = 0.92; // LG cells have moderate buffers
      methodology = "NCM Battery Analysis (LG Chem cells)";
    } else {
      bufferFactor = 0.91; // Generic buffer for other suppliers
      methodology = "NCM/NCA Battery Analysis (Generic)";
    }

    estimatedCurrentCapacity =
      (usableAtCurrentSoC / bufferFactor) * (originalCapacity / 100);

    // NCA/NCM batteries are most accurate in mid-range SoC
    if (currentSoC > 30 && currentSoC < 90) {
      confidenceLevel = "high";
    } else if (currentSoC < 20 || currentSoC > 95) {
      confidenceLevel = "low";
    }
  }

  // Calculate health metrics
  const healthPercentage = Math.min(
    (estimatedCurrentCapacity / originalCapacity) * 100,
    100
  );
  const degradationPercentage = Math.max(100 - healthPercentage, 0);

  // Estimate range loss
  const baseRange = getEstimatedRange(
    spec?.model || vinData.model,
    originalCapacity,
    batteryChemistry
  );
  const estimatedRangeLoss = (degradationPercentage / 100) * baseRange;

  // Add assembly plant context to methodology
  const plantInfo = vinData.assemblyLocation;
  const enhancedMethodology = `${methodology} - Vehicle from ${plantInfo}`;

  return {
    health_percentage: Math.round(healthPercentage * 10) / 10,
    degradation_percentage: Math.round(degradationPercentage * 10) / 10,
    original_capacity_kwh: originalCapacity,
    current_capacity_kwh: Math.round(estimatedCurrentCapacity * 10) / 10,
    confidence_level: confidenceLevel,
    methodology: enhancedMethodology,
    battery_chemistry: batteryChemistry,
    battery_supplier: batterySupplier,
    assembly_plant: plantInfo,
    estimated_range_loss_miles: Math.round(estimatedRangeLoss),
  };
}

// Mock Tesla API Client for development/testing
class MockTeslaApiClient {
  private user: { password: string; vehicles: TeslaVehicle[] };

  constructor(user: { password: string; vehicles: TeslaVehicle[] }) {
    this.user = user;
  }

  static async authenticate(
    email: string,
    password: string
  ): Promise<TeslaAuthResponse> {
    console.log(`Mock authentication for ${email}`);

    // Simulate network delay
    await new Promise((resolve) =>
      setTimeout(resolve, 100 + Math.random() * 400)
    );

    const mockUser = MOCK_USERS[email as keyof typeof MOCK_USERS];
    if (!mockUser || mockUser.password !== password) {
      throw new Error("Tesla authentication failed: Invalid credentials");
    }

    return {
      access_token: `mock_token_${Date.now()}`,
      token_type: "Bearer",
      expires_in: 3600,
      refresh_token: `mock_refresh_${Date.now()}`,
    };
  }

  async getVehicles(): Promise<TeslaVehicle[]> {
    console.log("Mock: Fetching vehicles");
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.user.vehicles;
  }

  async wakeVehicle(vehicleId: number): Promise<void> {
    console.log(`Mock: Waking up vehicle ${vehicleId}`);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate wake time
  }

  async getBatteryData(vehicleId: number): Promise<TeslaBatteryData> {
    console.log(`Mock: Getting battery data for vehicle ${vehicleId}`);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const batteryData = MOCK_BATTERY_DATA[vehicleId];
    if (!batteryData) {
      throw new Error(`No battery data found for vehicle ${vehicleId}`);
    }

    return batteryData;
  }
}

// Real Tesla API Client using Fleet API
class TeslaApiClient {
  private accessToken: string;
  private apiBase: string;

  constructor(accessToken: string, apiBase: string = TESLA_API_BASE) {
    this.accessToken = accessToken;
    this.apiBase = apiBase;
  }

  // Authenticate using Fleet API with client credentials (mock for development)
  static async authenticate(): Promise<TeslaAuthResponse> {
    console.log("Starting Tesla Fleet API authentication...");

    if (!TESLA_CLIENT_ID || !TESLA_CLIENT_SECRET) {
      throw new Error("Tesla Fleet API credentials not configured");
    }

    try {
      const response = await fetch(TESLA_AUTH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "CertMyBattery/2.0",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: TESLA_CLIENT_ID,
          client_secret: TESLA_CLIENT_SECRET,
          scope: "openid email offline_access",
        }),
      });

      console.log(`Tesla Fleet API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Tesla Fleet API failed: ${response.status} - ${errorText}`
        );
        throw new Error(
          `Tesla authentication failed: ${response.status} ${response.statusText}`
        );
      }

      const authData = await response.json();
      console.log("Tesla Fleet API authentication successful");
      return authData;
    } catch (error) {
      console.error("Tesla Fleet API error:", error);
      throw error;
    }
  }

  // Get user's vehicles
  async getVehicles(): Promise<TeslaVehicle[]> {
    const response = await fetch(`${this.apiBase}/api/1/vehicles`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "User-Agent": "CertMyBattery/1.0",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Fleet API vehicles error: ${response.status} - ${errorText}`
      );
      throw new Error(
        `Failed to fetch vehicles: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.response;
  }

  // Wake up vehicle (required before data access)
  async wakeVehicle(vehicleId: number): Promise<void> {
    // First check if vehicle is already awake
    const vehicleResponse = await fetch(
      `${this.apiBase}/api/1/vehicles/${vehicleId}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "User-Agent": "CertMyBattery/1.0",
        },
      }
    );

    if (vehicleResponse.ok) {
      const vehicleData = await vehicleResponse.json();
      if (vehicleData.response?.state === "online") {
        return; // Already awake
      }
    }

    // Wake up the vehicle using Fleet API endpoint
    const response = await fetch(
      `${this.apiBase}/api/1/vehicles/${vehicleId}/wake_up`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "User-Agent": "CertMyBattery/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to wake vehicle: ${response.statusText}`);
    }

    // Wait for vehicle to wake up with retry logic
    const maxRetries = 6; // 30 seconds max
    for (let i = 0; i < maxRetries; i++) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds

      const checkResponse = await fetch(
        `${this.apiBase}/vehicles/${vehicleId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "User-Agent": "CertMyBattery/1.0",
          },
        }
      );

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        if (checkData.response?.state === "online") {
          return; // Vehicle is awake
        }
      }
    }

    throw new Error("Vehicle failed to wake up within 30 seconds");
  }

  // Get battery and charging data using Fleet API
  async getBatteryData(vehicleId: number): Promise<TeslaBatteryData> {
    const response = await fetch(
      `${this.apiBase}/api/1/vehicles/${vehicleId}/vehicle_data`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "User-Agent": "CertMyBattery/1.0",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Fleet API battery data error: ${response.status} - ${errorText}`
      );
      throw new Error(
        `Failed to fetch battery data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const vehicleData = data.response;
    
    // Extract charge state from vehicle_data response
    const chargeState = vehicleData.charge_state;
    if (!chargeState) {
      throw new Error("No charge state data found in vehicle data");
    }
    
    // Map Fleet API response to our TeslaBatteryData interface
    return {
      battery_level: chargeState.battery_level,
      usable_battery_level: chargeState.usable_battery_level,
      charge_energy_added: chargeState.charge_energy_added || 0,
      charge_limit_soc: chargeState.charge_limit_soc,
      est_battery_range: chargeState.est_battery_range,
      rated_battery_range: chargeState.rated_battery_range,
    };
  }
}

// GET handler for health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "tesla-auth",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  });
}

// POST handler for Tesla authentication and battery check
export async function POST(request: NextRequest) {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Get client IP for rate limiting
  const clientIp =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Rate limiting check
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: "Please wait a minute before trying again",
      },
      { status: 429, headers: { ...headers, "Retry-After": "60" } }
    );
  }

  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          details:
            parseError instanceof Error
              ? parseError.message
              : "Unknown parse error",
        },
        { status: 400, headers }
      );
    }

    // 1. OAuth initialization request
    if (requestBody.action === "start_oauth") {
      console.log("Starting Tesla OAuth flow...");

      if (!TESLA_CLIENT_ID || !TESLA_REDIRECT_URI) {
        return NextResponse.json(
          {
            error: "OAuth not configured",
            message:
              "Tesla OAuth credentials are not properly configured. Using demo mode instead.",
            oauth_available: false,
          },
          { status: 400, headers }
        );
      }

      // Create state with locale and other info
      const stateData = {
        locale: requestBody.locale || 'en-US',
        path: '/check',
        timestamp: Date.now(),
        nonce: crypto.randomUUID()
      }
      const state = Buffer.from(JSON.stringify(stateData)).toString('base64');
      const scopes =
        "openid offline_access vehicle_device_data vehicle_cmds vehicle_charging_cmds";

      const authUrl = new URL("https://auth.tesla.com/oauth2/v3/authorize");
      authUrl.searchParams.set("client_id", TESLA_CLIENT_ID);
      authUrl.searchParams.set("redirect_uri", TESLA_REDIRECT_URI);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("scope", scopes);
      authUrl.searchParams.set("state", state);
      authUrl.searchParams.set("prompt_missing_scopes", "true"); // Re-prompt for declined permissions

      return NextResponse.json(
        {
          auth_url: authUrl.toString(),
          state,
          oauth_available: true,
        },
        { headers }
      );
    }

    // 2. Get vehicles from Tesla API
    if (requestBody.action === "get_vehicles" && requestBody.access_token) {
      console.log("Fetching Tesla vehicles...");

      try {
        // Determine API URL from region/locale
        let apiUrl = "https://fleet-api.prd.na.vn.cloud.tesla.com"; // Default to NA
        if (requestBody.region) {
          if (requestBody.region === 'eu') {
            apiUrl = "https://fleet-api.prd.eu.vn.cloud.tesla.com";
          } else {
            apiUrl = "https://fleet-api.prd.na.vn.cloud.tesla.com";
          }
        } else if (requestBody.locale) {
          // Fallback: determine region from locale
          const { localeToRegion } = await import('@/lib/tesla-regions');
          const region = localeToRegion(requestBody.locale);
          apiUrl = region === 'eu' 
            ? "https://fleet-api.prd.eu.vn.cloud.tesla.com"
            : "https://fleet-api.prd.na.vn.cloud.tesla.com";
        }
        
        console.log(`Using Tesla API URL: ${apiUrl} for vehicles fetch`);
        
        // Create API client with access token and API URL
        const client = new TeslaApiClient(requestBody.access_token, apiUrl);

        // Get vehicles
        const vehicles = await client.getVehicles();

        return NextResponse.json(
          {
            success: true,
            vehicles: vehicles,
          },
          { headers }
        );
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch vehicles from Tesla API";

        return NextResponse.json(
          {
            success: false,
            error: errorMessage,
          },
          { status: 400, headers }
        );
      }
    }

    // 3. Process selected vehicle for battery check
    if (requestBody.action === "process_selected_vehicle" && requestBody.access_token && requestBody.vehicle_id) {
      console.log(`Processing battery check for vehicle ${requestBody.vehicle_id}...`);

      try {
        // Determine API URL from region/locale
        let apiUrl = "https://fleet-api.prd.na.vn.cloud.tesla.com"; // Default to NA
        if (requestBody.region) {
          if (requestBody.region === 'eu') {
            apiUrl = "https://fleet-api.prd.eu.vn.cloud.tesla.com";
          } else {
            apiUrl = "https://fleet-api.prd.na.vn.cloud.tesla.com";
          }
        } else if (requestBody.locale) {
          // Fallback: determine region from locale
          const { localeToRegion } = await import('@/lib/tesla-regions');
          const region = localeToRegion(requestBody.locale);
          apiUrl = region === 'eu' 
            ? "https://fleet-api.prd.eu.vn.cloud.tesla.com"
            : "https://fleet-api.prd.na.vn.cloud.tesla.com";
        }
        
        console.log(`Using Tesla API URL: ${apiUrl} for battery check`);
        
        // Create API client with access token and API URL
        const client = new TeslaApiClient(requestBody.access_token, apiUrl);

        // Get all vehicles to find the selected one
        const vehicles = await client.getVehicles();
        const selectedVehicle = vehicles.find(v => v.id.toString() === requestBody.vehicle_id);
        
        if (!selectedVehicle) {
          return NextResponse.json(
            {
              success: false,
              error: "Selected vehicle not found",
            },
            { status: 404, headers }
          );
        }

        // Wake up and get battery data for the selected vehicle
        await client.wakeVehicle(selectedVehicle.id);
        const batteryData = await client.getBatteryData(selectedVehicle.id);
        const batteryHealth = calculateBatteryHealth(batteryData, selectedVehicle);

        // Store assessment in database
        await supabase.from("assessments").insert({
          tesla_vin: selectedVehicle.vin,
          battery_health:
            batteryHealth.degradation_percentage < 10
              ? "Good"
              : batteryHealth.degradation_percentage < 15
              ? "Fair"
              : "Poor",
          degradation_percentage: batteryHealth.degradation_percentage,
          confidence_level: batteryHealth.confidence_level,
          created_at: new Date().toISOString(),
        });

        return NextResponse.json(
          {
            success: true,
            vehicle: {
              id: selectedVehicle.id,
              vin: selectedVehicle.vin,
              name: selectedVehicle.display_name,
              model: selectedVehicle.vehicle_config?.car_type || "Unknown",
              trim: selectedVehicle.vehicle_config?.trim_badging || "Standard",
            },
            battery_data: {
              current_charge: batteryData.battery_level,
              usable_level: batteryData.usable_battery_level,
              charge_limit: batteryData.charge_limit_soc,
            },
            battery_health: batteryHealth,
            timestamp: new Date().toISOString(),
          },
          { headers }
        );
      } catch (error) {
        console.error("Failed to process selected vehicle:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to process battery check";

        return NextResponse.json(
          {
            success: false,
            error: errorMessage,
          },
          { status: 400, headers }
        );
      }
    }

    // 4. Process access token from callback
    if (requestBody.action === "process_token" && requestBody.access_token) {
      console.log("Processing Tesla access token...");

      try {
        // Determine API URL from region/locale
        let apiUrl = "https://fleet-api.prd.na.vn.cloud.tesla.com"; // Default to NA
        if (requestBody.region) {
          if (requestBody.region === 'eu') {
            apiUrl = "https://fleet-api.prd.eu.vn.cloud.tesla.com";
          } else {
            apiUrl = "https://fleet-api.prd.na.vn.cloud.tesla.com";
          }
        } else if (requestBody.locale) {
          // Fallback: determine region from locale
          const { localeToRegion } = await import('@/lib/tesla-regions');
          const region = localeToRegion(requestBody.locale);
          apiUrl = region === 'eu' 
            ? "https://fleet-api.prd.eu.vn.cloud.tesla.com"
            : "https://fleet-api.prd.na.vn.cloud.tesla.com";
        }
        
        // Create API client with access token and API URL
        const client = new TeslaApiClient(requestBody.access_token, apiUrl);

        // Get vehicles and process battery data
        const vehicles = await client.getVehicles();

        if (vehicles.length === 0) {
          return NextResponse.json(
            { error: "No vehicles found in your Tesla account" },
            { status: 404, headers }
          );
        }

        const vehicle = vehicles[0];
        const batteryData = await client.getBatteryData(vehicle.id);
        const batteryHealth = calculateBatteryHealth(batteryData, vehicle);

        // Store assessment
        await supabase.from("assessments").insert({
          tesla_vin: vehicle.vin,
          battery_health:
            batteryHealth.degradation_percentage < 10
              ? "Good"
              : batteryHealth.degradation_percentage < 15
              ? "Fair"
              : "Poor",
          degradation_pct: batteryHealth.degradation_percentage,
          user_agent: request.headers.get("user-agent") || null,
        });

        return NextResponse.json(
          {
            success: true,
            vehicle: {
              id: vehicle.id,
              vin: vehicle.vin,
              name: vehicle.display_name,
              model: vehicle.vehicle_config.car_type,
              trim: vehicle.vehicle_config.trim_badging,
            },
            battery_data: {
              current_charge: batteryData.battery_level,
              usable_level: batteryData.usable_battery_level,
              charge_limit: batteryData.charge_limit_soc,
            },
            battery_health: batteryHealth,
            timestamp: new Date().toISOString(),
          },
          { headers }
        );
      } catch (error) {
        console.error("Token processing error:", error);
        return NextResponse.json(
          {
            error: "Failed to process Tesla data",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 400, headers }
        );
      }
    }

    // 3. OAuth callback handling (legacy - remove this eventually)
    if (requestBody.action === "oauth_callback" && requestBody.code) {
      console.log("Processing OAuth callback...");

      try {
        // Determine API URL from locale
        let apiUrl = "https://fleet-api.prd.na.vn.cloud.tesla.com"; // Default to NA
        if (requestBody.locale) {
          // Import the function here to avoid circular imports
          const { localeToRegion, getTeslaApiUrl } = await import("@/lib/tesla-regions");
          const region = localeToRegion(requestBody.locale);
          apiUrl = getTeslaApiUrl(region);
        }

        console.log(`Using Tesla API URL: ${apiUrl} for locale: ${requestBody.locale}`);

        // Exchange authorization code for tokens
        const tokenResponse = await fetch(
          "https://auth.tesla.com/oauth2/v3/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: TESLA_CLIENT_ID!,
              client_secret: TESLA_CLIENT_SECRET!,
              code: requestBody.code,
              audience: apiUrl,
              redirect_uri: TESLA_REDIRECT_URI!,
            }),
          }
        );

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          throw new Error(
            `Token exchange failed: ${tokenResponse.status} - ${errorText}`
          );
        }

        const tokens = await tokenResponse.json();

        // Create API client with access token and correct API URL
        const client = new TeslaApiClient(tokens.access_token, apiUrl);

        // Get vehicles and process battery data
        const vehicles = await client.getVehicles();

        if (vehicles.length === 0) {
          return NextResponse.json(
            { error: "No vehicles found in your Tesla account" },
            { status: 404, headers }
          );
        }

        const vehicle = vehicles[0];
        const batteryData = await client.getBatteryData(vehicle.id);
        const batteryHealth = calculateBatteryHealth(batteryData, vehicle);

        // Store assessment
        await supabase.from("assessments").insert({
          tesla_vin: vehicle.vin,
          battery_health:
            batteryHealth.degradation_percentage < 10
              ? "Good"
              : batteryHealth.degradation_percentage < 15
              ? "Fair"
              : "Poor",
          degradation_pct: batteryHealth.degradation_percentage,
          user_agent: request.headers.get("user-agent") || null,
        });

        return NextResponse.json(
          {
            success: true,
            vehicle: {
              id: vehicle.id,
              vin: vehicle.vin,
              name: vehicle.display_name,
              model: vehicle.vehicle_config.car_type,
              trim: vehicle.vehicle_config.trim_badging,
            },
            battery_data: {
              current_charge: batteryData.battery_level,
              usable_level: batteryData.usable_battery_level,
              charge_limit: batteryData.charge_limit_soc,
            },
            battery_health: batteryHealth,
            timestamp: new Date().toISOString(),
          },
          { headers }
        );
      } catch (error) {
        console.error("OAuth callback error:", error);
        return NextResponse.json(
          {
            error: "OAuth authentication failed",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 400, headers }
        );
      }
    }

    // 3. Development mock mode - no credentials required
    console.log("Using development mock mode with mock access token...");

    // Create mock user for development/testing
    const mockUser = {
      id: "mock_user_dev",
      name: "Development Tesla Owner",
      email: "dev@tesla.com",
      password: "", // Not used
      vehicles: [
        {
          id: 12345,
          vin: "5YJ3E1EB4JF000001",
          display_name: "My Model 3",
          state: "online",
          vehicle_config: {
            car_type: "model3",
            trim_badging: "long_range",
          },
          battery_specs: {
            original_capacity_kwh: 75,
            chemistry: "LFP",
            manufacture_year: 2023,
            assembly_plant: "Shanghai",
          },
          mock_battery_data: {
            battery_level: 84,
            usable_battery_level: 69,
            charge_limit_soc: 90,
            charge_energy_added: 25.5,
            est_battery_range: 280,
            rated_battery_range: 358,
          },
        },
      ],
    };

    // Use mock API client
    const client = new MockTeslaApiClient(mockUser);
    console.log("Mock: Fetching vehicles...");
    const vehicles = await client.getVehicles();

    if (vehicles.length === 0) {
      return NextResponse.json(
        {
          error: "No vehicles found in your Tesla account",
        },
        { status: 404, headers }
      );
    }

    // For MVP, use the first vehicle (later we'll let user choose)
    const vehicle = vehicles[0];

    // Wake up vehicle
    console.log(`Waking up vehicle ${vehicle.display_name}...`);
    await client.wakeVehicle(vehicle.id);

    // Get battery data
    console.log("Fetching battery data...");
    const batteryData = await client.getBatteryData(vehicle.id);

    // Calculate battery health
    const batteryHealth = calculateBatteryHealth(batteryData, vehicle);

    // Store assessment in Supabase (anonymous for now)
    try {
      const { error: dbError } = await supabase.from("assessments").insert({
        tesla_vin: vehicle.vin,
        battery_health:
          batteryHealth.degradation_percentage < 10
            ? "Good"
            : batteryHealth.degradation_percentage < 15
            ? "Fair"
            : "Poor",
        degradation_pct: batteryHealth.degradation_percentage,
        user_agent: request.headers.get("user-agent") || null,
      });

      if (dbError) {
        console.error("Failed to store assessment:", dbError);
        // Don't fail the request if DB storage fails
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    // Return comprehensive response
    return NextResponse.json(
      {
        success: true,
        vehicle: {
          id: vehicle.id,
          vin: vehicle.vin,
          name: vehicle.display_name,
          model: vehicle.vehicle_config.car_type,
          trim: vehicle.vehicle_config.trim_badging,
        },
        battery_data: {
          current_charge: batteryData.battery_level,
          usable_level: batteryData.usable_battery_level,
          charge_limit: batteryData.charge_limit_soc,
        },
        battery_health: batteryHealth,
        timestamp: new Date().toISOString(),
      },
      { headers }
    );
  } catch (error) {
    console.error("Tesla API Error:", error);

    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes("authentication failed")) {
        return NextResponse.json(
          {
            error: "Tesla authentication failed",
            message: "Please check your Tesla account credentials",
          },
          { status: 401, headers }
        );
      }

      if (error.message.includes("No vehicles found")) {
        return NextResponse.json(
          {
            error: "No vehicles found",
            message: "No Tesla vehicles found in your account",
          },
          { status: 404, headers }
        );
      }

      if (error.message.includes("wake up")) {
        return NextResponse.json(
          {
            error: "Vehicle wake up timeout",
            message:
              "Your Tesla is taking longer than usual to respond. Please try again.",
          },
          { status: 408, headers }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Service temporarily unavailable",
        message:
          "We're experiencing technical difficulties. Please try again later.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: 500, headers }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
