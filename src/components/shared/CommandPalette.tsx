"use client"

import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useAppStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { Search, Wallet, Users, FileText, Settings, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function CommandPalette() {
  const open = useAppStore(s => s.isCommandPaletteOpen)
  const setOpen = useAppStore(s => s.setCommandPaletteOpen)
  const router = useRouter()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, setOpen])

  if (!open) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4 sm:px-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
        >
          <Command 
            className="w-full flex flex-col"
            shouldFilter={false}
          >
            <div className="flex items-center border-b border-border px-4 py-3">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <Command.Input 
                autoFocus
                placeholder="Ketik untuk mencari menu, aksi, atau data..." 
                className="flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground text-foreground"
                value={query}
                onValueChange={setQuery}
              />
              <button 
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <Command.List className="max-h-[300px] overflow-y-auto p-2 no-scrollbar">
              <Command.Empty className="p-6 text-center text-sm text-muted-foreground">
                Tidak ada hasil yang ditemukan untuk "{query}"
              </Command.Empty>

              <Command.Group heading="Navigasi" className="text-xs font-medium text-muted-foreground px-2 py-1.5 [&_[cmdk-group-items]]:mt-1.5">
                {[
                  { icon: Wallet, label: 'Keuangan & APBDes', href: '/keuangan' },
                  { icon: Users, label: 'Data Master Pengguna', href: '/master' },
                  { icon: FileText, label: 'Pusat Laporan', href: '/laporan' },
                  { icon: Settings, label: 'Pengaturan Sistem', href: '/master' },
                ].filter(i => i.label.toLowerCase().includes(query.toLowerCase())).map(item => (
                  <Command.Item
                    key={item.label}
                    onSelect={() => {
                      router.push(item.href)
                      setOpen(false)
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground cursor-pointer hover:bg-secondary aria-selected:bg-secondary transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    {item.label}
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
