'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Loader2, Save } from 'lucide-react'
import { createWarga } from '@/server/actions/kependudukan'

export function WargaModal({ 
  keluargaList, 
  onClose,
  onSuccess 
}: { 
  keluargaList: any[],
  onClose: () => void,
  onSuccess: () => void 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    pendidikan: '',
    pekerjaan: '',
    statusPerkawinan: 'Belum Kawin',
    statusKeluarga: 'Anak',
    keluargaId: keluargaList.length > 0 ? keluargaList[0].id : ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await createWarga(formData)
      if (res.error) {
        alert(res.error)
      } else {
        onSuccess()
      }
    } catch (err) {
      alert('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl z-50 overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-secondary/30">
          <div>
            <h2 className="text-xl font-bold">Tambah Data Warga</h2>
            <p className="text-sm text-muted-foreground">Masukkan data individu sesuai dengan e-KTP.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nomor Induk Kependudukan (NIK)</label>
              <input 
                required
                type="text"
                maxLength={16}
                value={formData.nik}
                onChange={e => setFormData({...formData, nik: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap</label>
              <input 
                required
                type="text"
                value={formData.nama}
                onChange={e => setFormData({...formData, nama: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tempat Lahir</label>
              <input 
                required
                type="text"
                value={formData.tempatLahir}
                onChange={e => setFormData({...formData, tempatLahir: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Lahir</label>
              <input 
                required
                type="date"
                value={formData.tanggalLahir}
                onChange={e => setFormData({...formData, tanggalLahir: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Jenis Kelamin</label>
              <select 
                value={formData.jenisKelamin}
                onChange={e => setFormData({...formData, jenisKelamin: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Pekerjaan</label>
              <input 
                required
                type="text"
                value={formData.pekerjaan}
                onChange={e => setFormData({...formData, pekerjaan: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status Perkawinan</label>
              <select 
                value={formData.statusPerkawinan}
                onChange={e => setFormData({...formData, statusPerkawinan: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Belum Kawin">Belum Kawin</option>
                <option value="Kawin">Kawin</option>
                <option value="Cerai Hidup">Cerai Hidup</option>
                <option value="Cerai Mati">Cerai Mati</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status Keluarga</label>
              <select 
                value={formData.statusKeluarga}
                onChange={e => setFormData({...formData, statusKeluarga: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Kepala Keluarga">Kepala Keluarga</option>
                <option value="Istri">Istri</option>
                <option value="Anak">Anak</option>
                <option value="Famili Lain">Famili Lain</option>
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Kartu Keluarga (KK)</label>
              <select 
                value={formData.keluargaId}
                onChange={e => setFormData({...formData, keluargaId: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {keluargaList.map(k => (
                  <option key={k.id} value={k.id}>
                    No. KK: {k.nomorKk} - Kpl: {k.kepalaKeluarga} (RT {k.rt}/RW {k.rw})
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-border/50">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium hover:bg-secondary transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/25 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan Data
            </button>
          </div>
        </form>
      </motion.div>
    </>
  )
}
