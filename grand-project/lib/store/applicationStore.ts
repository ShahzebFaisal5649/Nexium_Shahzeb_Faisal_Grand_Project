import { create } from 'zustand'

export interface Application {
  id: string
  user_id: string
  resume_id: string | null
  job_description_id: string | null
  company_name: string
  job_title: string
  application_date: string
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
  match_score: number | null
  notes: string | null
  application_url: string | null
  created_at: string
  updated_at: string
}

interface ApplicationState {
  applications: Application[]
  loading: boolean
  selectedApplication: Application | null
  filters: {
    status?: string
    company?: string
    dateRange?: { start: string; end: string }
  }
  sortBy: 'date' | 'company' | 'status' | 'score'
  sortOrder: 'asc' | 'desc'
}

interface ApplicationActions {
  setApplications: (applications: Application[]) => void
  setLoading: (loading: boolean) => void
  setSelectedApplication: (application: Application | null) => void
  setFilters: (filters: ApplicationState['filters']) => void
  setSortBy: (sortBy: ApplicationState['sortBy']) => void
  setSortOrder: (sortOrder: ApplicationState['sortOrder']) => void
  addApplication: (application: Application) => void
  updateApplication: (id: string, updates: Partial<Application>) => void
  removeApplication: (id: string) => void
  clearApplications: () => void
  getFilteredApplications: () => Application[]
  getApplicationStats: () => {
    total: number
    applied: number
    screening: number
    interview: number
    offer: number
    rejected: number
    withdrawn: number
    averageMatchScore: number
  }
}

export const useApplicationStore = create<ApplicationState & ApplicationActions>((set: (arg0: { applications?: any; loading?: any; selectedApplication?: any; filters?: any; sortBy?: any; sortOrder?: any }) => void, get: () => { applications: any; selectedApplication?: any; filters?: any; sortBy?: any; sortOrder?: any }) => ({
  // Initial state
  applications: [],
  loading: false,
  selectedApplication: null,
  filters: {},
  sortBy: 'date',
  sortOrder: 'desc',

  // Actions
  setApplications: (applications: any) => {
    set({ applications })
  },

  setLoading: (loading: any) => {
    set({ loading })
  },

  setSelectedApplication: (application: any) => {
    set({ selectedApplication: application })
  },

  setFilters: (filters: any) => {
    set({ filters })
  },

  setSortBy: (sortBy: any) => {
    set({ sortBy })
  },

  setSortOrder: (sortOrder: any) => {
    set({ sortOrder })
  },

  addApplication: (application: any) => {
    const { applications } = get()
    set({ applications: [application, ...applications] })
  },

  updateApplication: (id: any, updates: any) => {
    const { applications, selectedApplication } = get()
    const updatedApplications = applications.map((app: { id: any }) =>
      app.id === id ? { ...app, ...updates, updated_at: new Date().toISOString() } : app
    )
    
    set({ 
      applications: updatedApplications,
      selectedApplication: selectedApplication?.id === id 
        ? { ...selectedApplication, ...updates, updated_at: new Date().toISOString() }
        : selectedApplication
    })
  },

  removeApplication: (id: any) => {
    const { applications, selectedApplication } = get()
    const filteredApplications = applications.filter((app: { id: any }) => app.id !== id)
    
    set({ 
      applications: filteredApplications,
      selectedApplication: selectedApplication?.id === id ? null : selectedApplication
    })
  },

  clearApplications: () => {
    set({
      applications: [],
      selectedApplication: null,
      filters: {},
    })
  },

  getFilteredApplications: () => {
    const { applications, filters, sortBy, sortOrder } = get()
    
    let filtered = [...applications]

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status)
    }

    if (filters.company) {
      filtered = filtered.filter(app => 
        app.company_name.toLowerCase().includes(filters.company!.toLowerCase())
      )
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange
      filtered = filtered.filter(app => {
        const appDate = new Date(app.application_date)
        return appDate >= new Date(start) && appDate <= new Date(end)
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.application_date).getTime() - new Date(b.application_date).getTime()
          break
        case 'company':
          comparison = a.company_name.localeCompare(b.company_name)
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'score':
          comparison = (a.match_score || 0) - (b.match_score || 0)
          break
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })

    return filtered
  },

  getApplicationStats: () => {
    const { applications } = get()
    
    const stats = {
      total: applications.length,
      applied: 0,
      screening: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
      averageMatchScore: 0,
    }

    let totalScore = 0
    let scoredApplications = 0

    applications.forEach((app: { status: string | number; match_score: number | null }) => {
  stats[app.status as keyof typeof stats]++

  if (app.match_score !== null) {
    totalScore += app.match_score
    scoredApplications++
  }
})

    stats.averageMatchScore = scoredApplications > 0 ? totalScore / scoredApplications : 0

    return stats
  },
}))
