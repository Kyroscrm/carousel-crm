"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Settings, Mail, Phone } from "lucide-react"

export function ProfileHeader() {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className="text-lg">JD</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">John Doe</h1>
          <p className="text-muted-foreground">Sales Manager</p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>john.doe@company.com</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <Badge>Active</Badge>
            <Badge variant="outline">Premium</Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
    </div>
  )
}
