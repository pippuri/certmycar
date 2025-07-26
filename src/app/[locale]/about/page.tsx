import { Building, Target, Handshake } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getLocaleLinks } from "@/lib/locale-links";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about_page.meta" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    openGraph: {
      title: t("og_title"),
      description: t("og_description"),
      type: "website",
      url: `https://batterycert.com/${locale}/about`,
      siteName: "batterycert.com",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://batterycert.com/${locale}/about`,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const links = getLocaleLinks(locale);
  const t = await getTranslations({ locale, namespace: "about_page" });

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href={links.home}>
              <Logo size="md" />
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href={links.home}
              className="text-gray-600 hover:text-gray-900"
            >
              {t("navigation.home")}
            </Link>
            <Button variant="outline" asChild>
              <Link href={links.check}>{t("navigation.get_report")}</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-gray-600 mb-12">{t("hero.description")}</p>
          <p className="text-xl text-gray-600 mb-12">
            {t("hero.contact_text")}{" "}
            <a href="mailto:batterycert@tidycalls.com">
              batterycert@tidycalls.com
            </a>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto mb-20">
          <div className="space-y-8">
            <div>
              <div className="flex items-center mb-3">
                <Target className="w-8 h-8 mr-4 text-blue-600" />
                <h3 className="text-2xl font-semibold">{t("mission.title")}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("mission.description")}
              </p>
            </div>
            <div>
              <div className="flex items-center mb-3">
                <Handshake className="w-8 h-8 mr-4 text-green-600" />
                <h3 className="text-2xl font-semibold">{t("values.title")}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("values.description")}
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center justify-center mb-6">
              <Building className="w-12 h-12 text-gray-400" />
            </div>
            <h4 className="text-xl font-bold text-center text-gray-800 mb-2">
              {t("company.title")}
            </h4>
            <p className="text-center text-gray-600">
              {t("company.description")}
            </p>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{t("legal.title")}</h2>
          <p className="text-gray-600 mb-8">{t("legal.description")}</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild>
              <Link href={links.terms}>{t("legal.terms_button")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={links.privacy}>{t("legal.privacy_button")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={links.faq}>{t("legal.faq_button")}</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          {t("footer.copyright")}
        </div>
      </footer>
    </div>
  );
}
