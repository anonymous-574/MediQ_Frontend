"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock } from "lucide-react"

const mockTasks = [
  { id: 1, title: "Check vitals for Room 101", priority: "High", status: "Pending", dueTime: "09:30" },
  { id: 2, title: "Prepare Room 104 for next patient", priority: "Medium", status: "Pending", dueTime: "09:45" },
  { id: 3, title: "Collect lab samples from Room 102", priority: "High", status: "In Progress", dueTime: "09:15" },
  { id: 4, title: "Update patient charts", priority: "Low", status: "Completed", dueTime: "09:00" },
]

export default function NurseTasksPage() {
  const pendingTasks = mockTasks.filter((t) => t.status === "Pending").length
  const completedTasks = mockTasks.filter((t) => t.status === "Completed").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-muted-foreground mt-2">Manage your daily nursing tasks</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
          <CardDescription>Your tasks for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                <Checkbox className="mt-1" defaultChecked={task.status === "Completed"} />
                <div className="flex-1">
                  <p
                    className={`font-medium ${task.status === "Completed" ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Due: {task.dueTime}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "secondary"
                    }
                  >
                    {task.priority}
                  </Badge>
                  <Badge variant={task.status === "Completed" ? "secondary" : "outline"}>{task.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
