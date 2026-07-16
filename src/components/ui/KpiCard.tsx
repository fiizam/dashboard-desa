"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon: React.ReactNode
  delay?: number
}

export function KpiCard({ title, value, trend, icon, delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity [&>svg]:w-24 [&>svg]:h-24 [&>svg]:text-primary [&>svg]:transform [&>svg]:translate-x-4 [&>svg]:-translate-y-4">
        {icon}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-primary/10 rounded-xl [&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-primary">
          {icon}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 relative z-10">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        
        {trend && (
          <div className="flex items-center gap-1.5 text-sm">
            <span className={`flex items-center font-medium ${trend.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend.isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
              {trend.value}%
            </span>
            <span className="text-muted-foreground">vs bulan lalu</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
