"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCrews } from "@/hooks/use-crews"
import { useToast } from "@/hooks/use-toast"
import { Plus, X } from "lucide-react"

interface AddCrewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCrewModal({ open, onOpenChange }: AddCrewModalProps) {
  const { addCrew, loading } = useCrews()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "available" as "available" | "assigned" | "unavailable",
    specialties: [] as string[],
    members: [{ name: "", role: "", phone: "", email: "" }],
  })

  const handleAddMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { name: "", role: "", phone: "", email: "" }],
    })
  }

  const handleRemoveMember = (index: number) => {
    setFormData({
      ...formData,
      members: formData.members.filter((_, i) => i !== index),
    })
  }

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = formData.members.map((member, i) => (i === index ? { ...member, [field]: value } : member))
    setFormData({ ...formData, members: updatedMembers })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || formData.members.some((member) => !member.name)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      await addCrew(formData)
      toast({
        title: "Success",
        description: "Crew added successfully",
      })
      onOpenChange(false)
      setFormData({
        name: "",
        description: "",
        status: "available",
        specialties: [],
        members: [{ name: "", role: "", phone: "", email: "" }],
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add crew",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Crew</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Crew Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter crew name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the crew's capabilities..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Crew Members *</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddMember}>
                <Plus className="h-4 w-4 mr-1" />
                Add Member
              </Button>
            </div>

            {formData.members.map((member, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Member {index + 1}</h4>
                  {formData.members.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveMember(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input
                      value={member.role}
                      onChange={(e) => handleMemberChange(index, "role", e.target.value)}
                      placeholder="e.g., Foreman, Electrician"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={member.phone}
                      onChange={(e) => handleMemberChange(index, "phone", e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                      placeholder="Email address"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Crew"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
