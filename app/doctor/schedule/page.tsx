"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Loader2, RefreshCw, Calendar } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/components/shared/toast"
import type { Appointment } from "@/lib/types"

export default function DoctorSchedulePage() {
  const { showToast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await apiService.getDoctorAppointments()
      setAppointments(response || [])
    } catch (error) {
      console.error("Failed to fetch appointments:", error)
      showToast("Failed to load appointments", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    await fetchAppointments()
    showToast("Schedule updated", "success")
  }

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    try {
      await apiService.updateAppointmentStatus(appointmentId, status)
      showToast("Appointment status updated", "success")
      await fetchAppointments()
    } catch (error) {
      console.error("Failed to update appointment status:", error)
      showToast("Failed to update appointment status", "error")
    }
  }

  const filteredSchedule = appointments.filter((appointment) =>
    appointment.date_time.startsWith(selectedDate)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Schedule</h1>
              <p className="text-muted-foreground mt-2">View and manage your appointments</p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Schedule Card */}
          <Card className="shadow-sm border border-border">
            <CardHeader>
              <CardTitle>Schedule for {new Date(selectedDate).toLocaleDateString()}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-1 border rounded-md bg-background text-foreground"
                  />
                </div>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {filteredSchedule.length > 0 ? (
                  filteredSchedule.map((appointment) => (
                    <div
                      key={appointment.appointment_id}
                      className="flex items-start justify-between border-b pb-4 last:border-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-semibold">
                            {new Date(appointment.date_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <h4 className="font-medium">{appointment.patient_name}</h4>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span>Appointment ID: {appointment.appointment_id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {appointment.hospital_name}
                          </div>
                          {appointment.notes && (
                            <div className="text-sm">
                              <span className="font-medium">Notes:</span> {appointment.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <Badge
                          variant={
                            appointment.status === "Completed"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {appointment.status}
                        </Badge>

                        {appointment.status !== "Completed" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateStatus(appointment.appointment_id, "In Progress")
                              }
                            >
                              Start
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateStatus(appointment.appointment_id, "Completed")
                              }
                            >
                              Complete
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No appointments scheduled
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      No appointments found for the selected date
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
