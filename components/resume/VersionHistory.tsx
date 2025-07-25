'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, GitBranch, Download, Eye, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'

interface ResumeVersion {
  id: string
  version_number: number
  changes_summary: string
  tailored_content?: string
  match_score_before?: number
  match_score_after?: number
  job_description_id?: string
  job_title?: string
  company_name?: string
  created_at: string
}

interface VersionHistoryProps {
  resumeId: string
}

export function VersionHistory({ resumeId }: VersionHistoryProps) {
  const [versions, setVersions] = useState<ResumeVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVersion, setSelectedVersion] = useState<ResumeVersion | null>(null)

  useEffect(() => {
    fetchVersionHistory()
  }, [resumeId])

  const fetchVersionHistory = async () => {
    try {
      // Mock data - replace with actual API call
      const mockVersions: ResumeVersion[] = [
        {
          id: '1',
          version_number: 3,
          changes_summary: 'Tailored for Senior Software Engineer position at TechCorp',
          match_score_before: 78,
          match_score_after: 92,
          job_title: 'Senior Software Engineer',
          company_name: 'TechCorp',
          created_at: '2024-01-22T10:00:00Z'
        },
        {
          id: '2',
          version_number: 2,
          changes_summary: 'Updated skills section and added React experience',
          match_score_before: 72,
          match_score_after: 78,
          created_at: '2024-01-20T15:30:00Z'
        },
        {
          id: '3',
          version_number: 1,
          changes_summary: 'Initial upload - master resume',
          created_at: '2024-01-15T10:00:00Z'
        }
      ]
      setVersions(mockVersions.sort((a, b) => b.version_number - a.version_number))
    } catch (error) {
      console.error('Error fetching version history:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreImprovement = (before?: number, after?: number) => {
    if (!before || !after) return null
    return after - before
  }

  const getScoreColor = (improvement: number) => {
    if (improvement > 0) return 'text-green-600'
    if (improvement < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
          <CardDescription>Loading version history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Version History
        </CardTitle>
        <CardDescription>
          Track changes and improvements made to your resume over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        {versions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No version history</h3>
            <p className="text-gray-600">
              Version history will appear here as you make changes to your resume
            </p>
          </div>
        ) : (
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="comparison">Compare Versions</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-6">
              <div className="space-y-6">
                {versions.map((version, index) => {
                  const improvement = getScoreImprovement(
                    version.match_score_before,
                    version.match_score_after
                  )
                  
                  return (
                    <div key={version.id} className="relative">
                      {/* Timeline line */}
                      {index < versions.length - 1 && (
                        <div className="absolute left-4 top-12 w-0.5 h-16 bg-gray-200"></div>
                      )}
                      
                      <div className="flex items-start space-x-4">
                        {/* Version badge */}
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">
                            v{version.version_number}
                          </span>
                        </div>
                        
                        {/* Version details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-gray-900">
                              Version {version.version_number}
                              {version.version_number === Math.max(...versions.map(v => v.version_number)) && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  Current
                                </Badge>
                              )}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="mr-1 h-3 w-3" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="mr-1 h-3 w-3" />
                                Download
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {version.changes_summary}
                          </p>
                          
                          {version.job_title && version.company_name && (
                            <p className="text-xs text-gray-500 mb-2">
                              Tailored for {version.job_title} at {version.company_name}
                            </p>
                          )}
                          
                          {improvement !== null && (
                            <div className="flex items-center space-x-4 mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Match Score:</span>
                                <span className="text-xs font-medium">
                                  {version.match_score_before}%
                                </span>
                                <ArrowRight className="h-3 w-3 text-gray-400" />
                                <span className="text-xs font-medium">
                                  {version.match_score_after}%
                                </span>
                                <div className={`flex items-center space-x-1 ${getScoreColor(improvement)}`}>
                                  {improvement > 0 ? (
                                    <TrendingUp className="h-3 w-3" />
                                  ) : improvement < 0 ? (
                                    <TrendingDown className="h-3 w-3" />
                                  ) : null}
                                  <span className="text-xs font-medium">
                                    {improvement > 0 ? '+' : ''}{improvement}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <p className="text-xs text-gray-500">
                            {formatDate(version.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compare from version:
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      {versions.map(version => (
                        <option key={version.id} value={version.id}>
                          Version {version.version_number} - {formatDate(version.created_at)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compare to version:
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      {versions.map(version => (
                        <option key={version.id} value={version.id}>
                          Version {version.version_number} - {formatDate(version.created_at)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <Button className="w-full">
                  Compare Selected Versions
                </Button>
                
                <div className="text-center py-8 text-gray-500">
                  <p>Select two versions to see a detailed comparison</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
