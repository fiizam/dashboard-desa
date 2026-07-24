'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, Download, Plus, Filter, UserCheck, ChevronDown, X } from 'lucide-react'
import { WargaModal } from './WargaModal'

export function KependudukanInteractive({ initialStats, initialWarga, keluargaList }: { initialStats: any, initialWarga: any[], keluargaList: any[] }) {
  const [search, setSearch] = useState('')
  const [rtFilter, setRtFilter] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [warga, setWarga] = useState(initialWarga)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<any>(null)

  const filteredWarga = warga.filter((w: any) => {
    const matchSearch = w.nama.toLowerCase().includes(search.toLowerCase()) || w.nik.toLowerCase().includes(search.toLowerCase())
    const matchRt = rtFilter ? w.keluarga?.rt === rtFilter : true
    return matchSearch && matchRt
  })

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Data Kependudukan</h1>
          <p className="text-muted-foreground">Kelola Kartu Keluarga dan Demografi Warga RW.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-xl font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium transition-colors shadow-sm shadow-primary/25"
          >
            <Plus className="w-4 h-4" />
            Tambah Warga
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-3xl shadow-sm border border-border/40 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div className="font-semibold text-sm text-muted-foreground">Total Warga</div>
          </div>
          <div className="text-3xl font-bold">{initialStats.totalWarga}</div>
        </div>
        <div className="bg-card p-6 rounded-3xl shadow-sm border border-border/40 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="font-semibold text-sm text-muted-foreground">Total KK</div>
          </div>
          <div className="text-3xl font-bold">{initialStats.totalKeluarga}</div>
        </div>
        <div className="bg-card p-6 rounded-3xl shadow-sm border border-border/40 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="font-semibold text-sm text-muted-foreground">Laki-laki</div>
          </div>
          <div className="text-3xl font-bold">{initialStats.lakiLaki}</div>
        </div>
        <div className="bg-card p-6 rounded-3xl shadow-sm border border-border/40 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="font-semibold text-sm text-muted-foreground">Perempuan</div>
          </div>
          <div className="text-3xl font-bold">{initialStats.perempuan}</div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-card shadow-sm border border-border/40">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari NIK atau Nama..." 
              className="w-full pl-9 pr-4 py-2.5 bg-secondary/30 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-secondary/30 border border-border/50 rounded-xl text-sm font-medium hover:bg-secondary/50 transition-colors focus:outline-none"
            >
              <Filter className="w-4 h-4 text-muted-foreground" />
              {rtFilter ? `RT ${rtFilter}` : 'Semua RT'}
              <ChevronDown className="w-4 h-4 text-muted-foreground ml-2" />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-card border border-border shadow-xl rounded-xl overflow-hidden z-20"
                >
                  <div className="flex flex-col py-1">
                    <button onClick={() => { setRtFilter(''); setIsFilterOpen(false) }} className="px-4 py-2 text-sm text-left hover:bg-secondary transition-colors">Semua RT</button>
                    <button onClick={() => { setRtFilter('001'); setIsFilterOpen(false) }} className="px-4 py-2 text-sm text-left hover:bg-secondary transition-colors">RT 001</button>
                    <button onClick={() => { setRtFilter('002'); setIsFilterOpen(false) }} className="px-4 py-2 text-sm text-left hover:bg-secondary transition-colors">RT 002</button>
                    <button onClick={() => { setRtFilter('003'); setIsFilterOpen(false) }} className="px-4 py-2 text-sm text-left hover:bg-secondary transition-colors">RT 003</button>
                    <button onClick={() => { setRtFilter('004'); setIsFilterOpen(false) }} className="px-4 py-2 text-sm text-left hover:bg-secondary transition-colors">RT 004</button>
                    <button onClick={() => { setRtFilter('005'); setIsFilterOpen(false) }} className="px-4 py-2 text-sm text-left hover:bg-secondary transition-colors">RT 005</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 rounded-xl">
              <tr>
                <th className="px-4 py-4 rounded-tl-xl font-semibold">NIK</th>
                <th className="px-4 py-4 font-semibold">Nama Lengkap</th>
                <th className="px-4 py-4 font-semibold">Jenis Kelamin</th>
                <th className="px-4 py-4 font-semibold">No. KK / Status</th>
                <th className="px-4 py-4 font-semibold">RT/RW</th>
                <th className="px-4 py-4 rounded-tr-xl font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredWarga.map((w) => (
                  <motion.tr 
                    key={w.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border/40 hover:bg-secondary/10 transition-colors"
                  >
                    <td className="px-4 py-4 font-mono text-xs">{w.nik}</td>
                    <td className="px-4 py-4 font-medium text-foreground">{w.nama}</td>
                    <td className="px-4 py-4">{w.jenisKelamin}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground font-mono">{w.keluarga?.nomorKk}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary w-max">
                          {w.statusKeluarga}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">RT {w.keluarga?.rt} / RW {w.keluarga?.rw}</td>
                    <td className="px-4 py-4 text-right">
                      <button 
                        onClick={() => setSelectedDetail(w)}
                        className="text-primary text-xs font-medium hover:underline px-3 py-1.5 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {filteredWarga.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      Tidak ada data warga ditemukan.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <WargaModal 
            keluargaList={keluargaList} 
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false)
              window.location.reload()
            }}
          />
        )}

        {selectedDetail && (
          <>
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" onClick={() => setSelectedDetail(null)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border border-border shadow-2xl rounded-3xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50 bg-secondary/30">
                <div>
                  <h2 className="text-xl font-bold">Detail Warga</h2>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{selectedDetail.nik}</p>
                </div>
                <button onClick={() => setSelectedDetail(null)} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Nama Lengkap</div>
                    <div className="text-base font-semibold">{selectedDetail.nama}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Tempat, Tgl Lahir</div>
                      <div className="text-sm">{selectedDetail.tempatLahir}, {new Date(selectedDetail.tanggalLahir).toLocaleDateString('id-ID')}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Jenis Kelamin</div>
                      <div className="text-sm">{selectedDetail.jenisKelamin}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Agama</div>
                      <div className="text-sm">{selectedDetail.agama}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Status Perkawinan</div>
                      <div className="text-sm">{selectedDetail.statusPerkawinan}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Pendidikan / Pekerjaan</div>
                    <div className="text-sm">{selectedDetail.pendidikan} &bull; {selectedDetail.pekerjaan}</div>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-xl mt-4">
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Informasi Keluarga</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Status:</span>
                        <div className="text-sm font-medium">{selectedDetail.statusKeluarga}</div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">RT/RW:</span>
                        <div className="text-sm font-medium">RT {selectedDetail.keluarga?.rt} / RW {selectedDetail.keluarga?.rw}</div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <span className="text-xs text-muted-foreground block mb-1">No. Kartu Keluarga:</span>
                      <div className="text-sm font-mono font-medium">{selectedDetail.keluarga?.nomorKk}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
