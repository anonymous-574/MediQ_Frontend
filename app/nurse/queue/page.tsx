"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, RefreshCw, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/components/shared/toast"
import { QueueManager } from "@/components/nurse/queue-manager"
import { QueueReportDialog } from "@/components/nurse/queue-report-dialog"
import type { NurseQueueReport, DoctorQueue } from "@/lib/types"

export default function NurseQueuePage() {
  const { showToast } = useToast()
  const [queueReports, setQueueReports] = useState<NurseQueueReport[]>([])
  const [patientQueue, setPatientQueue] = useState<DoctorQueue | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchQueueData()
  }, [])

  const fetchQueueData = async () => {
    try {
      setLoading(true)
      const [reportsResponse, queueResponse] = await Promise.all([
        apiService.getNurseQueue(),
        apiService.getNurseQueue()
      ])
      
      // Handle queue reports (from backend /nurse/queue endpoint)
      if (Array.isArray(reportsResponse)) {
        setQueueReports(reportsResponse)
      }
      
      // Handle patient queue data
      if (queueResponse && queueResponse.patients) {
        setPatientQueue(queueResponse)
      }
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

  const handleReportSubmitted = () => {
    fetchQueueData()
  }

  const getValidationBadge = (isValidated: boolean) => {
    if (isValidated) {
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Validated
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Pending
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Queue Management</h1>
            <p className="text-muted-foreground mt-2">Manage hospital patient queues and reports</p>
          </div>
          <div className="flex items-center gap-3">
            <QueueReportDialog onReportSubmitted={handleReportSubmitted} />
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Queue Reports Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Queue Reports
            </CardTitle>
            <CardDescription>Recent queue reports from all departments</CardDescription>
          </CardHeader>
          <CardContent>
            {queueReports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No queue reports available</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Queue Length</TableHead>
                    <TableHead>Wait Time</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queueReports.map((report) => (
                    <TableRow key={report.report_id}>
                      <TableCell className="font-medium">{report.department}</TableCell>
                      <TableCell>{report.queue_length}</TableCell>
                      <TableCell>{report.wait_time_reported} min</TableCell>
                      <TableCell>{report.submitted_by}</TableCell>
                      <TableCell>{getValidationBadge(report.is_validated)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(report.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Patient Queue Management */}
        <QueueManager />
      </div>
    </div>
  )
}
