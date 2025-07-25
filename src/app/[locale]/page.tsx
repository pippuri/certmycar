import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Users,
  TrendingUp,
  Battery,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { HeroVisual } from "@/components/hero-visual";
import { GDPRBanner } from "@/components/gdpr-banner";
import { getLocaleLinks } from "@/lib/locale-links";
import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: 'meta.homepage' });

  return {
    title: meta('title'),
    description: meta('description'),
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
      title: meta('og_title'),
      description: meta('og_description'),
      type: "website",
      url: "https://batterycert.com",
      siteName: "batterycert.com",
      images: [
        {
          url: "https://batterycert.com/og-image.png",
          width: 1200,
          height: 630,
          alt: meta('og_alt'),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta('og_title'),
      description: meta('og_description'),
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
  const t = await getTranslations({ locale, namespace: 'homepage' });
  const structured = await getTranslations({ locale, namespace: 'structured_data.service' });
  const heroVisualTranslations = await getTranslations({ locale, namespace: 'hero_visual' });
  const gdprTranslations = await getTranslations({ locale, namespace: 'gdpr' });
  return (
    <>
      {/* Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: structured('name'),
            description: structured('description'),
            provider: {
              "@type": "Organization",
              name: "batterycert.com",
              url: "https://batterycert.com",
            },
            serviceType: structured('service_type'),
            areaServed: structured('area_served'),
            url: "https://batterycert.com",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: structured('offer_description'),
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
                {t('navigation.about')}
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-6xl">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
              {t('hero.title')}
              <br />
              <span className="text-slate-700">{t('hero.title_highlight')}</span>
            </h1>

            {/* Interactive Hero Visual */}
            <div className="mb-12">
              <HeroVisual 
                translations={{
                  verified_certificate: heroVisualTranslations('verified_certificate'),
                  battery_health_report: heroVisualTranslations('battery_health_report'),
                  certificate_id: heroVisualTranslations('certificate_id'),
                  certified: heroVisualTranslations('certified'),
                  verified: heroVisualTranslations('verified'),
                  health_score: heroVisualTranslations('health_score'),
                  vehicle_information: heroVisualTranslations('vehicle_information'),
                  model: heroVisualTranslations('model'),
                  tesla_model_y: heroVisualTranslations('tesla_model_y'),
                  year: heroVisualTranslations('year'),
                  vin: heroVisualTranslations('vin'),
                  battery_metrics: heroVisualTranslations('battery_metrics'),
                  current_capacity: heroVisualTranslations('current_capacity'),
                  degradation: heroVisualTranslations('degradation'),
                  est_range: heroVisualTranslations('est_range'),
                  miles: heroVisualTranslations('miles'),
                  degradation_comparison: heroVisualTranslations('degradation_comparison'),
                  better_than_percentage: heroVisualTranslations('better_than_percentage'),
                  this_vehicle: heroVisualTranslations('this_vehicle', { percentage: 92 }),
                  average: heroVisualTranslations('average', { percentage: 85 }),
                  verified_data: heroVisualTranslations('verified_data'),
                  direct_tesla_api: heroVisualTranslations('direct_tesla_api'),
                  tamper_proof: heroVisualTranslations('tamper_proof'),
                  qr_verification: heroVisualTranslations('qr_verification'),
                  increase_value: heroVisualTranslations('increase_value'),
                  proven_health: heroVisualTranslations('proven_health'),
                  scan_to_verify: heroVisualTranslations('scan_to_verify'),
                  verified_by: heroVisualTranslations('verified_by'),
                  generated: heroVisualTranslations('generated'),
                  valid_for_one_year: heroVisualTranslations('valid_for_one_year')
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href={links.check}>
                  {t('hero.cta_primary')}
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
                  {t('hero.cta_secondary')}
                </Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>{t('hero_features.free_check')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>{t('hero_features.no_account')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>{t('hero_features.instant_results')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>{t('hero_features.optional_certificate')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t('problem_section.title')}
                <span className="text-amber-700">{t('problem_section.title_price')}</span>
              </h2>
              <p className="text-xl text-gray-600">
                {t('problem_section.subtitle')}
              </p>
            </div>

            {/* Video Section */}
            <div className="mb-12">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {t('problem_section.video_title')}
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
                    {t('problem_section.video_description')}
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
                  {t('problem_section.cards.hidden_issues.title')}
                </h3>
                <p className="text-gray-600">
                  {t('problem_section.cards.hidden_issues.description')}
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('problem_section.cards.trusted_data.title')}</h3>
                <p className="text-gray-600">
                  {t('problem_section.cards.trusted_data.description')}
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('problem_section.cards.higher_value.title')}</h3>
                <p className="text-gray-600">{t('problem_section.cards.higher_value.description')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 bg-white/50">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-16">
              {t('how_it_works.title')}
            </h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
              <div className="text-center flex-1">
                <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{t('how_it_works.steps.connect.title')}</h3>
                <p className="text-gray-600 text-sm mt-2 max-w-xs mx-auto">
                  {t('how_it_works.steps.connect.description')}
                </p>
              </div>

              <div className="hidden md:block w-16 h-0.5 bg-gray-300"></div>

              <div className="text-center flex-1">
                <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{t('how_it_works.steps.analyze.title')}</h3>
                <p className="text-gray-600 text-sm mt-2 max-w-xs mx-auto">
                  {t('how_it_works.steps.analyze.description')}
                </p>
              </div>

              <div className="hidden md:block w-16 h-0.5 bg-gray-300"></div>

              <div className="text-center flex-1">
                <div className="w-24 h-24 bg-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {t('how_it_works.steps.certificate.title')}
                </h3>
                <p className="text-gray-600 text-sm mt-2 max-w-xs mx-auto">
                  {t('how_it_works.steps.certificate.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-16">
              {t('use_cases.title')}<span className="text-slate-700">{t('use_cases.title_buyers')}</span>,{" "}
              <span className="text-emerald-700">{t('use_cases.title_sellers')}</span> &{" "}
              <span className="text-slate-600">{t('use_cases.title_owners')}</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-slate-700" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-700">
                  {t('use_cases.buyers.title')}
                </h3>
                <p className="text-lg font-semibold">{t('use_cases.buyers.description')}</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-emerald-700" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-emerald-700">
                  {t('use_cases.sellers.title')}
                </h3>
                <p className="text-lg font-semibold">{t('use_cases.sellers.description')}</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-10 w-10 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-700">
                  {t('use_cases.owners.title')}
                </h3>
                <p className="text-lg font-semibold">{t('use_cases.owners.description')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-slate-700 to-slate-800">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('cta_section.title')}
            </h2>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
              {t('cta_section.subtitle')}
            </p>

            {/* Primary CTA Button */}
            <div className="mb-6">
              <Link
                href="/check"
                className="inline-flex items-center px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xl rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Battery className="w-6 h-6 mr-3" />
                {t('cta_section.button_text')}
                <ArrowRight className="w-5 h-5 ml-3" />
              </Link>
            </div>

            {/* Supporting text */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>{t('cta_section.features.free_registration')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>{t('cta_section.features.speed')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>{t('cta_section.features.certificate')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-gray-900 text-gray-400">
          <div className="container mx-auto text-center">
            <p>
              {t('footer.copyright')}
            </p>
          </div>
        </footer>
      </div>

      {/* GDPR Banner for EU users */}
      <GDPRBanner 
        locale={locale}
        translations={{
          title: gdprTranslations('title'),
          message: gdprTranslations('message'),
          accept_all: gdprTranslations('accept_all'),
          decline: gdprTranslations('decline'),
          cookie_settings: gdprTranslations('cookie_settings'),
          essential_only: gdprTranslations('essential_only'),
          settings: {
            essential_cookies: gdprTranslations('settings.essential_cookies'),
            always_on: gdprTranslations('settings.always_on'),
            analytics: gdprTranslations('settings.analytics'),
            marketing: gdprTranslations('settings.marketing'),
            optional: gdprTranslations('settings.optional'),
            back: gdprTranslations('settings.back')
          }
        }}
      />
    </>
  );
}
