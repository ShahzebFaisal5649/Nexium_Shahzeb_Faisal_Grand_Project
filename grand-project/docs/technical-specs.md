# Resume Tailor - Technical Specifications

## System Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Services   │
│   (Next.js 15) │◄──►│   (API Routes)  │◄──►│   (n8n + LLM)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Supabase      │    │   MongoDB       │    │   File Storage  │
│   (Auth + DB)   │    │   (AI Data)     │    │   (Resumes)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack Details

#### Frontend Stack
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript 5.0+
- **Styling:** Tailwind CSS 3.4 + ShadCN UI
- **State Management:** Zustand + React Query
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **PDF Generation:** jsPDF + html2canvas
- **File Upload:** React Dropzone
- **Icons:** Lucide React

#### Backend Stack
- **Runtime:** Node.js 20+ (Vercel Functions)
- **API:** Next.js API Routes (App Router)
- **Authentication:** Supabase Auth
- **Primary Database:** Supabase (PostgreSQL)
- **AI Data Store:** MongoDB Atlas
- **File Storage:** Supabase Storage
- **Email:** Resend.com
- **Validation:** Zod schemas

#### AI & Automation
- **Workflow Engine:** n8n (self-hosted)
- **LLM Provider:** OpenAI GPT-4 Turbo
- **Document Processing:** PDF-parse, Mammoth.js
- **NLP:** OpenAI Embeddings + Custom algorithms
- **Vector Database:** Pinecone (for semantic search)

#### Infrastructure
- **Hosting:** Vercel (Frontend + API)
- **CI/CD:** GitHub Actions + Vercel
- **Monitoring:** Vercel Analytics + Sentry
- **Database:** Supabase (Primary) + MongoDB Atlas (AI)
- **CDN:** Vercel Edge Network
- **Domain:** Custom domain with SSL

## Database Schema

### Supabase (PostgreSQL) Schema

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth)
-- auth.users table is automatically created

-- User profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    location VARCHAR(255),
    linkedin_url VARCHAR(255),
    current_job_title VARCHAR(255),
    years_experience INTEGER,
    industry VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume templates/versions
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    is_master BOOLEAN DEFAULT FALSE,
    file_url VARCHAR(500),
    file_size INTEGER,
    file_type VARCHAR(50),
    extracted_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_master_per_user UNIQUE(user_id, is_master) 
    WHERE is_master = TRUE
);

-- Job descriptions and analysis
CREATE TABLE job_descriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    job_url VARCHAR(500),
    description_text TEXT NOT NULL,
    location VARCHAR(255),
    salary_range VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job applications tracking
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
    job_description_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    application_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'phone_screen', 'interview', 'final_round', 'offer', 'rejected', 'withdrawn')),
    match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
    notes TEXT,
    application_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application status history
CREATE TABLE application_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume versions and tailoring history
CREATE TABLE resume_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    job_description_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,
    version_number INTEGER NOT NULL DEFAULT 1,
    changes_summary TEXT,
    tailored_content TEXT,
    match_score_before INTEGER,
    match_score_after INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences and settings
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email_notifications JSONB DEFAULT '{"interview_reminders": true, "status_updates": true, "weekly_summary": false}',
    tailoring_preferences JSONB DEFAULT '{"intensity": "moderate", "locked_sections": [], "preserve_formatting": true}',
    privacy_settings JSONB DEFAULT '{"data_sharing": false, "analytics": true, "profile_visibility": "private"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_user_preferences UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_date ON applications(application_date DESC);
CREATE INDEX idx_job_descriptions_user_id ON job_descriptions(user_id);
CREATE INDEX idx_resume_versions_resume_id ON resume_versions(resume_id);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own resumes" ON resumes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own job descriptions" ON job_descriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own applications" ON applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own status history" ON application_status_history FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM applications WHERE id = application_id)
);
CREATE POLICY "Users can manage own resume versions" ON resume_versions FOR ALL USING (
    auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id)
);
CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### MongoDB Schema (AI Data)

