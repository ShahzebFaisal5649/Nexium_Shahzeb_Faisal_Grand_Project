import { z } from 'zod'

// Auth validation schemas
export const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
}).refine((data: { password: any; confirmPassword: any }) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const magicLinkSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data: { newPassword: any; confirmPassword: any }) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Profile validation schemas
export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number').optional().or(z.literal('')),
  location: z.string().min(2, 'Location must be at least 2 characters').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  currentJobTitle: z.string().min(2, 'Job title must be at least 2 characters').optional().or(z.literal('')),
  yearsExperience: z.number().min(0, 'Years of experience must be 0 or greater').max(50, 'Years of experience must be 50 or less').optional(),
  industry: z.string().min(2, 'Industry must be at least 2 characters').optional().or(z.literal('')),
})

// Resume validation schemas
export const resumeUploadSchema = z.object({
  title: z.string().min(1, 'Resume title is required').max(100, 'Title must be less than 100 characters'),
  isMaster: z.boolean().default(false),
  file: z.instanceof(File, { message: 'Please select a file' })
    .refine((file: { size: number }) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file: { type: string }) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
      'File must be PDF, DOC, or DOCX format'
    ),
})

export const resumeUpdateSchema = z.object({
  title: z.string().min(1, 'Resume title is required').max(100, 'Title must be less than 100 characters'),
  isMaster: z.boolean().default(false),
})

// Job description validation schemas
export const jobDescriptionSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
  jobTitle: z.string().min(1, 'Job title is required').max(100, 'Job title must be less than 100 characters'),
  jobUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  descriptionText: z.string().min(50, 'Job description must be at least 50 characters').max(10000, 'Job description must be less than 10,000 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters').optional().or(z.literal('')),
  salaryRange: z.string().max(50, 'Salary range must be less than 50 characters').optional().or(z.literal('')),
})

// Application validation schemas
export const applicationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
  jobTitle: z.string().min(1, 'Job title is required').max(100, 'Job title must be less than 100 characters'),
  applicationDate: z.string().refine((date: string) => !isNaN(Date.parse(date)), 'Please enter a valid date'),
  status: z.enum(['applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'], {
    errorMap: () => ({ message: 'Please select a valid status' }),
  }),
  applicationUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  notes: z.string().max(1000, 'Notes must be less than 1,000 characters').optional().or(z.literal('')),
  resumeId: z.string().uuid('Please select a valid resume').optional(),
  jobDescriptionId: z.string().uuid('Please select a valid job description').optional(),
})

export const applicationUpdateSchema = z.object({
  status: z.enum(['applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'], {
    errorMap: () => ({ message: 'Please select a valid status' }),
  }),
  notes: z.string().max(1000, 'Notes must be less than 1,000 characters').optional().or(z.literal('')),
  applicationUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
})

// Tailoring validation schemas
export const tailoringRequestSchema = z.object({
  resumeId: z.string().uuid('Please select a valid resume'),
  jobDescriptionId: z.string().uuid('Please select a valid job description'),
  intensity: z.enum(['light', 'moderate', 'aggressive'], {
    errorMap: () => ({ message: 'Please select a tailoring intensity' }),
  }),
  lockedSections: z.array(z.string()).default([]),
  customInstructions: z.string().max(500, 'Custom instructions must be less than 500 characters').optional().or(z.literal('')),
})

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().max(100, 'Search query must be less than 100 characters').optional().or(z.literal('')),
  sortBy: z.enum(['date', 'name', 'score', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  filterBy: z.record(z.string(), z.any()).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
})

// Settings validation schemas
export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  applicationReminders: z.boolean().default(true),
  weeklyDigest: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
})

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'private']).default('private'),
  analyticsTracking: z.boolean().default(true),
  dataSharing: z.boolean().default(false),
})

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

export const paginatedResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
  error: z.string().optional(),
  message: z.string().optional(),
})

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a file' }),
  maxSize: z.number().default(10 * 1024 * 1024), // 10MB default
  allowedTypes: z.array(z.string()).default(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
})

// Validation helper functions
export const validateFile = (file: File, maxSize: number = 10 * 1024 * 1024, allowedTypes: string[] = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']) => {
  const errors: string[] = []
  
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`)
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not supported')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateEmail = (email: string) => {
  return z.string().email().safeParse(email)
}

export const validateUrl = (url: string) => {
  return z.string().url().safeParse(url)
}

export const validatePhoneNumber = (phone: string) => {
  return z.string().regex(/^[\+]?[1-9][\d]{0,15}$/).safeParse(phone)
}

// Type inference helpers
export type SignUpFormData = z.infer<typeof signUpSchema>
export type SignInFormData = z.infer<typeof signInSchema>
export type MagicLinkFormData = z.infer<typeof magicLinkSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type ResumeUploadFormData = z.infer<typeof resumeUploadSchema>
export type JobDescriptionFormData = z.infer<typeof jobDescriptionSchema>
export type ApplicationFormData = z.infer<typeof applicationSchema>
export type TailoringRequestFormData = z.infer<typeof tailoringRequestSchema>
export type SearchFormData = z.infer<typeof searchSchema>
export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>
export type PrivacySettingsFormData = z.infer<typeof privacySettingsSchema>
