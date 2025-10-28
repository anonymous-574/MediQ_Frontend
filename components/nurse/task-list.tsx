"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckSquare, Clock } from "lucide-react"

const tasks = [
  {
    id: "1",
    title: "Prepare Room 203 for next patient",
    priority: "high",
    estimatedTime: "10 min",
    completed: false,
    dueTime: "2:15 PM",
  },
  {
    id: "2",
    title: "Collect lab results for John Doe",
    priority: "urgent",
    estimatedTime: "5 min",
    completed: false,
    dueTime: "2:00 PM",
  },
  {
    id: "3",
    title: "Update patient records for Jane Smith",
    priority: "normal",
    estimatedTime: "15 min",
    completed: false,
    dueTime: "3:00 PM",
  },
  {
    id: "4",
    title: "Restock supplies in Room 201",
    priority: "normal",
    estimatedTime: "20 min",
    completed: true,
    dueTime: "1:30 PM",
  },
  {
    id: "5",
    title: "Schedule follow-up for Bob Wilson",
    priority: "low",
    estimatedTime: "5 min",
    completed: false,
    dueTime: "4:00 PM",
  },
]

export function TaskList() {
  const handleTaskToggle = (taskId: string, completed: boolean) => {
    console.log(`Task ${taskId} marked as ${completed ? "completed" : "pending"}`)
    // In a real app, this would update the task status
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "normal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Task List
        </CardTitle>
        <CardDescription>Your assigned tasks and responsibilities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Pending Tasks ({pendingTasks.length})</h4>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {task.estimatedTime}
                      </div>
                      <span className="text-xs text-muted-foreground">Due: {task.dueTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {completedTasks.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                Completed Today ({completedTasks.length})
              </h4>
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-2 text-sm text-muted-foreground">
                    <Checkbox checked={true} disabled />
                    <span className="line-through">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full bg-transparent">
            View All Tasks
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
