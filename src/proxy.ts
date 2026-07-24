import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session-edge'

const protectedRoutes = ['/', '/keuangan', '/master', '/laporan', '/referensi', '/kependudukan']
const publicRoutes = ['/login', '/forgot-password', '/reset-password']

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

      // 2. Master Data: Only Super Admin, Ketua RW
      if (path.startsWith('/master') && !['Super Admin', 'Ketua RW'].includes(role)) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
      }

      // 3. Keuangan: Super Admin, Ketua RW, Wakil Ketua RW, Bendahara (Blokir Sekretaris)
      if (path.startsWith('/keuangan') && !['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Bendahara'].includes(role)) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
      }

      // 4. Referensi: Super Admin, Ketua RW, Sekretaris (Blokir Wakil dan Bendahara)
      if (path.startsWith('/referensi') && !['Super Admin', 'Ketua RW', 'Sekretaris'].includes(role)) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
      }

      // 5. Kependudukan: Super Admin, Ketua RW, Sekretaris (Blokir Wakil dan Bendahara)
      if (path.startsWith('/kependudukan') && !['Super Admin', 'Ketua RW', 'Sekretaris'].includes(role)) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
      }

      // 6. Approval Transaksi: Only Super Admin, Ketua RW, Wakil Ketua RW
      if (path.startsWith('/keuangan/approval') && !['Super Admin', 'Ketua RW', 'Wakil Ketua RW'].includes(role)) {
        return NextResponse.redirect(new URL('/keuangan', req.nextUrl))
      }
    }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
