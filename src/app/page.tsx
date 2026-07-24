import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { SoftTopCards } from '@/components/dashboard/SoftTopCards'
import { AiFinancialAdvisor } from '@/components/dashboard/AiFinancialAdvisor'
import { SoftTransactionsTable } from '@/components/dashboard/SoftTransactionsTable'
import { SoftCommunication } from '@/components/dashboard/SoftCommunication'
import { SoftBreakdown } from '@/components/dashboard/SoftBreakdown'
import { SoftRightPanel } from '@/components/dashboard/SoftRightPanel'
import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'

export default async function Home() {
  const session = await getSession()
  let role = session?.role || 'User'

  // Selalu ambil role terbaru dari database untuk menghindari stale session cookie
  if (session?.userId) {
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
      <div className="flex flex-col xl:flex-row gap-6 w-full items-start">
        
        {/* Main Left Area (approx 70%) */}
        <div className="flex-1 w-full flex flex-col gap-6 min-w-0">
          {['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Bendahara'].includes(role) && <AiFinancialAdvisor />}
          <SoftTopCards role={role} />
          
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 w-full">
            <SoftTransactionsTable />
            <SoftBreakdown />
          </div>
        </div>

        {/* Right Sidebar Area (approx 30%) */}
        <div className="w-full xl:w-[350px] 2xl:w-[400px] shrink-0 flex flex-col gap-6 xl:sticky xl:top-6">
          <SoftRightPanel />
          <SoftCommunication />
        </div>

      </div>
    </DashboardLayout>
  )
}
