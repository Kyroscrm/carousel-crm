"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CompaniesFilters() {
  const industryOptions = [
    { id: "technology", label: "Technology", count: 0 },
    { id: "healthcare", label: "Healthcare", count: 0 },
    { id: "finance", label: "Finance", count: 0 },
    { id: "retail", label: "Retail", count: 0 },
  ]

  const sizeOptions = [
    { id: "1-10", label: "1-10 employees", count: 0 },
    { id: "11-50", label: "11-50 employees", count: 0 },
    { id: "51-200", label: "51-200 employees", count: 0 },
    { id: "201-500", label: "201-500 employees", count: 0 },
    { id: "500+", label: "500+ employees", count: 0 },
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
          <Label className="text-sm font-medium">Industry</Label>
          <div className="mt-2 space-y-2">
            {industryOptions.map((option) => (
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
          <Label className="text-sm font-medium">Company Size</Label>
          <div className="mt-2 space-y-2">
            {sizeOptions.map((option) => (
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
