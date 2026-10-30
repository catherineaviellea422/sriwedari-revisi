# 🏛️ SISTEM FLOW & ARSITEKTUR APLIKASI GALERI SRIWEDARI

Dokumen ini memuat perancangan alur sistem (*system flow*), relasi data, hak akses peran (*roles*), dan spesifikasi fungsional untuk aplikasi **Galeri Sriwedari Mobile App** (Pengguna & Administrator).

---

## 1. Diagram Alur Sistem Keseluruhan (High-Level Architecture)

```mermaid
graph TD
    %% Entry Points
    Landing[Halaman Awal / Hub Sriwedari] --> RoleCheck{Pilih Peran}
    
    %% User Flow
    RoleCheck -->|Pengguna / User| UserLogin[Login / Masuk Pengguna]
    UserLogin --> UserDash[Beranda Pengguna / Dashboard]
    
    UserDash --> BrowseGaleri[Jelajah Galeri Seni]
    BrowseGaleri --> DetailGaleri[Detail Karya & Sejarah]
    DetailGaleri --> SewaTerkait[Sewa Kostum Terkait]
    
    UserDash --> KostumKatalog[Katalog Kostum & Busana Keraton]
    KostumKatalog --> FormSewa[Formulir Pemesanan Sewa]
    SewaTerkait --> FormSewa
    FormSewa --> OrderSuccess[Order Tersimpan / Invoice Dibuat]
    OrderSuccess --> UserProfile[Profil Pengguna & Riwayat Pesanan]
    
    UserDash --> JadwalKegiatan[Jadwal Pementasan Seni]
    JadwalKegiatan --> PesanTiket[Modal Reservasi Tiket]
    PesanTiket --> TiketSuccess[Tiket Tersimpan & Kuota Berkurang]
    TiketSuccess --> UserProfile
    
    %% Admin Flow
    RoleCheck -->|Administrator| AdminLogin[Login Khusus Admin]
    AdminLogin --> AdminDash[Dashboard Admin & Analitik Real-Time]
    
    AdminDash --> ManageGaleri[Kelola Galeri: Tambah, Ubah, Hapus]
    AdminDash --> ManageKategori[Kelola Kategori: Tambah, Ubah, Hapus]
    AdminDash --> ManagePesanan[Kelola Pesanan: Verifikasi & Ubah Status]
    AdminDash --> ManageUser[Kelola Pengguna: Tambah, Edit Peran, Hapus]
    AdminDash --> ManageSettings[Pengaturan Lembaga & Sistem]
    
    %% Shared Storage
    subgraph Central Data Engine (localStorage / SriwedariDB)
        DB_Galleries[(Koleksi Galeri)]
        DB_Categories[(Kategori)]
        DB_Costumes[(Katalog Kostum)]
        DB_Orders[(Data Pesanan Sewa)]
        DB_Events[(Jadwal & Kuota Tiket)]
        DB_Users[(Data Pengguna)]
        DB_Settings[(Pengaturan Sistem)]
    end
    
    BrowseGaleri -.-> DB_Galleries
    ManageGaleri <--> DB_Galleries
    ManageKategori <--> DB_Categories
    FormSewa --> DB_Orders
    ManagePesanan <--> DB_Orders
    PesanTiket --> DB_Events
    ManageUser <--> DB_Users
    ManageSettings <--> DB_Settings
```

---

## 2. Alur Pengguna (User Flow)

Alur pengguna dirancang untuk memberikan pengalaman budaya yang imersif, mudah dijelajahi, dan memungkinkan transaksi pemesanan langsung:

### 2.1 Autentikasi Pengguna
1. Pengguna membuka `screens/user/login.html`.
2. Pengguna dapat login menggunakan akun yang ada (contoh: `oliv@example.com` / Sandi) atau memilih opsi cepat Masuk sebagai Tamu / Demo.
3. Sesi pengguna aktif disimpan di `SriwedariDB.setCurrentUser(...)`.
4. Sistem mengarahkan pengguna ke `screens/user/dashboard.html`.

