"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="relative w-64 h-64 mb-8">
        <Image src="/images/logo.png" alt="Wise Logo" fill className="object-contain" />
      </div>
      <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-gray-600 max-w-md mb-8">
        We apologize for the inconvenience. An unexpected error has occurred. Our team has been notified and is working
        to fix the issue.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} className="bg-green-600 hover:bg-green-700">
          <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" /> Return Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
