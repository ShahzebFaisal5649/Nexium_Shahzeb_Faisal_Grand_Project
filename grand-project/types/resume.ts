// Core Resume Types
export interface Resume {
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

// Resume Upload Types
export interface ResumeUploadData {
  title: string
  isMaster: boolean
  file: File
}

export interface ResumeUploadProgress {
  resumeId: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}

// Resume Analysis Types
export interface ResumeSection {
  type: 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'awards'
  title: string
  content: string
  order: number
}

export interface ExperienceItem {
  title: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  bullets: string[]
  technologies?: string[]
}

export interface EducationItem {
  degree: string
  school: string
  location?: string
  graduationDate: string
  gpa?: number
  honors?: string
  relevantCoursework?: string[]
}

export interface ProjectItem {
  name: string
  description: string
  technologies: string[]
  url?: string
  githubUrl?: string
  startDate?: string
  endDate?: string
}

export interface SkillCategory {
  category: string
  skills: string[]
}

export interface ParsedResume {
  id: string
  personalInfo: {
    name: string
    email: string
    phone?: string
    location?: string
    linkedinUrl?: string
    portfolioUrl?: string
  }
  summary?: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: SkillCategory[]
  projects: ProjectItem[]
  certifications: string[]
  awards: string[]
  languages: string[]
  sections: ResumeSection[]
}

// Resume Analysis Types
export interface ResumeAnalysis {
  id: string
  resume_id: string
  user_id: string
  analysis: {
    extractedSections: {
      summary: string
      experience: ExperienceItem[]
      education: EducationItem[]
      skills: SkillCategory[]
      projects: ProjectItem[]
    }
    strengths: string[]
    improvementAreas: string[]
    atsScore: number
    readabilityScore: number
    keywordDensity: Record<string, number>
    sectionScores: Record<string, number>
  }
  created_at: string
  updated_at: string
}

// Resume Tailoring Types
export interface TailoringRequest {
  resumeId: string
  jobDescriptionId: string
  intensity: 'light' | 'moderate' | 'aggressive'
  lockedSections: string[]
  customInstructions?: string
}

export interface TailoringResult {
  id: string
  user_id: string
  original_resume_id: string
  job_description_id: string
  tailored_resume_id: string
  tailoring_request: TailoringRequest
  tailored_content: {
    sections: {
      summary?: {
        original: string
        tailored: string
        changes: string[]
      }
      experience: Array<{
        original: string
        tailored: string
        changes: string[]
      }>
      skills: {
        original: string[]
        tailored: string[]
        added: string[]
        reordered: boolean
      }
    }
  }
  improvement_metrics: {
    score_before: number
    score_after: number
    keywords_added: number
    sections_modified: number
  }
  processing_time: number
  ai_model: string
  created_at: string
}

// Resume Version Types
export interface ResumeVersion {
  id: string
  resume_id: string
  version_number: number
  changes_summary: string
  tailored_content?: string
  match_score_before?: number
  match_score_after?: number
  job_description_id?: string
  job_title?: string
  company_name?: string
  created_at: string
}

// Resume Template Types
export interface ResumeTemplate {
  id: string
  name: string
  description: string
  category: 'modern' | 'classic' | 'creative' | 'minimal' | 'professional'
  preview_url: string
  is_premium: boolean
  sections: string[]
  color_scheme: string[]
  fonts: string[]
}

// Resume Export Types
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt'
  template?: string
  includePhoto: boolean
  fontSize: number
  margins: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface ExportResult {
  id: string
  resume_id: string
  format: string
  file_url: string
  file_size: number
  created_at: string
}

// Resume Statistics Types
export interface ResumeStats {
  totalResumes: number
  masterResumes: number
  tailoredResumes: number
  averageMatchScore: number
  totalDownloads: number
  recentActivity: ResumeActivity[]
}

export interface ResumeActivity {
  id: string
  type: 'upload' | 'tailor' | 'download' | 'share' | 'delete'
  resume_id: string
  resume_title: string
  description: string
  created_at: string
}

// Resume Sharing Types
export interface ResumeShare {
  id: string
  resume_id: string
  user_id: string
  share_token: string
  recipient_email?: string
  expires_at?: string
  password_protected: boolean
  download_count: number
  created_at: string
}

// Resume Feedback Types
export interface ResumeFeedback {
  id: string
  resume_id: string
  user_id: string
  feedback_type: 'ai' | 'human' | 'peer'
  overall_score: number
  sections: Array<{
    section: string
    score: number
    feedback: string
    suggestions: string[]
  }>
  strengths: string[]
  improvements: string[]
  created_at: string
}

// Form Types
export interface ResumeFormData {
  title: string
  isMaster: boolean
}

export interface ResumeUpdateFormData {
  title: string
  isMaster: boolean
}

// Filter and Search Types
export interface ResumeFilters {
  search?: string
  isMaster?: boolean
  dateRange?: {
    start: string
    end: string
  }
  fileType?: string[]
  tags?: string[]
}

export interface ResumeSortOptions {
  field: 'title' | 'created_at' | 'updated_at' | 'file_size'
  direction: 'asc' | 'desc'
}

// State Types
export interface ResumeState {
  resumes: Resume[]
  selectedResume: Resume | null
  loading: boolean
  uploading: boolean
  uploadProgress: number
  filters: ResumeFilters
  sortOptions: ResumeSortOptions
}

// API Response Types
export interface ResumeResponse {
  success: boolean
  data?: Resume
  error?: string
  message?: string
}

export interface ResumeListResponse {
  success: boolean
  data?: Resume[]
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