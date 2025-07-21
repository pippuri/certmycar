"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, Zap, CheckCircle, TrendingUp, Shield } from "lucide-react";
import { QRCode } from "./qr-code";
import { CertificateIcon } from "./certificate-icon";

export function HeroVisual() {
  const [batteryLevel, setBatteryLevel] = useState(92);
  const [isAnimating, setIsAnimating] = useState(false);

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-3">
                <CertificateIcon className="w-4 h-4 mr-2 text-green-600" />
                Verified Certificate
              </Badge>
              <h2 className="text-2xl font-bold text-gray-900">
                Tesla Battery Health Report
              </h2>
              <p className="text-gray-600">Certificate ID: CMB-2024-001234</p>
            </div>
            <div className="text-right">
              <div
                className={`text-5xl font-bold text-green-600 transition-all duration-500 ${
                  isAnimating ? "scale-110" : ""
                }`}
              >
                {batteryLevel}%
              </div>
              <p className="text-gray-600">Health Score</p>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-800">
                <Zap className="h-5 w-5 mr-2 text-blue-600" />
                Vehicle Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Model</span>
                  <span className="font-medium">Tesla Model Y Long Range</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year</span>
                  <span className="font-medium">2022</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color</span>
                  <span className="font-medium">Pearl White Multi-Coat</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-800">
                <Battery className="h-5 w-5 mr-2 text-green-600" />
                Battery Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Capacity</span>
                  <span className="font-medium">73.1 kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Degradation</span>
                  <span className="font-medium text-green-600">8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Range</span>
                  <span className="font-medium">326 miles</span>
                </div>
              </div>
            </div>
          </div>

          {/* Battery Health Visualization */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800">
                Battery Health Over Time
              </h3>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                <TrendingUp className="w-4 h-4 mr-1" />
                Excellent Trend
              </Badge>
            </div>

            {/* Simplified Battery Health Chart */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-end space-x-2 h-24">
                {[100, 98, 96, 94, 93, 92, 92].map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all duration-1000 delay-100"
                      style={{ height: `${(value / 100) * 100}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">
                      {2018 + index}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Indicators with QR Code */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-green-800">Verified Data</p>
              <p className="text-sm text-green-600">Direct Tesla API</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-blue-800">Tamper-Proof</p>
              <p className="text-sm text-blue-600">QR Verification</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="font-medium text-purple-800">Increase Value</p>
              <p className="text-sm text-purple-600">Proven Health</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="flex justify-center mb-3">
                <QRCode
                  url="https://batterycert.com"
                  size={80}
                  className="border-0 shadow-none p-0"
                />
              </div>
              <p className="font-medium text-gray-800">Scan to Verify</p>
              <p className="text-sm text-gray-600">batterycert.com</p>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CertificateIcon className="w-4 h-4 text-gray-400" />
                <span>Verified by batterycert.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>Generated: Jan 21, 2025</span>
                <span>•</span>
                <span>Valid for 1 year</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 animate-pulse" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-15 animate-pulse delay-1000" />
    </div>
  );
}
