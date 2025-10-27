"use client"

import { useState } from "react"
import { Navbar } from "@/components/shared/navbar"
import { Button } from "@/components/shared/button"
import { useToast } from "@/components/shared/toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Heart, AlertTriangle, Pill, Save, Edit } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

export default function ProfilePage() {
  const { showToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const user = getCurrentUser()

  const [patientData, setPatientData] = useState({
    personalInfo: {
      name: user?.name || "John Doe",
      email: user?.email || "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1985-06-15",
      gender: "Male",
      address: "123 Main St, City, State 12345",
      emergencyContact: "Jane Doe - +1 (555) 987-6543",
    },
    medicalInfo: {
      bloodType: "O+",
      height: "5'10\"",
      weight: "175 lbs",
      allergies: ["Penicillin", "Shellfish"],
      chronicConditions: ["Hypertension"],
      currentMedications: [
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      ],
    },
    preferences: {
      preferredLanguage: "English",
      communicationMethod: "Email",
      appointmentReminders: true,
      labResultNotifications: true,
    },
  })

  const handleSave = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      showToast("Profile updated successfully", "success")
      setIsEditing(false)
    } catch (error) {
      showToast("Failed to update profile", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
                <p className="text-muted-foreground">Manage your personal and medical information</p>
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

            {/* Personal Information */}
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
                      value={patientData.personalInfo.name}
                      onChange={(e) =>
                        setPatientData((prev) => ({
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
                      value={patientData.personalInfo.email}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={patientData.personalInfo.phone}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={patientData.personalInfo.dateOfBirth}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={patientData.personalInfo.gender}
                      onValueChange={(value) =>
                        setPatientData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, gender: value },
                        }))
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={patientData.personalInfo.address}
                    onChange={(e) =>
                      setPatientData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, address: e.target.value },
                      }))
                    }
                    disabled={!isEditing}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input
                    id="emergency"
                    value={patientData.personalInfo.emergencyContact}
                    onChange={(e) =>
                      setPatientData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, emergencyContact: e.target.value },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-accent" />
                  Medical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Input
                      id="bloodType"
                      value={patientData.medicalInfo.bloodType}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          medicalInfo: { ...prev.medicalInfo, bloodType: e.target.value },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      value={patientData.medicalInfo.height}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          medicalInfo: { ...prev.medicalInfo, height: e.target.value },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={patientData.medicalInfo.weight}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          medicalInfo: { ...prev.medicalInfo, weight: e.target.value },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Allergies</Label>
                  <div className="flex flex-wrap gap-2">
                    {patientData.medicalInfo.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Chronic Conditions</Label>
                  <div className="flex flex-wrap gap-2">
                    {patientData.medicalInfo.chronicConditions.map((condition, index) => (
                      <Badge key={index} variant="secondary">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Current Medications</Label>
                  <div className="space-y-2">
                    {patientData.medicalInfo.currentMedications.map((medication, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
                        <Pill className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium">{medication.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {medication.dosage} - {medication.frequency}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select
                      value={patientData.preferences.preferredLanguage}
                      onValueChange={(value) =>
                        setPatientData((prev) => ({
                          ...prev,
                          preferences: { ...prev.preferences, preferredLanguage: value },
                        }))
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="communication">Communication Method</Label>
                    <Select
                      value={patientData.preferences.communicationMethod}
                      onValueChange={(value) =>
                        setPatientData((prev) => ({
                          ...prev,
                          preferences: { ...prev.preferences, communicationMethod: value },
                        }))
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                        <SelectItem value="Phone">Phone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
