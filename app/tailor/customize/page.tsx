import { Metadata } from "next"
import { TailoringCustomizer } from "@/components/tailor/TailoringCustomizer"
import { ComparisonView } from "@/components/tailor/ComparisonView"
import { TailoringOptions } from "@/components/tailor/TailoringOptions"

export const metadata: Metadata = {
  title: "Customize Tailoring | Resume Tailor AI",
  description: "Customize how your resume should be tailored for the job.",
}

export default function TailorCustomizePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Customize Your Resume</h1>
          <p className="text-xl text-muted-foreground">
            Fine-tune the tailoring process to match your preferences
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <TailoringOptions />
          </div>
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <TailoringCustomizer />
              <ComparisonView />
            </div>
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
