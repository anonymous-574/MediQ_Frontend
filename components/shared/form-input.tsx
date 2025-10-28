"use client"

import type { InputHTMLAttributes } from "react"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function FormInput({ label, error, helperText, className, ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
      <input
        {...props}
        className={`w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${error ? "border-destructive" : ""} ${className}`}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
    </div>
  )
}
