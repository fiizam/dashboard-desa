"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LogOut, User, ChevronDown } from 'lucide-react'
import { logout } from '@/server/actions/auth'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/server/actions/profile'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n'

export function TopBarProfile({ isDashboard = false }: { isDashboard?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const t = useTranslation()

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => getProfile()
  })

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (isLoading) {
    return (
      <div className="w-9 h-9 rounded-full bg-secondary/50 animate-pulse" />
    )
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-1.5 rounded-xl transition-colors ${
          isDashboard ? 'hover:bg-white/10' : 'hover:bg-secondary'
        }`}
      >
        {user.avatarUrl ? (
          <Image 
            src={user.avatarUrl} 
            alt={user.name} 
            width={32} 
            height={32} 
            className="rounded-lg object-cover w-8 h-8"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            {user.name.charAt(0)}
          </div>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${isDashboard ? 'text-white' : 'text-muted-foreground'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden z-50 origin-top-right"
          >
            <div className="p-4 border-b border-border/50">
              <p className="font-semibold text-sm line-clamp-1">{user.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{user.email}</p>
            </div>
            <div className="p-2 flex flex-col gap-1">
              <Link 
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-xl transition-colors group"
              >
                <User className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                {t.topbar.profileDetail}
              </Link>
              <form action={logout} className="w-full">
                <button 
                  type="submit"
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t.topbar.logout}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
