'use client';
import { Metadata } from 'next';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Auth state in login page:', { user, loading });
    if (!loading && user) {
      router.replace('/admin/vehicles');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (user) {
    router.replace('/admin/vehicles');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use your @admin.com email to access the admin panel
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}