export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

export interface User {
  id: number
  user_id?: string
  name: string
  email: string
  role: "patient" | "doctor" | "admin" | "nurse"
  status?: string
}

export interface Patient extends User {
  patient_id: string
  patient_name?: string
  date_of_birth?: string
  medical_history?: string
  phone?: string
  address?: string
  last_visit?: string
  status?: string
  total_appointments?: number
}

export interface Doctor extends User {
  doctor_id?: string
  specialty?: string
  is_available?: boolean
  hospital_id?: number
  hospital_name?: string
}

export interface Admin extends User {
  admin_id?: string
}

export interface Hospital {
  id: number
  hospital_id?: string
  name: string
  location?: string
  congestion: number
  department?: string
}

export interface Appointment {
  appointment_id: string
  patient_id: number
  doctor_id: number
  hospital_id: number
  date_time: string
  status: "Scheduled" | "Completed" | "Cancelled" | "Pending"
  notes?: string
  doctor_name?: string
  hospital_name?: string
  patient_name?: string
}

export interface TimeSlot {
  slot_id: string
  hospital_id: number
  start_time: string
  end_time: string
  is_available: boolean
}

export interface SymptomReport {
  report_id: string
  urgency: string
  classification: string
  recommendation: string[]
}

export interface QueueReport {
  report_id: string
  hospital_id: number
  queue_length: number
  wait_time: number
  department: string
  submitted_by?: string
}

export interface Analytics {
  hospital_id: string
  name: string
  appointment_count: number
  congestion: number
  average_wait_time?: number
}

export interface AuthResponse {
  access_token: string
  user_id: number
  role: string
  name?: string
  email?: string
}

export interface QueueStats {
  totalPatients: number
  waitingPatients: number
  avgWaitTime: number
  inProgressPatients: number
  availableRooms: number
  totalRooms: number
}

export interface MedicalReport {
  id: number
  title: string
  doctor: string
  date: string
  type: string
  status: string
  summary: string
  findings: string
  recommendations: string
}

export interface QueuePosition {
  position: number
  totalInQueue: number
  estimatedWait: number
  doctorName: string
  specialty: string
  roomNumber: number
  joinTime: string
  status: string
  hospitalName: string
}

export interface DoctorQueue {
  patients: Array<{
    patient_id: string
    name: string
    age: number
    appointment_time: string
    reason: string
    status: string
    wait_time: number
    phone: string
  }>
  currentPatient?: string
  totalInQueue: number
}

export interface Room {
  room_id: string
  room_number: string
  status: "available" | "occupied" | "maintenance"
  patient_id?: string
  patient_name?: string
  department: string
  floor: number
}

export interface TimeSlotWithDate extends TimeSlot {
  date: string
  doctor_name: string
  hospital_name: string
}

export interface Hospital {
  hospital_id: string
  name: string
  location: string
  departments: string[]
  congestion: number
}

export interface UserManagement {
  users: Array<{
    user_id: string
    name: string
    email: string
    role: string
    status: string
    created_at: string
  }>
  total: number
  page: number
  limit: number
}
