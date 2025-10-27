"use client"

import { useState, useCallback, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

let toastId = 0
const toastListeners: Set<(toast: Toast) => void> = new Set()

export function useToast() {
  const showToast = useCallback((message: string, type: ToastType = "info", duration = 3000) => {
    const id = `toast-${toastId++}`
    const toast: Toast = { id, message, type, duration }
    toastListeners.forEach((listener) => listener(toast))
  }, [])

  return { showToast }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handleToast = (toast: Toast) => {
      setToasts((prev) => [...prev, toast])
      if (toast.duration) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id))
        }, toast.duration)
      }
    }

    toastListeners.add(handleToast)
    return () => {
      toastListeners.delete(handleToast)
    }
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBgColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-lg border ${getBgColor(toast.type)} shadow-lg animate-in fade-in slide-in-from-top-2`}
        >
          {getIcon(toast.type)}
          <span className="flex-1 text-sm font-medium text-foreground">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="text-foreground/50 hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
