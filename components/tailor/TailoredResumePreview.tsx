'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { 
  Download, 
  Edit, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  FileText,
  Zap
} from 'lucide-react';

interface TailoredResumePreviewProps {
  resumeData: any;
  tailoringResults: TailoringResults;
  onEdit: () => void;
  onDownload: () => void;
}

interface TailoringResults {
  score: number;
  improvements: string[];
  keywordsAdded: string[];
  sectionsModified: string[];
  atsCompatibility: number;
  suggestions: string[];
}

export function TailoredResumePreview({ 
  resumeData, 
  tailoringResults, 
  onEdit, 
  onDownload 
}: TailoredResumePreviewProps) {
  const [activeTab, setActiveTab] = useState('preview');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Tailoring Complete
          </CardTitle>
          <CardDescription>
            Your resume has been successfully optimized for this position
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${getScoreBgColor(tailoringResults.score)}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Match Score</span>
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(tailoringResults.score)}`}>
                {tailoringResults.score}%
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ATS Score</span>
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {tailoringResults.atsCompatibility}%
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Keywords Added</span>
                <Zap className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {tailoringResults.keywordsAdded.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Resume Preview</TabsTrigger>
          <TabsTrigger value="changes">Changes Made</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-6">
          {/* Resume Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Tailored Resume</CardTitle>
              <CardDescription>
                Preview of your optimized resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg p-8 shadow-sm">
                {/* Resume Header */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold">{resumeData.name || 'Your Name'}</h1>
                  <p className="text-gray-600">{resumeData.title || 'Professional Title'}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {resumeData.email} | {resumeData.phone} | {resumeData.location}
                  </p>
                </div>

                {/* Professional Summary */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold border-b pb-2 mb-3">Professional Summary</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {resumeData.summary || 'Your professional summary will appear here after tailoring...'}
                  </p>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold border-b pb-2 mb-3">Key Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {(resumeData.skills || []).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold border-b pb-2 mb-3">Professional Experience</h2>
                  {(resumeData.experience || []).map((exp: any, index: number) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{exp.title}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-500">{exp.duration}</span>
                      </div>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {(exp.achievements || []).map((achievement: string, i: number) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-lg font-semibold border-b pb-2 mb-3">Education</h2>
                  {(resumeData.education || []).map((edu: any, index: number) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-gray-600">{edu.institution}</p>
                        </div>
                        <span className="text-sm text-gray-500">{edu.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changes" className="space-y-6">
          {/* Changes Made */}
          <Card>
            <CardHeader>
              <CardTitle>Modifications Made</CardTitle>
              <CardDescription>
                Summary of all changes made to your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sections Modified */}
              <div>
                <h3 className="font-semibold mb-2">Sections Modified</h3>
                <div className="flex flex-wrap gap-2">
                  {tailoringResults.sectionsModified.map((section, index) => (
                    <Badge key={index} variant="outline">
                      {section}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Keywords Added */}
              <div>
                <h3 className="font-semibold mb-2">Keywords Added</h3>
                <div className="flex flex-wrap gap-2">
                  {tailoringResults.keywordsAdded.map((keyword, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Improvements */}
              <div>
                <h3 className="font-semibold mb-2">Key Improvements</h3>
                <ul className="space-y-2">
                  {tailoringResults.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {/* Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>
                AI-powered insights about your tailored resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Suggestions */}
              <div>
                <h3 className="font-semibold mb-2">Additional Suggestions</h3>
                <ul className="space-y-2">
                  {tailoringResults.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Resume
        </Button>
        <Button onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download Resume
        </Button>
      </div>
    </div>
  );
}

// Add this at the end of your file, replacing the existing export
export default TailoredResumePreview;