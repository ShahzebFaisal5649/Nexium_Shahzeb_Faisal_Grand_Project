import { create } from 'zustand'
import { Resume } from '@/lib/hooks/useResumes'

interface ResumeState {
  resumes: Resume[]
  loading: boolean
  selectedResume: Resume | null
  uploadProgress: number
}

interface ResumeActions {
  setResumes: (resumes: Resume[]) => void
  setLoading: (loading: boolean) => void
  setSelectedResume: (resume: Resume | null) => void
  setUploadProgress: (progress: number) => void
  addResume: (resume: Resume) => void
  updateResume: (id: string, updates: Partial<Resume>) => void
  removeResume: (id: string) => void
  clearResumes: () => void
}

export const useResumeStore = create<ResumeState & ResumeActions>((set: (arg0: { resumes?: any; loading?: any; selectedResume?: any; uploadProgress?: any }) => void, get: () => { resumes: any; selectedResume?: any }) => ({
  // Initial state
  resumes: [],
  loading: false,
  selectedResume: null,
  uploadProgress: 0,

  // Actions
  setResumes: (resumes: any) => {
    set({ resumes })
  },

  setLoading: (loading: any) => {
    set({ loading })
  },

  setSelectedResume: (resume: any) => {
    set({ selectedResume: resume })
  },

  setUploadProgress: (progress: any) => {
    set({ uploadProgress: progress })
  },

  addResume: (resume: any) => {
    const { resumes } = get()
    set({ resumes: [resume, ...resumes] })
  },

  updateResume: (id: any, updates: any) => {
    const { resumes, selectedResume } = get()
    const updatedResumes = resumes.map((resume: { id: any }) =>
      resume.id === id ? { ...resume, ...updates } : resume
    )
    
    set({ 
      resumes: updatedResumes,
      selectedResume: selectedResume?.id === id 
        ? { ...selectedResume, ...updates }
        : selectedResume
    })
  },

  removeResume: (id: any) => {
    const { resumes, selectedResume } = get()
    const filteredResumes = resumes.filter((resume: { id: any }) => resume.id !== id)
    
    set({ 
      resumes: filteredResumes,
      selectedResume: selectedResume?.id === id ? null : selectedResume
    })
  },

  clearResumes: () => {
    set({
      resumes: [],
      selectedResume: null,
      uploadProgress: 0,
    })
  },
}))
