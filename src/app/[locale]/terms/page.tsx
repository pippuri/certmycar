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
    title: "Terms of Service - batterycert.com",
    description:
      "Read the terms of service for batterycert.com. Learn about our Tesla battery health assessment service, user agreements, and service conditions.",
    keywords: [
      "terms of service",
      "batterycert.com terms",
      "Tesla battery service terms",
      "user agreement",
      "service conditions",
    ],
    openGraph: {
      title: "Terms of Service - batterycert.com",
      description:
        "Read the terms of service for batterycert.com. Learn about our Tesla battery health assessment service, user agreements, and service conditions.",
      type: "website",
      url: "https://batterycert.com/terms",
      siteName: "batterycert.com",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://batterycert.com/terms",
    },
  };
}

export default async function TermsPage({
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
            Terms of Service
          </h1>
          <p className="text-gray-500 mb-8">Last updated: January 21, 2025</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              By accessing and using batterycert.com (&quot;Service&quot;), you
              accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Service Description
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              batterycert.com provides Tesla battery health assessment services
              through direct API integration with Tesla&apos;s systems. We offer
              free basic assessments and paid detailed certificates for vehicle
              buyers and sellers.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. User Accounts and Tesla Access
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              To use our service, you must authorize batterycert.com to access
              your Tesla account data. We do not store your Tesla credentials.
              Access is temporary and used solely for the purpose of battery
              assessment.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Payment and Refunds
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Paid certificates are processed through Stripe. All sales are
              final. Refunds may be considered on a case-by-case basis within 7
              days of purchase if technical issues prevent certificate
              generation.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Data and Privacy
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We respect your privacy and handle your data in accordance with
              our Privacy Policy. Tesla account data is processed temporarily
              and not permanently stored on our servers.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Accuracy Disclaimer
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              While we strive for accuracy, battery health assessments are
              estimates based on available data. Results should be used as
              guidance and not as a warranty or guarantee of actual battery
              condition.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              batterycert.com and TidyCalls LTD. shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages
              arising from your use of the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Governing Law
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              These terms shall be governed by and construed in accordance with
              the laws of the jurisdiction where TidyCalls LTD. is incorporated.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Changes to Terms
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We reserve the right to update these terms at any time. Users will
              be notified of significant changes via email or through the
              service interface.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Contact Information
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              For questions about these terms, please contact us through our
              support channels or visit our Privacy Policy for data-related
              inquiries.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <Link
              href={links.privacy}
              className="text-blue-600 hover:text-blue-800 underline mr-6"
            >
              Privacy Policy
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
