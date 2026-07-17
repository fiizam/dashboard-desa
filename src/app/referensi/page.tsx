import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { getSession } from '@/lib/session'
import { ReferensiInteractive } from '@/components/referensi/ReferensiInteractive'
import { getSumberDanas, getKategoriPendapatans, getKategoriBelanjas } from '@/server/actions/referensi'

export default async function ReferensiPage() {
  const session = await getSession()
  const role = session?.role || 'User'

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
