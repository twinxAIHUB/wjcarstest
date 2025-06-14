"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Expand, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface CarImageGalleryProps {
  images: string[]
  make: string
  model: string
  videoUrl?: string
}

export default function CarImageGallery({ images, make, model, videoUrl }: CarImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [showVideo, setShowVideo] = useState(false)

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden aspect-[16/9]">
        {showVideo && videoUrl ? (
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            controls
            autoPlay
            onEnded={() => setShowVideo(false)}
          />
        ) : (
          <Image
            src={images[currentImage] || "/placeholder.svg"}
            alt={`${make} ${model}`}
            fill
            className="object-cover"
            priority
          />
        )}
        {!showVideo && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next image</span>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 bg-black/30 text-white hover:bg-black/50 rounded-full"
                >
                  <Expand className="h-5 w-5" />
                  <span className="sr-only">View fullscreen</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={images[currentImage] || "/placeholder.svg"}
                    alt={`${make} ${model} - Fullscreen view`}
                    fill
                    className="object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
            {videoUrl && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-2 bg-black/30 text-white hover:bg-black/50 rounded-full"
                onClick={() => setShowVideo(true)}
              >
                <Play className="h-5 w-5" />
                <span className="sr-only">Play video</span>
              </Button>
            )}
          </>
        )}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative aspect-[4/3] rounded-md overflow-hidden ${
              index === currentImage && !showVideo ? "ring-2 ring-green-600" : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => {
              setCurrentImage(index)
              setShowVideo(false)
            }}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${make} ${model} - Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
        {videoUrl && (
          <button
            className={`relative aspect-[4/3] rounded-md overflow-hidden ${
              showVideo ? "ring-2 ring-green-600" : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => setShowVideo(true)}
          >
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Play className="h-8 w-8 text-white" />
            </div>
            <Image
              src={images[0] || "/placeholder.svg"}
              alt={`${make} ${model} - Video thumbnail`}
              fill
              className="object-cover"
            />
          </button>
        )}
      </div>
    </div>
  )
}
