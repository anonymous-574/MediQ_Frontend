"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/shared/navbar"
import { Button } from "@/components/shared/button"
import { useToast } from "@/components/shared/toast"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/shared/modal"
import { Calendar, Clock, User, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiService } from "@/lib/api"
import type { Appointment } from "@/lib/types"

export default function DoctorAppointmentsPage() {
  const { showToast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await apiService.getDoctorAppointments()
      setAppointments(response || [])
      setError("")
    } catch (err) {
      const errorMsg = apiService.handleError(err as any)
      setError(errorMsg)
      showToast(errorMsg, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true)
      await apiService.updateAppointmentStatus(appointmentId, newStatus)
      showToast("Appointment status updated", "success")
      fetchAppointments()
      setSelectedAppointment(null)
    } catch (err) {
      const errorMsg = apiService.handleError(err as any)
      showToast(errorMsg, "error")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const filteredAppointments = appointments.filter((apt) =>
    statusFilter === "all" ? true : apt.status === statusFilter,
  )

  return (
    <>
          <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
              <p className="text-muted-foreground">Manage and update your patient appointments</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Filter */}
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Appointments List */}
            {loading ? (
              <LoadingSkeleton />
            ) : filteredAppointments.length > 0 ? (
              <div className="grid gap-4">
                {filteredAppointments.map((apt) => (
                  <Card
                    key={apt.appointment_id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedAppointment(apt)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{apt.patient_name}</CardTitle>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <User className="h-4 w-4" />
                            Patient ID: {apt.patient_id}
                          </div>
                        </div>
                        <Badge className={getStatusColor(apt.status)}>{apt.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(apt.date_time).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(apt.date_time).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </div>
                      {apt.notes && (
                        <div className="text-sm">
                          <span className="font-medium">Notes:</span> {apt.notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No appointments found</h3>
                  <p className="text-muted-foreground text-center">No appointments match your current filter</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Appointment Details"
        actions={
          selectedAppointment?.status === "Scheduled" ? (
            <div className="flex gap-2 w-full">
              <Button
                onClick={() => {
                  if (selectedAppointment) {
                    handleUpdateStatus(selectedAppointment.appointment_id, "Completed")
                  }
                }}
                isLoading={updatingStatus}
                className="flex-1 flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Mark Complete
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedAppointment) {
                    handleUpdateStatus(selectedAppointment.appointment_id, "Cancelled")
                  }
                }}
                isLoading={updatingStatus}
                className="flex-1 flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setSelectedAppointment(null)} className="w-full">
              Close
            </Button>
          )
        }
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Patient Name</p>
              <p className="font-medium">{selectedAppointment.patient_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium">{new Date(selectedAppointment.date_time).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hospital</p>
              <p className="font-medium">{selectedAppointment.hospital_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={getStatusColor(selectedAppointment.status)}>{selectedAppointment.status}</Badge>
            </div>
            {selectedAppointment.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="font-medium">{selectedAppointment.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}
