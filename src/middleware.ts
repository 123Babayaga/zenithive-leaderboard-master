import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = ['/leaderboard', '/users', '/points', '/change-password']

// Define public routes (routes that don't require authentication)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if the current route is public
  
  // Get authentication token from cookies
  // You can customize this based on your auth implementation
  const token = request.cookies.get('authToken')?.value || 
                request.cookies.get('session')?.value ||
                request.cookies.get('jwt')?.value
  
  // Alternative: Get token from Authorization header
  // const authHeader = request.headers.get('Authorization')
  // const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  
  // If accessing a protected route without authentication
  if (isProtectedRoute && !token) {
    // Redirect to login page
    const loginUrl = new URL('/', request.url)
    
    // Optional: Add redirect parameter to return user after login
    loginUrl.searchParams.set('redirect', pathname)
    
    return NextResponse.redirect(loginUrl)
  }
  
  // If user is authenticated and trying to access login/register, redirect to dashboard
  if (token && (pathname === '/' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/leaderboard', request.url))
  }
  
  // Add authentication headers to the request (optional)
  if (token) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-authenticated', 'true')
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
  // Allow the request to continue
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}