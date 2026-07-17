import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { getSession } from '@/lib/session'
import { ApprovalInteractive } from '@/components/keuangan/ApprovalInteractive'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function ApprovalPage() {
  const session = await getSession()
  const role = session?.role || 'User'

  if (role !== 'Kepala Desa' && role !== 'Super Admin') {
    redirect('/keuangan')
  }

  // Fetch pending transactions
  const pendingPendapatan = await prisma.transaksiPendapatan.findMany({
    where: { status: 'PENDING' },
    include: { pendapatan: true },
    orderBy: { createdAt: 'desc' }
  })

  const pendingBelanja = await prisma.transaksiBelanja.findMany({
    where: { status: 'PENDING' },
    include: { belanja: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <DashboardLayout userRole={role}>
      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Persetujuan Transaksi</h1>
          <p className="text-muted-foreground">Tinjau dan setujui pengajuan transaksi pendapatan maupun belanja desa.</p>
        </div>
        
        <ApprovalInteractive 
          initialPendapatan={pendingPendapatan}
          initialBelanja={pendingBelanja}
        />
      </div>
    </DashboardLayout>
  )
}
