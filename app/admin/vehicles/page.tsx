'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tab } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, getDoc, limit, startAfter } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import VehicleTable from './components/VehicleTable';
import VehicleForm from './components/VehicleForm';
import { toast } from 'sonner';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { Vehicle } from '@/types/vehicle';
import * as XLSX from 'xlsx';

const VEHICLES_PER_PAGE = 20;

export default function VehiclesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ success: number; failed: number; errors: string[] }>({ success: 0, failed: 0, errors: [] });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
      return;
    }
    // TEMPORARY: Allow access even if email is not verified
    // if (user && !user.emailVerified) {
    //   toast.error('Please verify your email to access the admin panel.');
    //   router.push('/admin/login');
    //   return;
    // }
    if (user) {
      fetchVehicles();
    }
  }, [user, loading, router]);

  const fetchVehicles = useCallback(async (loadMore = false) => {
    try {
      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const vehiclesRef = collection(db, 'vehicles');
      let q = query(vehiclesRef, orderBy('createdAt', 'desc'), limit(VEHICLES_PER_PAGE));
      
      if (loadMore && lastDoc) {
        q = query(vehiclesRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(VEHICLES_PER_PAGE));
      }
      
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
      
      if (loadMore) {
        setVehicles(prev => [...prev, ...vehiclesData]);
      } else {
        setVehicles(vehiclesData);
      }
      
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === VEHICLES_PER_PAGE);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Error loading vehicles');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [lastDoc]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchVehicles(true);
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
      toast.success('Vehicle added successfully');
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  };

  const handleUpdateVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedVehicle) return;

    try {
      const vehicleRef = doc(db, 'vehicles', selectedVehicle.id);
      const docSnap = await getDoc(vehicleRef);
      if (!docSnap.exists()) {
        toast.error('Vehicle does not exist in the database.');
        return;
      }
      await updateDoc(vehicleRef, {
        ...vehicleData,
        updatedAt: serverTimestamp(),
      });

      const updatedVehicle = {
        ...vehicleData,
        id: selectedVehicle.id,
        createdAt: selectedVehicle.createdAt || new Date(),
        updatedAt: new Date(),
      } as Vehicle;

      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === selectedVehicle.id ? updatedVehicle : vehicle
        )
      );
      toast.success('Vehicle updated successfully');
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
    try {
      if (selectedVehicle) {
        await handleUpdateVehicle(vehicleData);
      } else {
        await handleAddVehicle(vehicleData);
      }
    } catch (error) {
      toast.error('Error saving vehicle. Please try again.');
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

  const filteredVehicles = vehicles.filter(tabs[selectedTab].filter);

  // Bulk upload handler
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkUploading(true);
    setBulkResult({ success: 0, failed: 0, errors: [] });
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      let success = 0;
      let failed = 0;
      let errors: string[] = [];
      for (const [i, row] of (rows as any[]).entries()) {
        try {
          // Map Excel columns to vehicle fields
          const vehicleData = {
            name: row['Name'] || '',
            year: Number(row['Year']) || 0,
            price: Number(row['Price']) || 0,
            status: row['Status'] || 'available',
            featured: row['Featured'] === 'Yes' || row['Featured'] === true,
            imageUrl: row['Image URL'] || '',
            mileage: Number(row['Mileage']) || 0,
            transmission: row['Transmission'] || '',
            rating: Number(row['Rating']) || 5,
            brand: row['Brand'] || '',
            bodyStyle: row['Body Style'] || '',
            fuelType: row['Fuel Type'] || '',
            overview: row['Overview'] || '',
            features: row['Features'] ? String(row['Features']).split(',').map((f: string) => f.trim()) : [],
            specifications: {},
            history: {},
            images: row['Images'] ? String(row['Images']).split(',').map((f: string) => f.trim()) : [],
            highlightImage: row['Highlight Image'] || '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await addDoc(collection(db, 'vehicles'), vehicleData);
          success++;
        } catch (err: any) {
          failed++;
          errors.push(`Row ${i + 2}: ${err.message || err}`);
        }
      }
      setBulkResult({ success, failed, errors });
      if (success > 0) fetchVehicles();
      toast.success(`Bulk upload complete: ${success} succeeded, ${failed} failed.`);
    } catch (err: any) {
      toast.error('Failed to process file.');
      setBulkResult({ success: 0, failed: 0, errors: [err.message || String(err)] });
    } finally {
      setBulkUploading(false);
    }
  };

  // Download template
  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        'Name': 'Sample Car',
        'Year': 2022,
        'Price': 25000,
        'Status': 'available',
        'Featured': 'Yes',
        'Image URL': '',
        'Mileage': 10000,
        'Transmission': 'Automatic',
        'Rating': 5,
        'Brand': 'Toyota',
        'Body Style': 'SUV',
        'Fuel Type': 'Gasoline',
        'Overview': 'A great car.',
        'Features': 'Bluetooth,Backup Camera',
        'Images': '',
        'Highlight Image': '',
      },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vehicles');
    XLSX.writeFile(wb, 'vehicle-upload-template.xlsx');
  };

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
          <p className="mt-3 text-lg text-gray-700">
            Manage your vehicle inventory, update details, and track status.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Showing {filteredVehicles.length} vehicles
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Vehicle
            </button>
            <button
              type="button"
              onClick={() => setIsBulkModalOpen(true)}
              className="inline-flex items-center justify-center rounded-lg border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Bulk Upload
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 bg-gray-100 p-2">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `w-full rounded-lg py-3 px-4 text-sm font-medium leading-5 transition-all duration-200
                  ${selected
                    ? 'bg-white text-indigo-700 shadow-md'
                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
                }`
              }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="p-6">
            {tabs.map((tab, index) => (
              <Tab.Panel key={index} className="focus:outline-none">
                <VehicleTable
                  vehicles={filteredVehicles}
                  onEdit={handleEditVehicle}
                  onDelete={handleDeleteVehicle}
                  isLoading={isLoading}
                />
                {hasMore && !isLoading && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      {isLoadingMore ? 'Loading...' : 'Load More Vehicles'}
                    </button>
                  </div>
                )}
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

      {/* Bulk Upload Modal/Section */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setIsBulkModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Bulk Upload Vehicles</h2>
            <p className="text-gray-500 mb-4 text-sm">Upload an Excel (.xlsx) or CSV file. <button className="text-indigo-600 underline ml-1" onClick={handleDownloadTemplate}>Download template</button></p>
            <input
              type="file"
              accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
              onChange={handleBulkUpload}
              disabled={bulkUploading}
              className="mb-4"
            />
            {bulkUploading && <div className="text-sm text-gray-500 mb-2">Uploading...</div>}
            {(bulkResult.success > 0 || bulkResult.failed > 0) && (
              <div className="mb-2 text-sm">
                <span className="text-green-600">{bulkResult.success} succeeded</span>,{' '}
                <span className="text-red-600">{bulkResult.failed} failed</span>
              </div>
            )}
            {bulkResult.errors.length > 0 && (
              <div className="max-h-32 overflow-y-auto text-xs text-red-500 bg-red-50 rounded p-2 mt-2">
                {bulkResult.errors.map((err, i) => <div key={i}>{err}</div>)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 