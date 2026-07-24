import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LaporanInteractive } from '@/components/laporan/LaporanInteractive'
import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function LaporanPage() {
  const session = await getSession()
  let role = session?.role || 'User'

  if (session?.userId) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { role: true }
    })
    if (user) {
      role = user.role.name
    }
  }

  const allowedRoles = ['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Sekretaris', 'Bendahara']
  if (!allowedRoles.includes(role)) {
    redirect('/')
  }

  return (
    <DashboardLayout userRole={role}>
      <LaporanInteractive />
    </DashboardLayout>
  )
}
