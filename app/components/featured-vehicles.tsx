'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Vehicle {
  id: string;
  name: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  rating: number;
  imageUrl: string;
  featured: boolean;
}

export default function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const q = query(
          collection(db, 'vehicles'),
          where('featured', '==', true),
          limit(4)
        );
        
        const querySnapshot = await getDocs(q);
        const featuredVehicles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Vehicle[];
        
        setVehicles(featuredVehicles);
      } catch (error) {
        console.error('Error fetching featured vehicles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedVehicles();
  }, []);

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Vehicles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-[16/10] rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (vehicles.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Vehicles</h2>
          <Link href="/cars" className="text-green-600 hover:text-green-700">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <Link
              key={vehicle.id}
              href={`/cars/${vehicle.id}`}
              className="group block"
            >
              <div className="relative">
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-4">
                  <Image
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <Badge className="absolute top-2 left-2 bg-green-600">Featured</Badge>
                {vehicle.rating && (
                  <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{vehicle.rating}</span>
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{vehicle.name}</h3>
              <div className="text-xl font-bold text-green-600 mb-2">
                ${vehicle.price.toLocaleString()}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{vehicle.mileage.toLocaleString()} miles</span>
                <span>{vehicle.transmission}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 