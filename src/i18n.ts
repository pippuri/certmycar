import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Define supported locales
export const locales = [
  "en-US", // English (US)
  "en-GB", // English (UK)
  "de-DE", // German (Germany)
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en-US";

// Locale labels for language switcher
export const localeLabels: Record<Locale, string> = {
  "en-US": "English (US)",
  "en-GB": "English (UK)",
  "de-DE": "Deutsch",
};

// Locale to country mapping for region detection
export const localeToCountry: Record<Locale, string> = {
  "en-US": "US",
  "en-GB": "GB",
  "de-DE": "DE",
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    locale: locale as Locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
