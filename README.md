# 🏛️ Galeri Sriwedari — Next.js 14 (App Router)

Aplikasi resmi pelestarian seni tari tradisional, busana adat pementasan keraton, dan reservasi tiket pertunjukan Wayang Orang Sriwedari Surakarta, dibangun dengan arsitektur modern **Next.js 14 (App Router)**, **React 18**, **TypeScript**, dan **Tailwind CSS**.

---

## 🌟 Fitur Utama Aplikasi

### 1. Modul Autentikasi (`/auth/*`)
- **Login Terpadu (`/auth/login`):** Dukungan pergantian peran *Pengguna/Tamu* dan *Kurator/Admin* dengan tombol masuk cepat demo 1-klik.
- **Daftar Akun Baru (`/auth/register`):** Registrasi anggota baru dengan perolehan poin budaya awal.
- **Lupa Kata Sandi (`/auth/forgot-password`):** Alur pemulihan sandi melalui email/WhatsApp.
- **Auto-Redirect:** Mengetik `http://localhost:3000/` otomatis langsung mengarahkan ke `/auth/login` tanpa emulator.

### 2. Frontend Aplikasi Pengguna (`/(frontend)/*`)
- **Beranda (`/dashboard`):** Sapaan personal dinamis, pencarian cepat, navigasi menu, dan sorotan karya terbaru.
- **Katalog Galeri (`/collection` & `/collection/[id]`):** Jelajah karya seni tari dengan filter kategori, likes reaktif, bagikan tautan, dan simpan wishlist favorit.
- **Katalog Kostum (`/collection/costumes`):** Katalog busana tari keraton dengan ulasan kurator, ukuran, dan harga sewa.
- **Pemesanan Sewa Busana (`/bookings` & `/bookings/success`):** Checkout multi-busana, penghitungan deposit jaminan (Rp 100.000), kode kupon promo (`SRIWEDARI10`, `KERATON25`, `HEMATBUDAYA`), dan metode bayar QRIS/VA/Tunai.
- **Jadwal & Tiket Pagelaran (`/visitors`, `/visitors/daily`, `/visitors/today`):** Jadwal pentas dengan denah kursi teater interaktif 3 zona (*VIP Pendopo*, *Reguler Tengah*, *Balkon*) dan anti-bentrok kuota.
- **Profil Pengguna (`/profile`):** Kelola identitas, riwayat sewa busana, e-tiket boarding pass, dan wishlist tersimpan.

### 3. Panel Kurator & Administrator (`/admin/*`)
- **Dashboard Analitik (`/admin/dashboard`):** Real-time omzet bruto sewa busana dan penjualan tiket loket.
- **Kelola Pengguna (`/admin/account`):** CRUD akun staf kurator dan pengunjung.
- **Rekap & Presensi Kunjungan (`/admin/visitor`, `/admin/visitor/daily`, `/admin/visitor/today`):** Monitoring data kehadiran penonton.
- **Pesanan & QC Retur (`/admin/bookings`):** Verifikasi pembayaran, 4 tingkat mutu QC pengembalian busana (*Grade A, B, C, D*), pencairan deposit refund, dan dispatcher pesan WhatsApp.
- **Koleksi & Arsip (`/admin/collection` & `/admin/collection/create`):** Manajemen karya seni, tambah arsip foto baru, dan kategori tari.
- **Kasir Loket On-The-Spot (POS) & Scanner (`/admin/pos`):** Penjualan tiket walk-in, cetak struk termal, dan pemindai barcode/QR tiket gerbang.
- **Manajemen Kupon Diskon (`/admin/coupons`):** Pembuatan dan pengaturan status voucher diskon budaya.
- **Audit Trail Keamanan (`/admin/audit`):** Rekam jejak seluruh mutasi sistem dan tombol **Ekspor CSV (UTF-8 BOM)**.
- **Pengaturan & Reset DB (`/admin/settings`):** Profil sanggar dan tombol **Reset DB** untuk mengembalikan data pengujian ke seed awal.
- **Dokumentasi Alur (`/admin/docs`):** Panduan operasional sistem terintegrasi.

### 4. Halaman Edukasi & Publik (`/about/*` & `/blog/*`)
- **Tentang Kami (`/about`):** Profil lembaga dan 3 pilar pelestarian budaya.
- **Kronik Sejarah (`/about/sejarah`):** Sejarah 125 tahun berdirinya Taman Sriwedari sejak 1899 oleh Pakubuwana X.
- **Dewan Kurator (`/about/kurator`):** Profil para empu, kurator kostum, dan maestro tari.
- **Warta & Artikel Budaya (`/blog` & `/blog/[slug]`):** Telaah filosofis seni klasik dan ulasan busana keraton.

---

## 🚀 Cara Menjalankan Proyek

### 1. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Akses di peramban: **`http://localhost:3000`**

### 2. Membangun Versi Produksi (Build)
```bash
npm run build
npm start
```
Seluruh 34 rute statis & dinamis akan dikompilasi secara optimal.

---

## 🎨 Sistem Desain (Nusantara Heritage Elegance)
- **Warna Utama:** Hijau Tua Keraton (`#1F4A3A` & `#033325`), Emas Prada (`#C8A25A`), Canvas (`#F6F1E7`), Parchment (`#FBF8F2`).
- **Tipografi:** *Playfair Display* (Heading filosofis) dan *Inter* (UI/Body dengan lining & tabular numbers).
