import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { REGION_COOKIE_NAME, RegionCode } from './types/region'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    // 0. Auth Check for /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = await getToken({ req: request });

        // Allow access to login page if NOT logged in
        if (request.nextUrl.pathname === '/admin/login') {
            if (token) {
                // If already logged in:
                // Admins go to /admin
                // Users go to /account
                const target = token.role === 'ADMIN' ? '/admin' : '/account';
                return NextResponse.redirect(new URL(target, request.url));
            }
        } else {
            // Protect other admin routes
            if (!token) {
                const url = new URL('/admin/login', request.url);
                url.searchParams.set('callbackUrl', request.nextUrl.pathname);
                return NextResponse.redirect(url);
            }

            // Check ROLE
            if (token.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/account', request.url));
            }
        }
    }

    // Protect /account routes
    if (request.nextUrl.pathname.startsWith('/account')) {
        const token = await getToken({ req: request });
        if (!token) {
            const url = new URL('/admin/login', request.url);
            url.searchParams.set('callbackUrl', request.nextUrl.pathname);
            return NextResponse.redirect(url);
        }
    }

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
