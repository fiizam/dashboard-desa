"use client"

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { CommandPalette } from '../shared/CommandPalette'
import { NotificationDrawer } from '../shared/NotificationDrawer'
import { ProfileModal } from '../shared/ProfileModal'
import { useAppStore } from '@/lib/store'
import { Bell, Search, Menu } from 'lucide-react'
import { TopBarProfile } from './TopBarProfile'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/server/actions/profile'

export function DashboardLayout({ children, userRole }: { children: ReactNode, userRole: string }) {
  const pathname = usePathname()
  const isPinned = useAppStore(s => s.isSidebarPinned)
  const isHovered = useAppStore(s => s.isSidebarHovered)
  const isExpanded = isPinned || isHovered
  const setMobileMenuOpen = useAppStore(s => s.setMobileMenuOpen)
  const setCommandPaletteOpen = useAppStore(s => s.setCommandPaletteOpen)
  const setNotificationDrawerOpen = useAppStore(s => s.setNotificationDrawerOpen)
  const setProfileModalOpen = useAppStore(s => s.setProfileModalOpen)

  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => getProfile()
  })

  const isDashboard = pathname === '/'

  return (
    <div className="min-h-screen bg-[#FDF8F3] dark:bg-background flex font-sans text-slate-800 dark:text-foreground">
      <Sidebar userRole={userRole} />
      
      <div 
        className="flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-screen w-full relative"
        style={{ 
          // Use CSS variables or calc to only apply padding on lg screens
          paddingLeft: `var(--sidebar-padding, 0px)`
        }}
      >
        {/* Dynamic padding inject via style tag for responsive layout without inline JS constraints */}
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 1024px) {
            :root {
              --sidebar-padding: ${isExpanded ? '328px' : '144px'};
            }
          }
        `}} />

        <header className="h-20 sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between transition-colors bg-[#FDF8F3]/80 dark:bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg transition-colors lg:hidden text-slate-600 hover:bg-slate-200/50 dark:text-muted-foreground dark:hover:bg-secondary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-800 dark:text-foreground leading-tight">Halo {user?.name || userRole}</h1>
              <p className="text-xs text-slate-500 dark:text-muted-foreground">Sistem Keuangan Desa siap digunakan.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-1 max-w-xl mx-4">
            <button 
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-3 px-6 py-3 w-full bg-white/70 dark:bg-secondary/50 hover:bg-white dark:hover:bg-secondary rounded-full shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-white/50 dark:border-border/50 text-sm text-slate-500 dark:text-muted-foreground transition-all duration-300"
            >
              <Search className="w-4 h-4" />
              <span>Search...</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <button 
              onClick={() => setNotificationDrawerOpen(true)}
              className="p-2 text-slate-500 dark:text-muted-foreground hover:bg-white/50 dark:hover:bg-secondary rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#FDF8F3] dark:ring-background" />
            </button>
            <TopBarProfile isDashboard={false} />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[100vw] overflow-x-hidden relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette />
      <NotificationDrawer />
      <ProfileModal />
    </div>
  )
}
