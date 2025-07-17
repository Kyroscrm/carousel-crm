"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Plus } from "lucide-react"

export function ContactsQuickDial() {
  const quickDialContacts = []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Quick Dial
          </CardTitle>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {quickDialContacts.length === 0 ? (
          <div className="text-center py-8">
            <Phone className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No quick dial contacts</p>
            <Button variant="outline" size="sm" className="mt-2 bg-transparent">
              <Plus className="h-3 w-3 mr-1" />
              Add Contact
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {quickDialContacts.map((contact: any) => (
              <div key={contact.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{contact.name}</div>
                    <div className="text-xs text-muted-foreground">{contact.phone}</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
