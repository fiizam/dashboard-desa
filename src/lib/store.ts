import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  isCommandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  isNotificationDrawerOpen: boolean
  setNotificationDrawerOpen: (open: boolean) => void
  isProfileModalOpen: boolean
  setProfileModalOpen: (open: boolean) => void
  isSidebarPinned: boolean
  setSidebarPinned: (pinned: boolean) => void
  isSidebarHovered: boolean
  setSidebarHovered: (hovered: boolean) => void
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void

  // Settings State
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  language: 'id' | 'en'
  setLanguage: (lang: 'id' | 'en') => void
  activeYear: string
  setActiveYear: (year: string) => void
  emailNotif: boolean
  setEmailNotif: (enabled: boolean) => void
  systemNotif: boolean
  setSystemNotif: (enabled: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  isNotificationDrawerOpen: false,
  setNotificationDrawerOpen: (open) => set({ isNotificationDrawerOpen: open }),
  isProfileModalOpen: false,
  setProfileModalOpen: (open) => set({ isProfileModalOpen: open }),
  isSidebarPinned: true, // Default to pinned on desktop
  setSidebarPinned: (pinned) => set({ isSidebarPinned: pinned }),
  isSidebarHovered: false,
  setSidebarHovered: (hovered) => set({ isSidebarHovered: hovered }),
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  // Initial Settings
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  language: 'id',
  setLanguage: (language) => set({ language }),
  activeYear: '2024',
  setActiveYear: (activeYear) => set({ activeYear }),
  emailNotif: true,
  setEmailNotif: (emailNotif) => set({ emailNotif }),
  systemNotif: true,
  setSystemNotif: (systemNotif) => set({ systemNotif }),
    }),
    {
      name: 'desa-sync-storage',
      // only persist settings, omit UI states like isSidebarHovered
      partialize: (state) => ({ 
        isSidebarPinned: state.isSidebarPinned,
        theme: state.theme,
        language: state.language,
        activeYear: state.activeYear,
        emailNotif: state.emailNotif,
        systemNotif: state.systemNotif
      }),
    }
  )
)
