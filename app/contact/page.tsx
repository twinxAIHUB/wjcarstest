import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 rounded-xl p-8 md:p-12 border border-gray-100 shadow-sm">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-gray-600 text-lg mb-0">
              El Mejor Precio del Mercado
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information and Form */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Contact Us</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                </div>
                <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" />
              </div>
              <div>
                    <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                      placeholder="How can we help you?"
                      className="min-h-[120px]"
                />
              </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
              <div>
                        <h3 className="font-semibold text-lg">Phone</h3>
                        <a href="tel:13083891551" className="text-gray-600 hover:text-green-600">
                          +1 (308) 389-1551
                        </a>
              </div>
          </div>

                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                        <h3 className="font-semibold text-lg">Location</h3>
                    <a
                      href="https://maps.google.com/?q=West+Palm+Beach+FL+33409"
                      target="_blank"
                      rel="noopener noreferrer"
                          className="text-gray-600 hover:text-green-600"
                    >
                          West Palm Beach, FL 33409
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                        <a href="mailto:Williamkeysmotors@gmail.com" className="text-gray-600 hover:text-green-600">
                          Williamkeysmotors@gmail.com
                        </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 7:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sunday: 11:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

                <div className="bg-green-50 p-6 md:p-8 rounded-xl border border-green-100">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Quick Response</h3>
                  <p className="text-gray-700">
                    We aim to respond to all inquiries within 24 hours. For immediate assistance, please call our sales
                    team.
                  </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold mb-2">What are your financing options?</h3>
            <p className="text-gray-600">
              We offer a variety of financing options including traditional loans, leasing, and in-house financing for
              qualified buyers. Visit our financing page or contact our finance department for more details.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold mb-2">Do you accept trade-ins?</h3>
            <p className="text-gray-600">
              Yes, we accept trade-ins of all makes and models. Our team will provide a fair market value for your
              vehicle based on its condition, age, and market demand.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold mb-2">What warranty options do you offer?</h3>
            <p className="text-gray-600">
              All our vehicles come with a standard warranty. We also offer extended warranty options for additional
              peace of mind. Speak with our sales team for specific warranty details on the vehicle you're interested
              in.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold mb-2">Can I schedule a test drive online?</h3>
            <p className="text-gray-600">
              Yes, you can schedule a test drive online through our booking page. Simply select the vehicle you're
              interested in and choose a convenient time for your test drive.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Our Finance Team</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Have questions about financing? Reach out to our finance team directly via WhatsApp.
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            <a
              href="https://api.whatsapp.com/send/?phone=13083891551&text=Hola+William%2C+me+interesa+el+servicio+de+Insurance+Premium.&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Contact Finance Team on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
