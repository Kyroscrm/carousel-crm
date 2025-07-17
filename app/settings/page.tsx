import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SettingsHeader } from "@/components/settings/settings-header"
import { SettingsNavigation } from "@/components/settings/settings-navigation"
import { SettingsContent } from "@/components/settings/settings-content"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 w-full h-full overflow-auto">
        <div className="w-full max-w-none space-y-6 p-6">
          <SettingsHeader />
          <div className="flex gap-6 w-full min-h-0">
            <div className="w-64 flex-shrink-0">
              <SettingsNavigation />
            </div>
            <div className="flex-1 min-w-0">
              <SettingsContent />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
