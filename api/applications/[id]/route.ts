import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { AuthService } from "@/lib/auth"
import { applicationUpdateSchema } from "@/lib/validations"
import { apiRateLimit } from "@/lib/rate-limit"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { success: rateLimitSuccess } = await apiRateLimit.limit(request.ip!)
  if (!rateLimitSuccess) {
    return new NextResponse("Too many requests", { status: 429 })
  }

  try {
    const { user, error: authError } = await AuthService.getCurrentUser()
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { data: application, error } = await supabase
      .from("applications")
      .select(`
        *,
        resumes:resume_id(id, title, file_url),
        job_descriptions:job_description_id(id, company_name, job_title, description_text),
        application_events(*)
      `)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return new NextResponse("Application not found", { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ success: true, data: application })
  } catch (error: any) {
    console.error("Application GET API Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const validatedData = applicationUpdateSchema.parse(body)

    // Get current application to check for status changes
    const { data: currentApp, error: fetchError } = await supabase
      .from("applications")
      .select("status")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return new NextResponse("Application not found", { status: 404 })
      }
      throw fetchError
    }

    const { data: application, error } = await supabase
      .from("applications")
      .update({
        status: validatedData.status,
        notes: validatedData.notes,
        application_url: validatedData.applicationUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    // Create event if status changed
    if (validatedData.status && validatedData.status !== currentApp.status) {
      await supabase
        .from("application_events")
        .insert({
          application_id: params.id,
          event_type: "status_change",
          title: `Status changed to ${validatedData.status}`,
          description: `Application status updated from ${currentApp.status} to ${validatedData.status}`,
        })
    }

    return NextResponse.json({ success: true, data: application })
  } catch (error: any) {
    console.error("Application PUT API Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { success: rateLimitSuccess } = await apiRateLimit.limit(request.ip!)
  if (!rateLimitSuccess) {
    return new NextResponse("Too many requests", { status: 429 })
  }

  try {
    const { user, error: authError } = await AuthService.getCurrentUser()
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id)

    if (error) {
      if (error.code === "PGRST116") {
        return new NextResponse("Application not found", { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ success: true, message: "Application deleted successfully" })
  } catch (error: any) {
    console.error("Application DELETE API Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
