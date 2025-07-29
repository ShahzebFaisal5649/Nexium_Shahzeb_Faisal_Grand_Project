'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  Zap, 
  Download, 
  Plus, 
  Settings, 
  LogOut,
  User,
  BarChart3,
  Target,
  CheckCircle
} from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [resumes] = useState([
    {
      id: 1,
      name: 'Software Engineer Resume',
      lastModified: '2 hours ago',
      status: 'optimized',
      matchScore: 85
    },
    {
      id: 2,
      name: 'Marketing Manager Resume',
      lastModified: '1 day ago',
      status: 'draft',
      matchScore: 0
    }
  ])

  useEffect(() => {
    // Get user from localStorage (in real app, this would come from Supabase session)
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const handleCreateResume = () => {
    // In real app, this would navigate to resume builder
    alert('Navigate to Resume Builder - Create New Resume')
  }

  const handleUploadResume = () => {
    // In real app, this would open file picker
    alert('File upload functionality - Upload existing resume')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">RT</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Resume Tailor
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user?.email || 'User'}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-gray-600">
            Ready to create your next optimized resume?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Total Resumes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{resumes.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Avg. Match Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(resumes.reduce((acc, r) => acc + r.matchScore, 0) / resumes.length)}%
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Plus className="h-6 w-6 mr-3 text-blue-600" />
                Create New Resume
              </CardTitle>
              <CardDescription>
                Start from scratch with our AI-powered resume builder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleCreateResume}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Upload className="h-6 w-6 mr-3 text-purple-600" />
                Upload Resume
              </CardTitle>
              <CardDescription>
                Upload your existing resume to optimize with AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleUploadResume}
                variant="outline" 
                className="w-full border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
              >
                Choose File
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Resumes */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Your Resumes</CardTitle>
            <CardDescription>
              Manage and optimize your resume collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{resume.name}</h3>
                      <p className="text-sm text-gray-500">Last modified {resume.lastModified}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {resume.status === 'optimized' && (
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Optimized
                        </Badge>
                        <div className="text-sm font-medium text-green-600">
                          {resume.matchScore}% match
                        </div>
                      </div>
                    )}
                    
                    {resume.status === 'draft' && (
                      <Badge variant="outline" className="border-yellow-200 text-yellow-700 bg-yellow-50">
                        Draft
                      </Badge>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Zap className="h-4 w-4 mr-1" />
                        Optimize
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {resumes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
                <p className="text-gray-500 mb-6">Create your first resume to get started</p>
                <Button 
                  onClick={handleCreateResume}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Resume
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}