```javascript
// Database: resume-tailor-ai
// Collections:

// Job Analysis Results
{
  _id: ObjectId,
  jobDescriptionId: String, // Reference to Supabase job_descriptions.id
  userId: String, // Reference to Supabase auth.users.id
  analysis: {
    extractedSkills: {
      technical: [String],
      soft: [String],
      industry: [String]
    },
    requirements: {
      education: [String],
      experience: {
        years: Number,
        level: String // "entry", "mid", "senior", "executive"
      },
      certifications: [String]
    },
    keywords: [{
      term: String,
      frequency: Number,
      importance: Number, // 1-10 scale
      category: String // "skill", "tool", "requirement", "benefit"
    }],
    companyInfo: {
      size: String, // "startup", "small", "medium", "large", "enterprise"
      industry: String,
      culture: [String]
    }
  },
  processingTime: Number, // milliseconds
  aiModel: String, // "gpt-4-turbo", etc.
  createdAt: Date,
  updatedAt: Date
}

// Resume Analysis Results  
{
  _id: ObjectId,
  resumeId: String, // Reference to Supabase resumes.id
  userId: String,
  analysis: {
    extractedSections: {
      summary: String,
      experience: [{
        title: String,
        company: String,
        duration: String,
        bullets: [String]
      }],
      education: [{
        degree: String,
        school: String,
        year: String
      }],
      skills: {
        technical: [String],
        soft: [String],
        languages: [String]
      },
      projects: [{
        name: String,
        description: String,
        technologies: [String]
      }]
    },
    strengths: [String],
    improvementAreas: [String],
    atsScore: Number, // 1-100
    readabilityScore: Number // 1-100
  },
  createdAt: Date,
  updatedAt: Date
}

// Match Analysis (Job vs Resume)
{
  _id: ObjectId,
  userId: String,
  resumeId: String,
  jobDescriptionId: String,
  matchAnalysis: {
    overallScore: Number, // 0-100
    breakdown: {
      skillsMatch: Number,
      experienceMatch: Number,
      educationMatch: Number,
      keywordDensity: Number
    },
    matchingElements: {
      skills: [String],
      keywords: [String],
      experience: [String]
    },
    missingElements: {
      criticalSkills: [String],
      importantKeywords: [String],
      requirements: [String]
    },
    suggestions: [{
      type: String, // "add_skill", "rewrite_bullet", "reorder_section"
      priority: String, // "high", "medium", "low"
      description: String,
      impact: Number // estimated score improvement
    }]
  },
  createdAt: Date
}

// Tailoring Results
{
  _id: ObjectId,
  userId: String,
  originalResumeId: String,
  jobDescriptionId: String,
  tailoringRequest: {
    intensity: String, // "conservative", "moderate", "aggressive"
    lockedSections: [String],
    customInstructions: String
  },
  tailoredContent: {
    sections: {
      summary: {
        original: String,
        tailored: String,
        changes: [String]
      },
      experience: [{
        original: String,
        tailored: String,
        changes: [String]
      }],
      skills: {
        original: [String],
        tailored: [String],
        added: [String],
        reordered: Boolean
      }
    }
  },
  improvementMetrics: {
    scoreBefore: Number,
    scoreAfter: Number,
    keywordsAdded: Number,
    sectionsModified: Number
  },
  processingTime: Number,
  aiModel: String,
  createdAt: Date
}

// AI Workflow Logs
{
  _id: ObjectId,
  userId: String,
  workflowId: String, // n8n workflow execution ID
  workflowType: String, // "analyze_job", "analyze_resume", "tailor_resume", "generate_cover_letter"
  input: Object, // Workflow input data
  output: Object, // Workflow output data
  status: String, // "pending", "running", "completed", "failed"
  error: String, // Error message if failed
  executionTime: Number, // milliseconds
  tokensUsed: Number, // AI tokens consumed
  cost: Number, // Estimated cost in dollars
  createdAt: Date,
  completedAt: Date
}

// User Analytics Cache
{
  _id: ObjectId,
  userId: String,
  period: String, // "daily", "weekly", "monthly"
  date: Date,
  metrics: {
    applicationsSubmitted: Number,
    interviewsScheduled: Number,
    resumesTailored: Number,
    avgMatchScore: Number,
    topPerformingResume: String,
    responseRate: Number,
    topSkills: [String],
    industryBreakdown: Object
  },
  calculatedAt: Date
}
```

## API Architecture

### Authentication & Authorization