### 2.2 Beranda & Eksplorasi (Dashboard)
1. Menampilkan sapaan personal ("Halo, [Nama Pengguna]").
2. Bilah pencarian instan: Mengetik kata kunci akan menyaring konten atau mengarahkan ke halaman galeri.
3. Menu Cepat:
   - **Galeri:** Menuju katalog lengkap `screens/user/list-galeri.html`.
   - **Katalog Kostum:** Menuju sewa busana `screens/user/katalog-kostum.html`.
   - **Jadwal Kegiatan:** Menuju kalender lakon `screens/user/jadwal-kegiatan.html`.
   - **Pesan Tiket / Sewa:** Mengarahkan ke form pemesanan `screens/user/form-pemesanan.html`.
4. Menampilkan kartu "Galeri Terbaru" secara dinamis dari database lokal.

### 2.3 Jelajah Galeri & Detail Karya
1. Pengguna membuka `list-galeri.html`.
2. Pengguna menyaring karya berdasarkan:
   - Filter Kategori: *Semua*, *Tari Tradisional*, *Tari Kreasi*, *Busana Pusaka*, *Video Dokumenter*.
   - Filter Tipe: *Foto* vs *Video*.
   - Kata kunci pencarian.
3. Mengetuk kartu karya membuka `detail-galeri.html?id=[id]`.
4. Pada halaman detail:
   - Menampilkan foto arsip panggung beresolusi tinggi.
   - Menampilkan sinopsis filosofis, sejarah tarian, asal daerah, dan atribut busana.
   - Tombol **Suka (Like):** Menambah jumlah like secara riil dan tersimpan di database.
   - Tombol **Bagikan (Share):** Menyalin tautan karya ke clipboard dengan notifikasi toast.
   - Tombol **Sewa Kostum Terkait:** Mengarahkan langsung ke formulir pemesanan kostum dengan item yang telah terpilih otomatis.

### 2.4 Katalog Kostum & Pemesanan Sewa (Order Flow)
1. Pengguna membuka `katalog-kostum.html`.
2. Pengguna melihat daftar busana tari keraton lengkap dengan foto, ulasan bintang, dan harga sewa per hari.
3. Pengguna menekan tombol "Sewa" pada busana yang diinginkan -> membuka bottom sheet konfirmasi durasi (1, 3, atau 7 hari).
4. Pengguna menekan "Lanjutkan ke Reservasi" -> diarahkan ke `form-pemesanan.html?costumeId=[id]&days=[durasi]`.
5. Formulir pemesanan menghitung otomatis:
   - Total Biaya = `(Harga Sewa per Hari × Durasi Hari) + Biaya Kebersihan/Jaminan`.
6. Pengguna mengisi Nama, No. WhatsApp, Tanggal Pakai, Ukuran, dan Catatan.
7. Pengguna menekan **Konfirmasi & Kirim Pesanan**:
   - Sistem membuat entitas pesanan baru dengan ID unik (contoh: `ORD-2026-8812`).
   - Status awal pesanan: `Menunggu Konfirmasi`.
   - Stok busana diperbarui.
   - Menampilkan notifikasi sukses toast dan mengarahkan ke `screens/user/profil.html`.

### 2.5 Jadwal Kegiatan & Reservasi Tiket
1. Pengguna membuka `jadwal-kegiatan.html`.
2. Menampilkan jadwal pagelaran seni Wayang Wong, Tari Bedhaya, dan festival tari.
3. Setiap pertunjukan mencantumkan tanggal, jam, gedung pementasan, harga tiket, dan sisa kuota kursi.
4. Pengguna menekan tombol **Pesan Tiket**:
   - Membuka modal pemesanan tiket dengan pilihan jumlah tiket (1-5 tiket).
   - Memasukkan nama dan nomor telepon pemesan.
   - Menekan "Konfirmasi Pemesanan":
     * Kuota kursi pada database langsung berkurang sesuai jumlah tiket.
     * Tiket tersimpan di data pengguna dan dapat dilihat pada profil.

### 2.6 Profil Pengguna & Pelacakan Pesanan
1. Pengguna membuka `profil.html`.
2. Menampilkan identitas pengguna, status keanggotaan, dan poin budaya.
3. Bagian **Pesanan Saya**:
   - Menampilkan riwayat pesanan sewa busana aktif dan selesai.
   - Menampilkan badge status: `Menunggu Konfirmasi` (Kuning), `Dikonfirmasi` (Hijau), `Selesai` (Biru), `Dibatalkan` (Merah).
   - Rincian biaya, tanggal sewa, dan nomor invoice.
