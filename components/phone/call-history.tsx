"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, MoreHorizontal, PhoneCall } from "lucide-react"

export function CallHistory() {
  const calls = []

  const getCallIcon = (type: string, status: string) => {
    if (status === "missed") return PhoneMissed
    if (type === "incoming") return PhoneIncoming
    if (type === "outgoing") return PhoneOutgoing
    return Phone
  }

  const getCallColor = (type: string, status: string) => {
    if (status === "missed") return "text-red-600"
    if (type === "incoming") return "text-green-600"
    if (type === "outgoing") return "text-blue-600"
    return "text-gray-600"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "missed":
        return "bg-red-100 text-red-800"
      case "busy":
        return "bg-yellow-100 text-yellow-800"
      case "no-answer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Call History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {calls.length === 0 ? (
          <div className="text-center py-12">
            <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No call history</h3>
            <p className="text-muted-foreground">Your call history will appear here</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calls.map((call: any) => {
                  const Icon = getCallIcon(call.type, call.status)
                  const iconColor = getCallColor(call.type, call.status)
                  return (
                    <TableRow key={call.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={call.contact?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {call.contact?.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("") || call.phoneNumber.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{call.contact?.name || "Unknown"}</div>
                            <div className="text-sm text-muted-foreground">{call.phoneNumber}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Icon className={`h-4 w-4 ${iconColor}`} />
                          <span className="capitalize">{call.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(call.status)}>{call.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{call.duration || "0:00"}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(call.timestamp).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">
                            {new Date(call.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <PhoneCall className="h-4 w-4 mr-2" />
                              Call Back
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="h-4 w-4 mr-2" />
                              Add to Contacts
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
