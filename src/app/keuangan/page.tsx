import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { getApbdesData, getRecentTransactions } from '@/server/actions/keuangan'
import { KeuanganInteractive } from '@/components/keuangan/KeuanganInteractive'
import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function KeuanganPage() {
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

  const allowedRoles = ['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Bendahara']
  if (!allowedRoles.includes(role)) {
    redirect('/')
  }

  const apbdes = await getApbdesData()
  const transactions = await getRecentTransactions()

  return (
    <DashboardLayout userRole={role}>
      <KeuanganInteractive initialApbdes={apbdes} initialTransactions={transactions} userRole={role} />
    </DashboardLayout>
  )
}
