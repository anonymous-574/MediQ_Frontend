"use client"

import { useEffect, useState } from "react"
import { requireAuth } from "@/lib/auth"
import { NurseLayout } from "@/components/layouts/nurse-layout"
import { QueueManager } from "@/components/nurse/queue-manager"
import { PatientFlow } from "@/components/nurse/patient-flow"
import { RoomStatus } from "@/components/nurse/room-status"
import { TaskList } from "@/components/nurse/task-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, MapPin, CheckSquare } from "lucide-react"
import type { User } from "@/lib/types"

export default function NurseDashboard() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = requireAuth(["nurse"])
    setUser(currentUser)
  }, [])

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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients in Queue</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Across all doctors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Wait</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12 min</div>
              <p className="text-xs text-muted-foreground">Down from 18 min</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rooms Available</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Out of 8 total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Pending</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">2 high priority</p>
            </CardContent>
          </Card>
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
