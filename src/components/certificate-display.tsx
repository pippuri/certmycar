"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Car, Zap, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import { QRCode } from "./qr-code";

// Tesla battery degradation benchmarks based on real-world data
const TESLA_BENCHMARKS = {
  // Average degradation by vehicle age (years): 6.5% first year, +1.5% each year after
  degradationByAge: {
    0: 0, // New vehicle
    1: 6.5, // 1 year: 6.5% average degradation (5% + 1.5%)
    2: 8.0, // 2 years: 8% average (6.5% + 1.5%)
    3: 9.5, // 3 years: 9.5% average (8% + 1.5%)
    4: 11.0, // 4 years: 11% average (9.5% + 1.5%)
    5: 12.5, // 5 years: 12.5% average (11% + 1.5%)
    6: 14.0, // 6 years: 14% average (12.5% + 1.5%)
    7: 15.5, // 7+ years: ~15.5% average (14% + 1.5%)
  },
  // Percentile thresholds for condition assessment
  percentiles: {
    excellent: 0.1, // Top 10% (very low degradation)
    good: 0.3, // Top 30% (below average degradation)
    average: 0.6, // Average range (30-60%)
    fair: 0.85, // Fair range (60-85%)
    poor: 1.0, // Bottom 15% (high degradation)
  },
};

// Calculate benchmark statistics
function calculateBenchmarkStats(
  vehicleAge: number,
  currentDegradation: number
) {
  // Get expected degradation for this age
  const maxAge = Math.max(
    ...Object.keys(TESLA_BENCHMARKS.degradationByAge).map(Number)
  );
  const ageKey = Math.min(vehicleAge, maxAge);
  const expectedDegradation =
    TESLA_BENCHMARKS.degradationByAge[
      ageKey as keyof typeof TESLA_BENCHMARKS.degradationByAge
    ];

  // Calculate relative performance (lower is better for degradation)
  const relativePerformance =
    currentDegradation / Math.max(expectedDegradation, 0.1);

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
    vsAverage: currentDegradation - expectedDegradation,
  };
}

