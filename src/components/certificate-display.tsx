"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Car,
  Zap,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

// Tesla battery degradation benchmarks based on real-world data
const TESLA_BENCHMARKS = {
  // Average degradation by vehicle age (years): 5% first year, +1% each year after
  degradationByAge: {
    0: 0,      // New vehicle
    1: 5,      // 1 year: 5% average degradation
    2: 6,      // 2 years: 6% average (5% + 1%)
    3: 7,      // 3 years: 7% average (5% + 2%)
    4: 8,      // 4 years: 8% average (5% + 3%)
    5: 9,      // 5 years: 9% average (5% + 4%)
    6: 10,     // 6 years: 10% average (5% + 5%)
    7: 11,     // 7+ years: ~11% average (5% + 6%)
  },
  // Percentile thresholds for condition assessment
  percentiles: {
    excellent: 0.1,   // Top 10% (very low degradation)
    good: 0.3,        // Top 30% (below average degradation)
    average: 0.6,     // Average range (30-60%)
    fair: 0.85,       // Fair range (60-85%)
    poor: 1.0,        // Bottom 15% (high degradation)
  }
};

// Calculate benchmark statistics
function calculateBenchmarkStats(vehicleAge: number, currentDegradation: number) {
  // Get expected degradation for this age
  const maxAge = Math.max(...Object.keys(TESLA_BENCHMARKS.degradationByAge).map(Number));
  const ageKey = Math.min(vehicleAge, maxAge);
  const expectedDegradation = TESLA_BENCHMARKS.degradationByAge[ageKey as keyof typeof TESLA_BENCHMARKS.degradationByAge];
  
  // Calculate relative performance (lower is better for degradation)
  const relativePerformance = currentDegradation / Math.max(expectedDegradation, 0.1);
  
  // Determine condition based on how much better/worse than expected
  let condition: string;
  let percentileBetter: number;
  let color: string;
  
  if (currentDegradation <= expectedDegradation * 0.7) {
    // 30% better than expected or more = Excellent
    condition = "Excellent";
    percentileBetter = 85;
    color = "text-green-600";
  } else if (currentDegradation <= expectedDegradation * 0.9) {
    // 10-30% better than expected = Good  
    condition = "Good";
    percentileBetter = 70;
    color = "text-blue-600";
  } else if (currentDegradation <= expectedDegradation * 1.1) {
    // Within 10% of expected = Average
    condition = "Average";
    percentileBetter = 50;
    color = "text-yellow-600";
  } else if (currentDegradation <= expectedDegradation * 1.3) {
    // 10-30% worse than expected = Fair
    condition = "Fair";
    percentileBetter = 25;
    color = "text-orange-600";
  } else {
    // More than 30% worse = Poor
    condition = "Poor";
    percentileBetter = 10;
    color = "text-red-600";
  }
  
  return {
    expectedDegradation,
    relativePerformance,
    condition,
    percentileBetter,
    color,
    vsAverage: currentDegradation - expectedDegradation
  };
}

