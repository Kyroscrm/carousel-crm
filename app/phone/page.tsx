import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PhoneHeader } from "@/components/phone/phone-header"
import { PhoneDialer } from "@/components/phone/phone-dialer"
import { CallHistory } from "@/components/phone/call-history"
import { ContactsQuickDial } from "@/components/phone/contacts-quick-dial"

export default function PhonePage() {
  return (
    <DashboardLayout>
      <div className="flex-1 w-full h-full overflow-auto">
        <div className="w-full max-w-none space-y-6 p-6">
          <PhoneHeader />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <div className="space-y-6">
              <PhoneDialer />
              <ContactsQuickDial />
            </div>
            <div className="lg:col-span-2">
              <CallHistory />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
