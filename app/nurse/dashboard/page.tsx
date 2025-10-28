"use client"

import { useEffect, useState } from "react"
import { requireAuth } from "@/lib/auth"
import { QueueManager } from "@/components/nurse/queue-manager"
import { PatientFlow } from "@/components/nurse/patient-flow"
import { RoomStatus } from "@/components/nurse/room-status"
import { TaskList } from "@/components/nurse/task-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, MapPin, CheckSquare, Loader2 } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/components/shared/toast"
import type { User, NurseQueueReport } from "@/lib/types"

export default function NurseDashboard() {
  const { showToast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [queueReports, setQueueReports] = useState<NurseQueueReport[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = requireAuth(["nurse"])
    setUser(currentUser)
    if (currentUser) {
      loadDashboardData()
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [queueResponse, roomResponse] = await Promise.all([
        apiService.getNurseQueue(),
        apiService.getNurseRooms(),
      ])
      setQueueReports(queueResponse || [])
      setRooms(roomResponse || [])
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      showToast("Failed to load dashboard data", "error")
    } finally {
      setLoading(false)
    }
  }

  // Calculate derived stats
  const totalPatients = queueReports.reduce((acc, report) => acc + (report.queue_length || 0), 0)
  const avgWait =
    queueReports.length > 0
      ? Math.round(
          queueReports.reduce((acc, report) => acc + (report.wait_time_reported || 0), 0) /
            queueReports.length
        )
      : 0
  const roomsAvailable = rooms.filter((r) => !r.occupied).length
  const totalRooms = rooms.length
  const tasksPending = 5 // (You can later replace this with API-driven task count)

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hello, {user.name}</h1>
            <p className="text-muted-foreground">Manage patient flow and coordinate care</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-4 flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Patients in Queue</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalPatients}</div>
                    <p className="text-xs text-muted-foreground">Across all departments</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Wait</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{avgWait} min</div>
                    <p className="text-xs text-muted-foreground">
                      Based on recent queue reports
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rooms Available</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{roomsAvailable}</div>
                    <p className="text-xs text-muted-foreground">
                      Out of {totalRooms} total rooms
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tasks Pending</CardTitle>
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{tasksPending}</div>
                    <p className="text-xs text-muted-foreground">2 high priority</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <QueueManager />
              <PatientFlow />
            </div>
            <div className="space-y-6">
              <RoomStatus />
              <TaskList />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
