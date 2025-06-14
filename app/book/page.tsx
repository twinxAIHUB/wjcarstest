"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Car, MapPin, Phone, Mail, Shield, Info, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function BookingPage() {
  const [isCallWidgetLoaded, setIsCallWidgetLoaded] = useState(false)
  const [isTestDriveWidgetLoaded, setIsTestDriveWidgetLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("call")
  const searchParams = useSearchParams()

  // Set the active tab based on URL parameters
  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "test-drive") {
      setActiveTab("test-drive")
    } else if (type === "call") {
      setActiveTab("call")
    }
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 rounded-xl p-8 md:p-12 border border-gray-100 shadow-sm">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
              Easy Scheduling
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Schedule Your Appointment</h1>
            <p className="text-gray-600 text-lg mb-6">
              Book a consultation call with our luxury vehicle specialists or schedule a test drive of your dream car.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => setActiveTab("call")}
                variant={activeTab === "call" ? "default" : "outline"}
                className={activeTab === "call" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <Clock className="mr-2 h-5 w-5" /> Schedule a Call
              </Button>
              <Button
                onClick={() => setActiveTab("test-drive")}
                variant={activeTab === "test-drive" ? "default" : "outline"}
                className={activeTab === "test-drive" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <Car className="mr-2 h-5 w-5" /> Book a Test Drive
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Options */}
      <section className="mb-12">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="call" className="text-base py-3 flex items-center justify-center">
                <Clock className="mr-2 h-5 w-5" /> Schedule a Call
              </TabsTrigger>
              <TabsTrigger value="test-drive" className="text-base py-3 flex items-center justify-center">
                <Car className="mr-2 h-5 w-5" /> Book a Test Drive
              </TabsTrigger>
            </TabsList>

            <TabsContent value="call" className="mt-0">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Schedule a 10-Minute Consultation</h2>
                    <p className="text-gray-500">
                      Speak with our luxury vehicle specialists about any questions you may have
                    </p>
                  </div>
                </div>

                <Alert className="mb-6 bg-blue-50 border-blue-100">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Our specialists can help with vehicle specifications, financing options, and availability.
                  </AlertDescription>
                </Alert>

                <div className="relative min-h-[650px] w-full">
                  {!isCallWidgetLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex flex-col items-center">
                        <Calendar className="h-12 w-12 text-green-600 animate-pulse mb-4" />
                        <p className="text-gray-500">Loading appointment calendar...</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    src="https://link.twinx.ai/widget/bookings/wj-carsales"
                    frameBorder="0"
                    className="w-full min-h-[650px] rounded-lg"
                    onLoad={() => setIsCallWidgetLoaded(true)}
                    title="Schedule a Consultation Call with Wise Specialists"
                    aria-label="Booking calendar for consultation calls"
                  ></iframe>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="test-drive" className="mt-0">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Car className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Book a 30-Minute Test Drive Experience</h2>
                    <p className="text-gray-500">
                      Experience the performance and luxury of your dream vehicle in person
                    </p>
                  </div>
                </div>

                <Alert className="mb-6 bg-amber-50 border-amber-100">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-700">
                    Please bring your valid driver's license and proof of insurance for your test drive appointment.
                  </AlertDescription>
                </Alert>

                <div className="relative min-h-[650px] w-full">
                  {!isTestDriveWidgetLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex flex-col items-center">
                        <Calendar className="h-12 w-12 text-green-600 animate-pulse mb-4" />
                        <p className="text-gray-500">Loading test drive calendar...</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    src="https://link.twinx.ai/widget/bookings/williamthomsom"
                    frameBorder="0"
                    className="w-full min-h-[650px] rounded-lg"
                    onLoad={() => setIsTestDriveWidgetLoaded(true)}
                    title="Schedule a Test Drive with Wise"
                    aria-label="Booking calendar for test drives"
                  ></iframe>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Additional Information */}
      <section>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold mb-3 flex items-center text-lg">
                <Clock className="h-5 w-5 text-green-600 mr-2" /> Our Hours
              </h3>
              <Separator className="my-3" />
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between">
                  <span className="font-medium">Monday - Friday</span>
                  <span>9:00 AM - 7:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Sunday</span>
                  <span>11:00 AM - 4:00 PM</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold mb-3 flex items-center text-lg">
                <Car className="h-5 w-5 text-green-600 mr-2" /> Test Drive Requirements
              </h3>
              <Separator className="my-3" />
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">1</span>
                  </div>
                  <span>Valid driver's license</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">2</span>
                  </div>
                  <span>Proof of insurance</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">3</span>
                  </div>
                  <span>Must be 21+ years of age</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">4</span>
                  </div>
                  <span>Comfortable driving attire</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold mb-3 flex items-center text-lg">
                <Phone className="h-5 w-5 text-green-600 mr-2" /> Contact Information
              </h3>
              <Separator className="my-3" />
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 text-green-600 mr-2" />
                  <a href="tel:5551234567" className="font-medium hover:text-green-600 transition-colors">
                    (555) 123-4567
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 text-green-600 mr-2" />
                  <a href="mailto:sales@wjcarsales.com" className="font-medium hover:text-green-600 transition-colors">
                    sales@wjcarsales.com
                  </a>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-4 w-4 text-green-600 mr-2 mt-1" />
                  <span>
                    123 Luxury Lane
                    <br />
                    Beverly Hills, CA 90210
                  </span>
                </li>
              </ul>
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold mb-2 flex items-center">
                <ChevronRight className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                What happens after I book an appointment?
              </h3>
              <p className="text-gray-600">
                You'll receive an email confirmation with your appointment details. Our team will also reach out to
                confirm and answer any preliminary questions you might have.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold mb-2 flex items-center">
                <ChevronRight className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                Can I reschedule my appointment?
              </h3>
              <p className="text-gray-600">
                Yes, you can reschedule through the confirmation email you receive or by calling our customer service
                team at (555) 123-4567.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold mb-2 flex items-center">
                <ChevronRight className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                How long do test drives typically last?
              </h3>
              <p className="text-gray-600">
                Our standard test drives are scheduled for 30 minutes, which includes a brief orientation with the
                vehicle and the actual driving experience.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold mb-2 flex items-center">
                <ChevronRight className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                Can I test drive multiple vehicles?
              </h3>
              <p className="text-gray-600">
                Yes, please let us know in advance which models you're interested in, and we'll arrange for multiple
                vehicles to be available during your appointment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
