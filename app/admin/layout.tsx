import type React from "react"
import { RouteGuard } from "@/components/auth/route-guard"
import { Navbar } from "@/components/shared/navbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard allowedRoles={["admin"]}>
      <Navbar />
      {children}
    </RouteGuard>
  )
}
