import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { AuthService } from "@/lib/auth";
import { tailoringRequestSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { ResumeTailoringEngine } from "@/ai/flows/resumeTailoringEngine";
import { ResumeAnalyzer } from "@/ai/utils/resumeAnalyzer";
import { JobDescriptionAnalyzer } from "@/ai/utils/jobDescriptionAnalyzer";
import { createTailoringOptions } from "@/ai/utils/tailoringOptions";

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('cf-connecting-ip') || 
             'unknown';
  
  const { isRateLimited } = limiter.check({} as any, 10, ip);
  
  if (isRateLimited) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  try {
    const authResult = await AuthService.getCurrentUser();
    
    if (!authResult) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: userId } = authResult;
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "analyze": {
        const validatedData = tailoringRequestSchema.parse(body);
        
        const { data: resume, error: resumeError } = await supabase
          .from("resumes")
          .select("*")
          .eq("id", validatedData.resumeId)
          .eq("user_id", userId)
          .single();

        if (resumeError) throw new Error("Resume not found");

        const { data: jobDescription, error: jobError } = await supabase
          .from("job_descriptions")
          .select("*")
          .eq("id", validatedData.jobDescriptionId)
          .eq("user_id", userId)
          .single();

        if (jobError) throw new Error("Job description not found");

        const resumeAnalyzer = new ResumeAnalyzer();
        const jobAnalyzer = new JobDescriptionAnalyzer();
        const tailoringEngine = new ResumeTailoringEngine();

        const resumeAnalysis = await resumeAnalyzer.analyzeResume(resume.extracted_text);
        const jobAnalysis = await jobAnalyzer.analyzeJobDescription(jobDescription.description_text);
        const matchAnalysis = await tailoringEngine.analyzeMatch(resumeAnalysis, jobAnalysis);

        const { data: analysis, error: analysisError } = await supabase
          .from("resume_analyses")
          .insert({
            user_id: userId,
            resume_id: validatedData.resumeId,
            job_description_id: validatedData.jobDescriptionId,
            match_score: matchAnalysis.overallScore,
            skills_match: matchAnalysis.skillsMatch,
            experience_match: matchAnalysis.experienceMatch,
            education_match: matchAnalysis.educationMatch,
            keyword_density: matchAnalysis.keywordDensity,
            matching_skills: matchAnalysis.matchingSkills,
            missing_skills: matchAnalysis.missingSkills,
            strengths: matchAnalysis.strengths,
            improvements: matchAnalysis.improvements,
            analysis_data: matchAnalysis,
          })
          .select()
          .single();

        if (analysisError) throw analysisError;

        return NextResponse.json({
          success: true,
          data: { analysis, matchAnalysis, resumeAnalysis, jobAnalysis },
        });
      }

      case "tailor": {
        const validatedData = tailoringRequestSchema.parse(body);
        const tailoringOptions = createTailoringOptions(validatedData);
        
        const { data: analysis, error: analysisError } = await supabase
          .from("resume_analyses")
          .select(`
            *,
            resumes:resume_id(*),
            job_descriptions:job_description_id(*)
          `)
          .eq("resume_id", validatedData.resumeId)
          .eq("job_description_id", validatedData.jobDescriptionId)
          .eq("user_id", userId)
          .single();

        if (analysisError) throw new Error("Analysis not found. Please run analysis first.");

        const tailoringEngine = new ResumeTailoringEngine();

        const tailoredResume = await tailoringEngine.tailorResume(
          analysis.resumes.extracted_text,
          analysis.job_descriptions.description_text,
          analysis.analysis_data,
          tailoringOptions
        );

        const { data: newResume, error: resumeError } = await supabase
          .from("resumes")
          .insert({
            user_id: userId,
            title: `${analysis.resumes.title} - Tailored for ${analysis.job_descriptions.company_name}`,
            is_master: false,
            extracted_text: tailoredResume.content,
            tailored_from: analysis.resumes.id,
            job_description_id: validatedData.jobDescriptionId,
            tailoring_data: tailoredResume,
          })
          .select()
          .single();

        if (resumeError) throw resumeError;

        return NextResponse.json({
          success: true,
          data: {
            tailoredResume: newResume,
            improvements: tailoredResume.improvements,
            changes: tailoredResume.changes,
          },
        });
      }

      case "download": {
        const { resumeId, format = "pdf" } = body;
        
        const { data: resume, error: resumeError } = await supabase
          .from("resumes")
          .select("*")
          .eq("id", resumeId)
          .eq("user_id", userId)
          .single();

        if (resumeError) throw new Error("Resume not found");

        const downloadUrl = await generateResumeFile(resume, format);

        return NextResponse.json({
          success: true,
          data: {
            downloadUrl,
            format,
            fileName: `${resume.title}.${format}`,
          },
        });
      }

      default:
        return new NextResponse("Invalid action", { status: 400 });
    }
  } catch (error: unknown) {
    console.error("Tailor API Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

async function generateResumeFile(resume: any, format: string): Promise<string> {
  return `https://your-app.com/api/download/${resume.id}?format=${format}`;
}