"use client"

import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/navigation/app-sidebar"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

function DashboardContent({ children }: DashboardLayoutProps) {
  const { open, setOpen } = useSidebar()
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <AppSidebar />
      <SidebarInset className="flex-1 w-full min-w-0">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-white px-6 shadow-sm w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(!open)}
            className="text-gray-600 hover:text-gray-900"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="h-4 w-px bg-gray-300" />
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <span className="font-medium text-gray-900">Dashboard</span>
          </div>
        </header>
        <main className="flex-1 w-full overflow-auto">
          <div className="w-full h-full">{children}</div>
        </main>
      </SidebarInset>
    </div>
  )
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}
