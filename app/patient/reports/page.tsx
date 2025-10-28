"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/shared/navbar"
import { useToast } from "@/components/shared/toast"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/shared/button"
import { Modal } from "@/components/shared/modal"
import { FileText, Download, Calendar, User, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MedicalReport } from "@/lib/types"

export default function ReportsPage() {
  const { showToast } = useToast()
  const [reports, setReports] = useState<MedicalReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null)

  useEffect(() => {
    // Simulate fetching reports
    setTimeout(() => {
      setReports([
        {
          id: 1,
          title: "Blood Test Results",
          doctor: "Dr. Sarah Johnson",
          date: "2024-01-12",
          type: "Lab Report",
          status: "completed",
          summary: "Complete blood count and metabolic panel results",
          findings: "All values within normal range. Hemoglobin: 14.2 g/dL",
          recommendations: "Continue current medications. Follow-up in 6 months.",
        },
        {
          id: 2,
          title: "Chest X-Ray Report",
          doctor: "Dr. Michael Chen",
          date: "2024-01-10",
          type: "Imaging",
          status: "completed",
          summary: "Chest X-ray examination for respiratory symptoms",
          findings: "Clear lung fields. No signs of pneumonia.",
          recommendations: "No further imaging required.",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Lab Report":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Imaging":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Consultation":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const filteredReports = reports.filter((report: any) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || report.type === typeFilter
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Medical Reports</h1>
              <p className="text-muted-foreground">View and download your medical reports</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Lab Report">Lab Report</SelectItem>
                  <SelectItem value="Imaging">Imaging</SelectItem>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reports List */}
            {loading ? (
              <LoadingSkeleton />
            ) : filteredReports.length > 0 ? (
              <div className="grid gap-4">
                {filteredReports.map((report: any) => (
                  <Card
                    key={report.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <User className="h-4 w-4" />
                            {report.doctor}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getTypeColor(report.type)}>{report.type}</Badge>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.summary}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No reports found</h3>
                  <p className="text-muted-foreground text-center">
                    {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "You don't have any medical reports yet"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Report Details Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Report Details"
        actions={
          <div className="flex gap-2 w-full">
            {(selectedReport as any)?.status === "completed" && (
              <Button className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            )}
            <Button variant="outline" onClick={() => setSelectedReport(null)} className="flex-1">
              Close
            </Button>
          </div>
        }
      >
        {selectedReport && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Doctor</p>
              <p className="font-medium">{(selectedReport as any).doctor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{new Date((selectedReport as any).date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Summary</p>
              <p className="font-medium">{(selectedReport as any).summary}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Findings</p>
              <p className="font-medium">{(selectedReport as any).findings}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recommendations</p>
              <p className="font-medium">{(selectedReport as any).recommendations}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
