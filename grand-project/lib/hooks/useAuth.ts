'use client'

import { useAuthStore } from '@/lib/store/authStore'
import { AuthService, type AuthUser, type UserProfile } from '@/lib/auth'

export function useAuth() {
  const {
    user,
    profile,
    loading,
    setUser,
    setProfile,
    setLoading,
    clearAuth,
  } = useAuthStore()

  const signUp = async (email: string, password: string, userData?: { full_name?: string }) => {
    setLoading(true)
    try {
      const result = await AuthService.signUp(email, password, userData)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await AuthService.signIn(email, password)
      if (result.user) {
        setUser(result.user)
        const profile = await AuthService.getUserProfile(result.user.id)
        if (profile) {
          setProfile(profile)
        }
      }
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithMagicLink = async (email: string, redirectTo?: string) => {
    setLoading(true)
    try {
      const result = await AuthService.signInWithMagicLink(email, redirectTo)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithOAuth = async (provider: 'google' | 'github', redirectTo?: string) => {
    setLoading(true)
    try {
      const result = await AuthService.signInWithOAuth(provider, redirectTo)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await AuthService.signOut()
      clearAuth()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user) throw new Error('User not authenticated')
    
    setLoading(true)
    try {
      const updatedProfile = await AuthService.upsertUserProfile(user.id, profileData)
      setProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (newPassword: string) => {
    setLoading(true)
    try {
      const result = await AuthService.updatePassword(newPassword)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateEmail = async (newEmail: string) => {
    setLoading(true)
    try {
      const result = await AuthService.updateEmail(newEmail)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string, redirectTo?: string) => {
    setLoading(true)
    try {
      const result = await AuthService.resetPassword(email, redirectTo)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (!user) return null
    
    try {
      const profile = await AuthService.getUserProfile(user.id)
      setProfile(profile)
      return profile
    } catch (error) {
      console.error('Error refreshing profile:', error)
      return null
    }
  }

  const isAuthenticated = !!user

  return {
    // State
    user,
    profile,
    loading,
    isAuthenticated,
    
    // Actions
    signUp,
    signIn,
    signInWithMagicLink,
    signInWithOAuth,
    signOut,
    updateProfile,
    updatePassword,
    updateEmail,
    resetPassword,
    refreshProfile,
  }
}
