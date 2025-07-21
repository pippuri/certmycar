import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { Logo } from "@/components/logo";
import Image from "next/image";

export default function CertificatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/check" className="flex items-center space-x-2">
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
        {/* Anti-Fraud Notice */}
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

        {/* Main Certificate Card */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">
                  Battery Health Report
                </CardTitle>
                <p className="text-blue-100">Certificate ID: CMB-2024-001234</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">92%</div>
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
                      Tesla Model Y Long Range
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year</span>
                    <span className="font-medium">2022</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VIN</span>
                    <span className="font-medium">7SAYGDEE9NF123456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color</span>
                    <span className="font-medium">Pearl White Multi-Coat</span>
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
                    <span className="font-medium">January 21, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mileage</span>
                    <span className="font-medium">28,450 miles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Software Version</span>
                    <span className="font-medium">2024.44.25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid Until</span>
                    <span className="font-medium">January 21, 2026</span>
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
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      92%
                    </div>
                    <p className="text-green-800 font-medium">Health Score</p>
                    <p className="text-sm text-green-700 mt-1">Excellent</p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      73
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
                      326
                    </div>
                    <p className="text-purple-800 font-medium">Est. Range</p>
                    <p className="text-sm text-purple-700 mt-1">miles</p>
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
                      <QrCode className="h-8 w-8 text-gray-600" />
                    </div>
                    <div className="text-sm text-blue-600">
                      <p className="font-medium">Scan QR code to verify</p>
                      <p>Certificate ID: CMB-2024-001234</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
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
                        <span>79.5 kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Capacity</span>
                        <span>73.1 kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity Loss</span>
                        <span className="text-green-600">6.4 kWh (8%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Charging Cycles</span>
                        <span>~280 cycles</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Performance Indicators</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Degradation Rate</span>
                        <span className="text-green-600">2.7% per year</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Temperature Management
                        </span>
                        <span className="text-green-600">Optimal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cell Balance</span>
                        <span className="text-green-600">Excellent</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Overall Condition</span>
                        <span className="text-green-600">Excellent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">
                Assessment Summary
              </h4>
              <p className="text-green-700 text-sm leading-relaxed">
                This Tesla Model Y demonstrates excellent battery health with
                only 8% degradation after 3 years of use. The battery is
                performing exceptionally well for its age and mileage. Current
                capacity supports an estimated range of 326 miles under normal
                driving conditions. The battery management system is functioning
                optimally, and no immediate concerns were identified during this
                assessment. This vehicle represents an excellent purchase
                opportunity with minimal battery-related risks.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Verification Footer */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <span className="font-medium">Verified by CertMyBattery</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This certificate can be verified using QR code or certificate ID:
              CMB-2024-001234
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>Generated: Jan 21, 2025 2:54 PM</span>
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
