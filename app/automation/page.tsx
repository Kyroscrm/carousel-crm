import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AutomationHeader } from "@/components/automation/automation-header"
import { AutomationStats } from "@/components/automation/automation-stats"
import { AutomationWorkflows } from "@/components/automation/automation-workflows"
import { AutomationTemplates } from "@/components/automation/automation-templates"

export default function AutomationPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 w-full h-full overflow-auto">
        <div className="w-full max-w-none space-y-6 p-6">
          <AutomationHeader />
          <AutomationStats />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
            <AutomationWorkflows />
            <AutomationTemplates />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
