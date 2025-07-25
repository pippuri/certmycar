import { Building, Target, Handshake } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
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
      "About batterycert.com - Tesla Battery Health Certification Platform",
    description:
      "Learn about batterycert.com, the trusted platform for Tesla battery health assessments. We bring transparency to the used EV market with instant, verified battery health certificates.",
    keywords: [
      "about batterycert.com",
      "Tesla battery certification",
      "EV battery transparency",
      "TidyCalls company",
      "battery health platform",
      "electric vehicle certification",
    ],
    openGraph: {
      title:
        "About batterycert.com - Tesla Battery Health Certification Platform",
      description:
        "Learn about batterycert.com, the trusted platform for Tesla battery health assessments. We bring transparency to the used EV market.",
      type: "website",
      url: "https://batterycert.com/about",
      siteName: "batterycert.com",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://batterycert.com/about",
    },
  };
}

export default async function AboutPage({
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
            <Button variant="outline" asChild>
              <Link href={links.check}>Get Your Report</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About batterycert.com
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            batterycert.com was founded by the team behind TidyCalls with a
            simple mission: to bring transparency and trust to the used electric
            vehicle market. We believe that buying or selling an EV should be a
            clear, confident process for everyone involved.
          </p>
          <p className="text-xl text-gray-600 mb-12">
            You can reach us at{" "}
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
                <h3 className="text-2xl font-semibold">Our Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Our goal is to provide instant, accurate, and verifiable battery
                health certificates for Tesla vehicles. By leveraging direct API
                access, we eliminate guesswork and empower owners and buyers
                with the data they need to make informed decisions.
              </p>
            </div>
            <div>
              <div className="flex items-center mb-3">
                <Handshake className="w-8 h-8 mr-4 text-green-600" />
                <h3 className="text-2xl font-semibold">Our Values</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We are committed to integrity, accuracy, and user experience. We
                handle your data with the utmost security, never storing your
                Tesla credentials, and provide a seamless flow to get you from
                login to results in seconds.
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center justify-center mb-6">
              <Building className="w-12 h-12 text-gray-400" />
            </div>
            <h4 className="text-xl font-bold text-center text-gray-800 mb-2">
              A TidyCalls LTD Company
            </h4>
            <p className="text-center text-gray-600">
              Leveraging years of experience in building robust, user-friendly
              applications at TidyCalls, we bring the same dedication to quality
              and security to batterycert.com.
            </p>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Legal & Compliance</h2>
          <p className="text-gray-600 mb-8">
            We are committed to transparency in our operations. You can review
            our legal documents below.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href={links.terms}>Terms of Service</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={links.privacy}>Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          &copy; {new Date().getFullYear()} batterycert.com, a TidyCalls LTD.
          company. 124 City Road, EC1V 2NX, London. Company number 16329940 All
          rights reserved.
        </div>
      </footer>
    </div>
  );
}
