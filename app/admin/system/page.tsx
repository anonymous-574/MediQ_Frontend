"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"

const systemStatus = [
  { name: "Database", status: "Operational", lastCheck: "2 min ago" },
  { name: "API Server", status: "Operational", lastCheck: "1 min ago" },
  { name: "Queue System", status: "Operational", lastCheck: "3 min ago" },
  { name: "Backup Service", status: "Warning", lastCheck: "5 min ago" },
]

const alerts = [
  { id: 1, severity: "Warning", message: "High CPU usage detected on server 2", time: "10 min ago" },
  { id: 2, severity: "Info", message: "Scheduled maintenance completed", time: "1 hour ago" },
  { id: 3, severity: "Error", message: "Failed backup attempt", time: "2 hours ago" },
]

export default function AdminSystemPage() {
  return (
    <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
        <p className="text-muted-foreground mt-2">Monitor system health and alerts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Components</CardTitle>
          <CardDescription>Status of all system services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemStatus.map((component) => (
              <div key={component.name} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <h4 className="font-medium">{component.name}</h4>
                  <p className="text-sm text-muted-foreground">Last check: {component.lastCheck}</p>
                </div>
                <Badge variant={component.status === "Operational" ? "default" : "destructive"}>
                  {component.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>Recent system alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 border-b pb-4 last:border-0">
                {alert.severity === "Error" ? (
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                ) : alert.severity === "Warning" ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm text-muted-foreground">{alert.time}</p>
                </div>
                <Badge
                  variant={
                    alert.severity === "Error" ? "destructive" : alert.severity === "Warning" ? "secondary" : "outline"
                  }
                >
                  {alert.severity}
                </Badge>
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
