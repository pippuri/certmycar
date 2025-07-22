import Link from "next/link";
import { Logo } from "@/components/logo";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-gray-500 mb-8">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose max-w-none">
            <p>
              TidyCalls LTD. (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
              operates the batterycert.com website (the &quot;Service&quot;).
              This page informs you of our policies regarding the collection,
              use, and disclosure of personal data when you use our Service.
            </p>

            <h2 className="text-2xl font-semibold mt-8">
              1. Information Collection and Use
            </h2>
            <p>
              We collect several different types of information for various
              purposes to provide and improve our Service to you.
            </p>
            <ul>
              <li>
                <strong>Tesla Account Data:</strong> When you connect your Tesla
                account, we use OAuth 2.0 to gain temporary, read-only access to
                your vehicle data. We never see or store your Tesla password. We
                retrieve vehicle information (VIN, model) and battery data
                required for the assessment. This access is revoked after the
                assessment is complete.
              </li>
              <li>
                <strong>Personal Information:</strong> When you create an
                account to purchase a certificate, we collect your email
                address.
              </li>
              <li>
                <strong>Payment Information:</strong> We use Stripe to process
                payments. We do not collect or store your payment card details.
                That information is provided directly to our third-party payment
                processors.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8">2. Use of Data</h2>
            <p>We use the collected data for the following purposes:</p>
            <ul>
              <li>To provide and maintain our Service.</li>
              <li>To generate your battery health certificate.</li>
              <li>To manage your account and provide customer support.</li>
              <li>To process your payments.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8">3. Data Security</h2>
            <p>
              The security of your data is important to us. We use
              industry-standard security measures to protect your information.
              Your Tesla credentials are never passed to our servers.
            </p>

            <h2 className="text-2xl font-semibold mt-8">4. Data Retention</h2>
            <p>
              We retain your account information and generated certificates so
              you can access them later. We do not retain the temporary access
              token to your Tesla account.
            </p>

            <h2 className="text-2xl font-semibold mt-8">5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete the information we
              have on you. You can do this by signing into your account or by
              contacting us directly.
            </p>

            <h2 className="text-2xl font-semibold mt-8">
              6. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          &copy; {new Date().getFullYear()} batterycert.com, a TidyCalls LTD.
          company. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
