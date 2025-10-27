"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

const patientData = [
  { month: "Jan", newPatients: 245, returning: 412 },
  { month: "Feb", newPatients: 289, returning: 398 },
  { month: "Mar", newPatients: 312, returning: 445 },
  { month: "Apr", newPatients: 298, returning: 467 },
  { month: "May", newPatients: 334, returning: 489 },
  { month: "Jun", newPatients: 356, returning: 512 },
]

export function PatientAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Patient Analytics
        </CardTitle>
        <CardDescription>New vs returning patients over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={patientData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="newPatients" fill="hsl(var(--chart-1))" name="New Patients" />
            <Bar dataKey="returning" fill="hsl(var(--chart-2))" name="Returning Patients" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
