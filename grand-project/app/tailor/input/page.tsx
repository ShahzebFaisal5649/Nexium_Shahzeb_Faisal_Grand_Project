import { Metadata } from "next"
import { JobDescriptionInput } from "@/components/tailor/JobDescriptionInput"
import { ResumeSelector } from "@/components/tailor/ResumeSelector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Tailor Resume - Input | Resume Tailor AI",
  description: "Start tailoring your resume by providing job description and selecting a resume.",
}

export default function TailorInputPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Tailor Your Resume</h1>
          <p className="text-xl text-muted-foreground">
            Optimize your resume for specific job opportunities using AI-powered analysis
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Select Resume</CardTitle>
              <CardDescription>
                Choose the resume you want to tailor for this job application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResumeSelector />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 2: Job Description</CardTitle>
              <CardDescription>
                Paste the job description or provide the job posting URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobDescriptionInput />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              1
            </div>
            <div className="w-16 h-0.5 bg-muted"></div>
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold">
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