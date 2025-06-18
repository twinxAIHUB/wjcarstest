'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FirebaseApp } from 'firebase/app';
import { app } from '@/lib/firebase';
import { toast } from 'sonner';
import { useAuth } from '@/lib/contexts/AuthContext';

const storage = getStorage(app as FirebaseApp);

interface Vehicle {
  id: string;
  name: string;
  year: number;
  price: number;
  status: 'available' | 'sold' | 'pending';
  featured: boolean;
  imageUrl: string;
  images: string[];  // Array of image URLs
  highlightImage: string;  // Main display image
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
}

interface VehicleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  vehicle?: Vehicle;
}

export default function VehicleForm({ isOpen, onClose, onSubmit, vehicle }: VehicleFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>({
    name: '',
    year: new Date().getFullYear(),
    price: 0,
    status: 'available',
    featured: false,
    imageUrl: '',
    images: [],
    highlightImage: '',
    mileage: 0,
    transmission: 'automatic',
    rating: 5,
    description: '',
    brand: '',
    bodyStyle: '',
    fuelType: '',
    overview: '',
    features: [],
    specifications: {
      engine: '',
      horsepower: 0,
      torque: '',
      transmission: '',
      drivetrain: '',
      bodyStyle: '',
      seatingCapacity: 0,
      fuelTank: 0,
      cargoSpace: 0,
      curbWeight: 0,
    },
    history: {
      title: 'clean',
      previousOwners: 0,
      serviceRecords: [],
      lastService: new Date().toISOString(),
    },
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [highlightImageIndex, setHighlightImageIndex] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (vehicle) {
      setFormData({
        ...vehicle,
        images: vehicle.images || [],
        highlightImage: vehicle.highlightImage || vehicle.imageUrl,
      });
      setFeatures(vehicle.features || []);
      setPreviewUrls(vehicle.images || []);
      setSelectedImages([]);
      setHighlightImageIndex(0);
    }
  }, [vehicle]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (formData.images.length + files.length > 10) {
        toast.error('You can upload a maximum of 10 images.');
        return;
      }
      setSelectedImages(prev => [...prev, ...files]);
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newPreviewUrls],
      }));
    }
  };

  const handleHighlightImageChange = (index: number) => {
    setHighlightImageIndex(index);
    const newFormData = { ...formData };
    newFormData.highlightImage = previewUrls[index];
    setFormData(newFormData);
  };

  const handleFeatureAdd = () => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleFeatureRemove = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedImages(prev => {
      if (previewUrls[index]?.startsWith('blob:')) {
        const previewIndex = previewUrls.slice(0, index + 1).filter(url => url.startsWith('blob:')).length - 1;
        return prev.filter((_, i) => i !== previewIndex);
      }
      return prev;
    });
    setHighlightImageIndex(prev => {
      if (index === prev && prev > 0) return prev - 1;
      if (index < prev) return prev - 1;
      return prev;
    });
  };

  const uploadImages = async () => {
    if (!selectedImages.length || !user) {
      return formData.images.filter(url => !url.startsWith('blob:'));
    }
    const uploadedUrls: string[] = [];
    try {
      for (const image of selectedImages) {
        const fileName = `${Date.now()}_${image.name}`;
        const storageRef = ref(storage, `vehicles/${fileName}`);
        const snapshot = await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(downloadURL);
      }
      const finalImages = formData.images.map(url =>
        url.startsWith('blob:') ? uploadedUrls.shift()! : url
      );
      return finalImages;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to perform this action');
      return;
    }
    setIsUploading(true);

    try {
      const uploadedImageUrls = await uploadImages();
      const highlightImageUrl = uploadedImageUrls[highlightImageIndex] || formData.highlightImage;

      await onSubmit({
        ...formData,
        images: uploadedImageUrls,
        highlightImage: highlightImageUrl,
        imageUrl: highlightImageUrl,
        features,
      });
      
      toast.success(vehicle ? 'Vehicle updated successfully' : 'Vehicle added successfully');
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error saving vehicle. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const parentObj = prev[parent as keyof typeof prev] as Record<string, any>;
        return {
        ...prev,
        [parent]: {
            ...(parentObj || {}),
          [child]: type === 'number' ? Number(value) : value
        }
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl rounded bg-white p-6 w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-medium">
              {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter brand name"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
                    Miles
                  </label>
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter mileage"
                  />
                </div>
                <div>
                  <label htmlFor="bodyStyle" className="block text-sm font-medium text-gray-700">
                    Body Style
                  </label>
                  <select
                    id="bodyStyle"
                    name="bodyStyle"
                    value={formData.bodyStyle}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Body Style</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Coupe">Coupe</option>
                    <option value="SUV">SUV</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Wagon">Wagon</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Vehicle Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">
                    Fuel Type
                  </label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Feature this vehicle on the homepage
                </label>
              </div>

              <div className="mt-4">
                <label htmlFor="overview" className="block text-sm font-medium text-gray-700">
                  Vehicle Overview
                </label>
                <textarea
                  id="overview"
                  name="overview"
                  value={formData.overview}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Provide a brief overview of the vehicle..."
                />
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Vehicle Images</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
              </div>
              
              {previewUrls.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Highlight Image
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className={`relative cursor-pointer border-2 rounded-lg overflow-hidden
                          ${index === highlightImageIndex ? 'border-indigo-500' : 'border-gray-200'}`}
                        onClick={() => handleHighlightImageChange(index)}
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover"
                        />
                        {index === highlightImageIndex && (
                          <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded">
                            Main
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); handleRemoveImage(index); }}
                          className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                          title="Remove image"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Features</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleFeatureAdd}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md">
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleFeatureRemove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="specifications.engine" className="block text-sm font-medium text-gray-700">
                    Engine
                  </label>
                  <input
                    type="text"
                    id="specifications.engine"
                    name="specifications.engine"
                    value={formData.specifications.engine}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="specifications.horsepower" className="block text-sm font-medium text-gray-700">
                    Horsepower
                  </label>
                  <input
                    type="number"
                    id="specifications.horsepower"
                    name="specifications.horsepower"
                    value={formData.specifications.horsepower}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="specifications.torque" className="block text-sm font-medium text-gray-700">
                    Torque
                  </label>
                  <input
                    type="text"
                    id="specifications.torque"
                    name="specifications.torque"
                    value={formData.specifications.torque}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="specifications.seatingCapacity" className="block text-sm font-medium text-gray-700">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    id="specifications.seatingCapacity"
                    name="specifications.seatingCapacity"
                    value={formData.specifications.seatingCapacity}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle History Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Vehicle History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="history.title" className="block text-sm font-medium text-gray-700">
                    Title Status
                  </label>
                  <select
                    id="history.title"
                    name="history.title"
                    value={formData.history.title}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="clean">Clean</option>
                    <option value="salvage">Salvage</option>
                    <option value="rebuilt">Rebuilt</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="history.previousOwners" className="block text-sm font-medium text-gray-700">
                    Previous Owners
                  </label>
                  <input
                    type="number"
                    id="history.previousOwners"
                    name="history.previousOwners"
                    value={formData.history.previousOwners}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="history.lastService" className="block text-sm font-medium text-gray-700">
                    Last Service Date
                  </label>
                  <input
                    type="date"
                    id="history.lastService"
                    name="history.lastService"
                    value={formData.history.lastService.split('T')[0]}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isUploading ? 'Uploading...' : vehicle ? 'Save Changes' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 