"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Bell, Shield, Palette, Globe, CreditCard, Zap, Users } from "lucide-react"
import { useState } from "react"

export function SettingsNavigation() {
  const [activeSection, setActiveSection] = useState("profile")

  const sections = [
    { id: "profile", name: "Profile", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
    { id: "appearance", name: "Appearance", icon: Palette },
    { id: "language", name: "Language", icon: Globe },
    { id: "billing", name: "Billing", icon: CreditCard },
    { id: "integrations", name: "Integrations", icon: Zap },
    { id: "team", name: "Team", icon: Users },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "secondary" : "ghost"}
            className="w-full justify-start"
            size="sm"
            onClick={() => setActiveSection(section.id)}
          >
            <section.icon className="h-4 w-4 mr-2" />
            {section.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