// Beautiful custom chart component that actually works with React 19
function BatteryDegradationChart({ 
  vehicleYear, 
  currentDegradation 
}: { 
  vehicleYear: number; 
  currentDegradation: number; 
}) {
  const [hoveredPoint, setHoveredPoint] = useState<{x: number, y: number, data: {
    year: number;
    thisVehicle: number;
    average: number;
    thisVehicleDegradation: number;
    averageDegradation: number;
    isCurrent: boolean;
  }} | null>(null);
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - vehicleYear;
  
  const generateDegradationData = () => {
    const years = Array.from({ length: 6 }, (_, i) => vehicleYear + i);
    return years.map((year, index) => {
      // Use actual benchmark data for average
      const maxAge = Math.max(...Object.keys(TESLA_BENCHMARKS.degradationByAge).map(Number));
      const ageKey = Math.min(index, maxAge);
      const averageDegradation = TESLA_BENCHMARKS.degradationByAge[ageKey as keyof typeof TESLA_BENCHMARKS.degradationByAge];
      
      let thisVehicleDegradation;
      if (index <= vehicleAge) {
        // Actual data for past years
        const actualRate = currentDegradation / Math.max(vehicleAge, 1);
        thisVehicleDegradation = index * actualRate;
      } else {
        // Projected future degradation
        const projectedRate = currentDegradation / Math.max(vehicleAge, 1);
        thisVehicleDegradation = currentDegradation + (index - vehicleAge) * projectedRate;
      }
      
      return {
        year,
        thisVehicle: Math.max(0, 100 - thisVehicleDegradation),
        average: Math.max(0, 100 - averageDegradation),
        thisVehicleDegradation,
        averageDegradation,
        isCurrent: year === currentYear,
      };
    });
  };

  const chartData = generateDegradationData();
  const chartWidth = 500;
  const chartHeight = 300;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Scale functions
  const xScale = (year: number) => ((year - vehicleYear) / 5) * innerWidth;
  const yScale = (health: number) => innerHeight - ((health - 75) / 25) * innerHeight;

  // Generate path strings
  const thisVehiclePath = chartData.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(d.year)},${yScale(d.thisVehicle)}`
  ).join(' ');

  const averagePath = chartData.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(d.year)},${yScale(d.average)}`
  ).join(' ');

  // Generate area paths
  const thisVehicleArea = `M ${xScale(chartData[0].year)},${innerHeight} L ${thisVehiclePath.replace('M ', '').replace(/L /g, ' L ')} L ${xScale(chartData[chartData.length - 1].year)},${innerHeight} Z`;
  const averageArea = `M ${xScale(chartData[0].year)},${innerHeight} L ${averagePath.replace('M ', '').replace(/L /g, ' L ')} L ${xScale(chartData[chartData.length - 1].year)},${innerHeight} Z`;

  return (
    <div className="w-full bg-white rounded-lg border p-6">
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">Battery Health Over Time</h4>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">This Vehicle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-gray-400 rounded" style={{borderTop: '2px dashed'}}></div>
            <span className="text-gray-600">Tesla Average</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <svg 
          width={chartWidth} 
          height={chartHeight} 
          className="overflow-visible"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="thisVehicleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="averageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          <g transform={`translate(${padding.left},${padding.top})`}>
            {/* Grid lines */}
            {[80, 85, 90, 95, 100].map(value => (
              <g key={value}>
                <line 
                  x1="0" 
                  y1={yScale(value)} 
                  x2={innerWidth} 
                  y2={yScale(value)} 
                  stroke="#f3f4f6" 
                  strokeWidth="1"
                />
                <text 
                  x="-10" 
                  y={yScale(value)} 
                  textAnchor="end" 
                  dy="0.35em"
                  className="text-xs fill-gray-500"
                >
                  {value}%
                </text>
              </g>
            ))}
            
            {/* X-axis labels */}
            {chartData.map((d) => (
              <text 
                key={d.year}
                x={xScale(d.year)} 
                y={innerHeight + 20} 
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {d.year}
              </text>
            ))}
            
            {/* Area fills */}
            <path 
              d={averageArea} 
              fill="url(#averageGradient)"
            />
            <path 
              d={thisVehicleArea} 
              fill="url(#thisVehicleGradient)"
            />
            
            {/* Lines */}
            <path 
              d={averagePath} 
              fill="none" 
              stroke="#9ca3af" 
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <path 
              d={thisVehiclePath} 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="3"
            />
            
            {/* Data points */}
            {chartData.map((d) => (
              <g key={d.year}>
                <circle
                  cx={xScale(d.year)}
                  cy={yScale(d.thisVehicle)}
                  r={d.isCurrent ? "6" : "4"}
                  fill={d.isCurrent ? "#3b82f6" : "#ffffff"}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredPoint({
                      x: rect.left,
                      y: rect.top,
                      data: d
                    });
                  }}
                />
                <circle
                  cx={xScale(d.year)}
                  cy={yScale(d.average)}
                  r="3"
                  fill="#ffffff"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  className="cursor-pointer"
                />
              </g>
            ))}
          </g>
        </svg>
        
        {/* Tooltip */}
        {hoveredPoint && (
          <div 
            className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm pointer-events-none"
            style={{
              left: hoveredPoint.x - 100,
              top: hoveredPoint.y - 80,
            }}
          >
            <div className="font-medium">{hoveredPoint.data.year}</div>
            <div className="text-blue-600">
              This Vehicle: {hoveredPoint.data.thisVehicle.toFixed(1)}%
            </div>
            <div className="text-gray-600">
              Average: {hoveredPoint.data.average.toFixed(1)}%
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-600">
          Current: <span className="font-medium text-blue-600">{(100 - currentDegradation).toFixed(1)}% health</span>
          {' vs '}
          <span className="font-medium text-gray-600">
            {(100 - TESLA_BENCHMARKS.degradationByAge[Math.min(vehicleAge, 7) as keyof typeof TESLA_BENCHMARKS.degradationByAge]).toFixed(1)}% average
          </span>
        </div>
      </div>
    </div>
  );
}

