'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/dashboard/StatCard'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { Plus, FileText, Target, BarChart3, Clock } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalApplications: 0,
    avgMatchScore: 0,
    interviewRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // This would be replaced with actual API calls
        setStats({
          totalResumes: 3,
          totalApplications: 12,
          avgMatchScore: 85,
          interviewRate: 25,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {getGreeting()}, {profile?.full_name || user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-blue-100 mb-4">
          Ready to optimize your job search? Let's get started with your resume tailoring.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/tailor/input">
            <Button variant="secondary" className="w-full sm:w-auto">
              <Target className="mr-2 h-4 w-4" />
              Tailor Resume
            </Button>
          </Link>
          <Link href="/resumes">
            <Button variant="outline" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
              <FileText className="mr-2 h-4 w-4" />
              Manage Resumes
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Resumes"
          value={stats.totalResumes}
          icon={FileText}
          description="Resume versions created"
          loading={loading}
        />
        <StatCard
          title="Applications"
          value={stats.totalApplications}
          icon={Target}
          description="Jobs applied to"
          loading={loading}
        />
        <StatCard
          title="Avg Match Score"
          value={`${stats.avgMatchScore}%`}
          icon={BarChart3}
          description="Resume-job compatibility"
          loading={loading}
        />
        <StatCard
          title="Interview Rate"
          value={`${stats.interviewRate}%`}
          icon={Clock}
          description="Applications to interviews"
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* Getting Started Section */}
      {stats.totalResumes === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              Get Started
            </CardTitle>
            <CardDescription>
              Upload your first resume to begin optimizing your job search
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Start by uploading your master resume, then we'll help you tailor it for specific job opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/onboarding/upload">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Resume
                </Button>
              </Link>
              <Link href="/onboarding/welcome">
                <Button variant="outline">
                  Take Tour
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Pro Tips</CardTitle>
          <CardDescription>
            Maximize your job search success with these recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Resume Optimization</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tailor your resume for each job application</li>
                <li>• Use keywords from the job description</li>
                <li>• Keep your resume to 1-2 pages maximum</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Application Strategy</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Apply within 24-48 hours of job posting</li>
                <li>• Follow up after 1-2 weeks</li>
                <li>• Track all your applications</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}