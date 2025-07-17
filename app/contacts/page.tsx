import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ContactsHeader } from "@/components/contacts/contacts-header"
import { ContactsTable } from "@/components/contacts/contacts-table"
import { ContactsFilters } from "@/components/contacts/contacts-filters"

export default function ContactsPage() {
  return (
    <DashboardLayout>
      <div className="w-full h-full min-h-screen">
        <div className="w-full space-y-6 p-6">
          <ContactsHeader />
          <div className="flex gap-6 w-full">
            <div className="w-64 flex-shrink-0">
              <ContactsFilters />
            </div>
            <div className="flex-1 min-w-0 w-full">
              <ContactsTable />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
