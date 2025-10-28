import type React from "react"
import { RouteGuard } from "@/components/auth/route-guard"
import { Navbar } from "@/components/shared/navbar"

export default function NurseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard allowedRoles={["nurse"]}>
      <Navbar />
      {children}
    </RouteGuard>
  )
}
