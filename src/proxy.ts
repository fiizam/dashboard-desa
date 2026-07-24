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
      let role = session.role as string
      if (role === 'Admin') role = 'Super Admin'

      // 1. Audit Log: Only Super Admin
      if (path.startsWith('/master/audit') && role !== 'Super Admin') {
        return NextResponse.redirect(new URL('/', req.nextUrl))
      }

      // 2. Keuangan: Block Sekretaris
      if (path.startsWith('/keuangan') && role === 'Sekretaris') {
        return NextResponse.redirect(new URL('/', req.nextUrl))
      }

      // 3. Master Data & Referensi: Block Bendahara
      if ((path.startsWith('/master') || path.startsWith('/referensi')) && role === 'Bendahara') {
        return NextResponse.redirect(new URL('/', req.nextUrl))
      }

      // 4. Approval Transaksi: Only Super Admin, Ketua RW, Wakil Ketua RW
      if (path.startsWith('/keuangan/approval') && !['Super Admin', 'Ketua RW', 'Wakil Ketua RW'].includes(role)) {
        return NextResponse.redirect(new URL('/keuangan', req.nextUrl))
      }
    }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
