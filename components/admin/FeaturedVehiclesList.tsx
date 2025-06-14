'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FeaturedVehicle {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
}

interface Props {
  vehicles: FeaturedVehicle[];
}

export default function FeaturedVehiclesList({ vehicles: initialVehicles }: Props) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this vehicle from featured listings?')) {
      return;
    }

    const { error } = await supabase
      .from('featured_vehicles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete vehicle');
      return;
    }

    setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Added
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {vehicle.image_url && (
                  <img
                    src={vehicle.image_url}
                    alt={vehicle.title}
                    className="h-16 w-24 object-cover rounded"
                  />
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{vehicle.title}</div>
                <div className="text-sm text-gray-500">{vehicle.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  ${vehicle.price.toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(vehicle.created_at).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => router.push(`/admin/featured-vehicles/${vehicle.id}/edit`)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
          {vehicles.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                No featured vehicles found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 