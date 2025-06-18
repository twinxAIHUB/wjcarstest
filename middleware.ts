import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = ['/admin/login', '/api/admin/create'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle admin routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    console.log('Not an admin route, allowing.');
    return NextResponse.next();
  }

  // Allow access to public paths
  if (publicPaths.includes(pathname)) {
    console.log('Public path, allowing:', pathname);
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  console.log('Token from cookies:', token ? '[REDACTED]' : 'None');

  // Redirect to login if no token is present
  if (!token) {
    console.log('No token found, redirecting to login');
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the token with the API
  try {
    console.log('Verifying token...');
    const verifyResponse = await fetch(`${request.nextUrl.origin}/api/admin/verify?idToken=${token}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text();
      console.error('Token verification failed:', errorText);
      throw new Error('Invalid token');
    }

    console.log('Token verified successfully');
    return NextResponse.next();
  } catch (error) {
    console.error('Error in middleware:', error);
    // If token verification fails, redirect to login
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
}; 