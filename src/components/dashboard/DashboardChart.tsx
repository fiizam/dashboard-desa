"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { useState, useEffect } from 'react'

const data = [
  { name: 'Apr', realisasi: 50 },
  { name: 'May', realisasi: 40 },
  { name: 'Jun', realisasi: 300 },
  { name: 'Jul', realisasi: 220 },
  { name: 'Aug', realisasi: 500 },
  { name: 'Sep', realisasi: 250 },
  { name: 'Oct', realisasi: 400 },
  { name: 'Nov', realisasi: 230 },
  { name: 'Dec', realisasi: 500 },
]

export function DashboardChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-[300px] w-full animate-pulse bg-secondary/50 rounded-xl" />

  return (
    <div className="bg-card rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-border/50 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">Realisasi APBDes Overview</h3>
        <p className="text-sm text-muted-foreground">
          <span className="text-emerald-500 font-bold">+4% lebih tinggi</span> pada tahun 2024
        </p>
      </div>
      
      <div className="flex-1 min-h-[300px] w-full relative -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRealisasi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="realisasi" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRealisasi)" 
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
