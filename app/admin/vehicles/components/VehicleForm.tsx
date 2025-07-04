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
        <Dialog.Panel className="mx-auto max-w-5xl rounded-xl bg-white p-8 w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold text-gray-900">
              {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                    placeholder="Enter vehicle name"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                    placeholder="Enter year"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                    placeholder="Enter mileage"
                  />
                </div>

                <div>
                  <label htmlFor="bodyStyle" className="block text-sm font-medium text-gray-700 mb-2">
                    Body Style
                  </label>
                  <select
                    id="bodyStyle"
                    name="bodyStyle"
                    value={formData.bodyStyle}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                  >
                    <option value="">Select Body Style</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Coupe">Coupe</option>
                    <option value="SUV">SUV</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Wagon">Wagon</option>
                    <option value="Pick-up">Pick-up</option>
                    <option value="Van">Van</option>
                    <option value="Offroad">Offroad</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Type
                  </label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-3 block text-sm text-gray-900">
                  Feature this vehicle on the homepage
                </label>
              </div>

              <div className="mt-6">
                <label htmlFor="overview" className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Overview
                </label>
                <textarea
                  id="overview"
                  name="overview"
                  value={formData.overview}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                  placeholder="Provide a brief overview of the vehicle..."
                />
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Vehicle Images</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-3 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100 transition-colors"
                />
              </div>
              
              {previewUrls.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Highlight Image
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200
                          ${index === highlightImageIndex ? 'border-indigo-500 shadow-lg' : 'border-gray-200 hover:border-indigo-300'}`}
                        onClick={() => handleHighlightImageChange(index)}
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover"
                        />
                        {index === highlightImageIndex && (
                          <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded-lg">
                            Main
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); handleRemoveImage(index); }}
                          className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
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
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Features</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature"
                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleFeatureAdd}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
                
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                      <span className="text-gray-700">{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleFeatureRemove(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="specifications.engine" className="block text-sm font-medium text-gray-700 mb-2">
                    Engine
                  </label>
                  <input
                    type="text"
                    id="specifications.engine"
                    name="specifications.engine"
                    value={formData.specifications.engine}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="specifications.horsepower" className="block text-sm font-medium text-gray-700 mb-2">
                    Horsepower
                  </label>
                  <input
                    type="number"
                    id="specifications.horsepower"
                    name="specifications.horsepower"
                    value={formData.specifications.horsepower}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="specifications.torque" className="block text-sm font-medium text-gray-700 mb-2">
                    Torque
                  </label>
                  <input
                    type="text"
                    id="specifications.torque"
                    name="specifications.torque"
                    value={formData.specifications.torque}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="specifications.seatingCapacity" className="block text-sm font-medium text-gray-700 mb-2">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    id="specifications.seatingCapacity"
                    name="specifications.seatingCapacity"
                    value={formData.specifications.seatingCapacity}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle History Section */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Vehicle History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="history.title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title Status
                  </label>
                  <select
                    id="history.title"
                    name="history.title"
                    value={formData.history.title}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                  >
                    <option value="clean">Clean</option>
                    <option value="salvage">Salvage</option>
                    <option value="rebuilt">Rebuilt</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="history.previousOwners" className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Owners
                  </label>
                  <input
                    type="number"
                    id="history.previousOwners"
                    name="history.previousOwners"
                    value={formData.history.previousOwners}
                    onChange={handleChange}
                    min="0"
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="history.lastService" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Service Date
                  </label>
                  <input
                    type="date"
                    id="history.lastService"
                    name="history.lastService"
                    value={formData.history.lastService ? formData.history.lastService.split('T')[0] : ''}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="rounded-lg border border-transparent bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
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