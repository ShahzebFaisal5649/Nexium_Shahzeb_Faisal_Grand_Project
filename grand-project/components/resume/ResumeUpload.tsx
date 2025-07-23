'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResumeUploadProps {
  onUploadComplete?: (resumeId: string) => void
  maxFiles?: number
  className?: string
}

interface UploadedFile {
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
  resumeId?: string
}

export function ResumeUpload({ onUploadComplete, maxFiles = 1, className }: ResumeUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [title, setTitle] = useState('')
  const [isMaster, setIsMaster] = useState(false)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }))
    
    setUploadedFiles(prev => [...prev, ...newFiles])
    
    // Simulate upload process
    newFiles.forEach((uploadFile, index) => {
      simulateUpload(uploadFile, uploadedFiles.length + index)
    })
  }, [uploadedFiles.length])

  const simulateUpload = async (uploadFile: UploadedFile, index: number) => {
    setUploading(true)
    
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        
        setUploadedFiles(prev => 
          prev.map((file, i) => 
            i === index ? { ...file, progress } : file
          )
        )
      }
      
      // Simulate successful upload
      const resumeId = `resume_${Date.now()}_${index}`
      
      setUploadedFiles(prev => 
        prev.map((file, i) => 
          i === index 
            ? { ...file, status: 'success', resumeId }
            : file
        )
      )
      
      onUploadComplete?.(resumeId)
    } catch (error) {
      setUploadedFiles(prev => 
        prev.map((file, i) => 
          i === index 
            ? { ...file, status: 'error', error: 'Upload failed' }
            : file
        )
      )
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
          <CardDescription>
            Upload your resume in PDF, DOC, or DOCX format (max 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload Area */}
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400',
              uploading && 'cursor-not-allowed opacity-50'
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop your resume here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag and drop your resume here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, DOCX files up to 10MB
                </p>
              </div>
            )}
          </div>

          {/* Resume Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Resume Title</Label>
              <Input
                id="title"
                placeholder="e.g., Software Engineer Resume"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="master"
                checked={isMaster}
                onChange={(e) => setIsMaster(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="master" className="text-sm">
                Set as master resume (primary template for tailoring)
              </Label>
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Uploaded Files</h4>
              {uploadedFiles.map((uploadFile, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">{uploadFile.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(uploadFile.file.size)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {uploadFile.status === 'uploading' && (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-xs text-gray-500">{uploadFile.progress}%</span>
                        </div>
                      )}
                      
                      {uploadFile.status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      
                      {uploadFile.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={uploadFile.status === 'uploading'}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {uploadFile.status === 'uploading' && (
                    <Progress value={uploadFile.progress} className="h-2" />
                  )}
                  
                  {uploadFile.status === 'error' && uploadFile.error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>{uploadFile.error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {uploadFile.status === 'success' && (
                    <Alert className="mt-2">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Resume uploaded successfully! Processing text extraction...
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
