# Resume Tailor AI - Complete Project Setup Guide

A comprehensive Next.js application for AI-powered resume tailoring and job application tracking. This project provides a complete solution for job seekers to optimize their resumes for specific job descriptions, track applications, and analyze their job search performance.

## 🚀 Project Overview

Resume Tailor AI is a full-stack application built with modern technologies:

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Supabase for authentication and PostgreSQL database, MongoDB for AI analysis data
- **AI Integration**: OpenAI GPT models for resume analysis and tailoring
- **State Management**: Zustand for client-side state management
- **File Storage**: Supabase Storage for resume files
- **Deployment**: Vercel for frontend, Supabase for backend services

## 📁 Project Structure

```
resume-tailor-ai/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication routes
│   │   ├── signin/
│   │   ├── signup/
│   │   └── layout.tsx
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── resumes/
│   │   ├── applications/
│   │   ├── analytics/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── tailor/                   # Resume tailoring workflow
│   │   ├── input/
│   │   ├── analysis/
│   │   ├── customize/
│   │   └── download/
│   ├── onboarding/               # User onboarding flow
│   │   ├── welcome/
│   │   ├── upload/
│   │   ├── job-description/
│   │   └── results/
│   ├── api/                      # API routes
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Reusable React components
│   ├── ui/                       # Base UI components (ShadCN)
│   ├── auth/                     # Authentication components
│   ├── dashboard/                # Dashboard-specific components
│   ├── resume/                   # Resume management components
│   ├── tailor/                   # Resume tailoring components
│   ├── applications/             # Application tracking components
│   ├── analytics/                # Analytics and reporting components
│   └── common/                   # Shared components
├── lib/                          # Utility functions and configurations
│   ├── hooks/                    # Custom React hooks
│   ├── store/                    # Zustand state stores
│   ├── supabase.ts              # Supabase client configuration
│   ├── mongodb.ts               # MongoDB connection utilities
│   ├── auth.ts                  # Authentication utilities
│   ├── utils.ts                 # Common utility functions
│   └── validations.ts           # Zod validation schemas
├── types/                        # TypeScript type definitions
│   ├── auth.ts
│   ├── resume.ts
│   ├── application.ts
│   ├── analytics.ts
│   └── api.ts
├── public/                       # Static assets
├── .env.local                    # Environment variables
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🛠 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase CLI** (optional, for local development)
- **MongoDB** (local installation or MongoDB Atlas account)

## 📦 Installation and Setup

### 1. Clone the Repository

```bash
# Clone your existing repository
git clone https://github.com/ShahzebFaisal5649/Nexium_Shahzeb_Faisal_Grand_Project.git
cd Nexium_Shahzeb_Faisal_Grand_Project

# Or if starting fresh, initialize a new repository
git init
git remote add origin https://github.com/ShahzebFaisal5649/Nexium_Shahzeb_Faisal_Grand_Project.git
```

### 2. Install Dependencies

```bash
# Install all project dependencies
npm install

# Or using yarn
yarn install
```

### 3. Install Required Packages

```bash
# Core Next.js and React dependencies
npm install next@latest react@latest react-dom@latest

# TypeScript and type definitions
npm install -D typescript @types/react @types/node @types/react-dom

# UI and Styling
npm install tailwindcss@latest postcss@latest autoprefixer@latest
npm install @tailwindcss/forms @tailwindcss/typography
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react

# Radix UI components (for ShadCN)
npm install @radix-ui/react-alert-dialog @radix-ui/react-avatar
npm install @radix-ui/react-checkbox @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu @radix-ui/react-label
npm install @radix-ui/react-select @radix-ui/react-separator
npm install @radix-ui/react-slot @radix-ui/react-tabs
npm install @radix-ui/react-toast @radix-ui/react-tooltip

# State Management
npm install zustand

# Authentication and Database
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install mongodb

# Form Handling and Validation
npm install react-hook-form @hookform/resolvers
npm install zod

# File Upload and Processing
npm install react-dropzone

# Date Handling
npm install date-fns

# Charts and Analytics
npm install recharts

