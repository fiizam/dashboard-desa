import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
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
    <>
      <KependudukanInteractive initialStats={stats} initialWarga={warga} keluargaList={keluarga} />
    </>
  )
}
