"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"

const mockRooms = [
  { id: 1, name: "Room 101", status: "Occupied", patient: "Samarth Dave", doctor: "Dr. Tisha parmar", timeUsed: "15 min" },
  { id: 2, name: "Room 102", status: "Available", patient: "null", doctor: "null", timeUsed: "null" },
  
]

export default function NurseRoomsPage() {
  const occupiedRooms = mockRooms.filter((r) => r.status === "Occupied").length
  const availableRooms = mockRooms.filter((r) => r.status === "Available").length

  return (
    <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Room Status</h1>
        <p className="text-muted-foreground mt-2">Monitor consultation room availability</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRooms.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupiedRooms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableRooms}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockRooms.map((room) => (
          <Card key={room.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {room.name}
                  </h3>
                  {room.status === "Occupied" && (
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p>Patient: {room.patient}</p>
                      <p>Doctor: {room.doctor}</p>
                      <p className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {room.timeUsed}
                      </p>
                    </div>
                  )}
                </div>
                <Badge
                  variant={
                    room.status === "Occupied" ? "default" : room.status === "Available" ? "secondary" : "outline"
                  }
                >
                  {room.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
        </div>
        </div>

    
  )
}
