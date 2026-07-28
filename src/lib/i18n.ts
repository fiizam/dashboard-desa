import { useAppStore } from './store'

const translations = {
  id: {
    sidebar: {
      dashboard: "Dashboard",
      keuangan: "Keuangan",
      kependudukan: "Warga",
      masterData: "Data Master",
      laporan: "Pusat Laporan",
      pengaturan: "Pengaturan"
    },
    bottomNav: { 
      beranda: "Dashboard", 
      keuangan: "Keuangan", 
      warga: "Warga", 
      master: "Master", 
      laporan: "Laporan" 
    },
    topbar: {
      profileDetail: "Detail Profil",
      settings: "Pengaturan",
      logout: "Keluar (Logout)",
      searchPlaceholder: "Cari transaksi, program... (Ctrl+K)"
    },
    dashboard: {
      greeting: "Halo,",
      subtitle: "Sistem Keuangan RW siap digunakan.",
      aiAdvisorTitle: "Digital RW AI",
      aiAdvisorSubtitle: "Asisten Finansial Pintar",
      aiAdvisorTooltip: "Tanya AI Advisor",
      aiAdvisorAnalyzing: "Menganalisis APBRW...",
      aiAdvisorWait: "Harap tunggu sebentar",
      aiAdvisorRefresh: "Perbarui Analisis",
      aiAdvisorError: "Terjadi kesalahan saat menghubungkan ke AI.",
      aiAdvisorDefault: "Halo! Saya asisten AI RW Anda.",
      cards: { totalBudget: "Total APBRW", realization: "Realisasi", remaining: "Sisa Anggaran", efficiency: "Efisiensi" },
      transactions: { title: "Daftar Transaksi Tertunda", subtitle: "Aktivitas keluar masuk kas RW", statusSuccess: "Selesai", statusPending: "Tertunda", viewAll: "Lihat Semua", colDate: "Tanggal", colName: "Nama Transaksi", colPriority: "Prioritas", colAttachment: "Lampiran", colAssignee: "Pemroses" },
      breakdown: { title: "Kategori Belanja", reportLink: "Laporan Penuh >", statsTitle: "Realisasi per Wilayah", statsLink: "Lihat Semua >", colRegion: "Wilayah", colActive: "Kegiatan Aktif" },
      rightPanel: {
         agendaTitle: "Agenda RW", taskTitle: "Tugas Keuangan", colTaskName: "Nama Tugas", colDeadline: "Tenggat"
      },
      communication: { title: "Log Aktivitas Sistem (7 Hari Terakhir)", viewAll: "Lihat Semua >" }
    },
    keuangan: {
      title: "Manajemen Keuangan & APBRW", subtitle: "Kelola anggaran, pendapatan, dan belanja RW secara transparan.",
      addBtn: "Tambah Transaksi", exportBtn: "Export Laporan PDF",
      summary: { totalBudget: "Total APBRW", realization: "Realisasi APBRW", income: "Total Pendapatan", expense: "Total Belanja" },
      tabs: { income: "Pendapatan", expense: "Belanja" },
      table: { id: "ID", date: "Tanggal", desc: "Keterangan", category: "Kategori", amount: "Jumlah", status: "Status" },
      pageTitle: "Manajemen Keuangan", pageSubtitle: "Kelola APBRW {year} dan persetujuan transaksi.",
      exportPdf: "Export PDF", addTransaction: "Catat Transaksi", pendingApproval: "Persetujuan Menunggu",
      incomeLabel: "Pendapatan", expenseLabel: "Belanja", pos: "Pos:", approve: "Setujui",
      incomeDetails: "Rincian Pendapatan", expenseDetails: "Rincian Belanja", realization: "Realisasi:",
      noApbdes: "Belum ada APBRW Aktif", noApbdesDesc: "Silakan buat draf APBRW baru untuk tahun ini.", createApbdes: "Buat APBRW"
    },
    laporan: {
      title: "Pusat Laporan", subtitle: "Unduh, cetak, dan kelola laporan keuangan secara otomatis.",
      pdfBtn: "Export PDF", printPdf: "Cetak PDF", reportRealization: "Laporan Realisasi APBRW", reportRealizationDesc: "Laporan komprehensif penyerapan anggaran.",
      reportBku: "Buku Kas Umum", reportBkuDesc: "Rekap seluruh transaksi penerimaan dan pengeluaran.",
      reportAsset: "Laporan Aset RW", reportAssetDesc: "Daftar inventaris dan aset tetap RW.",
      reportTax: "Laporan Pajak", reportTaxDesc: "Penyetoran pajak PPN dan PPh transaksi RW.",
      customReport: "Pembuat Laporan Kustom", reportType: "Jenis Laporan", startDate: "Periode Mulai", endDate: "Periode Akhir", exportOfficial: "Export PDF Laporan Resmi",
      officialDoc: "Dokumen Resmi:", printNotice: "Tahun Anggaran {year}. Laporan ini dicetak secara otomatis dari sistem Digital RW.", typeIncome: "Pendapatan", typeExpense: "Belanja"
    },
    warga: {
      title: "Data Kependudukan", subtitle: "Kelola Kartu Keluarga dan Demografi Warga RW.",
      addBtn: "Tambah Warga", exportData: "Export Data",
      totalCitizen: "Total Warga", totalFamily: "Total KK", male: "Laki-laki", female: "Perempuan",
      searchPlaceholder: "Cari NIK atau Nama...", filterAll: "Semua RT", filterRt: "RT",
      colNik: "NIK", colName: "Nama Lengkap", colGender: "Jenis Kelamin", colKk: "No. KK / Status", colRtRw: "RT/RW", colAction: "Aksi",
      detail: "Detail", notFound: "Tidak ada data warga ditemukan.",
      detailTitle: "Detail Warga", birthInfo: "Tempat, Tgl Lahir", religion: "Agama", maritalStatus: "Status Perkawinan", educationJob: "Pendidikan / Pekerjaan",
      familyInfo: "Informasi Keluarga", status: "Status:", kkNum: "No. Kartu Keluarga:"
    },
    master: {
      pageTitle: "Data Master Pengguna", pageSubtitle: "Kelola hak akses dan pengguna di seluruh entitas RW.",
      export: "Export", addUser: "Tambah Pengguna", searchPlaceholder: "Cari nama, email, atau role...", filter: "Filter",
      colUser: "Pengguna", colRole: "Role", colVillage: "RW", colStatus: "Status", colAction: "Aksi",
      active: "Aktif", inactive: "Nonaktif",
      editData: "Edit Data", resetPassword: "Reset Password", deleteAccess: "Hapus Akses"
    },
    settings: {
      title: "Pengaturan Sistem",
      subtitle: "Sesuaikan preferensi tampilan, notifikasi, dan keamanan sistem Anda.",
      tabs: {
        general: "Umum",
        notifications: "Notifikasi",
        security: "Sistem & Keamanan"
      },
      general: {
        themeTitle: "Pengaturan Tampilan",
        themeLight: "Terang (Light)",
        themeLightDesc: "Tampilan cerah standar",
        themeDark: "Gelap (Dark)",
        themeDarkDesc: "Lebih nyaman di mata",
        themeSystem: "Ikuti Sistem",
        themeSystemDesc: "Sinkron dengan OS",
        regionalTitle: "Preferensi Regional & Sistem",
        language: "Bahasa Utama",
        languageDesc: "Bahasa antarmuka aplikasi",
        year: "Tahun Anggaran Aktif",
        yearDesc: "Tahun patokan pencatatan APBRW",
        yearActive: "Aktif",
        yearArchive: "Arsip"
      },
      notifications: {
        title: "Pemberitahuan Transaksi",
        email: "Notifikasi Email",
        emailDesc: "Kirim email jika ada transaksi tertunda",
        system: "Notifikasi Dalam Sistem",
        systemDesc: "Tampilkan lonceng peringatan di dashboard"
      },
      security: {
        title: "Manajemen Data",
        backup: "Backup Database",
        backupDesc: "Unduh salinan data APBRW (.json)",
        downloadBtn: "Download Backup",
        processing: "Memproses...",
        session: "Sesi Login Aktif",
        sessionDesc: "Keluarkan akun dari semua perangkat lain",
        logoutBtn: "Logout Semua Sesi"
      },
      save: "Simpan Perubahan",
      saving: "Menyimpan...",
      toastSuccessTitle: "Berhasil Disimpan",
      toastSuccessDesc: "Semua pengaturan preferensi Anda telah diperbarui.",
      toastBackupSuccess: "Backup Berhasil",
      toastBackupSuccessDesc: "Data berhasil diunduh ke perangkat Anda.",
      toastBackupFail: "Gagal Backup"
    }
  },
  en: {
    sidebar: {
      dashboard: "Dashboard",
      keuangan: "Finances",
      kependudukan: "Residents",
      masterData: "Master Data",
      laporan: "Report Center",
      pengaturan: "Settings"
    },
    bottomNav: { 
      beranda: "Dashboard", 
      keuangan: "Finances", 
      warga: "Residents", 
      master: "Master", 
      laporan: "Reports" 
    },
    topbar: {
      profileDetail: "Profile Details",
      settings: "Settings",
      logout: "Log Out",
      searchPlaceholder: "Search transactions, programs... (Ctrl+K)"
    },
    dashboard: {
      greeting: "Hello,",
      subtitle: "RW Financial System is ready.",
      aiAdvisorTitle: "Digital RW AI",
      aiAdvisorSubtitle: "Smart Financial Assistant",
      aiAdvisorTooltip: "Ask AI Advisor",
      aiAdvisorAnalyzing: "Analyzing APBRW...",
      aiAdvisorWait: "Please wait a moment",
      aiAdvisorRefresh: "Refresh Analysis",
      aiAdvisorError: "An error occurred while connecting to AI.",
      aiAdvisorDefault: "Hello! I am your RW AI Assistant.",
      cards: { totalBudget: "Total Budget", realization: "Realization", remaining: "Remaining", efficiency: "Efficiency" },
      transactions: { title: "Pending Transactions", subtitle: "Cash flow activities", statusSuccess: "Completed", statusPending: "Pending", viewAll: "View All", colDate: "Date", colName: "Transaction Name", colPriority: "Priority", colAttachment: "Attachment", colAssignee: "Assignee" },
      breakdown: { title: "Expense Categories", reportLink: "Full Report >", statsTitle: "Realization by Region", statsLink: "View All >", colRegion: "Region", colActive: "Active Activities" },
      rightPanel: {
         agendaTitle: "RW Agenda", taskTitle: "Financial Tasks", colTaskName: "Task Name", colDeadline: "Deadline"
      },
      communication: { title: "System Activity Log (Last 7 Days)", viewAll: "View All >" }
    },
    keuangan: {
      title: "Finance & APBRW Management", subtitle: "Manage RW budgets, income, and expenses transparently.",
      addBtn: "Add Transaction", exportBtn: "Export PDF Report",
      summary: { totalBudget: "Total Budget", realization: "Budget Realization", income: "Total Income", expense: "Total Expense" },
      tabs: { income: "Income", expense: "Expense" },
      table: { id: "ID", date: "Date", desc: "Description", category: "Category", amount: "Amount", status: "Status" },
      pageTitle: "Financial Management", pageSubtitle: "Manage APBRW {year} and transaction approvals.",
      exportPdf: "Export PDF", addTransaction: "Record Transaction", pendingApproval: "Pending Approvals",
      incomeLabel: "Income", expenseLabel: "Expense", pos: "Account:", approve: "Approve",
      incomeDetails: "Income Details", expenseDetails: "Expense Details", realization: "Realized:",
      noApbdes: "No Active APBRW", noApbdesDesc: "Please create a new APBRW draft for this year.", createApbdes: "Create APBRW"
    },
    laporan: {
      title: "Report Center", subtitle: "Download, print, and manage financial reports automatically.",
      pdfBtn: "Export PDF", printPdf: "Print PDF", reportRealization: "APBRW Realization Report", reportRealizationDesc: "Comprehensive budget absorption report.",
      reportBku: "General Cash Book", reportBkuDesc: "Recap of all receipt and disbursement transactions.",
      reportAsset: "RW Asset Report", reportAssetDesc: "List of inventory and fixed assets of the village.",
      reportTax: "Tax Report", reportTaxDesc: "VAT and Income Tax deposit for RW transactions.",
      customReport: "Custom Report Builder", reportType: "Report Type", startDate: "Start Date", endDate: "End Date", exportOfficial: "Export Official PDF Report",
      officialDoc: "Official Document:", printNotice: "Fiscal Year {year}. This report is automatically printed from the Digital RW system.", typeIncome: "Income", typeExpense: "Expense"
    },
    warga: {
      title: "Population Data", subtitle: "Manage Family Cards and Demographics of RW Residents.",
      addBtn: "Add Resident", exportData: "Export Data",
      totalCitizen: "Total Residents", totalFamily: "Total Families", male: "Male", female: "Female",
      searchPlaceholder: "Search NIK or Name...", filterAll: "All RTs", filterRt: "RT",
      colNik: "NIK", colName: "Full Name", colGender: "Gender", colKk: "KK No. / Status", colRtRw: "RT/RW", colAction: "Action",
      detail: "Detail", notFound: "No resident data found.",
      detailTitle: "Resident Details", birthInfo: "Place, DOB", religion: "Religion", maritalStatus: "Marital Status", educationJob: "Education / Job",
      familyInfo: "Family Information", status: "Status:", kkNum: "Family Card No:"
    },
    master: {
      pageTitle: "Master User Data", pageSubtitle: "Manage access rights and users across all RW entities.",
      export: "Export", addUser: "Add User", searchPlaceholder: "Search name, email, or role...", filter: "Filter",
      colUser: "User", colRole: "Role", colVillage: "RW", colStatus: "Status", colAction: "Action",
      active: "Active", inactive: "Inactive",
      editData: "Edit Data", resetPassword: "Reset Password", deleteAccess: "Delete Access"
    },
    settings: {
      title: "System Settings",
      subtitle: "Customize your appearance, notification, and system security preferences.",
      tabs: {
        general: "General",
        notifications: "Notifications",
        security: "System & Security"
      },
      general: {
        themeTitle: "Appearance Settings",
        themeLight: "Light Mode",
        themeLightDesc: "Standard bright appearance",
        themeDark: "Dark Mode",
        themeDarkDesc: "More comfortable for the eyes",
        themeSystem: "System Default",
        themeSystemDesc: "Sync with OS",
        regionalTitle: "Regional & System Preferences",
        language: "Primary Language",
        languageDesc: "Application interface language",
        year: "Active Fiscal Year",
        yearDesc: "Benchmark year for APBRW recording",
        yearActive: "Active",
        yearArchive: "Archive"
      },
      notifications: {
        title: "Transaction Alerts",
        email: "Email Notifications",
        emailDesc: "Send an email for pending transactions",
        system: "In-System Notifications",
        systemDesc: "Show alert bell on the dashboard"
      },
      security: {
        title: "Data Management",
        backup: "Database Backup",
        backupDesc: "Download a copy of APBRW data (.json)",
        downloadBtn: "Download Backup",
        processing: "Processing...",
        session: "Active Login Sessions",
        sessionDesc: "Sign out of your account on all other devices",
        logoutBtn: "Log Out All Sessions"
      },
      save: "Save Changes",
      saving: "Saving...",
      toastSuccessTitle: "Saved Successfully",
      toastSuccessDesc: "All your preference settings have been updated.",
      toastBackupSuccess: "Backup Successful",
      toastBackupSuccessDesc: "Data has been successfully downloaded to your device.",
      toastBackupFail: "Backup Failed"
    }
  }
}

export function useTranslation() {
  const language = useAppStore(state => state.language)
  return translations[language]
}
