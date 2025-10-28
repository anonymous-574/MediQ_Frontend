export interface QueuePatient {
  id: string
  name: string
  email: string
  phone: string
  appointmentTime: string
  doctorId: string
  doctorName: string
  room: string
  reason: string
  priority: "low" | "normal" | "high" | "urgent"
  status: "scheduled" | "waiting" | "in-progress" | "completed" | "cancelled"
  waitTime: number
  estimatedDuration: number
  checkedInAt?: string
  calledAt?: string
  completedAt?: string
}

export interface QueueDoctor {
  id: string
  name: string
  specialty: string
  room: string
  isAvailable: boolean
  onBreak: boolean
  currentPatient?: string
  queue: QueuePatient[]
}

export interface QueueState {
  doctors: QueueDoctor[]
  patients: QueuePatient[]
  rooms: {
    id: string
    name: string
    status: "available" | "occupied" | "cleaning" | "maintenance"
    currentPatient?: string
    doctorId?: string
  }[]
}

// Mock data for demonstration
const initialQueueState: QueueState = {
  doctors: [
    {
      id: "dr1",
      name: "Dr. Sarah Smith",
      specialty: "General Medicine",
      room: "Room 201",
      isAvailable: true,
      onBreak: false,
      queue: [],
    },
    {
      id: "dr2",
      name: "Dr. Michael Johnson",
      specialty: "Cardiology",
      room: "Room 205",
      isAvailable: true,
      onBreak: false,
      queue: [],
    },
    {
      id: "dr3",
      name: "Dr. Emily Davis",
      specialty: "Dermatology",
      room: "Room 203",
      isAvailable: true,
      onBreak: false,
      queue: [],
    },
  ],
  patients: [
    {
      id: "p1",
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      appointmentTime: "2:00 PM",
      doctorId: "dr1",
      doctorName: "Dr. Sarah Smith",
      room: "Room 201",
      reason: "Follow-up consultation",
      priority: "normal",
      status: "waiting",
      waitTime: 15,
      estimatedDuration: 30,
      checkedInAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "p2",
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1 (555) 234-5678",
      appointmentTime: "2:30 PM",
      doctorId: "dr1",
      doctorName: "Dr. Sarah Smith",
      room: "Room 201",
      reason: "General checkup",
      priority: "urgent",
      status: "waiting",
      waitTime: 5,
      estimatedDuration: 45,
      checkedInAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: "p3",
      name: "Robert Johnson",
      email: "robert.johnson@email.com",
      phone: "+1 (555) 345-6789",
      appointmentTime: "3:00 PM",
      doctorId: "dr2",
      doctorName: "Dr. Michael Johnson",
      room: "Room 205",
      reason: "Blood pressure check",
      priority: "high",
      status: "scheduled",
      waitTime: 0,
      estimatedDuration: 20,
    },
  ],
  rooms: [
    { id: "201", name: "Room 201", status: "occupied", currentPatient: "p1", doctorId: "dr1" },
    { id: "202", name: "Room 202", status: "available" },
    { id: "203", name: "Room 203", status: "cleaning" },
    { id: "204", name: "Room 204", status: "available" },
    { id: "205", name: "Room 205", status: "available", doctorId: "dr2" },
    { id: "206", name: "Room 206", status: "maintenance" },
  ],
}

// In-memory storage (in a real app, this would be a database)
const queueState: QueueState = { ...initialQueueState }

export class QueueManager {
  static getQueueState(): QueueState {
    return { ...queueState }
  }

  static getPatientQueue(doctorId?: string): QueuePatient[] {
    if (doctorId) {
      return queueState.patients.filter((p) => p.doctorId === doctorId && p.status !== "completed")
    }
    return queueState.patients.filter((p) => p.status !== "completed")
  }

