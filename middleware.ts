import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for an admin route (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for the Firebase auth token cookie
    const firebaseAuthToken = request.cookies.get('firebaseAuthToken')

    // If no token is found or token value is empty, redirect to login
    if (!firebaseAuthToken || !firebaseAuthToken.value) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Allow the request to continue
  return NextResponse.next()
}

export const config = {
  // Match all admin routes
  matcher: '/admin/:path*'
}
