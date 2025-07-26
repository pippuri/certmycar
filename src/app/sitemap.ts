import { MetadataRoute } from "next";
import { locales } from "@/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://batterycert.com";

  // Define the main pages for each locale
  const pages = [
    "", // Homepage
    "/check",
    "/vehicles",
    "/about",
    "/faq",
    "/terms",
    "/privacy-policy",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale and page
  locales.forEach((locale) => {
    pages.forEach((page) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: page === "" ? 1 : 0.8, // Homepage gets highest priority
      });
    });
  });

  // Add the default redirect URL
  sitemapEntries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  });

  return sitemapEntries;
}
