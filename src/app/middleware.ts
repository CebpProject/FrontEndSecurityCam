import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // Check for the Auth0 session cookie
    const isAuthenticated = request.cookies.get('appSession');

    // If not authenticated and not trying to access login or about page, redirect to login
    if (!isAuthenticated && !request.nextUrl.pathname.match(/^\/(login|about)$/)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