4. Bagian **Tiket Pertunjukan**:
   - Menampilkan e-tiket kegiatan yang telah dipesan.
5. Modal **Ubah Data Profil**:
   - Pengguna dapat memperbarui nama, email, dan nomor telepon secara instan.
6. Tombol **Keluar (Logout)**: Menghapus sesi dan menuju `logout.html`.

---

## 3. Alur Administrator (Admin Flow)

Alur admin dirancang untuk operasional penuh sanggar dan galeri seni dengan kapabilitas CRUD lengkap pada semua data entitas:

### 3.1 Autentikasi Administrator
1. Administrator membuka `screens/admin/login.html`.
2. Memasukkan kredensial admin (`admin@galerisriwedari.id` / Sandi).
3. Sistem memverifikasi peran `admin` dan mengarahkan ke `screens/admin/dashboard.html`.

### 3.2 Dashboard Administrator & Metrik Real-Time
1. Menampilkan 4 kartu statistik utama yang terhubung langsung ke database:
   - **Total Galeri:** Dihitung dari jumlah arsip karya aktif.
   - **Total Pengguna:** Dihitung dari jumlah akun terdaftar.
   - **Pesanan Masuk:** Dihitung dari pesanan yang berstatus `Menunggu Konfirmasi`.
   - **Kegiatan Aktif:** Dihitung dari jumlah pertunjukan seni yang akan datang.
2. Grafik tren kunjungan dan ringkasan aktivitas terbaru.
3. Tombol aksi cepat: Tambah Galeri, Kelola Pesanan, Kelola Pengguna.

### 3.3 Kelola Galeri (Full CRUD)
1. Halaman `screens/admin/kelola-galeri.html`.
2. **Read (Melihat & Menyaring):**
   - Menampilkan seluruh arsip galeri dengan thumbnail, kategori, tipe (Foto/Video), dan tanggal.
   - Pencarian real-time berdasarkan judul karya.
   - Filter tipe: Semua, Foto, Video.
3. **Create (Menambah Karya Baru):**
   - Menekan tombol "Tambah Galeri" membuka `screens/admin/tambah-konten.html`.
   - Mengisi Judul, Kategori (diambil dari daftar kategori aktif), Tanggal, Deskripsi, dan Foto.
   - Administrator dapat memilih dari aset gambar budaya lokal yang tersedia atau mengunggah file gambar baru.
   - Menekan tombol simpan -> karya langsung tersimpan ke `SriwedariDB` dan langsung tampil di katalog Pengguna dan Admin.
4. **Update (Mengubah Karya):**
   - Menekan tombol edit (`edit`) pada kartu karya -> membuka modal edit interaktif.
   - Administrator dapat mengubah judul, kategori, tanggal, deskripsi, dan status.
   - Simpan perubahan -> data terbarui seketika dengan notifikasi toast.
5. **Delete (Menghapus Karya):**
   - Menekan tombol hapus (`delete`) pada kartu karya -> membuka modal dialog konfirmasi.
   - Konfirmasi hapus -> item terhapus dari `SriwedariDB` dan kartu menghilang secara halus.

### 3.4 Kelola Kategori Galeri (Full CRUD)
1. Halaman `screens/admin/kategori-galeri.html`.
2. Menampilkan seluruh kategori beserta jumlah arsip yang terikat secara dinamis.
3. **Create:** Menekan "Tambah Kategori" -> mengisi nama kategori dan memilih ikon Material Symbols -> kategori baru tersimpan.
4. **Update:** Menekan tombol edit pada kategori -> mengubah nama atau ikon -> terbarui di seluruh sistem.
5. **Delete:** Menghapus kategori yang tidak lagi digunakan.

### 3.5 Kelola Pesanan Sewa & Reservasi (Order Management)
1. Halaman `screens/admin/kelola-pesanan.html`.
2. Menampilkan seluruh pesanan sewa busana yang diajukan oleh pengguna:
   - Nama pemesan, nomor WhatsApp (dengan tombol langsung hubungi WhatsApp).
   - Busana yang disewa, tanggal mulai sewa, durasi, total bayar.
   - Status pesanan saat ini.
