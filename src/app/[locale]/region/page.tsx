import React from "react";
import RegionSelectionClient from "./region-client";

export default async function RegionSelectionPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  
  return <RegionSelectionClient locale={locale} />;
}