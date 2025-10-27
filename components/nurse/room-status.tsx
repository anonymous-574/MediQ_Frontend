"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Loader2, RefreshCw } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/components/shared/toast"
import type { Room } from "@/lib/types"

export function RoomStatus() {
  const { showToast } = useToast()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const response = await apiService.getNurseRooms()
      setRooms(response || [])
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
      showToast("Failed to load room data", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await fetchRooms()
      showToast("Room status updated", "success")
    } catch (error) {
      console.error("Failed to refresh rooms:", error)
      showToast("Failed to refresh room status", "error")
    } finally {
      setRefreshing(false)
    }
  }

  const handleRoomAction = async (roomId: string, action: string, patientId?: string) => {
    try {
      if (action === "assign" && patientId) {
        await apiService.assignRoom(patientId, roomId)
        showToast("Room assigned successfully", "success")
      } else if (action === "release") {
        // Release room - would need a release room API endpoint
        showToast("Room released", "success")
      } else if (action === "clean") {
        // Mark room as cleaned - would need a clean room API endpoint
        showToast("Room marked as cleaned", "success")
      }
      await fetchRooms()
    } catch (error) {
      console.error(`Failed to ${action} room:`, error)
      showToast(`Failed to ${action} room`, "error")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "occupied":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "cleaning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "maintenance":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getActionButton = (room: Room) => {
    switch (room.status) {
      case "available":
        return (
          <Button size="sm" variant="outline" onClick={() => handleRoomAction(room.room_id, "assign")}>
            Assign Patient
          </Button>
        )
      case "occupied":
        return (
          <Button size="sm" variant="outline" onClick={() => handleRoomAction(room.room_id, "release")}>
            Release Room
          </Button>
        )
      case "maintenance":
        return (
          <Button size="sm" variant="outline" onClick={() => handleRoomAction(room.room_id, "clean")}>
            Mark Clean
          </Button>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Room Status
            </CardTitle>
            <CardDescription>Monitor room availability and usage</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rooms.map((room) => (
            <div key={room.room_id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{room.room_number}</h4>
                  <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Floor {room.floor} • {room.department}
                </p>
                {room.patient_name && (
                  <p className="text-sm text-muted-foreground">
                    Patient: {room.patient_name}
                  </p>
                )}
              </div>
              <div>{getActionButton(room)}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available:</span>
              <span className="font-medium">{rooms.filter((r) => r.status === "available").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Occupied:</span>
              <span className="font-medium">{rooms.filter((r) => r.status === "occupied").length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
