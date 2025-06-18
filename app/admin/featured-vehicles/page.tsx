export const dynamic = 'force-dynamic';

// Removed: import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// Removed all supabase usage. Refactor this page to use your preferred backend or static data.

async function getFeaturedVehicles() {
  // Removed: const supabase = createServerComponentClient({ cookies });
  
  // If you need to display vehicles, fetch them from your preferred backend or use static data.

  return [];
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