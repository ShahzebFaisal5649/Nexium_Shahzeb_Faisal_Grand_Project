import { NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"
import { AnalyticsEngine } from "@/ai/utils/analyticsEngine"

// Initialize rate limiter
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per minute
})

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('cf-connecting-ip') || 
             'unknown'
  
  // Use the rate limiter correctly
  const { isRateLimited } = limiter.check({} as any, 10, ip) // 10 requests per minute
  
  if (isRateLimited) {
    return new NextResponse("Too many requests", { status: 429 })
  }

  try {
    const authResult = await AuthService.getCurrentUser()
    
    if (!authResult) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id: userId } = authResult
    const url = new URL(request.url)
    const timeRange = url.searchParams.get("timeRange") || "30d"
    const metric = url.searchParams.get("metric")

    const analyticsEngine = new AnalyticsEngine()

    if (metric) {
      const data = await analyticsEngine.getMetric(userId, metric, timeRange)
      return NextResponse.json({ success: true, data })
    }

    const analytics = await analyticsEngine.generateAnalytics(userId, timeRange)
    return NextResponse.json({ success: true, data: analytics })

  } catch (error: unknown) {
    console.error("Analytics API Error:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('cf-connecting-ip') || 
             'unknown'
  
  // Use the rate limiter correctly
  const { isRateLimited } = limiter.check({} as any, 10, ip) // 10 requests per minute
  
  if (isRateLimited) {
    return new NextResponse("Too many requests", { status: 429 })
  }

  try {
    const authResult = await AuthService.getCurrentUser()
    
    if (!authResult) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id: userId } = authResult
    const body = await request.json()
    const { action } = body

    const analyticsEngine = new AnalyticsEngine()

    switch (action) {
      case "insights": {
        const insights = await analyticsEngine.generateInsights(userId)
        return NextResponse.json({ success: true, data: insights })
      }

      case "predictions": {
        const { timeHorizon = "1_month" } = body
        const predictions = await analyticsEngine.generatePredictions(userId, timeHorizon)
        return NextResponse.json({ success: true, data: predictions })
      }

      case "recommendations": {
        const recommendations = await analyticsEngine.generateRecommendations(userId)
        return NextResponse.json({ success: true, data: recommendations })
      }

      case "export": {
        const { format = "csv", timeRange = "30d" } = body
        const exportData = await analyticsEngine.exportData(userId, format, timeRange)
        return NextResponse.json({ 
          success: true, 
          data: {
            downloadUrl: exportData.url,
            fileName: exportData.fileName,
            format,
          }
        })
      }

      default:
        return new NextResponse("Invalid action", { status: 400 })
    }
  } catch (error: unknown) {
    console.error("Analytics Action API Error:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}