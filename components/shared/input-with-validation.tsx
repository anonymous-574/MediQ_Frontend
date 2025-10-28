"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldError } from "./field-error"
import { AlertCircle, CheckCircle } from "lucide-react"

interface InputWithValidationProps {
  label: string
  id: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  icon?: React.ReactNode
}

export function InputWithValidation({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  disabled,
  required,
  icon,
}: InputWithValidationProps) {
  const hasError = !!error
  const isValid = value && !error

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{icon}</div>}
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${icon ? "pl-10" : ""} ${hasError ? "border-destructive focus:ring-destructive" : ""} ${
            isValid ? "border-green-500 focus:ring-green-500" : ""
          }`}
        />
        {isValid && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
        {hasError && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
        )}
      </div>
      <FieldError message={error} />
    </div>
  )
}
