"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Wallet, FileText, Search, Bell, Settings } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'

export function TopNavigation() {
  const pathname = usePathname()
  const setCommandPaletteOpen = useAppStore(s => s.setCommandPaletteOpen)
  const setNotificationDrawerOpen = useAppStore(s => s.setNotificationDrawerOpen)
  const setProfileModalOpen = useAppStore(s => s.setProfileModalOpen)

  const links = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/keuangan', label: 'Keuangan', icon: Wallet },
    { href: '/master', label: 'Data Master', icon: Users },
    { href: '/laporan', label: 'Laporan', icon: FileText },
  ]

  return (
    <div className="w-full border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm shadow-primary/25 group-hover:scale-105 transition-transform">
              D
            </div>
            <span className="font-semibold text-lg tracking-tight hidden sm:block">DesaSync</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(link => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-foreground ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-secondary/50 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary/30 hover:bg-secondary border border-border/50 rounded-lg text-sm text-muted-foreground transition-colors w-48 xl:w-64"
          >
            <Search className="w-4 h-4" />
            <span>Search...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
          
          <button className="sm:hidden p-2 text-muted-foreground hover:bg-secondary rounded-lg" onClick={() => setCommandPaletteOpen(true)}>
            <Search className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />

          <button 
            onClick={() => setNotificationDrawerOpen(true)}
            className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>
          
          <button 
            onClick={() => setProfileModalOpen(true)}
            className="w-8 h-8 rounded-full bg-secondary/80 border border-border flex items-center justify-center hover:ring-2 hover:ring-primary/20 transition-all ml-1"
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}
