import { supabase } from "@/lib/supabase"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
})

export interface AnalyticsData {
  metrics: {
    totalApplications: number
    responseRate: number
    interviewRate: number
    offerRate: number
    averageMatchScore: number
    activeApplications: number
    totalResumes: number
    tailoredResumes: number
  }
  trends: {
    applications: { current: number; previous: number; change: number }
    responses: { current: number; previous: number; change: number }
    interviews: { current: number; previous: number; change: number }
    offers: { current: number; previous: number; change: number }
  }
  insights: Array<{
    type: "positive" | "negative" | "neutral"
    title: string
    description: string
    impact: "high" | "medium" | "low"
    metric?: number
  }>
  recommendations: Array<{
    category: "resume" | "application" | "skills" | "strategy"
    priority: "high" | "medium" | "low"
    title: string
    description: string
    actionItems: string[]
  }>
  predictions: Array<{
    type: string
    title: string
    description: string
    confidence: number
    timeHorizon: string
  }>
}

export class AnalyticsEngine {
  async generateAnalytics(userId: string, timeRange: string = "30d"): Promise<AnalyticsData> {
    try {
      // Get date range
      const endDate = new Date()
      const startDate = new Date()
      
      switch (timeRange) {
        case "7d":
          startDate.setDate(endDate.getDate() - 7)
          break
        case "30d":
          startDate.setDate(endDate.getDate() - 30)
          break
        case "90d":
          startDate.setDate(endDate.getDate() - 90)
          break
        case "1y":
          startDate.setFullYear(endDate.getFullYear() - 1)
          break
        default:
          startDate.setDate(endDate.getDate() - 30)
      }

      // Fetch data from database
      const [applications, resumes, analyses] = await Promise.all([
        this.getApplicationsData(userId, startDate, endDate),
        this.getResumesData(userId),
        this.getAnalysesData(userId, startDate, endDate)
      ])

      // Calculate metrics
      const metrics = this.calculateMetrics(applications, resumes, analyses)
      
      // Calculate trends (compare with previous period)
      const trends = await this.calculateTrends(userId, startDate, endDate, timeRange)
      
      // Generate AI insights
      const insights = await this.generateInsights(userId)
      
      // Generate recommendations
      const recommendations = await this.generateRecommendations(userId)
      
      // Generate predictions
      const predictions = await this.generatePredictions(userId, "1_month")

      return {
        metrics,
        trends,
        insights,
        recommendations,
        predictions
      }
    } catch (error) {
      console.error("Analytics generation error:", error)
      throw new Error("Failed to generate analytics")
    }
  }

  private async getApplicationsData(userId: string, startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", userId)
      .gte("application_date", startDate.toISOString())
      .lte("application_date", endDate.toISOString())

    if (error) throw error
    return data || []
  }

  private async getResumesData(userId: string) {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", userId)

    if (error) throw error
    return data || []
  }

  private async getAnalysesData(userId: string, startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from("resume_analyses")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    if (error) throw error
    return data || []
  }

  private calculateMetrics(applications: any[], resumes: any[], analyses: any[]) {
    const totalApplications = applications.length
    const responses = applications.filter(app => 
      ["screening", "interview", "offer", "hired"].includes(app.status)
    ).length
    const interviews = applications.filter(app => 
      ["interview", "offer", "hired"].includes(app.status)
    ).length
    const offers = applications.filter(app => 
      ["offer", "hired"].includes(app.status)
    ).length
    
    const responseRate = totalApplications > 0 ? (responses / totalApplications) * 100 : 0
    const interviewRate = totalApplications > 0 ? (interviews / totalApplications) * 100 : 0
    const offerRate = totalApplications > 0 ? (offers / totalApplications) * 100 : 0
    
    const averageMatchScore = analyses.length > 0 
      ? analyses.reduce((sum, analysis) => sum + (analysis.match_score || 0), 0) / analyses.length
      : 0
    
    const activeApplications = applications.filter(app => 
      ["applied", "screening", "interview"].includes(app.status)
    ).length
    
    const tailoredResumes = resumes.filter(resume => resume.tailored_from).length

    return {
      totalApplications,
      responseRate: Math.round(responseRate),
      interviewRate: Math.round(interviewRate),
      offerRate: Math.round(offerRate),
      averageMatchScore: Math.round(averageMatchScore),
      activeApplications,
      totalResumes: resumes.length,
      tailoredResumes
    }
  }

