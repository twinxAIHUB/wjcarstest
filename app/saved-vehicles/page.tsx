"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Vehicle } from '@/types/vehicle'

export default function SavedVehiclesPage() {
  const [savedCars, setSavedCars] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSavedVehicles = async () => {
      try {
        const savedCarIds = JSON.parse(localStorage.getItem("savedCars") || "[]")
        if (savedCarIds.length === 0) {
          setSavedCars([])
          setIsLoading(false)
          return
        }

        const vehiclesRef = collection(db, 'vehicles')
        const snapshot = await getDocs(vehiclesRef)
        const allVehicles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Vehicle[]
        
        const filteredCars = allVehicles.filter((car) => savedCarIds.includes(car.id))
        setSavedCars(filteredCars)
      } catch (error) {
        console.error("Error fetching saved vehicles:", error)
        toast({
          title: "Error",
          description: "Could not load saved vehicles.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSavedVehicles()
  }, [])

  const removeCar = (carId: string, carName: string) => {
    const savedCarIds = JSON.parse(localStorage.getItem("savedCars") || "[]")
    const updatedSavedCarIds = savedCarIds.filter((id: string) => id !== carId)
    localStorage.setItem("savedCars", JSON.stringify(updatedSavedCarIds))

    setSavedCars(savedCars.filter((car) => car.id !== carId))

    toast({
      title: "Removed from favorites",
      description: `${carName} has been removed from your favorites.`,
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-xl">Loading saved vehicles...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/cars">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Your Saved Vehicles</h1>
      </div>

      {savedCars.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
          <div className="mb-4">
            <Heart className="h-16 w-16 mx-auto text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold mb-4">No Saved Vehicles</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't saved any vehicles yet. Browse our inventory and click the heart icon to save vehicles you're
            interested in.
          </p>
          <Button asChild>
            <Link href="/cars">Browse Inventory</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {savedCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg group"
            >
              <Link href={`/cars/${car.id}`} className="block">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={car.imageUrl || "/placeholder.svg"}
                    alt={car.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {car.featured && (
                    <Badge className="absolute top-3 left-3 bg-green-600 hover:bg-green-700">Featured</Badge>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/cars/${car.id}`} className="block">
                    <h3 className="font-bold text-lg group-hover:text-green-600 transition-colors">
                      {car.name}
                    </h3>
                  </Link>
                  <p className="font-bold text-green-600">${car.price.toLocaleString()}</p>
                </div>
                <p className="text-gray-500 text-sm mb-3">{car.overview}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                    <span>{car.rating}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeCar(car.id, car.name)}
                  >
                    <Heart className="h-4 w-4 mr-1 fill-red-500" /> Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
