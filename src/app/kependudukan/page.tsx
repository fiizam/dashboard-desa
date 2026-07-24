import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { KependudukanInteractive } from '@/components/kependudukan/KependudukanInteractive'
import { getStatistikKependudukan, getDaftarWarga, getDaftarKeluarga } from '@/server/actions/kependudukan'

export default async function KependudukanPage() {
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

  const allowedRoles = ['Super Admin', 'Ketua RW', 'Sekretaris']
  if (!allowedRoles.includes(role)) {
    redirect('/')
  }

  const stats = await getStatistikKependudukan()
  const warga = await getDaftarWarga()
  const keluarga = await getDaftarKeluarga()

  return (
    <DashboardLayout userRole={role}>
      <KependudukanInteractive initialStats={stats} initialWarga={warga} keluargaList={keluarga} />
    </DashboardLayout>
  )
}
