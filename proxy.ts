// proxy.ts
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images');

  if (!req.auth && !isPublic) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
});
