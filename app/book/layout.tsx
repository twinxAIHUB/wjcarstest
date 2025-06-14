import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book an Appointment | Wise - Luxury Vehicle Consultations & Test Drives",
  description:
    "Schedule a consultation call or book a test drive with Wise. Experience our luxury vehicles with personalized appointments and expert guidance.",
  keywords:
    "luxury car test drive, car dealership appointment, schedule test drive, car consultation, luxury vehicle booking, Wise appointment",
  openGraph: {
    title: "Book an Appointment | Wise",
    description:
      "Schedule a consultation call or book a test drive with Wise. Experience our luxury vehicles with personalized appointments.",
    type: "website",
    locale: "en_US",
    url: "https://wjcarsales.com/book",
  },
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
