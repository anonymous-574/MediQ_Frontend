"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, RefreshCw, Loader2 } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/components/shared/toast"
import type { NurseQueueReport } from "@/lib/types"

export function QueueManager() {
  const { showToast } = useToast()
  const [queueData, setQueueData] = useState<NurseQueueReport[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchQueueData()
  }, [])

  const fetchQueueData = async () => {
    try {
      setLoading(true)
      const response = await apiService.getNurseQueue()
      setQueueData(response) // response should be an array of queue reports
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

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (!queueData || queueData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Queue Management
          </CardTitle>
          <CardDescription>No active queue reports found</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No queue reports available</p>
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
            <CardDescription>Recent queue status reports from nurses</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {queueData.map((report) => (
            <div
              key={report.report_id}
              className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/40 transition"
            >
              <div>
                <p className="font-medium">{report.department}</p>
                <p className="text-sm text-muted-foreground">
                  Queue Length: {report.queue_length} | Avg Wait: {report.wait_time_reported} min
                </p>
                <p className="text-xs text-muted-foreground">
                  Reported by: {report.submitted_by} | {report.timestamp}
                </p>
              </div>

              <Badge variant={report.is_validated ? "default" : "secondary"}>
                {report.is_validated ? "Validated" : "Pending"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
