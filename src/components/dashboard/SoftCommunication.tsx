"use client"
import { useAppStore } from '@/lib/store'

export function SoftCommunication() {
  const setNotificationDrawerOpen = useAppStore(s => s.setNotificationDrawerOpen)

  return (
    <div className="bg-white/70 dark:bg-secondary/50 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.05)] border border-white/50 dark:border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest">Log Aktivitas Sistem (7 Hari Terakhir)</h3>
        <button onClick={() => setNotificationDrawerOpen(true)} className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-foreground transition-colors cursor-pointer">Lihat Semua {`>`}</button>
      </div>

      <div className="space-y-6">
        <div className="relative pl-4 border-l-2 border-slate-200 dark:border-border/50">
          <div className="absolute top-1 -left-[5px] w-2 h-2 rounded-full bg-rose-500" />
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-foreground">Sistem Admin</h4>
              <p className="text-sm text-slate-500 dark:text-muted-foreground mt-1">Dokumen Pencairan Dana Desa Tahap I telah disetujui oleh Kepala Desa dan diteruskan ke bendahara.</p>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-foreground shrink-0 mt-1 sm:mt-0">2 hari lalu</span>
          </div>
        </div>
        
        <div className="relative pl-4 border-l-2 border-slate-200 dark:border-border/50">
          <div className="absolute top-1 -left-[5px] w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-foreground">Sistem Keamanan</h4>
              <p className="text-sm text-slate-500 dark:text-muted-foreground mt-1">Backup database mingguan berhasil dilakukan secara otomatis. Ukuran file: 2.4MB.</p>
            </div>
            <span className="text-xs font-bold text-slate-400 dark:text-muted-foreground shrink-0 mt-1 sm:mt-0">5 hari lalu</span>
          </div>
        </div>
      </div>
    </div>
  )
}
