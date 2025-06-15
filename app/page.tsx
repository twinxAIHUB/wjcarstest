'use client';

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cars } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, ChevronRight, Phone } from "lucide-react"
import FeaturedVehicles from "./components/featured-vehicles"
import VehicleCategories from './components/vehicle-categories'
// import { useTranslation } from './contexts/TranslationContext';

export default function Home() {
  // const { t } = useTranslation();
  // Filter featured cars
  const featuredCars = cars.filter((car) => car.featured).slice(0, 4)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] rounded-xl overflow-hidden mb-12">
        {/* Video background for all devices */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="/images/hero-bg.jpg"
          >
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11957140_1920_1080_60fps-mqz6omTWaVjuS0YYRmpeCAwUn7TNey.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        {/* Content overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4">
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
      </section>

      {/* Featured Vehicles */}
      <FeaturedVehicles />

      {/* Categories */}
      <VehicleCategories />

      {/* Testimonials */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "John Smith",
              role: "Satisfied Customer",
              text: "The service at Wise was exceptional. They helped me find the perfect luxury vehicle that matched all my requirements.",
            },
            {
              name: "Sarah Johnson",
              role: "Repeat Customer",
              text: "This is my second purchase from Wise and I couldn't be happier. Their attention to detail and customer service is unmatched.",
            },
            {
              name: "Michael Chen",
              role: "First-time Buyer",
              text: "As a first-time luxury car buyer, I was nervous about the process. The team at Wise made everything simple and stress-free.",
            },
          ].map((testimonial, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-16 bg-gray-50">
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
                      'Hola William, me interesa Cotizar un seguro para mi auto'
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
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
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
      </section>

      <section className="container mx-auto px-4 py-16">
      </section>
    </div>
  )
} 