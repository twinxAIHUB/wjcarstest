"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Expand, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { motion } from "framer-motion"

interface CarImageGalleryProps {
  images: string[]
  make: string
  model: string
  videoUrl?: string
}

// Preload critical images
const preloadImage = (src: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

export default function CarImageGallery({ images, make, model, videoUrl }: CarImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [imageLoading, setImageLoading] = useState(true)
  
  // Refs for intersection observer
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Preload critical images on mount
  useEffect(() => {
    if (images && images.length > 0) {
      // Preload the first 2 images
      const criticalImages = images.slice(0, 2);
      criticalImages.forEach(preloadImage);
      setLoadedImages(new Set(criticalImages));
    }
  }, [images]);

  // Intersection observer for lazy loading thumbnails
  useEffect(() => {
    if (!images || images.length <= 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imgSrc = entry.target.getAttribute('data-src');
            if (imgSrc && !loadedImages.has(imgSrc)) {
              // Load the image when it comes into view
              const img = new window.Image();
              img.onload = () => {
                setLoadedImages(prev => new Set(prev).add(imgSrc));
              };
              img.src = imgSrc;
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    thumbnailRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [images, loadedImages]);

  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const prevImage = useCallback(() => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageChange = useCallback((index: number) => {
    setCurrentImage(index);
    setImageLoading(true);
  }, []);

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
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
              </div>
            )}
            <Image
              src={images[currentImage] || "/placeholder.svg"}
              alt={`${make} ${model}`}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              priority
              onLoad={handleImageLoad}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={85}
            />
          </motion.div>
        )}
        {!showVideo && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full z-20"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full z-20"
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
                  className="absolute right-2 top-2 bg-black/30 text-white hover:bg-black/50 rounded-full z-20"
                >
                  <Expand className="h-5 w-5" />
                  <span className="sr-only">View fullscreen</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl">
                <div className="relative aspect-[16/9]">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={images[currentImage] || "/placeholder.svg"}
                      alt={`${make} ${model} - Fullscreen view`}
                      fill
                      className="object-contain"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      sizes="100vw"
                      quality={90}
                    />
                  </motion.div>
                </div>
              </DialogContent>
            </Dialog>
            {videoUrl && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-2 bg-black/30 text-white hover:bg-black/50 rounded-full z-20"
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
        {images.map((image, index) => {
          const isCritical = index < 2; // First 2 images are critical
          const isLoaded = isCritical || loadedImages.has(image);
          
          return (
            <button
              key={index}
              ref={(el) => {
                if (!isCritical) {
                  thumbnailRefs.current[index] = el;
                }
              }}
              data-src={!isCritical ? image : undefined}
              className={`relative aspect-[4/3] rounded-md overflow-hidden ${
                index === currentImage && !showVideo ? "ring-2 ring-green-600" : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => {
                handleImageChange(index)
                setShowVideo(false)
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="w-full h-full"
              >
                {isLoaded ? (
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${make} ${model} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    loading={isCritical ? 'eager' : 'lazy'}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    sizes="(max-width: 768px) 20vw, 10vw"
                    quality={75}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
                  </div>
                )}
              </motion.div>
            </button>
          );
        })}
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
              loading="lazy"
              quality={75}
            />
          </button>
        )}
      </div>
    </div>
  )
}