// Beautiful custom chart component that actually works with React 19
function BatteryDegradationChart({
  vehicleYear,
  currentDegradation,
  translations,
}: {
  vehicleYear: number;
  currentDegradation: number;
  translations: {
    title: string;
    this_vehicle: string;
    tesla_average: string;
    current_label: string;
    vs_label: string;
    health_label: string;
    average_label: string;
  };
}) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    data: {
      year: number;
      thisVehicle: number;
      average: number;
      thisVehicleDegradation: number;
      averageDegradation: number;
      isCurrent: boolean;
    };
  } | null>(null);
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - vehicleYear;

  const generateDegradationData = () => {
    // Generate years from vehicle year to current year (no future projections)
    const yearsCount = Math.max(vehicleAge + 1, 2); // At least 2 years for chart
    const years = Array.from({ length: yearsCount }, (_, i) => vehicleYear + i);
    return years.map((year, index) => {
      // Use actual benchmark data for average
      const maxAge = Math.max(
        ...Object.keys(TESLA_BENCHMARKS.degradationByAge).map(Number)
      );
      const ageKey = Math.min(index, maxAge);
      const averageDegradation =
        TESLA_BENCHMARKS.degradationByAge[
          ageKey as keyof typeof TESLA_BENCHMARKS.degradationByAge
        ];

      // Calculate degradation for this year based on linear progression to current state
      const actualRate = currentDegradation / Math.max(vehicleAge, 1);
      const thisVehicleDegradation = index * actualRate;

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
  const xScale = (year: number) =>
    ((year - vehicleYear) / Math.max(vehicleAge, 1)) * innerWidth;
  const yScale = (health: number) =>
    innerHeight - ((health - 75) / 25) * innerHeight;

  // Generate path strings
  const thisVehiclePath = chartData
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"} ${xScale(d.year)},${yScale(d.thisVehicle)}`
    )
    .join(" ");

  const averagePath = chartData
    .map(
      (d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.year)},${yScale(d.average)}`
    )
    .join(" ");

  // Generate area paths
  const thisVehicleArea = `M ${xScale(
    chartData[0].year
  )},${innerHeight} L ${thisVehiclePath
    .replace("M ", "")
    .replace(/L /g, " L ")} L ${xScale(
    chartData[chartData.length - 1].year
  )},${innerHeight} Z`;
  const averageArea = `M ${xScale(
    chartData[0].year
  )},${innerHeight} L ${averagePath
    .replace("M ", "")
    .replace(/L /g, " L ")} L ${xScale(
    chartData[chartData.length - 1].year
  )},${innerHeight} Z`;

  return (
    <div className="w-full bg-white rounded-lg border p-6">
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          {translations.title}
        </h4>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">{translations.this_vehicle}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-1 bg-gray-400 rounded"
              style={{ borderTop: "2px dashed" }}
            ></div>
            <span className="text-gray-600">{translations.tesla_average}</span>
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
            <linearGradient
              id="thisVehicleGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient
              id="averageGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <g transform={`translate(${padding.left},${padding.top})`}>
            {/* Grid lines */}
            {[80, 85, 90, 95, 100].map((value) => (
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
            <path d={averageArea} fill="url(#averageGradient)" />
            <path d={thisVehicleArea} fill="url(#thisVehicleGradient)" />

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
                      data: d,
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
          {translations.current_label}:{" "}
          <span className="font-medium text-blue-600">
            {(100 - currentDegradation).toFixed(1)}% {translations.health_label}
          </span>
          {" "}{translations.vs_label}{" "}
          <span className="font-medium text-gray-600">
            {(
              100 -
              TESLA_BENCHMARKS.degradationByAge[
                Math.min(
                  vehicleAge,
                  7
                ) as keyof typeof TESLA_BENCHMARKS.degradationByAge
              ]
            ).toFixed(1)}
            % {translations.average_label}
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
  };
  battery_data: {
    battery_level: number;
    usable_battery_level: number;
    charge_limit_soc: number;
    ideal_battery_range: number;
    est_battery_range: number;
    battery_range: number;
  };
  is_paid: boolean;
  created_at: string;
}

interface CertificateDisplayProps {
  certificate: CertificateData;
  locale: string;
  isPrintMode?: boolean;
  translations?: {
    chart: {
      title: string;
      this_vehicle: string;
      tesla_average: string;
    };
    title: string;
    certificate_id: string;
    health_score: string;
    scan_to_verify: string;
    vehicle_information: string;
    model: string;
    year: string;
    vin: string;
    assessment_details: string;
    test_date: string;
    mileage: string;
    software_version: string;
    not_available: string;
    valid_until: string;
    battery_performance: string;
    better_than_percentage: string;
    degradation_comparison: string;
    detailed_analysis: string;
    battery_specifications: string;
    original_capacity: string;
    current_capacity: string;
    capacity_loss: string;
    full_charge_range: string;
    current_label: string;
    vs_label: string;
    health_label: string;
    average_label: string;
    confidence_levels: {
      high: string;
      medium: string;
      low: string;
    };
    methodology: string;
    performance_indicators: string;
    battery_chemistry: string;
    battery_supplier: string;
    confidence_level: string;
    overall_condition: string;
    assessment_summary: string;
    summary_excellent: string;
    summary_good: string;
    summary_fair: string;
    conditions: {
      excellent: string;
      good: string;
      average: string;
      fair: string;
      poor: string;
    };
    units: {
      kwh: string;
      miles: string;
      km: string;
    };
  };
}

export function CertificateDisplay({
  certificate,
  locale,
  isPrintMode = false,
  translations,
}: CertificateDisplayProps) {
  const batteryHealth = certificate.battery_health_data;

  // Fallback translations for backward compatibility
  const t = translations || {
    chart: {
      title: "Battery Health Over Time",
      this_vehicle: "This Vehicle",
      tesla_average: "Tesla Average"
    },
    title: "Battery Health Report from Tesla Data",
    certificate_id: "Certificate ID",
    health_score: "Health Score",
    scan_to_verify: "Scan to Verify",
    vehicle_information: "Vehicle Information",
    model: "Model",
    year: "Year",
    vin: "VIN",
    assessment_details: "Assessment Details",
    test_date: "Test Date",
    mileage: "Mileage",
    software_version: "Software Version",
    not_available: "Not Available",
    valid_until: "Valid Until",
    battery_performance: "Battery Performance Metrics",
    better_than_percentage: "Better than {percentage}% of similar vehicles",
    degradation_comparison: "Degradation Comparison vs Average",
    detailed_analysis: "Detailed Analysis",
    battery_specifications: "Battery Specifications",
    original_capacity: "Original Capacity",
    current_capacity: "Current Capacity",
    capacity_loss: "Capacity Loss",
    full_charge_range: "Full Charge Range",
    current_label: "Current",
    vs_label: "vs",
    health_label: "health",
    average_label: "average",
    confidence_levels: {
      high: "High",
      medium: "Medium",
      low: "Low"
    },
    methodology: "Methodology",
    performance_indicators: "Performance Indicators",
    battery_chemistry: "Battery Chemistry",
    battery_supplier: "Battery Supplier",
    confidence_level: "Confidence Level",
    overall_condition: "Overall Condition",
    assessment_summary: "Assessment Summary",
    summary_excellent: "This {vehicleName} demonstrates excellent battery health with {degradation}% degradation. The battery is performing exceptionally well for its usage. Current capacity of {currentCapacity} kWh from an original {originalCapacity} kWh. This vehicle represents an excellent purchase opportunity with minimal battery-related risks.",
    summary_good: "This {vehicleName} demonstrates good battery health with {degradation}% degradation. The battery is performing well for its usage. Current capacity of {currentCapacity} kWh from an original {originalCapacity} kWh. This vehicle represents a good purchase opportunity with normal wear patterns.",
    summary_fair: "This {vehicleName} demonstrates fair battery health with {degradation}% degradation. The battery is performing adequately for its usage. Current capacity of {currentCapacity} kWh from an original {originalCapacity} kWh. This vehicle shows higher than average degradation and should be considered carefully.",
    conditions: {
      excellent: "Excellent",
      good: "Good",
      average: "Average",
      fair: "Fair",
      poor: "Poor"
    },
    units: {
      kwh: "kWh",
      miles: "miles",
      km: "km"
    }
  };

  // Calculate vehicle age and benchmark stats
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - certificate.vehicle_year;
  const benchmarkStats = calculateBenchmarkStats(
    vehicleAge,
    batteryHealth.degradation_percentage
  );

  // Calculate full charge range from Tesla's current charge data
  const calculateFullChargeRange = () => {
    const currentRange =
      certificate.battery_data?.ideal_battery_range ||
      certificate.battery_data?.est_battery_range ||
      0;
    const currentCharge = certificate.battery_data?.battery_level || 0;
    const rangeInMiles = currentCharge > 0
      ? Math.round((currentRange / currentCharge) * 100)
      : 0;
    
    // Convert to kilometers if not using miles
    return usesMiles ? rangeInMiles : Math.round(rangeInMiles * 1.609);
  };

  // Helper function to determine if user should see miles vs km
  const usesMiles =
    locale?.startsWith("en-US") ||
    locale?.startsWith("en-GB") ||
    locale?.startsWith("en-AU");

  // Format date consistently to avoid hydration errors
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format date
  const testDate = formatDate(certificate.created_at);

  // Calculate valid until date (3 months from creation)
  const validUntil = new Date(certificate.created_at);
  validUntil.setMonth(validUntil.getMonth() + 3);
  const validUntilFormatted = formatDate(validUntil.toISOString());

  return (
    <div
      className={`${isPrintMode ? "print:block" : ""} ${
        isPrintMode ? "print:compact" : ""
      }`}
      data-certificate-content
      style={
        isPrintMode
          ? {
              pageBreakAfter: "avoid",
              pageBreakInside: "avoid",
              breakInside: "avoid",
            }
          : {}
      }
    >
      {/* Main Certificate Card */}
      <Card className={`shadow-xl border-0 ${isPrintMode ? "mb-4" : "mb-8"}`}>
        <CardHeader
          className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg ${
            isPrintMode ? "p-4" : "p-8"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle
                className={`${isPrintMode ? "text-xl mb-1" : "text-2xl mb-2"}`}
              >
                {t.title}
              </CardTitle>
              <p className={`text-blue-100 ${isPrintMode ? "text-sm" : ""}`}>
                {t.certificate_id}: {certificate.certificate_id}
              </p>
            </div>

            <div
              className={`flex items-center ${isPrintMode ? "gap-4" : "gap-6"}`}
            >
              <div className="text-right">
                <div
                  className={`font-bold ${
                    isPrintMode ? "text-3xl" : "text-4xl"
                  }`}
                >
                  {Math.round(100 - batteryHealth.degradation_percentage)}%
                </div>
                <p className={`text-blue-100 ${isPrintMode ? "text-sm" : ""}`}>
                  {t.health_score}
                </p>
              </div>

              <div className="flex flex-col items-center">
                <QRCode
                  url={`${
                    process.env.NEXT_PUBLIC_SITE_URL ||
                    "https://batterycert.com"
                  }/${locale}/certificate/${certificate.certificate_id}?vin=${
                    certificate.tesla_vin
                  }`}
                  size={isPrintMode ? 60 : 80}
                  className={isPrintMode ? "mb-1" : "mb-2"}
                />
                <p
                  className={`text-blue-100 text-center ${
                    isPrintMode ? "text-xs" : "text-xs"
                  }`}
                >
                  {t.scan_to_verify}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className={`${isPrintMode ? "p-4" : "p-8"}`}>
          {/* Vehicle Information */}
          <div
            className={`grid md:grid-cols-2 ${
              isPrintMode ? "gap-4 mb-4" : "gap-8 mb-8"
            }`}
          >
            <div>
              <h3
                className={`font-semibold flex items-center ${
                  isPrintMode ? "text-base mb-2" : "text-lg mb-4"
                }`}
              >
                <Car
                  className={`${isPrintMode ? "h-4 w-4 mr-1" : "h-5 w-5 mr-2"}`}
                />
{t.vehicle_information}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.model}</span>
                  <span className="font-medium">
                    {certificate.vehicle_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.year}</span>
                  <span className="font-medium">
                    {certificate.vehicle_year}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.vin}</span>
                  <span className="font-medium font-mono">
                    {certificate.tesla_vin}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3
                className={`font-semibold flex items-center ${
                  isPrintMode ? "text-base mb-2" : "text-lg mb-4"
                }`}
              >
                <Calendar
                  className={`${isPrintMode ? "h-4 w-4 mr-1" : "h-5 w-5 mr-2"}`}
                />
{t.assessment_details}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.test_date}</span>
                  <span className="font-medium">{testDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.mileage}</span>
                  <span className="font-medium">
                    {certificate.odometer_miles
                      ? usesMiles
                        ? `${Math.round(
                            certificate.odometer_miles
                          ).toLocaleString()} ${t.units.miles}`
                        : `${Math.round(
                            certificate.odometer_miles * 1.609
                          ).toLocaleString()} ${t.units.km}`
                      : t.not_available}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.software_version}</span>
                  <span className="font-medium">
                    {certificate.software_version || t.not_available}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.valid_until}</span>
                  <span className="font-medium">{validUntilFormatted}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Battery Metrics */}
          <div className="mb-8 print:mb-6">
            <h3 className="text-lg font-semibold mb-4 print:mb-3 flex items-center print:text-base">
              <Zap className="h-5 w-5 mr-2 print:h-4 print:w-4" />
{t.battery_performance}
            </h3>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 print:gap-2">
              <Card
                className={`print:shadow-none ${
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
                <CardContent className="p-3 sm:p-4 md:p-6 text-center print:p-2">
                  <div
                    className={`text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 print:text-lg print:mb-0 ${benchmarkStats.color}`}
                  >
                    {Math.round(100 - batteryHealth.degradation_percentage)}%
                  </div>
                  <p
                    className={`text-xs sm:text-sm md:text-base font-medium print:text-xs ${benchmarkStats.color
                      .replace("text-", "text-")
                      .replace("-600", "-800")}`}
                  >
                    {t.health_score}
                  </p>
                  <p
                    className={`text-xs sm:text-sm mt-0 sm:mt-1 print:text-xs print:mt-0 ${benchmarkStats.color.replace(
                      "-600",
                      "-700"
                    )}`}
                  >
                    {t.conditions[benchmarkStats.condition.toLowerCase() as keyof typeof t.conditions]}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 print:mt-0 print:text-xs">
                    {t.better_than_percentage.replace('{percentage}', benchmarkStats.percentileBetter.toString())}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200 print:shadow-none">
                <CardContent className="p-3 sm:p-4 md:p-6 text-center print:p-2">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-1 sm:mb-2 print:text-lg print:mb-0">
                    {Math.round(batteryHealth.current_capacity_kwh)}
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-blue-800 font-medium print:text-xs">
                    {t.current_capacity}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-700 mt-0 sm:mt-1 print:text-xs print:mt-0">
                    {t.units.kwh}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200 print:shadow-none">
                <CardContent className="p-3 sm:p-4 md:p-6 text-center print:p-2">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-1 sm:mb-2 print:text-lg print:mb-0">
                    {calculateFullChargeRange()}
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-800 font-medium print:text-xs">
                    {t.full_charge_range}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0 sm:mt-1 print:text-xs print:mt-0">
                    {usesMiles ? t.units.miles : t.units.km}
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
                {t.degradation_comparison}
              </h3>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  benchmarkStats.condition === "Excellent" ||
                  benchmarkStats.condition === "Good"
                    ? "bg-green-100 text-green-800"
                    : benchmarkStats.condition === "Average"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
{t.better_than_percentage.replace('{percentage}', benchmarkStats.percentileBetter.toString())}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <BatteryDegradationChart
                vehicleYear={certificate.vehicle_year}
                currentDegradation={batteryHealth.degradation_percentage}
                translations={{
                  ...t.chart,
                  current_label: t.current_label,
                  vs_label: t.vs_label,
                  health_label: t.health_label,
                  average_label: t.average_label,
                }}
              />
            </div>
          </div>

          {/* Detailed Analysis - Only show if paid */}
          {certificate.is_paid && (
            <div className={`${isPrintMode ? "mb-4" : "mb-8"}`}>
              <h3
                className={`font-semibold flex items-center ${
                  isPrintMode ? "text-base mb-2" : "text-lg mb-4"
                }`}
              >
                <TrendingUp
                  className={`${isPrintMode ? "h-4 w-4 mr-1" : "h-5 w-5 mr-2"}`}
                />
                {t.detailed_analysis}
              </h3>

              <div
                className={`bg-gray-50 rounded-lg ${
                  isPrintMode ? "p-3" : "p-6"
                }`}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">{t.battery_specifications}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.original_capacity}</span>
                        <span>{batteryHealth.original_capacity_kwh} {t.units.kwh}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.current_capacity}</span>
                        <span>
                          {Math.round(batteryHealth.current_capacity_kwh * 10) /
                            10}{" "}
                          {t.units.kwh}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.capacity_loss}</span>
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
                          {t.units.kwh} (
                          {Math.round(
                            batteryHealth.degradation_percentage * 10
                          ) / 10}
                          %)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.methodology}</span>
                        <span className="text-sm">
                          {batteryHealth.methodology}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">{t.performance_indicators}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.battery_chemistry}</span>
                        <span>
                          {batteryHealth.battery_chemistry || "Lithium-ion"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.battery_supplier}</span>
                        <span>
                          {batteryHealth.battery_supplier || "Tesla/Panasonic"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.confidence_level}</span>
                        <span
                          className={
                            batteryHealth.confidence_level === "high"
                              ? "text-green-600"
                              : batteryHealth.confidence_level === "medium"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }
                        >
                          {batteryHealth.confidence_level && t.confidence_levels[batteryHealth.confidence_level as keyof typeof t.confidence_levels] || batteryHealth.confidence_level}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.overall_condition}</span>
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
                            ? t.conditions.excellent
                            : batteryHealth.degradation_percentage < 15
                            ? t.conditions.good
                            : t.conditions.fair}
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
              {(batteryHealth.degradation_percentage < 10
                ? t.summary_excellent
                : batteryHealth.degradation_percentage < 15
                ? t.summary_good
                : t.summary_fair)
                .replace('{vehicleName}', certificate.vehicle_name)
                .replace('{degradation}', (Math.round(batteryHealth.degradation_percentage * 10) / 10).toString())
                .replace('{currentCapacity}', (Math.round(batteryHealth.current_capacity_kwh * 10) / 10).toString())
                .replace('{originalCapacity}', batteryHealth.original_capacity_kwh.toString())}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
