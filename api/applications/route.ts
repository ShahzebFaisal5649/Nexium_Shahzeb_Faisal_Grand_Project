import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { AuthService } from "@/lib/auth"
import { applicationSchema } from "@/lib/validations"
import { defaultRateLimit } from "@/lib/rate-limit"

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
const { success: rateLimitSuccess } = await defaultRateLimit.limit(ip);
  if (!rateLimitSuccess) {
    return new NextResponse("Too many requests", { status: 429 })
  }

  try {
    const user = await AuthService.getCurrentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const status = url.searchParams.get("status")
    
    const offset = (page - 1) * limit

    let query = supabase
      .from("applications")
      .select(`
        *,
        resumes:resume_id(id, title, file_url),
        job_descriptions:job_description_id(id, company_name, job_title, description_text),
        application_events(*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    const { data: applications, error } = await query

    if (error) throw error

    // Get total count for pagination
    let countQuery = supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    if (status) {
      countQuery = countQuery.eq("status", status)
    }

    const { count, error: countError } = await countQuery
    if (countError) throw countError

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error("Applications GET API Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
const { success: rateLimitSuccess } = await defaultRateLimit.limit(ip);
  if (!rateLimitSuccess) {
    return new NextResponse("Too many requests", { status: 429 })
  }

  try {
    const user = await AuthService.getCurrentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const validatedData = applicationSchema.parse(body)

    const { data: application, error } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        resume_id: validatedData.resumeId,
        job_description_id: validatedData.jobDescriptionId,
        status: validatedData.status || "applied",
        notes: validatedData.notes,
        application_url: validatedData.applicationUrl,
        application_date: validatedData.applicationDate || new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // Create initial event
    await supabase
      .from("application_events")
      .insert({
        application_id: application.id,
        event_type: "created",
        title: "Application created",
        description: "New job application submitted",
      })

    return NextResponse.json({ success: true, data: application }, { status: 201 })
  } catch (error: any) {
    console.error("Applications POST API Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}