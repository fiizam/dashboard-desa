# Konteks Proyek: Sistem Terpadu RW (Sistem Informasi Keuangan & Kependudukan RW)

## Identitas Proyek
- **Deskripsi**: Platform enterprise modern untuk mengelola administrasi Keuangan (APBDes), Kependudukan, dan Laporan secara transparan, akuntabel, dan terintegrasi di tingkat Rukun Warga (RW).
- **Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Prisma ORM, Supabase (PostgreSQL).

## Role-Based Access Control (RBAC) Khusus
Sistem ini TIDAK memiliki fitur Registrasi publik. Akun hanya bisa dibuat oleh Super Admin. Hak akses sistem dibagi sebagai berikut:
1. **Super Admin**: Akses penuh ke seluruh sistem, termasuk Master Data dan Kependudukan.
2. **Ketua RW**: Akses penuh ke seluruh menu (Keuangan, Laporan, Referensi, Master Data, Kependudukan, Approval).
3. **Wakil Ketua RW**: Bisa akses Keuangan, Laporan, Referensi, Approval Transaksi. **Dilarang** masuk ke Master Data & Kependudukan.
4. **Sekretaris**: Bisa akses Kependudukan, Laporan, Referensi. **Dilarang** masuk ke Master Data & Keuangan/Approval.
5. **Bendahara**: Bisa akses Keuangan, Laporan, Referensi. **Dilarang** masuk ke Master Data, Kependudukan & Approval Transaksi.

## Panduan Desain (Aesthetics)
- **Tampilan**: Sangat modern, *fresh*, dan bukan desain AI biasa (*glassmorphism*, gradient mewah seperti *deep blue to purple*).
- **Animasi**: Menggunakan *Framer Motion* untuk transisi yang super halus (*spring bounce*, stagger, dll) dan optimal.
- **Komponen**: *Input field* yang ber-outline lembut dan merespons saat difokuskan, *button* beranimasi halus, modal mengambang dengan latar *blur*.

## Catatan Penting Modul Kependudukan
- Memiliki dua entitas utama: `Keluarga` (rumah/KK) dan `Warga` (individu).
- Data yang telah terisi (dummy) sangat realistis mencerminkan nama-nama dan format NIK asli Indonesia.
- Filter otomatis (*Real-time*) dan pengelolaan data terpadu dalam satu *dashboard*.

*(Catatan ini dibuat atas permintaan pengguna agar AI mengingat identitas dan spesifikasi sistem ini untuk pengembangan di masa depan).*
