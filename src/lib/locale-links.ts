import { defaultLocale } from "../middleware";

/**
 * Create a locale-aware link path
 */
export function createLocalePath(
  path: string,
  locale: string = defaultLocale
): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // If it's the default locale and path is empty, just return the locale
  if (locale === defaultLocale && cleanPath === "") {
    return `/${locale}`;
  }

  // Return locale + path
  return `/${locale}${cleanPath ? `/${cleanPath}` : ""}`;
}

/**
 * Get locale-aware navigation links
 */
export function getLocaleLinks(currentLocale: string) {
  return {
    home: createLocalePath("", currentLocale),
    check: createLocalePath("check", currentLocale),
    vehicles: createLocalePath("vehicles", currentLocale),
    region: createLocalePath("region", currentLocale),
    about: createLocalePath("about", currentLocale),
    terms: createLocalePath("terms", currentLocale),
    privacy: createLocalePath("privacy-policy", currentLocale),
    contact: createLocalePath("contact", currentLocale),
    certificate: createLocalePath("certificate", currentLocale),
  };
}

/**
 * Switch to a different locale while keeping the same path
 */
export function switchLocale(
  currentPath: string,
  currentLocale: string,
  newLocale: string
): string {
  // Remove current locale from path
  const pathWithoutLocale = currentPath.replace(`/${currentLocale}`, "") || "";

  // Add new locale
  return createLocalePath(pathWithoutLocale, newLocale);
}
