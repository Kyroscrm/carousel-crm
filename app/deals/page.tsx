import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DealsHeader } from "@/components/deals/deals-header"
import { PipelineBoard } from "@/components/deals/pipeline-board"

export default function DealsPage() {
  return (
    <DashboardLayout>
      <div className="w-full h-full min-h-screen">
        <div className="w-full space-y-6 p-6">
          <DealsHeader />
          <PipelineBoard />
        </div>
      </div>
    </DashboardLayout>
  )
}
