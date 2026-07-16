"use client"

import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react'

export function NotificationDrawer() {
  const open = useAppStore(s => s.isNotificationDrawerOpen)
  const setOpen = useAppStore(s => s.setNotificationDrawerOpen)

  // Dummy notifications for now, this will be connected to DB via react-query
  const notifications = [
    { id: 1, type: 'success', title: 'Transaksi Berhasil', message: 'Realisasi Pendapatan Dana Desa telah dicatat.', time: '5 mnt lalu' },
    { id: 2, type: 'warning', title: 'Peringatan Anggaran', message: 'Pos Belanja Publikasi hampir melebihi batas anggaran.', time: '1 jam lalu' },
    { id: 3, type: 'info', title: 'Pembaruan Sistem', message: 'Sistem telah diperbarui ke versi 1.2.0', time: '2 hari lalu' },
  ]

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
              {notifications.map(notif => (
                <div key={notif.id} className="p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors flex gap-3">
                  <div className="mt-0.5">
                    {notif.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {notif.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                    {notif.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{notif.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{notif.message}</p>
                    <span className="text-[10px] font-medium text-muted-foreground/60">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-border/50">
              <button className="w-full py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors">
                Tandai semua telah dibaca
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
