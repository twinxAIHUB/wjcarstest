import { useState, useEffect, useRef, useCallback } from 'react';

interface UseImageOptimizationOptions {
  criticalCount?: number;
  rootMargin?: string;
  threshold?: number;
}

export function useImageOptimization(
  images: string[],
  options: UseImageOptimizationOptions = {}
) {
  const {
    criticalCount = 2,
    rootMargin = '50px',
    threshold = 0.1
  } = options;

  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imageLoading, setImageLoading] = useState(true);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Preload critical images
  const preloadImage = useCallback((src: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  }, []);

  // Preload critical images on mount
  useEffect(() => {
    if (images && images.length > 0) {
      const criticalImages = images.slice(0, criticalCount);
      criticalImages.forEach(preloadImage);
      setLoadedImages(new Set(criticalImages));
    }
  }, [images, criticalCount, preloadImage]);

  // Intersection observer for lazy loading thumbnails
  useEffect(() => {
    if (!images || images.length <= criticalCount) return;

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
        rootMargin,
        threshold
      }
    );

    thumbnailRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [images, loadedImages, criticalCount, rootMargin, threshold]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const isImageLoaded = useCallback((image: string, index: number) => {
    const isCritical = index < criticalCount;
    return isCritical || loadedImages.has(image);
  }, [loadedImages, criticalCount]);

  const setThumbnailRef = useCallback((index: number) => (el: HTMLButtonElement | null) => {
    const isCritical = index < criticalCount;
    if (!isCritical) {
      thumbnailRefs.current[index] = el;
    }
  }, [criticalCount]);

  return {
    loadedImages,
    imageLoading,
    handleImageLoad,
    isImageLoaded,
    setThumbnailRef,
    setImageLoading
  };
} 