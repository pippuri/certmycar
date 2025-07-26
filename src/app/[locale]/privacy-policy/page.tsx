import Link from "next/link";
import { Logo } from "@/components/logo";
import { getLocaleLinks } from "@/lib/locale-links";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Privacy Policy - batterycert.com",
    description:
      "Read our privacy policy to understand how batterycert.com collects, uses, and protects your data when providing Tesla battery health assessments.",
    keywords: [
      "privacy policy",
      "batterycert.com privacy",
      "data protection",
      "Tesla data privacy",
      "battery assessment privacy",
    ],
    openGraph: {
      title: "Privacy Policy - batterycert.com",
      description:
        "Read our privacy policy to understand how batterycert.com collects, uses, and protects your data when providing Tesla battery health assessments.",
      type: "website",
      url: "https://batterycert.com/privacy-policy",
      siteName: "batterycert.com",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://batterycert.com/privacy-policy",
    },
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await params;
  const links = getLocaleLinks(_locale);

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
              Home
            </Link>
            <Link
              href={links.about}
              className="text-gray-600 hover:text-gray-900"
            >
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-500 mb-8">Last updated: January 21, 2025</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Information We Collect
            </h2>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              Tesla Account Data
            </h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              When you authorize batterycert.com to access your Tesla account,
              we temporarily collect vehicle battery information, charging data,
              and basic vehicle specifications necessary for our assessment.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              Personal Information
            </h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              For paid certificates, we collect your email address and payment
              information through Stripe. We do not store credit card details on
              our servers.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              Usage Information
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We collect basic analytics about how you use our service,
              including browser type, operating system, and pages visited to
              improve our service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Your Tesla data is used exclusively to generate battery health
              assessments. We do not sell, rent, or share your personal data
              with third parties except as required for payment processing or
              legal compliance.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Email addresses are used to send certificate downloads and
              optional service updates. You can unsubscribe at any time.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Data Security
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We implement industry-standard security measures to protect your
              information. Tesla access tokens are used temporarily and
              discarded immediately after assessment completion. All data
              transmission is encrypted using TLS.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Data Retention
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Tesla account data is not permanently stored. Paid certificate
              data is retained for 1 year to provide ongoing verification
              services. Anonymous usage analytics may be retained longer for
              service improvement.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Your Rights
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              You have the right to request access to, correction of, or
              deletion of your personal information. For certificate
              verification purposes, some data may be retained longer than
              standard deletion timelines.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              To exercise these rights, contact us through our support channels
              with your certificate ID or account information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Third-Party Services
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We use Stripe for payment processing and may use analytics
              services to understand service usage. These services have their
              own privacy policies and data handling practices.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Tesla API access is governed by Tesla&apos;s own privacy policy
              and terms of service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Changes to This Policy
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We may update this privacy policy periodically. Significant
              changes will be communicated via email or through prominent
              notices on our service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Contact Information
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              For privacy-related questions or to exercise your data rights,
              please contact TidyCalls LTD. through our official support
              channels or email us at batterycert@tidycalls.com.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <Link
              href={links.terms}
              className="text-blue-600 hover:text-blue-800 underline mr-6"
            >
              Terms of Service
            </Link>
            <Link
              href={links.about}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              About Us
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          &copy; 2024 batterycert.com, a TidyCalls LTD. company. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
