"use client"

import { useState } from "react"
import { Button } from "@/components/shared/button"
import { useToast } from "@/components/shared/toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Plus, Trash2, AlertCircle } from "lucide-react"
import { apiService } from "@/lib/api"

export default function AvailabilityPage() {
  const { showToast } = useToast()
  const [timeslots, setTimeslots] = useState<any[]>([])
  const [newSlot, setNewSlot] = useState({ date: "", start_time: "09:00", end_time: "09:30" })
  const [loading, setLoading] = useState(false)

  const handleAddSlot = () => {
    if (!newSlot.date) return showToast("Please fill in all fields", "error")
    const slot = { slot_id: `TS-${Date.now()}`, ...newSlot }
    setTimeslots([...timeslots, slot])
    setNewSlot({ date: "", start_time: "09:00", end_time: "09:30" })
    showToast("Slot added locally", "info")
  }

  const handleRemoveSlot = async (slotId: string) => {
    try {
      await apiService.deleteSlot(slotId)
      setTimeslots(timeslots.filter((s) => s.slot_id !== slotId))
      showToast("Slot deleted successfully", "success")
    } catch (err) {
      showToast(apiService.handleError(err), "error")
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      await apiService.updateAvailability(timeslots)
      showToast("Availability updated successfully", "success")
    } catch (err) {
      showToast(apiService.handleError(err), "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Availability</h1>
          <p className="text-muted-foreground">Set available time slots for patients.</p>
        </div>

        {/* Add New Slot */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Add New Slot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Date</Label>
                <Input type="date" value={newSlot.date} onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })} />
              </div>
              <div>
                <Label>Start</Label>
                <Input type="time" value={newSlot.start_time} onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })} />
              </div>
              <div>
                <Label>End</Label>
                <Input type="time" value={newSlot.end_time} onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })} />
              </div>
            </div>
            <Button onClick={handleAddSlot} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Slot
            </Button>
          </CardContent>
        </Card>

        {/* Current Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary" /> Current Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeslots.length > 0 ? (
              timeslots.map((slot) => (
                <div key={slot.slot_id} className="flex justify-between items-center p-4 border rounded-md mb-2">
                  <div>
                    <p className="font-medium">{slot.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {slot.start_time} - {slot.end_time}
                    </p>
                  </div>
                  <Badge variant="secondary" className="mr-4">{slot.slot_id}</Badge>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveSlot(slot.slot_id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p>No time slots yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleSave} isLoading={loading} className="flex-1">
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
