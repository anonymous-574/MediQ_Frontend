"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Clock } from "lucide-react"

const mockPatients = [
  {
    id: 1,
    name: "John Doe",
    room: "Room 101",
    doctor: "Dr. Smith",
    status: "In Consultation",
    arrivalTime: "09:00",
  },
  {
    id: 2,
    name: "Jane Smith",
    room: "Room 102",
    doctor: "Dr. Brown",
    status: "Waiting",
    arrivalTime: "09:15",
  },
  {
    id: 3,
    name: "Bob Johnson",
    room: "Room 103",
    doctor: "Dr. Smith",
    status: "Completed",
    arrivalTime: "08:45",
  },
]

export default function NursePatientsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
<div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patient Flow</h1>
        <p className="text-muted-foreground mt-2">Monitor patient movement through the hospital</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Patients</CardTitle>
          <CardDescription>All patients in the hospital today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPatients.map((patient) => (
              <div key={patient.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                <div className="flex-1">
                  <h4 className="font-semibold">{patient.name}</h4>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {patient.room}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {patient.doctor}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Arrived: {patient.arrivalTime}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge
                    variant={
                      patient.status === "In Consultation"
                        ? "default"
                        : patient.status === "Completed"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {patient.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Update Status
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
    </div>

    
    
  )
}
