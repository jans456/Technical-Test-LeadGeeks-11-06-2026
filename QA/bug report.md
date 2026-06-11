# Bug Report — Dashboard Tiket IT Internal

**PT Lead Geeks Indonesia**  
**Tanggal Eksekusi:** 11 Juni 2026  
**Penguji:** Janji Nur S  
**Versi Aplikasi:** 1.1  
**Environment:** localhost (Next.js 3000 / Laravel 8000)

---

## Ringkasan

| Severity | Jumlah |
|---|---|
| Critical | 0 |
| Major | 2 |
| Minor | 3 |
| Trivial | 1 |
| **Total** | **6** |

---

## Daftar Bug

### BUG-001 — TicketModal Tertutup Saat Terjadi Kegagalan API

| Item | Detail |
|---|---|
| **ID** | BUG-001 |
| **Severity** | Major |
| **Status** | Fixed |
| **Modul** | Dashboard Admin — Tambah / Edit Tiket |
| **TC Terkait** | TC-014, TC-015 |

**Deskripsi:**  
Ketika operasi simpan tiket gagal karena error API (server tidak merespons, validasi gagal, dll.), modal form `TicketModal` tetap menutup secara otomatis meskipun data belum berhasil disimpan. Pengguna tidak dapat mencoba kembali tanpa membuka modal ulang secara manual.

**Langkah Reproduksi:**
1. Matikan server backend (hentikan `php artisan serve`)
2. Buka halaman `/admin`
3. Klik tombol "+ Tambah Tiket"
4. Isi semua field form dengan data valid
5. Klik "Simpan"

**Hasil Aktual:**  
AlertModal "Gagal Menambahkan Tiket" muncul sebentar, lalu modal form menutup. Pengguna harus membuka kembali modal untuk mencoba.

**Hasil Diharapkan:**  
AlertModal error muncul, tetapi modal form tetap terbuka agar pengguna dapat mencoba kembali setelah koneksi pulih.

**Root Cause:**  
`handleSave` di `admin/page.tsx` menangkap error secara diam-diam (`catch { showAlert(...) }`) tanpa melempar ulang (`throw`). Akibatnya, `onSave` di `TicketModal` selalu dianggap berhasil, sehingga `onClose()` selalu dipanggil.

**Perbaikan:**  
Tambahkan `throw new Error('save failed')` di akhir blok `catch` pada `handleSave`. Ubah `TicketModal.handleSubmit` untuk hanya memanggil `onClose()` jika `onSave` berhasil (tidak melempar).

---

### BUG-002 — Import `FormEvent` yang Usang di TicketModal

| Item | Detail |
|---|---|
| **ID** | BUG-002 |
| **Severity** | Major |
| **Status** | Fixed |
| **Modul** | Frontend — TicketModal.tsx |
| **TC Terkait** | TC-013, TC-014 |

**Deskripsi:**  
`TicketModal.tsx` mengimpor `FormEvent` dari React: `import { ..., FormEvent } from 'react'`. Pada Next.js 16 / React 19, `FormEvent` ditandai sebagai deprecated (kode 6385). Hal ini memunculkan peringatan TypeScript dan berpotensi menyebabkan masalah kompatibilitas ke depan.

**Langkah Reproduksi:**
1. Buka `frontend/components/TicketModal.tsx` di editor
2. Lihat peringatan TypeScript pada import `FormEvent`

**Hasil Aktual:**  
TypeScript menampilkan peringatan: `'FormEvent' is deprecated`.

**Hasil Diharapkan:**  
Tidak ada peringatan TypeScript, kode menggunakan tipe structural yang valid.

**Perbaikan:**  
Hapus `FormEvent` dari import. Ganti tipe parameter event handler:
```tsx
// Sebelum
const handleSubmit = async (e: FormEvent) => {

// Sesudah
const handleSubmit = async (e: { preventDefault(): void }) => {
```

---

### BUG-003 — Dropdown Status Bisa Terpicu Ganda Jika Diklik Cepat

| Item | Detail |
|---|---|
| **ID** | BUG-003 |
| **Severity** | Minor |
| **Status** | Open |
| **Modul** | Dashboard Admin — Tabel Tiket |
| **TC Terkait** | TC-016 |

