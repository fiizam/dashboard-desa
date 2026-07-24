"use client"

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'

export function ThemeProvider() {
  const { theme } = useAppStore()
  const [mounted, setMounted] = useState(false)

  // Ensure hydration match
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const applyTheme = (isDark: boolean) => {
      const root = document.documentElement
      const updateDOM = () => {
        if (isDark) root.classList.add('dark')
        else root.classList.remove('dark')
      }

      // @ts-ignore - View Transition API might not be typed in this TS version
      if (!document.startViewTransition) {
        updateDOM()
        return
      }

      // @ts-ignore
      document.startViewTransition(() => updateDOM())
    }

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      applyTheme(systemTheme === 'dark')
    } else {
      applyTheme(theme === 'dark')
    }
  }, [theme, mounted])

  // Listen to system preference changes if in system mode
  useEffect(() => {
    if (!mounted || theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement
      const updateDOM = () => {
        if (e.matches) root.classList.add('dark')
        else root.classList.remove('dark')
      }
      // @ts-ignore
      if (!document.startViewTransition) {
        updateDOM()
        return
      }
      // @ts-ignore
      document.startViewTransition(() => updateDOM())
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, mounted])

  return null
}
