import React from "react";
import VehicleSelectionClient from "./vehicles-client";
import { getTranslations } from "next-intl/server";

export default async function VehicleSelectionPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  
  // Load translations
  const vehicleSelectionTranslations = await getTranslations({
    locale,
    namespace: "vehicle_selection",
  });
  
  return (
    <VehicleSelectionClient 
      locale={locale} 
      translations={{
        back_to_login: vehicleSelectionTranslations("back_to_login"),
        loading: {
          title: vehicleSelectionTranslations("loading.title"),
          description: vehicleSelectionTranslations("loading.description"),
        },
        page: {
          title: vehicleSelectionTranslations("page.title"),
          subtitle: vehicleSelectionTranslations("page.subtitle"),
        },
        checking_battery: vehicleSelectionTranslations("checking_battery"),
        no_vehicles: {
          title: vehicleSelectionTranslations("no_vehicles.title"),
          description: vehicleSelectionTranslations("no_vehicles.description"),
          try_again: vehicleSelectionTranslations("no_vehicles.try_again"),
        },
        info_cards: {
          instant_analysis: {
            title: vehicleSelectionTranslations("info_cards.instant_analysis.title"),
            description: vehicleSelectionTranslations("info_cards.instant_analysis.description"),
          },
          detailed_report: {
            title: vehicleSelectionTranslations("info_cards.detailed_report.title"),
            description: vehicleSelectionTranslations("info_cards.detailed_report.description"),
          },
          verified_certificate: {
            title: vehicleSelectionTranslations("info_cards.verified_certificate.title"),
            description: vehicleSelectionTranslations("info_cards.verified_certificate.description"),
          },
        },
        errors: {
          failed_to_load: vehicleSelectionTranslations("errors.failed_to_load"),
          failed_battery_check: vehicleSelectionTranslations("errors.failed_battery_check"),
        },
      }}
    />);
}