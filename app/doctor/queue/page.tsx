"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

const mockQueue = [
  { id: 1, position: 1, patient: "John Doe", waitTime: 5, status: "In Progress" },
  { id: 2, position: 2, patient: "Jane Smith", waitTime: 15, status: "Waiting" },
  { id: 3, position: 3, patient: "Bob Johnson", waitTime: 25, status: "Waiting" },
  { id: 4, position: 4, patient: "Alice Brown", waitTime: 35, status: "Waiting" },
]

export default function DoctorQueuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patient Queue</h1>
        <p className="text-muted-foreground mt-2">Manage your patient queue and waiting times</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total in Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockQueue.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Patients waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20 min</div>
            <p className="text-xs text-muted-foreground mt-1">Current average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">Currently consulting</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queue Status</CardTitle>
          <CardDescription>Current patient queue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockQueue.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {patient.position}
                  </div>
                  <div>
                    <p className="font-medium">{patient.patient}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {patient.waitTime} min wait
                    </p>
                  </div>
                </div>
                <Badge variant={patient.status === "In Progress" ? "default" : "secondary"}>{patient.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
