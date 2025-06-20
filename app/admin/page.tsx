'use client';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  StarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import type { Vehicle } from '@/types/vehicle'

interface AdminUser {
  id: string
  email: string
  is_super_admin: boolean
  created_at: string
}

interface DashboardStats {
  totalVehicles: number
  availableVehicles: number
  soldVehicles: number
  pendingVehicles: number
  featuredVehicles: number
  totalValue: number
  averagePrice: number
}

export default function AdminDashboard() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    availableVehicles: 0,
    soldVehicles: 0,
    pendingVehicles: 0,
    featuredVehicles: 0,
    totalValue: 0,
    averagePrice: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadAdminUsers()
    checkSuperAdminStatus()
    loadDashboardStats()
  }, [])

  const checkSuperAdminStatus = async () => {
    // Implementation for super admin check
  }

  const loadAdminUsers = async () => {
    // Implementation for loading admin users
  }

  const loadDashboardStats = async () => {
    try {
      setIsLoadingStats(true)
      const vehiclesRef = collection(db, 'vehicles')
      const snapshot = await getDocs(vehiclesRef)
      const vehicles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Vehicle[]

      const totalVehicles = vehicles.length
      const availableVehicles = vehicles.filter(v => v.status === 'available').length
      const soldVehicles = vehicles.filter(v => v.status === 'sold').length
      const pendingVehicles = vehicles.filter(v => v.status === 'pending').length
      const featuredVehicles = vehicles.filter(v => v.featured).length
      const totalValue = vehicles.reduce((sum, v) => sum + (v.price || 0), 0)
      const averagePrice = totalVehicles > 0 ? totalValue / totalVehicles : 0

      setStats({
        totalVehicles,
        availableVehicles,
        soldVehicles,
        pendingVehicles,
        featuredVehicles,
        totalValue,
        averagePrice
      })
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSuperAdmin) {
      setError('Only super admins can create new admin users')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Implementation for creating admin user
      await loadAdminUsers()
      setNewAdminEmail('')
      setNewAdminPassword('')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create admin user')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Total Vehicles',
      value: stats.totalVehicles,
      icon: TruckIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      name: 'Available',
      value: stats.availableVehicles,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      name: 'Sold',
      value: stats.soldVehicles,
      icon: XCircleIcon,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      name: 'Pending',
      value: stats.pendingVehicles,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      name: 'Featured',
      value: stats.featuredVehicles,
      icon: StarIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      name: 'Total Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Welcome to your vehicle management dashboard</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/admin/vehicles')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <TruckIcon className="h-4 w-4 mr-2" />
            Manage Vehicles
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoadingStats ? (
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Vehicle Price</h3>
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {isLoadingStats ? (
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  `$${stats.averagePrice.toLocaleString()}`
                )}
              </p>
              <p className="text-sm text-gray-600">Average price per vehicle</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available Rate</span>
              <span className="font-semibold text-gray-900">
                {stats.totalVehicles > 0 ? ((stats.availableVehicles / stats.totalVehicles) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sold Rate</span>
              <span className="font-semibold text-gray-900">
                {stats.totalVehicles > 0 ? ((stats.soldVehicles / stats.totalVehicles) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Featured Rate</span>
              <span className="font-semibold text-gray-900">
                {stats.totalVehicles > 0 ? ((stats.featuredVehicles / stats.totalVehicles) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Super Admin Section */}
      {isSuperAdmin && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Admin</h3>
          <form className="space-y-4" onSubmit={handleCreateAdmin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="Email"
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <input
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder="Password"
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </form>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Admin Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Admin Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.is_super_admin ? 'Super Admin' : 'Admin'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
