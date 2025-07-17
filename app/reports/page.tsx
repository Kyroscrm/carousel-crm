import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ReportsHeader } from "@/components/reports/reports-header"
import { ReportsOverview } from "@/components/reports/reports-overview"
import { ReportsCharts } from "@/components/reports/reports-charts"
import { ReportsTable } from "@/components/reports/reports-table"

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 w-full h-full overflow-auto">
        <div className="w-full max-w-none space-y-6 p-6">
          <ReportsHeader />
          <ReportsOverview />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
            <ReportsCharts />
            <ReportsTable />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
