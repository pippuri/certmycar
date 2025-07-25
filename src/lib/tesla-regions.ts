export type TeslaRegion = "na" | "eu";

// All supported locales with English as fallback language
export const NA_LOCALES = [
  "en-US",
  "en-CA",
  "en-MX",
  "en-JP",
  "en-KR",
  "en-AU",
  "en-TW",
  "en-NZ",
  "en-HK",
  "en-MY",
  "en-TH",
  "en-PH",
];
export const EU_LOCALES = [
  "en-GB",
  "en-NO",
  "en-NL",
  "en-DE",
  "en-FR",
  "en-IT",
  "en-ES",
  "en-SE",
  "en-DK",
  "en-FI",
  "en-BE",
  "en-AT",
  "en-CH",
  "en-IE",
  "en-LU",
  "en-PT",
  "en-IS",
  "en-SI",
  "en-EE",
  "en-LV",
  "en-LT",
  "en-CZ",
  "en-SK",
  "en-HU",
  "en-PL",
  "en-HR",
  "en-BG",
  "en-RO",
  "en-GR",
  "en-CY",
  "en-MT",
  "en-AE",
  "en-IL",
  "en-ZA",
];

export interface TeslaRegionInfo {
  code: TeslaRegion;
  name: string;
  apiUrl: string;
  countries: string[];
  description: string;
}

export const TESLA_REGIONS: Record<TeslaRegion, TeslaRegionInfo> = {
  na: {
    code: "na",
    name: "North America & Asia-Pacific",
    apiUrl: "https://fleet-api.prd.na.vn.cloud.tesla.com",
    countries: [
      "US",
      "CA",
      "MX",
      "PR",
      "JP",
      "KR",
      "AU",
      "TW",
      "NZ",
      "HK",
      "MO",
      "MY",
      "TH",
      "PH",
    ],
    description:
      "United States, Canada, Mexico, Japan, Korea, Australia, and other Asia-Pacific countries",
  },
  eu: {
    code: "eu",
    name: "Europe, Middle East & Africa",
    apiUrl: "https://fleet-api.prd.eu.vn.cloud.tesla.com",
    countries: [
      "GB",
      "NO",
      "NL",
      "DE",
      "FR",
      "IT",
      "ES",
      "SE",
      "DK",
      "FI",
      "BE",
      "AT",
      "CH",
      "IE",
      "LU",
      "PT",
      "IS",
      "SI",
      "EE",
      "LV",
      "LT",
      "CZ",
      "SK",
      "HU",
      "PL",
      "HR",
      "BG",
      "RO",
      "GR",
      "CY",
      "MT",
      "AE",
      "IL",
      "ZA",
    ],
    description: "Europe, Middle East, and Africa",
  },
};

/**
 * Detect Tesla region based on user's timezone and locale for Next.js i18n
 */
export function detectTeslaRegionForLocale(): TeslaRegion {
  // Try to detect from browser APIs if available
  if (typeof window !== "undefined") {
    try {
      // Get timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // European timezones
      if (
        timezone.includes("Europe/") ||
        timezone.includes("Africa/") ||
        timezone.includes("Asia/Jerusalem") ||
        timezone.includes("Asia/Dubai")
      ) {
        return "eu";
      }

      // Get locale/language
      const locale = navigator.language || navigator.languages?.[0] || "";

      // European locales
      const europeanLocales = [
        "de",
        "fr",
        "it",
        "es",
        "nl",
        "sv",
        "da",
        "no",
        "fi",
        "pl",
        "pt",
        "cs",
        "sk",
        "hu",
        "hr",
        "bg",
        "ro",
        "el",
        "et",
        "lv",
        "lt",
        "sl",
        "mt",
        "ga",
        "eu",
        "ca",
        "gl",
      ];

      if (
        europeanLocales.some((lang) => locale.toLowerCase().startsWith(lang))
      ) {
        return "eu";
      }

      // UK specific
      if (
        locale.toLowerCase().includes("gb") ||
        locale.toLowerCase().includes("uk")
      ) {
        return "eu";
      }
    } catch (error) {
      console.warn("Failed to detect region from browser APIs:", error);
    }
  }

  // Default to North America (largest Tesla market)
  return "na";
}

/**
 * Legacy function - use Next.js locale instead
 * @deprecated Use Next.js locale from useRouter() instead
 */
export function detectTeslaRegion(): TeslaRegion {
  return detectTeslaRegionForLocale();
}

/**
 * Get region info by country code (if we have geolocation)
 */
export function getRegionByCountry(countryCode: string): TeslaRegion {
  const upperCode = countryCode.toUpperCase();

  for (const [regionCode, region] of Object.entries(TESLA_REGIONS)) {
    if (region.countries.includes(upperCode)) {
      return regionCode as TeslaRegion;
    }
  }

  // Default to North America
  return "na";
}

/**
 * Get Tesla Fleet API URL for a region
 */
export function getTeslaApiUrl(region: TeslaRegion): string {
  return TESLA_REGIONS[region].apiUrl;
}

/**
 * Convert Next.js locale to Tesla region
 */
export function localeToRegion(locale: string): TeslaRegion {
  if (EU_LOCALES.includes(locale)) return "eu";
  return "na"; // Default to NA for any unlisted locale
}

/**
 * Get default locale for a Tesla region
 */
export function getDefaultLocaleForRegion(region: TeslaRegion): string {
  if (region === "eu") return "en-GB";
  return "en-US";
}

/**
 * Format region name for display (legacy function - uses hardcoded English)
 * @deprecated Use formatRegionNameWithTranslations instead
 */
export function formatRegionName(region: TeslaRegion): string {
  return TESLA_REGIONS[region].name;
}

/**
 * Format region name using translations
 * This function should be used with the getTranslations function from next-intl
 */
export function formatRegionNameWithTranslations(
  region: TeslaRegion,
  t: (key: string) => string
): string {
  return t(`regions.${region}`);
}
