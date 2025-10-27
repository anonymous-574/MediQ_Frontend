"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye } from "lucide-react"

const reports = [
  {
    id: "1",
    title: "Blood Test Results",
    date: "2024-12-01",
    doctor: "Dr. Sarah Smith",
    status: "new",
    type: "Lab Report",
  },
  {
    id: "2",
    title: "X-Ray Report",
    date: "2024-11-28",
    doctor: "Dr. Michael Johnson",
    status: "viewed",
    type: "Imaging",
  },
  {
    id: "3",
    title: "General Checkup",
    date: "2024-11-25",
    doctor: "Dr. Sarah Smith",
    status: "viewed",
    type: "Consultation",
  },
  {
    id: "4",
    title: "Prescription",
    date: "2024-11-20",
    doctor: "Dr. Emily Davis",
    status: "viewed",
    type: "Prescription",
  },
]

export function RecentReports() {
  const handleViewReport = (reportId: string) => {
    console.log("Viewing report:", reportId)
    // In a real app, this would open the report
  }

  const handleDownloadReport = (reportId: string) => {
    console.log("Downloading report:", reportId)
    // In a real app, this would download the report
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Reports
        </CardTitle>
        <CardDescription>Your latest medical reports and documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">{report.title}</h4>
                  {report.status === "new" && (
                    <Badge variant="default" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {report.doctor} • {new Date(report.date).toLocaleDateString()} • {report.type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleViewReport(report.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDownloadReport(report.id)}>
                  <Download className="h-4 w-4" />
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
