import { Metadata } from "next"
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard"

export const metadata: Metadata = {
  title: "Analytics | Resume Tailor AI",
  description: "View your job application and resume performance analytics.",
}

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
      </div>
      <AnalyticsDashboard />
    </div>
  )
}