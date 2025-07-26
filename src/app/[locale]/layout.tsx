import type React from "react";
import type { Metadata } from "next";
import "../globals.css";
import { locales } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://batterycert.com";

  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        ...locales.reduce(
          (acc, loc) => ({
            ...acc,
            [loc]: `${baseUrl}/${loc}`,
          }),
          {}
        ),
        "x-default": `${baseUrl}/en-US`,
      },
    },
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
      url: `${baseUrl}/${locale}`,
    },
  };
}

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
      <body>{children}</body>
    </html>
  );
}
