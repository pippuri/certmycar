"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, MapPin, Zap } from "lucide-react"
import Link from "next/link"
import { detectTeslaRegion, TESLA_REGIONS, type TeslaRegion, formatRegionName } from "@/lib/tesla-regions"

interface TeslaRegionSelectorProps {
  onRegionSelect?: (region: TeslaRegion) => void
  showAsButtons?: boolean
  className?: string
}

export function TeslaRegionSelector({ 
  onRegionSelect, 
  showAsButtons = false, 
  className = "" 
}: TeslaRegionSelectorProps) {
  const [detectedRegion, setDetectedRegion] = useState<TeslaRegion>('na')
  const [selectedRegion, setSelectedRegion] = useState<TeslaRegion>('na')
  const [isDetecting, setIsDetecting] = useState(true)

  useEffect(() => {
    const region = detectTeslaRegion()
    setDetectedRegion(region)
    setSelectedRegion(region)
    setIsDetecting(false)
    onRegionSelect?.(region)
  }, [onRegionSelect])

  const handleRegionChange = (region: TeslaRegion) => {
    setSelectedRegion(region)
    onRegionSelect?.(region)
  }

  if (showAsButtons) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span>
              {isDetecting ? "Detecting your region..." : `Detected: ${formatRegionName(detectedRegion)}`}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(TESLA_REGIONS).map(([code, region]) => (
            <Button
              key={code}
              size="lg"
              variant={selectedRegion === code ? "default" : "outline"}
              className={`text-lg px-8 py-6 h-auto flex flex-col space-y-1 ${
                selectedRegion === code ? "ring-2 ring-blue-500" : ""
              }`}
              asChild
            >
              <Link href={`/check?region=${code}`}>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Check My Tesla</span>
                  {detectedRegion === code && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Auto-detected
                    </Badge>
                  )}
                </div>
                <div className="text-sm font-normal opacity-80">
                  {region.name}
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <Globe className="w-4 h-4" />
        <span>Tesla Service Region</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(TESLA_REGIONS).map(([code, region]) => (
          <Card 
            key={code}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedRegion === code 
                ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200" 
                : "hover:border-gray-300"
            }`}
            onClick={() => handleRegionChange(code as TeslaRegion)}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{region.name}</h3>
                {detectedRegion === code && (
                  <Badge variant="secondary" className="text-xs">
                    Detected
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {region.description}
              </p>
              <div className="text-xs text-gray-500">
                {region.countries.slice(0, 6).join(', ')}
                {region.countries.length > 6 && '...'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Button 
          size="lg" 
          className="text-lg px-8 py-6"
          asChild
        >
          <Link href={`/check?region=${selectedRegion}`}>
            <Zap className="mr-2 h-5 w-5" />
            Check My Tesla ({formatRegionName(selectedRegion)})
          </Link>
        </Button>
      </div>
    </div>
  )
}