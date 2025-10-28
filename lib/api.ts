import axios, { type AxiosInstance, type AxiosError } from "axios"
import type { ApiResponse, AuthResponse } from "./types" // Declare ApiResponse and AuthResponse

const API_BASE_URL = "http://127.0.0.1:5000/api"

interface ApiErrorResponse {
  message?: string
  error?: string
  detail?: string
}

class ApiService {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Attach token to every request
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        console.log("Sending request with token:", token)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Handle 401 manually
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorResponse>) => {
        if (error.response?.status === 401) {
          console.warn("Unauthorized! Token might be invalid or expired.")
          // Optional: handle logout manually
          // this.clearToken()
          // window.location.href = "/login"
        }
        return Promise.reject(error)
      },
    )
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("access_token")
  }

  private setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token)
    }
  }

  private clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")
    }
  }

  // ==================== Auth Endpoints ====================
  async register(data: { name: string; email: string; password: string; role: string; phone?: string; specialty?: string }) {
    const response = await this.axiosInstance.post("/auth/register", data)
    return response.data
  }

  async login(email: string, password: string) {
    const response = await this.axiosInstance.post<AuthResponse>("/auth/login", { email, password })
    const { access_token, user_id, role, name } = response.data
    this.setToken(access_token)
    localStorage.setItem("user", JSON.stringify({ id: user_id, role, name, email }))
    return response.data
  }

  async logout() {
    this.clearToken()
  }

  // ==================== Patient Endpoints ====================
  async getPatientProfile() {
    const response = await this.axiosInstance.get("/patient/profile")
    return response.data
  }

  async registerPatient(data: { name: string; email: string; phone: string }) {
    const response = await this.axiosInstance.post("/patient/register", data)
    return response.data
  }

  async submitSymptoms(symptoms: string) {
    const response = await this.axiosInstance.post("/patient/submit_symptoms", { symptoms })
    return response.data
  }

  async bookAppointment(data: { doctor_id: string; hospital_id: string; date_time: string }) {
    const response = await this.axiosInstance.post("/patient/book_appointment", data)
    return response.data
  }

  async getPatientAppointments() {
    const response = await this.axiosInstance.get("/patient/appointments")
    return response.data
  }
  async getNurseProfile() {
    const response = await this.axiosInstance.get("/nurse/profile")
    return response.data
  }
  
  async submitQueueReport(data: { hospital_id: string; queue_length: number; wait_time: number; department: string }) {
    const response = await this.axiosInstance.post("/patient/submit_queue_report", data)
    return response.data
  }

  async cancelAppointment(appointmentId: string) {
    const response = await this.axiosInstance.delete(`/patient/appointments/${appointmentId}`)
    return response.data
  }

  // ==================== Doctor Endpoints ====================
  async getDoctorAppointments() {
    const response = await this.axiosInstance.get("/doctor/appointments")
    return response.data
  }

  async updateAppointmentStatus(appointmentId: string, status: string) {
    const response = await this.axiosInstance.put("/doctor/update_status", { appointment_id: appointmentId, status })
    return response.data
  }

  async updateAvailability(timeslots: any[]) {
    const response = await this.axiosInstance.put("/doctor/update_availability", { timeslots })
    return response.data
  }

  async getDoctorPatients() {
    const response = await this.axiosInstance.get("/doctor/patients")
    return response.data
  }

  async deleteSlot(slotId: string) {
    const response = await this.axiosInstance.delete(`/doctor/delete_slot`, {
      data: { slot_id: slotId }
    })
    return response.data
  }
  

  // ==================== Hospital Endpoints ====================
  async updateCongestion(hospitalId: string, congestion: number) {
    const response = await this.axiosInstance.put("/hospital/update_congestion", { hospital_id: hospitalId, congestion })
    return response.data
  }
  
  async getHospitalDoctors(hospitalId: string) {
    const response = await this.axiosInstance.get(`/hospital/get_doctors?hospital_id=${hospitalId}`)
    return response.data
  }

  async predictWaitTime(hospitalId: string, department: string) {
    const response = await this.axiosInstance.get(`/hospital/predict_wait_time?hospital_id=${hospitalId}&department=${department}`)
    return response.data
  }

  async submitHospitalReport(data: { hospital_id: string; submitted_by: string; queue_length: number; wait_time_reported: number; department: string }) {
    const response = await this.axiosInstance.post("/hospital/submit_report", data)
    return response.data
  }

  // ==================== Admin Endpoints ====================
  async getAnalytics() {
    const response = await this.axiosInstance.get("/admin/view_analytics")
    return response.data
  }

  async getAdminStats() {
    const response = await this.axiosInstance.get("/admin/stats")
    return response.data
  }
  async getAllAppointments() {
    const response = await this.axiosInstance.get("/admin/appointments")
    return response.data
  }
  
  async getAllUsers() {
    const response = await this.axiosInstance.get("/admin/users")
    return response.data
  }

  async createUser(userData: any) {
    const response = await this.axiosInstance.post("/admin/users", userData)
    return response.data
  }

  async deleteUser(userId: string) {
    const response = await this.axiosInstance.delete(`/admin/users/${userId}`)
    return response.data
  }

  async approvePatient(patientId: string) {
    const response = await this.axiosInstance.post("/admin/approve_patient", { patient_id: patientId })
    return response.data
  }

  // ==================== Patient Queue Endpoints ====================
  async getPatientQueueStatus() {
    const response = await this.axiosInstance.get("/patient/queue_status")
    return response.data
  }

  // ==================== Doctor Queue Endpoints ====================
  async getDoctorQueue() {
    const response = await this.axiosInstance.get("/doctor/queue")
    return response.data
  }

  async getDoctorAvailableSlots(doctorId: string, date: string) {
    const response = await this.axiosInstance.get(`/hospital/get_available_slots?doctor_id=${doctorId}&date=${date}`)
    return response.data
  }

  async getDoctorAvailability() {
    const response = await this.axiosInstance.get("/doctor/availability")
    return response.data
  }

  // ==================== Nurse Endpoints ====================
  async getNurseQueue() {
    const response = await this.axiosInstance.get("/nurse/queue")
    return response.data
  }

  
  async getNurseRooms() {
    const response = await this.axiosInstance.get("/nurse/rooms")
    return response.data
  }

  async updatePatientStatus(patientId: string, status: string) {
    const response = await this.axiosInstance.put("/nurse/update_patient_status", { patient_id: patientId, status })
    return response.data
  }

  async submitNurseQueueReport(data: { 
    hospital_id: number; 
    queue_length: number; 
    wait_time_reported: number; 
    department: string 
  }) {
    const response = await this.axiosInstance.post("/nurse/submit_queue_report", data)
    return response.data
  }

  async assignRoom(patientId: string, roomId: string) {
    const response = await this.axiosInstance.put("/nurse/assign_room", { patient_id: patientId, room_id: roomId })
    return response.data
  }

  // ==================== Hospital Endpoints ====================
  async getHospitals() {
    const response = await this.axiosInstance.get("/hospital/get_hospitals")
    return response.data
  }

  // ==================== Utility ====================
  handleError(error: AxiosError<ApiErrorResponse>) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message ||
      "An error occurred"
    return message
  }
}

export const apiService = new ApiService()
