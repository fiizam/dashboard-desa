"use client"

import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotifications, markNotificationRead } from '@/server/actions/notifications'
import { useRouter } from 'next/navigation'

export function NotificationDrawer() {
  const open = useAppStore(s => s.isNotificationDrawerOpen)
  const setOpen = useAppStore(s => s.setNotificationDrawerOpen)
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
    refetchInterval: 10000 // Poll every 10 seconds
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  const handleNotificationClick = (notif: any) => {
    if (!notif.isRead) markReadMutation.mutate(notif.id)
    if (notif.link) {
      router.push(notif.link)
      setOpen(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg tracking-tight">Notifikasi</h2>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {notifications.length > 0 ? notifications.map((notif: any) => (
                <div 
                  key={notif.id} 
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 rounded-2xl border transition-colors flex gap-3 cursor-pointer ${notif.isRead ? 'bg-background border-border/50 opacity-70' : 'bg-primary/5 border-primary/20 hover:bg-primary/10'}`}
                >
                  <div className="mt-0.5">
                    {notif.title.toLowerCase().includes('berhasil') || notif.title.toLowerCase().includes('disetujui') 
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      : notif.title.toLowerCase().includes('ditolak') || notif.title.toLowerCase().includes('peringatan')
                      ? <AlertTriangle className="w-5 h-5 text-amber-500" />
                      : <Info className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1 text-foreground">{notif.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{notif.message}</p>
                    <span className="text-[10px] font-medium text-muted-foreground/60">
                      {new Date(notif.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60">
                  <Bell className="w-12 h-12 mb-4 stroke-1" />
                  <p className="text-sm">Belum ada notifikasi.</p>
                </div>
              )}
            </div>
            
            {notifications.some((n:any) => !n.isRead) && (
              <div className="p-6 border-t border-border/50">
                <button 
                  onClick={() => {
                    notifications.filter((n:any) => !n.isRead).forEach((n:any) => markReadMutation.mutate(n.id))
                  }}
                  className="w-full py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
                >
                  Tandai semua telah dibaca
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
