import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { TimeEntriesHeader } from "@/components/time-entries/time-entries-header"
import { TimeEntriesTable } from "@/components/time-entries/time-entries-table"
import { TimeEntriesStats } from "@/components/time-entries/time-entries-stats"

export default function TimeEntriesPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 p-4 max-w-full overflow-hidden">
        <div className="space-y-4">
          <TimeEntriesHeader />
          <TimeEntriesStats />
          <TimeEntriesTable />
        </div>
      </div>
    </DashboardLayout>
  )
}
