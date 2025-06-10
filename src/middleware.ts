import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get language from cookies or headers
  const language = request.cookies.get('language')?.value || 
                  request.headers.get('accept-language')?.split(',')[0] || 
                  'en';

  // Security headers
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  );

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const key = `rate_limit_${ip}`;
    
    // This would typically use a Redis store or similar
    // For now, we'll just add the header for tracking
    response.headers.set('X-RateLimit-IP', ip);
  }

  // Authentication checks for protected routes
  const protectedPaths = ['/dashboard', '/admin'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedPath) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Add auth header for the request
    response.headers.set('X-Auth-Token', token);
  }

  // Admin route protection
  if (pathname.startsWith('/dashboard/admin')) {
    const userRole = request.cookies.get('user-role')?.value;
    
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Author route protection (admin or author)
  const authorPaths = ['/dashboard/admin/articles/create', '/dashboard/admin/articles/edit'];
  const isAuthorPath = authorPaths.some(path => pathname.startsWith(path));
  
  if (isAuthorPath) {
    const userRole = request.cookies.get('user-role')?.value;
    
    if (userRole !== 'ADMIN' && userRole !== 'AUTHOR') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Redirect root to home with proper language
  if (pathname === '/') {
    response.headers.set('X-User-Language', language);
  }

  // Handle auth redirects for already authenticated users
  const authPaths = ['/login', '/register'];
  const isAuthPath = authPaths.includes(pathname);
  
  if (isAuthPath) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (token) {
      // Redirect to dashboard if already authenticated
      const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard';
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  // Add geo-location header if available
  const country = request.geo?.country || 'unknown';
  response.headers.set('X-User-Country', country);

  // Handle PWA and mobile detection
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
  const isPWA = request.headers.get('display-mode') === 'standalone';
  
  response.headers.set('X-Is-Mobile', isMobile.toString());
  response.headers.set('X-Is-PWA', isPWA.toString());

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     * - manifest.json (PWA manifest)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json).*)',
  ],
};