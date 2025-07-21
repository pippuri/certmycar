import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function calculateBatteryHealth(
  currentCapacity: number,
  originalCapacity: number
): {
  degradationPct: number;
  health: "Good" | "Fair" | "Poor";
} {
  const degradationPct = Math.round(
    ((originalCapacity - currentCapacity) / originalCapacity) * 100
  );

  let health: "Good" | "Fair" | "Poor";
  if (degradationPct < 10) {
    health = "Good";
  } else if (degradationPct < 20) {
    health = "Fair";
  } else {
    health = "Poor";
  }

  return { degradationPct, health };
}

export function getVehicleSpecs(model: string, year: number): number | null {
  // Vehicle specifications lookup - this would normally come from database
  const specs: Record<string, Record<number, number>> = {
    "Model S": {
      2012: 85,
      2013: 85,
      2014: 85,
      2015: 90,
      2016: 100,
      2017: 100,
      2018: 100,
      2019: 100,
      2020: 100,
      2021: 100,
      2022: 100,
      2023: 100,
      2024: 100,
    },
    "Model 3": {
      2017: 75,
      2018: 75,
      2019: 75,
      2020: 82,
      2021: 82,
      2022: 82,
      2023: 82,
      2024: 82,
    },
    "Model X": {
      2015: 90,
      2016: 100,
      2017: 100,
      2018: 100,
      2019: 100,
      2020: 100,
      2021: 100,
      2022: 100,
      2023: 100,
      2024: 100,
    },
    "Model Y": {
      2020: 82,
      2021: 82,
      2022: 82,
      2023: 82,
      2024: 82,
    },
  };

  return specs[model]?.[year] || null;
}
