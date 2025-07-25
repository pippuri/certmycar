import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Define supported locales
export const locales = [
  'en-US',  // English (US)
  'en-GB',  // English (UK)
  'sv-SE',  // Swedish
  'no-NO',  // Norwegian
  'da-DK',  // Danish
  'nl-NL',  // Dutch
  'fr-FR',  // French
  'de-DE',  // German
  'it-IT',  // Italian
  'es-ES',  // Spanish
  'ja-JP',  // Japanese
  'ko-KR',  // Korean
  'fi-FI',  // Finnish
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en-US';

// Locale labels for language switcher
export const localeLabels: Record<Locale, string> = {
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'sv-SE': 'Svenska',
  'no-NO': 'Norsk',
  'da-DK': 'Dansk',
  'nl-NL': 'Nederlands',
  'fr-FR': 'Français',
  'de-DE': 'Deutsch',
  'it-IT': 'Italiano',
  'es-ES': 'Español',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'fi-FI': 'Suomi',
};

// Locale to country mapping for region detection
export const localeToCountry: Record<Locale, string> = {
  'en-US': 'US',
  'en-GB': 'GB',
  'sv-SE': 'SE',
  'no-NO': 'NO',
  'da-DK': 'DK',
  'nl-NL': 'NL',
  'fr-FR': 'FR',
  'de-DE': 'DE',
  'it-IT': 'IT',
  'es-ES': 'ES',
  'ja-JP': 'JP',
  'ko-KR': 'KR',
  'fi-FI': 'FI',
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    locale: locale as Locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});