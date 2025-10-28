import { apiService } from "./api"

export interface User {
  id: number
  email: string
  name: string
  role: "patient" | "doctor" | "nurse" | "admin"
}

export async function loginUser(email: string, password: string) {
  try {
    const response = await apiService.login(email, password)
    return response
  } catch (error) {
    throw error
  }
}

export async function registerUser(data: {
  name: string
  email: string
  password: string
  role: string
}) {
  try {
    const response = await apiService.register(data)
    return response
  } catch (error) {
    throw error
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function setUserSession(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

export async function logoutUser() {
  try {
    await apiService.logout()
  } catch (error) {
    console.error("Logout error:", error)
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
    localStorage.removeItem("access_token")
    window.location.href = "/login"
  }
}

export const logout = logoutUser

export function requireAuth(allowedRoles?: string[]) {
  const user = getCurrentUser()

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
    return null
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (typeof window !== "undefined") {
      window.location.href = `/${user.role}/dashboard`
    }
    return null
  }

  return user
}

export function canAccessRoute(userRole: string, pathname: string): boolean {
  const roleRoutes = {
    patient: ["/patient"],
    doctor: ["/doctor"],
    nurse: ["/nurse"],
    admin: ["/admin"],
  }

  const userRoutes = roleRoutes[userRole as keyof typeof roleRoutes] || []
  return userRoutes.some((route) => pathname.startsWith(route))
}

export function getDefaultDashboard(role: string): string {
  switch (role) {
    case "patient":
      return "/patient/dashboard"
    case "doctor":
      return "/doctor/dashboard"
    case "nurse":
      return "/nurse/dashboard"
    case "admin":
      return "/admin/dashboard"
    default:
      return "/login"
  }
}
