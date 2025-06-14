import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const vehicles = [
  {
    name: '2023 Mercedes-Benz AMG GT',
    year: 2023,
    price: 118950,
    status: 'available',
    featured: true,
    imageUrl: '/vehicles/mercedes-amg-gt.jpg',
    mileage: 1250,
    transmission: '9-Speed Automatic',
    rating: 4.9,
    description: 'Certified Pre-Owned AMG GT with premium features and exhilarating performance'
  },
  {
    name: '2022 Rolls-Royce Phantom',
    year: 2022,
    price: 535000,
    status: 'available',
    featured: true,
    imageUrl: '/vehicles/rolls-royce-phantom.jpg',
    mileage: 3200,
    transmission: '8-Speed Automatic',
    rating: 5.0,
    description: 'The pinnacle of luxury with bespoke features and unparalleled comfort'
  },
  {
    name: '2024 Rolls-Royce Spectre',
    year: 2024,
    price: 420000,
    status: 'available',
    featured: true,
    imageUrl: '/vehicles/rolls-royce-spectre.jpg',
    mileage: 150,
    transmission: 'Single-Speed Automatic',
    rating: 4.9,
    description: 'Rolls-Royce\'s first fully-electric ultra-luxury coupe with bespoke features'
  },
  {
    name: '2023 Lexus LC 500',
    year: 2023,
    price: 105000,
    status: 'available',
    featured: false,
    imageUrl: '/vehicles/lexus-lc-500.jpg',
    mileage: 2800,
    transmission: '10-Speed Direct-Shift',
    rating: 4.8,
    description: 'Limited edition LC 500 with exclusive Structural Blue paint and premium features'
  },
  {
    name: '2023 Audi A8',
    year: 2023,
    price: 98500,
    status: 'available',
    featured: false,
    imageUrl: '/vehicles/audi-a8.jpg',
    mileage: 5600,
    transmission: '8-Speed Tiptronic',
    rating: 4.7,
    description: 'Flagship luxury sedan with executive features and advanced technology'
  },
  {
    name: '2023 Mercedes-Benz S-Class',
    year: 2023,
    price: 125000,
    status: 'available',
    featured: true,
    imageUrl: '/vehicles/mercedes-s-class.jpg',
    mileage: 4200,
    transmission: '9-Speed Automatic',
    rating: 4.9,
    description: 'Flagship luxury sedan with cutting-edge technology and supreme comfort'
  }
];

async function seedVehicles() {
  try {
    console.log('Starting to seed vehicles...');
    
    const vehiclesCollection = collection(db, 'vehicles');
    
    for (const vehicle of vehicles) {
      await addDoc(vehiclesCollection, {
        ...vehicle,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Added vehicle: ${vehicle.name}`);
    }
    
    console.log('Successfully seeded all vehicles!');
  } catch (error) {
    console.error('Error seeding vehicles:', error);
  }
}

// Only run if this file is being executed directly
if (require.main === module) {
  seedVehicles();
} 