# PDF Processing (for resume parsing)
npm install pdf-parse mammoth

# Development Dependencies
npm install -D eslint eslint-config-next
npm install -D prettier eslint-config-prettier
npm install -D @types/pdf-parse
```

### 4. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Create environment file
touch .env.local
```

Add the following environment variables:

```env
# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/resume-tailor-ai
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-tailor-ai

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_BASE=https://api.openai.com/v1

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Analytics (optional)
GOOGLE_ANALYTICS_ID=your_ga_id
```

### 5. Database Setup

#### Supabase Setup

1. **Create a Supabase Project**:
   ```bash
   # Install Supabase CLI (optional)
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Initialize Supabase in your project
   supabase init
   ```

2. **Create Database Tables**:

   Execute the following SQL in your Supabase SQL editor:

   ```sql
   -- Create profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
     full_name TEXT,
     phone TEXT,
     location TEXT,
     linkedin_url TEXT,
     current_job_title TEXT,
     years_experience INTEGER,
     industry TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create resumes table
   CREATE TABLE resumes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
     title TEXT NOT NULL,
     is_master BOOLEAN DEFAULT FALSE,
     file_url TEXT,
     file_size INTEGER,
     file_type TEXT,
     extracted_text TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create job_descriptions table
   CREATE TABLE job_descriptions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
     company_name TEXT NOT NULL,
     job_title TEXT NOT NULL,
     job_url TEXT,
     description_text TEXT NOT NULL,
     location TEXT,
     salary_range TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create applications table
   CREATE TABLE applications (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
     resume_id UUID REFERENCES resumes ON DELETE SET NULL,
     job_description_id UUID REFERENCES job_descriptions ON DELETE SET NULL,
     company_name TEXT NOT NULL,
     job_title TEXT NOT NULL,
     application_date DATE DEFAULT CURRENT_DATE,
     status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn')),
     match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
     notes TEXT,
     application_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create indexes for better performance
   CREATE INDEX idx_resumes_user_id ON resumes(user_id);
   CREATE INDEX idx_applications_user_id ON applications(user_id);
   CREATE INDEX idx_job_descriptions_user_id ON job_descriptions(user_id);

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
   ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

   -- Create RLS policies
   CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
   CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

   CREATE POLICY "Users can view own resumes" ON resumes FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own resumes" ON resumes FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own resumes" ON resumes FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own job descriptions" ON job_descriptions FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own job descriptions" ON job_descriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own job descriptions" ON job_descriptions FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own job descriptions" ON job_descriptions FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own applications" ON applications FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own applications" ON applications FOR DELETE USING (auth.uid() = user_id);
   ```

3. **Set up Storage Bucket**:
   ```sql
   -- Create storage bucket for resumes
   INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);

   -- Create storage policies
   CREATE POLICY "Users can upload own resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
   CREATE POLICY "Users can view own resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
   CREATE POLICY "Users can delete own resumes" ON storage.objects FOR DELETE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

#### MongoDB Setup

1. **Local MongoDB Installation**:
   ```bash
   # On macOS using Homebrew
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   
   # On Ubuntu
   sudo apt update
   sudo apt install mongodb
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   
   # On Windows
   # Download and install MongoDB Community Server from mongodb.com
   ```

2. **Or use MongoDB Atlas** (recommended for production):
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string and add it to `.env.local`

### 6. Configuration Files

#### Tailwind CSS Configuration

Create or update `tailwind.config.js`:

```javascript
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
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
}
```

#### Next.js Configuration

Create or update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

#### TypeScript Configuration

Create or update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 🚀 Running the Application

### Development Mode

```bash
# Start the development server
npm run dev

# Or using yarn
yarn dev

# The application will be available at http://localhost:3000
```

### Production Build

```bash
# Build the application for production
npm run build

# Start the production server
npm start
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## 📊 Database Management

### Supabase Migrations

```bash
# Create a new migration
supabase migration new migration_name

# Apply migrations
supabase db push

# Reset database (development only)
supabase db reset
```

### MongoDB Operations

