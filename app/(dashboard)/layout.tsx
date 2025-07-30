'use client'

import { useState, useEffect, useRef, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Upload, 
  FileText, 
  Zap, 
  Download, 
  Plus, 
  LogOut,
  User,
  BarChart3,
  Target,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Eye,
  Clock,
  Star,
  Search,
  Filter,
  MoreHorizontal,
  Share2,
  Copy,
  Brain,
  TrendingUp,
  Calendar,
  Archive,
  RefreshCw
} from 'lucide-react'

// Mock data for demonstration
const initialResumes = [
  {
    id: 1,
    name: 'Software Engineer Resume',
    lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'optimized',
    matchScore: 85,
    jobTitle: 'Senior Software Engineer at Google',
    applications: 5,
    views: 23,
    downloads: 8,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    tags: ['React', 'Node.js', 'TypeScript'],
    content: 'Software engineer with 5+ years of experience...'
  },
  {
    id: 2,
    name: 'Marketing Manager Resume',
    lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: 'draft',
    matchScore: 0,
    jobTitle: 'Marketing Manager at Tesla',
    applications: 0,
    views: 12,
    downloads: 2,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ['Digital Marketing', 'SEO', 'Analytics'],
    content: 'Marketing professional with expertise...'
  },
  {
    id: 3,
    name: 'Data Scientist Resume',
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'optimized',
    matchScore: 92,
    jobTitle: 'Data Scientist at Microsoft',
    applications: 12,
    views: 45,
    downloads: 15,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    tags: ['Python', 'Machine Learning', 'SQL'],
    content: 'Data scientist with expertise in ML...'
  }
]

