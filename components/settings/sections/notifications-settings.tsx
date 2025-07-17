"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { Save, Bell } from "lucide-react"

export function NotificationsSettings() {
  const { user, updateProfile, loading } = useAuth()
  const [notifications, setNotifications] = useState(
    user?.notifications || {
      email: true,
      push: true,
      sms: false,
      desktop: true,
      marketing: false,
      frequency: "immediate",
    },
  )

  const handleSaveNotifications = async () => {
    try {
      await updateProfile({ notifications })
    } catch (error) {
      console.error("Failed to update notifications:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="text-base font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications" className="text-base font-medium">
                Push Notifications
              </Label>
              <p className="text-sm text-gray-600">Receive push notifications in browser</p>
            </div>
            <Switch
              id="push-notifications"
              checked={notifications.push}
              onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-notifications" className="text-base font-medium">
                SMS Notifications
              </Label>
              <p className="text-sm text-gray-600">Receive notifications via SMS</p>
            </div>
            <Switch
              id="sms-notifications"
              checked={notifications.sms}
              onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="desktop-notifications" className="text-base font-medium">
                Desktop Notifications
              </Label>
              <p className="text-sm text-gray-600">Show desktop notifications</p>
            </div>
            <Switch
              id="desktop-notifications"
              checked={notifications.desktop}
              onCheckedChange={(checked) => setNotifications({ ...notifications, desktop: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing-notifications" className="text-base font-medium">
                Marketing Communications
              </Label>
              <p className="text-sm text-gray-600">Receive product updates and marketing emails</p>
            </div>
            <Switch
              id="marketing-notifications"
              checked={notifications.marketing}
              onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification-frequency" className="text-base font-medium">
              Notification Frequency
            </Label>
            <Select
              value={notifications.frequency}
              onValueChange={(value) => setNotifications({ ...notifications, frequency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleSaveNotifications} disabled={loading} className="bg-gray-900 hover:bg-gray-800">
          <Save className="h-4 w-4 mr-2" />
          Save Notification Settings
        </Button>
      </CardContent>
    </Card>
  )
}
