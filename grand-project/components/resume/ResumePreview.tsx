'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Eye, Edit, FileText, Maximize2 } from 'lucide-react'

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

interface ResumePreviewProps {
  resume: Resume
  showActions?: boolean
  className?: string
}

export function ResumePreview({ resume, showActions = true, className }: ResumePreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'text' | 'pdf'>('preview')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const parseResumeText = (text: string) => {
    // Simple parser to structure the resume text
    const lines = text.split('\n').filter(line => line.trim())
    const sections: { [key: string]: string[] } = {}
    let currentSection = 'header'
    
    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine.toLowerCase().includes('experience')) {
        currentSection = 'experience'
        sections[currentSection] = []
      } else if (trimmedLine.toLowerCase().includes('education')) {
        currentSection = 'education'
        sections[currentSection] = []
      } else if (trimmedLine.toLowerCase().includes('skills')) {
        currentSection = 'skills'
        sections[currentSection] = []
      } else if (trimmedLine.toLowerCase().includes('projects')) {
        currentSection = 'projects'
        sections[currentSection] = []
      } else {
        if (!sections[currentSection]) {
          sections[currentSection] = []
        }
        sections[currentSection].push(trimmedLine)
      }
    })
    
    return sections
  }

  const sections = parseResumeText(resume.extracted_text)

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-xl">{resume.title}</CardTitle>
                {resume.is_master && (
                  <Badge variant="secondary">Master</Badge>
                )}
              </div>
              <CardDescription>
                {formatFileSize(resume.file_size)} • Last updated {formatDate(resume.updated_at)}
              </CardDescription>
            </div>
            {showActions && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="text">
                <FileText className="mr-2 h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="pdf">
                <FileText className="mr-2 h-4 w-4" />
                PDF View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-6">
              <div className={`resume-preview ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-8 overflow-auto' : ''}`}>
                {isFullscreen && (
                  <Button 
                    variant="outline" 
                    className="mb-4"
                    onClick={() => setIsFullscreen(false)}
                  >
                    Exit Fullscreen
                  </Button>
                )}
                
                {/* Header Section */}
                {sections.header && (
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {sections.header[0] || 'Resume'}
                    </h1>
                    {sections.header.slice(1).map((line, index) => (
                      <p key={index} className="text-gray-600">{line}</p>
                    ))}
                  </div>
                )}

                {/* Experience Section */}
                {sections.experience && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                      Experience
                    </h2>
                    <div className="space-y-3">
                      {sections.experience.map((line, index) => (
                        <p key={index} className="text-sm text-gray-700">{line}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education Section */}
                {sections.education && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                      Education
                    </h2>
                    <div className="space-y-2">
                      {sections.education.map((line, index) => (
                        <p key={index} className="text-sm text-gray-700">{line}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Section */}
                {sections.skills && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {sections.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects Section */}
                {sections.projects && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                      Projects
                    </h2>
                    <div className="space-y-3">
                      {sections.projects.map((line, index) => (
                        <p key={index} className="text-sm text-gray-700">{line}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="text" className="mt-6">
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {resume.extracted_text}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="pdf" className="mt-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                {resume.file_url ? (
                  <iframe
                    src={resume.file_url}
                    className="w-full h-96 border rounded"
                    title="Resume PDF"
                  />
                ) : (
                  <div className="py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">PDF preview not available</p>
                    <Button variant="outline" className="mt-4">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
