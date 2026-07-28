"use client"
import { BarChart, Bar, ResponsiveContainer, YAxis } from 'recharts'

interface SoftBreakdownChartProps {
  data: { name: string; val1: number; val2: number; val3: number; val4: number }[]
}

export function SoftBreakdownChart({ data }: SoftBreakdownChartProps) {
  return (
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
  )
}
