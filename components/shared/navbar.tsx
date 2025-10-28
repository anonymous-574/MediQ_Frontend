"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCurrentUser, logoutUser } from "@/lib/auth"
import { Menu, X, LogOut, Home } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = async () => {
    await logoutUser()
    router.push("/login")
  }

  const getNavLinks = () => {
    if (!user) return []

    const baseLinks = [{ href: `/${user.role}/dashboard`, label: "Dashboard", icon: Home }]

    switch (user.role) {
      case "patient":
        return [
          ...baseLinks,
          { href: "/patient/appointments", label: "Appointments" },
          { href: "/patient/symptoms", label: "Symptoms" },
          { href: "/patient/queue", label: "Queue Status" },
          { href: "/patient/reports", label: "Medical Records" },
          { href: "/patient/profile", label: "Profile" },
        ]
      case "doctor":
        return [
          ...baseLinks,
          { href: "/doctor/appointments", label: "Appointments" },
          { href: "/doctor/schedule", label: "Schedule" },
          { href: "/doctor/availability", label: "Availability" },
          { href: "/doctor/profile", label: "Profile" },
        ]
      case "nurse":
        return [
          ...baseLinks,
          
          { href: "/nurse/rooms", label: "Room management" },
          { href: "/nurse/queue", label: "Queue management" },
          { href: "/nurse/patients", label: "Patients" },
          { href: "/nurse/profile", label: "Profile" },
        ]
      case "admin":
        return [
          ...baseLinks,
          { href: "/admin/analytics", label: "Analytics" },
          { href: "/admin/appointments", label: "Appointments" },
          { href: "/admin/reports", label: "Reports" },
          { href: "/admin/users", label: "Users" },
          { href: "/admin/settings", label: "Settings" },
          { href: "/admin/system", label: "System" },
        ]
      default:
        return baseLinks
    }
  }

  const navLinks = getNavLinks()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={user ? `/${user.role}/dashboard` : "/"} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              M
            </div>
            <span className="hidden font-bold text-foreground sm:inline">MediQ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{user.name}</span>
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground capitalize">
                  {user.role}
                </span>
              </div>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-secondary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="space-y-1 px-2 py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
