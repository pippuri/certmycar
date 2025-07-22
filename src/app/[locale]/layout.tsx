import type React from "react";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "batterycert.com- Tesla Battery Health Check in 30 Seconds",
  description:
    "Get instant, verified Tesla battery health assessments. Perfect for buying, selling, or knowing your Tesla's true condition.",
  keywords: [
    "Tesla",
    "battery health",
    "electric vehicle",
    "EV",
    "battery test",
    "batterycert.comification",
    "Instant Battery Health Check",
  ],
  openGraph: {
    title: "batterycert.com - Tesla Battery Health Check",
    description:
      "Get instant, verified Tesla battery health assessments in just 30 seconds.",
    type: "website",
    url: "https://batterycert.com",
  },
};

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
