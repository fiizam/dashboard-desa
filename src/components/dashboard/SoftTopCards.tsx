"use client"
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { getProfile } from '@/server/actions/profile'
import { useQuery } from '@tanstack/react-query'

const dataGreen = [{v: 10}, {v: 15}, {v: 12}, {v: 25}, {v: 22}, {v: 30}, {v: 28}, {v: 35}]
const dataRed = [{v: 35}, {v: 30}, {v: 32}, {v: 25}, {v: 28}, {v: 20}, {v: 15}, {v: 10}]

export function SoftTopCards({ role }: { role: string }) {
  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => getProfile()
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

      {/* Revenue Card */}
      <div className="bg-white/70 dark:bg-secondary/50 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.05)] border border-white/50 dark:border-border/50 flex flex-col justify-between relative overflow-hidden">
        <div>
          <p className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest mb-2">Total Pendapatan</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-foreground mb-1">Rp 1.2M</h3>
          <p className="text-xs text-slate-500 dark:text-muted-foreground">Tren bulan ini</p>
        </div>
        <div className="absolute top-6 right-6 text-emerald-500 font-bold text-sm bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
          +14,88%
        </div>
        <div className="h-16 w-32 absolute bottom-4 right-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataGreen}>
              <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-white/70 dark:bg-secondary/50 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.05)] border border-white/50 dark:border-border/50 flex flex-col justify-between relative overflow-hidden">
        <div>
          <p className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest mb-2">Total Belanja</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-foreground mb-1">Rp 450Jt</h3>
          <p className="text-xs text-slate-500 dark:text-muted-foreground">Tren bulan ini</p>
        </div>
        <div className="absolute top-6 right-6 text-rose-500 font-bold text-sm bg-rose-500/10 px-2.5 py-1 rounded-xl border border-rose-500/20">
          -5,67%
        </div>
        <div className="h-16 w-32 absolute bottom-4 right-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataRed}>
              <Line type="monotone" dataKey="v" stroke="#f43f5e" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
