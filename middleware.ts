import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = ['/admin/login', '/api/admin/create'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle admin routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  // Allow access to public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  // Redirect to login if no token is present
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

    // Token exists, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
}; 