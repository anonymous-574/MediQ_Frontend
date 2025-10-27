"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-2">Configure hospital system settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hospital Information</CardTitle>
          <CardDescription>Basic hospital details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hospital-name">Hospital Name</Label>
            <Input id="hospital-name" defaultValue="City General Hospital" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="hospital-email">Hospital Email</Label>
            <Input id="hospital-email" type="email" defaultValue="info@hospital.com" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="hospital-phone">Hospital Phone</Label>
            <Input id="hospital-phone" defaultValue="+1-555-0000" className="mt-1" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Configure system behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Appointment Booking</Label>
              <p className="text-sm text-muted-foreground">Allow patients to book appointments</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Queue Reporting</Label>
              <p className="text-sm text-muted-foreground">Allow patients to report queue status</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Symptom Analysis</Label>
              <p className="text-sm text-muted-foreground">Enable AI symptom analysis</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure system notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send email alerts</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Send SMS alerts</p>
            </div>
            <Switch />
          </div>
          <Button>Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  )
}
