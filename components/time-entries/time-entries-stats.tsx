"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, DollarSign, Users, Calendar } from "lucide-react"
import { useTimeEntries } from "@/hooks/use-time-entries"
import { useMemo } from "react"

export function TimeEntriesStats() {
  const { timeEntries, loading } = useTimeEntries()

  const stats = useMemo(() => {
    if (!timeEntries.length) {
      return [
        {
          title: "Total Hours This Week",
          value: "0",
          change: "No entries yet",
          icon: Clock,
          color: "from-blue-500 to-blue-600",
        },
        {
          title: "Billable Amount",
          value: "$0",
          change: "No billable hours",
          icon: DollarSign,
          color: "from-green-500 to-green-600",
        },
        {
          title: "Active Workers",
          value: "0",
          change: "No active workers",
          icon: Users,
          color: "from-purple-500 to-purple-600",
        },
        {
          title: "Active Jobs",
          value: "0",
          change: "No active jobs",
          icon: Calendar,
          color: "from-orange-500 to-orange-600",
        },
      ]
    }

    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const startOfLastWeek = new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000)

    const thisWeekEntries = timeEntries.filter((entry) => new Date(entry.date) >= startOfWeek)
    const lastWeekEntries = timeEntries.filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate >= startOfLastWeek && entryDate < startOfWeek
    })

    const thisWeekHours = thisWeekEntries.reduce((sum, entry) => sum + entry.hours, 0)
    const lastWeekHours = lastWeekEntries.reduce((sum, entry) => sum + entry.hours, 0)
    const hoursChange = lastWeekHours > 0 ? (((thisWeekHours - lastWeekHours) / lastWeekHours) * 100).toFixed(0) : "0"

    const billableAmount = thisWeekEntries
      .filter((entry) => entry.billable)
      .reduce((sum, entry) => sum + entry.hours * (entry.hourlyRate || 0), 0)

    const lastWeekBillable = lastWeekEntries
      .filter((entry) => entry.billable)
      .reduce((sum, entry) => sum + entry.hours * (entry.hourlyRate || 0), 0)

    const billableChange =
      lastWeekBillable > 0 ? (((billableAmount - lastWeekBillable) / lastWeekBillable) * 100).toFixed(0) : "0"

    const activeWorkers = new Set(thisWeekEntries.map((entry) => entry.workerId)).size
    const activeJobs = new Set(thisWeekEntries.map((entry) => entry.jobId)).size

    return [
      {
        title: "Total Hours This Week",
        value: thisWeekHours.toString(),
        change: `${hoursChange >= 0 ? "+" : ""}${hoursChange}% vs last week`,
        icon: Clock,
        color: "from-blue-500 to-blue-600",
      },
      {
        title: "Billable Amount",
        value: `$${billableAmount.toLocaleString()}`,
        change: `${billableChange >= 0 ? "+" : ""}${billableChange}% vs last week`,
        icon: DollarSign,
        color: "from-green-500 to-green-600",
      },
      {
        title: "Active Workers",
        value: activeWorkers.toString(),
        change: `${activeWorkers} working this week`,
        icon: Users,
        color: "from-purple-500 to-purple-600",
      },
      {
        title: "Active Jobs",
        value: activeJobs.toString(),
        change: `${activeJobs} jobs in progress`,
        icon: Calendar,
        color: "from-orange-500 to-orange-600",
      },
    ]
  }, [timeEntries])

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
