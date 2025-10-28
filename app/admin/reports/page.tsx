"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye } from "lucide-react"

const mockReports = [
  { id: 1, title: "Monthly Performance Report", date: "2025-10-20", type: "Performance", status: "Generated" },
  { id: 2, title: "Queue Analysis Report", date: "2025-10-19", type: "Analytics", status: "Generated" },
  { id: 3, title: "Patient Satisfaction Survey", date: "2025-10-18", type: "Survey", status: "Pending" },
]

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-2">View and generate system reports</p>
        </div>
        <Button>Generate New Report</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>All generated and pending reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-start gap-4">
                  <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{report.type}</Badge>
                  <Badge variant={report.status === "Generated" ? "default" : "secondary"}>{report.status}</Badge>
                  {report.status === "Generated" && (
                    <>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
        </div>
        </div>
    
  )
}
