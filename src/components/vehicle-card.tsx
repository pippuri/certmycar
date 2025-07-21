"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Battery, Zap, Thermometer, Clock } from "lucide-react"
import Image from "next/image"

interface VehicleCardProps {
  vehicle: {
    id: string
    name: string
    model: string
    year: number
    color: string
    vin: string
    batteryLevel: number
    range: number
    isCharging: boolean
    lastSeen: string
    image: string
    location?: string
    temperature?: number
  }
  isSelected?: boolean
  onClick: () => void
}

export function VehicleCard({ vehicle, isSelected = false, onClick }: VehicleCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200" : "hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Vehicle Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
          <Image
            src={vehicle.image || "/placeholder.svg"}
            alt={`${vehicle.year} Tesla ${vehicle.model} in ${vehicle.color}`}
            fill
            className="object-cover"
          />
          {vehicle.isCharging && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-500 hover:bg-green-500 text-white">
                <Zap className="w-3 h-3 mr-1" />
                Charging
              </Badge>
            </div>
          )}
        </div>

        {/* Vehicle Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{vehicle.name}</h3>
              <p className="text-sm text-gray-600">
                {vehicle.year} • {vehicle.color}
              </p>
              <p className="text-xs text-gray-500 font-mono mt-1">VIN: {vehicle.vin}</p>
            </div>
            {isSelected && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>

          {/* Battery Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Battery className={`w-4 h-4 ${vehicle.batteryLevel > 20 ? "text-green-500" : "text-red-500"}`} />
                <span className="text-sm font-medium">{vehicle.batteryLevel}%</span>
              </div>
              <span className="text-sm text-gray-600">{vehicle.range} mi range</span>
            </div>

            {/* Battery Level Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  vehicle.batteryLevel > 50
                    ? "bg-green-500"
                    : vehicle.batteryLevel > 20
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${vehicle.batteryLevel}%` }}
              />
            </div>

            {/* Additional Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{vehicle.lastSeen}</span>
              </div>
              {vehicle.temperature && (
                <div className="flex items-center space-x-1">
                  <Thermometer className="w-3 h-3" />
                  <span>{vehicle.temperature}°F</span>
                </div>
              )}
            </div>

            {vehicle.location && <p className="text-xs text-gray-500 pt-1">{vehicle.location}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
