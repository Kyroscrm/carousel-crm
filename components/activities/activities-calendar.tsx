"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock, Plus } from "lucide-react"
import { useState } from "react"

export function ActivitiesCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const activities = []

  const getActivitiesForDate = (date: Date) => {
    return activities.filter((activity: any) => {
      const activityDate = new Date(activity.scheduledAt)
      return (
        activityDate.getDate() === date.getDate() &&
        activityDate.getMonth() === date.getMonth() &&
        activityDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const selectedDateActivities = selectedDate ? getActivitiesForDate(selectedDate) : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border w-full"
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}
          </CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </CardHeader>
        <CardContent>
          {selectedDateActivities.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No activities scheduled</h3>
              <p className="text-muted-foreground mb-4">
                {selectedDate ? "No activities for this date" : "Select a date to view activities"}
              </p>
              <Button>Schedule Activity</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateActivities.map((activity: any) => (
                <div key={activity.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{activity.title}</h4>
                      <Badge variant="outline">
                        {new Date(activity.scheduledAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{activity.type}</Badge>
                      <Badge
                        className={`${
                          activity.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : activity.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {activity.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
