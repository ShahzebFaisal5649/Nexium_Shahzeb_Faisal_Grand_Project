# Deployment Guide - Resume Tailor AI

This comprehensive guide covers all aspects of deploying the Resume Tailor AI application to production environments.

## 🚀 Quick Start Commands

### Complete Setup from Scratch

```bash
# 1. Clone and setup the project
git clone https://github.com/ShahzebFaisal5649/Nexium_Shahzeb_Faisal_Grand_Project.git
cd Nexium_Shahzeb_Faisal_Grand_Project

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Setup Supabase project
npx supabase init
npx supabase start

# 5. Run database migrations
npx supabase db push

# 6. Start development server
npm run dev
```

### Production Deployment Commands

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Deploy to Vercel
npx vercel --prod

# Deploy with Docker
docker build -t resume-tailor-ai .
docker run -p 3000:3000 resume-tailor-ai
```

## 🏗️ Infrastructure Setup

### 1. Supabase Configuration

#### Create Supabase Project
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Create new project (or link existing)
supabase projects create resume-tailor-ai

# Initialize in your project
supabase init

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF
```

#### Database Schema Setup
```sql
-- Execute this SQL in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE application_status AS ENUM (
  'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'
);

CREATE TYPE employment_type AS ENUM (
  'full-time', 'part-time', 'contract', 'internship', 'freelance'
);

CREATE TYPE remote_type AS ENUM (
  'on-site', 'remote', 'hybrid'
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  linkedin_url TEXT,
  current_job_title TEXT,
  years_experience INTEGER CHECK (years_experience >= 0),
  industry TEXT,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[],
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resumes table
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (length(title) > 0),
  is_master BOOLEAN DEFAULT FALSE,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER CHECK (file_size > 0),
  file_type TEXT,
  extracted_text TEXT,
  parsed_data JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_file_type CHECK (
    file_type IN ('application/pdf', 'application/msword', 
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  ),
  CONSTRAINT valid_file_size CHECK (file_size <= 10485760) -- 10MB
);

-- Create job_descriptions table
CREATE TABLE job_descriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL CHECK (length(company_name) > 0),
  job_title TEXT NOT NULL CHECK (length(job_title) > 0),
  job_url TEXT,
  description_text TEXT NOT NULL CHECK (length(description_text) >= 50),
  location TEXT,
  salary_range TEXT,
  employment_type employment_type DEFAULT 'full-time',
  remote_type remote_type DEFAULT 'on-site',
  experience_level TEXT,
  requirements TEXT[],
  benefits TEXT[],
  company_info JSONB DEFAULT '{}',
  parsed_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_url CHECK (job_url IS NULL OR job_url ~* '^https?://'),
  CONSTRAINT valid_description_length CHECK (length(description_text) <= 10000)
);

-- Create applications table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES resumes ON DELETE SET NULL,
  job_description_id UUID REFERENCES job_descriptions ON DELETE SET NULL,
  company_name TEXT NOT NULL CHECK (length(company_name) > 0),
  job_title TEXT NOT NULL CHECK (length(job_title) > 0),
  application_date DATE DEFAULT CURRENT_DATE,
  status application_status DEFAULT 'applied',
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  notes TEXT,
  application_url TEXT,
  salary_offered TEXT,
  response_date DATE,
  interview_dates DATE[],
  follow_up_dates DATE[],
  rejection_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_application_url CHECK (
    application_url IS NULL OR application_url ~* '^https?://'
  ),
  CONSTRAINT valid_dates CHECK (
    response_date IS NULL OR response_date >= application_date
  )
);

-- Create resume_versions table for version control
CREATE TABLE resume_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID REFERENCES resumes ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  changes_summary TEXT,
  tailored_content TEXT,
  match_score_before INTEGER,
  match_score_after INTEGER,
  job_description_id UUID REFERENCES job_descriptions ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(resume_id, version_number),
  CHECK (version_number > 0),
  CHECK (match_score_before IS NULL OR (match_score_before >= 0 AND match_score_before <= 100)),
  CHECK (match_score_after IS NULL OR (match_score_after >= 0 AND match_score_after <= 100))
);

-- Create application_events table for timeline tracking
CREATE TABLE application_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CHECK (event_type IN ('status_change', 'interview_scheduled', 'follow_up', 'note_added', 'document_sent'))
);

-- Create indexes for performance
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_is_master ON resumes(user_id, is_master) WHERE is_master = true;
CREATE INDEX idx_resumes_created_at ON resumes(created_at DESC);

CREATE INDEX idx_job_descriptions_user_id ON job_descriptions(user_id);
CREATE INDEX idx_job_descriptions_company ON job_descriptions(company_name);
CREATE INDEX idx_job_descriptions_created_at ON job_descriptions(created_at DESC);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(user_id, status);
CREATE INDEX idx_applications_date ON applications(application_date DESC);
CREATE INDEX idx_applications_company ON applications(company_name);

CREATE INDEX idx_resume_versions_resume_id ON resume_versions(resume_id, version_number DESC);
CREATE INDEX idx_application_events_application_id ON application_events(application_id, event_date DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Resumes policies
CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON resumes
  FOR DELETE USING (auth.uid() = user_id);

-- Job descriptions policies
CREATE POLICY "Users can view own job descriptions" ON job_descriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job descriptions" ON job_descriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job descriptions" ON job_descriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own job descriptions" ON job_descriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Applications policies
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON applications
  FOR DELETE USING (auth.uid() = user_id);

-- Resume versions policies
CREATE POLICY "Users can view own resume versions" ON resume_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM resumes 
      WHERE resumes.id = resume_versions.resume_id 
      AND resumes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own resume versions" ON resume_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM resumes 
      WHERE resumes.id = resume_versions.resume_id 
      AND resumes.user_id = auth.uid()
    )
  );

-- Application events policies
CREATE POLICY "Users can view own application events" ON application_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_events.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own application events" ON application_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_events.application_id 
      AND applications.user_id = auth.uid()
    )
  );

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamps
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at 
  BEFORE UPDATE ON resumes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_descriptions_updated_at 
  BEFORE UPDATE ON job_descriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at 
  BEFORE UPDATE ON applications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create application events on status change
CREATE OR REPLACE FUNCTION create_application_event_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO application_events (application_id, event_type, title, description)
    VALUES (
      NEW.id,
      'status_change',
      'Status changed to ' || NEW.status,
      'Application status changed from ' || COALESCE(OLD.status::text, 'unknown') || ' to ' || NEW.status::text
    );
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER application_status_change_event
  AFTER UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION create_application_event_on_status_change();
```

