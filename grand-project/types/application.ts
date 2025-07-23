// Core Application Types
export interface Application {
  id: string
  user_id: string
  resume_id: string | null
  job_description_id: string | null
  company_name: string
  job_title: string
  application_date: string
  status: ApplicationStatus
  match_score: number | null
  notes: string | null
  application_url: string | null
  created_at: string
  updated_at: string
}

export type ApplicationStatus = 
  | 'applied' 
  | 'screening' 
  | 'interview' 
  | 'offer' 
  | 'rejected' 
  | 'withdrawn'

// Job Description Types
export interface JobDescription {
  id: string
  user_id: string
  company_name: string
  job_title: string
  job_url: string | null
  description_text: string
  location: string | null
  salary_range: string | null
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance'
  remote_type: 'on-site' | 'remote' | 'hybrid'
  experience_level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive'
  created_at: string
}

// Job Analysis Types
export interface JobAnalysis {
  id: string
  job_description_id: string
  user_id: string
  analysis: {
    extracted_skills: {
      technical: string[]
      soft: string[]
      industry: string[]
    }
    requirements: {
      education: string[]
      experience: {
        years: number
        level: string
      }
      certifications: string[]
    }
    keywords: Array<{
      term: string
      frequency: number
      importance: number
      category: string
    }>
    company_info: {
      size: string
      industry: string
      culture: string[]
    }
    compensation: {
      salary_range?: string
      benefits: string[]
      equity: boolean
    }
  }
  processing_time: number
  ai_model: string
  created_at: string
  updated_at: string
}

// Match Analysis Types
export interface MatchAnalysis {
  id: string
  user_id: string
  resume_id: string
  job_description_id: string
  match_analysis: {
    overall_score: number
    breakdown: {
      skills_match: number
      experience_match: number
      education_match: number
      keyword_density: number
    }
    matching_elements: {
      skills: string[]
      keywords: string[]
      experience: string[]
    }
    missing_elements: {
      critical_skills: string[]
      important_keywords: string[]
      requirements: string[]
    }
    suggestions: Array<{
      type: string
      priority: 'high' | 'medium' | 'low'
      description: string
      impact: number
    }>
  }
  created_at: string
}

// Application Timeline Types
export interface ApplicationEvent {
  id: string
  application_id: string
  event_type: 'status_change' | 'interview_scheduled' | 'follow_up' | 'note_added' | 'document_sent'
  title: string
  description: string
  date: string
  created_at: string
}

export interface ApplicationTimeline {
  application_id: string
  events: ApplicationEvent[]
}

// Interview Types
export interface Interview {
  id: string
  application_id: string
  type: 'phone' | 'video' | 'in-person' | 'technical' | 'panel' | 'final'
  scheduled_date: string
  duration: number
  interviewer_name?: string
  interviewer_email?: string
  location?: string
  meeting_link?: string
  notes?: string
  outcome?: 'passed' | 'failed' | 'pending'
  feedback?: string
  created_at: string
  updated_at: string
}

// Application Statistics Types
export interface ApplicationStats {
  total: number
  applied: number
  screening: number
  interview: number
  offer: number
  rejected: number
  withdrawn: number
  average_match_score: number
  response_rate: number
  interview_rate: number
  offer_rate: number
}

// Application Metrics Types
export interface ApplicationMetrics {
  applications_this_month: number
  applications_last_month: number
  interviews_this_month: number
  interviews_last_month: number
  offers_this_month: number
  offers_last_month: number
  average_response_time: number
  top_companies: Array<{
    company: string
    applications: number
  }>
  top_job_titles: Array<{
    title: string
    applications: number
  }>
}

// Form Types
export interface ApplicationFormData {
  companyName: string
  jobTitle: string
  applicationDate: string
  status: ApplicationStatus
  applicationUrl?: string
  notes?: string
  resumeId?: string
  jobDescriptionId?: string
}

export interface JobDescriptionFormData {
  companyName: string
  jobTitle: string
  jobUrl?: string
  descriptionText: string
  location?: string
  salaryRange?: string
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance'
  remoteType: 'on-site' | 'remote' | 'hybrid'
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive'
}

export interface InterviewFormData {
  type: Interview['type']
  scheduledDate: string
  duration: number
  interviewerName?: string
  interviewerEmail?: string
  location?: string
  meetingLink?: string
  notes?: string
}

// Filter and Search Types
export interface ApplicationFilters {
  search?: string
  status?: ApplicationStatus[]
  company?: string[]
  dateRange?: {
    start: string
    end: string
  }
  matchScoreRange?: {
    min: number
    max: number
  }
}

export interface ApplicationSortOptions {
  field: 'application_date' | 'company_name' | 'job_title' | 'status' | 'match_score'
  direction: 'asc' | 'desc'
}

// State Types
export interface ApplicationState {
  applications: Application[]
  selectedApplication: Application | null
  loading: boolean
  filters: ApplicationFilters
  sortOptions: ApplicationSortOptions
  stats: ApplicationStats | null
}

// Dashboard Types
export interface ApplicationDashboard {
  recent_applications: Application[]
  upcoming_interviews: Interview[]
  application_stats: ApplicationStats
  activity_feed: ApplicationEvent[]
  recommendations: Array<{
    type: 'follow_up' | 'apply_similar' | 'update_resume'
    title: string
    description: string
    action_url?: string
  }>
}

// Export Types
export interface ApplicationExportData {
  applications: Application[]
  job_descriptions: JobDescription[]
  interviews: Interview[]
  export_date: string
  format: 'csv' | 'xlsx' | 'json'
}

// API Response Types
export interface ApplicationResponse {
  success: boolean
  data?: Application
  error?: string
  message?: string
}

export interface ApplicationListResponse {
  success: boolean
  data?: Application[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  error?: string
  message?: string
}

// Notification Types
export interface ApplicationNotification {
  id: string
  user_id: string
  application_id: string
  type: 'reminder' | 'status_update' | 'interview_scheduled' | 'follow_up'
  title: string
  message: string
  scheduled_for: string
  sent: boolean
  created_at: string
}
