"use client";

import { Card, CardContent } from "@/components/ui/card";

export function TeslaStatsVisual() {
  const stats = [
    { number: "50k+", label: "Batteries Checked" },
    { number: "98.5%", label: "Accuracy Rate" },
    { number: "24/7", label: "Instant Results" },
    { number: "$2M+", label: "Repair Costs Saved" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="text-center p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
        >
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stat.number}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
