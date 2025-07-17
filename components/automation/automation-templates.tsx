"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutTemplateIcon as Template, Mail, Phone, Calendar, Users } from "lucide-react"

export function AutomationTemplates() {
  const templates = [
    {
      id: 1,
      name: "Welcome Email Sequence",
      description: "Send a series of welcome emails to new contacts",
      icon: Mail,
      category: "Email",
      popular: true,
    },
    {
      id: 2,
      name: "Follow-up Reminder",
      description: "Automatically remind to follow up with leads",
      icon: Calendar,
      category: "Tasks",
      popular: false,
    },
    {
      id: 3,
      name: "Lead Scoring",
      description: "Automatically score leads based on activities",
      icon: Users,
      category: "Lead Management",
      popular: true,
    },
    {
      id: 4,
      name: "Call Scheduling",
      description: "Schedule calls based on lead behavior",
      icon: Phone,
      category: "Calls",
      popular: false,
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Template className="h-5 w-5" />
          Workflow Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {templates.map((template) => (
            <div key={template.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <template.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{template.name}</h4>
                      {template.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
