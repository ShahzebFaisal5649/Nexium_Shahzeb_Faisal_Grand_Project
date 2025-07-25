import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { AuthService } from "@/lib/auth"
import { applicationSchema, applicationUpdateSchema } from "@/lib/validations"
import { apiRateLimit } from "@/lib/rate-limit"

export async function GET(request: Request) {
  const { success: rateLimitSuccess } = await apiRateLimit.limit(request.ip!)
  if (!rateLimitSuccess) {
    return new NextResponse("Too many requests", { status: 429 })
  }

  try {
    const { user, error: authError } = await AuthService.getCurrentUser()
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "20")
    const status = url.searchParams.get("status")
    const company = url.searchParams.get("company")
    const sortBy = url.searchParams.get("sortBy") || "application_date"
    const sortOrder = url.searchParams.get("sortOrder") || "desc"

    let query = supabase
      .from("applications")
      .select(`
        *,
        resumes:resume_id(id, title),
        job_descriptions:job_description_id(id, company_name, job_title)
      `)
      .eq("user_id", user.id)

    // Apply filters
    if (status) {
      query = query.eq("status", status)
    }
    if (company) {
      query = query.ilike("company_name", `%${company}%`)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: applications, error } = await query

    if (error) throw error

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    const totalPages = Math.ceil((totalCount || 0) / limit)

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error: any) {
    console.error("Applications API Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { success: rateLimitSuccess } = await apiRateLimit.limit(request.ip!)
  if (!rateLimitSuccess) {
    return new NextResponse("Too many requests", { status: 429 })
  }

  try {
    const { user, error: authError } = await AuthService.getCurrentUser()
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const validatedData = applicationSchema.parse(body)

    const { data: application, error } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        company_name: validatedData.companyName,
        job_title: validatedData.jobTitle,
        application_date: validatedData.applicationDate,
        status: validatedData.status,
        application_url: validatedData.applicationUrl,
        notes: validatedData.notes,
        resume_id: validatedData.resumeId,
        job_description_id: validatedData.jobDescriptionId,
      })
      .select()
      .single()

    if (error) throw error

    // Create application event
    await supabase
      .from("application_events")
      .insert({
        application_id: application.id,
        event_type: "status_change",
        title: "Application submitted",
        description: `Applied to ${validatedData.jobTitle} at ${validatedData.companyName}`,
      })

    return NextResponse.json({ success: true, data: application }, { status: 201 })
  } catch (error: any) {
    console.error("Application Creation API Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}