import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input id="name" placeholder="John Smith" required className="w-full" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <Input id="email" type="email" placeholder="john@example.com" required className="w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input id="phone" placeholder="(555) 123-4567" className="w-full" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <Input id="subject" placeholder="How can we help you?" required className="w-full" />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <Textarea
                  id="message"
                  placeholder="Please provide details about your inquiry..."
                  required
                  className="w-full min-h-[150px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="consent" className="rounded text-green-600 focus:ring-green-500" />
                <label htmlFor="consent" className="text-sm text-gray-600">
                  I consent to having this website store my submitted information so they can respond to my inquiry.
                </label>
              </div>

              <div>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Send Message
                </Button>
              </div>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Our Location</h3>
                    <p className="text-gray-600">
                      West Palm Beach, FL 33409
                    </p>
                    <a
                      href="https://maps.google.com/?q=West+Palm+Beach+FL+33409"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline mt-1 inline-block"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Phone</h3>
                    <p className="text-gray-600">‪+1 (308) 389-1551‬</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-gray-600">Williamkeysmotors@gmail.com</p>
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

            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
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
