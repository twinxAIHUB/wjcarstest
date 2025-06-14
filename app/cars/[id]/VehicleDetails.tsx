'use client';

import { useEffect, useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import SimilarCars from '@/components/similar-cars';
import { Star } from 'lucide-react';
import type { Vehicle } from '@/types/vehicle';

interface VehicleDetailsProps {
  id: string;
}

export default function VehicleDetails({ id }: VehicleDetailsProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const docRef = doc(db, 'vehicles', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const vehicleData = { id: docSnap.id, ...docSnap.data() } as Vehicle;
          setVehicle(vehicleData);
          setSelectedImage(vehicleData.images[0]);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
        <Button asChild>
          <Link href="/cars">Back to Listings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/cars">Cars</Link>
        <span>/</span>
        <span className="text-gray-900">{vehicle.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column - Images */}
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-4">
            <Image
              src={selectedImage}
              alt={vehicle.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-5 gap-4">
            {vehicle.images?.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                  selectedImage === image 
                    ? 'ring-2 ring-green-500 scale-95'
                    : 'hover:ring-2 hover:ring-green-500/50'
                }`}
              >
                <Image
                  src={image}
                  alt={`${vehicle.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Key Details Section */}
          <div className="mt-8">
            <h1 className="text-3xl font-bold mb-2">{vehicle.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-2xl font-bold text-green-600">
                ${vehicle.price.toLocaleString()}
              </div>
              {vehicle.rating && (
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{vehicle.rating}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-500 mb-1">Mileage</div>
                <div className="font-semibold">{vehicle.mileage.toLocaleString()} miles</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-500 mb-1">Year</div>
                <div className="font-semibold">{vehicle.year}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-500 mb-1">Body Style</div>
                <div className="font-semibold">{vehicle.bodyStyle}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-500 mb-1">Transmission</div>
                <div className="font-semibold">{vehicle.transmission}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 border">
            <h2 className="text-2xl font-bold mb-6">Contact Seller</h2>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Input
                  type="tel"
                  placeholder="Your Phone"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  required
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full">
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