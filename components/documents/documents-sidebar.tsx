"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Folder, FileText, ImageIcon, File, Trash2 } from "lucide-react"

export function DocumentsSidebar() {
  const folders = [
    { name: "All Documents", icon: FileText, count: 0, active: true },
    { name: "Proposals", icon: Folder, count: 0 },
    { name: "Contracts", icon: Folder, count: 0 },
    { name: "Presentations", icon: Folder, count: 0 },
    { name: "Images", icon: ImageIcon, count: 0 },
    { name: "Other", icon: File, count: 0 },
    { name: "Trash", icon: Trash2, count: 0 },
  ]

  return (
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
  )
}
