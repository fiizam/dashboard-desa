import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react'

export function TaskModal({ onClose }: { onClose: () => void }) {
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white/70 dark:bg-secondary/50 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 dark:border-border/50 overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-secondary/80 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 dark:text-foreground mb-1">Tambah Tugas</h2>
        <p className="text-sm text-slate-500 dark:text-muted-foreground mb-6">Berikan tugas untuk staf atau Anda sendiri.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-foreground mb-1.5">Nama Tugas</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border border-border/50 bg-white/50 dark:bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              placeholder="Contoh: Cetak SPP Tahap I" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-foreground mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" /> Tenggat Waktu
              </label>
              <input 
                type="date" 
                required
                className="w-full px-4 py-3 rounded-xl border border-border/50 bg-white/50 dark:bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-foreground mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-500" /> Prioritas
              </label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-border/50 bg-white/50 dark:bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm appearance-none"
              >
                <option value="low">Rendah (Low)</option>
                <option value="medium">Sedang (Medium)</option>
                <option value="high">Tinggi (High)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-foreground mb-1.5">Deskripsi</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border/50 bg-white/50 dark:bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none"
              placeholder="Detail tugas..." 
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSuccess}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-[0_8px_30px_-10px_rgba(var(--primary),0.3)] hover:opacity-90 transition-all active:scale-[0.98]"
            >
              {isSuccess ? <CheckCircle2 className="w-5 h-5 animate-pulse" /> : "Simpan Tugas"}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/90 dark:bg-background/90 flex flex-col items-center justify-center z-10"
            >
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-foreground">Tugas Dibuat!</h3>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
