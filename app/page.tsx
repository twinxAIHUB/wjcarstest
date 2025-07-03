'use client';

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cars } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, ChevronRight, Phone } from "lucide-react"
import FeaturedVehicles from "./components/featured-vehicles"
import Promotions from './components/promotions'
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
// import { useTranslation } from './contexts/TranslationContext';

export default function Home() {
  // const { t } = useTranslation();
  // Filter featured cars
  const featuredCars = cars.filter((car) => car.featured).slice(0, 4)
  const [heroVideoUrl, setHeroVideoUrl] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const fetchHeroVideoUrl = async () => {
      try {
        const docRef = doc(db, "siteConfig", "hero");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeroVideoUrl(docSnap.data().videoUrl || null);
        }
      } catch (error) {
        setHeroVideoUrl(null);
      }
    };
    fetchHeroVideoUrl();

    // Fetch testimonials
    const fetchTestimonials = async () => {
      try {
        const snap = await getDocs(collection(db, "testimonials"));
        setTestimonials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        setTestimonials([]);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.section
        className="relative h-[60vh] md:h-[80vh] rounded-xl overflow-hidden mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Video background for all devices, fallback image if video fails */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="/images/hero-bg.jpg"
          >
            <source src={heroVideoUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11957140_1920_1080_60fps-mqz6omTWaVjuS0YYRmpeCAwUn7TNey.mp4"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex flex-col justify-center px-4 md:px-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              The Best Deals in <span className="text-green-500">Florida</span>
            </h1>
            <p className="text-white/80 text-base md:text-xl max-w-2xl mb-6 md:mb-8">
              Discover our exclusive collection of premium vehicles, each one meticulously selected for performance and luxury.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" asChild>
                <Link href="/cars">View Inventory</Link>
              </Button>
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-medium w-full sm:w-auto" asChild>
                <Link href="/contact">
                  <Phone className="mr-2 h-5 w-5" /> Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Vehicles */}
      <FeaturedVehicles />

      {/* Promotions */}
      <Promotions />

      {/* Testimonials */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold mb-8">What Our Customers Say</h2>
        {testimonials.length === 0 ? (
          <div className="text-gray-400 text-center">No testimonials yet.</div>
        ) : (
          <div className="relative max-w-2xl mx-auto">
            <Carousel>
              <CarouselContent>
                {testimonials.map((testimonial, i) => (
                  <CarouselItem key={testimonial.id || i}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col justify-between relative"
                    >
                      <div className="absolute -top-6 left-6 bg-green-100 text-green-600 rounded-full p-2 shadow"><svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-7 h-7'><path strokeLinecap='round' strokeLinejoin='round' d='M7.5 15h-2.25A2.25 2.25 0 013 12.75v-1.5A2.25 2.25 0 015.25 9h2.25V6.75A2.25 2.25 0 019.75 4.5h.5a.75.75 0 01.75.75v2.25A2.25 2.25 0 0112.25 9h-2.5a.75.75 0 00-.75.75v1.5c0 .414.336.75.75.75h2.25A2.25 2.25 0 0114.5 15v2.25A2.25 2.25 0 0112.25 19.5h-.5a.75.75 0 01-.75-.75V16.5A2.25 2.25 0 019.75 15H7.5z' /></svg></div>
                      <div className="flex items-center mb-4 mt-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-8 text-lg italic">"{testimonial.text}"</p>
                      <div className="flex items-center mt-auto">
                        {testimonial.imageUrl ? (
                          <span className="w-14 h-14 rounded-full border-4 border-green-200 overflow-hidden mr-4 block">
                            <img src={testimonial.imageUrl} alt={testimonial.name} className="w-full h-full object-cover" />
                          </span>
                        ) : (
                          <span className="w-14 h-14 rounded-full border-4 border-green-100 bg-gray-200 mr-4 block" />
                        )}
                        <div>
                          <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}
      </motion.section>

      {/* Services Section */}
      <motion.section
        className="py-12 md:py-16 bg-gray-50"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Insurance Premium",
                description:
                  "Get the best insurance coverage for your vehicle at competitive rates. Protect your investment and drive with peace of mind.",
                whatsappText:
                  "Hola William, me interesa el servicio de Insurance Premium.",
                type: "whatsapp",
              },
              {
                title: "Trade Car",
                description:
                  "Easily trade in your current car for a new one. Enjoy a hassle-free process and get a great value for your trade.",
                whatsappText:
                  "Hola William, me interesa el servicio de Trade Car.",
                type: "whatsapp",
              },
              {
                title: "Financing Options",
                description:
                  "Flexible financing solutions tailored to your needs with competitive rates and terms.",
                link: "/financing",
                type: "link",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                {service.type === "whatsapp" ? (
                  <a
                    href={`https://api.whatsapp.com/send/?phone=13083891551&text=${encodeURIComponent(
                      service.whatsappText || ""
                    )}&type=phone_number&app_absent=0`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                  >
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={service.link || "#"}
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                  >
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-12 md:py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-4">
          <div className="bg-green-600 rounded-xl p-6 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Find Your Dream Car?</h2>
              <p className="text-white/80 mb-6 md:mb-8 text-base md:text-lg">
                Our team of experts is ready to help you find the perfect luxury vehicle that matches your style and needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 w-full sm:w-auto" asChild>
                  <Link href="/cars">Browse Inventory</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 w-full sm:w-auto" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="container mx-auto px-4 py-16">
      </section>
    </div>
  )
} 