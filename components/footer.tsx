import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-6">
              <div className="relative h-24 w-64">
                <Image src="/images/wise-logo.png" alt="Wise Logo" fill className="object-contain" />
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Providing luxury vehicles to discerning buyers for over a decade. Our commitment to quality and service is
              unmatched.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/profile.php?id=100065857454586&locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-green-600 transition-colors p-2 rounded-full"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://www.instagram.com/wise_autodeals/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-green-600 transition-colors p-2 rounded-full"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://www.tiktok.com/@wise_journeycarsales"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-green-600 transition-colors p-2 rounded-full"
              >
                <Image src="/images/tiktokpng.png" alt="TikTok" width={20} height={20} />
                <span className="sr-only">TikTok</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ArrowRight className="h-5 w-5 text-green-500 mr-2" /> Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white hover:underline transition-colors inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/cars"
                  className="text-gray-400 hover:text-white hover:underline transition-colors inline-block"
                >
                  Inventory
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white hover:underline transition-colors inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-400 hover:text-white hover:underline transition-colors inline-block"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/financing"
                  className="text-gray-400 hover:text-white hover:underline transition-colors inline-block"
                >
                  Financing
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="text-gray-400 hover:text-white hover:underline transition-colors inline-block"
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white hover:underline transition-colors inline-block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ArrowRight className="h-5 w-5 text-green-500 mr-2" /> Vehicle Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/cars?bodyStyle=Sedan"
                  className="text-gray-400 hover:text-white hover:underline transition-colors inline-block"
                >
                  Sedans
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?bodyStyle=Coupe"
                  className="text-gray-400 hover:text-white hover:underline transition-colors inline-block"
                >
                  Coupes
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?bodyStyle=SUV"
                  className="text-gray-400 hover:text-white hover:underline transition-colors inline-block"
                >
                  SUVs
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?bodyStyle=Convertible"
                  className="text-gray-400 hover:text-white hover:underline transition-colors inline-block"
                >
                  Convertibles
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?fuelType=Electric"
                  className="text-gray-400 hover:text-white hover:underline transition-colors inline-block"
                >
                  Electric Vehicles
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?fuelType=Hybrid"
                  className="text-gray-400 hover:text-white hover:underline transition-colors inline-block"
                >
                  Hybrids
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ArrowRight className="h-5 w-5 text-green-500 mr-2" /> Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span className="text-gray-400">
                  West Palm Beach, FL 33409
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-green-500 mr-2" />
                <a href="tel:13083891551" className="text-gray-400 hover:text-white transition-colors">
                  +1 (308) 389-1551
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-green-500 mr-2" />
                <a href="mailto:Williamkeysmotors@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  Williamkeysmotors@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Button asChild className="bg-green-600 hover:bg-green-700 w-full">
                <Link href="/contact">Get Directions</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Wise. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
