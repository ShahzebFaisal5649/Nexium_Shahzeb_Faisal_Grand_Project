'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ApplicationsList } from '@/components/applications/ApplicationsList'
import { Plus, Search, Filter, Target, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Application {
  id: string
  company_name: string
  job_title: string
  application_date: string
  status: 'applied' | 'phone_screen' | 'interview' | 'final_round' | 'offer' | 'rejected' | 'withdrawn'
  match_score: number
  job_url?: string
  notes?: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('date')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      // Mock data - replace with actual API call
      const mockApplications: Application[] = [
        {
          id: '1',
          company_name: 'TechCorp',
          job_title: 'Senior Software Engineer',
          application_date: '2024-01-22',
          status: 'interview',
          match_score: 92,
          job_url: 'https://techcorp.com/jobs/senior-engineer',
          notes: 'Great company culture, competitive salary'
        },
        {
          id: '2',
          company_name: 'StartupXYZ',
          job_title: 'Full Stack Developer',
          application_date: '2024-01-20',
          status: 'applied',
          match_score: 85,
          job_url: 'https://startupxyz.com/careers/fullstack'
        },
        {
          id: '3',
          company_name: 'BigTech Inc',
          job_title: 'Frontend Engineer',
          application_date: '2024-01-18',
          status: 'phone_screen',
          match_score: 78,
          notes: 'Phone screen scheduled for next week'
        },
        {
          id: '4',
          company_name: 'InnovateLab',
          job_title: 'React Developer',
          application_date: '2024-01-15',
          status: 'rejected',
          match_score: 88,
          notes: 'Position filled internally'
        }
      ]
      setApplications(mockApplications)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusStats = () => {
    const stats = {
      total: applications.length,
      applied: applications.filter(app => app.status === 'applied').length,
      interview: applications.filter(app => ['phone_screen', 'interview', 'final_round'].includes(app.status)).length,
      offer: applications.filter(app => app.status === 'offer').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
    }
    return stats
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

  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.job_title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.application_date).getTime() - new Date(a.application_date).getTime()
        case 'company':
          return a.company_name.localeCompare(b.company_name)
        case 'score':
          return b.match_score - a.match_score
        default:
          return 0
      }
    })

  const stats = getStatusStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-600">Track and manage your job application pipeline</p>
        </div>
        <Link href="/applications/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Applied</p>
                <p className="text-2xl font-bold">{stats.applied}</p>
              </div>
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interviews</p>
                <p className="text-2xl font-bold">{stats.interview}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Offers</p>
                <p className="text-2xl font-bold">{stats.offer}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by company or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="phone_screen">Phone Screen</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="final_round">Final Round</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Application Date</SelectItem>
            <SelectItem value="company">Company Name</SelectItem>
            <SelectItem value="score">Match Score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No applications found' : 'No applications yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start tracking your job applications to monitor your progress'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link href="/applications/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Application
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{application.job_title}</h3>
                      <Badge className={getStatusColor(application.status)}>
                        {formatStatus(application.status)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-1">{application.company_name}</p>
                    <p className="text-sm text-gray-500">
                      Applied on {new Date(application.application_date).toLocaleDateString()}
                    </p>
                    {application.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">"{application.notes}"</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{application.match_score}%</p>
                      <p className="text-xs text-gray-500">Match Score</p>
                    </div>
                    <Link href={`/applications/${application.id}`}>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}