import React from "react";
import RegionSelectionClient from "./region-client";
import { getTranslations } from "next-intl/server";

export default async function RegionSelectionPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "region_selection" });
  
  return <RegionSelectionClient 
    locale={locale} 
    translations={{
      title: t("title"),
      description: t("description"),
      recommended: t("recommended"),
      continue_button: t("continue_button"),
      settings_note: t("settings_note"),
      includes: t("includes"),
    }}
  />;
}