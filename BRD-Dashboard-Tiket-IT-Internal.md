# Dokumen Kebutuhan Bisnis (BRD)
## Dashboard Tiket IT Internal
### PT Lead Geeks Indonesia

---

## 1. Informasi Dokumen

| Item | Detail |
|---|---|
| Nama Proyek | Dashboard Tiket IT Internal |
| Tipe Dokumen | Business Requirements Document (BRD) |
| Versi | 1.1 |
| Tanggal | 11 Juni 2026 |

---

## 2. Teknologi yang Digunakan

| Layer | Teknologi |
|---|---|
| Backend | Laravel 12 (REST API) |
| Frontend | Next.js 16 (React + TypeScript) |
| Database | MySQL |
| Styling | Tailwind CSS |
| Autentikasi | Laravel Sanctum (token-based) |

---

## 3. Batasan Proyek

| No | Batasan |
|---|---|
| 1 | Tidak ada manajemen pengguna atau role (hanya 1 akun admin) |
| 2 | Tidak ada notifikasi email atau push notification |
| 3 | Tidak ada integrasi dengan sistem eksternal |
| 4 | Tidak ada fitur ekspor data (CSV/PDF) |
| 5 | Tidak ada laporan atau grafik historis |
| 6 | Hanya mengimplementasikan fitur yang tercantum pada Kebutuhan Fungsional |
| 7 | Fitur Bonus bersifat opsional dan tidak masuk dalam scope utama |

---

## 4. Gambaran Umum Proyek

### 4.1 Latar Belakang
PT Lead Geeks Indonesia membutuhkan sebuah sistem dashboard sederhana untuk melacak dan mengelola tiket dukungan IT internal. Sistem ini bertujuan memudahkan tim IT dalam memantau, mengelola, dan menyelesaikan laporan masalah teknis dari karyawan secara terstruktur dan efisien.

### 4.2 Tujuan
Membangun dashboard berbasis web yang memungkinkan pengguna untuk membuat, melihat, memperbarui, dan menghapus tiket IT internal, serta menampilkan ringkasan statistik tiket secara real-time.

### 4.3 Ruang Lingkup
Sistem mencakup dua sisi:
- **Portal User (Publik)** — karyawan membuat laporan masalah dan memantau status tiket tanpa login
- **Dashboard Admin (Terproteksi)** — tim IT mengelola seluruh tiket dengan login menggunakan Laravel Sanctum

---

## 5. Kebutuhan Fungsional

### 5.1 Autentikasi Admin

| No | Fitur | Deskripsi |
|---|---|---|
| A-01 | Login Admin | Admin login dengan email dan password; menerima token Sanctum |
| A-02 | Validasi Client-Side | Validasi email format dan panjang password sebelum API call |
| A-03 | Proteksi Halaman | Halaman /admin redirect ke /login jika token tidak ada |
| A-04 | Logout | Token direvoke di server, client dihapus, redirect ke /login |

### 5.2 Manajemen Tiket

| No | Fitur | Deskripsi |
|---|---|---|
| F-01 | Tambah Tiket | Admin membuat tiket baru dengan mengisi semua field yang diperlukan |
| F-02 | Edit Tiket | Admin mengubah informasi pada tiket yang sudah ada |
| F-03 | Perbarui Status Tiket | Admin mengubah status tiket langsung dari dropdown di tabel |
| F-04 | Hapus Tiket | Admin menghapus tiket dengan konfirmasi dialog |
| F-05 | Lihat Daftar Tiket | Admin melihat seluruh daftar tiket dalam tabel |

### 5.3 Field Tiket

| No | Field | Tipe | Keterangan |
|---|---|---|---|
| 1 | Judul Tiket | Teks (wajib) | Deskripsi singkat masalah |
| 2 | Nama Pelapor | Teks (opsional) | Nama karyawan yang melaporkan |
| 3 | Kategori Masalah | Pilihan (wajib) | Hardware / Software / Network / Access / Other |
| 4 | Prioritas | Pilihan (wajib) | Low / Medium / High / Critical |
| 5 | Status | Pilihan (wajib) | Open / In Progress / Resolved / Closed |
| 6 | Penanggung Jawab | Teks (wajib) | Nama staf IT yang ditugaskan |
| 7 | Tanggal Dibuat | Timestamp (otomatis) | Dibuat oleh sistem saat tiket pertama kali disimpan |

