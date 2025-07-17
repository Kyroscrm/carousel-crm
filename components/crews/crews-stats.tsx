"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useCrews } from "@/hooks/use-crews"
import { useMemo } from "react"

export function CrewsStats() {
  const { crews, loading } = useCrews()

  const stats = useMemo(() => {
    if (!crews.length) {
      return [
        { title: "Total Crews", value: "0", change: "No crews added", icon: Users, color: "from-blue-500 to-blue-600" },
        {
          title: "Available Crews",
          value: "0",
          change: "No available crews",
          icon: CheckCircle,
          color: "from-green-500 to-green-600",
        },
        {
          title: "Active Assignments",
          value: "0",
          change: "No active assignments",
          icon: Clock,
          color: "from-orange-500 to-orange-600",
        },
        {
          title: "Subcontractors",
          value: "0",
          change: "No subcontractors",
          icon: AlertCircle,
          color: "from-purple-500 to-purple-600",
        },
      ]
    }

    const availableCrews = crews.filter((crew) => crew.status === "available").length
    const activeAssignments = crews.filter((crew) => crew.status === "assigned").length
    const totalSubcontractors = crews.reduce((sum, crew) => sum + crew.members.length, 0)

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const newCrewsThisMonth = crews.filter((crew) => new Date(crew.createdAt) >= startOfMonth).length

    return [
      {
        title: "Total Crews",
        value: crews.length.toString(),
        change: newCrewsThisMonth > 0 ? `+${newCrewsThisMonth} this month` : "No new crews",
        icon: Users,
        color: "from-blue-500 to-blue-600",
      },
      {
        title: "Available Crews",
        value: availableCrews.toString(),
        change: availableCrews > 0 ? "Ready for assignment" : "No available crews",
        icon: CheckCircle,
        color: "from-green-500 to-green-600",
      },
      {
        title: "Active Assignments",
        value: activeAssignments.toString(),
        change: activeAssignments > 0 ? "In progress" : "No active assignments",
        icon: Clock,
        color: "from-orange-500 to-orange-600",
      },
      {
        title: "Subcontractors",
        value: totalSubcontractors.toString(),
        change: `${crews.length} crews total`,
        icon: AlertCircle,
        color: "from-purple-500 to-purple-600",
      },
    ]
  }, [crews])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <div className={`bg-gradient-to-r ${stat.color} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="opacity-80">
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="p-4 bg-white">
              <p className="text-sm text-gray-600">{stat.change}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
