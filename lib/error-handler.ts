// Centralized error handling
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode = 500,
    public details?: any,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export const errorMessages: Record<string, string> = {
  UNAUTHORIZED: "You are not authorized to perform this action",
  FORBIDDEN: "Access denied",
  NOT_FOUND: "Resource not found",
  VALIDATION_ERROR: "Please check your input and try again",
  NETWORK_ERROR: "Network error. Please check your connection",
  SERVER_ERROR: "Server error. Please try again later",
  DUPLICATE_EMAIL: "Email already exists",
  INVALID_CREDENTIALS: "Invalid email or password",
  SESSION_EXPIRED: "Your session has expired. Please log in again",
  APPOINTMENT_CONFLICT: "This time slot is already booked",
  INVALID_TIME_RANGE: "End time must be after start time",
  PAST_DATE: "Cannot book appointments in the past",
}

export const handleError = (error: any): string => {
  // Handle AppError
  if (error instanceof AppError) {
    return errorMessages[error.code] || error.message
  }

  // Handle API errors
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  // Handle network errors
  if (error.message === "Network Error") {
    return errorMessages.NETWORK_ERROR
  }

  // Handle validation errors
  if (error.response?.status === 400) {
    return errorMessages.VALIDATION_ERROR
  }

  // Handle unauthorized
  if (error.response?.status === 401) {
    return errorMessages.UNAUTHORIZED
  }

  // Handle forbidden
  if (error.response?.status === 403) {
    return errorMessages.FORBIDDEN
  }

  // Handle not found
  if (error.response?.status === 404) {
    return errorMessages.NOT_FOUND
  }

  // Default error
  return errorMessages.SERVER_ERROR
}

export const createErrorResponse = (code: string, statusCode = 500, details?: any) => {
  return {
    success: false,
    error: {
      code,
      message: errorMessages[code] || "An error occurred",
      details,
    },
  }
}

export const createSuccessResponse = (data: any, message?: string) => {
  return {
    success: true,
    data,
    message,
  }
}
