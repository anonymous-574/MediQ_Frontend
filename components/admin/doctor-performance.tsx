"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

const doctorStats = [
  {
    name: "Dr. Sarah Smith",
    specialty: "General Medicine",
    patientsToday: 18,
    avgRating: 4.8,
    efficiency: 92,
  },
  {
    name: "Dr. Michael Johnson",
    specialty: "Cardiology",
    patientsToday: 12,
    avgRating: 4.6,
    efficiency: 88,
  },
  {
    name: "Dr. Emily Davis",
    specialty: "Dermatology",
    patientsToday: 15,
    avgRating: 4.9,
    efficiency: 95,
  },
]

export function DoctorPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Doctor Performance
        </CardTitle>
        <CardDescription>Today's performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {doctorStats.map((doctor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">{doctor.name}</h4>
                  <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                </div>
                <Badge variant="outline">{doctor.patientsToday} patients</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Efficiency</span>
                  <span>{doctor.efficiency}%</span>
                </div>
                <Progress value={doctor.efficiency} className="h-2" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Rating: {doctor.avgRating}/5.0</span>
                <span>⭐ {doctor.avgRating}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
