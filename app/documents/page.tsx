import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DocumentsHeader } from "@/components/documents/documents-header"
import { DocumentsGrid } from "@/components/documents/documents-grid"
import { DocumentsSidebar } from "@/components/documents/documents-sidebar"

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 w-full h-full overflow-auto">
        <div className="w-full max-w-none space-y-6 p-6">
          <DocumentsHeader />
          <div className="flex gap-6 w-full min-h-0">
            <div className="w-64 flex-shrink-0">
              <DocumentsSidebar />
            </div>
            <div className="flex-1 min-w-0">
              <DocumentsGrid />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
