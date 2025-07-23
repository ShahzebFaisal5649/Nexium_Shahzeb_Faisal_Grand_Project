# Resume Tailor - Product Requirements Document

## 1. Project Overview

### Vision Statement
An AI-powered web application that automatically tailors resumes to match specific job descriptions, increasing interview chances by optimizing keyword matching and content relevance.

### Core Value Proposition
- **For Job Seekers:** Automatically customize resumes for each job application in seconds
- **Problem Solved:** Manual resume tailoring is time-consuming and often ineffective
- **Solution:** AI analyzes job descriptions and intelligently modifies resume content

## 2. User Personas

### Primary Persona: Active Job Seeker (Sarah, 28)
- **Background:** Marketing professional with 5+ years experience
- **Pain Points:** Applies to 10-15 jobs weekly, manually editing resume each time
- **Goals:** Higher response rates, save time, track application success
- **Tech Comfort:** High - uses multiple productivity tools

### Secondary Persona: Career Changer (Mike, 35)
- **Background:** Transitioning from finance to tech
- **Pain Points:** Struggle to highlight transferable skills
- **Goals:** Make career transition smoother, highlight relevant experience
- **Tech Comfort:** Medium - comfortable with web apps

## 3. Feature Specifications

### Core Features (MVP)

#### 3.1 Authentication System
- **Magic Link Login:** Email-based passwordless authentication
- **User Profiles:** Store personal info, resume templates, job history
- **Session Management:** Secure token-based sessions

#### 3.2 Resume Management
- **Upload Resume:** PDF/DOCX upload with text extraction
- **Resume Templates:** 3-5 professional templates
- **Version History:** Track different tailored versions
- **Master Resume:** Original version that serves as base template

#### 3.3 Job Description Analysis
- **JD Input:** Paste or upload job description
- **Keyword Extraction:** AI identifies key skills, requirements, technologies
- **Match Scoring:** Algorithm scores current resume against JD
- **Gap Analysis:** Identifies missing keywords/skills

#### 3.4 AI-Powered Tailoring
- **Content Optimization:** Rewrite bullet points to match JD language
- **Skill Highlighting:** Promote relevant skills to top sections
- **Keyword Integration:** Natural insertion of missing keywords
- **ATS Optimization:** Format for Applicant Tracking Systems

#### 3.5 Dashboard & Analytics
- **Application Tracker:** Log applications with status updates
- **Success Metrics:** Track response rates, interview rates
- **Resume Performance:** Which versions perform best
- **Improvement Suggestions:** AI recommendations for profile enhancement

### Advanced Features (Future Releases)

#### 3.6 Cover Letter Generation
- **Auto-Generation:** Create cover letters matching resume style
- **Company Research:** Integrate company info for personalization
- **Template Library:** Various cover letter formats

#### 3.7 Interview Preparation
- **Question Prediction:** Likely interview questions based on JD
- **Answer Suggestions:** Tailored responses using resume content
- **Mock Interview:** AI-powered practice sessions

## 4. Technical Requirements

### 4.1 Frontend Stack
- **Framework:** Next.js 15 with App Router
- **UI Library:** ShadCN UI + Tailwind CSS
- **State Management:** React Context + localStorage
- **File Handling:** React Dropzone for uploads
- **PDF Generation:** jsPDF or Puppeteer

### 4.2 Backend Architecture
- **API Routes:** Next.js API routes for server-side logic
- **Authentication:** Supabase Auth with magic links
- **File Storage:** Supabase Storage for resume files
- **Document Processing:** PDF-parse for text extraction

### 4.3 Database Design

#### Supabase (PostgreSQL)
```sql
-- Users table (handled by Supabase Auth)
users (
  id: uuid primary key,
  email: varchar,
  created_at: timestamp,
  last_sign_in: timestamp
)

-- User profiles
profiles (
  id: uuid primary key references users(id),
  full_name: varchar,
  phone: varchar,
  location: varchar,
  linkedin_url: varchar,
  created_at: timestamp,
  updated_at: timestamp
)

-- Resume templates
resumes (
  id: uuid primary key,
  user_id: uuid references users(id),
  title: varchar,
  is_master: boolean default false,
  file_url: varchar,
  extracted_text: text,
  created_at: timestamp,
  updated_at: timestamp
)

-- Job applications
applications (
  id: uuid primary key,
  user_id: uuid references users(id),
  resume_id: uuid references resumes(id),
  company_name: varchar,
  job_title: varchar,
  job_description: text,
  application_date: timestamp,
  status: varchar, -- 'applied', 'responded', 'interview', 'rejected', 'offer'
  match_score: integer,
  created_at: timestamp,
  updated_at: timestamp
)
```

