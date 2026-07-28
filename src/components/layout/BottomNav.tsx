"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Wallet, ClipboardList, IdCard } from 'lucide-react'
import { CustomDashboardIcon } from '@/components/icons/CustomDashboardIcon'
import { useTranslation } from '@/lib/i18n'

export function BottomNav({ userRole }: { userRole: string }) {
  const pathname = usePathname()
  const t = useTranslation()

  const menuItems = [
    { label: t.bottomNav.beranda, href: '/', icon: CustomDashboardIcon, roles: ['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Sekretaris', 'Bendahara'] },
    { label: t.bottomNav.keuangan, href: '/keuangan', icon: Wallet, roles: ['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Bendahara'] },
    { label: t.bottomNav.warga, href: '/kependudukan', icon: IdCard, roles: ['Super Admin', 'Ketua RW', 'Sekretaris'] },
    { label: t.bottomNav.master, href: '/master', icon: Users, roles: ['Super Admin', 'Ketua RW'] },
    { label: t.bottomNav.laporan, href: '/laporan', icon: ClipboardList, roles: ['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Sekretaris', 'Bendahara'] },
  ]

  const visibleMenus = menuItems.filter(m => m.roles.includes(userRole))

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 flex justify-center pointer-events-none" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="pointer-events-auto w-full max-w-[420px] flex items-center p-1.5 h-[70px] bg-white/70 dark:bg-[#111111]/70 backdrop-blur-2xl rounded-[28px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] border border-slate-200/50 dark:border-white/10"
      >
        {visibleMenus.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-1 flex-col items-center justify-center h-full transition-all duration-300 z-10 ${
                isActive ? 'text-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 bg-slate-900 dark:bg-white rounded-[22px] shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon 
                className={`w-[22px] h-[22px] relative z-20 transition-all duration-300 ${isActive ? '-translate-y-[2px]' : ''}`} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              
              <AnimatePresence>
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8, y: 2 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 2 }}
                    className="text-[9px] font-bold relative z-20 truncate max-w-full px-1 mt-[2px] tracking-wide"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </motion.nav>
    </div>
  )
}
