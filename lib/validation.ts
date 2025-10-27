// Form validation utilities
export const validators = {
  email: (email: string): { valid: boolean; error?: string } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return { valid: false, error: "Email is required" }
    if (!emailRegex.test(email)) return { valid: false, error: "Invalid email format" }
    return { valid: true }
  },

  password: (password: string): { valid: boolean; error?: string } => {
    if (!password) return { valid: false, error: "Password is required" }
    if (password.length < 8) return { valid: false, error: "Password must be at least 8 characters" }
    if (!/[A-Z]/.test(password)) return { valid: false, error: "Password must contain uppercase letter" }
    if (!/[0-9]/.test(password)) return { valid: false, error: "Password must contain number" }
    return { valid: true }
  },

  phone: (phone: string): { valid: boolean; error?: string } => {
    const phoneRegex = /^[\d\s\-+$$$$]+$/
    if (!phone) return { valid: false, error: "Phone number is required" }
    if (!phoneRegex.test(phone)) return { valid: false, error: "Invalid phone format" }
    if (phone.replace(/\D/g, "").length < 10) return { valid: false, error: "Phone must be at least 10 digits" }
    return { valid: true }
  },

  name: (name: string): { valid: boolean; error?: string } => {
    if (!name) return { valid: false, error: "Name is required" }
    if (name.length < 2) return { valid: false, error: "Name must be at least 2 characters" }
    if (name.length > 100) return { valid: false, error: "Name must be less than 100 characters" }
    return { valid: true }
  },

  dateOfBirth: (date: string): { valid: boolean; error?: string } => {
    if (!date) return { valid: false, error: "Date of birth is required" }
    const birthDate = new Date(date)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 0 || age > 150) return { valid: false, error: "Invalid date of birth" }
    if (age < 18) return { valid: false, error: "Must be at least 18 years old" }
    return { valid: true }
  },

  time: (time: string): { valid: boolean; error?: string } => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!time) return { valid: false, error: "Time is required" }
    if (!timeRegex.test(time)) return { valid: false, error: "Invalid time format (HH:MM)" }
    return { valid: true }
  },

  required: (value: string | number | boolean): { valid: boolean; error?: string } => {
    if (!value && value !== 0 && value !== false) return { valid: false, error: "This field is required" }
    return { valid: true }
  },
}

export const validateForm = (
  data: Record<string, any>,
  schema: Record<string, (value: any) => { valid: boolean; error?: string }>,
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(data[field])
    if (!result.valid && result.error) {
      errors[field] = result.error
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
