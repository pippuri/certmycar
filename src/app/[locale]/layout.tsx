import type React from "react";
import type { Metadata } from "next";
import "../globals.css";
import { locales } from "@/i18n";

export const metadata: Metadata = {
  title: "batterycert.com- Tesla Battery Health Check in 30 Seconds",
  description:
    "Get instant, verified Tesla battery health assessments. Perfect for buying, selling, or knowing your Tesla's true condition.",
  keywords: [
    "Tesla",
    "battery health",
    "electric vehicle",
    "EV",
    "battery test",
    "verifiable batterycert.com certificate",
    "FREE Instant Battery Health Check",
  ],
  openGraph: {
    title: "batterycert.com - Tesla Battery Health Check",
    description:
      "Get instant, verified Tesla battery health assessments in just 30 seconds.",
    type: "website",
    url: "https://batterycert.com",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <head>
        {/* Hreflang tags for multilingual SEO */}
        {locales.map((localeCode) => (
          <link
            key={localeCode}
            rel="alternate"
            hrefLang={localeCode}
            href={`https://batterycert.com/${localeCode}`}
          />
        ))}
        {/* Default/fallback hreflang */}
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://batterycert.com/en-US"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
