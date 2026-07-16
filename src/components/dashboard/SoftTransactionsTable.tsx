import { Paperclip, Check } from 'lucide-react'
import Link from 'next/link'

const cases = [
  {
    id: 1,
    name: "Pencairan Dana Desa Tahap I",
    date: "Mei 18, 2026 - Mei 25, 2026",
    priority: "Low",
    attachment: "SPP_Tahap_1.pdf",
    assignee: "A",
  },
  {
    id: 2,
    name: "Pembayaran Honor Perangkat",
    date: "Mei 18, 2026 - Mei 25, 2026",
    priority: "Medium",
    attachment: "Daftar_Honor.xlsx",
    assignee: "B",
  },
  {
    id: 3,
    name: "Pengadaan Alat Tulis Kantor",
    date: "Mei 19, 2026 - Mei 26, 2026",
    priority: "Low",
    attachment: "Nota_Pembelian.jpg",
    assignee: "C",
  },
]

export function SoftTransactionsTable() {
  return (
    <div className="bg-white/70 dark:bg-secondary/50 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.05)] border border-white/50 dark:border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest">Daftar Transaksi Tertunda</h3>
        <Link href="/keuangan" className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-foreground transition-colors">Lihat Semua {`>`}</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="text-slate-400 dark:text-muted-foreground border-b border-border/30 whitespace-nowrap">
              <th className="pb-4 font-medium pl-2 pr-4 w-10">
                <div className="relative flex items-center justify-center w-5 h-5 group/checkbox cursor-pointer">
                  <input type="checkbox" className="peer absolute w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="w-5 h-5 border-2 border-slate-300 dark:border-border rounded-[6px] peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center group-hover/checkbox:border-primary/50">
                    <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                  </div>
                </div>
              </th>
              <th className="pb-4 font-medium px-4">Nama Transaksi</th>
              <th className="pb-4 font-medium px-4">Tanggal</th>
              <th className="pb-4 font-medium px-4 text-center">Prioritas</th>
              <th className="pb-4 font-medium px-4">Lampiran</th>
              <th className="pb-4 font-medium pl-4 text-center">Pemroses</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c, i) => (
              <tr key={c.id} className="group border-b border-border/30 last:border-0 hover:bg-white/50 dark:hover:bg-secondary/50 transition-colors">
                <td className="py-4 pl-2 pr-4">
                  <div className="relative flex items-center justify-center w-5 h-5 group/checkbox cursor-pointer">
                    <input type="checkbox" defaultChecked={i === 0} className="peer absolute w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="w-5 h-5 border-2 border-slate-300 dark:border-border rounded-[6px] peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center group-hover/checkbox:border-primary/50 shadow-sm">
                      <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                    </div>
                  </div>
                </td>
                <td className="py-4 font-bold text-slate-800 dark:text-foreground whitespace-nowrap px-4">{c.name}</td>
                <td className="py-4 text-slate-500 dark:text-muted-foreground whitespace-nowrap px-4">{c.date}</td>
                <td className="py-4 text-center whitespace-nowrap px-4">
                  <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${
                    c.priority === 'Low' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {c.priority}
                  </span>
                </td>
                <td className="py-4 text-slate-500 dark:text-muted-foreground whitespace-nowrap px-4">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 shrink-0" />
                    <span>{c.attachment}</span>
                  </div>
                </td>
                <td className="py-4 pl-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shadow-sm mx-auto shrink-0">
                    {c.assignee}
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
