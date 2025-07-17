"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, Calendar } from "lucide-react"

export function MetricsGrid() {
  const metrics = [
    {
      title: "Total Contacts",
      value: "0",
      change: "+0% vs last month",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Revenue",
      value: "$0",
      change: "+0% vs last month",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Deals",
      value: "0",
      change: "+0% vs last month",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Activities This Month",
      value: "0",
      change: "+0% vs last month",
      icon: Calendar,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {metrics.map((metric) => (
        <Card key={metric.title} className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
