import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Define supported locales
export const locales = [
  "en-US", // English (US)
  "en-GB", // English (UK)
  "de-DE", // German (Germany)
  "es-ES", // Spanish (Spain)
  "fr-FR", // French (France)
  "it-IT", // Italian (Italy)
  "cs-CZ", // Czech (Czech Republic)
  "fi-FI", // Finnish (Finland)
  "nl-NL", // Dutch (Netherlands)
  "no-NO", // Norwegian (Norway)
  "pl-PL", // Polish (Poland)
  "sv-SE", // Swedish (Sweden)
  "tr-TR", // Turkish (Turkey)
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en-US";

// Locale labels for language switcher
export const localeLabels: Record<Locale, string> = {
  "en-US": "English (US)",
  "en-GB": "English (UK)",
  "de-DE": "Deutsch",
  "es-ES": "Español",
  "fr-FR": "Français", 
  "it-IT": "Italiano",
  "cs-CZ": "Čeština",
  "fi-FI": "Suomi",
  "nl-NL": "Nederlands",
  "no-NO": "Norsk",
  "pl-PL": "Polski",
  "sv-SE": "Svenska",
  "tr-TR": "Türkçe",
};

// Locale to country mapping for region detection
export const localeToCountry: Record<Locale, string> = {
  "en-US": "US",
  "en-GB": "GB",
  "de-DE": "DE",
  "es-ES": "ES",
  "fr-FR": "FR",
  "it-IT": "IT",
  "cs-CZ": "CZ",
  "fi-FI": "FI",
  "nl-NL": "NL",
  "no-NO": "NO",
  "pl-PL": "PL",
  "sv-SE": "SE",
  "tr-TR": "TR",
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    locale: locale as Locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
