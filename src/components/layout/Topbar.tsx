"use client"

import { Bell, Search, Settings, ChevronDown, User } from 'lucide-react'

export function Topbar() {
  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Cari transaksi, program, laporan... (Ctrl+K)" 
            className="w-full pl-9 pr-4 py-2 bg-secondary/50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
        </button>
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="h-6 w-px bg-border mx-2" />
        <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary/50 p-1.5 rounded-xl transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium leading-none mb-1">Admin Keuangan</p>
            <p className="text-xs text-muted-foreground leading-none">Desa Sukamaju</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  )
}
