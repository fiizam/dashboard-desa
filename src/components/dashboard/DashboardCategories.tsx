import { Laptop, Ticket, AlertTriangle, Smile, ChevronRight } from 'lucide-react'

const categories = [
  {
    id: 1,
    title: "Penyelenggaraan Pemdes",
    subtitle: "250 program aktif, 346 selesai",
    icon: <Laptop className="w-4 h-4 text-white" />,
  },
  {
    id: 2,
    title: "Pelaksanaan Pembangunan",
    subtitle: "123 dalam proses, 15 menunggu",
    icon: <Ticket className="w-4 h-4 text-white" />,
  },
  {
    id: 3,
    title: "Pembinaan Kemasyarakatan",
    subtitle: "1 laporan aktif, 40 selesai",
    icon: <AlertTriangle className="w-4 h-4 text-white" />,
  },
  {
    id: 4,
    title: "Pemberdayaan Masyarakat",
    subtitle: "+430 warga berpartisipasi",
    icon: <Smile className="w-4 h-4 text-white" />,
  },
]

export function DashboardCategories() {
  return (
    <div className="bg-card rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-border/50 h-full p-6">
      <h3 className="text-lg font-bold text-foreground mb-6">Kategori Belanja</h3>
      
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                {cat.icon}
              </div>
              <div>
                <p className="font-bold text-foreground text-sm mb-0.5 group-hover:text-primary transition-colors">{cat.title}</p>
                <p className="text-xs text-muted-foreground">{cat.subtitle}</p>
              </div>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
