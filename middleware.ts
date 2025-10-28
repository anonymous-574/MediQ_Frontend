import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define role-based route access
const roleRoutes = {
  patient: ["/patient"],
  doctor: ["/doctor"],
  nurse: ["/nurse"],
  admin: ["/admin"],
}

// Public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get user from cookie (in a real app, you'd verify JWT token)
  const userCookie = request.cookies.get("user")

  if (!userCookie) {
    // No user session, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const user = JSON.parse(userCookie.value)
    const userRole = user.role

    // Check if user is trying to access a role-specific route
    for (const [role, routes] of Object.entries(roleRoutes)) {
      if (routes.some((route) => pathname.startsWith(route))) {
        if (userRole !== role) {
          // User doesn't have permission, redirect to their dashboard
          return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url))
        }
        break
      }
    }

    return NextResponse.next()
  } catch (error) {
    // Invalid user cookie, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
