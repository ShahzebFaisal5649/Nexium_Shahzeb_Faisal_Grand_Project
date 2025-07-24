import { MongoClient, Db, Collection, Document } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Database and collection interfaces
export interface JobAnalysis extends Document {
  _id?: string
  jobDescriptionId: string
  userId: string
  analysis: {
    extractedSkills: {
      technical: string[]
      soft: string[]
      industry: string[]
    }
    requirements: {
      education: string[]
      experience: {
        years: number
        level: string
      }
      certifications: string[]
    }
    keywords: Array<{
      term: string
      frequency: number
      importance: number
      category: string
    }>
    companyInfo: {
      size: string
      industry: string
      culture: string[]
    }
  }
  processingTime: number
  aiModel: string
  createdAt: Date
  updatedAt: Date
}

export interface ResumeAnalysis extends Document {
  _id?: string
  resumeId: string
  userId: string
  analysis: {
    extractedSections: {
      summary: string
      experience: Array<{
        title: string
        company: string
        duration: string
        bullets: string[]
      }>
      education: Array<{
        degree: string
        school: string
        year: string
      }>
      skills: {
        technical: string[]
        soft: string[]
        languages: string[]
      }
      projects: Array<{
        name: string
        description: string
        technologies: string[]
      }>
    }
    strengths: string[]
    improvementAreas: string[]
    atsScore: number
    readabilityScore: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface MatchAnalysis extends Document {
  _id?: string
  userId: string
  resumeId: string
  jobDescriptionId: string
  matchAnalysis: {
    overallScore: number
    breakdown: {
      skillsMatch: number
      experienceMatch: number
      educationMatch: number
      keywordDensity: number
    }
    matchingElements: {
      skills: string[]
      keywords: string[]
      experience: string[]
    }
    missingElements: {
      criticalSkills: string[]
      importantKeywords: string[]
      requirements: string[]
    }
    suggestions: Array<{
      type: string
      priority: string
      description: string
      impact: number
    }>
  }
  createdAt: Date
}

export interface TailoringResult extends Document {
  _id?: string
  userId: string
  originalResumeId: string
  jobDescriptionId: string
  tailoringRequest: {
    intensity: string
    lockedSections: string[]
    customInstructions: string
  }
  tailoredContent: {
    sections: {
      summary: {
        original: string
        tailored: string
        changes: string[]
      }
      experience: Array<{
        original: string
        tailored: string
        changes: string[]
      }>
      skills: {
        original: string[]
        tailored: string[]
        added: string[]
        reordered: boolean
      }
    }
  }
  improvementMetrics: {
    scoreBefore: number
    scoreAfter: number
    keywordsAdded: number
    sectionsModified: number
  }
  processingTime: number
  aiModel: string
  createdAt: Date
}

// Database helper class
export class MongoDB {
  private static db: Db | null = null

  static async getDatabase(): Promise<Db> {
    if (!this.db) {
      const client = await clientPromise
      this.db = client.db('resume-tailor-ai')
    }
    return this.db
  }

  static async getCollection<T extends Document>(name: string): Promise<Collection<T>> {
    const db = await this.getDatabase()
    return db.collection<T>(name)
  }

  // Job Analysis methods
  static async saveJobAnalysis(analysis: Omit<JobAnalysis, '_id'>): Promise<string> {
    const collection = await this.getCollection<JobAnalysis>('jobAnalysis')
    const result = await collection.insertOne({
      ...analysis,
      createdAt: new Date(),
      updatedAt: new Date()
    } as JobAnalysis)
    return result.insertedId.toString()
  }

  static async getJobAnalysis(jobDescriptionId: string, userId: string): Promise<JobAnalysis | null> {
    const collection = await this.getCollection<JobAnalysis>('jobAnalysis')
    return await collection.findOne({ jobDescriptionId, userId })
  }

  // Resume Analysis methods
  static async saveResumeAnalysis(analysis: Omit<ResumeAnalysis, '_id'>): Promise<string> {
    const collection = await this.getCollection<ResumeAnalysis>('resumeAnalysis')
    const result = await collection.insertOne({
      ...analysis,
      createdAt: new Date(),
      updatedAt: new Date()
    } as ResumeAnalysis)
    return result.insertedId.toString()
  }

  static async getResumeAnalysis(resumeId: string, userId: string): Promise<ResumeAnalysis | null> {
    const collection = await this.getCollection<ResumeAnalysis>('resumeAnalysis')
    return await collection.findOne({ resumeId, userId })
  }

  // Match Analysis methods
  static async saveMatchAnalysis(analysis: Omit<MatchAnalysis, '_id'>): Promise<string> {
    const collection = await this.getCollection<MatchAnalysis>('matchAnalysis')
    const result = await collection.insertOne({
      ...analysis,
      createdAt: new Date()
    } as MatchAnalysis)
    return result.insertedId.toString()
  }

  static async getMatchAnalysis(resumeId: string, jobDescriptionId: string, userId: string): Promise<MatchAnalysis | null> {
    const collection = await this.getCollection<MatchAnalysis>('matchAnalysis')
    return await collection.findOne({ resumeId, jobDescriptionId, userId })
  }

  // Tailoring Results methods
  static async saveTailoringResult(result: Omit<TailoringResult, '_id'>): Promise<string> {
    const collection = await this.getCollection<TailoringResult>('tailoringResults')
    const insertResult = await collection.insertOne({
      ...result,
      createdAt: new Date()
    } as TailoringResult)
    return insertResult.insertedId.toString()
  }

  static async getTailoringResult(originalResumeId: string, jobDescriptionId: string, userId: string): Promise<TailoringResult | null> {
    const collection = await this.getCollection<TailoringResult>('tailoringResults')
    return await collection.findOne({ originalResumeId, jobDescriptionId, userId })
  }

  static async getUserTailoringHistory(userId: string, limit: number = 10): Promise<TailoringResult[]> {
    const collection = await this.getCollection<TailoringResult>('tailoringResults')
    return await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
  }
}

export default clientPromise