import { ReactNode } from 'react'
import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { redirect } from 'next/navigation'

export default async function DashboardRouteLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  let role = session.role || 'User'

  // Get fresh role from database if available
  if (session.userId) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { role: true }
    })
    if (user) {
      role = user.role.name
    }
  }

  return (
    <DashboardLayout userRole={role}>
      {children}
    </DashboardLayout>
  )
}
