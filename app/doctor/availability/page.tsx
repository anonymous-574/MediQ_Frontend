"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/shared/button"
import { useToast } from "@/components/shared/toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Plus, Trash2, AlertCircle, Loader2 } from "lucide-react"
import { apiService } from "@/lib/api"

export default function AvailabilityPage() {
  const { showToast } = useToast()

  const [timeslots, setTimeslots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [newSlot, setNewSlot] = useState({
    date: "",
    start_time: "09:00",
    end_time: "09:30",
  })

  // ✅ Fetch existing availability from backend
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const data = await apiService.getDoctorAvailability()
        const formatted = data.map((s: any) => ({
          slot_id: s.slot_id,
          date: s.start_time?.split("T")[0],
          start_time: s.start_time?.split("T")[1]?.slice(0, 5),
          end_time: s.end_time?.split("T")[1]?.slice(0, 5),
        }))
        setTimeslots(formatted)
      } catch (err) {
        const msg = apiService.handleError(err as any)
        showToast(msg, "error")
      } finally {
        setLoading(false)
      }
    }
    fetchAvailability()
  }, [])

  // ✅ Add new slot locally
  const handleAddSlot = () => {
    if (!newSlot.date) {
      showToast("Please select a date", "error")
      return
    }

    const slot = {
      slot_id: `TS-${Date.now()}`,
      ...newSlot,
    }

    setTimeslots([...timeslots, slot])
    setNewSlot({ date: "", start_time: "09:00", end_time: "09:30" })
    showToast("Time slot added", "success")
  }

  // ✅ Delete slot (backend + local)
  const handleRemoveSlot = async (slotId: string) => {
    try {
      await apiService.deleteSlot(slotId)
      setTimeslots(timeslots.filter((s) => s.slot_id !== slotId))
      showToast("Slot deleted successfully", "success")
    } catch (err) {
      const msg = apiService.handleError(err as any)
      showToast(msg, "error")
    }
  }

  // ✅ Save all slots to backend
  const handleSave = async () => {
    try {
      setSaving(true)
      await apiService.updateAvailability(timeslots)
      showToast("Availability updated successfully", "success")
    } catch (err) {
      const msg = apiService.handleError(err as any)
      showToast(msg, "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin mr-2" /> Loading availability...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Availability</h1>
          <p className="text-muted-foreground">Set your available time slots for appointments</p>
        </div>

        {/* Add Slot */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Add New Time Slot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start">Start Time</Label>
                <Input
                  id="start"
                  type="time"
                  value={newSlot.start_time}
                  onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End Time</Label>
                <Input
                  id="end"
                  type="time"
                  value={newSlot.end_time}
                  onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleAddSlot} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Time Slot
            </Button>
          </CardContent>
        </Card>

        {/* Existing Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary" /> Your Available Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeslots.length > 0 ? (
              <div className="space-y-3">
                {timeslots.map((slot) => (
                  <div
                    key={slot.slot_id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{slot.date}</div>
                      <div className="text-sm text-muted-foreground">
                        {slot.start_time} - {slot.end_time}
                      </div>
                    </div>
                    <Badge variant="secondary" className="mr-4">
                      {slot.slot_id}
                    </Badge>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveSlot(slot.slot_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No time slots added yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex gap-3">
          <Button onClick={handleSave} isLoading={saving} className="flex-1">
            Save Availability
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
