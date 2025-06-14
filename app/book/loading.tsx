import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section Skeleton */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 rounded-xl p-8 md:p-12 border border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-2/3 mx-auto mb-6" />
            <div className="flex flex-wrap justify-center gap-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </section>

      {/* Booking Options Skeleton */}
      <section className="mb-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid w-full grid-cols-2 mb-8">
            <Skeleton className="h-12 rounded-l-lg rounded-r-none" />
            <Skeleton className="h-12 rounded-r-lg rounded-l-none" />
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>

            <Skeleton className="h-16 w-full mb-6 rounded-lg" />

            <div className="flex items-center justify-center bg-gray-50 rounded-lg min-h-[650px] border border-gray-100">
              <div className="flex flex-col items-center">
                <Calendar className="h-12 w-12 text-green-600 animate-pulse mb-4" />
                <p className="text-gray-500">Loading calendar...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information Skeleton */}
      <section>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mx-auto mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-[1px] w-full my-3" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section Skeleton */}
      <section className="mt-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mx-auto mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Skeleton */}
      <section className="mt-12">
        <div className="max-w-4xl mx-auto bg-green-600 rounded-xl p-8">
          <Skeleton className="h-8 w-64 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-4 w-full max-w-2xl mx-auto mb-2 bg-white/20" />
          <Skeleton className="h-4 w-3/4 max-w-2xl mx-auto mb-6 bg-white/20" />
          <div className="flex flex-wrap justify-center gap-4">
            <Skeleton className="h-10 w-40 bg-white/20" />
            <Skeleton className="h-10 w-40 bg-white/20" />
          </div>
        </div>
      </section>
    </div>
  )
}
