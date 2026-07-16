import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react'

export function DashboardFeatured() {
  return (
    <div className="bg-card rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-border/50 h-full overflow-hidden relative min-h-[350px] flex flex-col justify-end p-6 group">
      {/* Background Gradient/Image simulation */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-800 to-black z-0" />
      
      {/* Abstract Shapes */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl z-0" />
      <div className="absolute top-20 right-20 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl z-0" />
      
      <div className="relative z-10 text-white">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
          <ArrowRight className="w-5 h-5 text-white" />
        </div>
        
        <h3 className="text-xl font-bold mb-2">Transparansi Keuangan Desa</h3>
        <p className="text-white/80 text-sm mb-4 leading-relaxed line-clamp-3">
          Membangun kepercayaan publik melalui pelaporan yang akurat dan terbuka. 
          Desa yang kuat berawal dari tata kelola yang transparan dan partisipatif.
        </p>
        
        <button className="flex items-center gap-2 text-sm font-semibold hover:text-white/80 transition-colors">
          Pelajari Lebih Lanjut <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Carousel Controls (Visual only) */}
      <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
        <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