  private async calculateTrends(userId: string, startDate: Date, endDate: Date, _timeRange: string) {
    // Calculate previous period
    const periodLength = endDate.getTime() - startDate.getTime()
    const prevEndDate = new Date(startDate.getTime())
    const prevStartDate = new Date(startDate.getTime() - periodLength)

    const [currentApps, previousApps] = await Promise.all([
      this.getApplicationsData(userId, startDate, endDate),
      this.getApplicationsData(userId, prevStartDate, prevEndDate)
    ])

    const currentResponses = currentApps.filter(app => 
      ["screening", "interview", "offer", "hired"].includes(app.status)
    ).length
    const previousResponses = previousApps.filter(app => 
      ["screening", "interview", "offer", "hired"].includes(app.status)
    ).length

    const currentInterviews = currentApps.filter(app => 
      ["interview", "offer", "hired"].includes(app.status)
    ).length
    const previousInterviews = previousApps.filter(app => 
      ["interview", "offer", "hired"].includes(app.status)
    ).length

    const currentOffers = currentApps.filter(app => 
      ["offer", "hired"].includes(app.status)
    ).length
    const previousOffers = previousApps.filter(app => 
      ["offer", "hired"].includes(app.status)
    ).length

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    return {
      applications: {
        current: currentApps.length,
        previous: previousApps.length,
        change: calculateChange(currentApps.length, previousApps.length)
      },
      responses: {
        current: currentResponses,
        previous: previousResponses,
        change: calculateChange(currentResponses, previousResponses)
      },
      interviews: {
        current: currentInterviews,
        previous: previousInterviews,
        change: calculateChange(currentInterviews, previousInterviews)
      },
      offers: {
        current: currentOffers,
        previous: previousOffers,
        change: calculateChange(currentOffers, previousOffers)
      }
    }
  }

