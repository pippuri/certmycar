"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"
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

          {/* Vehicle Action */}
          <div className="mt-4">
            <div className={`text-center py-2 px-4 rounded-lg font-medium transition-colors ${
              isSelected 
                ? "bg-blue-100 text-blue-700 border border-blue-200" 
                : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}>
              {isSelected ? "Selected" : "Select This Vehicle"}
            </div>
            
            {/* Location if available */}
            {vehicle.location && !vehicle.location.includes("Unknown") && (
              <p className="text-xs text-gray-500 mt-2 text-center">{vehicle.location}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
