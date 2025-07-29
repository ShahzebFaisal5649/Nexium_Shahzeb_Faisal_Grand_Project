import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Validate URL format
if (typeof window !== 'undefined') {
  try {
    new URL(supabaseUrl)
  } catch (error) {
    console.error('Invalid Supabase URL:', supabaseUrl)
    throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL format: ${supabaseUrl}`)
  }
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'resume-tailor-ai'
    }
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          location: string | null
          linkedin_url: string | null
          current_job_title: string | null
          years_experience: number | null
          industry: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          location?: string | null
          linkedin_url?: string | null
          current_job_title?: string | null
          years_experience?: number | null
          industry?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          location?: string | null
          linkedin_url?: string | null
          current_job_title?: string | null
          years_experience?: number | null
          industry?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          is_master: boolean
          file_url: string | null
          file_size: number | null
          file_type: string | null
          extracted_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          is_master?: boolean
          file_url?: string | null
          file_size?: number | null
          file_type?: string | null
          extracted_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          is_master?: boolean
          file_url?: string | null
          file_size?: number | null
          file_type?: string | null
          extracted_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      job_descriptions: {
        Row: {
          id: string
          user_id: string
          company_name: string
          job_title: string
          job_url: string | null
          description_text: string
          location: string | null
          salary_range: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          job_title: string
          job_url?: string | null
          description_text: string
          location?: string | null
          salary_range?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          job_title?: string
          job_url?: string | null
          description_text?: string
          location?: string | null
          salary_range?: string | null
          created_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          resume_id: string | null
          job_description_id: string | null
          company_name: string
          job_title: string
          application_date: string
          status: string
          match_score: number | null
          notes: string | null
          application_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resume_id?: string | null
          job_description_id?: string | null
          company_name: string
          job_title: string
          application_date?: string
          status?: string
          match_score?: number | null
          notes?: string | null
          application_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resume_id?: string | null
          job_description_id?: string | null
          company_name?: string
          job_title?: string
          application_date?: string
          status?: string
          match_score?: number | null
          notes?: string | null
          application_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type-safe database client
export type SupabaseClient = typeof supabase
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Helper function for error handling
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  
  if (error?.message) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}