```typescript
// Middleware for API route protection
export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return new Response('Invalid token', { status: 401 });
  }
  
  return user;
}

// Rate limiting
const rateLimiter = new Map();

export function rateLimit(identifier: string, limit: number, windowMs: number) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimiter.has(identifier)) {
    rateLimiter.set(identifier, []);
  }
  
  const requests = rateLimiter.get(identifier);
  const validRequests = requests.filter(time => time > windowStart);
  
  if (validRequests.length >= limit) {
    return false;
  }
  
  validRequests.push(now);
  rateLimiter.set(identifier, validRequests);
  return true;
}
```

### API Endpoints Structure

```typescript
// app/api/auth/callback/route.ts
export async function GET(request: Request) {
  // Handle Supabase auth callback
}

// app/api/users/profile/route.ts
export async function GET(request: Request) {
  // Get user profile
}
export async function PUT(request: Request) {
  // Update user profile
}

// app/api/resumes/route.ts
export async function GET() {
  // List user's resumes
}
export async function POST() {
  // Upload new resume
}

// app/api/resumes/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string }}) {
  // Get specific resume
}
export async function PUT() {
  // Update resume
}
export async function DELETE() {
  // Delete resume
}

// app/api/resumes/[id]/tailor/route.ts
export async function POST() {
  // Trigger resume tailoring workflow
}

// app/api/jobs/analyze/route.ts
export async function POST() {
  // Analyze job description
}

// app/api/applications/route.ts
export async function GET() {
  // List user's applications
}
export async function POST() {
  // Create new application
}

// app/api/applications/[id]/route.ts
export async function GET() {
  // Get application details
}
export async function PUT() {
  // Update application
}

// app/api/analytics/dashboard/route.ts
export async function GET() {
  // Get dashboard analytics
}

// app/api/ai/workflows/route.ts
export async function GET() {
  // Get workflow status
}
export async function POST() {
  // Trigger AI workflow
}
```

### Error Handling

```typescript
// lib/errors.ts
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (error: Error) => {
  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: error.statusCode }
    );
  }
  
  // Log unexpected errors
  console.error('Unexpected error:', error);
  
  return new Response(
    JSON.stringify({ error: 'Internal server error' }),
    { status: 500 }
  );
};

// Usage in API routes
export async function POST(request: Request) {
  try {
    // API logic here
  } catch (error) {
    return errorHandler(error);
  }
}
```

## n8n Workflow Specifications

### Workflow 1: Job Description Analysis

```json
{
  "name": "Job Description Analysis",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "analyze-job"
      }
    },
    {
      "name": "Validate Input",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Validate job description input\nconst { jobDescription, userId } = $input.first().json;\n\nif (!jobDescription || jobDescription.length < 100) {\n  throw new Error('Job description too short');\n}\n\nreturn [{ json: { jobDescription, userId, timestamp: new Date() } }];"
      }
    },
    {
      "name": "Extract Keywords",
      "type": "n8n-nodes-base.openAi",
      "parameters": {
        "resource": "text",
        "operation": "completion",
        "model": "gpt-4-turbo",
        "prompt": "Analyze this job description and extract:\n1. Technical skills (list)\n2. Soft skills (list)\n3. Experience requirements\n4. Key responsibilities\n5. Company culture indicators\n\nJob Description:\n{{$json.jobDescription}}\n\nReturn as structured JSON.",
        "maxTokens": 1000,
        "temperature": 0.3
      }
    },
    {
      "name": "Process Keywords",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Process and score keywords\nconst analysis = JSON.parse($input.first().json.choices[0].text);\n\n// Score keywords by frequency and importance\nconst scoredKeywords = analysis.technical_skills.map(skill => ({\n  term: skill,\n  frequency: (skill.match(/\\b\\w+\\b/g) || []).length,\n  importance: 8, // Default high for technical skills\n  category: 'technical'\n}));\n\nreturn [{ json: { analysis, scoredKeywords } }];"
      }
    },
    {
      "name": "Save to MongoDB",
      "type": "n8n-nodes-base.mongoDb",
      "parameters": {
        "operation": "insert",
        "collection": "jobAnalysis",
        "document": "={{$json}}"
      }
    },
    {
      "name": "Return Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "statusCode": 200,
        "responseBody": "={{$json}}"
      }
    }
  ]
}
```

