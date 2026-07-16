"use client"
import { useState } from 'react'
import { Plus, Calendar as CalendarIcon, FileEdit } from 'lucide-react'
import { AgendaModal } from './AgendaModal'
import { TaskModal } from './TaskModal'

export function SoftRightPanel() {
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  return (
    <>
      {/* Calendar Section */}
      <div className="bg-white/70 dark:bg-secondary/50 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.05)] border border-white/50 dark:border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest">Agenda Desa</h3>
          <button 
            onClick={() => setIsAgendaModalOpen(true)}
            className="w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-foreground mb-4">SEN 16</p>
            <div className="space-y-4 border-l-2 border-slate-200 dark:border-border/50 pl-4 ml-2">
              <div className="relative">
                <div className="absolute top-1.5 -left-[21px] w-2.5 h-8 bg-emerald-500 rounded-full" />
                <h4 className="font-bold text-slate-800 dark:text-foreground text-sm">Musdes Tahap I</h4>
                <p className="text-xs text-slate-500 dark:text-muted-foreground">7:00 - 8.30</p>
              </div>
              <div className="relative">
                <div className="absolute top-1.5 -left-[21px] w-2.5 h-8 bg-blue-500 rounded-full" />
                <h4 className="font-bold text-slate-800 dark:text-foreground text-sm">Evaluasi APBDes</h4>
                <p className="text-xs text-slate-500 dark:text-muted-foreground">11:00 - 12.30</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-foreground mb-4">SEL 17</p>
            <div className="space-y-4 border-l-2 border-slate-200 dark:border-border/50 pl-4 ml-2">
              <div className="relative">
                <div className="absolute top-1.5 -left-[21px] w-2.5 h-8 bg-amber-500 rounded-full" />
                <h4 className="font-bold text-slate-800 dark:text-foreground text-sm">Kunjungan Kecamatan</h4>
                <p className="text-xs text-slate-500 dark:text-muted-foreground">14:00 - 15.30</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white/70 dark:bg-secondary/50 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.05)] border border-white/50 dark:border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest">Tugas Keuangan</h3>
          <button 
            onClick={() => setIsTaskModalOpen(true)}
            className="w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-muted-foreground mb-1">
              <span>Nama Tugas</span>
              <span>Tenggat</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="font-bold text-slate-800 dark:text-foreground text-sm truncate max-w-[150px]">Rekonsiliasi Bank</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-muted-foreground">Mei 20</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="font-bold text-slate-800 dark:text-foreground text-sm truncate max-w-[150px]">Cetak SPP Tahap I</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-muted-foreground">Mei 21</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="font-bold text-slate-800 dark:text-foreground text-sm truncate max-w-[150px]">Laporan Realisasi</span>
              </div>
              <FileEdit className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {isAgendaModalOpen && <AgendaModal onClose={() => setIsAgendaModalOpen(false)} />}
      {isTaskModalOpen && <TaskModal onClose={() => setIsTaskModalOpen(false)} />}
    </>
  )
}
