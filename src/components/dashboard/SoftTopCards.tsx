"use client"
import { getProfile } from '@/server/actions/profile'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Wallet, ArrowUpRight, Activity } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function SoftTopCards({ role }: { role: string }) {
  const t = useTranslation()
  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => getProfile()
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

      {/* Revenue Card */}
      <div className="bg-white/70 dark:bg-secondary/50 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.05)] border border-white/50 dark:border-border/50 flex flex-col justify-between relative overflow-hidden">
        <div>
          <p className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest mb-2">{t.dashboard.cards.totalRevenue}</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-foreground mb-1">Rp 1.2M</h3>
          <p className="text-xs text-slate-500 dark:text-muted-foreground">Tren bulan ini</p>
        </div>
        <div className="absolute top-6 right-6 text-emerald-500 font-bold text-sm bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
          +14,88%
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-white/70 dark:bg-secondary/50 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.05)] border border-white/50 dark:border-border/50 flex flex-col justify-between relative overflow-hidden">
        <div>
          <p className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest mb-2">{t.dashboard.cards.totalExpenses}</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-foreground mb-1">Rp 450Jt</h3>
          <p className="text-xs text-slate-500 dark:text-muted-foreground">Tren bulan ini</p>
        </div>
        <div className="absolute top-6 right-6 text-rose-500 font-bold text-sm bg-rose-500/10 px-2.5 py-1 rounded-xl border border-rose-500/20">
          -5,67%
        </div>
      </div>
    </div>
  )
}