  static getDoctorQueue(doctorId: string): QueuePatient[] {
    return queueState.patients
      .filter((p) => p.doctorId === doctorId && p.status !== "completed")
      .sort((a, b) => {
        // Sort by priority first, then by check-in time
        const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 }
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        return new Date(a.checkedInAt || 0).getTime() - new Date(b.checkedInAt || 0).getTime()
      })
  }

  static addPatientToQueue(patient: Omit<QueuePatient, "id" | "waitTime">): QueuePatient {
    const newPatient: QueuePatient = {
      ...patient,
      id: `p${Date.now()}`,
      waitTime: 0,
      checkedInAt: new Date().toISOString(),
    }

    queueState.patients.push(newPatient)
    this.updateWaitTimes()
    return newPatient
  }

  static updatePatientStatus(patientId: string, status: QueuePatient["status"]): boolean {
    const patientIndex = queueState.patients.findIndex((p) => p.id === patientId)
    if (patientIndex === -1) return false

    queueState.patients[patientIndex].status = status

    if (status === "in-progress") {
      queueState.patients[patientIndex].calledAt = new Date().toISOString()
    } else if (status === "completed") {
      queueState.patients[patientIndex].completedAt = new Date().toISOString()
    }

    this.updateWaitTimes()
    return true
  }

  static updatePatientPriority(patientId: string, priority: QueuePatient["priority"]): boolean {
    const patientIndex = queueState.patients.findIndex((p) => p.id === patientId)
    if (patientIndex === -1) return false

    queueState.patients[patientIndex].priority = priority
    this.updateWaitTimes()
    return true
  }

  static movePatientToDoctor(patientId: string, newDoctorId: string): boolean {
    const patientIndex = queueState.patients.findIndex((p) => p.id === patientId)
    const doctor = queueState.doctors.find((d) => d.id === newDoctorId)

    if (patientIndex === -1 || !doctor) return false

    queueState.patients[patientIndex].doctorId = newDoctorId
    queueState.patients[patientIndex].doctorName = doctor.name
    queueState.patients[patientIndex].room = doctor.room

    this.updateWaitTimes()
    return true
  }

  static updateDoctorAvailability(doctorId: string, isAvailable: boolean, onBreak?: boolean): boolean {
    const doctorIndex = queueState.doctors.findIndex((d) => d.id === doctorId)
    if (doctorIndex === -1) return false

    queueState.doctors[doctorIndex].isAvailable = isAvailable
    if (onBreak !== undefined) {
      queueState.doctors[doctorIndex].onBreak = onBreak
    }

    return true
  }

  static updateRoomStatus(
    roomId: string,
    status: "available" | "occupied" | "cleaning" | "maintenance",
    patientId?: string,
  ): boolean {
    const roomIndex = queueState.rooms.findIndex((r) => r.id === roomId)
    if (roomIndex === -1) return false

    queueState.rooms[roomIndex].status = status
    queueState.rooms[roomIndex].currentPatient = patientId

    return true
  }

  static getNextPatient(doctorId: string): QueuePatient | null {
    const queue = this.getDoctorQueue(doctorId)
    return queue.find((p) => p.status === "waiting") || null
  }

  static getQueueStats() {
    const totalPatients = queueState.patients.filter((p) => p.status !== "completed").length
    const waitingPatients = queueState.patients.filter((p) => p.status === "waiting").length
    const inProgressPatients = queueState.patients.filter((p) => p.status === "in-progress").length

    const avgWaitTime =
      waitingPatients > 0
        ? queueState.patients.filter((p) => p.status === "waiting").reduce((sum, p) => sum + p.waitTime, 0) /
          waitingPatients
        : 0

    const availableRooms = queueState.rooms.filter((r) => r.status === "available").length

    return {
      totalPatients,
      waitingPatients,
      inProgressPatients,
      avgWaitTime: Math.round(avgWaitTime),
      availableRooms,
      totalRooms: queueState.rooms.length,
    }
  }

  private static updateWaitTimes(): void {
    const now = new Date()

    queueState.patients.forEach((patient) => {
      if (patient.status === "waiting" && patient.checkedInAt) {
        const checkedIn = new Date(patient.checkedInAt)
        patient.waitTime = Math.floor((now.getTime() - checkedIn.getTime()) / (1000 * 60))
      }
    })
  }
}

// Simulate real-time updates
if (typeof window !== "undefined") {
  setInterval(() => {
    QueueManager["updateWaitTimes"]()
  }, 60000) // Update every minute
}
