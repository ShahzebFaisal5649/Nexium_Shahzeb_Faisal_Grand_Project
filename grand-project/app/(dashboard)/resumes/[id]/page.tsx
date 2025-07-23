'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResumePreview } from '@/components/resume/ResumePreview'
import { VersionHistory } from '@/components/resume/VersionHistory'
import { ArrowLeft, Download, Edit, Target, Star, Calendar, FileText, BarChart3 } from 'lucide-react'

interface Resume {
  id: string
  title: string
  is_master: boolean
  file_url: string
  file_size: number
  file_type: string
  extracted_text: string
  created_at: string
  updated_at: string
}

interface Application {
  id: string
  company_name: string
  job_title: string
  application_date: string
  status: string
  match_score: number
}

export default function ResumeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const resumeId = params.id as string
  
  const [resume, setResume] = useState<Resume | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResumeDetails()
  }, [resumeId])

  const fetchResumeDetails = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockResume: Resume = {
        id: resumeId,
        title: 'Software Engineer Resume',
        is_master: true,
        file_url: '/resumes/software-engineer.pdf',
        file_size: 245760,
        file_type: 'application/pdf',
        extracted_text: 'John Doe\nSoftware Engineer\n\nExperience:\n- 5 years of full-stack development\n- React, Node.js, Python\n- Led team of 3 developers\n\nEducation:\n- BS Computer Science, MIT',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T14:30:00Z',
      }

      const mockApplications: Application[] = [
        {
          id: '1',
          company_name: 'TechCorp',
          job_title: 'Senior Software Engineer',
          application_date: '2024-01-22',
          status: 'interview',
          match_score: 92
        },
        {
          id: '2',
          company_name: 'StartupXYZ',
          job_title: 'Full Stack Developer',
          application_date: '2024-01-20',
          status: 'applied',
          match_score: 85
        }
      ]

      setResume(mockResume)
      setApplications(mockApplications)
    } catch (error) {
      console.error('Error fetching resume details:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interview':
        return 'bg-blue-100 text-blue-800'
      case 'offer':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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

  if (!resume) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Resume Not Found</h1>
        <p className="text-gray-600 mb-6">The resume you're looking for doesn't exist.</p>
        <Link href="/resumes">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resumes
          </Button>
        </Link>
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
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{resume.title}</h1>
            {resume.is_master && (
              <Badge variant="secondary">
                <Star className="mr-1 h-3 w-3" />
                Master
              </Badge>
            )}
          </div>
          <p className="text-gray-600">
            {formatFileSize(resume.file_size)} • Last updated {formatDate(resume.updated_at)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Link href={`/tailor/input?resumeId=${resume.id}`}>
            <Button>
              <Target className="mr-2 h-4 w-4" />
              Tailor Resume
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Match Score</p>
                <p className="text-2xl font-bold">
                  {applications.length > 0 
                    ? Math.round(applications.reduce((acc, app) => acc + app.match_score, 0) / applications.length)
                    : 0}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interview Rate</p>
                <p className="text-2xl font-bold">
                  {applications.length > 0 
                    ? Math.round((applications.filter(app => ['interview', 'final_round', 'offer'].includes(app.status)).length / applications.length) * 100)
                    : 0}%
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="preview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="versions">Version History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <ResumePreview resume={resume} />
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Applications Using This Resume</CardTitle>
              <CardDescription>
                Track the performance of this resume across different job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start applying to jobs with this resume to track its performance
                  </p>
                  <Link href="/applications">
                    <Button>
                      View All Applications
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{application.job_title}</h4>
                        <p className="text-sm text-gray-600">{application.company_name}</p>
                        <p className="text-xs text-gray-500">Applied on {formatDate(application.application_date)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold">{application.match_score}%</p>
                          <p className="text-xs text-gray-500">Match Score</p>
                        </div>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                        <Link href={`/applications/${application.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions">
          <VersionHistory resumeId={resume.id} />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Detailed insights about this resume's performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600">
                    Detailed performance analytics will be available once you have more application data
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
