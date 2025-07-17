"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, UserPlus, Mail, MoreHorizontal, Shield, UserCheck, UserX, Trash2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface TeamMember {
  id: number
  name: string
  email: string
  role: "admin" | "member" | "viewer"
  status: "active" | "pending" | "inactive"
  avatar?: string
  joinedAt: string
  lastActive?: string
}

interface PendingInvite {
  id: number
  email: string
  role: "admin" | "member" | "viewer"
  invitedAt: string
  invitedBy: string
}

export function TeamSettings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([])
  const [loading, setLoading] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"admin" | "member" | "viewer">("member")

  const handleInviteMember = async () => {
    if (!inviteEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newInvite: PendingInvite = {
        id: Date.now(),
        email: inviteEmail,
        role: inviteRole,
        invitedAt: new Date().toISOString(),
        invitedBy: user?.name || "You",
      }

      setPendingInvites((prev) => [...prev, newInvite])
      setInviteEmail("")
      setInviteRole("member")
      setInviteDialogOpen(false)

      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${inviteEmail}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setTeamMembers((prev) => prev.filter((member) => member.id !== memberId))
      toast({
        title: "Member removed",
        description: "Team member has been removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelInvite = async (inviteId: number) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setPendingInvites((prev) => prev.filter((invite) => invite.id !== inviteId))
      toast({
        title: "Invitation cancelled",
        description: "The invitation has been cancelled",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (memberId: number, newRole: "admin" | "member" | "viewer") => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setTeamMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, role: newRole } : member)))
      toast({
        title: "Role updated",
        description: "Member role has been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "member":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Manage your team members and their permissions</p>
            </div>
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="invite-email">Email Address</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="colleague@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="invite-role">Role</Label>
                    <Select
                      value={inviteRole}
                      onValueChange={(value: "admin" | "member" | "viewer") => setInviteRole(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer - Can view data only</SelectItem>
                        <SelectItem value="member">Member - Can view and edit</SelectItem>
                        <SelectItem value="admin">Admin - Full access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleInviteMember} disabled={loading} className="flex-1">
                      {loading ? "Sending..." : "Send Invitation"}
                    </Button>
                    <Button variant="outline" onClick={() => setInviteDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {teamMembers.length > 0 ? (
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{member.name}</h4>
                      <Badge className={getRoleBadgeColor(member.role)}>{member.role}</Badge>
                      <Badge className={getStatusBadgeColor(member.status)}>{member.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-xs text-gray-500">
                      Joined {formatDate(member.joinedAt)}
                      {member.lastActive && ` • Last active ${formatDate(member.lastActive)}`}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "admin")}>
                        <Shield className="h-4 w-4 mr-2" />
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "member")}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Make Member
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "viewer")}>
                        <UserX className="h-4 w-4 mr-2" />
                        Make Viewer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRemoveMember(member.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No team members yet</p>
              <p className="text-sm mt-1">Invite your first team member to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvites.map((invite) => (
                <div key={invite.id} className="flex items-center gap-4 p-3 border rounded-lg bg-yellow-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{invite.email}</p>
                      <Badge className={getRoleBadgeColor(invite.role)}>{invite.role}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Invited by {invite.invitedBy} on {formatDate(invite.invitedAt)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCancelInvite(invite.id)} disabled={loading}>
                    Cancel
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <p className="text-sm text-gray-600">Understanding what each role can do in your CRM</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  <h4 className="font-medium">Admin</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Full system access</li>
                  <li>• Manage team members</li>
                  <li>• Configure settings</li>
                  <li>• View all data</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium">Member</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Create and edit records</li>
                  <li>• View team data</li>
                  <li>• Generate reports</li>
                  <li>• Limited settings access</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <UserX className="h-4 w-4 text-gray-600" />
                  <h4 className="font-medium">Viewer</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• View-only access</li>
                  <li>• Basic reporting</li>
                  <li>• No editing permissions</li>
                  <li>• Limited data access</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
