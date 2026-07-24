import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { getSession } from '@/lib/session'
import { SettingsInteractive } from '@/components/settings/SettingsInteractive'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
export default async function SettingsPage() {
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
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Pengaturan Sistem</h1>
          <p className="text-muted-foreground">Sesuaikan preferensi tampilan, notifikasi, dan keamanan sistem Anda.</p>
        </div>
        
        <SettingsInteractive />
      </div>
    </DashboardLayout>
  )
}
