"use client"

import { useState, useEffect, useCallback } from "react"
import type { QueuePatient, QueueState } from "@/lib/queue-manager"
import type { QueueStats } from "@/lib/types"

export function useQueue(doctorId?: string) {
  const [queue, setQueue] = useState<QueuePatient[]>([])
  const [queueState, setQueueState] = useState<QueueState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQueue = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (doctorId) params.append("doctorId", doctorId)

      const response = await fetch(`/api/queue?${params}`)
      if (!response.ok) throw new Error("Failed to fetch queue")

      const data = await response.json()
      setQueue(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }, [doctorId])

  const fetchQueueState = useCallback(async () => {
    try {
      const response = await fetch("/api/queue?action=state")
      if (!response.ok) throw new Error("Failed to fetch queue state")

      const data = await response.json()
      setQueueState(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }, [])

  const updatePatientStatus = useCallback(
    async (patientId: string, status: string) => {
      try {
        const response = await fetch("/api/queue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "updateStatus", patientId, status }),
        })

        if (!response.ok) throw new Error("Failed to update patient status")

        await fetchQueue()
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        return false
      }
    },
    [fetchQueue],
  )

  const updatePatientPriority = useCallback(
    async (patientId: string, priority: string) => {
      try {
        const response = await fetch("/api/queue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "updatePriority", patientId, priority }),
        })

        if (!response.ok) throw new Error("Failed to update patient priority")

        await fetchQueue()
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        return false
      }
    },
    [fetchQueue],
  )

  const movePatient = useCallback(
    async (patientId: string, newDoctorId: string) => {
      try {
        const response = await fetch("/api/queue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "movePatient", patientId, doctorId: newDoctorId }),
        })

        if (!response.ok) throw new Error("Failed to move patient")

        await fetchQueue()
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        return false
      }
    },
    [fetchQueue],
  )

  const callNextPatient = useCallback(
    async (doctorId: string) => {
      try {
        const response = await fetch("/api/queue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "nextPatient", doctorId }),
        })

        if (!response.ok) throw new Error("Failed to get next patient")

        const nextPatient = await response.json()
        if (nextPatient) {
          await updatePatientStatus(nextPatient.id, "in-progress")
        }
        return nextPatient
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        return null
      }
    },
    [updatePatientStatus],
  )

  useEffect(() => {
    fetchQueue()
    fetchQueueState()

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchQueue()
      fetchQueueState()
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(interval)
  }, [fetchQueue, fetchQueueState])

  return {
    queue,
    queueState,
    isLoading,
    error,
    refetch: fetchQueue,
    updatePatientStatus,
    updatePatientPriority,
    movePatient,
    callNextPatient,
  }
}

export function useQueueStats() {
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/queue?action=stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch queue stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return { stats, isLoading }
}