// Modal Component
function Modal({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// Resume Creation Modal
function CreateResumeModal({ isOpen, onClose, onCreateResume }: any) {
  const [resumeName, setResumeName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeContent, setResumeContent] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!resumeName.trim()) return

    setIsCreating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newResume = {
      id: Date.now(),
      name: resumeName,
      lastModified: new Date(),
      status: jobDescription ? 'optimized' : 'draft',
      matchScore: jobDescription ? Math.floor(Math.random() * 30) + 70 : 0,
      jobTitle: jobTitle || 'No job specified',
      applications: 0,
      views: 0,
      downloads: 0,
      createdAt: new Date(),
      tags: jobDescription ? ['AI Optimized', 'ATS Ready'] : ['Draft'],
      content: resumeContent || 'Resume content will be generated...'
    }

    onCreateResume(newResume)
    setIsCreating(false)
    onClose()
    
    // Reset form
    setResumeName('')
    setJobTitle('')
    setJobDescription('')
    setResumeContent('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Resume">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume Name *
          </label>
          <Input
            placeholder="e.g., Software Engineer Resume"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Job Title
          </label>
          <Input
            placeholder="e.g., Senior Software Engineer at Google"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description (for AI optimization)
          </label>
          <Textarea
            placeholder="Paste the job description here for AI optimization..."
            value={jobDescription}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setJobDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume Content
          </label>
          <Textarea
            placeholder="Enter your resume content or leave blank to use template..."
            value={resumeContent}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setResumeContent(e.target.value)}
            rows={6}
          />
        </div>

        <div className="flex space-x-4">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!resumeName.trim() || isCreating}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600"
          >
            {isCreating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Resume
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// File Upload Modal
function UploadResumeModal({ isOpen, onClose, onUploadResume }: any) {
  const [file, setFile] = useState<File | null>(null)
  const [resumeName, setResumeName] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResumeName(selectedFile.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleUpload = async () => {
    if (!file || !resumeName.trim()) return

    setIsUploading(true)
    
    // Simulate file upload and processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newResume = {
      id: Date.now(),
      name: resumeName,
      lastModified: new Date(),
      status: 'draft',
      matchScore: 0,
      jobTitle: 'Uploaded Resume',
      applications: 0,
      views: 0,
      downloads: 0,
      createdAt: new Date(),
      tags: ['Uploaded', 'Needs Optimization'],
      content: 'Uploaded resume content extracted from file...'
    }

    onUploadResume(newResume)
    setIsUploading(false)
    onClose()
    
    // Reset form
    setFile(null)
    setResumeName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Resume">
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="mb-2"
            >
              Choose File
            </Button>
            <p className="text-sm text-gray-500">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {file && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm text-green-800">{file.name}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume Name *
          </label>
          <Input
            placeholder="Enter a name for your resume"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
          />
        </div>

        <div className="flex space-x-4">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || !resumeName.trim() || isUploading}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600"
          >
            {isUploading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Resume
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// Resume Preview Modal
function ResumePreviewModal({ isOpen, onClose, resume }: any) {
  if (!resume) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Preview: ${resume.name}`}>
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Resume Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Status:</span>
              <Badge className={`ml-2 ${resume.status === 'optimized' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {resume.status}
              </Badge>
            </div>
            <div>
              <span className="text-gray-500">Match Score:</span>
              <span className="ml-2 font-semibold">{resume.matchScore}%</span>
            </div>
            <div>
              <span className="text-gray-500">Applications:</span>
              <span className="ml-2">{resume.applications}</span>
            </div>
            <div>
              <span className="text-gray-500">Downloads:</span>
              <span className="ml-2">{resume.downloads}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {resume.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Content Preview</h3>
          <div className="bg-white border rounded-lg p-4 max-h-64 overflow-y-auto">
            <p className="text-sm text-gray-700">{resume.content}</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button variant="outline" className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [resumes, setResumes] = useState(initialResumes)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [previewResume, setPreviewResume] = useState<any>(null)

  // Statistics
  const totalResumes = resumes.length
  const totalApplications = resumes.reduce((sum, resume) => sum + resume.applications, 0)
  const avgMatchScore = resumes.length > 0 ? Math.round(resumes.reduce((sum, resume) => sum + resume.matchScore, 0) / resumes.length) : 0
  const optimizedResumes = resumes.filter(resume => resume.status === 'optimized').length

  useEffect(() => {
    // Simulate getting user from authentication
    const userData = {
      email: 'User@gmail.com',
      full_name: 'Sir',
      id: 1
    }
    setUser(userData)
  }, [])

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    return date.toLocaleDateString()
  }

  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resume.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || resume.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCreateResume = (newResume: any) => {
    setResumes(prev => [newResume, ...prev])
  }

  const handleUploadResume = (newResume: any) => {
    setResumes(prev => [newResume, ...prev])
  }

  const handleOptimizeResume = async (resumeId: number) => {
    setResumes(prev => prev.map(resume => 
      resume.id === resumeId 
        ? { ...resume, status: 'optimizing' }
        : resume
    ))

    // Simulate optimization process
    setTimeout(() => {
      setResumes(prev => prev.map(resume => 
        resume.id === resumeId 
          ? { 
              ...resume, 
              status: 'optimized', 
              matchScore: Math.floor(Math.random() * 30) + 70,
              lastModified: new Date(),
              tags: [...resume.tags.filter(tag => tag !== 'Draft'), 'AI Optimized', 'ATS Ready']
            }
          : resume
      ))
    }, 3000)
  }

  const handleDownloadResume = (resumeId: number) => {
    setResumes(prev => prev.map(resume => 
      resume.id === resumeId 
        ? { ...resume, downloads: resume.downloads + 1 }
        : resume
    ))
    
    // Simulate download
    const resume = resumes.find(r => r.id === resumeId)
    if (resume) {
      const element = document.createElement('a')
      const file = new Blob([resume.content], { type: 'text/plain' })
      element.href = URL.createObjectURL(file)
      element.download = `${resume.name}.pdf`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  const handleDeleteResume = (resumeId: number) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      setResumes(prev => prev.filter(resume => resume.id !== resumeId))
    }
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      setUser(null)
      // In a real app, this would clear the session
      alert('Logged out successfully!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">RT</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Resume Tailor</span>
              <div className="text-xs text-gray-500">AI-Powered Dashboard</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              <User className="h-4 w-4" />
              <span>{user?.full_name || user?.email || 'User'}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Ready to optimize your resume and land your dream job?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Total Resumes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalResumes}</div>
              <p className="text-emerald-100 text-sm">{optimizedResumes} optimized</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Avg. Match Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgMatchScore}%</div>
              <p className="text-teal-100 text-sm">
                {avgMatchScore >= 80 ? 'Excellent!' : avgMatchScore >= 60 ? 'Good' : 'Needs work'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalApplications}</div>
              <p className="text-cyan-100 text-sm">This month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">73%</div>
              <p className="text-violet-100 text-sm">Interview callbacks</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <CardHeader>
              <CardTitle className="flex items-center text-xl group-hover:text-emerald-600 transition-colors">
                <Plus className="h-6 w-6 mr-3 text-emerald-600" />
                Create New Resume
              </CardTitle>
              <CardDescription>
                Start from scratch with our AI-powered resume builder and job-specific optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
              >
                <Brain className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <CardHeader>
              <CardTitle className="flex items-center text-xl group-hover:text-teal-600 transition-colors">
                <Upload className="h-6 w-6 mr-3 text-teal-600" />
                Upload Resume
              </CardTitle>
              <CardDescription>
                Upload your existing resume and let AI optimize it for better job matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setIsUploadModalOpen(true)}
                variant="outline" 
                className="w-full border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 hover:shadow-lg"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-emerald-600" />
                  Your Resumes
                </CardTitle>
                <CardDescription>
                  Manage and optimize your resume collection
                </CardDescription>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search resumes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Status</option>
                  <option value="optimized">Optimized</option>
                  <option value="draft">Draft</option>
                  <option value="optimizing">Optimizing</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredResumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shadow-sm">
                      <FileText className="h-7 w-7 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{resume.name}</h3>
                        {resume.status === 'optimized' && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Optimized
                          </Badge>
                        )}
                        {resume.status === 'draft' && (
                          <Badge variant="outline" className="border-yellow-200 text-yellow-700 bg-yellow-50">
                            <Clock className="h-3 w-3 mr-1" />
                            Draft
                          </Badge>
                        )}
                        {resume.status === 'optimizing' && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            Optimizing...
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{resume.jobTitle}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(resume.lastModified)}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {resume.views} views
                        </span>
                        <span className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {resume.downloads} downloads
                        </span>
                        <span className="flex items-center">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          {resume.applications} applications
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {resume.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {resume.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{resume.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {resume.status === 'optimized' && (
                      <div className="text-right mr-4">
                        <div className="text-sm font-medium text-emerald-600 mb-1">
                          {resume.matchScore}% match
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${resume.matchScore}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setPreviewResume(resume)}
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      
                      {resume.status !== 'optimizing' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleOptimizeResume(resume.id)}
                          className="hover:bg-emerald-50 hover:border-emerald-300"
                          disabled={resume.status === 'optimizing'}
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          {resume.status === 'optimized' ? 'Re-optimize' : 'Optimize'}
                        </Button>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadResume(resume.id)}
                        className="hover:bg-teal-50 hover:border-teal-300"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      
                      <div className="relative group">
                        <Button size="sm" variant="ghost" className="hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`Resume: ${resume.name} - Match Score: ${resume.matchScore}%`)
                              alert('Resume details copied to clipboard!')
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Details
                          </button>
                          <button 
                            onClick={() => alert('Share functionality coming soon!')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Resume
                          </button>
                          <button 
                            onClick={() => alert('Archive functionality coming soon!')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </button>
                          <hr className="my-1" />
                          <button 
                            onClick={() => handleDeleteResume(resume.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredResumes.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes found</h3>
                <p className="text-gray-500 mb-6">
                  No resumes match your search "{searchQuery}". Try a different search term.
                </p>
                <Button 
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                >
                  Clear Search
                </Button>
              </div>
            )}
            
            {filteredResumes.length === 0 && !searchQuery && resumes.length === 0 && (
              <div className="text-center py-16">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-12 w-12 text-emerald-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No resumes yet</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                  Create your first AI-optimized resume to get started on your job search journey. 
                  Our intelligent system will help you stand out from the competition.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-emerald-500/25"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Resume
                  </Button>
                  <Button 
                    onClick={() => setIsUploadModalOpen(true)}
                    variant="outline"
                    className="border-teal-200 hover:bg-teal-50 hover:border-teal-300"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resume
                  </Button>
                </div>
              </div>
            )}

            {filteredResumes.length === 0 && !searchQuery && resumes.length > 0 && (
              <div className="text-center py-12">
                <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes match the filter</h3>
                <p className="text-gray-500 mb-6">
                  No resumes match the current filter. Try selecting a different status.
                </p>
                <Button 
                  onClick={() => setFilterStatus('all')}
                  variant="outline"
                >
                  Show All Resumes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {resumes.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Clock className="h-5 w-5 mr-2 text-emerald-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest resume activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resumes
                  .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
                  .slice(0, 5)
                  .map((resume, _index) => (
                    <div key={resume.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                        {resume.status === 'optimized' ? (
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                        ) : resume.status === 'optimizing' ? (
                          <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                        ) : (
                          <FileText className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {resume.status === 'optimized' 
                            ? `Successfully optimized "${resume.name}"` 
                            : resume.status === 'optimizing'
                            ? `Currently optimizing "${resume.name}"`
                            : `Created "${resume.name}"`
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(resume.lastModified)}
                        </p>
                      </div>
                      {resume.status === 'optimized' && (
                        <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                          {resume.matchScore}% match
                        </Badge>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips and Recommendations */}
        <Card className="border-0 shadow-lg mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-blue-800">
              <Star className="h-5 w-5 mr-2" />
              Tips for Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Optimize for Each Job</h4>
                    <p className="text-sm text-gray-600">Tailor your resume for each application using our AI optimization.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Target className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Use Keywords</h4>
                    <p className="text-sm text-gray-600">Include relevant keywords from the job description to pass ATS filters.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Track Performance</h4>
                    <p className="text-sm text-gray-600">Monitor your application success rate and adjust accordingly.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Stay Updated</h4>
                    <p className="text-sm text-gray-600">Regularly update your resume with new skills and experiences.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateResumeModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onCreateResume={handleCreateResume}
      />
      
      <UploadResumeModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onUploadResume={handleUploadResume}
      />
      
      <ResumePreviewModal 
        isOpen={!!previewResume} 
        onClose={() => setPreviewResume(null)}
        resume={previewResume}
      />
    </div>
  )
}