### 5.4 Dashboard Statistik

| No | Statistik | Deskripsi |
|---|---|---|
| D-01 | Total Tiket | Jumlah seluruh tiket dalam sistem |
| D-02 | Tiket Terbuka | Jumlah tiket berstatus "Open" |
| D-03 | Tiket Sedang Dikerjakan | Jumlah tiket berstatus "In Progress" |
| D-04 | Tiket Prioritas Tinggi | Jumlah tiket dengan prioritas "High" atau "Critical" |

### 5.5 Portal User (Publik)

| No | Fitur | Deskripsi |
|---|---|---|
| P-01 | Form Laporan Tiket | Karyawan mengisi nama, judul, kategori, dan prioritas |
| P-02 | Submit Tiket | Tiket terkirim dengan status default "Open" |
| P-03 | Lihat Status Tiket | Semua tiket ditampilkan dalam tabel read-only |
| P-04 | Link ke Admin | Tombol "Login Admin" di navbar mengarah ke /login |

### 5.6 Notifikasi & Feedback (AlertModal)

| No | Trigger | Tipe | Pesan |
|---|---|---|---|
| M-01 | Login dengan email/password salah | Error | "Login Gagal" |
| M-02 | Password kurang dari 6 karakter | Error | "Password Terlalu Pendek" |
| M-03 | Tambah tiket berhasil | Sukses | "Tiket Ditambahkan" |
| M-04 | Edit tiket berhasil | Sukses | "Tiket Diperbarui" |
| M-05 | Hapus tiket berhasil | Sukses | "Tiket Dihapus" |
| M-06 | Update status berhasil | Sukses | "Status Diperbarui" |
| M-07 | Gagal menyimpan tiket (API error) | Error | "Gagal Menambahkan/Memperbarui Tiket" |

---

## 6. Kebutuhan Non-Fungsional

| No | Kebutuhan | Deskripsi |
|---|---|---|
| NF-01 | Responsif | Tampilan menyesuaikan desktop, tablet, dan mobile |
| NF-02 | Keamanan | Token Sanctum disimpan di cookie dengan masa berlaku 8 jam |
| NF-03 | Feedback Visual | Setiap aksi CRUD menampilkan AlertModal sukses atau error |
| NF-04 | Error Recovery | Modal form tetap terbuka saat API gagal agar pengguna dapat mencoba ulang |
| NF-05 | Hierarki Informasi | Tata letak terstruktur, informasi mudah dipahami |

---

## 7. Fitur Bonus (Opsional)

| No | Fitur | Status |
|---|---|---|
| B-01 | Indikator Warna Status | Diimplementasikan — badge berwarna di tabel tiket |
| B-02 | Update Status Inline | Diimplementasikan — dropdown langsung di baris tabel |
| B-03 | Validasi Client-Side | Diimplementasikan — email format, panjang password |
| B-04 | Pencarian & Filter Tiket | Belum diimplementasikan |
| B-05 | Catatan / Komentar | Belum diimplementasikan |
| B-06 | Pengurutan Data | Belum diimplementasikan |

---

## 8. Persyaratan Pengiriman

Proyek dikirimkan dengan menyertakan:

1. **Repositori GitHub** — source code backend dan frontend
2. **Dokumentasi** (`README.md`, `deploy.md`) — gambaran umum, instalasi, dan panduan deploy
3. **QA Automation** — folder `QA/` berisi 48 test case otomatis (Mocha + Selenium)
4. **Laporan QA** — `QA/report.md` dan `QA/bug report.md`

---

*Dokumen ini disusun sebagai acuan pengembangan untuk penilaian teknis PT Lead Geeks Indonesia.*