"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/components/shared/toast"

interface QueueReportDialogProps {
  onReportSubmitted?: () => void
}

export function QueueReportDialog({ onReportSubmitted }: QueueReportDialogProps) {
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    hospital_id: "",
    department: "",
    queue_length: "",
    wait_time_reported: ""
  })

  const departments = [
    "Emergency",
    "Cardiology", 
    "General Medicine",
    "Pediatrics",
    "Orthopedics",
    "Neurology",
    "Oncology",
    "Radiology"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.hospital_id || !formData.department || !formData.queue_length || !formData.wait_time_reported) {
      showToast("Please fill in all fields", "error")
      return
    }

    try {
      setLoading(true)
      await apiService.submitNurseQueueReport({
        hospital_id: parseInt(formData.hospital_id),
        department: formData.department,
        queue_length: parseInt(formData.queue_length),
        wait_time_reported: parseInt(formData.wait_time_reported)
      })
      
      showToast("Queue report submitted successfully", "success")
      setOpen(false)
      setFormData({
        hospital_id: "",
        department: "",
        queue_length: "",
        wait_time_reported: ""
      })
      onReportSubmitted?.()
    } catch (error) {
      console.error("Failed to submit queue report:", error)
      showToast("Failed to submit queue report", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Submit Queue Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Queue Report</DialogTitle>
          <DialogDescription>
            Update queue information for a specific department
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hospital_id">Hospital ID</Label>
            <Input
              id="hospital_id"
              type="number"
              placeholder="Enter hospital ID"
              value={formData.hospital_id}
              onChange={(e) => handleInputChange("hospital_id", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="queue_length">Queue Length</Label>
            <Input
              id="queue_length"
              type="number"
              placeholder="Number of patients in queue"
              value={formData.queue_length}
              onChange={(e) => handleInputChange("queue_length", e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wait_time">Wait Time (minutes)</Label>
            <Input
              id="wait_time"
              type="number"
              placeholder="Average wait time in minutes"
              value={formData.wait_time_reported}
              onChange={(e) => handleInputChange("wait_time_reported", e.target.value)}
              min="0"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
