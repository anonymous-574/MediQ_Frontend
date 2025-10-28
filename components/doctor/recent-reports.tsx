"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Edit, Send } from "lucide-react"

const pendingReports = [
  {
    id: "1",
    patient: "John Doe",
    type: "Blood Test",
    date: "2024-12-10",
    status: "pending",
    priority: "high",
  },
  {
    id: "2",
    patient: "Jane Smith",
    type: "X-Ray",
    date: "2024-12-09",
    status: "draft",
    priority: "medium",
  },
  {
    id: "3",
    patient: "Robert Johnson",
    type: "Consultation",
    date: "2024-12-08",
    status: "pending",
    priority: "low",
  },
]

export function RecentReports() {
  const handleEditReport = (reportId: string) => {
    console.log("Editing report:", reportId)
    // In a real app, this would open the report editor
  }

  const handleSendReport = (reportId: string) => {
    console.log("Sending report:", reportId)
    // In a real app, this would send the report to the patient
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Pending Reports
        </CardTitle>
        <CardDescription>Reports awaiting your review</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">{report.patient}</h4>
                  <Badge className={getPriorityColor(report.priority)}>{report.priority}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {report.type} • {new Date(report.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditReport(report.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleSendReport(report.id)}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full bg-transparent">
            View All Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
