"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Image from "next/image";
import { motion } from "framer-motion";

interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function Promotions() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const snap = await getDocs(collection(db, "promotions"));
        setPromos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion)));
      } catch (e) {
        setPromos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (promos.length === 0) return null;

  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="text-3xl font-bold mb-8">Promotions</h2>
      <div className="relative max-w-3xl mx-auto">
        <Carousel>
          <CarouselContent>
            {promos.map((promo, i) => (
              <CarouselItem key={promo.id}>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-0 overflow-hidden flex flex-col h-full">
                  <div className="relative w-full h-56 md:h-72">
                    <Image src={promo.imageUrl} alt={promo.title} fill className="object-cover w-full h-full" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                      <p className="text-gray-600 mb-2">{promo.description}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </motion.section>
  );
} 