import React from "react";
import { localeToRegion } from "@/lib/tesla-regions";
import { getLocaleLinks } from "@/lib/locale-links";
import TeslaCheckPageClient from "./tesla-check-client";
import { getTranslations } from "next-intl/server";
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
  const { locale: _locale } = await params;

  // Get region from locale parameter
  const region = localeToRegion(_locale);

  // Get locale-aware links
  const links = getLocaleLinks(_locale);

  // Load translations
  const teslaCheckTranslations = await getTranslations({
    locale: _locale,
    namespace: "tesla_check",
  });

  // Load root translations for regions
  const rootTranslations = await getTranslations({
    locale: _locale,
  });

  // Get localized region name
  const regionName =
    region === "eu"
      ? rootTranslations("regions.eu")
      : rootTranslations("regions.na");

  // Construct the region info text directly
  const regionInfoText = `Using Tesla ${regionName} servers`;

  return (
    <TeslaCheckPageClient
      region={region}
      regionName={regionName}
      links={links}
      locale={_locale}
      translations={{
        back_to_home: teslaCheckTranslations("back_to_home"),
        results: {
          battery_degradation: teslaCheckTranslations(
            "results.battery_degradation"
          ),
          battery_health: teslaCheckTranslations("results.battery_health"),
          excellent: teslaCheckTranslations("results.excellent"),
          good: teslaCheckTranslations("results.good"),
          fair: teslaCheckTranslations("results.fair"),
          current_capacity: teslaCheckTranslations("results.current_capacity"),
          original_capacity: teslaCheckTranslations(
            "results.original_capacity"
          ),
          current_charge: teslaCheckTranslations("results.current_charge"),
        },
        certificate_promo: {
          title: teslaCheckTranslations("certificate_promo.title"),
          subtitle: teslaCheckTranslations("certificate_promo.subtitle"),
          free_section: {
            title: teslaCheckTranslations(
              "certificate_promo.free_section.title"
            ),
            degradation: teslaCheckTranslations(
              "certificate_promo.free_section.degradation"
            ),
            capacity: teslaCheckTranslations(
              "certificate_promo.free_section.capacity"
            ),
            charge: teslaCheckTranslations(
              "certificate_promo.free_section.charge"
            ),
          },
          paid_section: {
            title: teslaCheckTranslations(
              "certificate_promo.paid_section.title"
            ),
            full_dataset: teslaCheckTranslations(
              "certificate_promo.paid_section.full_dataset"
            ),
            peer_comparison: teslaCheckTranslations(
              "certificate_promo.paid_section.peer_comparison"
            ),
            pdf_certificate: teslaCheckTranslations(
              "certificate_promo.paid_section.pdf_certificate"
            ),
            authenticity: teslaCheckTranslations(
              "certificate_promo.paid_section.authenticity"
            ),
            physical_option: teslaCheckTranslations(
              "certificate_promo.paid_section.physical_option"
            ),
            performance_ranking: teslaCheckTranslations(
              "certificate_promo.paid_section.performance_ranking"
            ),
          },
          purchase_button: teslaCheckTranslations(
            "certificate_promo.purchase_button"
          ),
          sample_link: teslaCheckTranslations("certificate_promo.sample_link"),
          features: teslaCheckTranslations("certificate_promo.features"),
        },
        auth_form: {
          title: teslaCheckTranslations("auth_form.title"),
          subtitle: teslaCheckTranslations("auth_form.subtitle"),
          region_info: regionInfoText,
          region_change: teslaCheckTranslations("auth_form.region_change"),
          connect_button: teslaCheckTranslations("auth_form.connect_button"),
          connecting: teslaCheckTranslations("auth_form.connecting"),
          try_again: teslaCheckTranslations("auth_form.try_again"),
          retry_info: teslaCheckTranslations("auth_form.retry_info"),
        },
        security: {
          title: teslaCheckTranslations("security.title"),
          no_storage: teslaCheckTranslations("security.no_storage"),
          encrypted: teslaCheckTranslations("security.encrypted"),
          battery_only: teslaCheckTranslations("security.battery_only"),
        },
        features: {
          secure_connection: {
            title: teslaCheckTranslations("features.secure_connection.title"),
            subtitle: teslaCheckTranslations(
              "features.secure_connection.subtitle"
            ),
          },
          no_storage: {
            title: teslaCheckTranslations("features.no_storage.title"),
            subtitle: teslaCheckTranslations("features.no_storage.subtitle"),
          },
          instant_results: {
            title: teslaCheckTranslations("features.instant_results.title"),
            subtitle: teslaCheckTranslations(
              "features.instant_results.subtitle"
            ),
          },
        },
      }}
    />
  );
}