#### Storage Setup
```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('exports', 'exports', false);

-- Create storage policies
CREATE POLICY "Users can upload own resumes" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own resumes" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own resumes" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'resumes' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own resumes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'resumes' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Similar policies for exports bucket
CREATE POLICY "Users can upload own exports" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'exports' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own exports" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'exports' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own exports" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'exports' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 2. MongoDB Setup

#### MongoDB Atlas (Recommended)
```bash
# 1. Create MongoDB Atlas account at https://www.mongodb.com/atlas
# 2. Create a new cluster
# 3. Create database user
# 4. Whitelist IP addresses
# 5. Get connection string

# Connection string format:
# mongodb+srv://username:password@cluster.mongodb.net/resume-tailor-ai?retryWrites=true&w=majority
```

#### Local MongoDB Setup
```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0

# Ubuntu
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and collections
mongosh
use resume-tailor-ai
db.createCollection("jobAnalysis")
db.createCollection("resumeAnalysis")
db.createCollection("matchAnalysis")
db.createCollection("tailoringResults")

# Create indexes for better performance
db.jobAnalysis.createIndex({ "jobDescriptionId": 1, "userId": 1 })
db.resumeAnalysis.createIndex({ "resumeId": 1, "userId": 1 })
db.matchAnalysis.createIndex({ "resumeId": 1, "jobDescriptionId": 1, "userId": 1 })
db.tailoringResults.createIndex({ "originalResumeId": 1, "jobDescriptionId": 1, "userId": 1 })
```

## 🌐 Deployment Platforms

### 1. Vercel Deployment (Recommended)

#### Setup Vercel Project
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# For production deployment
vercel --prod
```

