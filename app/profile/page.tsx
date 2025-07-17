import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileInfo } from "@/components/profile/profile-info"
import { ProfileStats } from "@/components/profile/profile-stats"
import { ProfileActivity } from "@/components/profile/profile-activity"

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="flex-1 w-full h-full overflow-auto">
        <div className="w-full max-w-none space-y-6 p-6">
          <ProfileHeader />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <div className="lg:col-span-2 space-y-6">
              <ProfileInfo />
              <ProfileActivity />
            </div>
            <div className="space-y-6">
              <ProfileStats />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
