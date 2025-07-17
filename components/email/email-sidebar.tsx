"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Inbox, Send, Archive, Trash2, Star, Mail } from "lucide-react"

export function EmailSidebar() {
  const folders = [
    { name: "Inbox", icon: Inbox, count: 0, active: true },
    { name: "Sent", icon: Send, count: 0 },
    { name: "Starred", icon: Star, count: 0 },
    { name: "Archive", icon: Archive, count: 0 },
    { name: "Trash", icon: Trash2, count: 0 },
  ]

  return (
    <div className="h-full p-4 space-y-4">
      <Button className="w-full">
        <Mail className="h-4 w-4 mr-2" />
        Compose
      </Button>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Folders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {folders.map((folder) => (
            <Button
              key={folder.name}
              variant={folder.active ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
            >
              <folder.icon className="h-4 w-4 mr-2" />
              <span className="flex-1 text-left">{folder.name}</span>
              {folder.count > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {folder.count}
                </Badge>
              )}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
