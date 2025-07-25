import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Target,
  Calendar,
  Award
} from "lucide-react"

// Mock insights data
const mockInsights = {
  keyFindings: [
    {
      type: "positive" as const,
      title: "Strong Interview Conversion",
      description: "Your interview-to-offer rate is 50%, which is above the industry average of 30%.",
      impact: "high" as const,
      metric: 50
    },
    {
      type: "negative" as const,
      title: "Low Response Rate",
      description: "Your application response rate is 25%, below the industry average of 35%.",
      impact: "medium" as const,
      metric: 25
    },
    {
      type: "neutral" as const,
      title: "Consistent Application Volume",
      description: "You've maintained steady application volume over the past 3 months.",
      impact: "low" as const,
      metric: 7
    }
  ],
  recommendations: [
    {
      category: "resume" as const,
      priority: "high" as const,
      title: "Optimize Resume Keywords",
      description: "Your resumes are missing key industry terms. Adding relevant keywords could improve your match scores by 15-20%.",
      actionItems: [
        "Add cloud computing skills (AWS, Azure)",
        "Include more specific programming languages",
        "Quantify achievements with metrics"
      ]
    },
    {
      category: "application" as const,
      priority: "medium" as const,
      title: "Diversify Application Strategy",
      description: "You're applying primarily to large tech companies. Consider mid-size companies for better response rates.",
      actionItems: [
        "Research mid-size tech companies",
        "Apply to startups in your field",
        "Consider remote-first companies"
      ]
    },
    {
      category: "skills" as const,
      priority: "medium" as const,
      title: "Skill Gap Analysis",
      description: "Based on job descriptions you've applied to, consider learning these in-demand skills.",
      actionItems: [
        "Learn Docker and containerization",
        "Get familiar with microservices architecture",
        "Practice system design interviews"
      ]
    }
  ],
  alerts: [
    {
      type: "warning" as const,
      title: "Application Slowdown",
      message: "You've applied to 40% fewer jobs this month compared to last month.",
      actionRequired: true
    },
    {
      type: "info" as const,
      title: "Follow-up Reminder",
      message: "You have 3 applications from last week that haven't received responses yet.",
      actionRequired: false
    }
  ],
  predictions: [
    {
      type: "success_rate" as const,
      title: "Projected Success Rate",
      description: "Based on your current performance, you're likely to receive 2-3 offers in the next month.",
      confidence: 78,
      timeHorizon: "1_month" as const
    }
  ]
}

export function InsightsPanel() {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "negative":
        return <TrendingDown className="h-5 w-5 text-red-600" />
      default:
        return <TrendingUp className="h-5 w-5 text-blue-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
        return "border-green-200 bg-green-50"
      case "negative":
        return "border-red-200 bg-red-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      default:
        return "secondary"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "resume":
        return <Target className="h-4 w-4" />
      case "application":
        return <Calendar className="h-4 w-4" />
      case "skills":
        return <Award className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Findings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Key Findings
          </CardTitle>
          <CardDescription>
            Important insights about your job search performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockInsights.keyFindings.map((finding, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getInsightColor(finding.type)}`}>
              <div className="flex items-start space-x-3">
                {getInsightIcon(finding.type)}
                <div className="flex-1">
                  <h4 className="font-semibold">{finding.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{finding.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{finding.impact} impact</Badge>
                    <span className="text-sm font-medium">{finding.metric}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5" />
            Recommendations
          </CardTitle>
          <CardDescription>
            Actionable suggestions to improve your job search success
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockInsights.recommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(rec.category)}
                  <h4 className="font-semibold">{rec.title}</h4>
                </div>
                <Badge variant={getPriorityColor(rec.priority)}>
                  {rec.priority} priority
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Action Items:</h5>
                <ul className="space-y-1">
                  {rec.actionItems.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Alerts & Notifications
          </CardTitle>
          <CardDescription>
            Important updates and reminders for your job search
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockInsights.alerts.map((alert, index) => (
            <Alert key={index} className={alert.type === "warning" ? "border-yellow-200 bg-yellow-50" : ""}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <strong>{alert.title}</strong>
                  <p className="text-sm mt-1">{alert.message}</p>
                </div>
                {alert.actionRequired && (
                  <Button size="sm" variant="outline">
                    Take Action
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Predictions
          </CardTitle>
          <CardDescription>
            AI-powered predictions based on your current performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockInsights.predictions.map((prediction, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{prediction.title}</h4>
                <Badge variant="outline">{prediction.confidence}% confidence</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{prediction.description}</p>
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Time horizon:</span>
                <Badge variant="secondary">Next month</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
