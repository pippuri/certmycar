"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, AlertTriangle, Zap } from "lucide-react"
import { Logo } from "@/components/logo"
import { VehicleCard } from "@/components/vehicle-card"

interface Vehicle {
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

export default function VehicleSelectionPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCheckingBattery, setIsCheckingBattery] = useState(false)

  // Simulate fetching vehicles from Tesla API
  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true)
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock vehicle data - this would come from Tesla API
        const mockVehicles: Vehicle[] = [
          {
            id: "1",
            name: "My Tesla",
            model: "Model 3",
            year: 2022,
            color: "Pearl White",
            vin: "5YJ3E1EA4NF123456",
            batteryLevel: 85,
            range: 298,
            isCharging: false,
            lastSeen: "2 hours ago",
            image: "/tesla/tesla-card.webp",
            location: "Home - San Francisco, CA",
            temperature: 72
          },
          {
            id: "2",
            name: "Work Tesla",
            model: "Model Y",
            year: 2023,
            color: "Midnight Silver Metallic",
            vin: "7SAYGDEF8PF654321",
            batteryLevel: 42,
            range: 168,
            isCharging: true,
            lastSeen: "30 minutes ago",
            image: "/tesla/tesla-card.webp",
            location: "Office - Palo Alto, CA",
            temperature: 68
          },
          {
            id: "3",
            name: "Weekend Ride",
            model: "Model S",
            year: 2021,
            color: "Deep Blue Metallic",
            vin: "5YJSA1E4XMF789012",
            batteryLevel: 91,
            range: 405,
            isCharging: false,
            lastSeen: "1 day ago",
            image: "/tesla/tesla-card.webp",
            location: "Garage - Los Angeles, CA"
          }
        ]
        
        setVehicles(mockVehicles)
      } catch (err) {
        setError("Failed to load your vehicles. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId)
  }

  const handleCheckBattery = async () => {
    if (!selectedVehicleId) return

    setIsCheckingBattery(true)
    setError("")

    try {
      // Simulate battery check API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to results page with vehicle ID
      window.location.href = `/check?vehicle=${selectedVehicleId}`
      
    } catch (err) {
      setError("Failed to check battery health. Please try again.")
    } finally {
      setIsCheckingBattery(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Logo size="md" />
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <Card className="p-8 text-center shadow-xl">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Loading Your Vehicles...
              </h2>
              <p className="text-gray-600">
                Fetching your Tesla vehicles from your account
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Logo size="md" />
          <Button variant="outline" asChild>
            <Link href="/check">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Select Your Tesla
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the vehicle you'd like to check. We'll analyze its battery health in just 30 seconds.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Vehicle Grid */}
        {vehicles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isSelected={selectedVehicleId === vehicle.id}
                  onClick={() => handleVehicleSelect(vehicle.id)}
                />
              ))}
            </div>

            {/* Action Button */}
            <div className="text-center">
              <Button
                size="lg"
                className="text-lg px-12 py-6 bg-blue-600 hover:bg-blue-700"
                onClick={handleCheckBattery}
                disabled={!selectedVehicleId || isCheckingBattery}
              >
                {isCheckingBattery ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Checking Battery Health...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Check Battery Health
                  </>
                )}
              </Button>
              
              {!selectedVehicleId && (
                <p className="text-sm text-gray-500 mt-2">
                  Please select a vehicle to continue
                </p>
              )}
            </div>
          </>
        ) : (
          /* No Vehicles State */
          <Card className="p-8 text-center shadow-xl max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Vehicles Found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any Tesla vehicles associated with your account.
                Please make sure you have vehicles registered to your Tesla account.
              </p>
              <Button variant="outline" asChild>
                <Link href="/check">Try Again</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Analysis</h3>
              <p className="text-sm text-gray-600">
                Get your battery health results in 30 seconds or less
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Detailed Report</h3>
              <p className="text-sm text-gray-600">
                Comprehensive analysis with degradation percentage and capacity data
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Certificate</h3>
              <p className="text-sm text-gray-600">
                Optional $9.99 verified certificate for buying/selling protection
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}