**Deskripsi:**  
Jika pengguna mengubah dropdown status dan langsung mengkliknya lagi sebelum respons API kembali, dua permintaan `PUT /api/tickets/{id}` dapat terkirim hampir bersamaan. Ini dapat menyebabkan inkonsistensi data jika respons kedua tiba sebelum yang pertama.

**Langkah Reproduksi:**
1. Buka halaman `/admin`
2. Ubah status tiket pertama dari dropdown
3. Segera ubah lagi sebelum tampilan diperbarui

**Hasil Aktual:**  
Dua API call terkirim; status akhir tergantung respons mana yang terakhir diproses.

**Hasil Diharapkan:**  
Dropdown dinonaktifkan (disabled) saat API call sedang berjalan, atau request sebelumnya dibatalkan (debounce/cancel).

**Rekomendasi:**  
Tambahkan state `updatingId` untuk melacak tiket yang sedang diperbarui, dan set `disabled` pada dropdown selama proses update.

---

### BUG-004 — Judul Tiket Panjang Meluap dari Sel Tabel

| Item | Detail |
|---|---|
| **ID** | BUG-004 |
| **Severity** | Minor |
| **Status** | Open |
| **Modul** | Frontend — TicketTable.tsx |
| **TC Terkait** | TC-012 |

**Deskripsi:**  
Judul tiket yang sangat panjang (> 80 karakter) melebihi lebar kolom tabel dan mendorong kolom lain keluar dari layout, terutama pada layar berukuran sedang.

**Langkah Reproduksi:**
1. Tambahkan tiket dengan judul berisi 100+ karakter
2. Lihat tampilan di tabel pada layar 1024px

**Hasil Aktual:**  
Teks meluap keluar dari batas kolom atau mendorong kolom aksi ke kanan layar.

**Hasil Diharapkan:**  
Teks terpotong dengan elipsis (`…`) dan tooltip menampilkan teks lengkap.

**Rekomendasi:**  
Tambahkan kelas `truncate max-w-xs` pada sel judul tiket di `TicketTable.tsx`.

---

### BUG-005 — Pesan Sukses Portal User Tidak Menghilang Otomatis

| Item | Detail |
|---|---|
| **ID** | BUG-005 |
| **Severity** | Minor |
| **Status** | Open |
| **Modul** | Portal User — Form Laporan |
| **TC Terkait** | TC-024 |

**Deskripsi:**  
Setelah pengguna berhasil mengirim tiket, pesan sukses (background hijau) muncul di atas form tetapi tidak pernah menghilang secara otomatis. Pengguna harus me-refresh halaman untuk mengirim tiket baru.

**Langkah Reproduksi:**
1. Buka halaman portal user (`localhost:3000`)
2. Isi form dan klik "Kirim Laporan"
3. Lihat pesan sukses

**Hasil Aktual:**  
Pesan sukses tetap tampil tanpa batas waktu.

**Hasil Diharapkan:**  
Pesan sukses menghilang setelah 5 detik, atau form di-reset untuk memungkinkan pengiriman berikutnya.

---

### BUG-006 — Teks Visual Regression Baseline Berbeda antar OS

| Item | Detail |
|---|---|
| **ID** | BUG-006 |
| **Severity** | Trivial |
| **Status** | Open |
| **Modul** | QA — Visual Regression |
| **TC Terkait** | TC-VR-001 s/d TC-VR-017 |

**Deskripsi:**  
Baseline screenshot yang dibuat di Windows dapat menghasilkan diff piksel > 1% saat dijalankan di sistem operasi lain (Linux/macOS) karena perbedaan font rendering dan anti-aliasing antar platform.

**Dampak:**  
Test visual regression bisa gagal di environment CI/CD yang menggunakan Linux meski secara visual tampilan sudah sesuai.

**Rekomendasi:**  
Regenerasi baseline di environment yang sama dengan CI/CD (Linux), atau naikkan threshold diff ke 2% untuk mengakomodasi perbedaan font rendering antar platform.

---

*Laporan ini dibuat berdasarkan hasil eksekusi test suite automation QA pada 11 Juni 2026.*
