import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
})

export interface JobDescriptionAnalysis {
  requiredSkills: string[]
  preferredSkills: string[]
  experienceLevel: string
  educationRequirements: string[]
  responsibilities: string[]
  qualifications: string[]
  keywords: string[]
  companyInfo: {
    name: string
    industry?: string
    size?: string
  }
  jobDetails: {
    title: string
    level: string
    type: string // full-time, part-time, contract
    remote: boolean
    location?: string
  }
  benefits: string[]
  salaryRange?: {
    min?: number
    max?: number
    currency?: string
  }
  applicationDeadline?: string
  priority: "high" | "medium" | "low"
}

export class JobDescriptionAnalyzer {
  async analyzeJobDescription(jobDescriptionText: string): Promise<JobDescriptionAnalysis> {
    try {
      const prompt = `
        Analyze the following job description and extract structured information. Return a JSON object with the following structure:
        
        {
          "requiredSkills": ["skill1", "skill2", ...],
          "preferredSkills": ["skill1", "skill2", ...],
          "experienceLevel": "entry|mid|senior|executive",
          "educationRequirements": ["requirement1", "requirement2", ...],
          "responsibilities": ["responsibility1", "responsibility2", ...],
          "qualifications": ["qualification1", "qualification2", ...],
          "keywords": ["keyword1", "keyword2", ...],
          "companyInfo": {
            "name": "Company Name",
            "industry": "Industry",
            "size": "startup|small|medium|large|enterprise"
          },
          "jobDetails": {
            "title": "Job Title",
            "level": "entry|mid|senior|executive",
            "type": "full-time|part-time|contract|internship",
            "remote": boolean,
            "location": "Location"
          },
          "benefits": ["benefit1", "benefit2", ...],
          "salaryRange": {
            "min": number,
            "max": number,
            "currency": "USD"
          },
          "applicationDeadline": "date if mentioned",
          "priority": "high|medium|low"
        }
        
        Job Description:
        ${jobDescriptionText}
        
        Please analyze thoroughly and extract:
        1. All technical skills and requirements
        2. Experience level indicators
        3. Education requirements
        4. Key responsibilities
        5. Company information
        6. Job details and benefits
        7. Important keywords for ATS optimization
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert job description analyzer. Extract structured information from job postings for resume matching purposes."
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
        return JSON.parse(content) as JobDescriptionAnalysis
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", content)
        throw new Error("Failed to parse job description analysis")
      }
    } catch (error) {
      console.error("Job description analysis error:", error)
      throw new Error("Failed to analyze job description")
    }
  }

  async extractRequiredSkills(jobDescriptionText: string): Promise<string[]> {
    try {
      const prompt = `
        Extract all required technical skills, programming languages, frameworks, tools, and technologies from this job description.
        Focus on hard requirements, not nice-to-haves.
        Return only a JSON array of required skills.
        
        Job Description:
        ${jobDescriptionText}
      `

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a skill extraction expert. Extract required technical skills from job descriptions."
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
      console.error("Required skills extraction error:", error)
      return []
    }
  }

  async extractKeywords(jobDescriptionText: string): Promise<string[]> {
    try {
      const prompt = `
        Extract important keywords and phrases from this job description that would be valuable for ATS optimization.
        Include:
        - Technical terms
        - Industry buzzwords
        - Action verbs
        - Qualification terms
        - Company-specific terms
        
        Return only a JSON array of keywords.
        
        Job Description:
        ${jobDescriptionText}
      `

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a keyword extraction expert for ATS optimization."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 600,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error("No response from OpenAI")
      }

      return JSON.parse(content) as string[]
    } catch (error) {
      console.error("Keyword extraction error:", error)
      return []
    }
  }

  async determineExperienceLevel(jobDescriptionText: string): Promise<string> {
    try {
      const prompt = `
        Analyze this job description and determine the experience level required.
        Return only one of these values: "entry", "mid", "senior", or "executive"
        
        Job Description:
        ${jobDescriptionText}
      `

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert at determining job experience levels from job descriptions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 50,
      })

      const content = response.choices[0]?.message?.content?.trim().toLowerCase()
      if (!content) {
        throw new Error("No response from OpenAI")
      }

      const validLevels = ["entry", "mid", "senior", "executive"]
      return validLevels.includes(content) ? content : "mid"
    } catch (error) {
      console.error("Experience level determination error:", error)
      return "mid" // Default level
    }
  }

  async generateMatchingStrategy(jobDescriptionText: string): Promise<string[]> {
    try {
      const prompt = `
        Based on this job description, provide specific strategies for tailoring a resume to match this position.
        Focus on:
        - Key skills to highlight
        - Experience to emphasize
        - Keywords to include
        - Sections to prioritize
        
        Return a JSON array of specific, actionable strategies.
        
        Job Description:
        ${jobDescriptionText}
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a resume tailoring expert. Provide specific strategies for matching resumes to job descriptions."
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
      console.error("Matching strategy generation error:", error)
      return [
        "Highlight relevant technical skills mentioned in the job description",
        "Quantify achievements that align with job responsibilities",
        "Include industry-specific keywords throughout the resume",
        "Emphasize experience that matches the required qualifications",
        "Tailor the professional summary to match the role"
      ]
    }
  }
}
