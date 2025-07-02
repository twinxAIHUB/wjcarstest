import { Suspense } from 'react';
import VehicleDetails from './VehicleDetails';
import { Loader2 } from 'lucide-react';
import { cars } from "@/lib/data";
import type { Metadata } from "next";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let car = cars.find((car) => car.id === params.id)

  // If not found in static array, try Firestore
  if (!car) {
    try {
      const docRef = doc(db, "vehicles", params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        car = { id: docSnap.id, ...docSnap.data() } as any;
      }
    } catch (e) {
      // ignore
    }
  }

  if (!car) {
    return {
      title: "Car Not Found | Wise",
      description: "The requested vehicle could not be found in our inventory.",
    }
  }

  return {
    title: `${car.year} ${car.make} ${car.model} ${car.trim} | Wise`,
    description: `Explore the ${car.year} ${car.make} ${car.model} ${car.trim} at Wise. ${car.shortDescription || car.description || ''} Schedule a test drive today.`,
    keywords: `${car.make}, ${car.model}, ${car.year} ${car.make}, luxury car, ${car.bodyStyle}, ${car.condition}, test drive, Wise`,
    openGraph: {
      title: `${car.year} ${car.make} ${car.model} ${car.trim} | Wise`,
      description: car.shortDescription || car.description || '',
      type: "website",
      url: `https://wjcarsales.com/cars/${car.id}`,
      images: [
        {
          url: car.images && car.images.length > 0 ? car.images[0] : `https://wjcarsales.com/api/og?id=${car.id}`,
          width: 1200,
          height: 630,
          alt: `${car.year} ${car.make} ${car.model} ${car.trim}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${car.year} ${car.make} ${car.model} ${car.trim} | Wise`,
      description: car.shortDescription || car.description || '',
      images: [car.images && car.images.length > 0 ? car.images[0] : `https://wjcarsales.com/api/og?id=${car.id}`],
    },
  }
}

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <VehicleDetails id={params.id} />
    </Suspense>
  );
}

