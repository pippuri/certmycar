import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Shield,
  Lock,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Users,
  TrendingUp,
  Battery,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { TeslaStatsVisual } from "@/components/tesla-stats-visual";
import { HeroVisual } from "@/components/hero-visual";
import { getLocaleLinks } from "@/lib/locale-links";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title:
      "Tesla Battery Health Check - Get Instant Results in 30 Seconds | batterycert.com",
    description:
      "Check your Tesla battery health instantly with our free assessment tool. Get verified battery degradation data, capacity analysis, and optional PDF certificates for buying or selling your Tesla.",
    keywords: [
      "Tesla battery health",
      "battery degradation",
      "Tesla battery test",
      "EV battery assessment",
      "Tesla battery capacity",
      "electric vehicle battery",
      "Tesla battery certificate",
      "battery health check",
      "Tesla battery life",
      "EV battery verification",
    ],
    openGraph: {
      title: "Tesla Battery Health Check - Instant Results in 30 Seconds",
      description:
        "Get instant, verified Tesla battery health assessments. Perfect for buying, selling, or knowing your Tesla's true condition.",
      type: "website",
      url: "https://batterycert.com",
      siteName: "batterycert.com",
      images: [
        {
          url: "https://batterycert.com/og-image.png",
          width: 1200,
          height: 630,
          alt: "Tesla Battery Health Check",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Tesla Battery Health Check - Instant Results in 30 Seconds",
      description:
        "Get instant, verified Tesla battery health assessments. Perfect for buying, selling, or knowing your Tesla's true condition.",
      images: ["https://batterycert.com/og-image.png"],
    },
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
    alternates: {
      canonical: "https://batterycert.com",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const links = getLocaleLinks(locale);
  return (
    <>
      {/* Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Tesla Battery Health Check",
            description:
              "Get instant, verified Tesla battery health assessments. Perfect for buying, selling, or knowing your Tesla's true condition.",
            provider: {
              "@type": "Organization",
              name: "batterycert.com",
              url: "https://batterycert.com",
            },
            serviceType: "Battery Health Assessment",
            areaServed: "Worldwide",
            url: "https://batterycert.com",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: "Free Tesla battery health check",
            },
            potentialAction: {
              "@type": "UseAction",
              target: "https://batterycert.com/check",
            },
          }),
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Logo size="md" />
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href={links.about}
                className="text-gray-600 hover:text-gray-900"
              >
                About
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-6xl">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
              Check Your Tesla Battery
              <br />
              <span className="text-slate-700">In 30 Seconds</span>
            </h1>

            {/* Interactive Hero Visual */}
            <div className="mb-12">
              <HeroVisual />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href={links.check}>
                  Check My Tesla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-transparent"
                asChild
              >
                <Link
                  href={`/${locale}/certificate/CMB-2025-DEF456JKL?vin=5YJYGDEE2BF000001`}
                >
                  View Sample Certificate
                </Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Free battery health check</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>No account required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Instant results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Optional Certificate ($10)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Battery Replacement ={" "}
                <span className="text-amber-700">$15,000+</span>
              </h2>
              <p className="text-xl text-gray-600">
                Buyers, don&apos;t get scammed with hidden battery issues
              </p>
            </div>

            {/* Video Section */}
            <div className="mb-12">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    See Why Battery Health Matters
                  </h3>
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/yC4EKzpCgfM?si=waE5tCzQjqHYUDSv"
                      title="Tesla Battery Replacement Cost - Why Battery Health Matters"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Watch this video to understand the common scam.
                    batterycert.com helps you avoid it.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Find the Hidden Issues
                </h3>
                <p className="text-gray-600">
                  Sellers hide degradation problems
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Trusted Data</h3>
                <p className="text-gray-600">
                  Direct from Tesla&apos;s systems
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Higher Value</h3>
                <p className="text-gray-600">Proven health increases price</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 bg-white/50">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-16">
              Simple 3-Step Process
            </h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
              <div className="text-center flex-1">
                <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Connect</h3>
                <p className="text-gray-600 text-sm mt-2 max-w-xs mx-auto">
                  Securely connect via Tesla&apos;s official OAuth. We never see
                  your credentials - you authenticate directly with Tesla.
                </p>
              </div>

              <div className="hidden md:block w-16 h-0.5 bg-gray-300"></div>

              <div className="text-center flex-1">
                <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Analyze</h3>
                <p className="text-gray-600 text-sm mt-2 max-w-xs mx-auto">
                  Our system instantly analyzes your battery data using
                  Tesla&apos;s API and calculates degradation percentage.
                </p>
              </div>

              <div className="hidden md:block w-16 h-0.5 bg-gray-300"></div>

              <div className="text-center flex-1">
                <div className="w-24 h-24 bg-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  Optional: Certificate
                </h3>
                <p className="text-gray-600 text-sm mt-2 max-w-xs mx-auto">
                  Get a verified PDF certificate with QR code for buyers to
                  verify. Valid for 3 months. Single $10 fee.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-16">
              Perfect for <span className="text-slate-700">Buyers</span>,{" "}
              <span className="text-emerald-700">Sellers</span> &{" "}
              <span className="text-slate-600">Owners</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-slate-700" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-700">
                  Buyers
                </h3>
                <p className="text-lg font-semibold">Avoid $15K+ surprises</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-emerald-700" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-emerald-700">
                  Sellers
                </h3>
                <p className="text-lg font-semibold">Increase resale value</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-10 w-10 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-700">
                  Owners
                </h3>
                <p className="text-lg font-semibold">Track battery health</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-slate-700 to-slate-800">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Check Your Tesla Battery?
            </h2>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
              Join thousands of Tesla owners who trust batterycert.com for
              accurate, instant battery health reports.
            </p>

            {/* Primary CTA Button */}
            <div className="mb-6">
              <Link
                href="/check"
                className="inline-flex items-center px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xl rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Battery className="w-6 h-6 mr-3" />
                Check My Tesla Battery Now
                <ArrowRight className="w-5 h-5 ml-3" />
              </Link>
            </div>

            {/* Supporting text */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Free • No registration required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>30 seconds • Instant results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Optional $10 certificate</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-gray-900 text-gray-400">
          <div className="container mx-auto text-center">
            <p>
              © 2025 batterycert.com. Built for Tesla owners, by Tesla
              enthusiasts.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
