import React from "react";
import { localeToRegion, formatRegionName } from "@/lib/tesla-regions";
import { getLocaleLinks } from "@/lib/locale-links";
import TeslaCheckPageClient from "./tesla-check-client";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Tesla Battery Health Check - Connect Your Tesla | batterycert.com",
    description:
      "Connect your Tesla account securely to get an instant battery health assessment. Check battery degradation, capacity, and get a detailed report in 30 seconds.",
    keywords: [
      "Tesla battery check",
      "connect Tesla account",
      "battery health assessment",
      "Tesla battery test",
      "EV battery analysis",
    ],
    openGraph: {
      title: "Tesla Battery Health Check - Connect Your Tesla",
      description:
        "Connect your Tesla account securely to get an instant battery health assessment. Check battery degradation, capacity, and get a detailed report in 30 seconds.",
      type: "website",
      url: "https://batterycert.com/check",
      siteName: "batterycert.com",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://batterycert.com/check",
    },
  };
}

export default async function TeslaCheckPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Get region from locale parameter
  const region = localeToRegion(locale);
  const regionName = formatRegionName(region);

  // Get locale-aware links
  const links = getLocaleLinks(locale);

  return (
    <TeslaCheckPageClient
      region={region}
      regionName={regionName}
      links={links}
      locale={locale}
    />
  );
}
