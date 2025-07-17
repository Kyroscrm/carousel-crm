"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useTimeEntries } from "@/hooks/use-time-entries"
import { useToast } from "@/hooks/use-toast"

interface AddTimeEntryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTimeEntryModal({ open, onOpenChange }: AddTimeEntryModalProps) {
  const { addTimeEntry, loading } = useTimeEntries()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    workerId: "",
    jobId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    hours: 0,
    description: "",
    billable: true,
    hourlyRate: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.workerId || !formData.jobId || !formData.hours) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      await addTimeEntry(formData)
      toast({
        title: "Success",
        description: "Time entry added successfully",
      })
      onOpenChange(false)
      setFormData({
        workerId: "",
        jobId: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "",
        endTime: "",
        hours: 0,
        description: "",
        billable: true,
        hourlyRate: 0,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add time entry",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Time Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="worker">Worker *</Label>
              <Select
                value={formData.workerId}
                onValueChange={(value) => setFormData({ ...formData, workerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select worker" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worker1">John Doe</SelectItem>
                  <SelectItem value="worker2">Jane Smith</SelectItem>
                  <SelectItem value="worker3">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job">Job *</Label>
              <Select value={formData.jobId} onValueChange={(value) => setFormData({ ...formData, jobId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job1">Kitchen Renovation</SelectItem>
                  <SelectItem value="job2">Bathroom Remodel</SelectItem>
                  <SelectItem value="job3">Deck Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Hours *</Label>
            <Input
              id="hours"
              type="number"
              step="0.25"
              min="0"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: Number.parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the work performed..."
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="billable"
                checked={formData.billable}
                onCheckedChange={(checked) => setFormData({ ...formData, billable: checked })}
              />
              <Label htmlFor="billable">Billable</Label>
            </div>
            {formData.billable && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="hourlyRate">Rate: $</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: Number.parseFloat(e.target.value) || 0 })}
                  className="w-20"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Time Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
