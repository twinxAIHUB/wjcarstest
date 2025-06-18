'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Car, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-800">
      <div className="flex h-16 items-center justify-center">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        <Link
          href="/admin/vehicles"
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            isActive('/admin/vehicles')
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Car className="mr-3 h-5 w-5" />
          Vehicle Management
        </Link>
      </nav>
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={() => router.push('/admin/login')}
          className="flex w-full items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
} 