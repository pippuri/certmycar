import React from "react";
import { localeToRegion, formatRegionName } from "@/lib/tesla-regions";
import { getLocaleLinks } from "@/lib/locale-links";
import TeslaCheckPageClient from "./tesla-check-client";

export default async function TeslaCheckPage({ 
  params 
}: { 
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  
  // Get region from locale parameter
  const region = localeToRegion(locale);
  const regionName = formatRegionName(region);
  
  // Get locale-aware links
  const links = getLocaleLinks(locale);
  
  return <TeslaCheckPageClient region={region} regionName={regionName} links={links} />;
}