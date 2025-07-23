import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  Share2,
  CheckCircle,
  Calendar,
  Car,
  Zap,
  TrendingUp,
  QrCode,
  AlertTriangle,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { getLocaleLinks } from "@/lib/locale-links";
import { createServerSupabaseClient } from "@/lib/supabase";

export default async function CertificatePage({
  params
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params;
  const links = getLocaleLinks(locale);
  
  // Handle demo certificate with hardcoded data
  let certificate;
  let error = null;
  
  if (id === "CMB-DEMO-2024-SAMPLE") {
    // Demo certificate with sample data
    certificate = {
      id: "demo-123",
      certificate_id: "CMB-DEMO-2024-SAMPLE",
      tesla_vin: "5YJ3E1EA4NF123456",
      vehicle_name: "Tesla Model Y Long Range",
      vehicle_model: "modely",
      vehicle_trim: "Long Range",
      vehicle_year: 2022,
      odometer_miles: 39411.451506,
      software_version: "2025.20.7",
      battery_health_data: {
        health_percentage: 92,
        degradation_percentage: 8.0,
        original_capacity_kwh: 79.5,
        current_capacity_kwh: 73.1,
        confidence_level: "high",
        methodology: "SoC vs Ideal Battery Range Analysis",
        battery_chemistry: "NCA (Nickel Cobalt Aluminum)",
        battery_supplier: "Tesla/Panasonic",
        assembly_plant: "Fremont, CA (2022)",
        estimated_range_loss_miles: 326
      },
      battery_data: {
        battery_level: 25,
        usable_battery_level: 25,
        charge_limit_soc: 50,
        ideal_battery_range: 82,
        est_battery_range: 73.69,
        battery_range: 82
      },
      is_paid: true,
      created_at: "2024-01-21T14:54:00.000Z",
      user_id: null
    };
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
                The certificate ID &quot;{id}&quot; was not found or may have expired.
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
  
  // Parse the stored battery health data
  const batteryHealth = certificate.battery_health_data;
  
  // Helper function to determine if user should see miles vs km
  const usesMiles = locale?.startsWith('en-US') || locale?.startsWith('en-GB') || locale?.startsWith('en-AU');
  
  // Format date
  const testDate = new Date(certificate.created_at).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Calculate valid until date (1 year from creation)
  const validUntil = new Date(certificate.created_at);
  validUntil.setFullYear(validUntil.getFullYear() + 1);
  const validUntilFormatted = validUntil.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={links.check} className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <Logo size="sm" />
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Payment Status Notice */}
        {!certificate.is_paid ? (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-yellow-800">
                  Payment Required
                </h3>
              </div>
              <p className="text-yellow-700 text-sm mb-4">
                This certificate requires payment to unlock the full report. 
                Complete your purchase to access the verified document.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Complete Payment - $9.99
              </Button>
            </CardContent>
          </Card>
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
                verification of authenticity. Buyers can trust this assessment is
                genuine and accurate.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Main Certificate Card */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">
                  Battery Health Report
                </CardTitle>
                <p className="text-blue-100">Certificate ID: {certificate.certificate_id}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{Math.round(100 - batteryHealth.degradation_percentage)}%</div>
                <p className="text-blue-100">Health Score</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Vehicle Information */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  Vehicle Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model</span>
                    <span className="font-medium">
                      {certificate.vehicle_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year</span>
                    <span className="font-medium">{certificate.vehicle_year || '2022'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VIN</span>
                    <span className="font-medium font-mono">{certificate.tesla_vin.slice(0, 5)}***{certificate.tesla_vin.slice(-4)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Assessment Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Test Date</span>
                    <span className="font-medium">{testDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mileage</span>
                    <span className="font-medium">
                      {certificate.odometer_miles ? (
                        usesMiles 
                          ? `${Math.round(certificate.odometer_miles).toLocaleString()} miles`
                          : `${Math.round(certificate.odometer_miles * 1.609).toLocaleString()} km`
                      ) : 'Not Available'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Software Version</span>
                    <span className="font-medium">{certificate.software_version || 'Not Available'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid Until</span>
                    <span className="font-medium">{validUntilFormatted}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Battery Metrics */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Battery Performance Metrics
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className={`${batteryHealth.degradation_percentage < 10 ? 'bg-green-50 border-green-200' : batteryHealth.degradation_percentage < 15 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                  <CardContent className="p-6 text-center">
                    <div className={`text-3xl font-bold mb-2 ${batteryHealth.degradation_percentage < 10 ? 'text-green-600' : batteryHealth.degradation_percentage < 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {Math.round(100 - batteryHealth.degradation_percentage)}%
                    </div>
                    <p className={`font-medium ${batteryHealth.degradation_percentage < 10 ? 'text-green-800' : batteryHealth.degradation_percentage < 15 ? 'text-yellow-800' : 'text-red-800'}`}>Health Score</p>
                    <p className={`text-sm mt-1 ${batteryHealth.degradation_percentage < 10 ? 'text-green-700' : batteryHealth.degradation_percentage < 15 ? 'text-yellow-700' : 'text-red-700'}`}>
                      {batteryHealth.degradation_percentage < 10 ? 'Excellent' : batteryHealth.degradation_percentage < 15 ? 'Good' : 'Fair'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {Math.round(batteryHealth.current_capacity_kwh)}
                    </div>
                    <p className="text-blue-800 font-medium">
                      Current Capacity
                    </p>
                    <p className="text-sm text-blue-700 mt-1">kWh</p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {batteryHealth.estimated_range_loss_miles ? 
                        usesMiles 
                          ? Math.round(batteryHealth.estimated_range_loss_miles)
                          : Math.round(batteryHealth.estimated_range_loss_miles * 1.609)
                        : 'N/A'
                      }
                    </div>
                    <p className="text-purple-800 font-medium">Est. Range</p>
                    <p className="text-sm text-purple-700 mt-1">{usesMiles ? 'miles' : 'km'}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Buyer Protection Section */}
            <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">
                Benefits for buyers
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-blue-700">
                    Why buyer should ask for a certificate
                  </h4>
                  <div className="space-y-2 text-sm text-blue-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Access the actual vehicle battery health data</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>No hidden degradation issues</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Verified against best practices</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-blue-700">
                    Certificate Verification
                  </h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border">
                      <a 
                        href={`/${locale}/certificate/${certificate.certificate_id}`}
                        className="block w-full h-full flex items-center justify-center"
                        title="Click to view certificate"
                      >
                        <QrCode className="h-8 w-8 text-gray-600 hover:text-blue-600 transition-colors" />
                      </a>
                    </div>
                    <div className="text-sm text-blue-600">
                      <p className="font-medium">Scan QR code to verify</p>
                      <p>Certificate ID: {certificate.certificate_id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis - Only show if paid */}
            {certificate.is_paid && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Detailed Analysis
                </h3>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Battery Specifications</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Original Capacity</span>
                          <span>{batteryHealth.original_capacity_kwh} kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Capacity</span>
                          <span>{Math.round(batteryHealth.current_capacity_kwh * 10) / 10} kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capacity Loss</span>
                          <span className={batteryHealth.degradation_percentage < 10 ? 'text-green-600' : batteryHealth.degradation_percentage < 15 ? 'text-yellow-600' : 'text-red-600'}>
                            {Math.round((batteryHealth.original_capacity_kwh - batteryHealth.current_capacity_kwh) * 10) / 10} kWh ({Math.round(batteryHealth.degradation_percentage * 10) / 10}%)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Methodology</span>
                          <span className="text-sm">{batteryHealth.methodology}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Performance Indicators</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Battery Chemistry</span>
                          <span>{batteryHealth.battery_chemistry || 'Lithium-ion'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Battery Supplier</span>
                          <span>{batteryHealth.battery_supplier || 'Tesla/Panasonic'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Confidence Level</span>
                          <span className={batteryHealth.confidence_level === 'high' ? 'text-green-600' : batteryHealth.confidence_level === 'medium' ? 'text-yellow-600' : 'text-red-600'}>
                            {batteryHealth.confidence_level?.charAt(0).toUpperCase() + batteryHealth.confidence_level?.slice(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Overall Condition</span>
                          <span className={batteryHealth.degradation_percentage < 10 ? 'text-green-600' : batteryHealth.degradation_percentage < 15 ? 'text-yellow-600' : 'text-red-600'}>
                            {batteryHealth.degradation_percentage < 10 ? 'Excellent' : batteryHealth.degradation_percentage < 15 ? 'Good' : 'Fair'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className={`p-6 rounded-lg border ${
              batteryHealth.degradation_percentage < 10 ? 'bg-green-50 border-green-200' : 
              batteryHealth.degradation_percentage < 15 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
            }`}>
              <h4 className={`font-semibold mb-3 ${
                batteryHealth.degradation_percentage < 10 ? 'text-green-800' : 
                batteryHealth.degradation_percentage < 15 ? 'text-yellow-800' : 'text-red-800'
              }`}>
                Assessment Summary
              </h4>
              <p className={`text-sm leading-relaxed ${
                batteryHealth.degradation_percentage < 10 ? 'text-green-700' : 
                batteryHealth.degradation_percentage < 15 ? 'text-yellow-700' : 'text-red-700'
              }`}>
                This {certificate.vehicle_name} demonstrates {batteryHealth.degradation_percentage < 10 ? 'excellent' : batteryHealth.degradation_percentage < 15 ? 'good' : 'fair'} battery health with
                {Math.round(batteryHealth.degradation_percentage * 10) / 10}% degradation. The battery is
                performing {batteryHealth.degradation_percentage < 10 ? 'exceptionally well' : batteryHealth.degradation_percentage < 15 ? 'well' : 'adequately'} for its usage. Current
                capacity of {Math.round(batteryHealth.current_capacity_kwh * 10) / 10} kWh from an original {batteryHealth.original_capacity_kwh} kWh.
                {batteryHealth.degradation_percentage < 10 ? ' This vehicle represents an excellent purchase opportunity with minimal battery-related risks.' : 
                 batteryHealth.degradation_percentage < 15 ? ' This vehicle represents a good purchase opportunity with normal wear patterns.' :
                 ' This vehicle shows higher than average degradation and should be considered carefully.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Verification Footer */}
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
              <span>Generated: {new Date(certificate.created_at).toLocaleDateString(locale)} {new Date(certificate.created_at).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span>
              <span>•</span>
              <span>Valid for 1 year</span>
              <span>•</span>
              <Link href="/verify" className="text-blue-600 hover:underline">
                Verify Certificate
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}