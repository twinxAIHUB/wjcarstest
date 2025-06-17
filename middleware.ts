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
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the token with the API
  try {
    const verifyResponse = await fetch(`${request.nextUrl.origin}/api/admin/verify?idToken=${token}`);
    if (!verifyResponse.ok) {
      throw new Error('Invalid token');
    }
  } catch (error) {
    // If token verification fails, redirect to login
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token is valid, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
}; 