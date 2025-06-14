'use client';

import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import VehicleTable from './components/VehicleTable';
import VehicleForm from './components/VehicleForm';
import { toast } from 'sonner';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Vehicle {
  id: string;
  name: string;
  year: number;
  price: number;
  status: 'available' | 'sold' | 'pending';
  featured: boolean;
  imageUrl: string;
  mileage: number;
  transmission: string;
  rating: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function VehiclesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Auth State:', {
      user: user ? {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
      } : null,
      loading,
      isAuthenticated: !!user
    });

    if (!loading && !user) {
      console.log('No user found, redirecting to login...');
      router.push('/admin/login');
      return;
    }
    
    if (user) {
      console.log('User authenticated, fetching vehicles...');
      fetchVehicles();
    }
  }, [user, loading, router]);

  const fetchVehicles = async () => {
    try {
      console.log('Starting to fetch vehicles...');
      const vehiclesRef = collection(db, 'vehicles');
      const q = query(vehiclesRef, orderBy('createdAt', 'desc'));
      
      console.log('Current user token:', await auth.currentUser?.getIdToken());
      
      const snapshot = await getDocs(q);
      
      const vehiclesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Vehicle[];
      
      console.log('Vehicles fetched successfully:', vehiclesData.length);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Error loading vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'vehicles'), {
        ...vehicleData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newVehicle = {
        id: docRef.id,
        ...vehicleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setVehicles(prev => [newVehicle, ...prev]);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  };

  const handleUpdateVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedVehicle) return;

    try {
      const vehicleRef = doc(db, 'vehicles', selectedVehicle.id);
      await updateDoc(vehicleRef, {
        ...vehicleData,
        updatedAt: serverTimestamp(),
      });

      const updatedVehicle = {
        ...vehicleData,
        id: selectedVehicle.id,
        createdAt: selectedVehicle.createdAt,
        updatedAt: new Date(),
      };

      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === selectedVehicle.id ? updatedVehicle : vehicle
        )
      );
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      const vehicleRef = doc(db, 'vehicles', vehicleId);
      
      await deleteDoc(vehicleRef);
      
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
      
      toast.success('Vehicle deleted successfully');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle. Please try again.');
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedVehicle) {
      await handleUpdateVehicle(vehicleData);
    } else {
      await handleAddVehicle(vehicleData);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedVehicle(undefined);
  };

  const tabs = [
    { name: 'All Vehicles', filter: () => true },
    { name: 'Available', filter: (v: Vehicle) => v.status === 'available' },
    { name: 'Sold', filter: (v: Vehicle) => v.status === 'sold' },
    { name: 'Pending', filter: (v: Vehicle) => v.status === 'pending' },
    { name: 'Featured', filter: (v: Vehicle) => v.featured },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Vehicles</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your vehicle inventory, update details, and track status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Vehicle
          </button>
        </div>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="mt-6 flex space-x-6 border-b border-gray-200">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `border-b-2 py-4 px-1 text-sm font-medium ${
                  selected
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-4">
          {tabs.map((tab, index) => (
            <Tab.Panel key={index} className="focus:outline-none">
              <VehicleTable
                vehicles={vehicles.filter(tab.filter)}
                onEdit={handleEditVehicle}
                onDelete={handleDeleteVehicle}
                isLoading={isLoading}
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      <VehicleForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        vehicle={selectedVehicle}
      />
    </div>
  );
} 