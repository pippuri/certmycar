"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, ArrowRight } from "lucide-react"
import { Logo } from "@/components/logo"
import { detectTeslaRegion, TESLA_REGIONS, type TeslaRegion } from "@/lib/tesla-regions"
import { useRouter } from "next/navigation"

export default function RegionSelectionClient({ locale }: { locale: string }) {
  const [detectedRegion, setDetectedRegion] = useState<TeslaRegion>('na')
  const [selectedRegion, setSelectedRegion] = useState<TeslaRegion>('na')
  const router = useRouter()

  useEffect(() => {
    const detected = detectTeslaRegion()
    setDetectedRegion(detected)
    setSelectedRegion(detected)
  }, [])

  const handleContinue = () => {
    // Redirect to a different locale based on selected region
    const targetLocale = selectedRegion === 'eu' ? 'en-GB' : 'en-US'
    router.push(`/${targetLocale}/check`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Main Card */}
        <Card className="p-8 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Select Your Region
              </h1>
              <p className="text-gray-600">
                Tesla uses different servers for different regions. Please select yours for the best experience.
              </p>
            </div>

            {/* Region Selection */}
            <div className="space-y-4 mb-8">
              {Object.entries(TESLA_REGIONS).map(([code, region]) => (
                <Card 
                  key={code}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedRegion === code 
                      ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200" 
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRegion(code as TeslaRegion)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {region.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {detectedRegion === code && (
                          <Badge variant="secondary" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                        {selectedRegion === code && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">
                      {region.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      Includes: {region.countries.slice(0, 8).join(', ')}
                      {region.countries.length > 8 && ` and ${region.countries.length - 8} more`}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Continue Button */}
            <Button 
              size="lg" 
              className="w-full text-lg py-6"
              onClick={handleContinue}
            >
              Continue to Tesla Check
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Info */}
            <p className="text-center text-sm text-gray-500 mt-4">
              You can change this later in settings if needed.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}