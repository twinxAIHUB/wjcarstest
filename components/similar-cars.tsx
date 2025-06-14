import Image from "next/image"
import Link from "next/link"
import { cars } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"

interface SimilarCarsProps {
  currentCarId: string
}

export default function SimilarCars({ currentCarId }: SimilarCarsProps) {
  const currentCar = cars.find((car) => car.id === currentCarId)

  if (!currentCar) return null

  const similarCars = cars
    .filter(
      (car) => car.id !== currentCarId && (car.make === currentCar.make || car.bodyStyle === currentCar.bodyStyle),
    )
    .slice(0, 3)

  if (similarCars.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Similar Vehicles</h2>
        <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50">
          View All <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {similarCars.map((car) => (
          <Link key={car.id} href={`/cars/${car.id}`} className="group">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={car.images[0] || "/placeholder.svg"}
                  alt={car.make + " " + car.model}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg group-hover:text-green-600 transition-colors">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <p className="font-bold text-green-600">${car.price.toLocaleString()}</p>
                </div>
                <p className="text-gray-500 text-sm mb-3">{car.shortDescription}</p>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                    <span>{car.rating}</span>
                  </div>
                  <span>{car.mileage.toLocaleString()} miles</span>
                  <span>{car.transmission}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
