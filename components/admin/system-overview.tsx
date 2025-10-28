"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Server, Database, Wifi, HardDrive } from "lucide-react"

const systemMetrics = [
  {
    name: "Server CPU",
    value: 68,
    status: "normal",
    icon: Server,
  },
  {
    name: "Database",
    value: 45,
    status: "normal",
    icon: Database,
  },
  {
    name: "Network",
    value: 23,
    status: "good",
    icon: Wifi,
  },
  {
    name: "Storage",
    value: 82,
    status: "warning",
    icon: HardDrive,
  },
]

export function SystemOverview() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "normal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Overview</CardTitle>
        <CardDescription>Real-time system performance and health metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemMetrics.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <Badge className={getStatusColor(metric.status)}>{metric.status}</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Usage</span>
                  <span>{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Uptime:</span>
              <span className="font-medium">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Backup:</span>
              <span className="font-medium">3 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Users:</span>
              <span className="font-medium">247</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
