import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/tai-khoan', '/theo-doi', '/lich-su'];

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const authCookie = request.cookies.get('auth');
  const pathname = request.nextUrl.pathname;

  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!authCookie) {
      const loginUrl = new URL('/auth/dang-nhap', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
