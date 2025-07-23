'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusTimeline } from '@/components/applications/StatusTimeline'
import { ApplicationForm } from '@/components/applications/ApplicationForm'
import { ArrowLeft, Edit, ExternalLink, Calendar, Building, MapPin, DollarSign } from 'lucide-react'

interface Application {
  id: string
  company_name: string
  job_title: string
  application_date: string
  status: string
  match_score: number
  job_url?: string
  location?: string
  salary_range?: string
  notes?: string
  job_description?: string
  resume_id?: string
}

interface StatusHistory {
  id: string
  old_status?: string
  new_status: string
  notes?: string
  created_at: string
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string
  
  const [application, setApplication] = useState<Application | null>(null)
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchApplicationDetails()
  }, [applicationId])

  const fetchApplicationDetails = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockApplication: Application = {
        id: applicationId,
        company_name: 'TechCorp',
        job_title: 'Senior Software Engineer',
        application_date: '2024-01-22',
        status: 'interview',
        match_score: 92,
        job_url: 'https://techcorp.com/jobs/senior-engineer',
        location: 'San Francisco, CA',
        salary_range: '$120,000 - $160,000',
        notes: 'Great company culture, competitive salary. Interview scheduled for next week.',
        job_description: 'We are looking for a Senior Software Engineer to join our growing team...',
        resume_id: '1'
      }

      const mockStatusHistory: StatusHistory[] = [
        {
          id: '1',
          new_status: 'applied',
          notes: 'Application submitted',
          created_at: '2024-01-22T10:00:00Z'
        },
        {
          id: '2',
          old_status: 'applied',
          new_status: 'phone_screen',
          notes: 'HR reached out for phone screening',
          created_at: '2024-01-24T14:30:00Z'
        },
        {
          id: '3',
          old_status: 'phone_screen',
          new_status: 'interview',
          notes: 'Technical interview scheduled for Jan 30th',
          created_at: '2024-01-26T09:15:00Z'
        }
      ]

      setApplication(mockApplication)
      setStatusHistory(mockStatusHistory)
    } catch (error) {
      console.error('Error fetching application details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800'
      case 'phone_screen':
        return 'bg-yellow-100 text-yellow-800'
      case 'interview':
      case 'final_round':
        return 'bg-purple-100 text-purple-800'
      case 'offer':
        return 'bg-green-100 text-green-800'
      case 'rejected':
      case 'withdrawn':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
        <p className="text-gray-600 mb-6">The application you're looking for doesn't exist.</p>
        <Link href="/applications">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Button>
        </Link>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setIsEditing(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Application</h1>
            <p className="text-gray-600">Update application details and status</p>
          </div>
        </div>
        <ApplicationForm 
          application={application}
          onSave={(updatedApplication) => {
            setApplication(updatedApplication)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{application.job_title}</h1>
            <Badge className={getStatusColor(application.status)}>
              {formatStatus(application.status)}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              <span>{application.company_name}</span>
            </div>
            {application.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{application.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Applied {formatDate(application.application_date)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {application.job_url && (
            <Button variant="outline" asChild>
              <a href={application.job_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Job
              </a>
            </Button>
          )}
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{application.match_score}%</p>
              <p className="text-sm text-gray-600">Match Score</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {Math.floor((new Date().getTime() - new Date(application.application_date).getTime()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-sm text-gray-600">Days Since Applied</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{statusHistory.length}</p>
              <p className="text-sm text-gray-600">Status Updates</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="job-details">Job Details</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Company</label>
                  <p className="text-lg">{application.company_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Position</label>
                  <p className="text-lg">{application.job_title}</p>
                </div>
                {application.location && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p>{application.location}</p>
                  </div>
                )}
                {application.salary_range && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Salary Range</label>
                    <p className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {application.salary_range}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Application Date</label>
                  <p>{formatDate(application.application_date)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Follow-up
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Update Status
                </Button>
                {application.resume_id && (
                  <Link href={`/resumes/${application.resume_id}`}>
                    <Button className="w-full justify-start" variant="outline">
                      View Resume Used
                    </Button>
                  </Link>
                )}
                {application.job_url && (
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <a href={application.job_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Original Job Posting
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <StatusTimeline statusHistory={statusHistory} />
        </TabsContent>

        <TabsContent value="job-details">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>
                Original job posting details and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {application.job_description ? (
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{application.job_description}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No job description available</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsEditing(true)}>
                    Add Job Description
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Application Notes</CardTitle>
              <CardDescription>
                Your personal notes and observations about this application
              </CardDescription>
            </CardHeader>
            <CardContent>
              {application.notes ? (
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{application.notes}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No notes added yet</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsEditing(true)}>
                    Add Notes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