3. Administrator dapat mengubah status pesanan:
   - **Konfirmasi Pesanan:** Mengubah status menjadi `Dikonfirmasi` (Siap Diambil/Kirim).
   - **Selesaikan Pesanan:** Mengubah status menjadi `Selesai` (Kostum telah dikembalikan).
   - **Batalkan Pesanan:** Mengubah status menjadi `Dibatalkan` dan mengembalikan stok busana.

### 3.6 Kelola Pengguna (User Management CRUD)
1. Halaman `screens/admin/kelola-pengguna.html`.
2. Menampilkan seluruh akun yang terdaftar dalam sistem.
3. Menyaring berdasarkan peran: Semua, Admin, Pelanggan/User.
4. Pencarian nama atau email pengguna.
5. **Create:** Tambah akun baru (Nama, Email, No. Telp, Peran Admin/User).
6. **Update:** Ubah peran pengguna (Jadikan Admin / Jadikan User), ubah status akun (Aktif / Nonaktif).
7. **Delete:** Hapus akun pengguna dari sistem.

### 3.7 Pengaturan Lembaga & Sistem
1. Halaman `screens/admin/pengaturan.html`.
2. Mengelola profil sanggar: Nama Galeri, Alamat, Jam Buka, No. WhatsApp Admin, Biaya Deposit Sewa Standar, Syarat & Ketentuan Sewa.
3. Menekan tombol "Simpan Pengaturan" -> konfigurasi tersimpan di `SriwedariDB` dan langsung mempengaruhi informasi di sisi pengguna.

---

## 4. Struktur & Skema Data Terpusat (`SriwedariDB`)

Semua data dikelola melalui modul JavaScript terpusat `assets/js/sriwedari-db.js` yang memanfaatkan `localStorage` browser:

| Entitas | Properti Utama | Fungsi & Keterkaitan |
| :--- | :--- | :--- |
| **`galleries`** | `id, title, category, type, date, description, image, views, likes, relatedCostumeId` | Katalog karya; terhubung ke `categories` dan `costumes`. |
| **`categories`**| `id, name, icon, description, count` | Rumpun kesenian; mengelompokkan `galleries`. |
| **`costumes`**  | `id, name, category, price, rating, stock, sizes, image, description` | Katalog sewa busana; digunakan pada `form-pemesanan`. |
| **`orders`**    | `id, userName, userPhone, userEmail, costumeId, costumeName, startDate, duration, totalPrice, status, createdAt` | Transaksi sewa; dibuat oleh User, diverifikasi oleh Admin. |
| **`events`**    | `id, title, date, time, location, price, quota, booked, image, description` | Jadwal pagelaran; kuota berkurang saat User memesan tiket. |
| **`tickets`**   | `id, eventId, eventTitle, userName, userPhone, quantity, totalPrice, status, createdAt` | Reservasi tiket pertunjukan yang terikat ke akun pengguna. |
| **`users`**     | `id, name, email, phone, role, status, avatar, points, registeredAt` | Akun & hak akses; membedakan akses Pengguna dan Admin. |
| **`settings`**  | `galleryName, openHours, location, phone, email, depositFee, terms, notifications` | Konfigurasi sistem sanggar dan galeri seni. |

---

## 5. Hubungan Keterikatan Antar-Fitur (Integration Points)

1. **Galeri ke Sewa Kostum:** Setiap karya galeri yang memiliki busana khas (misal: Tari Gandrung, Tari Topeng) memiliki tombol tautan langsung ke pemesanan sewa busana terkait.
2. **Pemesanan ke Profil & Admin:** Ketika pengguna mengisi formulir di `form-pemesanan.html`, pesanan seketika muncul di `profil.html` pengguna dan sekaligus muncul di `kelola-pesanan.html` admin.
3. **Admin Ubah Status ke Notifikasi Pengguna:** Ketika admin mengonfirmasi pesanan di panel admin, status pesanan di halaman profil pengguna langsung berubah menjadi `Dikonfirmasi`.
4. **Pemesanan Tiket ke Kuota Pertunjukan:** Setiap tiket yang dipesan pada `jadwal-kegiatan.html` mengurangi sisa kuota kursi secara real-time dan tersimpan di tiket pengguna.
5. **Tambah Galeri ke Seluruh Tampilan:** Karya baru yang ditambahkan admin di `tambah-konten.html` langsung muncul di Beranda Pengguna (`dashboard.html`), Katalog Pengguna (`list-galeri.html`), dan Kelola Galeri Admin (`kelola-galeri.html`).

