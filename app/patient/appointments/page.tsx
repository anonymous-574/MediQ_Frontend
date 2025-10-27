"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/shared/button"
import { useToast } from "@/components/shared/toast"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/shared/modal"
import { Calendar, Clock, MapPin, Plus, Filter, Search, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiService } from "@/lib/api"
import type { Appointment } from "@/lib/types"
import { AppointmentBooking } from "@/components/patient/appointment-booking"

export default function AppointmentsPage() {
  const { showToast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    fetchAppointments()

    // Listen for appointment booking success
    const handleAppointmentBooked = () => {
      setIsBookingOpen(false)
      fetchAppointments() // Refresh the appointments list
    }

    window.addEventListener("appointmentBooked", handleAppointmentBooked)

    return () => {
      window.removeEventListener("appointmentBooked", handleAppointmentBooked)
    }
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await apiService.getPatientAppointments()
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

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await apiService.cancelAppointment(appointmentId)
      showToast("Appointment cancelled successfully", "success")
      fetchAppointments()
      setSelectedAppointment(null)
    } catch (err) {
      const errorMsg = apiService.handleError(err as any)
      showToast(errorMsg, "error")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.hospital_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
                <p className="text-muted-foreground">Manage your medical appointments</p>
              </div>
              <Button onClick={() => setIsBookingOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Book Appointment
              </Button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
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
                {filteredAppointments.map((appointment) => (
                  <Card
                    key={appointment.appointment_id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{appointment.doctor_name}</CardTitle>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <MapPin className="h-4 w-4" />
                            {appointment.hospital_name}
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(appointment.date_time).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(appointment.date_time).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="text-sm">
                          <span className="font-medium">Notes:</span> {appointment.notes}
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
                  <p className="text-muted-foreground text-center mb-4">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "You don't have any appointments scheduled yet"}
                  </p>
                  <Button onClick={() => setIsBookingOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        title="Book New Appointment"
        actions={
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={() => setIsBookingOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        }
      >
        <AppointmentBooking />
      </Modal>

      {/* Appointment Details Modal */}
      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Appointment Details"
        actions={
          selectedAppointment?.status === "Scheduled" ? (
            <div className="flex gap-2 w-full">
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedAppointment) {
                    handleCancelAppointment(selectedAppointment.appointment_id)
                  }
                }}
                className="flex-1"
              >
                Cancel Appointment
              </Button>
              <Button variant="outline" onClick={() => setSelectedAppointment(null)} className="flex-1">
                Close
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
              <p className="text-sm text-muted-foreground">Doctor</p>
              <p className="font-medium">{selectedAppointment.doctor_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hospital</p>
              <p className="font-medium">{selectedAppointment.hospital_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium">{new Date(selectedAppointment.date_time).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={getStatusColor(selectedAppointment.status)}>
                {selectedAppointment.status}
              </Badge>
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