#### Environment Variables in Vercel
```bash
# Add environment variables via Vercel dashboard or CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add MONGODB_URI
vercel env add OPENAI_API_KEY
vercel env add OPENAI_API_BASE
```

#### Vercel Configuration
Create `vercel.json`:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://your-domain.vercel.app"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_APP_URL": "https://your-domain.vercel.app"
    }
  }
}
```

### 2. Docker Deployment

#### Dockerfile
```dockerfile
# Multi-stage build for optimized production image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - MONGODB_URI=${MONGODB_URI}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - mongodb
    restart: unless-stopped

  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
      - MONGO_INITDB_DATABASE=resume-tailor-ai
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mongodb_data:
```

#### Build and Deploy with Docker
```bash
# Build the image
docker build -t resume-tailor-ai .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Scale the application
docker-compose up -d --scale app=3

# Stop and remove containers
docker-compose down
```

### 3. AWS Deployment

#### AWS Amplify
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize Amplify project
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

#### AWS ECS with Fargate
```yaml
# ecs-task-definition.json
{
  "family": "resume-tailor-ai",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "resume-tailor-ai",
      "image": "your-account.dkr.ecr.region.amazonaws.com/resume-tailor-ai:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "NEXT_PUBLIC_SUPABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:resume-tailor-ai/supabase-url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/resume-tailor-ai",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## 🔧 Configuration Files

### Next.js Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'your-supabase-project.supabase.co',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com'
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Enable standalone output for Docker
  output: 'standalone',
  // Optimize bundle size
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const withBundleAnalyzer = require('@next/bundle-analyzer')({
        enabled: true,
      })
      return withBundleAnalyzer(config)
    }
    return config
  },
}

module.exports = nextConfig
```

### Tailwind Configuration
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
}
```

### ESLint Configuration
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "prefer-const": "error",
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": "warn"
  },
  "overrides": [
    {
      "files": ["**/*.ts", "**/*.tsx"],
      "rules": {
        "@typescript-eslint/no-explicit-any": "warn"
      }
    }
  ]
}
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

## 🔐 Security Configuration

### Content Security Policy
```javascript
// next.config.js - Add CSP headers
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-scripts.com;
      child-src *.youtube.com *.google.com *.supabase.co;
      style-src 'self' 'unsafe-inline' *.googleapis.com;
      img-src * blob: data:;
      media-src 'none';
      connect-src *;
      font-src 'self' *.googleapis.com *.gstatic.com;
    `.replace(/\n/g, ''),
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'false',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

### Rate Limiting
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Create different rate limiters for different endpoints
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 minutes
  analytics: true,
})

export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 h'), // 100 requests per hour
  analytics: true,
})

export const uploadRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 uploads per hour
  analytics: true,
})
```

## 📊 Monitoring and Analytics

### Error Tracking with Sentry
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure Sentry
npx @sentry/wizard -i nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
```

### Performance Monitoring
```typescript
// lib/analytics.ts
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
      <SpeedInsights />
    </>
  )
}
```

### Health Checks
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { MongoDB } from '@/lib/mongodb'

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      mongodb: 'unknown',
      storage: 'unknown',
    },
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
  }

  try {
    // Check Supabase connection
    const { error: dbError } = await supabase.from('profiles').select('count').limit(1)
    health.services.database = dbError ? 'down' : 'up'

    // Check MongoDB connection
    const db = await MongoDB.getDatabase()
    await db.admin().ping()
    health.services.mongodb = 'up'

    // Check Supabase Storage
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
    health.services.storage = storageError ? 'down' : 'up'

    // Determine overall health
    const allServicesUp = Object.values(health.services).every(status => status === 'up')
    health.status = allServicesUp ? 'healthy' : 'degraded'

  } catch (error) {
    health.status = 'unhealthy'
    console.error('Health check failed:', error)
  }

  const statusCode = health.status === 'healthy' ? 200 : 503
  return NextResponse.json(health, { status: statusCode })
}
```

## 🧪 Testing in Production

### End-to-End Testing
```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install
```

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should sign up new user', async ({ page }) => {
    await page.goto('/signup')
    
    await page.fill('[data-testid=email]', 'test@example.com')
    await page.fill('[data-testid=password]', 'TestPassword123!')
    await page.fill('[data-testid=confirmPassword]', 'TestPassword123!')
    
    await page.click('[data-testid=signup-button]')
    
    await expect(page).toHaveURL('/dashboard')
  })

  test('should sign in existing user', async ({ page }) => {
    await page.goto('/signin')
    
    await page.fill('[data-testid=email]', 'test@example.com')
    await page.fill('[data-testid=password]', 'TestPassword123!')
    
    await page.click('[data-testid=signin-button]')
    
    await expect(page).toHaveURL('/dashboard')
  })
})
```