---

## 6. Fitur Mutakhir Fase 1 (Sewa Multi-Busana & Siklus Finansial Keraton)

1. **Multi-Costume Selection & Dynamic Breakdown:**
   - Formulir pemesanan (`form-pemesanan.html`) mendukung pemilihan banyak busana sekaligus dalam 1 checkout.
   - Perhitungan otomatis: Biaya Sewa + Deposit Jaminan Keamanan (Rp 100.000) = Total Tagihan.
   - Pilihan metode bayar resmi: QRIS Dinamis Sriwedari, Virtual Account BCA Keraton, atau Bayar Tunai di Loket.

2. **Bukti Bayar & Verifikasi Kurator:**
   - Unggah slip transfer dengan preview foto langsung di `profil.html`.
   - Administrator memverifikasi bukti bayar 1-klik di `kelola-pesanan.html` dengan modal penampil resolusi tinggi.

3. **QC Pengembalian Busana & Pencairan Deposit (Refund Engine):**
   - 4 Tingkat Kondisi Busana:
     - **Grade A (Sempurna / Utuh):** Denda Rp 0 &rarr; 100% Deposit dicairkan.
     - **Grade B (Kotor Ringan / Noda Keringat):** Denda cuci laundry Rp 25.000.
     - **Grade C (Kerusakan Sedang / Jahitan Lepas):** Denda perbaikan Rp 50.000.
     - **Grade D (Kerusakan Berat / Aksesoris Hilang):** Denda Rp 100.000 (Deposit hangus).
   - Pengembalian stok busana otomatis ke inventaris saat kostum dinyatakan kembali.

4. **Automated WhatsApp Dispatcher:**
   - 3 Template Resmi Keraton Surakarta untuk konfirmasi booking, pengingat H-1 retur sewa, dan laporan hasil QC deposit.

---

## 7. Fitur Mutakhir Fase 2 (Ticketing Teater, POS Loket & Intelijen Keuangan)

1. **Denah Kursi Teater Interaktif Wayang Orang Sriwedari (`jadwal-kegiatan.html`):**
   - Kanvas representasi Panggung Utama Wayang Orang Sriwedari (Kelir & Area Gamelan Ageng).
   - 3 Zona Kursi dengan penentuan tarif dinamis:
     - **VIP Pendopo (Baris A & B):** Meja jati depan, teh tubruk, Rp 50.000 / tiket.
     - **Reguler Tengah (Baris C & D):** Pandangan langsung panggung, Rp 35.000 / tiket.
     - **Balkon Samping (Baris E & F):** Pandangan atas orkestra gamelan, Rp 25.000 / tiket.
   - Pengecekan kursi terisi live (`SriwedariDB.getBookedSeats()`) dengan pencegahan tabrakan kursi ganda (double-booking protection).

2. **E-Tiket Boarding Pass & QR Pass Dinamis (`profil.html`):**
   - Tiket berbentuk boarding pass budaya dengan nomor kursi, zona pementasan, dan status gerbang.
   - Modal QR Code & Barcode beresolusi tinggi dengan nomor kode tiket untuk discan di pintu masuk.

3. **Intelijen Analisis Keuangan & Ekspor CSV (`dashboard.html`):**
   - Menghitung omzet bruto real-time, pendapatan sewa busana adat, penjualan tiket pagelaran, denda ganti rugi kerusakan busana, dan dana titipan (escrow) yang masih ditahan.
   - Pembagian saluran transaksi: QRIS, Virtual Account, dan Loket Tunai.
   - Tombol **Ekspor Laporan Keuangan (.CSV)** dengan format UTF-8 BOM yang langsung kompatibel dengan Microsoft Excel dan Google Sheets.

