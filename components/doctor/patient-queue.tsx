"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Phone, Loader2, RefreshCw } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/components/shared/toast"
import type { DoctorQueue } from "@/lib/types"

export function PatientQueue() {
  const { showToast } = useToast()
  const [queueData, setQueueData] = useState<DoctorQueue | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchQueueData()
  }, [])

  const fetchQueueData = async () => {
    try {
      setLoading(true)
      const response = await apiService.getDoctorQueue()
      setQueueData(response)
    } catch (error) {
      console.error("Failed to fetch queue data:", error)
      showToast("Failed to load queue data", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await fetchQueueData()
      showToast("Queue updated", "success")
    } catch (error) {
      console.error("Failed to refresh queue:", error)
      showToast("Failed to refresh queue", "error")
    } finally {
      setRefreshing(false)
    }
  }

  const handleCallNext = async (patientId: string) => {
    try {
      await apiService.updateAppointmentStatus(patientId, "In Progress")
      showToast("Patient called successfully", "success")
      await fetchQueueData()
    } catch (error) {
      console.error("Failed to call next patient:", error)
      showToast("Failed to call next patient", "error")
    }
  }

  const handleMarkComplete = async (patientId: string) => {
    try {
      await apiService.updateAppointmentStatus(patientId, "Completed")
      showToast("Appointment marked as complete", "success")
      await fetchQueueData()
    } catch (error) {
      console.error("Failed to mark appointment as complete:", error)
      showToast("Failed to mark appointment as complete", "error")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (!queueData || !queueData.patients.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Patient Queue
          </CardTitle>
          <CardDescription>Manage your patient queue and appointments</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No patients in queue</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Patient Queue
            </CardTitle>
            <CardDescription>Manage your patient queue and appointments</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {queueData.patients.map((patient, index) => (
            <div
              key={patient.patient_id}
              className={`p-4 border rounded-lg ${index === 0 ? "border-primary bg-primary/5" : "border-border"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{patient.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Age {patient.age} • {patient.appointment_time}
                    </p>
                    <p className="text-sm text-muted-foreground">{patient.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge variant={patient.status === "waiting" ? "default" : "secondary"} className="mb-1">
                      {patient.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">Wait: {patient.wait_time} min</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {index === 0 && (
                      <Button size="sm" onClick={() => handleCallNext(patient.patient_id)}>
                        Call Next
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleMarkComplete(patient.patient_id)}>
                      Complete
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{patient.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
