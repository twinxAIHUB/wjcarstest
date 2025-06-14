import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Award, Clock, Shield, Star, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="bg-gray-100 rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Wise</h1>
            <p className="text-gray-600 text-lg mb-8">
              We are a premier luxury car dealership dedicated to providing exceptional vehicles and outstanding
              customer service.
            </p>
            <Button className="bg-green-600 hover:bg-green-700" asChild>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Excellence</h3>
            <p className="text-gray-600">
              We are committed to excellence in every aspect of our business, from the vehicles we select to the service
              we provide.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Integrity</h3>
            <p className="text-gray-600">
              We operate with complete transparency and honesty, ensuring our customers can trust us every step of the
              way.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Customer Focus</h3>
            <p className="text-gray-600">
              We put our customers at the center of everything we do, tailoring our approach to meet their unique needs
              and preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-16">
        <div className="bg-gray-100 rounded-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Wise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Curated Selection</h3>
                <p className="text-gray-600">
                  We handpick each vehicle in our inventory, ensuring that we offer only the finest luxury automobiles
                  that meet our stringent quality standards.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Comprehensive Inspection</h3>
                <p className="text-gray-600">
                  Every vehicle undergoes a rigorous multi-point inspection by our certified technicians before being
                  offered for sale.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Personalized Service</h3>
                <p className="text-gray-600">
                  We take the time to understand your preferences and requirements, helping you find the perfect vehicle
                  that matches your lifestyle and desires.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Ongoing Support</h3>
                <p className="text-gray-600">
                  Our relationship doesn't end when you drive away. We provide continued support and service to ensure
                  your complete satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
