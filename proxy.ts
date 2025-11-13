import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  if (
    !req.auth &&
    !(
      req.nextUrl.pathname.startsWith('/auth') ||
      req.nextUrl.pathname.startsWith('/api')
    )
  ) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
});
