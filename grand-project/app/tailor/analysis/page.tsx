import { Metadata } from "next"
import { AnalysisResults } from "@/components/tailor/AnalysisResults"
import { MatchScore } from "@/components/tailor/MatchScore"
import { KeywordAnalysis } from "@/components/tailor/KeywordAnalysis"
import { ImprovementSuggestions } from "@/components/tailor/ImprovementSuggestions"

export const metadata: Metadata = {
  title: "Analysis Results | Resume Tailor AI",
  description: "View the analysis results of your resume against the job description.",
}

export default function TailorAnalysisPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Analysis Results</h1>
          <p className="text-xl text-muted-foreground">
            Here's how your resume matches the job requirements
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <MatchScore />
          </div>
          <div className="md:col-span-2">
            <KeywordAnalysis />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AnalysisResults />
          <ImprovementSuggestions />
        </div>

        <div className="flex justify-center">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              ✓
            </div>
            <div className="w-16 h-0.5 bg-primary"></div>
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              2
            </div>
            <div className="w-16 h-0.5 bg-muted"></div>
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold">
              3
            </div>
            <div className="w-16 h-0.5 bg-muted"></div>
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold">
              4
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}