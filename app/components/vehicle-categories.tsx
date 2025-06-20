'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface Category {
  name: string;
  count: number;
  link: string;
  type: 'bodyStyle' | 'fuelType' | 'brand';
  imageUrl: string;
}

const categoryImages = {
  Convertible: '/categories/convertible.jpg',
  Coupe: '/categories/coupe.jpg',
  Offroad: '/categories/offroad.jpg',
  'Pick-up': '/categories/pick-up.jpg',
  Sedan: '/categories/sedan.jpg',
  SUV: '/categories/SUV.jpg',
  Van: '/categories/van.jpg'
};

export default function VehicleCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const vehiclesRef = collection(db, 'vehicles');
        const snapshot = await getDocs(vehiclesRef);
        const vehicles = snapshot.docs.map(doc => doc.data());

        // Count vehicles by body style
        const bodyStyles = vehicles.reduce((acc, vehicle) => {
          const style = vehicle.bodyStyle || 'Other';
          acc[style] = (acc[style] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Count vehicles by fuel type
        const fuelTypes = vehicles.reduce((acc, vehicle) => {
          const type = vehicle.fuelType || 'Other';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Count luxury vehicles (Rolls-Royce)
        const luxuryCount = vehicles.filter(v => v.brand === 'Rolls-Royce').length;

        // Create category objects
        const categoryData: Category[] = [
          {
            name: 'Sedan',
            count: bodyStyles['Sedan'] || 0,
            link: '/cars?bodyStyle=Sedan',
            type: 'bodyStyle',
            imageUrl: categoryImages.Sedan
          },
          {
            name: 'SUV',
            count: bodyStyles['SUV'] || 0,
            link: '/cars?bodyStyle=SUV',
            type: 'bodyStyle',
            imageUrl: categoryImages.SUV
          },
          {
            name: 'Coupe',
            count: bodyStyles['Coupe'] || 0,
            link: '/cars?bodyStyle=Coupe',
            type: 'bodyStyle',
            imageUrl: categoryImages.Coupe
          },
          {
            name: 'Convertible',
            count: bodyStyles['Convertible'] || 0,
            link: '/cars?bodyStyle=Convertible',
            type: 'bodyStyle',
            imageUrl: categoryImages.Convertible
          },
          {
            name: 'Offroad',
            count: bodyStyles['Offroad'] || 0,
            link: '/cars?bodyStyle=Offroad',
            type: 'bodyStyle',
            imageUrl: categoryImages.Offroad
          },
          {
            name: 'Pick-up',
            count: bodyStyles['Pick-up'] || 0,
            link: '/cars?bodyStyle=Pick-up',
            type: 'bodyStyle',
            imageUrl: categoryImages['Pick-up']
          },
          {
            name: 'Van',
            count: bodyStyles['Van'] || 0,
            link: '/cars?bodyStyle=Van',
            type: 'bodyStyle',
            imageUrl: categoryImages.Van
          }
        ];

        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="relative h-40 rounded-lg overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {categories.map((category, i) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <Link
              href={category.link}
              className="block group"
            >
              <div className="relative h-40 rounded-lg overflow-hidden bg-gray-900">
                <Image
                  src={category.imageUrl || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 14vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center p-2 text-center">
                  <h3 className="text-white font-bold text-xl mb-2">{category.name}</h3>
                  <span className="text-white/80 text-sm">{category.count} vehicles</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 