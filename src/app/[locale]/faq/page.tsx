import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { getLocaleLinks } from "@/lib/locale-links";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  CreditCard,
  Zap,
  Users,
  FileText,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "faq.meta",
  });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `https://batterycert.com/${locale}/faq`,
      siteName: "batterycert.com",
    },
    alternates: {
      canonical: `https://batterycert.com/${locale}/faq`,
    },
  };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const links = getLocaleLinks(locale);
  const t = await getTranslations({ locale, namespace: "faq" });

  const faqSections = [
    {
      title: t("privacy.title"),
      icon: Shield,
      items: [
        {
          question: t("privacy.oauth_question"),
          answer: t("privacy.oauth_answer"),
        },
        {
          question: t("privacy.data_access_question"),
          answer: t("privacy.data_access_answer"),
        },
        {
          question: t("privacy.credentials_question"),
          answer: t("privacy.credentials_answer"),
        },
        {
          question: t("privacy.storage_question"),
          answer: t("privacy.storage_answer"),
        },
        {
          question: t("privacy.third_party_question"),
          answer: t("privacy.third_party_answer"),
        },
      ],
    },
    {
      title: t("pricing.title"),
      icon: CreditCard,
      items: [
        {
          question: t("pricing.why_charge_question"),
          answer: t("pricing.why_charge_answer"),
        },
        {
          question: t("pricing.api_costs_question"),
          answer: t("pricing.api_costs_answer"),
        },
        {
          question: t("pricing.certificate_value_question"),
          answer: t("pricing.certificate_value_answer"),
        },
        {
          question: t("pricing.one_time_question"),
          answer: t("pricing.one_time_answer"),
        },
        {
          question: t("pricing.refund_question"),
          answer: t("pricing.refund_answer"),
        },
      ],
    },
    {
      title: t("service.title"),
      icon: Zap,
      items: [
        {
          question: t("service.how_works_question"),
          answer: t("service.how_works_answer"),
        },
        {
          question: t("service.accuracy_question"),
          answer: t("service.accuracy_answer"),
        },
        {
          question: t("service.certificate_validity_question"),
          answer: t("service.certificate_validity_answer"),
        },
        {
          question: t("service.verification_question"),
          answer: t("service.verification_answer"),
        },
        {
          question: t("service.support_question"),
          answer: t("support_answer"),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={links.home} className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <Logo size="sm" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">
            {t("page_title")}
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqSections.map((section, sectionIndex) => {
            const IconComponent = section.icon;
            return (
              <Card key={sectionIndex} className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {item.question}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("contact.title")}
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {t("contact.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={links.check}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Zap className="h-5 w-5 mr-2" />
                {t("contact.check_battery")}
              </Link>
              <Link
                href={links.about}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-5 w-5 mr-2" />
                {t("contact.learn_more")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
