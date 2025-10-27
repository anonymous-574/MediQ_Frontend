"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, RefreshCw, Loader2 } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/components/shared/toast"
import type { QueuePosition } from "@/lib/types"

export function QueueStatus() {
  const { showToast } = useToast()
  const [queueData, setQueueData] = useState<QueuePosition | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

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
    try {
      setRefreshing(true)
      await fetchQueueStatus()
      showToast("Queue status updated", "success")
    } catch (error) {
      console.error("Failed to refresh queue status:", error)
      showToast("Failed to refresh queue status", "error")
    } finally {
      setRefreshing(false)
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

  if (!queueData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Queue Status
          </CardTitle>
          <CardDescription>Your current position in the waiting queue</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">You are not currently in any queue.</p>
          <p className="text-sm text-muted-foreground mt-2">Book an appointment to join a queue.</p>
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
              Queue Status
            </CardTitle>
            <CardDescription>Your current position in the waiting queue</CardDescription>
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
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-primary">{queueData.position}</div>
          <p className="text-sm text-muted-foreground">Your position in queue</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-semibold">{queueData.estimatedWait}</div>
            <p className="text-xs text-muted-foreground">Minutes wait</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-semibold">{queueData.totalInQueue}</div>
            <p className="text-xs text-muted-foreground">Total in queue</p>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Doctor:</span>
            <span className="text-sm font-medium">{queueData.doctorName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Specialty:</span>
            <span className="text-sm font-medium">{queueData.specialty}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Room:</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="text-sm font-medium">Room {queueData.roomNumber}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Hospital:</span>
            <span className="text-sm font-medium">{queueData.hospitalName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Joined:</span>
            <span className="text-sm font-medium">{queueData.joinTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant={queueData.status === "waiting" ? "default" : "secondary"}>
              {queueData.status}
            </Badge>
          </div>
        </div>

        <div className="pt-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((queueData.totalInQueue - queueData.position + 1) / queueData.totalInQueue) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {queueData.totalInQueue - queueData.position + 1} of {queueData.totalInQueue} completed
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

