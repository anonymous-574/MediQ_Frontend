import { AlertCircle } from "lucide-react"

interface FormErrorProps {
  message?: string
  className?: string
}

export function FormError({ message, className = "" }: FormErrorProps) {
  if (!message) return null

  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 ${className}`}
    >
      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
      <p className="text-sm text-destructive">{message}</p>
    </div>
  )
}
