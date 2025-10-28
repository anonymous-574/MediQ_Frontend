"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock } from "lucide-react"

const mockAppointments = [
  {
    id: 1,
    patient: "John Doe",
    doctor: "Dr. Smith",
    date: "2025-10-24",
    time: "09:00",
    status: "Scheduled",
  },
  {
    id: 2,
    patient: "Jane Smith",
    doctor: "Dr. Brown",
    date: "2025-10-24",
    time: "10:00",
    status: "Completed",
  },
  {
    id: 3,
    patient: "Bob Johnson",
    doctor: "Dr. Smith",
    date: "2025-10-24",
    time: "11:00",
    status: "Cancelled",
  },
]

export default function AdminAppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground mt-2">View and manage all hospital appointments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAppointments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAppointments.filter((a) => a.status === "Scheduled").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAppointments.filter((a) => a.status === "Completed").length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
          <CardDescription>Today's appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                <div className="flex-1">
                  <h4 className="font-medium">{appointment.patient}</h4>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {appointment.doctor}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {appointment.time}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge
                    variant={
                      appointment.status === "Scheduled"
                        ? "default"
                        : appointment.status === "Completed"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {appointment.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    View Details
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
