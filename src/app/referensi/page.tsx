import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { getSession } from '@/lib/session'
import { ReferensiInteractive } from '@/components/referensi/ReferensiInteractive'
import { getSumberDanas, getKategoriPendapatans, getKategoriBelanjas } from '@/server/actions/referensi'

import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function ReferensiPage() {
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

  const sumberDanas = await getSumberDanas()
  const kategoriPendapatans = await getKategoriPendapatans()
  const kategoriBelanjas = await getKategoriBelanjas()

  return (
    <DashboardLayout userRole={role}>
      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Referensi Master</h1>
          <p className="text-muted-foreground">Kelola data referensi seperti Sumber Dana, Kategori Anggaran, dan Rekening.</p>
        </div>
        
        <ReferensiInteractive 
          initialSumberDanas={sumberDanas}
          initialKategoriPendapatans={kategoriPendapatans}
          initialKategoriBelanjas={kategoriBelanjas}
        />
      </div>
    </DashboardLayout>
  )
}
