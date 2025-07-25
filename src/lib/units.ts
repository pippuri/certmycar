/**
 * Unit conversion utilities based on locale
 */

// Locales that primarily use kilometers
const METRIC_LOCALES = ['de-DE', 'fr-FR', 'es-ES', 'it-IT', 'nl-NL', 'da-DK', 'sv-SE', 'no-NO', 'fi-FI', 'ja-JP', 'ko-KR'];

// Locales that primarily use miles  
const IMPERIAL_LOCALES = ['en-US', 'en-GB'];

export function shouldUseMetric(locale: string): boolean {
  return METRIC_LOCALES.includes(locale);
}

export function shouldUseImperial(locale: string): boolean {
  return IMPERIAL_LOCALES.includes(locale);
}

export function milesToKm(miles: number): number {
  return miles * 1.60934;
}

export function kmToMiles(km: number): number {
  return km / 1.60934;
}

export function formatDistance(distance: number, locale: string, unit?: 'miles' | 'km'): string {
  const useMetric = unit ? unit === 'km' : shouldUseMetric(locale);
  
  if (useMetric) {
    const km = unit === 'miles' ? milesToKm(distance) : distance;
    return `${Math.round(km).toLocaleString(locale)} km`;
  } else {
    const miles = unit === 'km' ? kmToMiles(distance) : distance;
    return `${Math.round(miles).toLocaleString(locale)} miles`;
  }
}

export function getDistanceUnit(locale: string): 'miles' | 'km' {
  return shouldUseMetric(locale) ? 'km' : 'miles';
}

export function formatTemperature(tempCelsius: number, locale: string): string {
  const useMetric = shouldUseMetric(locale);
  
  if (useMetric) {
    return `${Math.round(tempCelsius)}°C`;
  } else {
    const fahrenheit = (tempCelsius * 9/5) + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
}

export function getTemperatureUnit(locale: string): 'C' | 'F' {
  return shouldUseMetric(locale) ? 'C' : 'F';
}