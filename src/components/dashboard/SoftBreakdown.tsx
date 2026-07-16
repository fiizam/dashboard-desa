"use client"
import { BarChart, Bar, ResponsiveContainer, YAxis, Tooltip } from 'recharts'
import { ArrowUp, ArrowDown } from 'lucide-react'
import Link from 'next/link'

const data = [
  { name: 'Pemdes', val1: 40, val2: 20, val3: 10, val4: 5 },
  { name: 'Pembangunan', val1: 20, val2: 40, val3: 15, val4: 5 },
  { name: 'Pembinaan', val1: 10, val2: 15, val3: 40, val4: 2 },
  { name: 'Pemberdayaan', val1: 5, val2: 10, val3: 5, val4: 50 },
]

export function SoftBreakdown() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Chart Section */}
      <div className="bg-white/70 dark:bg-secondary/50 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.05)] border border-white/50 dark:border-border/50">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-2">
          <h3 className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest leading-relaxed">Kategori Belanja</h3>
          <Link href="/laporan" className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-foreground transition-colors shrink-0 whitespace-nowrap">Laporan Penuh {`>`}</Link>
        </div>

        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-end gap-6 h-auto 2xl:h-48 relative">
          {/* Chart */}
          <div className="w-full 2xl:w-1/2 h-48 2xl:h-full relative shrink-0 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} 
                />
                <Bar dataKey="val1" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={8} />
                <Bar dataKey="val2" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={8} />
                <Bar dataKey="val3" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={8} />
                <Bar dataKey="val4" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="w-full 2xl:w-1/2 flex flex-col gap-3 pb-2 shrink-0 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-muted-foreground">Pembangunan</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-foreground">76</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-muted-foreground">Pemdes</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-foreground">48</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-muted-foreground">Pemberdayaan</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-foreground">16</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-muted-foreground">Pembinaan</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-foreground">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/70 dark:bg-secondary/50 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.05)] border border-white/50 dark:border-border/50">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-2">
          <h3 className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest leading-relaxed">Realisasi per Wilayah</h3>
          <Link href="/laporan" className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-foreground transition-colors shrink-0 whitespace-nowrap">Lihat Semua {`>`}</Link>
        </div>

        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-slate-400 dark:text-muted-foreground border-b border-border/30">
              <th className="pb-4 font-medium">Wilayah</th>
              <th className="pb-4 font-medium text-right">Kegiatan Aktif</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/30">
              <td className="py-4 font-bold text-slate-800 dark:text-foreground">Dusun I</td>
              <td className="py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="font-bold text-slate-800 dark:text-foreground">76</span>
                  <span className="flex items-center text-emerald-500 text-xs font-bold"><ArrowUp className="w-3 h-3" /> 16,7%</span>
                </div>
              </td>
            </tr>
            <tr className="border-b border-border/30">
              <td className="py-4 font-bold text-slate-800 dark:text-foreground">Dusun II</td>
              <td className="py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="font-bold text-slate-800 dark:text-foreground">45</span>
                  <span className="flex items-center text-emerald-500 text-xs font-bold"><ArrowUp className="w-3 h-3" /> 3,23%</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-4 font-bold text-slate-800 dark:text-foreground">Dusun III</td>
              <td className="py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="font-bold text-slate-800 dark:text-foreground">3</span>
                  <span className="flex items-center text-rose-500 text-xs font-bold"><ArrowDown className="w-3 h-3" /> 5,44%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
