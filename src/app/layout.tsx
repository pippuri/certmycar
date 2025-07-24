import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "batterycert.com - Tesla Battery Health Check in 30 Seconds",
  description:
    "Get instant, verified Tesla battery health assessments. Perfect for buying, selling, or knowing your Tesla's true condition.",
  metadataBase: new URL("https://batterycert.com"),
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
    url: "https://batterycert.com",
    siteName: "batterycert.com",
    locale: "en_US",
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://batterycert.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "batterycert.com",
              url: "https://batterycert.com",
              description:
                "Tesla Battery Health Check and Certification Platform",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://batterycert.com/check",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
