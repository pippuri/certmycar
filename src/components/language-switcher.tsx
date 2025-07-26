"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeLabels, type Locale } from "@/i18n";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

export function LanguageSwitcher({ currentLocale, className = "" }: LanguageSwitcherProps) {
  const pathname = usePathname();

  // Extract the path without the locale prefix
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/";

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${pathWithoutLocale}`}
          className={`text-sm transition-colors ${
            locale === currentLocale
              ? "text-white font-medium"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {localeLabels[locale]}
        </Link>
      ))}
    </div>
  );
}