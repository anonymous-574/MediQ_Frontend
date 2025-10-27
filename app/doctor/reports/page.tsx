"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye } from "lucide-react"

const mockReports = [
  {
    id: 1,
    patient: "John Doe",
    type: "Medical Report",
    date: "2025-10-20",
    status: "Completed",
  },
  {
    id: 2,
    patient: "Jane Smith",
    type: "Lab Results",
    date: "2025-10-19",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Bob Johnson",
    type: "Prescription",
    date: "2025-10-18",
    status: "Completed",
  },
]

export default function DoctorReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-2">View and manage patient reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Reports</CardTitle>
          <CardDescription>All reports generated for your patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-start gap-4">
                  <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <h4 className="font-medium">{report.patient}</h4>
                    <p className="text-sm text-muted-foreground">{report.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={report.status === "Completed" ? "default" : "secondary"}>{report.status}</Badge>
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
