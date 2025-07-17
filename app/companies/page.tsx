import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CompaniesHeader } from "@/components/companies/companies-header"
import { CompaniesTable } from "@/components/companies/companies-table"
import { CompaniesFilters } from "@/components/companies/companies-filters"

export default function CompaniesPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 w-full h-full overflow-auto">
        <div className="w-full max-w-none space-y-6 p-6">
          <CompaniesHeader />
          <div className="flex gap-6 w-full min-h-0">
            <div className="w-64 flex-shrink-0">
              <CompaniesFilters />
            </div>
            <div className="flex-1 min-w-0">
              <CompaniesTable />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
