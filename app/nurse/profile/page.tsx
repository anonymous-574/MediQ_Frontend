"use client"

import { useEffect, useState } from "react"
import { apiService } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/shared/toast"

export default function NurseProfilePage() {
  const { showToast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await apiService.getNurseProfile()
      setProfile(data)
    } catch (error) {
      console.error("Failed to fetch nurse profile:", error)
      showToast("Failed to load profile", "error")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="text-center mt-10 text-muted-foreground">Loading profile...</p>
  }

  if (!profile) {
    return <p className="text-center mt-10 text-muted-foreground">No profile found</p>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="min-h-screen">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your professional information</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={profile.name || ""} readOnly className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile.email || ""} readOnly className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={profile.phone || ""} readOnly className="mt-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>Your nursing credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nurseId">Nurse ID</Label>
                <Input id="nurseId" value={profile.nurse_id || ""} readOnly className="mt-1" />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" value={profile.department || ""} readOnly className="mt-1" />
              </div>
              <div>
                <Label htmlFor="shift">Shift Timings</Label>
                <Input id="shift" value={profile.shift_timings || ""} readOnly className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Shift Information</CardTitle>
            <CardDescription>Your current shift details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current Shift</p>
                <p className="text-sm text-muted-foreground">{profile.shift_timings || "N/A"}</p>
              </div>
              <Badge>Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
