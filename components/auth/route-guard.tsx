"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser, canAccessRoute, getDefaultDashboard } from "@/lib/auth"

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser()

      if (!user) {
        router.push("/login")
        return
      }

      // Check if user can access this route
      if (!canAccessRoute(user.role, pathname)) {
        router.push(getDefaultDashboard(user.role))
        return
      }

      // Check specific role requirements
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push(getDefaultDashboard(user.role))
        return
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, pathname, allowedRoles])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
