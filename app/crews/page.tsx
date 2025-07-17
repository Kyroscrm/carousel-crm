import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CrewsHeader } from "@/components/crews/crews-header"
import { CrewsGrid } from "@/components/crews/crews-grid"
import { CrewsStats } from "@/components/crews/crews-stats"

export default function CrewsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 p-4 max-w-full overflow-hidden">
        <div className="space-y-4">
          <CrewsHeader />
          <CrewsStats />
          <CrewsGrid />
        </div>
      </div>
    </DashboardLayout>
  )
}
