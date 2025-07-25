import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
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