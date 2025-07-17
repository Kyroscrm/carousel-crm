"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrendingUp, TrendingDown } from "lucide-react"

export function ReportsTable() {
  const topPerformers = []

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
      </CardHeader>
      <CardContent>
        {topPerformers.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No performance data</h3>
            <p className="text-muted-foreground">Start tracking activities to see performance metrics</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Deals Closed</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Activities</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformers.map((performer: any) => (
                  <TableRow key={performer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={performer.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {performer.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{performer.name}</div>
                          <div className="text-sm text-muted-foreground">{performer.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{performer.dealsCount}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${performer.revenue.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{performer.activitiesCount}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {performer.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <Badge
                          variant={performer.trend === "up" ? "default" : "destructive"}
                          className={performer.trend === "up" ? "bg-green-100 text-green-800" : ""}
                        >
                          {performer.change}%
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
