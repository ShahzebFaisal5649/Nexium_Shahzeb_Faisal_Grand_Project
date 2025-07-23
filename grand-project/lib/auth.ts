import { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface AuthUser extends User {
  profile?: UserProfile
}

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

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, userData?: { full_name?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })

    if (error) throw error
    return data
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  // Sign in with magic link
  static async signInWithMagicLink(email: string, redirectTo?: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    })

    if (error) throw error
    return data
  }

  // Sign in with OAuth provider
  static async signInWithOAuth(provider: 'google' | 'github', redirectTo?: string) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    })

    if (error) throw error
    return data
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser & { profile: UserProfile | null } | null> {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) throw error
  if (!user) return null

  // Fetch user profile
  const profile = await this.getUserProfile(user.id)
  if (!profile) {
  throw new Error('User profile not found');
}

return {
  ...user,
  profile,
}
}

  // Get user profile
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist, return null
        return null
      }
      throw error
    }

    return data
  }

  // Create or update user profile
  static async upsertUserProfile(userId: string, profileData: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update password
  static async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
    return data
  }

  // Update email
  static async updateEmail(newEmail: string) {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
    })

    if (error) throw error
    return data
  }

  // Reset password
  static async resetPassword(email: string, redirectTo?: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (error) throw error
    return data
  }

  // Verify email
  static async verifyEmail(token: string, type: 'signup' | 'recovery' | 'email_change') {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type,
    })

    if (error) throw error
    return data
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  }

  // Get session
  static async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  }

  // Refresh session
  static async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession()
    if (error) throw error
    return data
  }
}

// Utility functions for client-side auth checks
export const requireAuth = async (): Promise<AuthUser> => {
  const user = await AuthService.getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export const getAuthHeaders = async (): Promise<{ Authorization: string }> => {
  const session = await AuthService.getSession()
  if (!session?.access_token) {
    throw new Error('No valid session found')
  }
  
  return {
    Authorization: `Bearer ${session.access_token}`,
  }
}

// Auth guard for API routes
export const withAuth = (handler: (req: any, res: any, user: AuthUser) => Promise<any>) => {
  return async (req: any, res: any) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' })
      }

      const token = authHeader.split(' ')[1]
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (error || !user) {
        return res.status(401).json({ error: 'Invalid or expired token' })
      }

      // Fetch user profile
      const profile = await AuthService.getUserProfile(user.id);
if (profile === null) {
  throw new Error('User profile not found');
}
const authUser: AuthUser = { ...user, profile };

      return await handler(req, res, authUser)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}
