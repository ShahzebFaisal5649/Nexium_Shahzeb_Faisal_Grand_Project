'use client'

import { useState, useEffect } from 'react'
import { useResumeStore } from '@/lib/store/resumeStore'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

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

export function useResumes() {
  const { user } = useAuth()
  const {
    resumes,
    loading,
    setResumes,
    setLoading,
    addResume,
    updateResume,
    removeResume,
  } = useResumeStore()

  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchResumes()
    }
  }, [user])

  const fetchResumes = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setResumes(data || [])
    } catch (error) {
      console.error('Error fetching resumes:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const uploadResume = async (file: File, title: string, isMaster: boolean = false) => {
    if (!user) throw new Error('User not authenticated')

    setUploading(true)
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName)

      // Extract text from file (mock implementation)
      const extractedText = await extractTextFromFile(file)

      // Save resume record to database
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title,
          is_master: isMaster,
          file_url: publicUrl,
          file_size: file.size,
          file_type: file.type,
          extracted_text: extractedText,
        })
        .select()
        .single()

      if (error) throw error

      addResume(data)
      return data
    } catch (error) {
      console.error('Error uploading resume:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const updateResumeDetails = async (id: string, updates: Partial<Pick<Resume, 'title' | 'is_master'>>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('resumes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      updateResume(id, data)
      return data
    } catch (error) {
      console.error('Error updating resume:', error)
      throw error
    }
  }

  const deleteResume = async (id: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      // Get resume details first
      const resume = resumes.find((r: { id: string }) => r.id === id)
      if (!resume) throw new Error('Resume not found')

      // Delete file from storage
      if (resume.file_url) {
        const fileName = resume.file_url.split('/').pop()
        if (fileName) {
          await supabase.storage
            .from('resumes')
            .remove([`${user.id}/${fileName}`])
        }
      }

      // Delete record from database
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      removeResume(id)
    } catch (error) {
      console.error('Error deleting resume:', error)
      throw error
    }
  }

  const downloadResume = async (id: string) => {
    const resume = resumes.find((r: { id: string }) => r.id === id)
    if (!resume || !resume.file_url) {
      throw new Error('Resume file not found')
    }

    try {
      const response = await fetch(resume.file_url)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resume.title}.${resume.file_type?.split('/')[1] || 'pdf'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading resume:', error)
      throw error
    }
  }

  const setMasterResume = async (id: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      // First, unset all other master resumes
      await supabase
        .from('resumes')
        .update({ is_master: false })
        .eq('user_id', user.id)
        .eq('is_master', true)

      // Then set the selected resume as master
      const { data, error } = await supabase
        .from('resumes')
        .update({ 
          is_master: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      // Update local state
      setResumes(resumes.map((resume: Resume) => ({
        ...resume,
        is_master: resume.id === id
      })))

      return data
    } catch (error) {
      console.error('Error setting master resume:', error)
      throw error
    }
  }

  const getMasterResume = () => {
    return resumes.find((resume: { is_master: any }) => resume.is_master) || null
  }

  const searchResumes = (query: string) => {
  if (!query.trim()) return resumes
  
  const lowercaseQuery = query.toLowerCase()
  return resumes.filter((resume: { title: string; extracted_text: string | null }) =>
    resume.title.toLowerCase().includes(lowercaseQuery) ||
    (resume.extracted_text !== null && resume.extracted_text.toLowerCase().includes(lowercaseQuery))
  )
}

  const getResumeById = (id: string) => {
    return resumes.find((resume: { id: string }) => resume.id === id) || null
  }

  return {
    // State
    resumes,
    loading,
    uploading,
    
    // Actions
    fetchResumes,
    uploadResume,
    updateResumeDetails,
    deleteResume,
    downloadResume,
    setMasterResume,
    
    // Utilities
    getMasterResume,
    searchResumes,
    getResumeById,
  }
}

// Helper function to extract text from file (mock implementation)
async function extractTextFromFile(file: File): Promise<string> {
  // In a real implementation, you would use a library like pdf-parse or mammoth
  // For now, return a mock extracted text
  return `Extracted text from ${file.name}. This would contain the actual resume content in a real implementation.`
}