4. **Kasir Loket On-The-Spot (POS Mode) & Gate Ticket Scanner (`screens/admin/kasir-loket.html`):**
   - **Mode Kasir Loket:** Penjualan tiket walk-in langsung di tempat dengan auto-allocator kursi terbaik dan modal cetak struk termal pementasan.
   - **Mode Gate Scanner:** Validasi kode tiket instan dengan feedback visual (Hijau = Valid Masuk, Merah = Peringatan Tiket Sudah Pernah Digunakan, Kuning = Tiket Tidak Terdaftar).
   - **Mode Rekap Kehadiran:** Menghitung total penonton masuk gerbang vs belum hadir secara real-time.

---

## 8. Fitur Mutakhir Fase 3 & 4 (Promo Engine, Rating & Review, Wishlist, Audit Trail & Kupon Manager)

1. **Voucher Promo & Diskon Budaya (`form-pemesanan.html` & `assets/js/sriwedari-db.js`):**
   - Mendukung kupon diskon persentase (`PERCENTAGE`) dan nominal rupiah langsung (`FIXED`).
   - Kode kupon terdaftar:
     - `SRIWEDARI10` (Diskon 10% untuk sewa busana pementasan budaya).
     - `KERATON25` (Diskon 25% khusus rombongan festival & sanggar).
     - `HEMATBUDAYA` (Potongan langsung Rp 50.000).
   - Validasi batas minimum transaksi, status masa aktif kupon, dan kuota klaim.
   - Perhitungan diskon live di rincian biaya pemesanan sebelum checkout dan tercatat di riwayat audit sistem.

2. **Sistem Ulasan Budaya & Rating Bintang (`katalog-kostum.html` & `detail-galeri.html`):**
   - Pemilih bintang interaktif (1–5 bintang) dengan feedback visual emas prada (`#C8A25A`).
   - Modal penulisan apresiasi estetik oleh pengunjung dan pemerhati seni.
   - Perhitungan rata-rata nilai rating secara dinamis dan tampilan badge "Terverifikasi Kurator".
   - Tersimpan persisten di `SriwedariDB` dengan pemisahan target kostum dan karya galeri.

3. **Koleksi Favorit / Wishlist Budaya (`profil.html`, `katalog-kostum.html`, `list-galeri.html`):**
   - Tombol favorit (ikon hati & bookmark) interaktif pada setiap kartu kostum dan galeri seni.
   - Tab ketiga pada Profil Pengguna: **Favorit (<span id="tab-wishlist-count">X</span>)** dengan kartu visual dan tombol aksi cepat ("Sewa Busana" / "Lihat Galeri").
   - Kemampuan menghapus item langsung dari halaman profil dengan re-render instan.

4. **Audit Trail Keamanan & Riwayat Aktivitas Kurator (`screens/admin/audit-log.html`):**
   - Pelacakan setiap tindakan penting di sistem secara otomatis:
     - Verifikasi Pembayaran Transaksi (`VERIFY_PAYMENT`)
     - Inspeksi QC Pengembalian Busana & Pencairan Deposit (`QC_RETURN`)
     - Check-In Pintu Gerbang Teater (`GATE_CHECKIN`)
     - Pembuatan Pesanan Baru (`CREATE_ORDER`) & Pemesanan Tiket (`BOOK_TICKET`)
     - Manajemen Akun & Penghapusan Data Pengguna (`DELETE_USER`)
   - 4 Kartu Metrik Keamanan: Total Log Audit, Keamanan & Akses, Transaksi & QC, dan Insiden/Error.
   - Filter log berdasarkan aksi: Semua, Pembayaran, QC Busana, Gate Loket, dan Pengguna.
   - Fitur **Ekspor Audit Log (.CSV)** dengan format UTF-8 BOM untuk pelaporan dewan kurator.

5. **Manajemen Kupon Diskon Budaya (`screens/admin/kelola-kupon.html`):**
   - Administrator dapat membuat kode kupon baru, menentukan tipe (persentase atau potongan tetap), nominal, minimum transaksi, dan tanggal kedaluwarsa.
   - Toggle sakelar status kupon aktif/nonaktif secara instan.
   - Penghitungan metrik total klaim voucher dan estimasi subsidi diskon yang disalurkan.

---

## 9. Matriks 28 Layar UI & Rute Navigasi

