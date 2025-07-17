import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EmailHeader } from "@/components/email/email-header"
import { EmailSidebar } from "@/components/email/email-sidebar"
import { EmailList } from "@/components/email/email-list"
import { EmailCompose } from "@/components/email/email-compose"

export default function EmailPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 w-full h-full overflow-hidden">
        <div className="w-full max-w-none h-full flex flex-col">
          <div className="p-6 border-b">
            <EmailHeader />
          </div>
          <div className="flex-1 flex min-h-0">
            <div className="w-64 border-r flex-shrink-0">
              <EmailSidebar />
            </div>
            <div className="flex-1 flex min-w-0">
              <div className="flex-1">
                <EmailList />
              </div>
              <div className="w-96 border-l flex-shrink-0">
                <EmailCompose />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
