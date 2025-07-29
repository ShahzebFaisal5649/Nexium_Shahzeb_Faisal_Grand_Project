import OpenAI from "openai"
import { ResumeAnalysis } from "../utils/resumeAnalyzer"
import { JobDescriptionAnalysis } from "../utils/jobDescriptionAnalyzer"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
})

export interface MatchAnalysis {
  overallScore: number
  skillsMatch: number
  experienceMatch: number
  educationMatch: number
  keywordDensity: number
  matchingSkills: string[]
  missingSkills: string[]
  strengths: string[]
  improvements: string[]
  recommendations: string[]
}

export interface TailoredResume {
  content: string
  improvements: string[]
  changes: Array<{
    section: string
    original: string
    modified: string
    reason: string
  }>
  matchScore: number
  keywords: string[]
}

export interface TailoringOptions {
  aggressiveness?: "conservative" | "moderate" | "aggressive"
  focusAreas?: string[]
  preserveSections?: string[]
  targetKeywords?: string[]
  tone?: "professional" | "creative" | "technical"
}

export class ResumeTailoringEngine {
  async analyzeMatch(
    resumeAnalysis: ResumeAnalysis,
    jobAnalysis: JobDescriptionAnalysis
  ): Promise<MatchAnalysis> {
    try {
      const prompt = `
        Analyze the match between this resume and job description. Provide a detailed analysis.
        
        Resume Analysis:
        ${JSON.stringify(resumeAnalysis, null, 2)}
        
        Job Description Analysis:
        ${JSON.stringify(jobAnalysis, null, 2)}
        
        Return a JSON object with this structure:
        {
          "overallScore": number (0-100),
          "skillsMatch": number (0-100),
          "experienceMatch": number (0-100),
          "educationMatch": number (0-100),
          "keywordDensity": number (0-100),
          "matchingSkills": ["skill1", "skill2", ...],
          "missingSkills": ["skill1", "skill2", ...],
          "strengths": ["strength1", "strength2", ...],
          "improvements": ["improvement1", "improvement2", ...],
          "recommendations": ["recommendation1", "recommendation2", ...]
        }
        
        Calculate scores based on:
        - Skills overlap between resume and job requirements
        - Experience level alignment
        - Education requirements match
        - Keyword presence and density
        - Overall qualification fit
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert resume-job matching analyst. Provide detailed, accurate match analysis with specific scores and recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error("No response from OpenAI")
      }

      return JSON.parse(content) as MatchAnalysis
    } catch (error) {
      console.error("Match analysis error:", error)
      throw new Error("Failed to analyze resume-job match")
    }
  }

  async tailorResume(
    resumeText: string,
    jobDescriptionText: string,
    matchAnalysis: MatchAnalysis,
    options: TailoringOptions = {}
  ): Promise<TailoredResume> {
    try {
      const {
        aggressiveness = "moderate",
        focusAreas = [],
        preserveSections = [],
        targetKeywords = [],
        tone = "professional"
      } = options

      const prompt = `
        Tailor this resume for the specific job description. Make strategic improvements while maintaining authenticity.
        
        Original Resume:
        ${resumeText}
        
        Job Description:
        ${jobDescriptionText}
        
        Match Analysis:
        ${JSON.stringify(matchAnalysis, null, 2)}
        
        Tailoring Options:
        - Aggressiveness: ${aggressiveness}
        - Focus Areas: ${focusAreas.join(", ")}
        - Preserve Sections: ${preserveSections.join(", ")}
        - Target Keywords: ${targetKeywords.join(", ")}
        - Tone: ${tone}
        
        Return a JSON object with this structure:
        {
          "content": "The complete tailored resume text",
          "improvements": ["improvement1", "improvement2", ...],
          "changes": [
            {
              "section": "Section name",
              "original": "Original text",
              "modified": "Modified text",
              "reason": "Reason for change"
            }
          ],
          "matchScore": number (estimated new match score 0-100),
          "keywords": ["keyword1", "keyword2", ...] (keywords added/emphasized)
        }
        
        Tailoring Guidelines:
        1. ${aggressiveness === "conservative" ? "Make minimal changes, focus on keyword optimization" : 
           aggressiveness === "moderate" ? "Make strategic changes to improve match while maintaining authenticity" :
           "Make significant improvements to maximize job match"}
        2. Incorporate missing skills from the job description where truthful
        3. Emphasize relevant experience and achievements
        4. Optimize for ATS with appropriate keywords
        5. Maintain professional formatting and readability
        6. Ensure all changes are truthful and verifiable
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert resume writer and career coach. Tailor resumes strategically while maintaining authenticity and truthfulness."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 3000,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error("No response from OpenAI")
      }

      return JSON.parse(content) as TailoredResume
    } catch (error) {
      console.error("Resume tailoring error:", error)
      throw new Error("Failed to tailor resume")
    }
  }

  async generateCoverLetter(
    resumeText: string,
    jobDescriptionText: string,
    companyName: string,
    jobTitle: string
  ): Promise<string> {
    try {
      const prompt = `
        Generate a compelling cover letter based on this resume and job description.
        
        Resume:
        ${resumeText}
        
        Job Description:
        ${jobDescriptionText}
        
        Company: ${companyName}
        Position: ${jobTitle}
        
        Create a professional cover letter that:
        1. Shows enthusiasm for the specific role and company
        2. Highlights relevant experience from the resume
        3. Addresses key job requirements
        4. Demonstrates knowledge of the company/industry
        5. Includes a strong call to action
        6. Maintains professional tone throughout
        7. Is concise (3-4 paragraphs)
        
        Return only the cover letter text, properly formatted.
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert cover letter writer. Create compelling, personalized cover letters that effectively match candidates to positions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1000,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error("No response from OpenAI")
      }

      return content
    } catch (error) {
      console.error("Cover letter generation error:", error)
      throw new Error("Failed to generate cover letter")
    }
  }

  async optimizeForATS(resumeText: string, jobKeywords: string[]): Promise<string> {
    try {
      const prompt = `
        Optimize this resume for ATS (Applicant Tracking System) compatibility while incorporating these job-specific keywords.
        
        Resume:
        ${resumeText}
        
        Target Keywords: ${jobKeywords.join(", ")}
        
        ATS Optimization Guidelines:
        1. Use standard section headers (Experience, Education, Skills, etc.)
        2. Incorporate keywords naturally throughout the content
        3. Use simple, clean formatting
        4. Avoid graphics, tables, or complex layouts
        5. Use standard fonts and bullet points
        6. Ensure contact information is clearly formatted
        7. Include relevant keywords in context
        8. Maintain readability for human reviewers
        
        Return the optimized resume text with improved ATS compatibility.
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an ATS optimization expert. Improve resume compatibility with applicant tracking systems while maintaining human readability."
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

      return content
    } catch (error) {
      console.error("ATS optimization error:", error)
      throw new Error("Failed to optimize resume for ATS")
    }
  }

  async generateInterviewPrep(
    resumeText: string,
    jobDescriptionText: string
  ): Promise<{
    questions: string[]
    answers: Array<{ question: string; answer: string; tips: string[] }>
    strengths: string[]
    weaknesses: string[]
    stories: Array<{ situation: string; story: string; impact: string }>
  }> {
    try {
      const prompt = `
        Generate interview preparation materials based on this resume and job description.
        
        Resume:
        ${resumeText}
        
        Job Description:
        ${jobDescriptionText}
        
        Return a JSON object with this structure:
        {
          "questions": ["question1", "question2", ...] (likely interview questions),
          "answers": [
            {
              "question": "Interview question",
              "answer": "Suggested answer based on resume",
              "tips": ["tip1", "tip2", ...]
            }
          ],
          "strengths": ["strength1", "strength2", ...] (to highlight in interview),
          "weaknesses": ["weakness1", "weakness2", ...] (potential concerns to address),
          "stories": [
            {
              "situation": "STAR method situation",
              "story": "Complete STAR story",
              "impact": "Measurable impact/result"
            }
          ]
        }
        
        Focus on:
        1. Common interview questions for this role
        2. Behavioral questions based on job requirements
        3. Technical questions relevant to the position
        4. STAR method stories from resume experience
        5. Ways to address potential weaknesses
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert interview coach. Generate comprehensive interview preparation materials tailored to specific roles and candidates."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 2500,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error("No response from OpenAI")
      }

      return JSON.parse(content)
    } catch (error) {
      console.error("Interview prep generation error:", error)
      throw new Error("Failed to generate interview preparation materials")
    }
  }
}
