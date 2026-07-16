import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session-edge'

const protectedRoutes = ['/', '/keuangan', '/master', '/laporan']
const publicRoutes = ['/login', '/register']

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path === route || path.startsWith(`${route}/`))
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = req.cookies.get('session')?.value
  const session = await decrypt(cookie as string)

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  // RBAC: If User role, block /master and /laporan
  if (session && session.role === 'User') {
    if (path.startsWith('/master') || path.startsWith('/laporan')) {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