### Load Testing
```bash
# Install k6
brew install k6  # macOS
# or download from https://k6.io/docs/getting-started/installation/

# Create load test script
```

```javascript
// load-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export let options = {
  vus: 10, // 10 virtual users
  duration: '30s',
}

export default function () {
  let response = http.get('https://your-domain.vercel.app/api/health')
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })
  
  sleep(1)
}
```

```bash
# Run load test
k6 run load-test.js
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:7.0
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
        env:
          MONGODB_URI: mongodb://localhost:27017/test
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  e2e:
    needs: deploy
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npx playwright test
        env:
          BASE_URL: https://your-domain.vercel.app
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📈 Performance Optimization

### Database Optimization
```sql
-- Add database indexes for better performance
CREATE INDEX CONCURRENTLY idx_resumes_user_created 
ON resumes(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_applications_user_status_date 
ON applications(user_id, status, application_date DESC);

CREATE INDEX CONCURRENTLY idx_job_descriptions_user_company 
ON job_descriptions(user_id, company_name);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM applications 
WHERE user_id = 'user-uuid' 
AND status = 'applied' 
ORDER BY application_date DESC 
LIMIT 20;
```

### Caching Strategy
```typescript
// lib/cache.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key)
      return cached as T
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  static async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  static async del(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      console.error('Cache invalidate error:', error)
    }
  }
}
```

### Image Optimization
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

## 🚨 Disaster Recovery

### Backup Strategy
```bash
# Supabase backup (automated via Supabase dashboard)
# Manual backup command:
pg_dump "postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres" > backup.sql

# MongoDB backup
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/resume-tailor-ai" --out=./backup

# Restore MongoDB
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/resume-tailor-ai" ./backup/resume-tailor-ai
```

### Environment Recovery
```bash
# Create environment backup script
#!/bin/bash
# backup-env.sh

echo "Creating environment backup..."

# Backup environment variables
cp .env.local .env.backup.$(date +%Y%m%d_%H%M%S)

# Backup Vercel environment variables
vercel env ls > vercel-env-backup.$(date +%Y%m%d_%H%M%S).txt

# Backup database schema
supabase db dump --schema-only > schema-backup.$(date +%Y%m%d_%H%M%S).sql

echo "Backup completed successfully!"
```

## 📋 Deployment Checklist

### Pre-deployment Checklist
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Storage buckets created and configured
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] Performance monitoring configured
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Rate limiting configured
- [ ] Health checks implemented

### Post-deployment Checklist
- [ ] Application loads successfully
- [ ] Authentication works
- [ ] File uploads work
- [ ] Database operations work
- [ ] Email notifications work
- [ ] Error tracking captures errors
- [ ] Analytics data flows
- [ ] Performance metrics collected
- [ ] Health checks pass
- [ ] Load testing completed
- [ ] E2E tests pass
- [ ] Monitoring alerts configured

### Rollback Plan
```bash
# Vercel rollback
vercel rollback [deployment-url]

# Docker rollback
docker-compose down
docker-compose up -d --scale app=0
docker tag resume-tailor-ai:previous resume-tailor-ai:latest
docker-compose up -d

# Database rollback (if needed)
supabase db reset --linked
```

---

This deployment guide provides comprehensive instructions for deploying the Resume Tailor AI application to production. Follow the steps carefully and customize the configurations based on your specific requirements and infrastructure choices.

For additional support or questions, refer to the main README.md file or create an issue in the project repository.
