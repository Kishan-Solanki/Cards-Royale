import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/verifyemail', '/forgot-password'];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  if (token) {
    try {
      if (PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      return NextResponse.next(); 
    } catch (err) {
      const res = NextResponse.redirect(new URL('/login?forceLogout=true', req.url));
      res.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
      });
      return res;
    }
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/verifyemail',
    '/profile',
  ],
};
