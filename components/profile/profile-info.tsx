"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, MapPin, Calendar } from "lucide-react"

export function ProfileInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <p className="text-sm">John Doe</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Job Title</label>
            <p className="text-sm">Sales Manager</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Department</label>
            <p className="text-sm">Sales</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
            <p className="text-sm">EMP001</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Location</label>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <p className="text-sm">New York, NY</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Join Date</label>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <p className="text-sm">January 15, 2023</p>
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Bio</label>
          <p className="text-sm mt-1">
            Experienced sales manager with over 5 years in B2B sales. Passionate about building relationships and
            driving revenue growth through strategic partnerships and customer success.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
