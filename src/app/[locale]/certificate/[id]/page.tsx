import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { getLocaleLinks } from "@/lib/locale-links";
import { createServerSupabaseClient } from "@/lib/supabase";
import { ShareButton, DownloadButton } from "@/components/certificate-actions";
import { EmailCapture } from "@/components/email-capture";
import { CertificateDisplay } from "@/components/certificate-display";
import { CertificatePayment } from "@/components/certificate-payment";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ vin?: string; pdf?: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const { vin } = await searchParams;

  // Handle demo certificate
  if (id === "CMB-DEMO-2024-SAMPLE") {
    return {
      title: "Sample Tesla Battery Certificate - batterycert.com",
      description:
        "View a sample Tesla battery health certificate. See how batterycert.com provides detailed battery degradation analysis and health assessments for Tesla vehicles.",
      keywords: [
        "sample Tesla certificate",
        "battery health certificate",
        "Tesla battery report",
        "battery degradation sample",
      ],
      openGraph: {
        title: "Sample Tesla Battery Certificate - batterycert.com",
        description:
          "View a sample Tesla battery health certificate. See how batterycert.com provides detailed battery degradation analysis and health assessments for Tesla vehicles.",
        type: "website",
        url: `https://batterycert.com/${locale}/certificate/${id}${vin ? '?vin=' + vin : ''}`,
        siteName: "batterycert.com",
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `https://batterycert.com/${locale}/certificate/${id}${vin ? '?vin=' + vin : ''}`,
      },
    };
  }

  return {
    title: "Tesla Battery Certificate - batterycert.com",
    description:
      "View your Tesla battery health certificate with detailed degradation analysis, capacity data, and verification QR code.",
    keywords: [
      "Tesla battery certificate",
      "battery health report",
      "battery degradation certificate",
      "Tesla battery verification",
    ],
    openGraph: {
      title: "Tesla Battery Certificate - batterycert.com",
      description:
        "View your Tesla battery health certificate with detailed degradation analysis, capacity data, and verification QR code.",
      type: "website",
      url: `https://batterycert.com/${locale}/certificate/${id}${vin ? '?vin=' + vin : ''}`,
      siteName: "batterycert.com",
    },
    robots: {
      index: false, // Don't index individual certificates
      follow: true,
    },
    alternates: {
      canonical: `https://batterycert.com/${locale}/certificate/${id}${vin ? '?vin=' + vin : ''}`,
    },
  };
}

