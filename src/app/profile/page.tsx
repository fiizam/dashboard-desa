import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { ProfileClient } from '@/components/profile/ProfileClient'

export default async function ProfilePage() {
  const session = await getSession()
  const role = session?.role || 'User'
  
  let user = null
  if (session?.userId) {
    user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        role: true,
        desa: {
          include: {
            kecamatan: {
              include: {
                kabupaten: {
                  include: {
                    provinsi: true
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  if (!user) {
    return (
      <DashboardLayout userRole={role}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-2">Profil Tidak Ditemukan</h2>
          <p className="text-muted-foreground">Silakan login kembali.</p>
        </div>
      </DashboardLayout>
    )
  }

  const desas = await prisma.desa.findMany()

  return (
    <DashboardLayout userRole={role}>
      <ProfileClient user={user} desas={desas} />
    </DashboardLayout>
  )
}
