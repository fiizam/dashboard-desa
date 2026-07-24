"use client"

import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Users, Wallet, FileText, Settings, 
  Pin, PinOff, Search, LogOut, X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/server/actions/profile'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'

export function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname()
  const isPinned = useAppStore(s => s.isSidebarPinned)
  const setPinned = useAppStore(s => s.setSidebarPinned)
  const setCommandOpen = useAppStore(s => s.setCommandPaletteOpen)
  const isMobileMenuOpen = useAppStore(s => s.isMobileMenuOpen)
  const setMobileMenuOpen = useAppStore(s => s.setMobileMenuOpen)
  const isHovered = useAppStore(s => s.isSidebarHovered)
  const setIsHovered = useAppStore(s => s.setSidebarHovered)
  const t = useTranslation()
  
  const [mounted, setMounted] = useState(false)

  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => getProfile()
  })

  useEffect(() => setMounted(true), [])

  // On desktop: expanded if pinned or hovered. On mobile: expanded if mobile menu is open
  const isExpanded = isPinned || isHovered || isMobileMenuOpen

  const menuItems = [
    { label: t.sidebar.dashboard, href: '/', icon: LayoutDashboard, roles: ['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Sekretaris', 'Bendahara'] },
    { label: t.sidebar.keuangan, href: '/keuangan', icon: Wallet, roles: ['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Bendahara'] },
    { label: t.sidebar.masterData, href: '/master', icon: Users, roles: ['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Sekretaris'] },
    { label: t.sidebar.laporan, href: '/laporan', icon: FileText, roles: ['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Sekretaris', 'Bendahara'] },
    { label: t.sidebar.pengaturan, href: '/settings', icon: Settings, roles: ['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Sekretaris', 'Bendahara'] },
  ]

  const visibleMenus = menuItems.filter(m => m.roles.includes(userRole))

  if (!mounted) return null

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => {
              setIsHovered(false)
              setMobileMenuOpen(false)
            }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        onMouseEnter={() => !isPinned && setIsHovered(true)}
        onMouseLeave={() => !isPinned && setIsHovered(false)}
        initial={false}
        animate={{ 
          width: isExpanded ? 280 : 96,
          x: isMobileMenuOpen ? 0 : 'var(--mobile-x, 0px)' 
        }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className="fixed top-6 left-6 bottom-6 rounded-3xl bg-white/70 dark:bg-secondary/70 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50 dark:border-border/50 z-50 flex flex-col overflow-hidden -translate-x-[150%] lg:translate-x-0"
        style={{
          // On mobile, default to hidden off screen unless isMobileMenuOpen is true
          transform: isMobileMenuOpen ? 'translateX(0)' : ''
        }}
      >
        <div className="h-20 flex items-center justify-between px-4 shrink-0 mt-2">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 shrink-0 relative flex items-center justify-center bg-white rounded-xl overflow-hidden p-1">
              <Image 
                src="/logo.png" 
                alt="Digital Village Logo" 
                fill
                className="object-contain drop-shadow-sm"
              />
            </div>
            <AnimatePresence mode="popLayout">
              {isExpanded && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold text-lg whitespace-nowrap"
                >
                  Digital Village
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <button
                  onClick={() => setPinned(!isPinned)}
                  className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hidden lg:block"
                >
                  {isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground lg:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 no-scrollbar">
          {isExpanded && (
            <p className="px-4 text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest mb-4">Main</p>
          )}
          {visibleMenus.map(item => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive ? 'text-slate-800 dark:text-foreground font-bold' : 'text-slate-500 hover:text-slate-700 dark:text-muted-foreground dark:hover:text-foreground'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-sidebar-pill"
                      className="absolute inset-0 bg-white dark:bg-secondary rounded-2xl shadow-[0_8px_20px_-10px_rgba(0,0,0,0.1)] dark:shadow-none -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-slate-800 dark:text-foreground' : 'group-hover:text-slate-700 dark:group-hover:text-foreground'}`} />
                
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className={`whitespace-nowrap overflow-hidden ${isActive ? 'text-slate-800 dark:text-foreground' : 'group-hover:text-slate-700 dark:group-hover:text-foreground'}`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {!isExpanded && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white dark:bg-foreground dark:text-background text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 hidden lg:block shadow-lg">
                      {item.label}
                    </div>
                  )}
                </Link>

                {/* Sub items simulation for active Dashboard */}
                {isActive && item.href === '/' && isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="ml-6 pl-4 border-l-2 border-slate-200 dark:border-border/50 flex flex-col gap-3 mt-3 mb-2"
                  >
                    <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Activity</a>
                    <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Statistic</a>
                    <a href="#" className="text-sm font-bold text-slate-800 bg-white/50 px-3 py-1.5 rounded-lg w-max">Performance Cases</a>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>

        <div className="p-4 shrink-0 mt-auto">
          <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-2xl bg-white/50 dark:bg-secondary/30 hover:bg-white dark:hover:bg-secondary transition-all duration-300 shadow-sm border border-white/50 dark:border-border/50 group">
            {user ? (
              <>
                {user.avatarUrl ? (
                  <Image 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    width={40} 
                    height={40} 
                    className="rounded-xl object-cover w-10 h-10 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-800 dark:bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                )}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex flex-col overflow-hidden whitespace-nowrap"
                    >
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.role.name}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="w-10 h-10 shrink-0 rounded-xl bg-secondary animate-pulse" />
            )}
          </Link>
        </div>
      </motion.aside>
    </>
  )
}
