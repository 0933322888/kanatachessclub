import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check for NextAuth session cookies (both dev and production names)
  const hasSessionCookie = 
    request.cookies.has('next-auth.session-token') || 
    request.cookies.has('__Secure-next-auth.session-token') ||
    request.cookies.has('__Host-next-auth.session-token');
  
  // Try to get token
  let token = null;
  if (hasSessionCookie) {
    try {
      token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      });
    } catch (error) {
      // If getToken fails but cookie exists, allow through
      // The page will handle authentication via getServerSession
      console.warn('Middleware: getToken failed but session cookie exists, allowing request');
      return NextResponse.next();
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!token && !hasSessionCookie) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (token && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // If token is null but cookie exists, allow through (page will check admin role)
    if (!token && hasSessionCookie) {
      return NextResponse.next();
    }
  }

  // Protect authenticated routes
  const protectedRoutes = ['/profile', '/next-gathering', '/tournaments'];
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // If no token and no session cookie, redirect to login
    if (!token && !hasSessionCookie) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // If session cookie exists but token is null, allow through (page will handle auth)
    if (!token && hasSessionCookie) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/profile/:path*', 
    '/next-gathering',
    '/next-gathering/:path*', 
    '/tournaments',
    '/tournaments/:path*'
  ],
};

