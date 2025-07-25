'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Star, Calendar, Download, Edit, Trash2, Search } from 'lucide-react'

interface Resume {
  id: string
  title: string
  is_master: boolean
  file_url: string
  file_size: number
  file_type: string
  created_at: string
  updated_at: string
  match_scores?: number[]
}

interface ResumeLibraryProps {
  onResumeSelect?: (resume: Resume) => void
  selectable?: boolean
  showActions?: boolean
}

export function ResumeLibrary({ 
  onResumeSelect, 
  selectable = false, 
  showActions = true 
}: ResumeLibraryProps) {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'score'>('date')
  const [filterBy, setFilterBy] = useState<'all' | 'master' | 'tailored'>('all')

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      // Mock data - replace with actual API call
      const mockResumes: Resume[] = [
        {
          id: '1',
          title: 'Software Engineer Resume',
          is_master: true,
          file_url: '/resumes/software-engineer.pdf',
          file_size: 245760,
          file_type: 'application/pdf',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-20T14:30:00Z',
          match_scores: [85, 92, 78, 88]
        },
        {
          id: '2',
          title: 'Frontend Developer - Tailored',
          is_master: false,
          file_url: '/resumes/frontend-developer.pdf',
          file_size: 251200,
          file_type: 'application/pdf',
          created_at: '2024-01-18T09:15:00Z',
          updated_at: '2024-01-18T09:15:00Z',
          match_scores: [94]
        },
        {
          id: '3',
          title: 'Data Scientist Resume',
          is_master: false,
          file_url: '/resumes/data-scientist.pdf',
          file_size: 238400,
          file_type: 'application/pdf',
          created_at: '2024-01-10T16:45:00Z',
          updated_at: '2024-01-12T11:20:00Z',
          match_scores: [76, 82, 89]
        }
      ]
      setResumes(mockResumes)
    } catch (error) {
      console.error('Error fetching resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedResumes = resumes
    .filter(resume => {
      const matchesSearch = resume.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = 
        filterBy === 'all' || 
        (filterBy === 'master' && resume.is_master) ||
        (filterBy === 'tailored' && !resume.is_master)
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title)
        case 'date':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case 'score':
          const avgA = a.match_scores?.reduce((acc, score) => acc + score, 0) / (a.match_scores?.length || 1) || 0
          const avgB = b.match_scores?.reduce((acc, score) => acc + score, 0) / (b.match_scores?.length || 1) || 0
          return avgB - avgA
        default:
          return 0
      }
    })

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
      month: 'short',
      day: 'numeric'
    })
  }

  const getAverageMatchScore = (scores?: number[]) => {
    if (!scores || scores.length === 0) return null
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  const handleResumeClick = (resume: Resume) => {
    if (selectable && onResumeSelect) {
      onResumeSelect(resume)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resumes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Resumes</SelectItem>
            <SelectItem value="master">Master Resumes</SelectItem>
            <SelectItem value="tailored">Tailored Resumes</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Last Updated</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="score">Match Score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resume Grid */}
      {filteredAndSortedResumes.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No resumes found' : 'No resumes yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Upload your first resume to get started'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedResumes.map((resume) => (
            <Card 
              key={resume.id} 
              className={`hover:shadow-lg transition-shadow ${selectable ? 'cursor-pointer' : ''}`}
              onClick={() => handleResumeClick(resume)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-400" />
                      {resume.title}
                      {resume.is_master && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="mr-1 h-3 w-3" />
                          Master
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {formatFileSize(resume.file_size)} • {formatDate(resume.updated_at)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {getAverageMatchScore(resume.match_scores) && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Avg Match Score</span>
                      <span className="font-semibold">{getAverageMatchScore(resume.match_scores)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${getAverageMatchScore(resume.match_scores)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {showActions && (
                  <div className="flex gap-2">
                    <Link href={`/resumes/${resume.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        View
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!resume.is_master && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}