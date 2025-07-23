// Base API Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

export interface PaginatedResponse<T = any> {
  success: boolean
  data: T[]
  pagination: {
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

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}

// Request Types
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  [key: string]: any
}

export interface SearchParams {
  q?: string
  filters?: FilterParams
  sort?: SortParams
  pagination?: PaginationParams
}

// Auth API Types
export interface AuthApiRequest {
  email: string
  password?: string
  provider?: 'google' | 'github' | 'linkedin'
  redirectTo?: string
}

export interface AuthApiResponse {
  user: any
  session: any
  profile?: any
}

export interface TokenRefreshRequest {
  refreshToken: string
}

export interface TokenRefreshResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// Resume API Types
export interface ResumeUploadRequest {
  title: string
  isMaster: boolean
  file: File
}

export interface ResumeUpdateRequest {
  title?: string
  isMaster?: boolean
}

export interface ResumeAnalysisRequest {
  resumeId: string
  analysisType: 'basic' | 'detailed' | 'ats'
}

export interface ResumeTailoringRequest {
  resumeId: string
  jobDescriptionId: string
  intensity: 'light' | 'moderate' | 'aggressive'
  lockedSections?: string[]
  customInstructions?: string
}

// Job Description API Types
export interface JobDescriptionRequest {
  companyName: string
  jobTitle: string
  jobUrl?: string
  descriptionText: string
  location?: string
  salaryRange?: string
  employmentType?: string
  remoteType?: string
  experienceLevel?: string
}

export interface JobAnalysisRequest {
  jobDescriptionId: string
  analysisDepth: 'basic' | 'detailed'
}

export interface JobMatchRequest {
  resumeId: string
  jobDescriptionId: string
}

// Application API Types
export interface ApplicationRequest {
  companyName: string
  jobTitle: string
  applicationDate: string
  status: string
  applicationUrl?: string
  notes?: string
  resumeId?: string
  jobDescriptionId?: string
}

export interface ApplicationUpdateRequest {
  status?: string
  notes?: string
  applicationUrl?: string
}

export interface ApplicationBulkUpdateRequest {
  applicationIds: string[]
  updates: ApplicationUpdateRequest
}

// Analytics API Types
export interface AnalyticsRequest {
  dateRange: {
    start: string
    end: string
  }
  metrics?: string[]
  groupBy?: string
  filters?: FilterParams
}

export interface MetricsRequest {
  metric: string
  timeframe: 'day' | 'week' | 'month' | 'quarter' | 'year'
  startDate?: string
  endDate?: string
}

export interface InsightsRequest {
  analysisType: 'performance' | 'trends' | 'recommendations'
  includeComparisons?: boolean
  includePredictions?: boolean
}

// File Upload Types
export interface FileUploadRequest {
  file: File
  folder?: string
  public?: boolean
}

export interface FileUploadResponse {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  publicUrl?: string
  uploadedAt: string
}

export interface FileDeleteRequest {
  fileId: string
  permanent?: boolean
}

// Bulk Operations Types
export interface BulkOperationRequest<T = any> {
  operation: 'create' | 'update' | 'delete'
  items: T[]
  options?: {
    skipValidation?: boolean
    continueOnError?: boolean
  }
}

export interface BulkOperationResponse<T = any> {
  success: boolean
  results: Array<{
    item: T
    success: boolean
    error?: string
  }>
  summary: {
    total: number
    successful: number
    failed: number
  }
}

// Export/Import Types
export interface ExportRequest {
  format: 'csv' | 'xlsx' | 'json' | 'pdf'
  entityType: 'resumes' | 'applications' | 'analytics'
  filters?: FilterParams
  options?: {
    includeMetadata?: boolean
    includeFiles?: boolean
  }
}

export interface ExportResponse {
  exportId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  downloadUrl?: string
  expiresAt?: string
  createdAt: string
}

export interface ImportRequest {
  format: 'csv' | 'xlsx' | 'json'
  entityType: 'resumes' | 'applications'
  file: File
  options?: {
    skipDuplicates?: boolean
    validateOnly?: boolean
  }
}

export interface ImportResponse {
  importId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  summary?: {
    total: number
    imported: number
    skipped: number
    failed: number
  }
  errors?: Array<{
    row: number
    field: string
    message: string
  }>
}

// Webhook Types
export interface WebhookEvent {
  id: string
  type: string
  data: Record<string, any>
  timestamp: string
  source: string
}

export interface WebhookRequest {
  url: string
  events: string[]
  secret?: string
  active?: boolean
}

// Rate Limiting Types
export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

export interface RateLimitResponse {
  rateLimitExceeded: boolean
  rateLimitInfo: RateLimitInfo
}

// Health Check Types
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  services: Record<string, {
    status: 'up' | 'down'
    responseTime?: number
    error?: string
  }>
  version: string
  uptime: number
}

// API Configuration Types
export interface ApiConfig {
  baseUrl: string
  timeout: number
  retries: number
  headers: Record<string, string>
  interceptors?: {
    request?: Array<(config: any) => any>
    response?: Array<(response: any) => any>
  }
}

// HTTP Method Types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// Request Configuration Types
export interface RequestConfig {
  method: HttpMethod
  url: string
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
  timeout?: number
  withCredentials?: boolean
}

// Response Types
export interface HttpResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
  config: RequestConfig
}

// Error Response Types
export interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: Record<string, any>
  }
  status: number
  timestamp: string
}

// API Client Types
export interface ApiClient {
  get<T = any>(url: string, config?: Partial<RequestConfig>): Promise<T>
  post<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T>
  put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T>
  patch<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T>
  delete<T = any>(url: string, config?: Partial<RequestConfig>): Promise<T>
  upload<T = any>(url: string, file: File, config?: Partial<RequestConfig>): Promise<T>
}

// Validation Types
export interface ValidationError {
  field: string
  message: string
  code: string
  value?: any
}

export interface ValidationResponse {
  valid: boolean
  errors: ValidationError[]
}

// Cache Types
export interface CacheConfig {
  ttl: number
  key: string
  tags?: string[]
}

export interface CacheResponse<T = any> {
  data: T
  cached: boolean
  cacheKey: string
  expiresAt?: string
}
