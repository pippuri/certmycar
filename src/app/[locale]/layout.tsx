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
    title: "batterycert.com - Tesla Battery Health Check in 30 Seconds",
    description:
      "Get instant, verified Tesla battery health assessments. Perfect for buying, selling, or knowing your Tesla's true condition.",
    keywords: [
      "Tesla battery health",
      "Tesla battery check",
      "EV battery certification",
      "Tesla battery degradation",
      "electric vehicle inspection",
      "Tesla battery report",
      "battery health assessment",
    ],
    authors: [{ name: "batterycert.com" }],
    creator: "batterycert.com",
    publisher: "batterycert.com",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: "Tesla Battery Health Check in 30 Seconds | batterycert.com",
      description:
        "Get instant, verified Tesla battery health assessments. Perfect for buying, selling, or knowing your Tesla's true condition.",
      url: `${baseUrl}/${locale}`,
      siteName: "batterycert.com",
      locale: locale.replace("-", "_"),
      type: "website",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "Tesla Battery Health Check - batterycert.com",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Tesla Battery Health Check in 30 Seconds",
      description:
        "Get instant, verified Tesla battery health assessments. Perfect for buying, selling, or knowing your Tesla's true condition.",
      creator: "@batterycert",
      images: ["/opengraph-image.png"],
    },
  };
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