```bash
# Connect to MongoDB shell
mongosh

# Use the resume-tailor-ai database
use resume-tailor-ai

# View collections
show collections

# Query examples
db.jobAnalysis.find({}).limit(5)
db.resumeAnalysis.find({}).limit(5)
```

## 🔧 Development Workflow

### Adding New Components

```bash
# Create a new component
mkdir components/feature-name
touch components/feature-name/ComponentName.tsx

# Add the component to the index file
echo "export { ComponentName } from './ComponentName'" >> components/feature-name/index.ts
```

### Adding New Pages

```bash
# Create a new page in the app directory
mkdir app/new-page
touch app/new-page/page.tsx
touch app/new-page/layout.tsx  # Optional
```

### Adding New API Routes

```bash
# Create a new API route
mkdir app/api/new-endpoint
touch app/api/new-endpoint/route.ts
```

## 🧪 Testing

### Setting Up Tests

```bash
# Install testing dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D jest-environment-jsdom

# Create test configuration
touch jest.config.js
touch jest.setup.js
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📱 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy to Vercel
   vercel --prod
   ```

2. **Environment Variables**:
   Add all environment variables from `.env.local` to your Vercel project settings.

3. **Custom Domain** (Optional):
   ```bash
   # Add custom domain
   vercel domains add yourdomain.com
   ```

### Alternative Deployment Options

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

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

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

```bash
# Build and run Docker container
docker build -t resume-tailor-ai .
docker run -p 3000:3000 resume-tailor-ai
```

## 🔍 Monitoring and Analytics

### Error Tracking

```bash
# Install Sentry for error tracking
npm install @sentry/nextjs

# Configure Sentry
npx @sentry/wizard -i nextjs
```

### Performance Monitoring

```bash
# Install analytics packages
npm install @vercel/analytics
npm install @vercel/speed-insights
```

## 🛡️ Security Considerations

### Environment Variables Security

- Never commit `.env.local` to version control
- Use different API keys for development and production
- Rotate API keys regularly
- Use Vercel's environment variable encryption

### Database Security

- Enable Row Level Security (RLS) on all Supabase tables
- Use service role keys only on the server side
- Implement proper input validation and sanitization
- Use parameterized queries to prevent SQL injection

### File Upload Security

- Validate file types and sizes
- Scan uploaded files for malware
- Use secure file storage with proper access controls
- Implement rate limiting for file uploads

## 🚨 Troubleshooting

### Common Issues

1. **Supabase Connection Issues**:
   ```bash
   # Check environment variables
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   
   # Test connection
   curl -H "apikey: YOUR_ANON_KEY" https://YOUR_PROJECT.supabase.co/rest/v1/
   ```

2. **MongoDB Connection Issues**:
   ```bash
   # Check MongoDB status
   brew services list | grep mongodb  # macOS
   systemctl status mongodb           # Linux
   
   # Test connection
   mongosh $MONGODB_URI
   ```

3. **Build Errors**:
   ```bash
   # Clear Next.js cache
   rm -rf .next
   
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **TypeScript Errors**:
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   
   # Update TypeScript
   npm update typescript
   ```

### Performance Optimization

1. **Bundle Analysis**:
   ```bash
   # Install bundle analyzer
   npm install -D @next/bundle-analyzer
   
   # Analyze bundle
   ANALYZE=true npm run build
   ```

2. **Image Optimization**:
   - Use Next.js Image component
   - Optimize images before upload
   - Use appropriate image formats (WebP, AVIF)

3. **Database Optimization**:
   - Add appropriate indexes
   - Use database connection pooling
   - Implement caching strategies

## 📚 Additional Resources

### Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Learning Resources

- [Next.js Learn Course](https://nextjs.org/learn)
- [React Documentation](https://react.dev/)
- [Supabase YouTube Channel](https://www.youtube.com/c/Supabase)
- [MongoDB University](https://university.mongodb.com/)

## 🤝 Contributing

### Development Guidelines

1. Follow the established code structure and naming conventions
2. Write comprehensive tests for new features
3. Update documentation when adding new functionality
4. Use TypeScript for all new code
5. Follow the existing commit message format

### Code Style

- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


