"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Star, Paperclip } from "lucide-react"

export function EmailList() {
  const emails = []

  return (
    <Card className="h-full border-0 rounded-none">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Inbox
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Checkbox />
            <span className="text-sm text-muted-foreground">Select all</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {emails.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No emails</h3>
            <p className="text-muted-foreground">Your inbox is empty</p>
          </div>
        ) : (
          <div className="divide-y">
            {emails.map((email: any) => (
              <div key={email.id} className="flex items-center space-x-4 p-4 hover:bg-muted/50 cursor-pointer">
                <Checkbox />
                <button className="text-muted-foreground hover:text-yellow-500">
                  <Star className="h-4 w-4" />
                </button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={email.sender.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {email.sender.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium truncate">{email.sender.name}</div>
                    <div className="flex items-center space-x-2">
                      {email.hasAttachment && <Paperclip className="h-3 w-3 text-muted-foreground" />}
                      <span className="text-xs text-muted-foreground">{email.time}</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium truncate">{email.subject}</div>
                  <div className="text-sm text-muted-foreground truncate">{email.preview}</div>
                </div>
                {email.unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
