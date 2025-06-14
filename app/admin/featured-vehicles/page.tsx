export const dynamic = 'force-dynamic';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import FeaturedVehiclesList from '@/components/admin/FeaturedVehiclesList';

async function getFeaturedVehicles() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: vehicles, error } = await supabase
    .from('featured_vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured vehicles:', error);
    return [];
  }

  return vehicles;
}

export default async function FeaturedVehiclesPage() {
  const vehicles = await getFeaturedVehicles();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Featured Vehicles</h1>
        <a
          href="/admin/featured-vehicles/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add New Vehicle
        </a>
      </div>
      
      <FeaturedVehiclesList vehicles={vehicles} />
    </div>
  );
} 