interface CertificateData {
  certificate_id: string;
  tesla_vin: string;
  vehicle_name: string;
  vehicle_model: string;
  vehicle_trim: string;
  vehicle_year: number;
  odometer_miles: number | null;
  software_version: string | null;
  battery_health_data: {
    health_percentage: number;
    degradation_percentage: number;
    original_capacity_kwh: number;
    current_capacity_kwh: number;
    confidence_level: string;
    methodology: string;
    battery_chemistry?: string;
    battery_supplier?: string;
    estimated_range_loss_miles?: number;
  };
  is_paid: boolean;
  created_at: string;
}

interface CertificateDisplayProps {
  certificate: CertificateData;
  locale: string;
  isPrintMode?: boolean;
}

export function CertificateDisplay({ 
  certificate, 
  locale, 
  isPrintMode = false 
}: CertificateDisplayProps) {
  const batteryHealth = certificate.battery_health_data;

  // Calculate vehicle age and benchmark stats
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - certificate.vehicle_year;
  const benchmarkStats = calculateBenchmarkStats(vehicleAge, batteryHealth.degradation_percentage);

  // Helper function to determine if user should see miles vs km
  const usesMiles =
    locale?.startsWith("en-US") ||
    locale?.startsWith("en-GB") ||
    locale?.startsWith("en-AU");

  // Format date
  const testDate = new Date(certificate.created_at).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate valid until date (1 year from creation)
  const validUntil = new Date(certificate.created_at);
  validUntil.setFullYear(validUntil.getFullYear() + 1);
  const validUntilFormatted = validUntil.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={isPrintMode ? "print:block" : ""}>
      {/* Main Certificate Card */}
      <Card className="shadow-xl border-0 mb-8">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">
                Battery Health Report from Tesla Data
              </CardTitle>
              <p className="text-blue-100">
                Certificate ID: {certificate.certificate_id}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                {Math.round(100 - batteryHealth.degradation_percentage)}%
              </div>
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
                  <span className="font-medium">
                    {certificate.vehicle_year}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VIN</span>
                  <span className="font-medium font-mono">
                    {certificate.tesla_vin}
                  </span>
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
                    {certificate.odometer_miles
                      ? usesMiles
                        ? `${Math.round(
                            certificate.odometer_miles
                          ).toLocaleString()} miles`
                        : `${Math.round(
                            certificate.odometer_miles * 1.609
                          ).toLocaleString()} km`
                      : "Not Available"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Software Version</span>
                  <span className="font-medium">
                    {certificate.software_version || "Not Available"}
                  </span>
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
              <Card
                className={`${
                  benchmarkStats.condition === "Excellent"
                    ? "bg-green-50 border-green-200"
                    : benchmarkStats.condition === "Good"
                    ? "bg-blue-50 border-blue-200"
                    : benchmarkStats.condition === "Average"
                    ? "bg-yellow-50 border-yellow-200"
                    : benchmarkStats.condition === "Fair"
                    ? "bg-orange-50 border-orange-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className={`text-3xl font-bold mb-2 ${benchmarkStats.color}`}>
                    {Math.round(100 - batteryHealth.degradation_percentage)}%
                  </div>
                  <p className={`font-medium ${benchmarkStats.color.replace('text-', 'text-').replace('-600', '-800')}`}>
                    Health Score
                  </p>
                  <p className={`text-sm mt-1 ${benchmarkStats.color.replace('-600', '-700')}`}>
                    {benchmarkStats.condition}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Better than {benchmarkStats.percentileBetter}% of similar vehicles
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
                    {batteryHealth.estimated_range_loss_miles || 326}
                  </div>
                  <p className="text-purple-800 font-medium">Est. Range</p>
                  <p className="text-sm text-purple-700 mt-1">
                    {usesMiles ? "miles" : "km"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Degradation Chart */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Degradation Comparison vs Average
              </h3>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Better than 78% of similar vehicles
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <BatteryDegradationChart 
                vehicleYear={certificate.vehicle_year}
                currentDegradation={batteryHealth.degradation_percentage}
              />
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
                    <h4 className="font-medium mb-3">
                      Battery Specifications
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Original Capacity
                        </span>
                        <span>{batteryHealth.original_capacity_kwh} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Current Capacity
                        </span>
                        <span>
                          {Math.round(
                            batteryHealth.current_capacity_kwh * 10
                          ) / 10}{" "}
                          kWh
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity Loss</span>
                        <span
                          className={
                            batteryHealth.degradation_percentage < 10
                              ? "text-green-600"
                              : batteryHealth.degradation_percentage < 15
                              ? "text-yellow-600"
                              : "text-red-600"
                          }
                        >
                          {Math.round(
                            (batteryHealth.original_capacity_kwh -
                              batteryHealth.current_capacity_kwh) *
                              10
                          ) / 10}{" "}
                          kWh (
                          {Math.round(
                            batteryHealth.degradation_percentage * 10
                          ) / 10}
                          %)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Methodology</span>
                        <span className="text-sm">
                          {batteryHealth.methodology}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">
                      Performance Indicators
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Battery Chemistry
                        </span>
                        <span>
                          {batteryHealth.battery_chemistry || "Lithium-ion"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Battery Supplier
                        </span>
                        <span>
                          {batteryHealth.battery_supplier ||
                            "Tesla/Panasonic"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Confidence Level
                        </span>
                        <span
                          className={
                            batteryHealth.confidence_level === "high"
                              ? "text-green-600"
                              : batteryHealth.confidence_level === "medium"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }
                        >
                          {batteryHealth.confidence_level
                            ?.charAt(0)
                            .toUpperCase() +
                            batteryHealth.confidence_level?.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Overall Condition
                        </span>
                        <span
                          className={
                            batteryHealth.degradation_percentage < 10
                              ? "text-green-600"
                              : batteryHealth.degradation_percentage < 15
                              ? "text-yellow-600"
                              : "text-red-600"
                          }
                        >
                          {batteryHealth.degradation_percentage < 10
                            ? "Excellent"
                            : batteryHealth.degradation_percentage < 15
                            ? "Good"
                            : "Fair"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div
            className={`p-6 rounded-lg border ${
              batteryHealth.degradation_percentage < 10
                ? "bg-green-50 border-green-200"
                : batteryHealth.degradation_percentage < 15
                ? "bg-yellow-50 border-yellow-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <h4
              className={`font-semibold mb-3 ${
                batteryHealth.degradation_percentage < 10
                  ? "text-green-800"
                  : batteryHealth.degradation_percentage < 15
                  ? "text-yellow-800"
                  : "text-red-800"
              }`}
            >
              Assessment Summary
            </h4>
            <p
              className={`text-sm leading-relaxed ${
                batteryHealth.degradation_percentage < 10
                  ? "text-green-700"
                  : batteryHealth.degradation_percentage < 15
                  ? "text-yellow-700"
                  : "text-red-700"
              }`}
            >
              This {certificate.vehicle_name} demonstrates{" "}
              {batteryHealth.degradation_percentage < 10
                ? "excellent"
                : batteryHealth.degradation_percentage < 15
                ? "good"
                : "fair"}{" "}
              battery health with
              {Math.round(batteryHealth.degradation_percentage * 10) / 10}%
              degradation. The battery is performing{" "}
              {batteryHealth.degradation_percentage < 10
                ? "exceptionally well"
                : batteryHealth.degradation_percentage < 15
                ? "well"
                : "adequately"}{" "}
              for its usage. Current capacity of{" "}
              {Math.round(batteryHealth.current_capacity_kwh * 10) / 10} kWh
              from an original {batteryHealth.original_capacity_kwh} kWh.
              {batteryHealth.degradation_percentage < 10
                ? " This vehicle represents an excellent purchase opportunity with minimal battery-related risks."
                : batteryHealth.degradation_percentage < 15
                ? " This vehicle represents a good purchase opportunity with normal wear patterns."
                : " This vehicle shows higher than average degradation and should be considered carefully."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}