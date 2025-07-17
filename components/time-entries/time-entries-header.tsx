"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, Plus, Download, Search } from "lucide-react"
import { useState } from "react"
import { AddTimeEntryModal } from "./add-time-entry-modal"

export function TimeEntriesHeader() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const handleExport = () => {
    // Export functionality will be implemented with Supabase
    console.log("Exporting time entries...")
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Time Entries</h1>
            <p className="text-gray-600 mt-1">Track time for jobs and workers</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search time entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Time Entry
          </Button>
        </div>
      </div>

      <AddTimeEntryModal open={showAddModal} onOpenChange={setShowAddModal} />
    </>
  )
}
