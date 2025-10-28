"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Clock } from "lucide-react"

const queueData = [
  { time: "9:00", waitTime: 8, patients: 12 },
  { time: "10:00", waitTime: 12, patients: 18 },
  { time: "11:00", waitTime: 15, patients: 22 },
  { time: "12:00", waitTime: 18, patients: 25 },
  { time: "13:00", waitTime: 10, patients: 15 },
  { time: "14:00", waitTime: 14, patients: 20 },
  { time: "15:00", waitTime: 16, patients: 24 },
  { time: "16:00", waitTime: 12, patients: 18 },
]

export function QueueAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Queue Analytics
        </CardTitle>
        <CardDescription>Wait times and patient volume throughout the day</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={queueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="waitTime"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              name="Wait Time (min)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="patients"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              name="Patients in Queue"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
