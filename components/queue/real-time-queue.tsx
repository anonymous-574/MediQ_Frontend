"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useQueue } from "@/hooks/use-queue"
import { Clock, User, Phone, ArrowRight } from "lucide-react"

interface RealTimeQueueProps {
  doctorId?: string
  showActions?: boolean
  title?: string
}

export function RealTimeQueue({ doctorId, showActions = false, title = "Queue Status" }: RealTimeQueueProps) {
  const { queue, isLoading, updatePatientStatus, updatePatientPriority, callNextPatient } = useQueue(doctorId)

  const handleCallNext = async () => {
    if (doctorId) {
      const nextPatient = await callNextPatient(doctorId)
      if (nextPatient) {
        console.log("Called next patient:", nextPatient.name)
      }
    }
  }

  const handleStatusChange = async (patientId: string, status: string) => {
    await updatePatientStatus(patientId, status)
  }

  const handlePriorityChange = async (patientId: string, priority: string) => {
    await updatePatientPriority(patientId, priority)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "normal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {queue.length} patient{queue.length !== 1 ? "s" : ""} in queue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {queue.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No patients in queue</p>
            </div>
          ) : (
            queue.map((patient, index) => (
              <div
                key={patient.id}
                className={`p-4 border rounded-lg ${
                  index === 0 && patient.status === "waiting" ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{patient.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {patient.appointmentTime} • {patient.reason}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(patient.priority)}>{patient.priority}</Badge>
                    <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {patient.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Wait: {patient.waitTime} min
                    </div>
                  </div>

                  {showActions && (
                    <div className="flex gap-2">
                      {index === 0 && patient.status === "waiting" && (
                        <Button size="sm" onClick={handleCallNext}>
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Call Next
                        </Button>
                      )}
                      {patient.status === "in-progress" && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(patient.id, "completed")}>
                          Complete
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
