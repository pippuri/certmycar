import React from "react";
import VehicleSelectionClient from "./vehicles-client";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: 'vehicles_page.meta' });

  const keywordsArray = meta('keywords').split(', ');

  return {
    title: meta('title'),
    description: meta('description'),
    keywords: keywordsArray,
    openGraph: {
      title: meta('title'),
      description: meta('description'),
      type: "website",
      url: "https://batterycert.com/vehicles",
      siteName: "batterycert.com",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://batterycert.com/vehicles",
    },
  };
}

export default async function VehicleSelectionPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  
  // Load translations
  const pageTranslations = await getTranslations({ locale, namespace: "vehicles_page" });
  
  return (
    <VehicleSelectionClient 
      locale={locale} 
      translations={{
        back_to_login: "← Back to Login",
        loading: {
          title: pageTranslations("loading.title"),
          description: pageTranslations("loading.description"),
        },
        page: {
          title: pageTranslations("title"),
          subtitle: pageTranslations("subtitle"),
        },
        checking_battery: pageTranslations("checking_battery"),
        no_vehicles: {
          title: pageTranslations("no_vehicles.title"),
          description: pageTranslations("no_vehicles.description"),
          try_again: pageTranslations("no_vehicles.try_again"),
        },
        info_cards: {
          instant_analysis: {
            title: pageTranslations("info_cards.instant_analysis.title"),
            description: pageTranslations("info_cards.instant_analysis.description"),
          },
          detailed_report: {
            title: pageTranslations("info_cards.detailed_report.title"),
            description: pageTranslations("info_cards.detailed_report.description"),
          },
          verified_certificate: {
            title: pageTranslations("info_cards.verified_certificate.title"),
            description: pageTranslations("info_cards.verified_certificate.description"),
          },
        },
        errors: {
          failed_to_load: pageTranslations("errors.failed_to_load"),
          failed_battery_check: pageTranslations("errors.failed_battery_check"),
        },
        vehicle_card: {
          charging: pageTranslations("vehicle_card.charging"),
          online: pageTranslations("vehicle_card.online"),
          asleep: pageTranslations("vehicle_card.asleep"),
          offline: pageTranslations("vehicle_card.offline"),
          asleep_can_wake: pageTranslations("vehicle_card.asleep_can_wake"),
          miles: pageTranslations("vehicle_card.miles"),
          kilometers: pageTranslations("vehicle_card.kilometers"),
          vin: pageTranslations("vehicle_card.vin"),
          battery_level: pageTranslations("vehicle_card.battery_level"),
          range: pageTranslations("vehicle_card.range"),
          temperature: pageTranslations("vehicle_card.temperature"),
          last_seen: pageTranslations("vehicle_card.last_seen"),
          odometer: pageTranslations("vehicle_card.odometer"),
        },
      }}
    />);
}