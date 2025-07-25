import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricsGrid } from "./MetricsGrid"
import { ChartsSection } from "./ChartsSection"
import { InsightsPanel } from "./InsightsPanel"
import { TrendingUp, Users, FileText, Target } from "lucide-react"

// Mock data - in real app, this would come from API
const mockMetrics = {
  totalApplications: 24,
  responseRate: 32,
  interviewRate: 18,
  offerRate: 8,
  averageMatchScore: 78,
  activeApplications: 12,
  totalResumes: 5,
  tailoredResumes: 18
}

const mockTrends = {
  applications: { current: 24, previous: 18, change: 33 },
  responses: { current: 8, previous: 6, change: 33 },
  interviews: { current: 4, previous: 2, change: 100 },
  offers: { current: 2, previous: 1, change: 100 }
}

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{mockTrends.applications.change}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.responseRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{mockTrends.responses.change}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.interviewRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{mockTrends.interviews.change}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Match Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.averageMatchScore}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="resumes">Resumes</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
                <CardDescription>
                  Your job application activity over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartsSection type="timeline" />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>
                  Current status of all your applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartsSection type="status" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <MetricsGrid />
        </TabsContent>

        <TabsContent value="resumes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resume Performance</CardTitle>
                <CardDescription>
                  How your different resumes are performing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartsSection type="resume-performance" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Match Score Distribution</CardTitle>
                <CardDescription>
                  Distribution of match scores across applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartsSection type="match-scores" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <InsightsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}