import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function calculateBatteryHealth(
  currentCapacity: number,
  originalCapacity: number
) {
  const health = (currentCapacity / originalCapacity) * 100;
  return Math.round(health * 10) / 10; // Round to 1 decimal place
}

export function getVehicleSpecs(vin: string) {
  // Mock vehicle specifications based on VIN
  // In real implementation, this would look up actual Tesla specs
  const model = vin.charAt(3) || "3"; // Tesla VIN position 4 indicates model
  
  const mockSpecs = {
    model: model === "S" ? "Model S" : model === "X" ? "Model X" : model === "Y" ? "Model Y" : "Model 3",
    year: 2022,
    batteryCapacity: model === "S" || model === "X" ? 100 : 75, // kWh
    range: model === "S" ? 405 : model === "X" ? 348 : model === "Y" ? 326 : 358, // miles EPA
  };

  return mockSpecs;
}
