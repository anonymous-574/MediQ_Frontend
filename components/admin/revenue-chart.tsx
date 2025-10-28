"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DollarSign } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 185000, expenses: 120000 },
  { month: "Feb", revenue: 198000, expenses: 125000 },
  { month: "Mar", revenue: 215000, expenses: 130000 },
  { month: "Apr", revenue: 232000, expenses: 135000 },
  { month: "May", revenue: 248000, expenses: 140000 },
  { month: "Jun", revenue: 265000, expenses: 145000 },
  { month: "Jul", revenue: 278000, expenses: 148000 },
  { month: "Aug", revenue: 285000, expenses: 152000 },
]

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Revenue Overview
        </CardTitle>
        <CardDescription>Monthly revenue and expenses comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
            <Area
              type="monotone"
              dataKey="revenue"
              stackId="1"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.6}
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stackId="2"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.6}
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
