"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface SaveButtonProps {
  carId: string
  carName: string
}

export default function SaveButton({ carId, carName }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false)

  // Check if car is already saved in localStorage
  useEffect(() => {
    const savedCars = JSON.parse(localStorage.getItem("savedCars") || "[]")
    setIsSaved(savedCars.includes(carId))
  }, [carId])

  const handleSave = () => {
    const savedCars = JSON.parse(localStorage.getItem("savedCars") || "[]")

    if (isSaved) {
      // Remove from saved cars
      const updatedSavedCars = savedCars.filter((id: string) => id !== carId)
      localStorage.setItem("savedCars", JSON.stringify(updatedSavedCars))
      setIsSaved(false)

      toast({
        title: "Removed from favorites",
        description: `${carName} has been removed from your favorites.`,
      })
    } else {
      // Add to saved cars
      savedCars.push(carId)
      localStorage.setItem("savedCars", JSON.stringify(savedCars))
      setIsSaved(true)

      toast({
        title: "Added to favorites",
        description: `${carName} has been added to your favorites.`,
      })
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={`rounded-full ${isSaved ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100 hover:text-red-600" : ""}`}
      onClick={handleSave}
    >
      <Heart className={`h-5 w-5 ${isSaved ? "fill-red-500" : ""}`} />
      <span className="sr-only">{isSaved ? "Remove from favorites" : "Add to favorites"}</span>
    </Button>
  )
}
