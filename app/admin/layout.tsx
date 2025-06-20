'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useSessionTimeout } from '@/hooks/use-session-timeout'
import SessionStatus from '@/components/admin/SessionStatus'
import SessionTest from '@/components/admin/SessionTest'
import { getSessionConfig } from '@/lib/config/session'
import {
  HomeIcon,
  ChartBarIcon,
  CogIcon,
  TruckIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  StarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Vehicle Management', href: '/admin/vehicles', icon: TruckIcon },
  { name: 'Documentation', href: '/admin/documentation', icon: DocumentTextIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
]

function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const sessionConfig = getSessionConfig()

  useSessionTimeout({
    timeoutMinutes: sessionConfig.DEFAULT_TIMEOUT_MINUTES,
    warningMinutes: sessionConfig.WARNING_MINUTES,
    enableTabCloseDetection: sessionConfig.ENABLE_TAB_CLOSE_DETECTION,
    enableActivityTracking: sessionConfig.ENABLE_ACTIVITY_TRACKING
  });

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await signOut(auth)
      router.push('/admin/login')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-40 shadow-lg 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            {/* Logo */}
            <div className="flex items-center h-20 px-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
              <div className="flex items-center">
                <TruckIcon className="h-8 w-8 text-white mr-3" />
                <span className="text-xl font-bold text-white">Admin Panel</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="px-4 mt-8 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl group transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-4 h-5 w-5 transition-colors ${
                        isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Session Status */}
          <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
            <SessionStatus showWarning={true} />
          </div>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 group transition-all duration-200"
            >
              <ArrowLeftOnRectangleIcon
                className="w-5 h-5 mr-4 text-red-400 group-hover:text-red-500 transition-colors"
                aria-hidden="true"
              />
              {isLoading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="py-8">
          <div className="px-6 mx-auto max-w-7xl lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Session Test Component (Development Only) */}
      {process.env.NODE_ENV === 'development' && <SessionTest />}
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname === '/admin/login') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {children}
      </div>
    )
  }

  return <ProtectedAdminLayout>{children}</ProtectedAdminLayout>
} 