"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface ChartData {
  name: string
  pendapatan: number
  pengeluaran: number
}

export function DashboardChartWrapper({ data }: { data: ChartData[] }) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              if (value >= 1000000000) return `Rp${(value / 1000000000).toFixed(1)}M`
              if (value >= 1000000) return `Rp${(value / 1000000).toFixed(0)}Jt`
              return `Rp${value}`
            }}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
            itemStyle={{ color: '#e5e7eb' }}
            formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
          />
          <Area
            type="monotone"
            dataKey="pendapatan"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorPendapatan)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="pengeluaran"
            stroke="#f43f5e"
            fillOpacity={1}
            fill="url(#colorPengeluaran)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
