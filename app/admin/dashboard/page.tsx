'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Car,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

interface Vehicle {
  id: string;
  name: string;
  price: number;
  status: 'available' | 'sold' | 'pending';
  soldDate?: string;
  updatedAt: string;
}

interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  pendingVehicles: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeEnquiries: number;
}

interface RecentActivity {
  id: string;
  type: 'sale' | 'enquiry' | 'vehicle_added';
  description: string;
  timestamp: Date;
  status?: 'completed' | 'pending';
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    availableVehicles: 0,
    soldVehicles: 0,
    pendingVehicles: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeEnquiries: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || !user.email?.endsWith('@admin.com')) {
        router.push('/admin/login');
      }
    });

    fetchDashboardData();

    return () => unsubscribe();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch vehicles statistics
      const vehiclesRef = collection(db, 'vehicles');
      const vehiclesSnapshot = await getDocs(vehiclesRef);
      const vehicles = vehiclesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Vehicle[];

      // Calculate stats
      const totalVehicles = vehicles.length;
      const availableVehicles = vehicles.filter(v => v.status === 'available').length;
      const soldVehicles = vehicles.filter(v => v.status === 'sold').length;
      const pendingVehicles = vehicles.filter(v => v.status === 'pending').length;

      // Calculate revenue
      const totalRevenue = vehicles
        .filter(v => v.status === 'sold')
        .reduce((acc, v) => acc + (v.price || 0), 0);

      // Get monthly revenue (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthlyRevenue = vehicles
        .filter(v => v.status === 'sold' && v.soldDate && new Date(v.soldDate) >= thirtyDaysAgo)
        .reduce((acc, v) => acc + (v.price || 0), 0);

      // Fetch recent activity
      const recentActivityData: RecentActivity[] = [
        ...vehicles
          .filter(v => v.status === 'sold')
          .slice(0, 5)
          .map(v => ({
            id: v.id,
            type: 'sale' as const,
            description: `${v.name} was sold for $${v.price.toLocaleString()}`,
            timestamp: v.soldDate ? new Date(v.soldDate) : new Date(),
            status: 'completed' as const
          })),
        ...vehicles
          .filter(v => v.status === 'pending')
          .slice(0, 5)
          .map(v => ({
            id: v.id,
            type: 'enquiry' as const,
            description: `New enquiry for ${v.name}`,
            timestamp: new Date(v.updatedAt),
            status: 'pending' as const
          }))
      ];

      // Sort activity by timestamp
      recentActivityData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setStats({
        totalVehicles,
        availableVehicles,
        soldVehicles,
        pendingVehicles,
        totalRevenue,
        monthlyRevenue,
        activeEnquiries: pendingVehicles
      });

      setRecentActivity(recentActivityData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
              <h3 className="text-2xl font-bold">{stats.totalVehicles}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="text-green-600 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{stats.availableVehicles} Available</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
              <h3 className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="text-green-600 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{stats.soldVehicles} Vehicles Sold</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Enquiries</p>
              <h3 className="text-2xl font-bold">{stats.activeEnquiries}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-yellow-600">
            <Clock className="h-4 w-4" />
            <span>Requires Attention</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <h3 className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-purple-600">
            <TrendingUp className="h-4 w-4" />
            <span>All Time</span>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/vehicles/new">
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Add New Vehicle
          </Button>
        </Link>
        <Link href="/admin/vehicles?filter=pending">
          <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
            View Pending Enquiries
          </Button>
        </Link>
        <Link href="/admin/vehicles?filter=sold">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            View Sold Vehicles
          </Button>
        </Link>
        <Link href="/admin/settings">
          <Button className="w-full">
            Manage Settings
          </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50"
              >
                <div className={`p-2 rounded-full ${
                  activity.type === 'sale'
                    ? 'bg-green-100'
                    : activity.type === 'enquiry'
                    ? 'bg-yellow-100'
                    : 'bg-blue-100'
                }`}>
                  {activity.type === 'sale' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : activity.type === 'enquiry' ? (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <Car className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {activity.timestamp.toLocaleDateString()} at{' '}
                    {activity.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {activity.status && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {activity.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
} 