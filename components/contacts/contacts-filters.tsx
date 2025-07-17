"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function ContactsFilters() {
  const statusOptions = [
    { id: "active", label: "Active", count: 0 },
    { id: "inactive", label: "Inactive", count: 0 },
    { id: "prospect", label: "Prospect", count: 0 },
  ]

  const sourceOptions = [
    { id: "website", label: "Website", count: 0 },
    { id: "referral", label: "Referral", count: 0 },
    { id: "social", label: "Social Media", count: 0 },
    { id: "email", label: "Email Campaign", count: 0 },
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
          <Label className="text-sm font-medium">Source</Label>
          <div className="mt-2 space-y-2">
            {sourceOptions.map((option) => (
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
