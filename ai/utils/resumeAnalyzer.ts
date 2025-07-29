import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
})

export interface ResumeAnalysis {
  skills: string[]
  experience: {
    totalYears: number
    positions: Array<{
      title: string
      company: string
      duration: string
      responsibilities: string[]
    }>
  }
  education: Array<{
    degree: string
    institution: string
    year?: string
  }>
  keywords: string[]
  sections: {
    summary?: string
    skills: string[]
    experience: string[]
    education: string[]
    projects?: string[]
    certifications?: string[]
  }
  strengths: string[]
  weaknesses: string[]
  atsScore: number
}

export class ResumeAnalyzer {
  async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
    try {
      const prompt = `
        Analyze the following resume and extract structured information. Return a JSON object with the following structure:
        
        {
          "skills": ["skill1", "skill2", ...],
          "experience": {
            "totalYears": number,
            "positions": [
              {
                "title": "Job Title",
                "company": "Company Name",
                "duration": "Duration",
                "responsibilities": ["responsibility1", "responsibility2", ...]
              }
            ]
          },
          "education": [
            {
              "degree": "Degree Name",
              "institution": "Institution Name",
              "year": "Year"
            }
          ],
          "keywords": ["keyword1", "keyword2", ...],
          "sections": {
            "summary": "Professional summary if available",
            "skills": ["extracted skills"],
            "experience": ["experience descriptions"],
            "education": ["education details"],
            "projects": ["project descriptions"],
            "certifications": ["certifications"]
          },
          "strengths": ["strength1", "strength2", ...],
          "weaknesses": ["weakness1", "weakness2", ...],
          "atsScore": number (0-100)
        }
        
        Resume text:
        ${resumeText}
        
        Please analyze thoroughly and provide accurate extraction. Focus on:
        1. Technical skills and technologies
        2. Years of experience calculation
        3. Key achievements and responsibilities
        4. ATS compatibility score
        5. Areas for improvement
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert resume analyzer. Extract structured information from resumes and provide detailed analysis for job matching purposes."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error("No response from OpenAI")
      }

      try {
        return JSON.parse(content) as ResumeAnalysis
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", content)
        throw new Error("Failed to parse resume analysis")
      }
    } catch (error) {
      console.error("Resume analysis error:", error)
      throw new Error("Failed to analyze resume")
    }
  }

  async extractSkills(resumeText: string): Promise<string[]> {
    try {
      const prompt = `
        Extract all technical skills, programming languages, frameworks, tools, and technologies mentioned in this resume.
        Return only a JSON array of skills.
        
        Resume text:
        ${resumeText}
      `

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a skill extraction expert. Extract all technical skills from resumes."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 500,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error("No response from OpenAI")
      }

      return JSON.parse(content) as string[]
    } catch (error) {
      console.error("Skill extraction error:", error)
      return []
    }
  }

  async calculateATSScore(resumeText: string): Promise<number> {
    try {
      const prompt = `
        Analyze this resume for ATS (Applicant Tracking System) compatibility and return a score from 0-100.
        
        Consider these factors:
        - Use of standard section headers
        - Keyword density and relevance
        - Formatting simplicity
        - Contact information clarity
        - Skills section presence
        - Quantified achievements
        - Proper use of bullet points
        - Absence of graphics/tables that ATS can't read
        
        Return only a number between 0-100.
        
        Resume text:
        ${resumeText}
      `

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an ATS compatibility expert. Analyze resumes for ATS optimization."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 50,
      })

      const content = response.choices[0]?.message?.content?.trim()
      if (!content) {
        throw new Error("No response from OpenAI")
      }

      const score = parseInt(content)
      return isNaN(score) ? 50 : Math.max(0, Math.min(100, score))
    } catch (error) {
      console.error("ATS score calculation error:", error)
      return 50 // Default score
    }
  }

  async generateImprovementSuggestions(resumeText: string): Promise<string[]> {
    try {
      const prompt = `
        Analyze this resume and provide specific improvement suggestions.
        Focus on:
        - Content improvements
        - Formatting suggestions
        - Missing sections
        - Keyword optimization
        - ATS compatibility
        
        Return a JSON array of specific, actionable suggestions.
        
        Resume text:
        ${resumeText}
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional resume coach. Provide specific, actionable improvement suggestions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error("No response from OpenAI")
      }

      return JSON.parse(content) as string[]
    } catch (error) {
      console.error("Improvement suggestions error:", error)
      return [
        "Add more quantified achievements",
        "Include relevant keywords from job descriptions",
        "Improve formatting for ATS compatibility",
        "Add a professional summary section",
        "Include more technical skills"
      ]
    }
  }
}