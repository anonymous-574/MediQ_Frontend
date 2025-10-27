"use client"

import { useEffect, useState } from "react"
import { requireAuth } from "@/lib/auth"
import { useToast } from "@/components/shared/toast"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Clock, DollarSign, AlertCircle, TrendingUp } from "lucide-react"
import { apiService } from "@/lib/api"
import type { User } from "@/lib/types"

export default function AdminDashboard() {
  const { showToast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    avgWaitTime: 0,
    monthlyRevenue: 0,
  })

  useEffect(() => {
    const currentUser = requireAuth(["admin"])
    setUser(currentUser)

    if (currentUser) {
      fetchStats()
    }
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await apiService.getAdminStats()
      setStats(response || {})
    } catch (err) {
      const errorMsg = apiService.handleError(err as any)
      showToast(errorMsg, "error")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Hospital management and analytics overview</p>
            </div>

            {/* Key Metrics */}
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPatients}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">+12%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
                    <Calendar className="h-4 w-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.appointmentsToday}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">+8%</span> from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-accent/5 to-accent/10 border-accent/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
                    <Clock className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.avgWaitTime} min</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3 text-red-600" />
                      <span className="text-red-600">+2 min</span> from last week
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-chart-2/5 to-chart-2/10 border-chart-2/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue (Month)</CardTitle>
                    <DollarSign className="h-4 w-4 text-chart-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.monthlyRevenue}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">+15%</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">Manage Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Add, edit, or remove system users</p>
                  <a href="/admin/users" className="text-primary font-medium hover:underline">
                    Go to Users →
                  </a>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">View Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Monitor all hospital appointments</p>
                  <a href="/admin/appointments" className="text-primary font-medium hover:underline">
                    Go to Appointments →
                  </a>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Configure hospital settings</p>
                  <a href="/admin/settings" className="text-primary font-medium hover:underline">
                    Go to Settings →
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="font-medium">Database</span>
                    <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="font-medium">API Server</span>
                    <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="font-medium">Authentication</span>
                    <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Operational
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
