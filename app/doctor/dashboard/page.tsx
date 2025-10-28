"use client"

import { useEffect, useState } from "react"
import { requireAuth } from "@/lib/auth"
import { useToast } from "@/components/shared/toast"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Clock, FileText, AlertCircle } from "lucide-react"
import { apiService } from "@/lib/api"
import type { Appointment, User } from "@/lib/types"

export default function DoctorDashboard() {
  const { showToast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const currentUser = requireAuth(["doctor"])
    setUser(currentUser)

    if (currentUser) {
      fetchAppointments()
    }
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

  if (!user) return null

  const todayAppointments = appointments.filter((a) => {
    const appointmentDate = new Date(a.date_time).toDateString()
    const today = new Date().toDateString()
    return appointmentDate === today
  })

  const completedToday = todayAppointments.filter((a) => a.status === "Completed").length
  const pendingAppointments = appointments.filter((a) => a.status === "Scheduled").length

  return (
    <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Good morning, Dr. {user.name}</h1>
              <p className="text-muted-foreground">Manage your patients and schedule</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Quick Stats */}
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Patients</CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{todayAppointments.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {completedToday} completed, {todayAppointments.length - completedToday} remaining
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                    <Calendar className="h-4 w-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{appointments.length}</div>
                    <p className="text-xs text-muted-foreground">Scheduled and completed</p>
                  </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-accent/5 to-accent/10 border-accent/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
                    <Clock className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pendingAppointments}</div>
                    <p className="text-xs text-muted-foreground">Awaiting completion</p>
                  </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-chart-2/5 to-chart-2/10 border-chart-2/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Availability</CardTitle>
                    <FileText className="h-4 w-4 text-chart-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Active</div>
                    <p className="text-xs text-muted-foreground">Currently available</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">View Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Manage your patient appointments</p>
                  <a href="/doctor/appointments" className="text-primary font-medium hover:underline">
                    Go to Appointments →
                  </a>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">Update Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Set your available time slots</p>
                  <a href="/doctor/availability" className="text-primary font-medium hover:underline">
                    Manage Availability →
                  </a>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">View Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Access patient information</p>
                  <a href="/doctor/patients" className="text-primary font-medium hover:underline">
                    View Patients →
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Recent Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.slice(0, 5).map((apt) => (
                      <div
                        key={apt.appointment_id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{apt.patient_name}</p>
                          <p className="text-sm text-muted-foreground">{new Date(apt.date_time).toLocaleString()}</p>
                        </div>
                        <span className="text-sm font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No appointments scheduled</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
