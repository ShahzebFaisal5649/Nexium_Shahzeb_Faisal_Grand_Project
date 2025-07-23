import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Target, FileText, BarChart3, Settings, Upload } from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      title: 'Tailor Resume',
      description: 'Optimize your resume for a specific job',
      icon: Target,
      href: '/tailor/input',
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      primary: true
    },
    {
      title: 'Upload Resume',
      description: 'Add a new resume to your library',
      icon: Upload,
      href: '/resumes?action=upload',
      color: 'bg-green-100 text-green-600 hover:bg-green-200'
    },
    {
      title: 'Add Application',
      description: 'Track a new job application',
      icon: Plus,
      href: '/applications/new',
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200'
    },
    {
      title: 'View Analytics',
      description: 'Check your job search performance',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-orange-100 text-orange-600 hover:bg-orange-200'
    },
    {
      title: 'Manage Resumes',
      description: 'View and organize your resume library',
      icon: FileText,
      href: '/resumes',
      color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
    },
    {
      title: 'Settings',
      description: 'Update your profile and preferences',
      icon: Settings,
      href: '/settings',
      color: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks to help you optimize your job search
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon
          
          return (
            <Link key={action.title} href={action.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start h-auto p-4 ${action.primary ? 'border-2 border-blue-200 bg-blue-50' : ''}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${action.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Button>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