### Workflow 2: Resume Tailoring

```json
{
  "name": "Resume Tailoring",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "tailor-resume"
      }
    },
    {
      "name": "Get Resume Content",
      "type": "n8n-nodes-base.supabase",
      "parameters": {
        "operation": "select",
        "table": "resumes",
        "filterType": "manual",
        "conditions": {
          "id": "={{$json.resumeId}}"
        }
      }
    },
    {
      "name": "Get Job Analysis",
      "type": "n8n-nodes-base.mongoDb",
      "parameters": {
        "operation": "findOne",
        "collection": "jobAnalysis",
        "query": "={\"jobDescriptionId\": \"{{$json.jobDescriptionId}}\"}"
      }
    },
    {
      "name": "Generate Tailored Content",
      "type": "n8n-nodes-base.openAi",
      "parameters": {
        "resource": "text",
        "operation": "completion",
        "model": "gpt-4-turbo",
        "prompt": "Tailor this resume for the job requirements:\n\nResume:\n{{$('Get Resume Content').first().json.extracted_text}}\n\nJob Requirements:\n{{$('Get Job Analysis').first().json.analysis}}\n\nInstructions:\n1. Rewrite bullet points to include relevant keywords\n2. Reorder skills by relevance\n3. Enhance experience descriptions\n4. Maintain professional tone\n5. Keep formatting structure\n\nReturn tailored resume content maintaining original structure.",
        "maxTokens": 2000,
        "temperature": 0.4
      }
    },
    {
      "name": "Calculate Match Score",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Calculate match score improvement\nconst original = $('Get Resume Content').first().json.extracted_text;\nconst tailored = $input.first().json.choices[0].text;\nconst jobKeywords = $('Get Job Analysis').first().json.analysis.keywords;\n\n// Simple keyword matching algorithm\nconst originalMatches = jobKeywords.filter(keyword => \n  original.toLowerCase().includes(keyword.term.toLowerCase())\n).length;\n\nconst tailoredMatches = jobKeywords.filter(keyword => \n  tailored.toLowerCase().includes(keyword.term.toLowerCase())\n).length;\n\nconst scoreBefore = Math.round((originalMatches / jobKeywords.length) * 100);\nconst scoreAfter = Math.round((tailoredMatches / jobKeywords.length) * 100);\n\nreturn [{ \n  json: { \n    tailoredContent: tailored,\n    scoreBefore,\n    scoreAfter,\n    improvement: scoreAfter - scoreBefore\n  } \n}];"
      }
    },
    {
      "name": "Save Tailoring Result",
      "type": "n8n-nodes-base.mongoDb",
      "parameters": {
        "operation": "insert",
        "collection": "tailoringResults",
        "document": "={{$json}}"
      }
    }
  ]
}
```

## Frontend Architecture

### Component Structure

```
app/
├── (auth)/
│   ├── signin/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── layout.tsx
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── resumes/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── applications/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── analytics/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   └── layout.tsx
├── tailor/
│   ├── input/
│   │   └── page.tsx
│   ├── analysis/
│   │   └── page.tsx
│   ├── customize/
│   │   └── page.tsx
│   └── download/
│       └── page.tsx
├── onboarding/
│   ├── welcome/
│   │   └── page.tsx
│   ├── upload/
│   │   └── page.tsx
│   ├── job-description/
│   │   └── page.tsx
│   └── results/
│       └── page.tsx
├── api/
│   └── [multiple API routes]
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── ui/                     # ShadCN UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── [other UI components]
├── auth/
│   ├── MagicLinkForm.tsx
│   └── AuthGuard.tsx
├── dashboard/
│   ├── StatCard.tsx
│   ├── RecentActivity.tsx
│   └── QuickActions.tsx
├── resume/
│   ├── ResumeUpload.tsx
│   ├── ResumePreview.tsx
│   ├── ResumeLibrary.tsx
│   └── VersionHistory.tsx
├── tailor/
│   ├── JobDescriptionInput.tsx
│   ├── AnalysisResults.tsx
│   ├── TailoringCustomizer.tsx
│   └── ComparisonView.tsx
├── applications/
│   ├── ApplicationsList.tsx
│   ├── ApplicationCard.tsx
│   ├── StatusTimeline.tsx
│   └── ApplicationForm.tsx
├── analytics/
│   ├── MetricsGrid.tsx
│   ├── ChartsSection.tsx
│   └── InsightsPanel.tsx
└── common/
    ├── Header.tsx
    ├── Sidebar.tsx
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    └── MobileNavigation.tsx

lib/
├── supabase.ts            # Supabase client
├── mongodb.ts             # MongoDB connection
├── auth.ts                # Auth utilities
├── utils.ts               # Common utilities
├── validations.ts         # Zod schemas
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts
│   ├── useResumes.ts
│   ├── useApplications.ts
│   └── useAnalytics.ts
└── store/                 # Zustand stores
    ├── authStore.ts
    ├── resumeStore.ts
    └── applicationStore.ts

types/
├── auth.ts
├── resume.ts
├── application.ts
├── analytics.ts
└── api.ts
```

