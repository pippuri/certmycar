"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, Zap, CheckCircle, TrendingUp, Shield } from "lucide-react";
import { QRCode } from "./qr-code";
import { CertificateIcon } from "./certificate-icon";

interface HeroVisualTranslations {
  verified_certificate: string;
  battery_health_report: string;
  certificate_id: string;
  certified: string;
  verified: string;
  health_score: string;
  vehicle_information: string;
  model: string;
  tesla_model_y: string;
  year: string;
  vin: string;
  battery_metrics: string;
  current_capacity: string;
  degradation: string;
  est_range: string;
  miles: string;
  degradation_comparison: string;
  better_than_percentage: string;
  this_vehicle: string;
  average: string;
  verified_data: string;
  direct_tesla_api: string;
  tamper_proof: string;
  qr_verification: string;
  increase_value: string;
  proven_health: string;
  scan_to_verify: string;
  verified_by: string;
  generated: string;
  generated_date: string;
  valid_for_one_year: string;
}

interface HeroVisualProps {
  translations?: HeroVisualTranslations;
}

export function HeroVisual({ translations }: HeroVisualProps = {}) {
  const [batteryLevel, setBatteryLevel] = useState(92);
  const [isAnimating, setIsAnimating] = useState(false);

  // Default translations for fallback
  const defaultTranslations: HeroVisualTranslations = {
    verified_certificate: "Verified Certificate",
    battery_health_report: "Tesla Battery Health Report",
    certificate_id: "Certificate ID",
    certified: "CERTIFIED",
    verified: "VERIFIED",
    health_score: "Health Score",
    vehicle_information: "Vehicle Information",
    model: "Model",
    tesla_model_y: "Tesla Model Y Long Range",
    year: "Year",
    vin: "VIN",
    battery_metrics: "Battery Metrics",
    current_capacity: "Current Capacity",
    degradation: "Degradation",
    est_range: "Est. Range",
    miles: "miles",
    degradation_comparison: "Degradation Comparison vs Average",
    better_than_percentage: "Better than 78% of similar vehicles",
    this_vehicle: "This Vehicle (92%)",
    average: "Average (85%)",
    verified_data: "Verified Data",
    direct_tesla_api: "Direct Tesla API",
    tamper_proof: "Tamper-Proof",
    qr_verification: "QR Verification",
    increase_value: "Increase Value",
    proven_health: "Proven Health",
    scan_to_verify: "Scan to Verify",
    verified_by: "Verified by batterycert.com",
    generated: "Generated",
    generated_date: "Jul 24, 2025",
    valid_for_one_year: "Valid for 3 months",
  };

  // Use translations from props if provided, otherwise use defaults
  const text = translations || defaultTranslations;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setBatteryLevel((prev) => (prev === 92 ? 89 : prev === 89 ? 95 : 92));
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Certificate Preview */}
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 relative">
            <div>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 mb-3">
                <CertificateIcon className="w-4 h-4 mr-2 text-emerald-600" />
                {text.verified_certificate}
              </Badge>
              <h2 className="text-2xl font-bold text-gray-900">
                {text.battery_health_report}
              </h2>
              <p className="text-gray-600">
                {text.certificate_id}: CMB-2024-001234
              </p>
            </div>

            {/* Large Certificate Approval Stamp */}
            <div className="absolute -top-4 -right-4 z-10">
              <div className="relative">
                <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center shadow-2xl rotate-12">
                  <div className="text-center">
                    <Shield className="h-12 w-12 text-white mx-auto mb-1" />
                    <div className="text-white font-bold text-xs">
                      {text.certified}
                    </div>
                    <div className="text-white text-xs opacity-90">
                      {text.verified}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 w-32 h-32 border-4 border-slate-700 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`text-5xl font-bold text-emerald-600 transition-all duration-500 ${
                  isAnimating ? "scale-110" : ""
                }`}
              >
                {batteryLevel}%
              </div>
              <p className="text-gray-600">{text.health_score}</p>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-800">
                <Zap className="h-5 w-5 mr-2 text-slate-600" />
                {text.vehicle_information}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{text.model}</span>
                  <span className="font-medium">{text.tesla_model_y}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{text.year}</span>
                  <span className="font-medium">2022</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{text.vin}</span>
                  <span className="font-medium font-mono">5YJ3E***F123456</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-800">
                <Battery className="h-5 w-5 mr-2 text-emerald-600" />
                {text.battery_metrics}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{text.current_capacity}</span>
                  <span className="font-medium">73.1 kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{text.degradation}</span>
                  <span className="font-medium text-emerald-600">8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{text.est_range}</span>
                  <span className="font-medium">326 {text.miles}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Battery Health Visualization */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800">
                {text.degradation_comparison}
              </h3>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                <TrendingUp className="w-4 h-4 mr-1" />
                {text.better_than_percentage}
              </Badge>
            </div>

            {/* Enhanced Degradation Curve Chart */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="relative h-32">
                {/* Grid lines */}
                <div className="absolute inset-0">
                  {[80, 85, 90, 95, 100].map((value) => (
                    <div
                      key={value}
                      className="absolute w-full border-t border-gray-200"
                      style={{ bottom: `${((value - 75) / 25) * 100}%` }}
                    >
                      <span className="absolute -left-8 -top-2 text-xs text-gray-400">
                        {value}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Year labels */}
                <div className="absolute bottom-0 w-full flex justify-between px-4">
                  {["2022", "2023", "2024", "2025", "2026"].map((year) => (
                    <span key={year} className="text-xs text-gray-500">
                      {year}
                    </span>
                  ))}
                </div>

                {/* Reference curve (average) */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 400 128"
                >
                  <defs>
                    <linearGradient
                      id="referenceGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#64748b" stopOpacity="0.3" />
                      <stop
                        offset="100%"
                        stopColor="#64748b"
                        stopOpacity="0.1"
                      />
                    </linearGradient>
                  </defs>
                  {/* Reference curve area */}
                  <path
                    d="M 20 16 Q 120 24 220 40 Q 320 56 380 76 L 380 128 L 20 128 Z"
                    fill="url(#referenceGradient)"
                    className="opacity-60"
                  />
                  {/* Reference curve line */}
                  <path
                    d="M 20 16 Q 120 24 220 40 Q 320 56 380 76"
                    stroke="#64748b"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="4,4"
                    className="opacity-80"
                  />
                </svg>

                {/* This vehicle's curve */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 400 128"
                >
                  <defs>
                    <linearGradient
                      id="vehicleGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop
                        offset="100%"
                        stopColor="#10b981"
                        stopOpacity="0.1"
                      />
                    </linearGradient>
                  </defs>
                  {/* Vehicle curve area */}
                  <path
                    d="M 20 8 Q 120 12 220 20 Q 320 28 380 32 L 380 128 L 20 128 Z"
                    fill="url(#vehicleGradient)"
                    className="opacity-80"
                  />
                  {/* Vehicle curve line */}
                  <path
                    d="M 20 8 Q 120 12 220 20 Q 320 28 380 32"
                    stroke="#10b981"
                    strokeWidth="3"
                    fill="none"
                  />
                  {/* Current point indicator */}
                  <circle
                    cx="320"
                    cy="28"
                    r="4"
                    fill="#10b981"
                    className="animate-pulse"
                  />
                </svg>

                {/* Legend */}
                <div className="absolute top-2 right-2 bg-white/90 p-3 rounded-lg shadow-sm">
                  <div className="flex flex-col space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-0.5 bg-emerald-500"></div>
                      <span className="text-gray-700">{text.this_vehicle}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-0.5 border-t-2 border-dashed border-amber-500"></div>
                      <span className="text-gray-700">{text.average}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators with QR Code */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <CheckCircle className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="font-medium text-slate-800">{text.verified_data}</p>
              <p className="text-sm text-slate-600">{text.direct_tesla_api}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <Shield className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="font-medium text-slate-800">{text.tamper_proof}</p>
              <p className="text-sm text-slate-600">{text.qr_verification}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <TrendingUp className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="font-medium text-slate-800">
                {text.increase_value}
              </p>
              <p className="text-sm text-slate-600">{text.proven_health}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="flex justify-center mb-3">
                <QRCode
                  url="https://batterycert.com"
                  size={80}
                  className="border-0 shadow-none p-0"
                />
              </div>
              <p className="font-medium text-slate-800">
                {text.scan_to_verify}
              </p>
              <p className="text-sm text-slate-600">batterycert.com</p>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CertificateIcon className="w-4 h-4 text-gray-400" />
                <span>{text.verified_by}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>
                  {text.generated}: {text.generated_date}
                </span>
                <span>•</span>
                <span>{text.valid_for_one_year}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full opacity-10 animate-pulse" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full opacity-8 animate-pulse delay-1000" />
    </div>
  );
}
