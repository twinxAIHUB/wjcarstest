'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Star, Calendar, MapPin, Settings, Users } from 'lucide-react';
import SimilarCars from '@/components/similar-cars';
import type { Vehicle } from '@/types/vehicle';

interface VehicleDetailsProps {
  id: string;
}

// Preload critical images
const preloadImage = (src: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

export default function VehicleDetails({ id }: VehicleDetailsProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Refs for intersection observer
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Memoize vehicle data to prevent unnecessary re-renders
  const vehicleData = useMemo(() => vehicle, [vehicle]);

  // Preload critical images when vehicle data is available
  useEffect(() => {
    if (vehicle?.images && vehicle.images.length > 0) {
      // Preload the first 2 images (main image and first thumbnail)
      const criticalImages = vehicle.images.slice(0, 2);
      criticalImages.forEach(preloadImage);
    }
  }, [vehicle?.images]);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, 'vehicles', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const vehicleData = { id: docSnap.id, ...docSnap.data() } as Vehicle;
          setVehicle(vehicleData);
          // Set the first image as selected, or highlight image if available
          const initialImage = vehicleData.highlightImage || vehicleData.images?.[0] || '';
          setSelectedImage(initialImage);
          
          // Preload the initial image immediately
          if (initialImage) {
            preloadImage(initialImage);
          }
        } else {
          toast.error('Vehicle not found');
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        toast.error('Error loading vehicle details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  // Intersection observer for lazy loading thumbnails
  useEffect(() => {
    if (!vehicle?.images || vehicle.images.length <= 2) return;

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
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1
      }
    );

    thumbnailRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [vehicle?.images, loadedImages]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your message has been sent! We will contact you shortly.');
    setContactForm({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleThumbnailClick = useCallback((image: string) => {
    setSelectedImage(image);
    setImageLoading(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Vehicle Not Found</h1>
          <p className="text-gray-600 mb-6">The vehicle you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/cars">Back to Listings</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/cars" className="hover:text-indigo-600 transition-colors">Cars</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{vehicle.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column - Images */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-6 bg-gray-100">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}
            <Image
              src={selectedImage || '/placeholder.svg'}
              alt={vehicle.name}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              priority
              onLoad={handleImageLoad}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            {vehicle.featured && (
              <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {vehicle.images && vehicle.images.length > 1 && (
            <div className="grid grid-cols-5 gap-3 mb-8">
              {vehicle.images.map((image, index) => {
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
                    onClick={() => handleThumbnailClick(image)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                      selectedImage === image 
                        ? 'ring-2 ring-indigo-500 scale-95'
                        : 'hover:ring-2 hover:ring-indigo-300 hover:scale-105'
                    }`}
                  >
                    {isLoaded ? (
                      <Image
                        src={image}
                        alt={`${vehicle.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 20vw, 10vw"
                        loading={isCritical ? 'eager' : 'lazy'}
                        quality={75}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Key Details Section */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h1 className="text-3xl font-bold mb-3 text-gray-900">{vehicle.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-bold text-green-600">
                ${vehicle.price.toLocaleString()}
              </div>
              {vehicle.rating && (
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{vehicle.rating}</span>
                </div>
              )}
            </div>

            {/* Vehicle Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <div className="text-sm text-gray-500 mb-1">Mileage</div>
                <div className="font-semibold text-gray-900">{vehicle.mileage.toLocaleString()} miles</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="text-sm text-gray-500 mb-1">Year</div>
                <div className="font-semibold text-gray-900">{vehicle.year}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Settings className="h-5 w-5 text-gray-400" />
                </div>
                <div className="text-sm text-gray-500 mb-1">Body Style</div>
                <div className="font-semibold text-gray-900">{vehicle.bodyStyle}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <div className="text-sm text-gray-500 mb-1">Transmission</div>
                <div className="font-semibold text-gray-900">{vehicle.transmission}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm sticky top-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Contact Seller</h2>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="rounded-lg"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="rounded-lg"
                />
              </div>
              <div>
                <Input
                  type="tel"
                  placeholder="Your Phone"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  className="rounded-lg"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  required
                  rows={4}
                  className="rounded-lg"
                />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-green-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-white data-[state=active]:text-green-600">
            Features
          </TabsTrigger>
          <TabsTrigger value="specifications" className="data-[state=active]:bg-white data-[state=active]:text-green-600">
            Specifications
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-green-600">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{vehicle.overview}</p>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Detailed Description</h3>
              <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicle.features?.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="specifications">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg mb-4">Engine & Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Engine</span>
                    <span className="font-medium">{vehicle.specifications.engine}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Horsepower</span>
                    <span className="font-medium">{vehicle.specifications.horsepower} hp</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Torque</span>
                    <span className="font-medium">{vehicle.specifications.torque}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg mb-4">Transmission & Drivetrain</h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Transmission</span>
                    <span className="font-medium">{vehicle.specifications.transmission}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Drivetrain</span>
                    <span className="font-medium">{vehicle.specifications.drivetrain}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg mb-4">Dimensions & Capacity</h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Seating Capacity</span>
                    <span className="font-medium">{vehicle.specifications.seatingCapacity} seats</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Cargo Space</span>
                    <span className="font-medium">{vehicle.specifications.cargoSpace} cu.ft.</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Curb Weight</span>
                    <span className="font-medium">{vehicle.specifications.curbWeight} lbs</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg mb-4">Fuel & Efficiency</h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Fuel Tank</span>
                    <span className="font-medium">{vehicle.specifications.fuelTank} gallons</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Body Style</span>
                    <span className="font-medium">{vehicle.specifications.bodyStyle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-lg mb-4">Title Information</h4>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-3 w-3 rounded-full ${
                    vehicle.history.title === 'clean' ? 'bg-green-500' :
                    vehicle.history.title === 'rebuilt' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="capitalize font-medium">{vehicle.history.title} Title</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {vehicle.history.title === 'clean' ? 'This vehicle has a clean title with no reported accidents or damage.' :
                   vehicle.history.title === 'rebuilt' ? 'This vehicle has been rebuilt after significant damage and has passed inspection.' :
                   'This vehicle has been declared salvage due to significant damage.'}
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-lg mb-4">Ownership History</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-green-600">{vehicle.history.previousOwners}</span>
                  <span className="text-gray-600">Previous {vehicle.history.previousOwners === 1 ? 'Owner' : 'Owners'}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Last service performed on {new Date(vehicle.history.lastService).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold text-lg mb-4">Service History</h4>
              <div className="space-y-4">
                {vehicle.history.serviceRecords?.map((record, index) => (
                  <div key={index} className="flex gap-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 whitespace-nowrap">
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{record.type}</div>
                      <div className="text-gray-600 mt-1">{record.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Separator className="my-12" />

      <SimilarCars currentCarId={vehicle.id} />
    </div>
  );
} 