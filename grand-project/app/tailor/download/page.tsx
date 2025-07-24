import { Metadata } from "next"
import { TailoredResumePreview } from "@/components/tailor/TailoredResumePreview"
import { DownloadOptions } from "@/components/tailor/DownloadOptions"
import { ApplicationLinker } from "@/components/tailor/ApplicationLinker"

export const metadata: Metadata = {
  title: "Download Tailored Resume | Resume Tailor AI",
  description: "Download your optimized resume and link it to an application.",
}

export default function TailorDownloadPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Your Tailored Resume is Ready!</h1>
          <p className="text-xl text-muted-foreground">
            Download your optimized resume and link it to a new or existing application
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TailoredResumePreview />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <DownloadOptions />
            <ApplicationLinker />
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              ✓
            </div>
            <div className="w-16 h-0.5 bg-primary"></div>
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              ✓
            </div>
            <div className="w-16 h-0.5 bg-primary"></div>
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              ✓
            </div>
            <div className="w-16 h-0.5 bg-primary"></div>
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              4
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}