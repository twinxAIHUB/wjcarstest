"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, Phone, User, Car, CreditCard, HelpCircle, MapPin, X, ChevronDown, Heart } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation"
import Marquee from "./Marquee"

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [savedCarsCount, setSavedCarsCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get saved cars count
  useEffect(() => {
    const updateSavedCount = () => {
      const savedCars = JSON.parse(localStorage.getItem("savedCars") || "[]")
      setSavedCarsCount(savedCars.length)
    }

    // Initial count
    updateSavedCount()

    // Listen for storage changes
    window.addEventListener("storage", updateSavedCount)

    // Custom event for when we update saved cars without triggering storage event
    window.addEventListener("savedCarsUpdated", updateSavedCount)

    return () => {
      window.removeEventListener("storage", updateSavedCount)
      window.removeEventListener("savedCarsUpdated", updateSavedCount)
    }
  }, [])

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/cars?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Handle contact us button click
  const handleContactClick = () => {
    router.push("/contact")
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-white transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      {/* Top Bar with Contact Info - Scrolling Animation */}
      <div className="hidden md:block bg-gray-900 text-white py-2 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="animate-marquee-container overflow-hidden w-full">
            <div className="animate-marquee flex items-center space-x-8">
              <div className="flex items-center space-x-8 min-w-max">
                <a href="tel:13083891551" className="flex items-center hover:text-green-400 transition-colors">
                  <Phone className="h-4 w-4 text-green-500 mr-2" />
                  <span>+1 (308) 389-1551</span>
                </a>
                <a
                  href="https://maps.google.com/?q=West+Palm+Beach+FL+33409"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-green-400 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-green-500 mr-2" />
                  <span>West Palm Beach, FL 33409</span>
                </a>
                <Link href="/book" className="hover:text-green-400 transition-colors">
                  Book Appointment
                </Link>
                <Link href="/contact" className="hover:text-green-400 transition-colors">
                  Contact Us
                </Link>
              </div>
              <div className="flex items-center space-x-8 min-w-max">
                <a href="tel:13083891551" className="flex items-center hover:text-green-400 transition-colors">
                  <Phone className="h-4 w-4 text-green-500 mr-2" />
                  <span>+1 (308) 389-1551</span>
                </a>
                <a
                  href="https://maps.google.com/?q=West+Palm+Beach+FL+33409"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-green-400 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-green-500 mr-2" />
                  <span>West Palm Beach, FL 33409</span>
                </a>
                <Link href="/book" className="hover:text-green-400 transition-colors">
                  Book Appointment
                </Link>
                <Link href="/contact" className="hover:text-green-400 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Contact Bar */}
      <div className="md:hidden bg-gray-900 text-white py-2 px-4">
        <div className="flex items-center justify-between">
          <a href="tel:13083891551" className="flex items-center text-sm hover:text-green-400 transition-colors">
            <Phone className="h-4 w-4 text-green-500 mr-2" />
            <span>+1 (308) 389-1551</span>
          </a>
          <Link href="/book" className="text-sm hover:text-green-400 transition-colors">
            Book Now
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo: Left on all views, bigger on desktop */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center">
              <div className="relative h-12 w-32 md:h-20 md:w-44">
                <Image src="/images/logo.png" alt="Wise Choices Logo" fill className="object-contain" priority />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <div className="flex justify-between items-center mb-6">
                  <Link href="/" className="flex items-center">
                    <div className="relative h-20 w-36">
                      <Image src="/images/logo.png" alt="Wise Logo" fill className="object-contain" priority />
                    </div>
                  </Link>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <form onSubmit={handleSearchSubmit} className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search for vehicles..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
                <nav className="flex flex-col gap-1">
                  <Link
                    href="/"
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${
                      pathname === "/" ? "text-green-600 font-semibold" : ""
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/cars"
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${
                      pathname === "/cars" ? "text-green-600 font-semibold" : ""
                    }`}
                  >
                    <Car className="mr-2 h-5 w-5" /> Inventory
                  </Link>
                  <Link
                    href="/financing"
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${
                      pathname === "/financing" ? "text-green-600 font-semibold" : ""
                    }`}
                  >
                    <CreditCard className="mr-2 h-5 w-5" /> Financing
                  </Link>
                  <Link
                    href="/about"
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${
                      pathname === "/about" ? "text-green-600 font-semibold" : ""
                    }`}
                  >
                    <HelpCircle className="mr-2 h-5 w-5" /> About Us
                  </Link>
                  <Link
                    href="/book"
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${
                      pathname === "/book" ? "text-green-600 font-semibold" : ""
                    }`}
                  >
                    <Phone className="mr-2 h-5 w-5" /> Book Appointment
                  </Link>
                  <Link
                    href="/contact"
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${
                      pathname === "/contact" ? "text-green-600 font-semibold" : ""
                    }`}
                  >
                    <MapPin className="mr-2 h-5 w-5" /> Contact
                  </Link>
                </nav>
                <div className="mt-6 pt-6 border-t">
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link href="/book">Book a Test Drive</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full mt-3 bg-white border border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-green-600 transition-colors ${
                pathname === "/" ? "text-green-600" : ""
              }`}
            >
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`px-3 py-2 h-auto text-sm font-medium rounded-md hover:bg-gray-50 hover:text-green-600 transition-colors ${
                    pathname === "/cars" || pathname.startsWith("/cars/") ? "text-green-600" : ""
                  }`}
                >
                  Inventory <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/cars" className="cursor-pointer w-full">
                    All Vehicles
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cars?bodyStyle=Sedan" className="cursor-pointer w-full">
                    Sedans
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cars?bodyStyle=SUV" className="cursor-pointer w-full">
                    SUVs
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cars?bodyStyle=Coupe" className="cursor-pointer w-full">
                    Coupes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cars?fuelType=Electric" className="cursor-pointer w-full">
                    Electric
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/financing"
              className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-green-600 transition-colors ${
                pathname === "/financing" ? "text-green-600" : ""
              }`}
            >
              Financing
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`px-3 py-2 h-auto text-sm font-medium rounded-md hover:bg-gray-50 hover:text-green-600 transition-colors ${
                    pathname === "/services" ? "text-green-600" : ""
                  }`}
                >
                  Services <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <a
                    href="https://api.whatsapp.com/send/?phone=13083891551&text=Hola+William%2C+me+interesa+el+servicio+de+Insurance+Premium.&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer w-full"
                  >
                    Insurance Premium
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href="https://api.whatsapp.com/send/?phone=13083891551&text=Hola+William%2C+me+interesa+el+servicio+de+Trade+Car.&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer w-full"
                  >
                    Trade Car
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/about"
              className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-green-600 transition-colors ${
                pathname === "/about" ? "text-green-600" : ""
              }`}
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-green-600 transition-colors ${
                pathname === "/contact" ? "text-green-600" : ""
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search vehicles..."
                    className="w-full md:w-[200px] h-9 pl-10"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => searchQuery === "" && setIsSearchOpen(false)}
                  />
                </div>
                <Button type="submit" variant="ghost" size="sm" className="ml-1">
                  Go
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="rounded-full">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}

            <Button
              onClick={handleContactClick}
              className="hidden md:flex bg-green-600 hover:bg-green-700 ml-2 font-medium"
            >
              Contact Us
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {/* Logo at the top of mobile menu */}
              <div className="flex justify-start mb-4 pl-2">
                <div className="relative h-12 w-32">
                  <Image src="/images/logo.png" alt="Wise Choices Logo" fill className="object-contain" priority />
                </div>
              </div>
              <Link
                href="/cars"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium"
              >
                Inventory
              </Link>
              <Link
                href="/financing"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium"
              >
                Financing
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium"
              >
                Contact
              </Link>
              <div className="px-3 py-2">
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleContactClick}>
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
