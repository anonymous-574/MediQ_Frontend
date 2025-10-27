"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, User, ArrowRight, RotateCcw, Loader2, RefreshCw } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/components/shared/toast"
import type { DoctorQueue } from "@/lib/types"

export function QueueManager() {
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
      const response = await apiService.getNurseQueue()
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

  const handleMovePatient = async (patientId: string, newStatus: string) => {
    try {
      await apiService.updatePatientStatus(patientId, newStatus)
      showToast("Patient status updated", "success")
      await fetchQueueData()
    } catch (error) {
      console.error("Failed to update patient status:", error)
      showToast("Failed to update patient status", "error")
    }
  }

  const handlePriorityChange = async (patientId: string, newPriority: string) => {
    try {
      await apiService.updatePatientStatus(patientId, newPriority)
      showToast("Patient priority updated", "success")
      await fetchQueueData()
    } catch (error) {
      console.error("Failed to update patient priority:", error)
      showToast("Failed to update patient priority", "error")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "normal":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
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
            Queue Management
          </CardTitle>
          <CardDescription>Coordinate patient queues across all doctors</CardDescription>
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
              Queue Management
            </CardTitle>
            <CardDescription>Coordinate patient queues across all doctors</CardDescription>
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
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Current Queue</h3>
                <p className="text-sm text-muted-foreground">
                  Total patients: {queueData.totalInQueue}
                </p>
              </div>
              <Badge variant="outline">{queueData.patients.length} patients</Badge>
            </div>

            <div className="space-y-3">
              {queueData.patients.map((patient, patientIndex) => (
                <div
                  key={patient.patient_id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    patientIndex === 0 ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">Wait: {patient.wait_time} min</p>
                      <p className="text-xs text-muted-foreground">Appointment: {patient.appointment_time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Select
                      value={patient.status}
                      onValueChange={(value) => handlePriorityChange(patient.patient_id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waiting">Waiting</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Badge className={getPriorityColor(patient.status)}>{patient.status}</Badge>

                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMovePatient(patient.patient_id, "in_progress")}
                        title="Move to next"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMovePatient(patient.patient_id, "completed")}
                        title="Mark complete"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
