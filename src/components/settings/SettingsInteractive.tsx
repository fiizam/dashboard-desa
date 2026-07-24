"use client"

import { useState } from 'react'
import { flushSync } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Palette, BellRing, ShieldCheck, Database, 
  Monitor, Moon, Sun, Globe, CalendarDays,
  Smartphone, Save, CheckCircle2, AlertCircle
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { generateBackup } from '@/server/actions/settings'
import { logout } from '@/server/actions/auth'
import { useTranslation } from '@/lib/i18n'

export function SettingsInteractive() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security'>('general')
  const [saving, setSaving] = useState(false)
  const [toastMessage, setToastMessage] = useState<{title: string, desc: string, type: 'success' | 'error'} | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  // Bind to global Zustand store
  const { 
    theme, setTheme, 
    language, setLanguage, 
    activeYear, setActiveYear, 
    emailNotif, setEmailNotif, 
    systemNotif, setSystemNotif 
  } = useAppStore()

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      showToast('Berhasil Disimpan', 'Semua pengaturan preferensi Anda telah diperbarui.', 'success')
    }, 800)
  }

  const showToast = (title: string, desc: string, type: 'success' | 'error') => {
    setToastMessage({ title, desc, type })
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (theme === newTheme) return;
    
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
      // Synchronously update the DOM so the view transition captures the new state
      const root = document.documentElement;
      if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    });
  }

  const handleDownloadBackup = async () => {
    setIsDownloading(true)
    const result = await generateBackup()
    
    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `apbdes-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      showToast('Backup Berhasil', 'Data berhasil diunduh ke perangkat Anda.', 'success')
    } else {
      showToast('Gagal Backup', result.error || 'Terjadi kesalahan sistem.', 'error')
    }
    setIsDownloading(false)
  }

  const t = useTranslation()

  const tabs = [
    { id: 'general', label: t.settings.tabs.general, icon: Palette },
    { id: 'notifications', label: t.settings.tabs.notifications, icon: BellRing },
    { id: 'security', label: t.settings.tabs.security, icon: ShieldCheck },
  ] as const

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group text-left ${
                isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:bg-secondary/50'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-tab"
                  className="absolute inset-0 bg-primary/10 -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
              <span className={isActive ? '' : 'group-hover:text-foreground transition-colors'}>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-card border border-border/50 rounded-3xl p-6 sm:p-8 min-h-[500px] shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full flex flex-col"
          >
            {activeTab === 'general' && (
              <div className="space-y-8 flex-1">
                <div>
                  <h2 className="text-xl font-semibold mb-4">{t.settings.general.themeTitle}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button 
                      onClick={() => handleThemeChange('light')}
                      className={`p-4 rounded-2xl border-2 text-left flex flex-col gap-3 transition-all ${
                        theme === 'light' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-border'
                      }`}
                    >
                      <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <p className="font-medium">{t.settings.general.themeLight}</p>
                        <p className="text-xs text-muted-foreground">{t.settings.general.themeLightDesc}</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleThemeChange('dark')}
                      className={`p-4 rounded-2xl border-2 text-left flex flex-col gap-3 transition-all ${
                        theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-border'
                      }`}
                    >
                      <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <p className="font-medium">{t.settings.general.themeDark}</p>
                        <p className="text-xs text-muted-foreground">{t.settings.general.themeDarkDesc}</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleThemeChange('system')}
                      className={`p-4 rounded-2xl border-2 text-left flex flex-col gap-3 transition-all ${
                        theme === 'system' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-border'
                      }`}
                    >
                      <Monitor className={`w-6 h-6 ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <p className="font-medium">{t.settings.general.themeSystem}</p>
                        <p className="text-xs text-muted-foreground">{t.settings.general.themeSystemDesc}</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">{t.settings.general.regionalTitle}</h2>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{t.settings.general.language}</p>
                        <p className="text-sm text-muted-foreground">{t.settings.general.languageDesc}</p>
                      </div>
                    </div>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as 'id' | 'en')}
                      className="px-4 py-2 rounded-xl bg-background border border-border outline-none focus:border-primary text-sm font-medium min-w-[140px]"
                    >
                      <option value="id">Indonesia (ID)</option>
                      <option value="en">English (US)</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{t.settings.general.year}</p>
                        <p className="text-sm text-muted-foreground">{t.settings.general.yearDesc}</p>
                      </div>
                    </div>
                    <select 
                      value={activeYear}
                      onChange={(e) => setActiveYear(e.target.value)}
                      className="px-4 py-2 rounded-xl bg-background border border-border outline-none focus:border-primary text-sm font-medium min-w-[140px]"
                    >
                      <option value="2024">2024 ({t.settings.general.yearActive})</option>
                      <option value="2023">2023 ({t.settings.general.yearArchive})</option>
                      <option value="2022">2022 ({t.settings.general.yearArchive})</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 flex-1">
                <div>
                  <h2 className="text-xl font-semibold mb-4">{t.settings.notifications.title}</h2>
                  
                  <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50 mb-4">
                    <div>
                      <p className="font-medium">{t.settings.notifications.email}</p>
                      <p className="text-sm text-muted-foreground">{t.settings.notifications.emailDesc}</p>
                    </div>
                    <button 
                      onClick={() => setEmailNotif(!emailNotif)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${emailNotif ? 'bg-primary' : 'bg-border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${emailNotif ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                    <div>
                      <p className="font-medium">{t.settings.notifications.system}</p>
                      <p className="text-sm text-muted-foreground">{t.settings.notifications.systemDesc}</p>
                    </div>
                    <button 
                      onClick={() => setSystemNotif(!systemNotif)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${systemNotif ? 'bg-primary' : 'bg-border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${systemNotif ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 flex-1">
                <div>
                  <h2 className="text-xl font-semibold mb-4">{t.settings.security.title}</h2>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{t.settings.security.backup}</p>
                        <p className="text-sm text-muted-foreground">{t.settings.security.backupDesc}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleDownloadBackup}
                      disabled={isDownloading}
                      className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-xl transition-colors text-sm whitespace-nowrap disabled:opacity-50"
                    >
                      {isDownloading ? t.settings.security.processing : t.settings.security.downloadBtn}
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{t.settings.security.session}</p>
                        <p className="text-sm text-muted-foreground">{t.settings.security.sessionDesc}</p>
                      </div>
                    </div>
                    <form action={logout}>
                      <button className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-medium rounded-xl transition-colors text-sm whitespace-nowrap">
                        {t.settings.security.logoutBtn}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 mt-auto border-t border-border/50 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all shadow-sm shadow-primary/25 disabled:opacity-70"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? t.settings.saving : t.settings.save}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-card border border-border/50 shadow-2xl rounded-2xl"
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500" />
            )}
            <div>
              <p className="font-semibold text-sm">{toastMessage.title}</p>
              <p className="text-xs text-muted-foreground">{toastMessage.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
