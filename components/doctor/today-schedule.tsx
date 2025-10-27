"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

const todayAppointments = [
  {
    id: "1",
    time: "09:00 AM",
    patient: "Alice Johnson",
    type: "Consultation",
    status: "completed",
    duration: "30 min",
  },
  {
    id: "2",
    time: "09:30 AM",
    patient: "Bob Wilson",
    type: "Follow-up",
    status: "completed",
    duration: "15 min",
  },
  {
    id: "3",
    time: "10:00 AM",
    patient: "Carol Brown",
    type: "Checkup",
    status: "completed",
    duration: "20 min",
  },
  {
    id: "4",
    time: "2:00 PM",
    patient: "John Doe",
    type: "Follow-up",
    status: "current",
    duration: "30 min",
  },
  {
    id: "5",
    time: "2:30 PM",
    patient: "Jane Smith",
    type: "Consultation",
    status: "upcoming",
    duration: "45 min",
  },
  {
    id: "6",
    time: "3:15 PM",
    patient: "Robert Johnson",
    type: "Checkup",
    status: "upcoming",
    duration: "30 min",
  },
]

export function TodaySchedule() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "current":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "upcoming":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today's Schedule
        </CardTitle>
        <CardDescription>Your appointments for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                appointment.status === "current" ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm font-medium min-w-[70px]">
                  <Clock className="h-4 w-4" />
                  {appointment.time}
                </div>
                <div>
                  <p className="font-medium">{appointment.patient}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.type} • {appointment.duration}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
