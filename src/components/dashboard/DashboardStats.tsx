import { ArrowUpRight, ArrowDownRight, Wallet, Users, FileText, CheckCircle2 } from 'lucide-react'

export function DashboardStats() {
  const stats = [
    {
      title: "Total Anggaran",
      value: "Rp 1.2M",
      trend: "+12%",
      trendLabel: "dari tahun lalu",
      trendUp: true,
      icon: <Wallet className="w-5 h-5 text-white" />,
      color: "bg-indigo-500"
    },
    {
      title: "Total Realisasi",
      value: "Rp 450Jt",
      trend: "+5%",
      trendLabel: "dari bulan lalu",
      trendUp: true,
      icon: <FileText className="w-5 h-5 text-white" />,
      color: "bg-rose-500"
    },
    {
      title: "Menunggu Persetujuan",
      value: "12 Transaksi",
      trend: "-2%",
      trendLabel: "dari minggu lalu",
      trendUp: false,
      icon: <CheckCircle2 className="w-5 h-5 text-white" />,
      color: "bg-emerald-500"
    },
    {
      title: "Total Pengguna",
      value: "48 Orang",
      trend: "+4%",
      trendLabel: "dari bulan lalu",
      trendUp: true,
      icon: <Users className="w-5 h-5 text-white" />,
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
      {stats.map((stat, i) => (
        <div key={i} className="bg-card rounded-2xl p-4 flex justify-between items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-border/50">
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
            <p className="text-sm flex items-center gap-1">
              <span className={`font-bold flex items-center ${stat.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend}
              </span>
              <span className="text-muted-foreground">{stat.trendLabel}</span>
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md ${stat.color}`}>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  )
}