export default async function CertificatePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ vin?: string; pdf?: string }>;
}) {
  const { locale, id } = await params;
  const { vin, pdf } = await searchParams;
  const links = getLocaleLinks(locale);

  // Handle demo certificate with hardcoded data
  let certificate;
  let error = null;

  if (id === "CMB-DEMO-2024-SAMPLE") {
    // Demo certificate with sample data
    const demoVin = "5YJ3E1EA4NF123456";
    
    // Verify VIN matches for demo certificate too
    if (vin && vin !== demoVin) {
      error = { message: 'VIN mismatch' };
      certificate = null;
    } else {
      certificate = {
        id: "demo-123",
        certificate_id: "CMB-DEMO-2024-SAMPLE",
        tesla_vin: demoVin,
        vehicle_name: "Razor Crest",
        vehicle_model: "modely",
        vehicle_trim: "Long Range",
        vehicle_year: 2022,
        odometer_miles: 39411.451506,
        software_version: "2025.20.7",
        battery_health_data: {
          health_percentage: 92,
          degradation_percentage: 7.3,
          original_capacity_kwh: 79.5,
          current_capacity_kwh: 73.7,
          confidence_level: "high",
          methodology: "SoC vs Ideal Battery Range Analysis",
          battery_chemistry: "NCA (Nickel Cobalt Aluminum)",
          battery_supplier: "Tesla/Panasonic",
          assembly_plant: "Fremont, CA (2022)",
          estimated_range_loss_miles: 326,
        },
        battery_data: {
          battery_level: 25,
          usable_battery_level: 25,
          charge_limit_soc: 50,
          ideal_battery_range: 82,
          est_battery_range: 73.69,
          battery_range: 82,
        },
        is_paid: true,
        created_at: "2025-01-24T14:54:00.000Z",
        user_id: null,
      };
    }
  } else {
    // Look up certificate data from database for real certificates
    const supabase = await createServerSupabaseClient();
    const { data: dbCertificate, error: dbError } = await supabase
      .from("certificates")
      .select("*")
      .eq("certificate_id", id)
      .single();

    certificate = dbCertificate;
    error = dbError;

    // Verify VIN matches if provided (security measure)
    if (certificate && vin && certificate.tesla_vin !== vin) {
      error = { message: 'VIN mismatch' };
      certificate = null;
    }
  }

  // Require VIN parameter for all certificates (including demo) for security
  if (!error && certificate && !vin) {
    error = { message: 'VIN parameter required' };
    certificate = null;
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <header className="border-b bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Link href={links.check} className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <Logo size="sm" />
              </Link>
            </div>
          </header>

          <Card className="mt-12 p-8 text-center shadow-xl max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Certificate Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The certificate ID &quot;{id}&quot; was not found or may have
                expired.
              </p>
              <Button asChild>
                <Link href={links.check}>Check Your Tesla Battery</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check if we're in PDF generation mode
  const isPdfMode = pdf === 'true';

  return (
    <div className={`min-h-screen ${isPdfMode ? 'bg-white' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      {/* Header - Hidden in PDF mode */}
      {!isPdfMode && (
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href={links.check} className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <Logo size="sm" />
            </Link>
            <div className="flex items-center space-x-4">
              <ShareButton certificateId={certificate.certificate_id} />
              <DownloadButton certificateId={certificate.certificate_id} vin={certificate.tesla_vin} />
            </div>
          </div>
        </header>
      )}

      <div className={`container mx-auto px-4 ${isPdfMode ? 'py-4' : 'py-12'} max-w-4xl`}>
        {/* Payment Status Notice - Hidden in PDF mode */}
        {!isPdfMode && (
          <>
            {!certificate.is_paid ? (
              <CertificatePayment 
                certificateId={certificate.certificate_id}
                locale={locale}
                vehicleName={certificate.vehicle_name}
              />
            ) : (
              // Anti-Fraud Notice for paid certificates
              <Card className="mb-8 border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-green-800">
                      Fraud Protection Verified
                    </h3>
                  </div>
                  <p className="text-green-700 text-sm">
                    This certificate is tamper-proof and directly connected to
                    Tesla&apos;s official systems. The QR code below allows instant
                    verification of authenticity. Buyers can trust this assessment
                    is genuine and accurate.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Certificate Display - Only show for paid certificates or PDF mode */}
        {certificate.is_paid || isPdfMode ? (
          <CertificateDisplay 
            certificate={certificate}
            locale={locale}
            isPrintMode={isPdfMode}
          />
        ) : (
          <Card className="mb-8 bg-gray-100 border-gray-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Certificate Locked
              </h3>
              <p className="text-gray-600 mb-4">
                Complete your payment above to unlock the full verified certificate with:
              </p>
              <ul className="text-sm text-gray-600 text-left max-w-md mx-auto space-y-2">
                <li>• Detailed battery health analysis</li>
                <li>• Official degradation percentage</li>
                <li>• Verification QR code</li>
                <li>• Downloadable PDF certificate</li>
                <li>• Fraud protection guarantee</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Email Capture - Only show for paid certificates and not in PDF mode */}
        {certificate.is_paid && !isPdfMode && (
          <EmailCapture 
            context="certificate_view" 
            certificateId={certificate.certificate_id}
          />
        )}

        {/* Verification Footer - Hidden in PDF mode */}
        {!isPdfMode && (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                <span className="font-medium">Verified by batterycert.com</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                This certificate can be verified using QR code or certificate ID:
                {certificate.certificate_id}
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span>
                  Generated:{" "}
                  {new Date(certificate.created_at).toLocaleDateString(locale)}{" "}
                  {new Date(certificate.created_at).toLocaleTimeString(locale, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span>•</span>
                <span>Valid for 3 months</span>
                <span>•</span>
                <Link href="/verify" className="text-blue-600 hover:underline">
                  Verify Certificate
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}