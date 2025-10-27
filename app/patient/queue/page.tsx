"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/shared/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, MapPin, Bell, RefreshCw } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/components/shared/toast"
import type { QueuePosition } from "@/lib/types"

export default function QueueStatusPage() {
  const { showToast } = useToast()
  const [queueData, setQueueData] = useState<QueuePosition | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQueueStatus()
  }, [])

  const fetchQueueStatus = async () => {
    try {
      setLoading(true)
      const response = await apiService.getPatientQueueStatus()
      setQueueData(response)
    } catch (error) {
      console.error("Failed to fetch queue status:", error)
      showToast("Failed to load queue status", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    await fetchQueueStatus()
    showToast("Queue status updated", "success")
  }

  return (
    <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Queue Status</h1>
                <p className="text-muted-foreground">Track your position in the queue</p>
              </div>
              <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>

            {/* Current Queue Status */}
            {queueData ? (
              <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Your Queue Status</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Dr. {(queueData as any).doctor} - {(queueData as any).specialty}
                      </p>
                    </div>
                    <Badge className="text-lg px-4 py-2 bg-primary text-primary-foreground">
                      #{(queueData as any).position}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-card rounded-lg border border-border">
                      <div className="text-3xl font-bold text-primary">{(queueData as any).position}</div>
                      <div className="text-sm text-muted-foreground mt-1">Position in Queue</div>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg border border-border">
                      <div className="text-3xl font-bold text-secondary">{(queueData as any).estimated_wait}min</div>
                      <div className="text-sm text-muted-foreground mt-1">Estimated Wait</div>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg border border-border">
                      <div className="text-3xl font-bold text-accent">{(queueData as any).total_in_queue}</div>
                      <div className="text-sm text-muted-foreground mt-1">Total in Queue</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Queue Progress</span>
                      <span className="text-muted-foreground">
                        {Math.max(0, (queueData as any).totalInQueue - (queueData as any).position)} patients ahead
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{
                          width: `${(((queueData as any).totalInQueue - (queueData as any).position + 1) / (queueData as any).totalInQueue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>Room {(queueData as any).room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Joined at {(queueData as any).joined_at}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
                    <div className="flex items-start gap-3">
                      <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">Stay Alert</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Please remain in the waiting area. You'll be called when it's your turn.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Not in Queue</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    You're not currently in any queue. Book an appointment to join a queue.
                  </p>
                  <Button onClick={() => (window.location.href = "/patient/appointments")}>Book Appointment</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  )
}
