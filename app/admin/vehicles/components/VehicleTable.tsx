import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Vehicle } from '@/types/vehicle';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function VehicleTable({ vehicles, onEdit, onDelete, isLoading = false }: VehicleTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">No vehicles found</p>
        <p className="text-gray-400 text-sm mt-2">Add your first vehicle to get started</p>
      </div>
    );
  }

  // Remove duplicate vehicles by id
  const uniqueVehicles = Array.from(new Map(vehicles.map(v => [v.id, v])).values());

  return (
    <div className="mt-6 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-xl ring-1 ring-black ring-opacity-5 sm:rounded-xl">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <tr>
                  <th scope="col" className="py-4 pl-6 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                    Image
                  </th>
                  <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-white">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-white">
                    Year
                  </th>
                  <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-white">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-white">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-white">
                    Featured
                  </th>
                  <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-white">
                    Last Updated
                  </th>
                  <th scope="col" className="relative py-4 pl-3 pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {uniqueVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap py-6 pl-6 pr-3 sm:pl-6">
                      {vehicle.imageUrl ? (
                        <img
                          src={vehicle.imageUrl}
                          alt={vehicle.name}
                          className="h-16 w-20 object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="h-16 w-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-6 text-sm">
                      <div className="text-gray-900 font-medium">{vehicle.name}</div>
                      <div className="text-gray-500 text-xs">{vehicle.bodyStyle}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-6 text-sm text-gray-900 font-medium">
                      {vehicle.year}
                    </td>
                    <td className="whitespace-nowrap px-4 py-6 text-sm">
                      <div className="text-gray-900 font-semibold">${vehicle.price.toLocaleString()}</div>
                      <div className="text-gray-500 text-xs">{vehicle.mileage.toLocaleString()} miles</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-6 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 ${
                          vehicle.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : vehicle.status === 'sold'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-6 text-sm">
                      {vehicle.featured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Featured
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">No</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-6 text-sm text-gray-500">
                      {vehicle.updatedAt ? vehicle.updatedAt.toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="relative whitespace-nowrap py-6 pl-3 pr-6 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => onEdit(vehicle)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors p-2 rounded-lg hover:bg-indigo-50"
                          title="Edit vehicle"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onDelete(vehicle.id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-2 rounded-lg hover:bg-red-50"
                          title="Delete vehicle"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 