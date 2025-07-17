"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/hooks/use-auth"
import { Save, Palette, Monitor, Sun, Moon } from "lucide-react"

export function AppearanceSettings() {
  const { user, updateProfile, loading } = useAuth()
  const [theme, setTheme] = useState(user?.theme || "system")
  const [compactMode, setCompactMode] = useState(user?.compactMode || false)
  const [fontSize, setFontSize] = useState(user?.fontSize || "medium")

  const handleSaveAppearance = async () => {
    try {
      await updateProfile({
        theme,
        compactMode,
        fontSize,
      })
    } catch (error) {
      console.error("Failed to update appearance:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme-select" className="text-base font-medium">
            Theme
          </Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Light
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Dark
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  System
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-size" className="text-base font-medium">
            Font Size
          </Label>
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger>
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="compact-mode" className="text-base font-medium">
              Compact Mode
            </Label>
            <p className="text-sm text-gray-600">Use a more compact layout to fit more content</p>
          </div>
          <Switch id="compact-mode" checked={compactMode} onCheckedChange={setCompactMode} />
        </div>

        <Button onClick={handleSaveAppearance} disabled={loading} className="bg-gray-900 hover:bg-gray-800">
          <Save className="h-4 w-4 mr-2" />
          Save Appearance Settings
        </Button>
      </CardContent>
    </Card>
  )
}