| No | File Layar | Peran | Deskripsi Fungsionalitas |
| :---: | :--- | :---: | :--- |
| 1 | `screens/user/login.html` | User | Autentikasi anggota dengan session persistence. |
| 2 | `screens/user/dashboard.html` | User | Beranda eksplorasi galeri, quick menu, dan banner pementasan. |
| 3 | `screens/user/profil.html` | User | Profil lengkap, riwayat sewa, tiket QR pass, dan wishlist favorit. |
| 4 | `screens/user/detail-galeri.html` | User | Arsip karya, filosofi sejarah, wishlist, rating & apresiasi budaya. |
| 5 | `screens/user/detail-galeri-mobile.html`| User | Varian mobile adaptif dari detail galeri seni. |
| 6 | `screens/user/jadwal-kegiatan-mobile.html`| User | Varian mobile adaptif jadwal pementasan. |
| 7 | `screens/user/logout-mobile.html` | User | Dialog konfirmasi keluar akun mobile. |
| 8 | `screens/user/form-pemesanan.html` | User | Checkout multi-busana, deposit, voucher promo & metode bayar. |
| 9 | `screens/user/jadwal-kegiatan.html` | User | Kalender lakon & denah kursi interaktif Wayang Orang Sriwedari. |
| 10 | `screens/user/list-galeri.html` | User | Jelajah katalog galeri dengan filter kategori & bookmark wishlist. |
| 11 | `screens/user/katalog-kostum.html` | User | Katalog busana tari dengan rating bintang, filter rumpun, & sewa. |
| 12 | `screens/user/tiket-saya.html` | User | Ringkasan e-tiket dan kode booking pengguna aktif. |
| 13 | `screens/admin/login.html` | Admin | Autentikasi kurator & staf operasional. |
| 14 | `screens/admin/dashboard.html` | Admin | Dashboard intelijen finansial, omzet bruto, dan quick actions. |
| 15 | `screens/admin/kelola-pengguna.html` | Admin | Manajemen CRUD akun, mutasi hak akses, dan status keaktifan. |
| 16 | `screens/admin/kelola-galeri.html` | Admin | Manajemen arsip seni, upload foto, edit deskripsi & hapus karya. |
| 17 | `screens/admin/kategori-galeri.html` | Admin | Manajemen kategori seni dan rumpun tari Nusantara. |
| 18 | `screens/admin/laporan-keuangan.html` | Admin | Rekapitulasi finansial dan visualisasi arus kas sanggar. |
| 19 | `screens/admin/detail-galeri.html` | Admin | Preview kurasi dan metadata arsip seni admin. |
| 20 | `screens/admin/logout.html` | Admin | Konfirmasi keluar sesi administrator. |
| 21 | `screens/admin/login-animated.html` | Admin | Layar login animasi estetik dengan validasi kurator. |
| 22 | `screens/admin/dashboard-figma-fixed.html`| Admin | Dashboard admin layout responsif alternatif. |
| 23 | `screens/admin/login-mobile-alt.html`| Admin | Login admin mobile compact. |
| 24 | `screens/admin/tambah-konten.html` | Admin | Formulir unggah karya seni baru dengan preview gambar dinamis. |
| 25 | `screens/admin/kelola-pesanan.html` | Admin | Verifikasi slip bayar, inspeksi QC deposit, & dispatch WhatsApp. |
| 26 | `screens/admin/kasir-loket.html` | Admin | POS Loket tiket on-the-spot & QR Gate Ticket Scanner. |
| 27 | `screens/admin/audit-log.html` | Admin | Audit trail keamanan, pelacakan transaksi kurator, & ekspor CSV. |
| 28 | `screens/admin/kelola-kupon.html` | Admin | Manajemen kupon promo budaya, sakelar status & kuota klaim. |

---

## 10. Standar Kualitas & Bebas Error Merah

- **Zero Dummy Data:** Seluruh 28 layar terhubung ke mesin database terintegrasi `SriwedariDB` dengan sinkronisasi reaktif dua arah.
- **Bebas Error Aset:** Seluruh gambar merujuk ke berkas PNG resolusi tinggi lokal yang valid (tidak ada `404 Not Found`).
- **Bebas Error Sintaks:** Seluruh kode JavaScript diverifikasi tanpa kegagalan parsing atau peringatan kutip inline.
- **Persistensi State:** Seluruh transaksi sewa, pemesanan tiket, ulasan bintang, koleksi wishlist, dan log audit tersimpan persisten di penyimpanan peramban.
