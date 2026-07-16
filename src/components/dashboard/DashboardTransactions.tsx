import { ArrowDownRight, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react'

const transactions = [
  {
    id: 1,
    title: "Pendapatan Asli Desa",
    type: "Pendapatan",
    amount: "Rp 150.000.000",
    status: "Selesai",
    progress: 100,
  },
  {
    id: 2,
    title: "Pembangunan Jalan",
    type: "Belanja",
    amount: "Rp 45.000.000",
    status: "Diproses",
    progress: 40,
  },
  {
    id: 3,
    title: "Dana Desa (Pusat)",
    type: "Pendapatan",
    amount: "Rp 320.000.000",
    status: "Selesai",
    progress: 100,
  },
  {
    id: 4,
    title: "Pengadaan Bibit",
    type: "Belanja",
    amount: "Rp 15.500.000",
    status: "Pending",
    progress: 23,
  },
]

export function DashboardTransactions() {
  return (
    <div className="bg-card rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-border/50 h-full">
      <div className="p-6 border-b border-border/50">
        <h3 className="text-lg font-bold text-foreground">Transaksi Terbaru</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
            <tr>
              <th className="px-6 py-4 font-medium">Transaksi</th>
              <th className="px-6 py-4 font-medium">Nominal</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Kelengkapan</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx, idx) => (
              <tr key={trx.id} className={idx !== transactions.length - 1 ? 'border-b border-border/50' : ''}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      trx.type === 'Pendapatan' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {trx.type === 'Pendapatan' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{trx.title}</p>
                      <p className="text-xs text-muted-foreground">{trx.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-foreground">{trx.amount}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    {trx.status === 'Selesai' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500" />
                    )}
                    {trx.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{trx.progress}%</span>
                    <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${trx.progress === 100 ? 'bg-emerald-500' : trx.progress > 30 ? 'bg-blue-500' : 'bg-amber-500'}`}
                        style={{ width: `${trx.progress}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
