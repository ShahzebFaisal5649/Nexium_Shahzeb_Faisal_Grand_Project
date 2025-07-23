import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@supabase/supabase-js'
import { UserProfile } from '@/lib/auth'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  initialized: boolean
}

interface AuthActions {
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  clearAuth: () => void
  updateProfile: (updates: Partial<UserProfile>) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
  (set: (arg0: Partial<AuthState & AuthActions>) => void, get: () => AuthState & AuthActions) => ({
    // Initial state
    user: null,
    profile: null,
    loading: true,
    initialized: false,

    // Actions
    setUser: (user: User | null) => {
      set({ user })
    },

    setProfile: (profile: UserProfile | null) => {
      set({ profile })
    },

    setLoading: (loading: boolean) => {
      set({ loading })
    },

    setInitialized: (initialized: boolean) => {
      set({ initialized })
    },

    clearAuth: () => {
      set({
        user: null,
        profile: null,
        loading: false,
      })
    },

    updateProfile: (updates: Partial<UserProfile>) => {
      const { profile } = get()
      if (profile) {
        set({
          profile: {
            ...profile,
            ...updates,
            updated_at: new Date().toISOString(),
          }
        })
      }
    },
  }),
  {
    name: 'auth-storage',
    partialize: (state: AuthState & AuthActions) => ({
      user: state.user,
      profile: state.profile,
      initialized: state.initialized,
      loading: state.loading,
    }),
  }
))