import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { REGION_COOKIE_NAME, RegionCode } from './types/region'

export function middleware(request: NextRequest) {
    // 1. Check existing cookie
    const existingRegion = request.cookies.get(REGION_COOKIE_NAME)
    if (existingRegion) {
        return NextResponse.next()
    }

    // 2. Detect region from headers
    let region: RegionCode = 'GLOBAL'

    // Try to detect from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language')
    if (acceptLanguage && acceptLanguage.includes('tr')) {
        region = 'TR'
    }

    // Note: For more accurate geo-location in production usage (e.g. Hetzner behind Cloudflare/Nginx),
    // you might check 'x-forwarded-for', 'cf-ipcountry' or similar headers.

    // 3. Set the cookie
    const response = NextResponse.next()
    response.cookies.set(REGION_COOKIE_NAME, region, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
    })

    return response
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
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
