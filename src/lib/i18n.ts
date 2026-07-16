import { useAppStore } from './store'

const translations = {
  id: {
    sidebar: {
      dashboard: "Dashboard",
      keuangan: "Keuangan",
      masterData: "Data Master",
      laporan: "Pusat Laporan",
      pengaturan: "Pengaturan"
    },
    topbar: {
      profileDetail: "Detail Profil",
      logout: "Keluar (Logout)"
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
        yearDesc: "Tahun patokan pencatatan APBDes",
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
        backupDesc: "Unduh salinan data APBDes (.json)",
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
      masterData: "Master Data",
      laporan: "Report Center",
      pengaturan: "Settings"
    },
    topbar: {
      profileDetail: "Profile Details",
      logout: "Log Out"
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
        yearDesc: "Benchmark year for APBDes recording",
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
        backupDesc: "Download a copy of APBDes data (.json)",
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
