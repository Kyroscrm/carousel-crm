"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", value: 65000 },
  { name: "Feb", value: 75000 },
  { name: "Mar", value: 85000 },
  { name: "Apr", value: 80000 },
  { name: "May", value: 95000 },
  { name: "Jun", value: 110000 },
]

export function AnalyticsSection() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sales Analytics</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue">Revenue Trend</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline Distribution</TabsTrigger>
            <TabsTrigger value="performance">Team Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue" className="w-full">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="pipeline" className="w-full">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Pipeline distribution chart will be displayed here</p>
            </div>
          </TabsContent>
          <TabsContent value="performance" className="w-full">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Team performance metrics will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
