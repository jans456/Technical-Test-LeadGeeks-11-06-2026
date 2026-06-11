# Dokumen Kebutuhan Bisnis (BRD)
## Dashboard Tiket IT Internal
### PT Lead Geeks Indonesia

---

## 1. Informasi Dokumen

| Item | Detail |
|---|---|
| Nama Proyek | Dashboard Tiket IT Internal |
| Tipe Dokumen | Business Requirements Document (BRD) |
| Versi | 1.0 |
| Tanggal | 11 Juni 2026 |

---

## 2. Teknologi yang Digunakan

| Layer | Teknologi |
|---|---|
| Backend | Laravel 11 (REST API) |
| Frontend | Next.js 15 (React) |
| Database | MySQL |
| Styling | Tailwind CSS |

---

## 3. Batasan Proyek

| No | Batasan |
|---|---|
| 1 | Tidak ada fitur autentikasi / login |
| 2 | Tidak ada manajemen pengguna atau role |
| 3 | Tidak ada notifikasi email atau push notification |
| 4 | Tidak ada integrasi dengan sistem eksternal |
| 5 | Tidak ada fitur ekspor data (CSV/PDF) |
| 6 | Tidak ada laporan atau grafik historis |
| 7 | Hanya mengimplementasikan fitur yang tercantum pada Kebutuhan Fungsional |
| 8 | Fitur Bonus bersifat opsional dan tidak masuk dalam scope utama |

---

## 4. Gambaran Umum Proyek

### 2.1 Latar Belakang
PT Lead Geeks Indonesia membutuhkan sebuah sistem dashboard sederhana untuk melacak dan mengelola tiket dukungan IT internal. Sistem ini bertujuan memudahkan tim IT dalam memantau, mengelola, dan menyelesaikan laporan masalah teknis dari karyawan secara terstruktur dan efisien.

### 2.2 Tujuan
Membangun dashboard berbasis web yang memungkinkan pengguna untuk membuat, melihat, memperbarui, dan menghapus tiket IT internal, serta menampilkan ringkasan statistik tiket secara real-time.

### 2.3 Ruang Lingkup
Sistem mencakup fitur manajemen tiket lengkap (CRUD), tampilan dashboard dengan statistik ringkas, serta antarmuka yang responsif dan mudah digunakan.

---

## 5. Kebutuhan Fungsional

### 3.1 Manajemen Tiket

Pengguna harus dapat melakukan operasi berikut terhadap tiket:

| No | Fitur | Deskripsi |
|---|---|---|
| F-01 | Tambah Tiket | Pengguna dapat membuat tiket baru dengan mengisi semua field yang diperlukan |
| F-02 | Edit Tiket | Pengguna dapat mengubah informasi pada tiket yang sudah ada |
| F-03 | Perbarui Status Tiket | Pengguna dapat mengubah status tiket tanpa harus membuka form edit penuh |
| F-04 | Hapus Tiket | Pengguna dapat menghapus tiket dari sistem |
| F-05 | Lihat Daftar Tiket | Pengguna dapat melihat seluruh daftar tiket yang ada dalam sistem |

### 3.2 Field Tiket yang Diperlukan

Setiap tiket harus menampilkan informasi berikut:

| No | Field | Tipe Data | Keterangan |
|---|---|---|---|
| 1 | Judul Tiket | Teks | Nama/deskripsi singkat masalah |
| 2 | Kategori Masalah | Pilihan | Kategori jenis gangguan IT |
| 3 | Prioritas | Pilihan | Tingkat urgensi penanganan tiket |
| 4 | Status | Pilihan | Status penanganan tiket saat ini |
| 5 | Penanggung Jawab | Teks | Nama staf IT yang ditugaskan |
| 6 | Tanggal Dibuat | Tanggal | Tanggal tiket pertama kali dibuat |

### 3.3 Pilihan Status Tiket

| Status | Deskripsi |
|---|---|
| Terbuka (Open) | Tiket baru masuk, belum ditangani |
| Sedang Dikerjakan (In Progress) | Tiket sedang dalam proses penanganan |
| Selesai (Resolved) | Masalah telah diselesaikan |
| Ditutup (Closed) | Tiket ditutup dan diarsipkan |

### 3.4 Dashboard Statistik

Dashboard harus menampilkan ringkasan berikut secara otomatis:

| No | Statistik | Deskripsi |
|---|---|---|
| D-01 | Total Tiket | Jumlah seluruh tiket dalam sistem |
| D-02 | Tiket Terbuka | Jumlah tiket dengan status "Terbuka" |
| D-03 | Tiket Sedang Dikerjakan | Jumlah tiket dengan status "Sedang Dikerjakan" |
| D-04 | Tiket Prioritas Tinggi | Jumlah tiket yang ditandai dengan prioritas tinggi |

---

## 6. Kebutuhan Non-Fungsional

| No | Kebutuhan | Deskripsi |
|---|---|---|
| NF-01 | Responsif | Tampilan menyesuaikan dengan berbagai ukuran layar (desktop, tablet, mobile) |
| NF-02 | Hierarki Informasi yang Jelas | Tata letak terstruktur sehingga informasi mudah dipahami |
| NF-03 | Dashboard Mudah Dibaca | Informasi ringkasan ditampilkan secara visual dan intuitif |

---

## 7. Fitur Bonus (Opsional)

Fitur-fitur berikut bersifat opsional dan tidak wajib untuk pemenuhan minimum:

| No | Fitur | Deskripsi |
|---|---|---|
| B-01 | Pencarian & Filter Tiket | Pengguna dapat mencari tiket berdasarkan kata kunci atau memfilter berdasarkan kategori/status/prioritas |
| B-02 | Indikator Warna Status | Setiap status tiket ditampilkan dengan warna berbeda untuk memudahkan identifikasi cepat |
| B-03 | Catatan / Komentar | Pengguna dapat menambahkan catatan atau komentar pada tiket |
| B-04 | Pengurutan Data | Tiket dapat diurutkan berdasarkan status, prioritas, atau tanggal dibuat |

---

## 8. Persyaratan Pengiriman

Proyek harus dikirimkan dengan menyertakan:

1. **Tautan repositori GitHub** atau file ZIP berisi source code proyek
2. **Tautan demo langsung** (misalnya: Netlify, Vercel, atau platform serupa)
3. **Dokumentasi sederhana** yang mencakup:
   - Gambaran umum proyek
   - Teknologi yang digunakan
   - Fitur yang diimplementasikan
   - Panduan instalasi (jika diperlukan)

---

*Dokumen ini disusun sebagai acuan pengembangan untuk penilaian teknis PT Lead Geeks Indonesia.*
