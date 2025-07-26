import Link from "next/link";
import { Logo } from "@/components/logo";
import { LanguageIcon } from "@/components/language-icon";
import { getTranslations } from "next-intl/server";
import { getLocaleLinks } from "@/lib/locale-links";
import type { Locale } from "@/i18n";

interface HeaderProps {
  locale: Locale;
  showAboutLink?: boolean;
}

export async function Header({ locale, showAboutLink = true }: HeaderProps) {
  const t = await getTranslations({ locale, namespace: "navigation" });
  const links = getLocaleLinks(locale);

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Logo size="md" />
          </Link>
        </div>
        <nav className="flex items-center space-x-6">
          {showAboutLink && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href={links.about}
                className="text-gray-600 hover:text-gray-900"
              >
                {t("about")}
              </Link>
            </div>
          )}
          <LanguageIcon />
        </nav>
      </div>
    </header>
  );
}