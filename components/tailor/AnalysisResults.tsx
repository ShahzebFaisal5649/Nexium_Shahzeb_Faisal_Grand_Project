import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react"

interface AnalysisData {
  overallScore: number
  skillsMatch: number
  experienceMatch: number
  educationMatch: number
  keywordDensity: number
  matchingSkills: string[]
  missingSkills: string[]
  strengths: string[]
  improvements: string[]
}

// Mock data - in real app, this would come from props or API
const mockAnalysis: AnalysisData = {
  overallScore: 78,
  skillsMatch: 85,
  experienceMatch: 72,
  educationMatch: 90,
  keywordDensity: 65,
  matchingSkills: ["React", "TypeScript", "Node.js", "AWS", "Git"],
  missingSkills: ["Docker", "Kubernetes", "GraphQL", "Redis"],
  strengths: [
    "Strong technical skills alignment",
    "Relevant work experience",
    "Educational background matches requirements"
  ],
  improvements: [
    "Add more cloud infrastructure experience",
    "Include containerization technologies",
    "Highlight API development experience"
  ]
}

export function AnalysisResults() {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Analysis Results
        </CardTitle>
        <CardDescription>
          Detailed breakdown of how your resume matches the job requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold">Score Breakdown</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Skills Match</span>
              <div className="flex items-center space-x-2">
                {getScoreIcon(mockAnalysis.skillsMatch)}
                <span className={`font-semibold ${getScoreColor(mockAnalysis.skillsMatch)}`}>
                  {mockAnalysis.skillsMatch}%
                </span>
              </div>
            </div>
            <Progress value={mockAnalysis.skillsMatch} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Experience Match</span>
              <div className="flex items-center space-x-2">
                {getScoreIcon(mockAnalysis.experienceMatch)}
                <span className={`font-semibold ${getScoreColor(mockAnalysis.experienceMatch)}`}>
                  {mockAnalysis.experienceMatch}%
                </span>
              </div>
            </div>
            <Progress value={mockAnalysis.experienceMatch} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Education Match</span>
              <div className="flex items-center space-x-2">
                {getScoreIcon(mockAnalysis.educationMatch)}
                <span className={`font-semibold ${getScoreColor(mockAnalysis.educationMatch)}`}>
                  {mockAnalysis.educationMatch}%
                </span>
              </div>
            </div>
            <Progress value={mockAnalysis.educationMatch} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Keyword Density</span>
              <div className="flex items-center space-x-2">
                {getScoreIcon(mockAnalysis.keywordDensity)}
                <span className={`font-semibold ${getScoreColor(mockAnalysis.keywordDensity)}`}>
                  {mockAnalysis.keywordDensity}%
                </span>
              </div>
            </div>
            <Progress value={mockAnalysis.keywordDensity} className="h-2" />
          </div>
        </div>

        {/* Matching Skills */}
        <div>
          <h4 className="font-semibold mb-3">Matching Skills</h4>
          <div className="flex flex-wrap gap-2">
            {mockAnalysis.matchingSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div>
          <h4 className="font-semibold mb-3">Missing Skills</h4>
          <div className="flex flex-wrap gap-2">
            {mockAnalysis.missingSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="border-red-200 text-red-700">
                <XCircle className="mr-1 h-3 w-3" />
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div>
          <h4 className="font-semibold mb-3">Strengths</h4>
          <ul className="space-y-2">
            {mockAnalysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div>
          <h4 className="font-semibold mb-3">Areas for Improvement</h4>
          <ul className="space-y-2">
            {mockAnalysis.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
