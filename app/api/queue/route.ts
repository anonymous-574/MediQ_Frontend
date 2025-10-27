import { type NextRequest, NextResponse } from "next/server"
import { QueueManager } from "@/lib/queue-manager"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get("doctorId")
    const action = searchParams.get("action")

    if (action === "stats") {
      const stats = QueueManager.getQueueStats()
      return NextResponse.json(stats)
    }

    if (action === "state") {
      const state = QueueManager.getQueueState()
      return NextResponse.json(state)
    }

    const queue = doctorId ? QueueManager.getDoctorQueue(doctorId) : QueueManager.getPatientQueue()

    return NextResponse.json(queue)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch queue" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, patientId, doctorId, status, priority, patient } = body

    switch (action) {
      case "add":
        if (!patient) {
          return NextResponse.json({ error: "Patient data required" }, { status: 400 })
        }
        const newPatient = QueueManager.addPatientToQueue(patient)
        return NextResponse.json(newPatient)

      case "updateStatus":
        if (!patientId || !status) {
          return NextResponse.json({ error: "Patient ID and status required" }, { status: 400 })
        }
        const statusUpdated = QueueManager.updatePatientStatus(patientId, status)
        return NextResponse.json({ success: statusUpdated })

      case "updatePriority":
        if (!patientId || !priority) {
          return NextResponse.json({ error: "Patient ID and priority required" }, { status: 400 })
        }
        const priorityUpdated = QueueManager.updatePatientPriority(patientId, priority)
        return NextResponse.json({ success: priorityUpdated })

      case "movePatient":
        if (!patientId || !doctorId) {
          return NextResponse.json({ error: "Patient ID and doctor ID required" }, { status: 400 })
        }
        const moved = QueueManager.movePatientToDoctor(patientId, doctorId)
        return NextResponse.json({ success: moved })

      case "updateDoctor":
        if (!doctorId) {
          return NextResponse.json({ error: "Doctor ID required" }, { status: 400 })
        }
        const { isAvailable, onBreak } = body
        const doctorUpdated = QueueManager.updateDoctorAvailability(doctorId, isAvailable, onBreak)
        return NextResponse.json({ success: doctorUpdated })

      case "updateRoom":
        const { roomId, roomStatus, currentPatient } = body
        if (!roomId || !roomStatus) {
          return NextResponse.json({ error: "Room ID and status required" }, { status: 400 })
        }
        const roomUpdated = QueueManager.updateRoomStatus(roomId, roomStatus, currentPatient)
        return NextResponse.json({ success: roomUpdated })

      case "nextPatient":
        if (!doctorId) {
          return NextResponse.json({ error: "Doctor ID required" }, { status: 400 })
        }
        const nextPatient = QueueManager.getNextPatient(doctorId)
        return NextResponse.json(nextPatient)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
