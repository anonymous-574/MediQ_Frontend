"use client"

import { useState } from "react"
import { Button } from "@/components/shared/button"
import { useToast } from "@/components/shared/toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Stethoscope, FileText, Calendar, Save, Edit } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

export default function DoctorProfilePage() {
  const { showToast } = useToast()
  const user = getCurrentUser()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [doctorData, setDoctorData] = useState({
    personalInfo: {
      name: user?.name || "Dr. John Smith",
      email: user?.email || "john@hospital.com",
      phone: "+1 (555) 0100",
      address: "123 Medical Ave, City, State 12345",
    },
    professionalInfo: {
      specialty: "Cardiology",
      qualification: "MD, PhD",
      experience: 10,
      licenseNumber: "MD-12345",
      bio: "Experienced cardiologist specializing in preventive care and interventional cardiology.",
    },
    availability: {
      status: "Available",
      nextAvailableDate: "2025-10-28",
      hospital: "City General Hospital",
    },
  })

  const handleSave = async () => {
    try {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      showToast("Profile updated successfully", "success")
      setIsEditing(false)
    } catch (err) {
      showToast("Failed to update profile", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground">Manage your personal and professional details</p>
            </div>
            <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              isLoading={loading}
              className="flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          {/* Personal Info */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={doctorData.personalInfo.name}
                    onChange={(e) =>
                      setDoctorData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, name: e.target.value },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={doctorData.personalInfo.email}
                    onChange={(e) =>
                      setDoctorData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={doctorData.personalInfo.phone}
                    onChange={(e) =>
                      setDoctorData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={doctorData.personalInfo.address}
                    onChange={(e) =>
                      setDoctorData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, address: e.target.value },
                      }))
                    }
                    disabled={!isEditing}
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Info */}
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-accent" />
                Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    value={doctorData.professionalInfo.specialty}
                    onChange={(e) =>
                      setDoctorData((prev) => ({
                        ...prev,
                        professionalInfo: { ...prev.professionalInfo, specialty: e.target.value },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={doctorData.professionalInfo.qualification}
                    onChange={(e) =>
                      setDoctorData((prev) => ({
                        ...prev,
                        professionalInfo: { ...prev.professionalInfo, qualification: e.target.value },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={doctorData.professionalInfo.experience}
                    onChange={(e) =>
                      setDoctorData((prev) => ({
                        ...prev,
                        professionalInfo: { ...prev.professionalInfo, experience: e.target.value },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">License Number</Label>
                  <Input
                    id="license"
                    value={doctorData.professionalInfo.licenseNumber}
                    onChange={(e) =>
                      setDoctorData((prev) => ({
                        ...prev,
                        professionalInfo: { ...prev.professionalInfo, licenseNumber: e.target.value },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={doctorData.professionalInfo.bio}
                  onChange={(e) =>
                    setDoctorData((prev) => ({
                      ...prev,
                      professionalInfo: { ...prev.professionalInfo, bio: e.target.value },
                    }))
                  }
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Availability Info */}
          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-secondary" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Status</p>
                  <p className="text-sm text-muted-foreground">Your active availability for patients</p>
                </div>
                <Badge variant={doctorData.availability.status === "Available" ? "default" : "secondary"}>
                  {doctorData.availability.status}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nextAvailableDate">Next Available Date</Label>
                  <Input
                    id="nextAvailableDate"
                    type="date"
                    value={doctorData.availability.nextAvailableDate}
                    onChange={(e) =>
                      setDoctorData((prev) => ({
                        ...prev,
                        availability: { ...prev.availability, nextAvailableDate: e.target.value },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital</Label>
                  <Input
                    id="hospital"
                    value={doctorData.availability.hospital}
                    onChange={(e) =>
                      setDoctorData((prev) => ({
                        ...prev,
                        availability: { ...prev.availability, hospital: e.target.value },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <Button variant="outline">Manage Schedule</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
