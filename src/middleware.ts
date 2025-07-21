import { NextRequest, NextResponse } from 'next/server'
import { NA_LOCALES, EU_LOCALES } from './lib/tesla-regions'

// All supported locales
export const locales = [...NA_LOCALES, ...EU_LOCALES]
export const defaultLocale = 'en-US'

// Get locale from request
function getLocale(request: NextRequest): string {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    // Extract locale from pathname
    return pathname.split('/')[1]
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    // Parse Accept-Language header and find best match
    const languages = acceptLanguage
      .split(',')
      .map(lang => {
        const [locale, q = '1'] = lang.trim().split(';q=')
        return { locale: locale.trim(), quality: parseFloat(q) }
      })
      .sort((a, b) => b.quality - a.quality)

    for (const { locale } of languages) {
      // Try exact match first (e.g., en-US)
      if (locales.includes(locale)) {
        return locale
      }
      
      // Try language-only match (e.g., en -> en-US)
      const [lang] = locale.split('-')
      if (lang === 'en') {
        // For English, try to detect region
        const region = detectRegionFromHeaders(request)
        if (region === 'eu') {
          return 'en-GB' // Default European English
        }
        return 'en-US' // Default North American English
      }
    }
  }

  return defaultLocale
}

// Detect region from various headers
function detectRegionFromHeaders(request: NextRequest): 'na' | 'eu' {
  // Check CloudFlare country header
  const country = request.headers.get('cf-ipcountry')
  if (country) {
    const euCountries = ['GB', 'NO', 'NL', 'DE', 'FR', 'IT', 'ES', 'SE', 'DK', 'FI', 'BE', 'AT', 'CH', 'IE', 'LU', 'PT', 'IS', 'SI', 'EE', 'LV', 'LT', 'CZ', 'SK', 'HU', 'PL', 'HR', 'BG', 'RO', 'GR', 'CY', 'MT', 'AE', 'IL', 'ZA']
    if (euCountries.includes(country)) {
      return 'eu'
    }
  }

  // Check timezone from headers if available
  const timezone = request.headers.get('x-timezone')
  if (timezone) {
    if (timezone.includes('Europe/') || timezone.includes('Africa/') || timezone.includes('Asia/Jerusalem') || timezone.includes('Asia/Dubai')) {
      return 'eu'
    }
  }

  return 'na' // Default to North America
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/auth/') ||  // Skip auth routes (Tesla callback)
    pathname.startsWith('/wellknown/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Apply locale routing to ALL pages (except API and static files)

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    // Locale is already in the URL, continue
    return NextResponse.next()
  }

  // Redirect ALL pages to URL with locale
  const locale = getLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  
  // Preserve query parameters
  newUrl.search = request.nextUrl.search

  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next), API routes, and static files
    '/((?!_next|api|favicon|wellknown|.*\\.).*)',
  ],
}