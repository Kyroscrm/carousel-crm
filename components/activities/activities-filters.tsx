"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ActivitiesFiltersProps {
  filters: {
    types: string[]
    statuses: string[]
    priorities: string[]
  }
  onFiltersChange: (filters: any) => void
}

export function ActivitiesFilters({ filters, onFiltersChange }: ActivitiesFiltersProps) {
  const typeOptions = [
    { id: "call", label: "Call", count: 0 },
    { id: "meeting", label: "Meeting", count: 0 },
    { id: "email", label: "Email", count: 0 },
    { id: "task", label: "Task", count: 0 },
  ]

  const statusOptions = [
    { id: "scheduled", label: "Scheduled", count: 0 },
    { id: "completed", label: "Completed", count: 0 },
    { id: "cancelled", label: "Cancelled", count: 0 },
    { id: "overdue", label: "Overdue", count: 0 },
  ]

  const priorityOptions = [
    { id: "low", label: "Low", count: 0 },
    { id: "medium", label: "Medium", count: 0 },
    { id: "high", label: "High", count: 0 },
    { id: "urgent", label: "Urgent", count: 0 },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Filters</CardTitle>
          <Button variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Type</Label>
          <div className="mt-2 space-y-2">
            {typeOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox id={option.id} />
                <Label htmlFor={option.id} className="text-sm flex-1">
                  {option.label}
                </Label>
                <span className="text-xs text-muted-foreground">({option.count})</span>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <Label className="text-sm font-medium">Status</Label>
          <div className="mt-2 space-y-2">
            {statusOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox id={option.id} />
                <Label htmlFor={option.id} className="text-sm flex-1">
                  {option.label}
                </Label>
                <span className="text-xs text-muted-foreground">({option.count})</span>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <Label className="text-sm font-medium">Priority</Label>
          <div className="mt-2 space-y-2">
            {priorityOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox id={option.id} />
                <Label htmlFor={option.id} className="text-sm flex-1">
                  {option.label}
                </Label>
                <span className="text-xs text-muted-foreground">({option.count})</span>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <Button variant="outline" className="w-full bg-transparent" size="sm">
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  )
}
