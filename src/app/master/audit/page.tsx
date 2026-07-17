import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Activity, Search } from 'lucide-react'

export default async function AuditLogPage() {
  const session = await getSession()
  const role = session?.role || 'User'

  if (role !== 'Super Admin') {
    redirect('/')
  }

  const logs = await prisma.logAktivitas.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      user: {
        select: { name: true, role: { select: { name: true } } }
      }
    }
  })

  return (
    <DashboardLayout userRole={role}>
      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-4 border-b border-border/50 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Audit Trail & Log Aktivitas</h1>
            <p className="text-muted-foreground">Pantau seluruh aktivitas pengguna dan perubahan data dalam sistem secara real-time.</p>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 sm:p-6 bg-secondary/10 border-b border-border/50 flex justify-between items-center">
             <div className="relative max-w-md w-full">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
               <input 
                 type="text" 
                 placeholder="Cari aktivitas atau nama pengguna..." 
                 className="w-full pl-9 pr-4 py-2.5 bg-background border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
               />
             </div>
             <span className="text-sm font-medium text-muted-foreground px-4 py-2 bg-secondary rounded-lg">50 Aktivitas Terakhir</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-secondary/30 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Waktu</th>
                  <th className="px-6 py-4 font-medium">Pengguna</th>
                  <th className="px-6 py-4 font-medium">Aksi</th>
                  <th className="px-6 py-4 font-medium">Entitas / Target</th>
                  <th className="px-6 py-4 font-medium">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{log.user?.name || 'Sistem'}</div>
                      <div className="text-xs text-muted-foreground">{log.user?.role?.name || 'Automated'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.action.includes('CREATE') || log.action.includes('ADD') ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400' :
                        log.action.includes('DELETE') || log.action.includes('REMOVE') ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {log.entity} {log.entityId ? `(#${log.entityId.slice(-6)})` : ''}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                      {log.details || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
