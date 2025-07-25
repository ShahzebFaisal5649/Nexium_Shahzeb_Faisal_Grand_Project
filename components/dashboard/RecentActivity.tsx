'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Target, Calendar, ArrowRight } from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'resume_upload' | 'application_submitted' | 'resume_tailored' | 'interview_scheduled'
  title: string
  description: string
  timestamp: string
  metadata?: {
    company?: string
    jobTitle?: string
    resumeTitle?: string
    matchScore?: number
  }
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      // Mock data - replace with actual API call
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'application_submitted',
          title: 'Application Submitted',
          description: 'Applied to Senior Software Engineer at TechCorp',
          timestamp: '2024-01-22T10:00:00Z',
          metadata: {
            company: 'TechCorp',
            jobTitle: 'Senior Software Engineer',
            matchScore: 92
          }
        },
        {
          id: '2',
          type: 'resume_tailored',
          title: 'Resume Tailored',
          description: 'Optimized resume for Frontend Developer position',
          timestamp: '2024-01-21T15:30:00Z',
          metadata: {
            resumeTitle: 'Frontend Developer Resume',
            matchScore: 88
          }
        },
        {
          id: '3',
          type: 'interview_scheduled',
          title: 'Interview Scheduled',
          description: 'Technical interview with StartupXYZ',
          timestamp: '2024-01-20T09:15:00Z',
          metadata: {
            company: 'StartupXYZ',
            jobTitle: 'Full Stack Developer'
          }
        },
        {
          id: '4',
          type: 'resume_upload',
          title: 'Resume Uploaded',
          description: 'New master resume added to library',
          timestamp: '2024-01-19T14:45:00Z',
          metadata: {
            resumeTitle: 'Software Engineer Resume'
          }
        }
      ]
      setActivities(mockActivities)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'resume_upload':
      case 'resume_tailored':
        return FileText
      case 'application_submitted':
        return Target
      case 'interview_scheduled':
        return Calendar
      default:
        return FileText
    }
  }

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'resume_upload':
        return 'bg-blue-100 text-blue-600'
      case 'resume_tailored':
        return 'bg-purple-100 text-purple-600'
      case 'application_submitted':
        return 'bg-green-100 text-green-600'
      case 'interview_scheduled':
        return 'bg-orange-100 text-orange-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest actions and updates
            </CardDescription>
          </div>
          <Link href="/dashboard/activity">
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
            <p className="text-gray-600 mb-4">
              Start by uploading a resume or applying to jobs to see your activity here.
            </p>
            <Link href="/resumes">
              <Button>Upload Resume</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type)
              const colorClass = getActivityColor(activity.type)
              
              return (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    {activity.metadata?.matchScore && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {activity.metadata.matchScore}% match
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
