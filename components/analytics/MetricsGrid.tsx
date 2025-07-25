import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Calendar, Clock, Target, Award } from "lucide-react"

// Mock data - in real app, this would come from API
const mockMetrics = {
  thisMonth: {
    applications: 8,
    responses: 3,
    interviews: 2,
    offers: 1
  },
  lastMonth: {
    applications: 6,
    responses: 2,
    interviews: 1,
    offers: 0
  },
  averageResponseTime: 5.2,
  averageInterviewTime: 12.8,
  topCompanies: [
    { name: "Google", applications: 3, responses: 1 },
    { name: "Microsoft", applications: 2, responses: 1 },
    { name: "Amazon", applications: 2, responses: 0 },
    { name: "Meta", applications: 1, responses: 1 }
  ],
  topJobTitles: [
    { title: "Software Engineer", applications: 5, avgScore: 82 },
    { title: "Frontend Developer", applications: 3, avgScore: 78 },
    { title: "Full Stack Developer", applications: 2, avgScore: 85 }
  ]
}

export function MetricsGrid() {
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Monthly Comparison */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Monthly Performance
          </CardTitle>
          <CardDescription>
            Comparison between this month and last month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Applications</span>
                <div className="flex items-center space-x-1">
                  {getChangeIcon(calculateChange(mockMetrics.thisMonth.applications, mockMetrics.lastMonth.applications))}
                  <span className={`text-sm ${getChangeColor(calculateChange(mockMetrics.thisMonth.applications, mockMetrics.lastMonth.applications))}`}>
                    {calculateChange(mockMetrics.thisMonth.applications, mockMetrics.lastMonth.applications)}%
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold">{mockMetrics.thisMonth.applications}</div>
              <div className="text-xs text-muted-foreground">vs {mockMetrics.lastMonth.applications} last month</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Responses</span>
                <div className="flex items-center space-x-1">
                  {getChangeIcon(calculateChange(mockMetrics.thisMonth.responses, mockMetrics.lastMonth.responses))}
                  <span className={`text-sm ${getChangeColor(calculateChange(mockMetrics.thisMonth.responses, mockMetrics.lastMonth.responses))}`}>
                    {calculateChange(mockMetrics.thisMonth.responses, mockMetrics.lastMonth.responses)}%
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold">{mockMetrics.thisMonth.responses}</div>
              <div className="text-xs text-muted-foreground">vs {mockMetrics.lastMonth.responses} last month</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Interviews</span>
                <div className="flex items-center space-x-1">
                  {getChangeIcon(calculateChange(mockMetrics.thisMonth.interviews, mockMetrics.lastMonth.interviews))}
                  <span className={`text-sm ${getChangeColor(calculateChange(mockMetrics.thisMonth.interviews, mockMetrics.lastMonth.interviews))}`}>
                    {calculateChange(mockMetrics.thisMonth.interviews, mockMetrics.lastMonth.interviews)}%
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold">{mockMetrics.thisMonth.interviews}</div>
              <div className="text-xs text-muted-foreground">vs {mockMetrics.lastMonth.interviews} last month</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Offers</span>
                <div className="flex items-center space-x-1">
                  {getChangeIcon(calculateChange(mockMetrics.thisMonth.offers, mockMetrics.lastMonth.offers))}
                  <span className={`text-sm ${getChangeColor(calculateChange(mockMetrics.thisMonth.offers, mockMetrics.lastMonth.offers))}`}>
                    {calculateChange(mockMetrics.thisMonth.offers, mockMetrics.lastMonth.offers)}%
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold">{mockMetrics.thisMonth.offers}</div>
              <div className="text-xs text-muted-foreground">vs {mockMetrics.lastMonth.offers} last month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Response Times */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Response Times
          </CardTitle>
          <CardDescription>
            Average time to hear back from companies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Initial Response</span>
              <span className="text-sm text-muted-foreground">{mockMetrics.averageResponseTime} days</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Interview Scheduling</span>
              <span className="text-sm text-muted-foreground">{mockMetrics.averageInterviewTime} days</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Top Companies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Top Companies
          </CardTitle>
          <CardDescription>
            Companies you've applied to most
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMetrics.topCompanies.map((company, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{company.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {company.applications} applications
                  </div>
                </div>
                <Badge variant={company.responses > 0 ? "default" : "secondary"}>
                  {company.responses} responses
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Job Titles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Job Title Performance
          </CardTitle>
          <CardDescription>
            Performance by job title
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMetrics.topJobTitles.map((job, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{job.title}</div>
                  <Badge variant="outline">{job.avgScore}% match</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{job.applications} applications</span>
                  <Progress value={job.avgScore} className="w-20 h-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
