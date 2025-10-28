"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Loader2 } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/components/shared/toast"
import type { Hospital, TimeSlotWithDate } from "@/lib/types"

const formatTime = (isoString: string) => {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}


export function AppointmentBooking() {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    hospital: "",
    doctor: "",
    date: "",
    time: "",
    reason: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlotWithDate[]>([])
  const [loadingHospitals, setLoadingHospitals] = useState(false)
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false)

  useEffect(() => {
    fetchHospitals()
  }, [])

  useEffect(() => {
    if (formData.hospital) {
      fetchDoctors(formData.hospital)
    } else {
      setDoctors([])
      setTimeSlots([])
      setFormData(prev => ({ ...prev, doctor: "", time: "" }))
    }
  }, [formData.hospital])

  useEffect(() => {
    if (formData.doctor && formData.date) {
      fetchTimeSlots(formData.doctor, formData.date)
    } else {
      setTimeSlots([])
      setFormData(prev => ({ ...prev, time: "" }))
    }
  }, [formData.doctor, formData.date])

  const fetchHospitals = async () => {
    try {
      setLoadingHospitals(true)
      const response = await apiService.getHospitals()
      setHospitals(response || [])
    } catch (error) {
      console.error("Failed to fetch hospitals:", error)
      showToast("Failed to load hospitals", "error")
    } finally {
      setLoadingHospitals(false)
    }
  }

  const fetchDoctors = async (hospitalId: string) => {
    try {
      setLoadingDoctors(true)
      const response = await apiService.getHospitalDoctors(hospitalId)
      setDoctors(response || [])
    } catch (error) {
      console.error("Failed to fetch doctors:", error)
      showToast("Failed to load doctors", "error")
    } finally {
      setLoadingDoctors(false)
    }
  }

  const fetchTimeSlots = async (doctorId: string, date: string) => {
    try {
      setLoadingTimeSlots(true)
      const response = await apiService.getDoctorAvailableSlots(doctorId, date)
      setTimeSlots(response.available_slots || [])
    } catch (error) {
      console.error("Failed to fetch time slots:", error)
      showToast("Failed to load available time slots", "error")
    } finally {
      setLoadingTimeSlots(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!formData.hospital || !formData.doctor || !formData.date || !formData.time) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    try {
      const selectedTimeSlot = timeSlots.find(slot => slot.slot_id === formData.time)
      if (!selectedTimeSlot) {
        throw new Error("Selected time slot not found")
      }

      const appointmentData = {
        doctor_id: formData.doctor,
        hospital_id: formData.hospital,
        date_time: `${formData.date} ${selectedTimeSlot.start_time}`,
        notes: formData.reason
      }

      await apiService.bookAppointment(appointmentData)
      showToast("Appointment booked successfully!", "success")
      setFormData({ hospital: "", doctor: "", date: "", time: "", reason: "" })
      
      // Close the modal by calling the parent's close function
      if (typeof window !== 'undefined') {
        // Trigger a custom event to close the modal
        window.dispatchEvent(new CustomEvent('appointmentBooked'))
      }
    } catch (error: any) {
      console.error("Booking failed:", error)
      const errorMessage = apiService.handleError(error)
      setError(errorMessage || "Failed to book appointment")
      showToast(errorMessage || "Failed to book appointment", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Book Appointment
        </CardTitle>
        <CardDescription>Schedule your next visit with our healthcare professionals</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="hospital">Select Hospital</Label>
            <Select
              value={formData.hospital}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, hospital: value, doctor: "", time: "" }))}
              disabled={loadingHospitals}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingHospitals ? "Loading hospitals..." : "Choose a hospital"} />
              </SelectTrigger>
              <SelectContent>
                {hospitals.map((hospital) => (
                  <SelectItem key={hospital.hospital_id} value={hospital.hospital_id}>
                    {hospital.name} - {hospital.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">Select Doctor</Label>
            <Select
              value={formData.doctor}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, doctor: value, time: "" }))}
              disabled={loadingDoctors || !formData.hospital}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingDoctors ? "Loading doctors..." : !formData.hospital ? "Select hospital first" : "Choose a doctor"} />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.doctor_id} value={doctor.doctor_id}>
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value, time: "" }))}
                min={new Date().toISOString().split("T")[0]}
                disabled={!formData.doctor}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select
                value={formData.time}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, time: value }))}
                disabled={loadingTimeSlots || !formData.date || !formData.doctor}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    loadingTimeSlots ? "Loading time slots..." : 
                    !formData.date || !formData.doctor ? "Select date and doctor first" : 
                    "Select time"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.slot_id} value={slot.slot_id}>
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Textarea
              id="reason"
              placeholder="Describe your symptoms or reason for the appointment"
              value={formData.reason}
              onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !formData.hospital || !formData.doctor || !formData.date || !formData.time}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              "Book Appointment"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
