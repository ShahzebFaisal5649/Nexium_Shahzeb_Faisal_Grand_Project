'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  FileText, 
  Target, 
  BarChart3, 
  Settings, 
  User,
  Briefcase,
  Zap
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Resumes',
    href: '/resumes',
    icon: FileText,
  },
  {
    name: 'Applications',
    href: '/applications',
    icon: Briefcase,
  },
  {
    name: 'Tailor Resume',
    href: '/tailor/input',
    icon: Target,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

const quickActions = [
  {
    name: 'Quick Tailor',
    href: '/tailor/input',
    icon: Zap,
    description: 'Optimize resume for a job'
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">RT</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Resume Tailor</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Quick Actions */}
      <div className="px-4 py-6 border-t border-gray-200">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="space-y-1">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <action.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue-500" />
              <div>
                <div className="font-medium">{action.name}</div>
                <div className="text-xs text-gray-500">{action.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Upgrade Banner */}
      <div className="px-4 pb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
          <h3 className="text-sm font-semibold mb-1">Upgrade to Pro</h3>
          <p className="text-xs text-blue-100 mb-3">
            Unlock unlimited resume tailoring and advanced analytics
          </p>
          <Link
            href="/upgrade"
            className="inline-flex items-center px-3 py-1.5 bg-white text-blue-600 text-xs font-medium rounded-md hover:bg-blue-50 transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  )
}
