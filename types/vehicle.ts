export interface Vehicle {
  id: string;
  name: string;
  year: number;
  price: number;
  status: 'available' | 'sold' | 'pending';
  featured: boolean;
  imageUrl: string;
  images: string[];
  highlightImage: string;
  mileage: number;
  transmission: string;
  rating: number;
  description: string;
  brand: string;
  bodyStyle: string;
  fuelType: string;
  overview: string;
  features: string[];
  specifications: {
    engine: string;
    horsepower: number;
    torque: string;
    transmission: string;
    drivetrain: string;
    bodyStyle: string;
    seatingCapacity: number;
    fuelTank: number;
    cargoSpace: number;
    curbWeight: number;
  };
  history: {
    title: 'clean' | 'salvage' | 'rebuilt';
    previousOwners: number;
    serviceRecords: {
      type: string;
      date: string;
      description: string;
    }[];
    lastService: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  model?: string;
  engineSize?: string;
} 