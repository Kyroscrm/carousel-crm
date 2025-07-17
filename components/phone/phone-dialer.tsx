"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, PhoneCall, SkipBackIcon as Backspace } from "lucide-react"
import { useState } from "react"

export function PhoneDialer() {
  const [number, setNumber] = useState("")

  const dialpadNumbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ]

  const handleNumberClick = (digit: string) => {
    setNumber((prev) => prev + digit)
  }

  const handleBackspace = () => {
    setNumber((prev) => prev.slice(0, -1))
  }

  const handleCall = () => {
    if (number) {
      console.log("Calling:", number)
      // Handle call logic here
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Dialer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter phone number"
            className="text-center text-lg"
          />
          {number && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleBackspace}
            >
              <Backspace className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {dialpadNumbers.flat().map((digit) => (
            <Button
              key={digit}
              variant="outline"
              className="h-12 text-lg font-medium bg-transparent"
              onClick={() => handleNumberClick(digit)}
            >
              {digit}
            </Button>
          ))}
        </div>

        <Button onClick={handleCall} disabled={!number} className="w-full bg-green-600 hover:bg-green-700" size="lg">
          <PhoneCall className="h-5 w-5 mr-2" />
          Call
        </Button>
      </CardContent>
    </Card>
  )
}
