"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, Wallet, FileText, Settings, Shield } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function BottomNav({ userRole }: { userRole: string }) {
  const pathname = usePathname()
  const t = useTranslation()

  const menuItems = [
    { label: t.bottomNav.beranda, href: '/', icon: LayoutDashboard, roles: ['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Sekretaris', 'Bendahara'] },
    { label: t.bottomNav.keuangan, href: '/keuangan', icon: Wallet, roles: ['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Bendahara'] },
    { label: t.bottomNav.warga, href: '/kependudukan', icon: Users, roles: ['Super Admin', 'Ketua RW', 'Sekretaris'] },
    { label: t.bottomNav.master, href: '/master', icon: Shield, roles: ['Super Admin', 'Ketua RW'] },
    { label: t.bottomNav.laporan, href: '/laporan', icon: FileText, roles: ['Super Admin', 'Ketua RW', 'Wakil Ketua RW', 'Sekretaris', 'Bendahara'] },
  ]

  const visibleMenus = menuItems.filter(m => m.roles.includes(userRole))

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/80 dark:bg-background/80 backdrop-blur-xl border-t border-border/50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center justify-around px-2 h-16">
        {visibleMenus.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-300 ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'animate-bounce-subtle' : ''}`} />
              <span className="text-[10px] font-medium relative z-10 truncate max-w-full px-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
