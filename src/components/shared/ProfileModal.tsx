"use client"

import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, LogOut, Shield, Key } from 'lucide-react'
import { logout } from '@/server/actions/auth'

export function ProfileModal() {
  const open = useAppStore(s => s.isProfileModalOpen)
  const setOpen = useAppStore(s => s.setProfileModalOpen)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
          >
            <div className="p-6 text-center relative border-b border-border/50 bg-secondary/30">
              <button 
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-background transition-colors text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Admin Keuangan</h3>
              <p className="text-sm text-muted-foreground">admin@Digital Village.id</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                Administrator
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary text-sm font-medium transition-colors">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Edit Profil
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary text-sm font-medium transition-colors">
                  <Key className="w-4 h-4 text-muted-foreground" />
                  Ganti Password
                </button>
              </div>
              
              <div className="my-2 border-t border-border/50" />
              
              <form action={logout}>
                <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-500/10 text-rose-500 text-sm font-medium transition-colors">
                  <LogOut className="w-4 h-4" />
                  Keluar Aplikasi
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
