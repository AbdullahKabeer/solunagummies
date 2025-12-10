import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 1. Capture Geo & IP from Vercel/Cloud Headers
  // Note: request.geo is Vercel-specific and might not be available locally
  const country = request.headers.get('x-vercel-ip-country') || 'Unknown';
  const city = request.headers.get('x-vercel-ip-city') || 'Unknown';
  const region = request.headers.get('x-vercel-ip-region') || 'Unknown';
  const ip = request.headers.get('x-forwarded-for') || 'Unknown';

  // 2. Device Detection (Simple User-Agent parsing)
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
  const deviceType = isMobile ? 'Mobile' : 'Desktop';

  // 3. Pass these as custom headers to the backend/API
  response.headers.set('x-geo-country', country);
  response.headers.set('x-geo-city', city);
  response.headers.set('x-geo-region', region);
  response.headers.set('x-ip', ip);
  response.headers.set('x-device-type', deviceType);

  return response;
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
