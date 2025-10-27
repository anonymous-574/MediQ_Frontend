"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/shared/navbar"
import { useToast } from "@/components/shared/toast"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/shared/button"
import { Modal } from "@/components/shared/modal"
import { Input } from "@/components/ui/input"
import { Search, Phone, Mail, Calendar, AlertCircle, User } from "lucide-react"
import { apiService } from "@/lib/api"
import type { Patient } from "@/lib/types"

export default function DoctorPatientsPage() {
  const { showToast } = useToast()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await apiService.getDoctorPatients()
      setPatients(response || [])
      setError("")
    } catch (err) {
      const errorMsg = apiService.handleError(err as any)
      setError(errorMsg)
      showToast(errorMsg, "error")
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      (patient.patient_name || patient.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Patients</h1>
              <p className="text-muted-foreground">Manage and view your patient list</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Search */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Search Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Patients List */}
            {loading ? (
              <LoadingSkeleton />
            ) : filteredPatients.length > 0 ? (
              <div className="grid gap-4">
                {filteredPatients.map((patient) => (
                  <Card
                    key={patient.patient_id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{patient.patient_name}</h3>
                          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {patient.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {patient.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Last visit: {patient.last_visit ? new Date(patient.last_visit).toLocaleDateString() : "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                            {patient.status}
                          </Badge>
                          <div className="text-sm font-medium">{patient.total_appointments} appointments</div>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <User className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No patients found</h3>
                  <p className="text-muted-foreground text-center">
                    {searchTerm ? "Try adjusting your search criteria" : "You don't have any patients yet"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Patient Details Modal */}
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title="Patient Details"
        actions={
          <Button onClick={() => setSelectedPatient(null)} className="w-full">
            Close
          </Button>
        }
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Patient Name</p>
              <p className="font-medium">{selectedPatient.patient_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{selectedPatient.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{selectedPatient.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={selectedPatient.status === "Active" ? "default" : "secondary"}>
                {selectedPatient.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Appointments</p>
              <p className="font-medium">{selectedPatient.total_appointments}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Visit</p>
              <p className="font-medium">{selectedPatient.last_visit ? new Date(selectedPatient.last_visit).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