#### MongoDB Collections
```javascript
// AI Analysis Results
analysisResults: {
  _id: ObjectId,
  applicationId: String, // Reference to Supabase application
  jobKeywords: [String],
  resumeKeywords: [String],
  matchingKeywords: [String],
  missingKeywords: [String],
  skillsGap: [String],
  tailoringsuggestions: [Object],
  matchScore: Number,
  createdAt: Date,
  updatedAt: Date
}

// AI Workflow Logs
workflowLogs: {
  _id: ObjectId,
  userId: String,
  workflowType: String, // 'tailor_resume', 'analyze_jd', 'generate_cover_letter'
  inputData: Object,
  outputData: Object,
  executionTime: Number,
  status: String, // 'success', 'error', 'pending'
  errorMessage: String,
  createdAt: Date
}
```

### 4.4 AI Integration (n8n Workflows)

#### Workflow 1: Job Description Analysis
- **Input:** Job description text
- **Process:** 
  - Extract keywords using NLP
  - Categorize skills (technical, soft, industry-specific)
  - Identify experience requirements
  - Score importance of each requirement
- **Output:** Structured analysis object

#### Workflow 2: Resume Tailoring
- **Input:** Resume text + JD analysis
- **Process:**
  - Match existing skills to JD requirements
  - Rewrite bullet points for keyword optimization
  - Suggest new sections or reordering
  - Generate ATS-friendly formatting suggestions
- **Output:** Tailored resume content + change log

#### Workflow 3: Cover Letter Generation
- **Input:** Resume + Job Description + Company info
- **Process:**
  - Generate personalized opening paragraph
  - Create body paragraphs highlighting relevant experience
  - Craft compelling closing with call-to-action
- **Output:** Complete cover letter draft

## 5. Success Metrics

### User Engagement
- **User Retention:** 70% of users return within 7 days
- **Resume Uploads:** Average 3+ resumes per active user
- **Applications Tracked:** 80% of users log job applications

### Feature Usage
- **Tailoring Success:** 85% of tailored resumes have higher match scores
- **Time Savings:** Average 15 minutes per resume (vs 1 hour manual)
- **Feature Adoption:** 60% use cover letter generation within 30 days

### Business Impact
- **User Satisfaction:** 4.5+ star rating
- **Interview Rate:** 25% improvement in user-reported interview rates
- **Conversion:** 40% of free users upgrade to premium features

## 6. User Journey Flow

### New User Onboarding
1. **Landing Page:** Value proposition + demo video
2. **Magic Link Signup:** Email verification
3. **Profile Setup:** Basic info collection
4. **Resume Upload:** Master resume upload + parsing
5. **First Tailoring:** Guided job description input + AI tailoring
6. **Results Review:** Show improvements + match score
7. **Dashboard Tour:** Feature overview

### Regular Usage Flow
1. **Dashboard:** View recent applications + quick actions
2. **New Application:** Input job description
3. **AI Analysis:** Real-time JD processing (30 seconds)
4. **Tailoring Options:** Review suggestions + customize
5. **Resume Generation:** Download tailored version
6. **Application Tracking:** Log application status
7. **Performance Review:** Check match scores + success rates

## 7. Technical Implementation Priority

### Phase 1 (Days 15-18): Backend & Database
- Supabase setup + authentication
- MongoDB connection + schemas
- File upload/storage system
- Basic CRUD operations

### Phase 2 (Days 19-21): Frontend UI
- Authentication pages
- Dashboard layout
- Resume upload interface
- Job description input form

### Phase 3 (Days 22-24): AI Integration
- n8n workflow development
- API integration with AI services
- Resume tailoring logic
- Match scoring algorithm

### Phase 4 (Days 25-30): Polish & Deploy
- UI/UX improvements
- Performance optimization
- Testing + bug fixes
- Production deployment

## 8. Risk Mitigation

### Technical Risks
- **AI API Limits:** Implement caching + rate limiting
- **File Processing Errors:** Robust error handling + fallbacks
- **Performance Issues:** Optimize database queries + implement CDN

### User Experience Risks
- **Complex Interface:** Progressive disclosure + onboarding
- **Poor AI Results:** Human review option + feedback loops
- **Data Privacy Concerns:** Clear privacy policy + data encryption

## 9. Future Roadmap

### Quarter 1: Core Platform
- MVP launch with core features
- User feedback collection
- Performance optimization

### Quarter 2: Advanced Features
- Cover letter generation
- Interview preparation tools
- Chrome extension for job sites

### Quarter 3: Integrations
- LinkedIn integration
- Job board APIs
- Calendar integration for interview scheduling

### Quarter 4: Enterprise
- Team collaboration features
- Recruiter dashboard
- API for third-party integrations