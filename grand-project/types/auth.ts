import { User } from '@supabase/supabase-js'

// User Profile Types
export interface UserProfile {
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

// Extended User Type
export interface AuthUser extends User {
  profile?: UserProfile
}

// Authentication Form Types
export interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
  fullName?: string
}

export interface SignInFormData {
  email: string
  password: string
}

export interface MagicLinkFormData {
  email: string
}

export interface ResetPasswordFormData {
  email: string
}

export interface UpdatePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ProfileFormData {
  fullName: string
  phone?: string
  location?: string
  linkedinUrl?: string
  currentJobTitle?: string
  yearsExperience?: number
  industry?: string
}

// Authentication State Types
export interface AuthState {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  initialized: boolean
}

// Authentication Context Types
export interface AuthContextType {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  signUp: (email: string, password: string, userData?: { full_name?: string }) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInWithMagicLink: (email: string, redirectTo?: string) => Promise<any>
  signInWithOAuth: (provider: 'google' | 'github', redirectTo?: string) => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (profileData: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) => Promise<UserProfile>
  updatePassword: (newPassword: string) => Promise<any>
  updateEmail: (newEmail: string) => Promise<any>
  resetPassword: (email: string, redirectTo?: string) => Promise<any>
  refreshProfile: () => Promise<UserProfile | null>
}

// OAuth Provider Types
export type OAuthProvider = 'google' | 'github' | 'linkedin'

// Session Types
export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at: number
  token_type: string
  user: AuthUser
}

// Error Types
export interface AuthError {
  message: string
  status?: number
  code?: string
}

// API Response Types
export interface AuthResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Permission Types
export interface UserPermissions {
  canUploadResumes: boolean
  canTailorResumes: boolean
  canViewAnalytics: boolean
  canExportData: boolean
  maxResumes: number
  maxApplications: number
}

// Subscription Types
export interface UserSubscription {
  id: string
  user_id: string
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

// Settings Types
export interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  applicationReminders: boolean
  weeklyDigest: boolean
  marketingEmails: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private'
  analyticsTracking: boolean
  dataSharing: boolean
}

export interface UserSettings {
  notifications: NotificationSettings
  privacy: PrivacySettings
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
}

// Onboarding Types
export interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
}

export interface OnboardingState {
  currentStep: number
  steps: OnboardingStep[]
  completed: boolean
  skipped: boolean
}

// Activity Types
export interface UserActivity {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id: string
  metadata: Record<string, any>
  ip_address: string
  user_agent: string
  created_at: string
}

// Audit Log Types
export interface AuditLog {
  id: string
  user_id: string
  action: 'create' | 'read' | 'update' | 'delete'
  resource: string
  resource_id: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address: string
  user_agent: string
  created_at: string
}