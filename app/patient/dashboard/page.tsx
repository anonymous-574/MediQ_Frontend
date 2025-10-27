"use client"

import { useEffect, useState } from "react"
import { requireAuth } from "@/lib/auth"
import { useToast } from "@/components/shared/toast"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, FileText, Users, AlertCircle } from "lucide-react"
import { apiService } from "@/lib/api"
import type { Appointment, User } from "@/lib/types"

export default function PatientDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { showToast } = useToast()

  useEffect(() => {
    const currentUser = requireAuth(["patient"])
    setUser(currentUser)

    if (currentUser) {
      fetchAppointments()
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

  if (!user) return null

  const nextAppointment = appointments.find((a) => a.status === "Scheduled")
  const completedCount = appointments.filter((a) => a.status === "Completed").length

  return (
    <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.name}</h1>
              <p className="text-muted-foreground">Manage your appointments and health records</p>
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
                    <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
                    <Calendar className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {nextAppointment ? new Date(nextAppointment.date_time).toLocaleDateString() : "None"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {nextAppointment
                        ? `${nextAppointment.doctor_name} - ${new Date(nextAppointment.date_time).toLocaleTimeString()}`
                        : "No upcoming appointments"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                    <Users className="h-4 w-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{appointments.length}</div>
                    <p className="text-xs text-muted-foreground">Scheduled and completed</p>
                  </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-accent/5 to-accent/10 border-accent/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Visits</CardTitle>
                    <FileText className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{completedCount}</div>
                    <p className="text-xs text-muted-foreground">Medical records available</p>
                  </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-chart-2/5 to-chart-2/10 border-chart-2/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                    <Clock className="h-4 w-4 text-chart-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Active</div>
                    <p className="text-xs text-muted-foreground">All systems operational</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">Book Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Schedule a new appointment with a doctor</p>
                  <a href="/patient/appointments" className="text-primary font-medium hover:underline">
                    Go to Appointments →
                  </a>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">Submit Symptoms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Get AI-powered symptom analysis</p>
                  <a href="/patient/symptoms" className="text-primary font-medium hover:underline">
                    Submit Symptoms →
                  </a>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">View Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Access your medical reports</p>
                  <a href="/patient/reports" className="text-primary font-medium hover:underline">
                    View Reports →
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  )
}
