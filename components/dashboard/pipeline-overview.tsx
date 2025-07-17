"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp } from "lucide-react"
import { useDeals } from "@/hooks/use-deals"

export function PipelineOverview() {
  const { deals, loading } = useDeals()

  const stages = [
    { name: "Lead", count: 0, value: 0 },
    { name: "Qualified", count: 0, value: 0 },
    { name: "Proposal", count: 0, value: 0 },
    { name: "Negotiation", count: 0, value: 0 },
    { name: "Closed Won", count: 0, value: 0 },
  ]

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pipeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(3)].map((_, stageIndex) => (
              <div key={stageIndex}>
                <div className="flex items-center justify-between mb-4">
                  <div className="animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[...Array(2)].map((_, dealIndex) => (
                    <div key={dealIndex} className="animate-pulse border rounded-lg p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const pipelineStages = [
    { name: "Qualified", key: "qualified" },
    { name: "Proposal", key: "proposal" },
    { name: "Negotiation", key: "negotiation" },
    { name: "Closed Won", key: "closed-won" },
  ]

  const dealsByStage = pipelineStages.map((stage) => ({
    ...stage,
    deals: deals.filter((deal) => deal.stage === stage.key && deal.status !== "closed-lost"),
    count: deals.filter((deal) => deal.stage === stage.key && deal.status !== "closed-lost").length,
    value: deals
      .filter((deal) => deal.stage === stage.key && deal.status !== "closed-lost")
      .reduce((acc, deal) => acc + deal.value, 0),
  }))

  const hasDeals = dealsByStage.some((stage) => stage.deals.length > 0)

  if (!hasDeals) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Pipeline Overview
          </CardTitle>
          <Button variant="outline" size="sm">
            View all deals
          </Button>
        </CardHeader>
        <CardContent className="w-full">
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No deals in pipeline</h3>
            <p className="text-muted-foreground mb-4">Start adding deals to track your sales pipeline</p>
            <Button>Add Deal</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Pipeline Overview
        </CardTitle>
        <Button variant="outline" size="sm">
          View all deals
        </Button>
      </CardHeader>
      <CardContent className="w-full">
        <div className="space-y-4">
          {stages.map((stage) => {
            const stageData = dealsByStage.find((s) => s.name === stage.name)
            return (
              <div key={stage.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{stage.name}</span>
                  <span className="text-muted-foreground">
                    {stageData?.count || stage.count} deals • $
                    {stageData?.value.toLocaleString() || stage.value.toLocaleString()}
                  </span>
                </div>
                <Progress value={stageData?.count || stage.count} max={deals.length} className="h-2" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
