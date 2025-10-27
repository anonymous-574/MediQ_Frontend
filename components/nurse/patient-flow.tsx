"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, User, MapPin } from "lucide-react"

const patientFlow = [
  {
    id: "1",
    name: "John Doe",
    currentLocation: "Waiting Room",
    nextLocation: "Room 201",
    status: "ready",
    doctor: "Dr. Sarah Smith",
    appointmentTime: "2:00 PM",
  },
  {
    id: "2",
    name: "Jane Smith",
    currentLocation: "Room 201",
    nextLocation: "Lab",
    status: "in-progress",
    doctor: "Dr. Sarah Smith",
    appointmentTime: "2:30 PM",
  },
  {
    id: "3",
    name: "Bob Wilson",
    currentLocation: "Lab",
    nextLocation: "Checkout",
    status: "completing",
    doctor: "Dr. Michael Johnson",
    appointmentTime: "3:00 PM",
  },
]

export function PatientFlow() {
  const handleMovePatient = (patientId: string, nextLocation: string) => {
    console.log(`Moving patient ${patientId} to ${nextLocation}`)
    // In a real app, this would update the patient location
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "completing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Patient Flow
        </CardTitle>
        <CardDescription>Track patient movement through the facility</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patientFlow.map((patient) => (
            <div key={patient.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{patient.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {patient.doctor} • {patient.appointmentTime}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{patient.currentLocation}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{patient.nextLocation}</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleMovePatient(patient.id, patient.nextLocation)}
                  disabled={patient.status !== "ready"}
                >
                  Move to {patient.nextLocation}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
