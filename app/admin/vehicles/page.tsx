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
import type { Vehicle } from '@/types/vehicle';

export default function VehiclesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
      return;
    }
    
    if (user) {
      fetchVehicles();
    }
  }, [user, loading, router]);

  const fetchVehicles = async () => {
    try {
      const vehiclesRef = collection(db, 'vehicles');
      const q = query(vehiclesRef, orderBy('createdAt', 'desc'));
      
      const snapshot = await getDocs(q);
      
      const vehiclesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          images: data.images || [],
          highlightImage: data.highlightImage || data.imageUrl || '',
          brand: data.brand || '',
          bodyStyle: data.bodyStyle || '',
          fuelType: data.fuelType || '',
          overview: data.overview || '',
          features: data.features || [],
          specifications: data.specifications || {
            engine: '',
            horsepower: 0,
            torque: '',
            transmission: '',
            drivetrain: '',
            bodyStyle: '',
            seatingCapacity: 0,
            fuelTank: 0,
            cargoSpace: 0,
            curbWeight: 0
          },
          history: data.history || {
            title: 'clean',
            previousOwners: 0,
            serviceRecords: [],
            lastService: ''
          },
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Vehicle;
      });
      
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
      } as Vehicle;

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
      
      // Log the incoming data
      console.log('Updating vehicle with data:', {
        currentImages: selectedVehicle.images,
        newImages: vehicleData.images,
        removedImages: selectedVehicle.images.filter(img => !vehicleData.images.includes(img))
      });

      // Create the update data with explicit image array
      const updateData = {
        ...vehicleData,
        images: vehicleData.images, // Explicitly set the images array
        updatedAt: serverTimestamp(),
      };

      // Update the document
      await updateDoc(vehicleRef, updateData);

      // Create the updated vehicle object
      const updatedVehicle = {
        ...vehicleData,
        id: selectedVehicle.id,
        createdAt: selectedVehicle.createdAt || new Date(),
        updatedAt: new Date(),
      } as Vehicle;

      // Update the local state
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === selectedVehicle.id ? updatedVehicle : vehicle
        )
      );

      // Close the form and clear selection
      setIsFormOpen(false);
      setSelectedVehicle(undefined);
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

      <div className="mt-8">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${selected
                    ? 'bg-white text-indigo-700 shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
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
      </div>

      <VehicleForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        vehicle={selectedVehicle}
      />
    </div>
  );
} 