  async generateInsights(userId: string): Promise<AnalyticsData["insights"]> {
    try {
      // Get user data for analysis
      const [applications, analyses] = await Promise.all([
        this.getApplicationsData(userId, new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date()),
        this.getAnalysesData(userId, new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date())
      ])

      const prompt = `
        Analyze this job search data and generate key insights.
        
        Applications Data:
        ${JSON.stringify(applications.map(app => ({
          status: app.status,
          company: app.company_name,
          title: app.job_title,
          date: app.application_date
        })), null, 2)}
        
        Resume Analyses Data:
        ${JSON.stringify(analyses.map(analysis => ({
          matchScore: analysis.match_score,
          skillsMatch: analysis.skills_match,
          experienceMatch: analysis.experience_match
        })), null, 2)}
        
        Return a JSON array of insights with this structure:
        [
          {
            "type": "positive|negative|neutral",
            "title": "Insight title",
            "description": "Detailed description",
            "impact": "high|medium|low",
            "metric": number (if applicable)
          }
        ]
        
        Focus on:
        1. Performance trends and patterns
        2. Success rates and conversion metrics
        3. Areas of strength and improvement
        4. Notable achievements or concerns
        5. Actionable observations
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a job search analytics expert. Generate meaningful insights from job application data."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error("No response from OpenAI")
      }

      return JSON.parse(content)
    } catch (error) {
      console.error("Insights generation error:", error)
      return [
        {
          type: "neutral",
          title: "Data Analysis",
          description: "Continue tracking your job search progress for more detailed insights.",
          impact: "low"
        }
      ]
    }
  }

  async generateRecommendations(userId: string): Promise<AnalyticsData["recommendations"]> {
    try {
      // Get comprehensive user data
      const [applications,, analyses] = await Promise.all([
        this.getApplicationsData(userId, new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date()),
        this.getResumesData(userId),
        this.getAnalysesData(userId, new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date())
      ])

      const prompt = `
        Based on this job search data, generate specific recommendations for improvement.
        
        Applications: ${applications.length} total
        Response Rate: ${applications.filter(app => ["screening", "interview", "offer", "hired"].includes(app.status)).length / Math.max(applications.length, 1) * 100}%
        Average Match Score: ${analyses.length > 0 ? analyses.reduce((sum, a) => sum + (a.match_score || 0), 0) / analyses.length : 0}
        
        Return a JSON array of recommendations with this structure:
        [
          {
            "category": "resume|application|skills|strategy",
            "priority": "high|medium|low",
            "title": "Recommendation title",
            "description": "Detailed description",
            "actionItems": ["action1", "action2", ...]
          }
        ]
        
        Focus on:
        1. Resume optimization opportunities
        2. Application strategy improvements
        3. Skill development suggestions
        4. Job search strategy enhancements
        5. Performance optimization areas
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a career coach and job search strategist. Provide specific, actionable recommendations for job search improvement."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1200,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error("No response from OpenAI")
      }

      return JSON.parse(content)
    } catch (error) {
      console.error("Recommendations generation error:", error)
      return [
        {
          category: "strategy",
          priority: "medium",
          title: "Continue Job Search Tracking",
          description: "Keep tracking your applications and resume performance for better insights.",
          actionItems: [
            "Log all job applications consistently",
            "Track response rates and feedback",
            "Analyze successful vs unsuccessful applications"
          ]
        }
      ]
    }
  }

  async generatePredictions(userId: string, timeHorizon: string): Promise<AnalyticsData["predictions"]> {
    try {
      const applications = await this.getApplicationsData(
        userId, 
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), 
        new Date()
      )

      const prompt = `
        Based on this job search performance data, generate predictions for the next ${timeHorizon}.
        
        Recent Performance:
        - Total Applications: ${applications.length}
        - Response Rate: ${applications.filter(app => ["screening", "interview", "offer", "hired"].includes(app.status)).length / Math.max(applications.length, 1) * 100}%
        - Interview Rate: ${applications.filter(app => ["interview", "offer", "hired"].includes(app.status)).length / Math.max(applications.length, 1) * 100}%
        
        Return a JSON array of predictions with this structure:
        [
          {
            "type": "success_rate|interview_likelihood|offer_probability",
            "title": "Prediction title",
            "description": "Detailed prediction",
            "confidence": number (0-100),
            "timeHorizon": "${timeHorizon}"
          }
        ]
        
        Provide realistic predictions based on current performance trends.
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a data analyst specializing in job search predictions. Provide realistic, data-driven predictions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error("No response from OpenAI")
      }

      return JSON.parse(content)
    } catch (error) {
      console.error("Predictions generation error:", error)
      return [
        {
          type: "success_rate",
          title: "Continued Progress",
          description: "Based on your current activity, continue applying consistently for best results.",
          confidence: 70,
          timeHorizon
        }
      ]
    }
  }

  async getMetric(userId: string, metric: string, timeRange: string): Promise<any> {
    // Implementation for specific metric retrieval
    const analytics = await this.generateAnalytics(userId, timeRange)
    return analytics.metrics[metric as keyof typeof analytics.metrics]
  }

  async exportData(userId: string, format: string, timeRange: string): Promise<{ url: string; fileName: string }> {
    // Implementation for data export
    // This would generate CSV/PDF files and return download URLs
    const timestamp = new Date().toISOString().split('T')[0]
    return {
      url: `/api/export/${userId}?format=${format}&range=${timeRange}`,
      fileName: `job-search-analytics-${timestamp}.${format}`
    }
  }
}
