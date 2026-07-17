import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session-edge'

const protectedRoutes = ['/', '/keuangan', '/master', '/laporan', '/referensi']
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

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

  // RBAC Checks
  if (session) {
    const role = session.role as string

    // 1. Audit Log: Only Super Admin and Admin
    if (path.startsWith('/master/audit') && !['Super Admin', 'Admin'].includes(role)) {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    // 2. Master & Referensi: Super Admin, Admin Keuangan, Admin
    if ((path.startsWith('/master') || path.startsWith('/referensi') || path.startsWith('/settings')) && 
        !['Super Admin', 'Admin Keuangan', 'Admin', 'User'].includes(role) && !path.startsWith('/master/audit')) { 
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    // Specifically block User from Master and Referensi
    if ((path.startsWith('/master') || path.startsWith('/referensi')) && role === 'User') {
       return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    // 3. Approval: Only Kepala Desa
    if (path.startsWith('/keuangan/approval') && role !== 'Kepala Desa') {
      return NextResponse.redirect(new URL('/keuangan', req.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
