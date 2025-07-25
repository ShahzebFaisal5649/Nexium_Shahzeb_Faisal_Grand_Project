import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, TrendingUp, TrendingDown } from "lucide-react"

interface MatchScoreProps {
  score?: number
  previousScore?: number
  breakdown?: {
    skills: number
    experience: number
    education: number
    keywords: number
  }
}

export function MatchScore({ 
  score = 78, 
  previousScore = 65,
  breakdown = {
    skills: 85,
    experience: 72,
    education: 90,
    keywords: 65
  }
}: MatchScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  const improvement = score - previousScore
  const isImprovement = improvement > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Match Score
        </CardTitle>
        <CardDescription>
          How well your resume matches this job posting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBackground(score)}`}>
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Overall Match</h3>
            {previousScore && (
              <div className="flex items-center justify-center space-x-2">
                {isImprovement ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm ${isImprovement ? 'text-green-600' : 'text-red-600'}`}>
                  {isImprovement ? '+' : ''}{improvement}% from previous
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Score Interpretation */}
        <div className="space-y-2">
          <h4 className="font-semibold">Score Interpretation</h4>
          {score >= 80 && (
            <Badge className="bg-green-100 text-green-800">
              Excellent Match - High chance of getting noticed
            </Badge>
          )}
          {score >= 60 && score < 80 && (
            <Badge className="bg-yellow-100 text-yellow-800">
              Good Match - Consider some improvements
            </Badge>
          )}
          {score < 60 && (
            <Badge className="bg-red-100 text-red-800">
              Needs Improvement - Significant tailoring required
            </Badge>
          )}
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold">Breakdown</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Skills</span>
              <span className={`font-medium ${getScoreColor(breakdown.skills)}`}>
                {breakdown.skills}%
              </span>
            </div>
            <Progress value={breakdown.skills} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Experience</span>
              <span className={`font-medium ${getScoreColor(breakdown.experience)}`}>
                {breakdown.experience}%
              </span>
            </div>
            <Progress value={breakdown.experience} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Education</span>
              <span className={`font-medium ${getScoreColor(breakdown.education)}`}>
                {breakdown.education}%
              </span>
            </div>
            <Progress value={breakdown.education} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Keywords</span>
              <span className={`font-medium ${getScoreColor(breakdown.keywords)}`}>
                {breakdown.keywords}%
              </span>
            </div>
            <Progress value={breakdown.keywords} className="h-2" />
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Quick Tips</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            {score < 80 && (
              <>
                <li>• Add more relevant keywords from the job description</li>
                <li>• Highlight matching skills and technologies</li>
                <li>• Quantify your achievements with numbers</li>
              </>
            )}
            {score >= 80 && (
              <>
                <li>• Your resume is well-matched to this position</li>
                <li>• Consider minor tweaks for even better alignment</li>
                <li>• Focus on customizing your cover letter</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
