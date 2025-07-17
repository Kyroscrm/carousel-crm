"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Phone, Mail, FileText, Clock } from "lucide-react"
import { useActivities } from "@/hooks/use-activities"
import { useAuth } from "@/hooks/use-auth"

export function ProfileActivity() {
  const { activities, loading } = useActivities()
  const { user } = useAuth()

  // Filter activities for current user
  const userActivities = activities
    .filter((activity) => activity.userName === user?.name)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10) // Show last 10 activities

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "call":
        return Phone
      case "email":
        return Mail
      case "meeting":
        return Calendar
      case "note":
        return FileText
      case "task":
        return Calendar
      default:
        return FileText
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "call":
        return "text-green-600 bg-green-100"
      case "email":
        return "text-blue-600 bg-blue-100"
      case "meeting":
        return "text-purple-600 bg-purple-100"
      case "note":
        return "text-gray-600 bg-gray-100"
      case "task":
        return "text-orange-600 bg-orange-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} day${days > 1 ? "s" : ""} ago`
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userActivities.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No recent activity</h3>
            <p className="text-muted-foreground">Your activities will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userActivities.map((activity: any, index: number) => {
              const IconComponent = getActivityIcon(activity.type)
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full mt-2`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {activity.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.createdAt)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
