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

const data = [
  { name: "Jan", pendapatan: 4000, pengeluaran: 2400 },
  { name: "Feb", pendapatan: 3000, pengeluaran: 1398 },
  { name: "Mar", pendapatan: 2000, pengeluaran: 9800 },
  { name: "Apr", pendapatan: 2780, pengeluaran: 3908 },
  { name: "Mei", pendapatan: 1890, pengeluaran: 4800 },
  { name: "Jun", pendapatan: 2390, pengeluaran: 3800 },
  { name: "Jul", pendapatan: 3490, pengeluaran: 4300 },
]

export function DashboardChart() {
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
            tickFormatter={(value) => `Rp${value}`}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
            itemStyle={{ color: '#e5e7eb' }}
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