### State Management Strategy

```typescript
// lib/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      loading: true,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (loading) => set({ loading }),
      signOut: () => set({ user: null, profile: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, profile: state.profile }),
    }
  )
);

// lib/hooks/useAuth.ts
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const { user, profile, loading, setUser, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user && !profile) {
          // Fetch user profile
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (data) setProfile(data);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, profile, loading };
}
```

## Performance Optimization

### Frontend Optimizations

```typescript
// Next.js App Router optimizations
// app/layout.tsx
export const metadata = {
  title: 'Resume Tailor - AI-Powered Resume Optimization',
  description: 'Tailor your resume for any job in seconds with AI',
};

// Dynamic imports for heavy components
const AnalyticsCharts = dynamic(() => import('@/components/analytics/ChartsSection'), {
  loading: () => <ChartsSkeleton />,
  ssr: false,
});

// Image optimization
import Image from 'next/image';
<Image
  src="/resume-preview.jpg"
  alt="Resume preview"
  width={400}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Bundle analysis and splitting
// next.config.js
module.exports = {
  experimental: {
    appDir: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    return config;
  },
};
```

### Database Optimizations

```sql
-- PostgreSQL query optimization
-- Indexes for common queries
CREATE INDEX CONCURRENTLY idx_applications_user_status ON applications(user_id, status);
CREATE INDEX CONCURRENTLY idx_resumes_user_created ON resumes(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_applications_date_score ON applications(application_date DESC, match_score DESC);

-- Materialized view for analytics
CREATE MATERIALIZED VIEW user_analytics AS
SELECT 
  user_id,
  COUNT(*) as total_applications,
  AVG(match_score) as avg_match_score,
  COUNT(CASE WHEN status IN ('interview', 'final_round', 'offer') THEN 1 END) * 100.0 / COUNT(*) as interview_rate,
  MAX(application_date) as last_application_date
FROM applications 
GROUP BY user_id;

-- Auto-refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_user_analytics()
RETURNS void AS $
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_analytics;
END;
$ LANGUAGE plpgsql;

-- Scheduled refresh (using pg_cron extension)
SELECT cron.schedule('refresh-analytics', '0 2 * * *', 'SELECT refresh_user_analytics();');
```

### Caching Strategy

```typescript
// lib/cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export class CacheManager {
  static async get(key: string) {
    try {
      return await redis.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set(key: string, value: any, ttl: number = 3600) {
    try {
      return await redis.set(key, JSON.stringify(value), { ex: ttl });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static async invalidate(pattern: string) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }
}

// Usage in API routes
export async function GET(request: Request) {
  const userId = request.headers.get('x-user-id');
  const cacheKey = `user:${userId}:analytics`;
  
  // Try cache first
  let analytics = await CacheManager.get(cacheKey);
  
  if (!analytics) {
    // Fetch from database
    analytics = await fetchUserAnalytics(userId);
    // Cache for 1 hour
    await CacheManager.set(cacheKey, analytics, 3600);
  }
  
  return Response.json(analytics);
}
```

## Security Considerations

### Data Protection

```typescript
// lib/security.ts
import crypto from 'crypto';

export class SecurityManager {
  // Encrypt sensitive data before storing
  static encrypt(text: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  // Decrypt sensitive data
  static decrypt(encryptedText: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipher(algorithm, key);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');