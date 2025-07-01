"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Vehicle } from '@/types/vehicle'

export default function CarsPage() {
  const searchParams = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [selectedName, setSelectedName] = useState("")
  const [selectedBodyStyle, setSelectedBodyStyle] = useState("")
  const [selectedSort, setSelectedSort] = useState("featured")
  const [isLoading, setIsLoading] = useState(true)

  // Get unique names for filters
  const names = Array.from(new Set(vehicles.map((vehicle) => vehicle.name))).sort()
  const bodyStyles = Array.from(new Set(vehicles.map((vehicle) => vehicle.bodyStyle))).sort()

  // Fetch vehicles from Firestore
  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true)
      try {
        const vehiclesRef = collection(db, "vehicles")
        const q = query(vehiclesRef, orderBy("featured", "desc"))
        const querySnapshot = await getDocs(q)
        
        const vehiclesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Vehicle[]

        setVehicles(vehiclesData)
        // Always show all vehicles initially
        setFilteredVehicles(vehiclesData)
      } catch (error) {
        console.error("Error fetching vehicles:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  // Handle filter changes
  const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value
    setSelectedName(name)

    let filtered = [...vehicles]
    if (name) {
      filtered = filtered.filter((vehicle) => vehicle.name === name)
    }
    if (selectedBodyStyle) {
      filtered = filtered.filter((vehicle) => vehicle.bodyStyle === selectedBodyStyle)
    }
    // If both are empty, show all vehicles
    if (!name && !selectedBodyStyle) {
      setFilteredVehicles(vehicles)
    } else {
      setFilteredVehicles(filtered)
    }
  }

  const handleBodyStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bodyStyle = e.target.value
    setSelectedBodyStyle(bodyStyle)

    let filtered = [...vehicles]
    if (bodyStyle) {
      filtered = filtered.filter((vehicle) => vehicle.bodyStyle === bodyStyle)
    }
    if (selectedName) {
      filtered = filtered.filter((vehicle) => vehicle.name === selectedName)
    }
    // If both are empty, show all vehicles
    if (!bodyStyle && !selectedName) {
      setFilteredVehicles(vehicles)
    } else {
      setFilteredVehicles(filtered)
    }
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOption = e.target.value
    setSelectedSort(sortOption)

    let sorted = [...filteredVehicles]

    switch (sortOption) {
      case "Price: Low to High":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "Price: High to Low":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "Newest First":
        sorted.sort((a, b) => b.year - a.year)
        break
      case "Sort By: Featured":
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      default:
        // No sorting, keep original order
        break
    }

    setFilteredVehicles(sorted)
  }

  // When filters change, always check if both are empty and show all vehicles
  useEffect(() => {
    if (!vehicles.length) return;
    if (!selectedName && !selectedBodyStyle) {
      setFilteredVehicles(vehicles);
      return;
    }
    let filtered = [...vehicles];
    if (selectedName) {
      filtered = filtered.filter((vehicle) => vehicle.name === selectedName);
    }
    if (selectedBodyStyle) {
      filtered = filtered.filter((vehicle) => vehicle.bodyStyle === selectedBodyStyle);
    }
    setFilteredVehicles(filtered);
  }, [vehicles, selectedName, selectedBodyStyle]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Our Inventory</h1>
          <p className="text-gray-500">Discover our collection of premium vehicles</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedName}
            onChange={handleNameChange}
          >
            <option value="">All Names</option>
            {names.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedBodyStyle}
            onChange={handleBodyStyleChange}
          >
            <option value="">All Body Styles</option>
            {bodyStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedSort}
            onChange={handleSortChange}
          >
            <option>Sort By: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
          </select>
        </div>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No vehicles match your criteria</h2>
          <p className="text-gray-600 mb-6">Try adjusting your filters or search terms to find more options.</p>
          <Button
            onClick={() => {
              setSelectedName("")
              setSelectedBodyStyle("")
              setFilteredVehicles(vehicles)
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredVehicles.map((vehicle) => (
            <Link key={vehicle.id} href={`/cars/${vehicle.id}`} className="group">
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={vehicle.imageUrl || "/placeholder.svg"}
                    alt={vehicle.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {vehicle.featured && (
                    <Badge className="absolute top-3 left-3 bg-green-600 hover:bg-green-700">Featured</Badge>
                  )}
                  {vehicle.status === 'sold' && (
                    <Badge className="absolute top-3 right-3 bg-red-600 hover:bg-red-700">Sold</Badge>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-green-600 transition-colors">
                        {vehicle.name}
                      </h3>
                      <p className="text-sm text-gray-500">{vehicle.model} · {vehicle.bodyStyle}</p>
                    </div>
                    <p className="font-bold text-green-600">${vehicle.price.toLocaleString()}</p>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{vehicle.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>{vehicle.mileage.toLocaleString()} miles</span>
                      <span>{vehicle.transmission}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{vehicle.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
