import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { AuthService } from "@/lib/auth"
import { jobDescriptionSchema } from "@/lib/validations"
import { rateLimit } from "@/lib/rate-limit"
import { JobDescriptionAnalyzer } from "@/ai/utils/jobDescriptionAnalyzer"

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
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "20")
    const company = url.searchParams.get("company")
    const jobTitle = url.searchParams.get("jobTitle")

    let query = supabase
      .from("job_descriptions")
      .select("*")
      .eq("user_id", userId)

    if (company) {
      query = query.ilike("company_name", `%${company}%`)
    }
    if (jobTitle) {
      query = query.ilike("job_title", `%${jobTitle}%`)
    }

    const { data: jobDescriptions, error } = await query
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) throw error

    return NextResponse.json({ success: true, data: jobDescriptions })
  } catch (error: unknown) {
    console.error("Job Descriptions API Error:", error)
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
    const validatedData = jobDescriptionSchema.parse(body)

    const analyzer = new JobDescriptionAnalyzer()
    const analysis = await analyzer.analyzeJobDescription(validatedData.descriptionText)

    const { data: jobDescription, error } = await supabase
      .from("job_descriptions")
      .insert({
        user_id: userId,
        company_name: validatedData.companyName,
        job_title: validatedData.jobTitle,
        description_text: validatedData.descriptionText,
        job_url: validatedData.jobUrl,
        location: validatedData.location,
        salary_range: validatedData.salaryRange,
        required_skills: analysis.requiredSkills,
        preferred_skills: analysis.preferredSkills,
        experience_level: analysis.experienceLevel,
        education_requirements: analysis.educationRequirements,
        keywords: analysis.keywords,
        analysis_data: analysis,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      { 
        success: true, 
        data: jobDescription,
        analysis 
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error("Job Description Creation API Error:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}