import React from "react";
import VehicleSelectionClient from "./vehicles-client";

export default async function VehicleSelectionPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  
  return <VehicleSelectionClient locale={locale} />;
}