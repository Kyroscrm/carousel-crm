"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, DollarSign } from "lucide-react"

export function PipelineBoard() {
  const stages = [
    { id: "lead", name: "Lead", deals: [], color: "bg-gray-100" },
    { id: "qualified", name: "Qualified", deals: [], color: "bg-blue-100" },
    { id: "proposal", name: "Proposal", deals: [], color: "bg-yellow-100" },
    { id: "negotiation", name: "Negotiation", deals: [], color: "bg-orange-100" },
    { id: "closed", name: "Closed Won", deals: [], color: "bg-green-100" },
  ]

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
        {stages.map((stage) => (
          <Card key={stage.id} className={`${stage.color} w-full`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {stage.name}
                <Badge variant="secondary">{stage.deals.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stage.deals.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">No deals in this stage</p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Deal
                  </Button>
                </div>
              ) : (
                stage.deals.map((deal: any) => (
                  <Card key={deal.id} className="bg-white">
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm mb-1">{deal.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{deal.company}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">${deal.value}</span>
                        <span className="text-xs text-muted-foreground">{deal.closeDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
