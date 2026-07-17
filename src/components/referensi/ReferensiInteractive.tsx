"use client"

import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { upsertSumberDana, deleteSumberDana, upsertKategoriPendapatan, deleteKategoriPendapatan, upsertKategoriBelanja, deleteKategoriBelanja } from '@/server/actions/referensi'

type Tab = 'sumber_dana' | 'kategori_pendapatan' | 'kategori_belanja'

export function ReferensiInteractive({ 
  initialSumberDanas, 
  initialKategoriPendapatans, 
  initialKategoriBelanjas 
}: { 
  initialSumberDanas: any[], 
  initialKategoriPendapatans: any[], 
  initialKategoriBelanjas: any[] 
}) {
  const [activeTab, setActiveTab] = useState<Tab>('sumber_dana')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingData, setEditingData] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [search, setSearch] = useState('')

  // Form states
  const [kode, setKode] = useState('')
  const [name, setName] = useState('')
  const [keterangan, setKeterangan] = useState('')

  const openModal = (data: any = null) => {
    setEditingData(data)
    setKode(data?.kode || '')
    setName(data?.name || '')
    setKeterangan(data?.keterangan || '')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingData(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const payload = { id: editingData?.id, kode, name, keterangan }
      let res

      if (activeTab === 'sumber_dana') res = await upsertSumberDana(payload)
      else if (activeTab === 'kategori_pendapatan') res = await upsertKategoriPendapatan({ id: payload.id, kode, name })
      else res = await upsertKategoriBelanja({ id: payload.id, kode, name })

      if (res.success) {
        toast.success("Data referensi berhasil disimpan")
        closeModal()
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return
    
    try {
      if (activeTab === 'sumber_dana') await deleteSumberDana(id)
      else if (activeTab === 'kategori_pendapatan') await deleteKategoriPendapatan(id)
      else await deleteKategoriBelanja(id)

      toast.success("Data berhasil dihapus")
    } catch (error: any) {
      toast.error("Gagal menghapus data. Mungkin sedang digunakan.")
    }
  }

  const getActiveData = () => {
    let data = []
    if (activeTab === 'sumber_dana') data = initialSumberDanas
    else if (activeTab === 'kategori_pendapatan') data = initialKategoriPendapatans
    else data = initialKategoriBelanjas

    return data.filter(d => 
      d.kode.toLowerCase().includes(search.toLowerCase()) || 
      d.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border/50 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('sumber_dana')}
          className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'sumber_dana' ? 'border-b-2 border-primary text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
        >
          Sumber Dana
        </button>
        <button 
          onClick={() => setActiveTab('kategori_pendapatan')}
          className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'kategori_pendapatan' ? 'border-b-2 border-primary text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
        >
          Kategori Pendapatan
        </button>
        <button 
          onClick={() => setActiveTab('kategori_belanja')}
          className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'kategori_belanja' ? 'border-b-2 border-primary text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
        >
          Kategori Belanja
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary/10">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Cari kode atau nama..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Tambah Data
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-secondary/50 uppercase border-y border-border/50">
            <tr>
              <th className="px-6 py-4 font-medium">Kode</th>
              <th className="px-6 py-4 font-medium">Nama Referensi</th>
              {activeTab === 'sumber_dana' && <th className="px-6 py-4 font-medium">Keterangan</th>}
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {getActiveData().length > 0 ? getActiveData().map((item) => (
              <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 font-medium">{item.kode}</td>
                <td className="px-6 py-4">{item.name}</td>
                {activeTab === 'sumber_dana' && <td className="px-6 py-4 text-muted-foreground">{item.keterangan || '-'}</td>}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openModal(item)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  Data tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-3xl shadow-xl border border-border/50 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-semibold text-lg">{editingData ? 'Edit Data' : 'Tambah Data Baru'}</h3>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Kode</label>
                <input 
                  required 
                  value={kode} 
                  onChange={(e) => setKode(e.target.value)}
                  placeholder="Contoh: 1.1.01" 
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Nama Referensi</label>
                <input 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Dana Desa (DD)" 
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                />
              </div>
              {activeTab === 'sumber_dana' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Keterangan (Opsional)</label>
                  <input 
                    value={keterangan} 
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Penjelasan singkat..." 
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                  />
                </div>
              )}
              
              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 hover:bg-secondary rounded-xl text-sm font-medium transition-colors">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
