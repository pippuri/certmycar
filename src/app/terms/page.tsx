import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Logo size="md" />
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
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
          <p className="text-gray-500 mb-8">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose max-w-none">
            <p>
              Welcome to Cert My Battery, a service provided by TidyCalls LTD.
              These Terms of Service (&quot;Terms&quot;) govern your use of our
              website, certmybattery.com (the &quot;Service&quot;). By using the
              Service, you agree to these Terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8">
              1. Service Description
            </h2>
            <p>
              Cert My Battery provides an assessment of a Tesla vehicle&apos;s
              battery health based on data retrieved from the Tesla API. For a
              fee, users can receive a downloadable PDF certificate of this
              assessment.
            </p>

            <h2 className="text-2xl font-semibold mt-8">2. User Accounts</h2>
            <p>
              To purchase a certificate, you must create an account. You are
              responsible for maintaining the confidentiality of your account
              information and for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-semibold mt-8">3. Payments</h2>
            <p>
              All payments for certificates are processed through our
              third-party payment processor, Stripe. We do not store your credit
              card information. All sales are final and non-refundable.
            </p>

            <h2 className="text-2xl font-semibold mt-8">4. Data and Privacy</h2>
            <p>
              We connect to your Tesla account using a secure, standard OAuth
              flow. We do not see or store your Tesla password. We only retrieve
              the necessary data to perform the battery health assessment. For
              more details, please see our{" "}
              <Link
                href="/privacy-policy"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>

            <h2 className="text-2xl font-semibold mt-8">5. Disclaimers</h2>
            <p>
              The battery health assessment is provided for informational
              purposes only and is not a guarantee of future performance. The
              assessment is based on a snapshot of data at a specific point in
              time and can be influenced by many factors. Cert My Battery and
              TidyCalls LTD. are not liable for any decisions made based on this
              information.
            </p>

            <h2 className="text-2xl font-semibold mt-8">
              6. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, TidyCalls LTD. shall not
              be liable for any indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly.
            </p>

            <h2 className="text-2xl font-semibold mt-8">7. Governing Law</h2>
            <p>
              These Terms shall be governed by the laws of the State of
              Delaware, without respect to its conflict of laws principles.
            </p>

            <h2 className="text-2xl font-semibold mt-8">8. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will notify you of any
              changes by posting the new Terms on this page. Your continued use
              of the Service after the changes have been posted constitutes your
              acceptance of the new Terms.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          &copy; {new Date().getFullYear()} Cert My Battery, a TidyCalls LTD.
          company. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
