"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

const mockQueueData = [
  { id: 1, position: 1, patient: "John Doe", doctor: "Dr. Smith", waitTime: 5, status: "In Progress" },
  { id: 2, position: 2, patient: "Jane Smith", doctor: "Dr. Smith", waitTime: 15, status: "Waiting" },
  { id: 3, position: 3, patient: "Bob Johnson", doctor: "Dr. Brown", waitTime: 25, status: "Waiting" },
  { id: 4, position: 4, patient: "Alice Brown", doctor: "Dr. Brown", waitTime: 35, status: "Waiting" },
]

export default function NurseQueuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Queue Management</h1>
        <p className="text-muted-foreground mt-2">Manage hospital patient queues</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockQueueData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20 min</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Queue</CardTitle>
          <CardDescription>All patients in queue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockQueueData.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {patient.position}
                  </div>
                  <div>
                    <p className="font-medium">{patient.patient}</p>
                    <p className="text-sm text-muted-foreground">{patient.doctor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {patient.waitTime} min
                    </p>
                  </div>
                  <Badge variant={patient.status === "In Progress" ? "default" : "secondary"}>{patient.status}</Badge>
                  <Button size="sm" variant="outline">
                    Call Next
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
