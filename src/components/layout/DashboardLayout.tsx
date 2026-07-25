"use client"

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { CommandPalette } from '../shared/CommandPalette'
import { NotificationDrawer } from '../shared/NotificationDrawer'
import { ProfileModal } from '../shared/ProfileModal'
import { AiFinancialAdvisor } from '../dashboard/AiFinancialAdvisor'
import { useAppStore } from '@/lib/store'
import { Bell, Search } from 'lucide-react'
import { TopBarProfile } from './TopBarProfile'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/server/actions/profile'
import { getNotifications } from '@/server/actions/notifications'
import { useTranslation } from '@/lib/i18n'
function NotificationBell() {
  const setNotificationDrawerOpen = useAppStore(s => s.setNotificationDrawerOpen)
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
    refetchInterval: 10000
  })

  const unreadCount = notifications.filter((n:any) => !n.isRead).length

  return (
    <button 
      onClick={() => setNotificationDrawerOpen(true)}
      className="p-2 text-slate-500 dark:text-muted-foreground hover:bg-white/50 dark:hover:bg-secondary rounded-full transition-colors relative"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-[#FDF8F3] dark:ring-background" />
      )}
    </button>
  )
}

export function DashboardLayout({ children, userRole }: { children: ReactNode, userRole?: string }) {
  const pathname = usePathname()
  const t = useTranslation()
  const isPinned = useAppStore(s => s.isSidebarPinned)
  const isHovered = useAppStore(s => s.isSidebarHovered)
  const isExpanded = isPinned || isHovered
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

        <header className="h-[72px] sm:h-20 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between transition-colors bg-[#FDF8F3]/80 dark:bg-background/80 backdrop-blur-md border-b border-border/40 lg:border-none">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0"
          >
            <div className="flex flex-col min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-foreground leading-tight truncate">{t.dashboard.greeting} {user?.name?.split(' ')[0] || userRole}</h1>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-muted-foreground hidden sm:block truncate">{t.dashboard.subtitle}</p>
              <p className="text-[10px] text-slate-500 dark:text-muted-foreground sm:hidden truncate">{userRole}</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="hidden md:flex items-center gap-4 flex-1 max-w-xl mx-4"
          >
            <button 
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-3 px-6 py-2.5 w-full bg-white/70 dark:bg-secondary/50 hover:bg-white dark:hover:bg-secondary rounded-full shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-white/50 dark:border-border/50 text-sm text-slate-500 dark:text-muted-foreground transition-all duration-300"
            >
              <Search className="w-4 h-4" />
              <span>{t.topbar.searchPlaceholder.split('...')[0]}...</span>
            </button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="flex items-center gap-1 sm:gap-4 shrink-0"
          >
            <button 
              onClick={() => setCommandPaletteOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:bg-white/50 rounded-full"
            >
              <Search className="w-5 h-5" />
            </button>
            <NotificationBell />
            <TopBarProfile isDashboard={false} />
          </motion.div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-[100vw] overflow-x-hidden relative z-10">
          {children}
        </main>
      </div>

      <BottomNav userRole={userRole} />
      <CommandPalette />
      <NotificationDrawer />
      <ProfileModal />
      <AiFinancialAdvisor />
    </div>
  )
}
