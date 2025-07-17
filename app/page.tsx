import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MetricsGrid } from "@/components/dashboard/metrics-grid"
import { AnalyticsSection } from "@/components/dashboard/analytics-section"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { PipelineOverview } from "@/components/dashboard/pipeline-overview"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="w-full h-full min-h-screen">
        <div className="w-full space-y-6 p-6">
          <DashboardHeader />
          <MetricsGrid />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <AnalyticsSection />
            <RecentActivity />
          </div>
          <PipelineOverview />
        </div>
      </div>
    </DashboardLayout>
  )
}
