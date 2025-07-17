"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Tag, Download, Upload } from "lucide-react"
import { useContacts } from "@/hooks/use-contacts"
import { useToast } from "@/hooks/use-toast"

interface BulkOperationsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedContacts: number[]
  onSelectionChange: (contacts: number[]) => void
}

export function BulkOperationsModal({
  open,
  onOpenChange,
  selectedContacts,
  onSelectionChange,
}: BulkOperationsModalProps) {
  const { contacts, updateContact, deleteContact, exportContacts, importContacts } = useContacts()
  const { toast } = useToast()
  const [operation, setOperation] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const selectedContactsData = contacts.filter((contact) => selectedContacts.includes(contact.id))

  const handleBulkOperation = async () => {
    if (!operation || selectedContacts.length === 0) return

    setLoading(true)
    try {
      switch (operation) {
        case "delete":
          await Promise.all(selectedContacts.map((id) => deleteContact(id)))
          toast({ title: "Success", description: `Deleted ${selectedContacts.length} contacts` })
          break
        case "add-tag":
          await Promise.all(
            selectedContacts.map((id) =>
              updateContact(id, { tags: [...(contacts.find((c) => c.id === id)?.tags || []), "bulk-tagged"] }),
            ),
          )
          toast({ title: "Success", description: `Tagged ${selectedContacts.length} contacts` })
          break
        case "change-status":
          await Promise.all(selectedContacts.map((id) => updateContact(id, { status: "Customer" })))
          toast({ title: "Success", description: `Updated status for ${selectedContacts.length} contacts` })
          break
        case "export":
          await exportContacts("csv")
          toast({ title: "Success", description: "Contacts exported successfully" })
          break
      }
      onSelectionChange([])
      onOpenChange(false)
    } catch (error) {
      toast({ title: "Error", description: "Bulk operation failed", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      await importContacts(file)
      toast({ title: "Success", description: "Contacts imported successfully" })
      onOpenChange(false)
    } catch (error) {
      toast({ title: "Error", description: "Import failed", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Operations</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Selected Contacts ({selectedContacts.length})</h3>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedContactsData.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{contact.name}</span>
                  <Badge variant="outline">{contact.status}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Operation</label>
              <Select value={operation} onValueChange={setOperation}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose an operation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delete">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Contacts
                    </div>
                  </SelectItem>
                  <SelectItem value="add-tag">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Add Tag
                    </div>
                  </SelectItem>
                  <SelectItem value="change-status">
                    <div className="flex items-center gap-2">
                      <Badge className="h-4 w-4" />
                      Change Status
                    </div>
                  </SelectItem>
                  <SelectItem value="export">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Selected
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Import Contacts</h4>
              <div className="flex items-center gap-2">
                <input type="file" accept=".csv,.xlsx" onChange={handleImport} className="hidden" id="import-file" />
                <Button variant="outline" onClick={() => document.getElementById("import-file")?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import from File
                </Button>
                <span className="text-xs text-gray-500">Supports CSV and Excel files</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkOperation} disabled={!operation || selectedContacts.length === 0 || loading}>
              {loading ? "Processing..." : "Execute Operation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
