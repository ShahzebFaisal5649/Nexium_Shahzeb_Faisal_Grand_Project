'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, FileText, Check } from 'lucide-react'

interface Resume {
  id: string
  name: string
  lastModified: string
  size: string
}

export function ResumeSelector() {
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [resumes] = useState<Resume[]>([
    {
      id: '1',
      name: 'Software Engineer Resume.pdf',
      lastModified: '2 days ago',
      size: '245 KB'
    },
    {
      id: '2',
      name: 'Frontend Developer Resume.pdf',
      lastModified: '1 week ago',
      size: '198 KB'
    },
    {
      id: '3',
      name: 'Full Stack Resume.pdf',
      lastModified: '2 weeks ago',
      size: '267 KB'
    }
  ])

  const handleUpload = () => {
    // Handle file upload logic
    console.log('Upload new resume')
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {resumes.map((resume) => (
          <Card
            key={resume.id}
            className={`cursor-pointer transition-all ${
              selectedResume === resume.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => setSelectedResume(resume.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{resume.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {resume.lastModified} • {resume.size}
                    </p>
                  </div>
                </div>
                {selectedResume === resume.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleUpload}
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload New Resume
      </Button>
    </div>
  )
}