import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { Logo } from "@/components/logo";
import { getLocaleLinks } from "@/lib/locale-links";
import { createServerSupabaseClient } from "@/lib/supabase";
import { ShareButton, DownloadButton } from "@/components/certificate-actions";
import { CertificateDisplay } from "@/components/certificate-display";
import { CertificatePayment } from "@/components/certificate-payment";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations({
    locale,
    namespace: "certificate_page.meta",
  });

  // All certificates including demo ones are now stored in the database
  const supabase = await createServerSupabaseClient();
  const { data: certificate } = await supabase
    .from("certificates")
    .select("*")
    .eq("certificate_id", id)
    .single();

  if (!certificate) {
    return {
      title: t("not_found_title"),
      description: t("not_found_description"),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const keywordsArray = t("keywords").split(", ");

  return {
    title: t("title", { vehicleName: certificate.vehicle_name }),
    description: t("description", { vehicleName: certificate.vehicle_name }),
    keywords: keywordsArray,
    openGraph: {
      title: t("title", { vehicleName: certificate.vehicle_name }),
      description: t("description", { vehicleName: certificate.vehicle_name }),
      type: "website",
      url: `https://batterycert.com/${locale}/certificate/${id}${
        vin ? "?vin=" + vin : ""
      }`,
      siteName: "batterycert.com",
    },
    robots: {
      index: false, // Don't index individual certificates
      follow: true,
    },
    alternates: {
      canonical: `https://batterycert.com/${locale}/certificate/${id}${
        vin ? "?vin=" + vin : ""
      }`,
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
  const t = await getTranslations({ locale, namespace: "certificate_page" });
  const displayTranslations = await getTranslations({
    locale,
    namespace: "certificate_display",
  });
  const paymentTranslations = await getTranslations({
    locale,
    namespace: "certificate_payment",
  });
  const certificateActionsTranslations = await getTranslations({
    locale,
    namespace: "certificate_actions",
  });

  const certificateActionsTranslationsObj = {
    share: certificateActionsTranslations("share"),
    copied: certificateActionsTranslations("copied"),
    download_pdf: certificateActionsTranslations("download_pdf"),
    generating: certificateActionsTranslations("generating"),
    share_title: certificateActionsTranslations("share_title", {
      certificateId: id,
    }),
    share_text: certificateActionsTranslations("share_text"),
    download_error: certificateActionsTranslations("download_error", {
      error: "Unknown error",
    }),
  };

  // All certificates including demo ones are now stored in the database
  let certificate;
  let error = null;

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
    error = { message: "VIN mismatch" };
    certificate = null;
  }

  // Require VIN parameter for all certificates (including demo) for security
  if (!error && certificate && !vin) {
    error = { message: "VIN parameter required" };
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
                {t("not_found.title")}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("not_found.description", { id })}
              </p>
              <Button asChild>
                <Link href={links.check}>{t("not_found.button")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check if we're in PDF generation mode
  const isPdfMode = pdf === "true";

  return (
    <div
      className={`min-h-screen ${
        isPdfMode ? "bg-white" : "bg-gradient-to-br from-slate-50 to-blue-50"
      }`}
    >
      {/* Header - Hidden in PDF mode */}
      {!isPdfMode && (
        <header className="border-b bg-white/80 backdrop-blur-sm print:hidden">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href={links.check} className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <Logo size="sm" />
            </Link>
            <div className="flex items-center space-x-4">
              <ShareButton
                certificateId={certificate.certificate_id}
                translations={certificateActionsTranslationsObj}
              />
              <DownloadButton
                certificateId={certificate.certificate_id}
                vin={certificate.tesla_vin}
                translations={certificateActionsTranslationsObj}
              />
            </div>
          </div>
        </header>
      )}

      <div
        className={`container mx-auto px-4 ${
          isPdfMode ? "py-4" : "py-12"
        } max-w-4xl`}
      >
        {/* Payment Status Notice - Hidden in PDF mode */}
        {!isPdfMode && (
          <>
            {!certificate.is_paid ? (
              <CertificatePayment
                certificateId={certificate.certificate_id}
                locale={locale}
                vehicleName={certificate.vehicle_name}
                translations={{
                  payment_required: paymentTranslations("payment_required"),
                  certificate_description: paymentTranslations(
                    "certificate_description"
                  ),
                  pricing_description: paymentTranslations(
                    "pricing_description"
                  ),
                  pricing_loading: paymentTranslations("pricing_loading"),
                  pricing_error: paymentTranslations("pricing_error"),
                  certificate_price: paymentTranslations("certificate_price"),
                  payment_button: paymentTranslations("payment_button"),
                  payment_processing: paymentTranslations("payment_processing"),
                  loading: paymentTranslations("loading"),
                  secure_payment: paymentTranslations("secure_payment"),
                }}
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
                      {t("fraud_protection.title")}
                    </h3>
                  </div>
                  <p className="text-green-700 text-sm">
                    {t("fraud_protection.description")}
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
            translations={{
              chart: {
                title: displayTranslations("chart.title"),
                this_vehicle: displayTranslations("chart.this_vehicle"),
                tesla_average: displayTranslations("chart.tesla_average"),
              },
              title: displayTranslations("title"),
              certificate_id: displayTranslations("certificate_id"),
              health_score: displayTranslations("health_score"),
              scan_to_verify: displayTranslations("scan_to_verify"),
              vehicle_information: displayTranslations("vehicle_information"),
              model: displayTranslations("model"),
              year: displayTranslations("year"),
              assessment_details: displayTranslations("assessment_details"),
              test_date: displayTranslations("test_date"),
              mileage: displayTranslations("mileage"),
              software_version: displayTranslations("software_version"),
              not_available: displayTranslations("not_available"),
              valid_until: displayTranslations("valid_until"),
              battery_performance: displayTranslations("battery_performance"),
              better_than_percentage: displayTranslations.raw(
                "better_than_percentage"
              ),
              degradation_comparison: displayTranslations(
                "degradation_comparison"
              ),
              detailed_analysis: displayTranslations("detailed_analysis"),
              battery_specifications: displayTranslations(
                "battery_specifications"
              ),
              original_capacity: displayTranslations("original_capacity"),
              current_capacity: displayTranslations("current_capacity"),
              capacity_loss: displayTranslations("capacity_loss"),
              methodology: displayTranslations("methodology"),
              performance_indicators: displayTranslations(
                "performance_indicators"
              ),
              battery_chemistry: displayTranslations("battery_chemistry"),
              battery_supplier: displayTranslations("battery_supplier"),
              confidence_level: displayTranslations("confidence_level"),
              overall_condition: displayTranslations("overall_condition"),
              assessment_summary: displayTranslations("assessment_summary"),
              summary_excellent: displayTranslations.raw("summary_excellent"),
              summary_good: displayTranslations.raw("summary_good"),
              summary_fair: displayTranslations.raw("summary_fair"),
              conditions: {
                excellent: displayTranslations("conditions.excellent"),
                good: displayTranslations("conditions.good"),
                average: displayTranslations("conditions.average"),
                fair: displayTranslations("conditions.fair"),
                poor: displayTranslations("conditions.poor"),
              },
              units: {
                kwh: displayTranslations("units.kwh"),
                miles: displayTranslations("units.miles"),
                km: displayTranslations("units.km"),
              },
            }}
          />
        ) : (
          <Card className="mb-8 bg-gray-100 border-gray-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {t("certificate_locked.title")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("certificate_locked.description")}
              </p>
              <ul className="text-sm text-gray-600 text-left max-w-md mx-auto space-y-2">
                <li>• {t("certificate_locked.features.detailed_analysis")}</li>
                <li>
                  • {t("certificate_locked.features.degradation_percentage")}
                </li>
                <li>• {t("certificate_locked.features.qr_code")}</li>
                <li>• {t("certificate_locked.features.downloadable_pdf")}</li>
                <li>• {t("certificate_locked.features.fraud_protection")}</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Verification Footer - Hidden in PDF mode */}
        {!isPdfMode && (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                <span className="font-medium">
                  {t("verification_footer.verified_by")}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {t("verification_footer.verification_description")}{" "}
                {certificate.certificate_id}
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span>
                  {t("verification_footer.generated")}{" "}
                  {new Date(certificate.created_at).toLocaleDateString(locale)}{" "}
                  {new Date(certificate.created_at).toLocaleTimeString(locale, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span>•</span>
                <span>{t("verification_footer.valid_for")}</span>
                <span>•</span>
                <Link href="/verify" className="text-blue-600 hover:underline">
                  {t("verification_footer.verify_certificate")}
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
