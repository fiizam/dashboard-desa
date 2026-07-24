"use client"

import { FileText, Download, Printer, BarChart3, PieChart, FileSpreadsheet, Loader2, FileCheck } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getExportData } from '@/server/actions/laporan'
import { toast } from 'sonner'

export function LaporanInteractive() {
  const [isExporting, setIsExporting] = useState(false)
  const [reportType, setReportType] = useState('Buku Kas Umum')

  const { data } = useQuery({
    queryKey: ['laporan_export'],
    queryFn: () => getExportData()
  })

  const handleExportPDF = async () => {
    if (!data) return
    setIsExporting(true)
    
    try {
      const { jsPDF } = await import("jspdf")
      const autoTable = (await import("jspdf-autotable")).default

      const doc = new jsPDF()

      // Header
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text("PEMERINTAH DESA SUKAMAJU", 105, 15, { align: "center" })
      doc.setFontSize(14)
      doc.text(`BUKU KAS UMUM (${reportType.toUpperCase()})`, 105, 22, { align: "center" })
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text("Tahun Anggaran 2026", 105, 28, { align: "center" })
      
      doc.line(14, 32, 196, 32)
      doc.line(14, 33, 196, 33)

      const tableData: any[] = []
      
      data.incomes.forEach((t: any) => {
        tableData.push([
          new Date(t.tanggal).toLocaleDateString('id-ID'),
          t.keterangan || t.pendapatan?.uraian,
          `Rp ${t.jumlah.toLocaleString('id-ID')}`,
          '-'
        ])
      })

      data.expenses.forEach((t: any) => {
        tableData.push([
          new Date(t.tanggal).toLocaleDateString('id-ID'),
          t.keterangan || t.belanja?.uraian,
          '-',
          `Rp ${t.jumlah.toLocaleString('id-ID')}`
        ])
      })

      autoTable(doc, {
        startY: 40,
        head: [['Tanggal', 'Uraian', 'Penerimaan', 'Pengeluaran']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], halign: 'center' },
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 30 },
          2: { halign: 'right' },
          3: { halign: 'right' }
        }
      })

      // Footer / Tanda Tangan
      const finalY = (doc as any).lastAutoTable.finalY || 40
      doc.text("Mengetahui,", 150, finalY + 20)
      doc.text("Kepala Desa Sukamaju", 150, finalY + 25)
      doc.text("________________________", 150, finalY + 45)
      doc.text("NIP. 19800101 201001 1 001", 150, finalY + 50)

      doc.save(`Laporan_Keuangan_Desa_${new Date().getTime()}.pdf`)
      toast.success("Laporan PDF berhasil diunduh")
    } catch (err) {
      toast.error("Gagal mencetak laporan PDF")
    } finally {
      setIsExporting(false)
    }
  }

  const reports = [
    { title: 'Laporan Realisasi APBDes', desc: 'Laporan komprehensif penyerapan anggaran.', icon: BarChart3, date: 'Juli 2026' },
    { title: 'Buku Kas Umum', desc: 'Rekap seluruh transaksi penerimaan dan pengeluaran.', icon: FileSpreadsheet, date: 'Juli 2026' },
    { title: 'Laporan Aset Desa', desc: 'Daftar inventaris dan aset tetap desa.', icon: PieChart, date: 'Semester 1 - 2026' },
    { title: 'Laporan Pajak', desc: 'Penyetoran pajak PPN dan PPh transaksi desa.', icon: FileText, date: 'Juli 2026' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Pusat Laporan</h1>
          <p className="text-muted-foreground">Unduh, cetak, dan kelola laporan keuangan secara otomatis.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-xl font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            Cetak PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
        {reports.map((report, i) => (
          <div key={i} className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <report.icon className="w-24 h-24 text-primary transform translate-x-4 -translate-y-4" />
            </div>
            
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 relative z-10">
              <report.icon className="w-6 h-6 text-primary" />
            </div>
            
            <div className="relative z-10">
              <h3 className="font-semibold text-lg mb-2">{report.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{report.desc}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">{report.date}</span>
                <button onClick={handleExportPDF} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  <Download className="w-4 h-4" />
                  PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm mt-4 print:shadow-none print:border-none print:p-0">
         <h3 className="text-lg font-semibold mb-4 print:hidden">Pembuat Laporan Kustom</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
           <div className="space-y-2">
             <label className="text-sm font-medium">Jenis Laporan</label>
             <select 
               value={reportType}
               onChange={(e) => setReportType(e.target.value)}
               className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
             >
               <option>Buku Kas Umum</option>
               <option>Laporan Arus Kas</option>
               <option>Laporan Operasional</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium">Periode Mulai</label>
             <input type="date" className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium">Periode Akhir</label>
             <input type="date" className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
           </div>
         </div>
         <div className="mt-6 flex justify-end print:hidden">
           <button 
             onClick={handleExportPDF}
             disabled={isExporting}
             className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/25 flex items-center gap-2"
           >
             {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
             Export PDF Laporan Resmi
           </button>
         </div>

         <div className="hidden print:block mt-8">
           <h2 className="text-2xl font-bold mb-4 border-b pb-2">Dokumen Resmi: {reportType}</h2>
           <p className="mb-4">Tahun Anggaran 2026. Laporan ini dicetak secara otomatis dari sistem Digital Village.</p>
           {/* In a real app, we would render a structured table here based on the selected report */}
           <table className="w-full text-sm text-left border">
             <thead className="bg-gray-100 border-b">
               <tr>
                 <th className="p-2 border-r">Tanggal</th>
                 <th className="p-2 border-r">Jenis</th>
                 <th className="p-2 border-r">Uraian</th>
                 <th className="p-2 text-right">Jumlah</th>
               </tr>
             </thead>
             <tbody>
               {data?.incomes.slice(0, 5).map((t:any) => (
                 <tr key={t.id} className="border-b">
                   <td className="p-2 border-r">{new Date(t.tanggal).toLocaleDateString()}</td>
                   <td className="p-2 border-r">Pendapatan</td>
                   <td className="p-2 border-r">{t.keterangan}</td>
                   <td className="p-2 text-right text-emerald-600">+ {t.jumlah.toLocaleString()}</td>
                 </tr>
               ))}
               {data?.expenses.slice(0, 5).map((t:any) => (
                 <tr key={t.id} className="border-b">
                   <td className="p-2 border-r">{new Date(t.tanggal).toLocaleDateString()}</td>
                   <td className="p-2 border-r">Belanja</td>
                   <td className="p-2 border-r">{t.keterangan}</td>
                   <td className="p-2 text-right text-rose-600">- {t.jumlah.toLocaleString()}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  )
}
