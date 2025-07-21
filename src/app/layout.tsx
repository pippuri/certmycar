import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CertMyBattery - Tesla Battery Health Check in 30 Seconds",
  description:
    "Get instant, verified Tesla battery health assessments. Perfect for buying, selling, or knowing your Tesla's true condition.",
  keywords: [
    "Tesla",
    "battery health",
    "electric vehicle",
    "EV",
    "battery test",
    "Tesla certification",
  ],
  openGraph: {
    title: "CertMyBattery - Tesla Battery Health Check",
    description:
      "Get instant, verified Tesla battery health assessments in just 30 seconds.",
    type: "website",
    url: "https://certmybattery.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
