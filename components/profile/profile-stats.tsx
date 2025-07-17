"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Phone, Mail, Calendar, Target, Users, DollarSign } from "lucide-react"
import { useActivities } from "@/hooks/use-activities"
import { useDeals } from "@/hooks/use-deals"
import { useContacts } from "@/hooks/use-contacts"
import { useAuth } from "@/hooks/use-auth"

export function ProfileStats() {
  const { activities, loading: activitiesLoading } = useActivities()
  const { deals, loading: dealsLoading } = useDeals()
  const { allContacts, loading: contactsLoading } = useContacts()
  const { user } = useAuth()

  const loading = activitiesLoading || dealsLoading || contactsLoading

  // Calculate user-specific stats
  const userActivities = activities.filter((activity) => activity.userName === user?.name)
  const userDeals = deals.filter((deal) => deal.owner === user?.name)
  const userContacts = allContacts.filter((contact) => contact.createdAt) // All contacts for now

  // This month calculations
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)

  const thisMonthActivities = userActivities.filter((activity) => new Date(activity.createdAt) >= thisMonth)

  const thisMonthDeals = userDeals.filter((deal) => new Date(deal.createdAt) >= thisMonth)

  const thisMonthContacts = userContacts.filter((contact) => new Date(contact.createdAt) >= thisMonth)

  // Calculate revenue from closed-won deals
  const totalRevenue = userDeals
    .filter((deal) => deal.stage === "closed-won")
    .reduce((sum, deal) => sum + deal.value, 0)

  const thisMonthRevenue = userDeals
    .filter((deal) => deal.stage === "closed-won" && new Date(deal.updatedAt) >= thisMonth)
    .reduce((sum, deal) => sum + deal.value, 0)

  // Activity type counts
  const callsCount = thisMonthActivities.filter((a) => a.type === "call").length
  const emailsCount = thisMonthActivities.filter((a) => a.type === "email").length
  const meetingsCount = thisMonthActivities.filter((a) => a.type === "meeting").length

  // Previous month for comparison
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  lastMonth.setDate(1)
  lastMonth.setHours(0, 0, 0, 0)

  const endOfLastMonth = new Date(thisMonth)
  endOfLastMonth.setDate(0)
  endOfLastMonth.setHours(23, 59, 59, 999)

  const lastMonthActivities = userActivities.filter((activity) => {
    const activityDate = new Date(activity.createdAt)
    return activityDate >= lastMonth && activityDate <= endOfLastMonth
  })

  const lastMonthDeals = userDeals.filter((deal) => {
    const dealDate = new Date(deal.createdAt)
    return dealDate >= lastMonth && dealDate <= endOfLastMonth
  })

  // Calculate growth percentages
  const activitiesGrowth =
    lastMonthActivities.length > 0
      ? (((thisMonthActivities.length - lastMonthActivities.length) / lastMonthActivities.length) * 100).toFixed(1)
      : thisMonthActivities.length > 0
        ? "100"
        : "0"

  const dealsGrowth =
    lastMonthDeals.length > 0
      ? (((thisMonthDeals.length - lastMonthDeals.length) / lastMonthDeals.length) * 100).toFixed(1)
      : thisMonthDeals.length > 0
        ? "100"
        : "0"

  const completedActivities = userActivities.filter((activity) => activity.status === "completed").length

  const dealsClosed = userDeals.filter((deal) => deal.stage === "closed-won").length
  const dealsClosedTarget = 10
  const dealsClosedProgress = (dealsClosed / dealsClosedTarget) * 100

  const revenueGenerated = `$${thisMonthRevenue.toLocaleString()}`
  const revenueGeneratedTarget = "$50K"
  const revenueGeneratedProgress = (thisMonthRevenue / 50000) * 100

  const newContacts = thisMonthContacts.length
  const newContactsTarget = 25
  const newContactsProgress = (newContacts / newContactsTarget) * 100

  const activitiesCount = thisMonthActivities.length
  const activitiesTarget = 100
  const activitiesProgress = (activitiesCount / activitiesTarget) * 100

  const stats = [
    {
      title: "Deals Closed",
      value: dealsClosed.toString(),
      target: dealsClosedTarget.toString(),
      progress: dealsClosedProgress,
      icon: Target,
      color: "text-blue-600",
    },
    {
      title: "Revenue Generated",
      value: revenueGenerated,
      target: revenueGeneratedTarget,
      progress: revenueGeneratedProgress,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "New Contacts",
      value: newContacts.toString(),
      target: newContactsTarget.toString(),
      progress: newContactsProgress,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Activities",
      value: activitiesCount.toString(),
      target: activitiesTarget.toString(),
      progress: activitiesProgress,
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {stats.map((stat) => (
            <div key={stat.title} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-sm font-medium">{stat.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {stat.value} / {stat.target}
                </span>
              </div>
              <Progress value={stat.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Breakdown (This Month)</CardTitle>
        </CardHeader>
        <CardContent>
          {thisMonthActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="p-2 rounded-full text-green-600 bg-green-100">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{callsCount}</p>
                  <p className="text-sm text-gray-600">Calls Made</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="p-2 rounded-full text-blue-600 bg-blue-100">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{emailsCount}</p>
                  <p className="text-sm text-gray-600">Emails Sent</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="p-2 rounded-full text-purple-600 bg-purple-100">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{meetingsCount}</p>
                  <p className="text-sm text-gray-600">Meetings Held</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No activities this month</p>
              <p className="text-sm mt-1">Start logging activities to see your performance metrics</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deal Pipeline Status */}
      {userDeals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Deal Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["qualified", "proposal", "negotiation", "closed-won"].map((stage) => {
                const stageDeals = userDeals.filter((deal) => deal.stage === stage)
                const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0)

                return (
                  <div key={stage} className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{stageDeals.length}</p>
                    <p className="text-sm text-gray-600 capitalize mb-1">{stage.replace("-", " ")}</p>
                    <p className="text-xs text-gray-500">${stageValue.toLocaleString()}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
