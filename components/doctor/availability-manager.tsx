"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Clock, Plus, Loader2, Calendar } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/components/shared/toast"
import type { TimeSlotWithDate, Hospital } from "@/lib/types"

export function AvailabilityManager() {
  const { showToast } = useToast()
  const [isAvailable, setIsAvailable] = useState(true)
  const [breakTime, setBreakTime] = useState(false)
  const [timeSlots, setTimeSlots] = useState<TimeSlotWithDate[]>([])
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // New time slot form
  const [newSlot, setNewSlot] = useState({
    hospital_id: "",
    start_time: "",
    end_time: "",
    date: "",
    slot_type: "consult"
  })

  useEffect(() => {
    fetchAvailability()
    fetchHospitals()
  }, [])

  const fetchAvailability = async () => {
    try {
      setLoading(true)
      const response = await apiService.getDoctorAvailability()
      setTimeSlots(response || [])
    } catch (error) {
      console.error("Failed to fetch availability:", error)
      showToast("Failed to load availability", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchHospitals = async () => {
    try {
      const response = await apiService.getHospitals()
      setHospitals(response || [])
    } catch (error) {
      console.error("Failed to fetch hospitals:", error)
    }
  }

  const handleAvailabilityChange = async (available: boolean) => {
    try {
      setIsAvailable(available)
      // Update availability status in backend
      await apiService.updateAvailability([{
        slot_id: "current_status",
        hospital_id: "current",
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
        is_available: available,
        slot_type: "consult"
      }])
      showToast(`Availability ${available ? 'enabled' : 'disabled'}`, "success")
    } catch (error) {
      console.error("Failed to update availability:", error)
      showToast("Failed to update availability", "error")
      setIsAvailable(!available) // Revert on error
    }
  }

  const handleBreakToggle = async (onBreak: boolean) => {
    try {
      setBreakTime(onBreak)
      showToast(`Break ${onBreak ? 'started' : 'ended'}`, "success")
    } catch (error) {
      console.error("Failed to toggle break:", error)
      showToast("Failed to toggle break", "error")
      setBreakTime(!onBreak) // Revert on error
    }
  }

  const handleAddTimeSlot = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!newSlot.hospital_id || !newSlot.start_time || !newSlot.end_time || !newSlot.date) {
      setError("Please fill in all required fields")
      return
    }

    try {
      const slotData = {
        slot_id: `slot_${Date.now()}`,
        hospital_id: newSlot.hospital_id,
        start_time: `${newSlot.date} ${newSlot.start_time}`,
        end_time: `${newSlot.date} ${newSlot.end_time}`,
        is_available: true,
        slot_type: newSlot.slot_type
      }

      await apiService.updateAvailability([slotData])
      showToast("Time slot added successfully", "success")
      setNewSlot({ hospital_id: "", start_time: "", end_time: "", date: "", slot_type: "consult" })
      fetchAvailability()
    } catch (error) {
      console.error("Failed to add time slot:", error)
      const errorMessage = apiService.handleError(error as any)
      setError(errorMessage || "Failed to add time slot")
      showToast(errorMessage || "Failed to add time slot", "error")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Availability Management
        </CardTitle>
        <CardDescription>Manage your availability status and time slots</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="available">Available for Patients</Label>
              <p className="text-sm text-muted-foreground">Toggle to control patient queue</p>
            </div>
            <Switch id="available" checked={isAvailable} onCheckedChange={handleAvailabilityChange} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="break">On Break</Label>
              <p className="text-sm text-muted-foreground">Pause queue temporarily</p>
            </div>
            <Switch id="break" checked={breakTime} onCheckedChange={handleBreakToggle} />
          </div>
        </div>

        {/* Current Status Display */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Current Status</span>
            <Badge variant={isAvailable && !breakTime ? "default" : "secondary"} className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {isAvailable && !breakTime ? "Available" : breakTime ? "On Break" : "Unavailable"}
            </Badge>
          </div>
        </div>

        {/* Add New Time Slot Form */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Time Slot
          </h4>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAddTimeSlot} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital</Label>
                <Select
                  value={newSlot.hospital_id}
                  onValueChange={(value) => setNewSlot(prev => ({ ...prev, hospital_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map((hospital) => (
                      <SelectItem key={hospital.hospital_id} value={hospital.hospital_id}>
                        {hospital.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={newSlot.start_time}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, start_time: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={newSlot.end_time}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, end_time: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slot_type">Slot Type</Label>
              <Select
                value={newSlot.slot_type}
                onValueChange={(value) => setNewSlot(prev => ({ ...prev, slot_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consult">Consultation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Slot
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Existing Time Slots */}
        {timeSlots.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled Time Slots
            </h4>
            <div className="space-y-2">
              {timeSlots.map((slot) => (
                <div key={slot.slot_id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{slot.doctor_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(slot.start_time).toLocaleDateString()} • {new Date(slot.start_time).toLocaleTimeString()} - {new Date(slot.end_time).toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{slot.hospital_name}</p>
                  </div>
                  <Badge variant={slot.is_available ? "default" : "secondary"}>
                    {slot.is_available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
