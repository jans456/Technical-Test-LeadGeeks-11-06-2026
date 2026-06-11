# Test Case — Dashboard Tiket IT Internal

**PT Lead Geeks Indonesia**  
**Versi:** 1.1 | **Tanggal:** 2026-06-11

---

## Modul: Login Admin

| ID | Deskripsi | Langkah | Ekspektasi | Tipe | Spec |
|---|---|---|---|---|---|
| TC-001 | Halaman login dapat diakses | Buka `localhost:3000/login` | Status 200, judul "Login Admin" tampil | Fungsional | `login.spec.js` |
| TC-002 | Semua elemen form tersedia | Buka halaman login | Field email, field password, tombol "Masuk" ada | Fungsional | `login.spec.js` |
| TC-003 | Kotak akun demo ditampilkan | Buka halaman login | Teks "Akun Demo" beserta email & password tampil | Fungsional | `login.spec.js` |
| TC-004 | Password tersembunyi secara default | Isi field password, lihat tipe input | `type="password"` | Fungsional | `login.spec.js` |
| TC-005 | Eye toggle — klik sekali menampilkan password | Isi password → klik ikon mata | `type="text"` | Fungsional | `login.spec.js` |
| TC-006 | Eye toggle — klik dua kali menyembunyikan kembali | Klik ikon mata dua kali | `type="password"` | Fungsional | `login.spec.js` |
| TC-007 | Login dengan kredensial salah menampilkan AlertModal | Isi email/password salah → submit | AlertModal dengan judul "Login Gagal" dan pesan berisi "salah" tampil | Fungsional | `login.spec.js` |
| TC-007a | Password < 6 karakter menampilkan AlertModal validasi | Isi email valid, isi password 3 karakter → submit | AlertModal judul "Password Terlalu Pendek" tampil | Fungsional | `login.spec.js` |
| TC-007b | AlertModal validasi dapat ditutup dengan tombol OK | Munculkan AlertModal → klik tombol OK | AlertModal menghilang | Fungsional | `login.spec.js` |
| TC-008 | Login valid redirect ke dashboard admin | Isi `admin@leadgeeks.com` / `admin123` → submit | URL berubah ke `/admin` | Fungsional | `login.spec.js` |
| TC-VR-001 | Visual — tampilan halaman login | Buka halaman login → ambil screenshot | Diff piksel ≤ 1% dari baseline | Visual Regression | `login.spec.js` |
| TC-VR-002 | Visual — password visible (eye aktif) | Isi password → klik eye → screenshot | Diff ≤ 1% | Visual Regression | `login.spec.js` |
| TC-VR-003 | Visual — AlertModal error setelah login gagal | Submit dengan kredensial salah → screenshot | Diff ≤ 2% | Visual Regression | `login.spec.js` |
| TC-VR-004 | Visual — redirect dashboard setelah login | Login berhasil → screenshot dashboard | Diff ≤ 1% | Visual Regression | `login.spec.js` |

---

## Modul: Dashboard Admin

| ID | Deskripsi | Langkah | Ekspektasi | Tipe | Spec |
|---|---|---|---|---|---|
| TC-009 | Dashboard dapat diakses setelah login | Login → buka `/admin` | Halaman admin tampil, tidak redirect | Fungsional | `admin.spec.js` |
| TC-010 | Menampilkan tepat 4 kartu statistik | Buka dashboard admin | 4 kartu (Total, Terbuka, Dikerjakan, Prioritas Tinggi) tampil | Fungsional | `admin.spec.js` |
| TC-011 | Label kartu statistik benar | Buka dashboard admin | Label sesuai: "Total Tiket", "Tiket Terbuka", "Sedang Dikerjakan", "Prioritas Tinggi" | Fungsional | `admin.spec.js` |
| TC-012 | Tabel tiket menampilkan data | Buka dashboard admin | Minimal 1 baris tiket ada | Fungsional | `admin.spec.js` |
| TC-013 | Tombol "+ Tambah Tiket" membuka modal | Klik tombol "+ Tambah Tiket" | Modal form tampil dengan judul "Tambah Tiket" | Fungsional | `admin.spec.js` |
| TC-014 | Tambah tiket baru berhasil | Buka modal → isi form → klik Simpan | Baris baru muncul di tabel, jumlah bertambah 1 | Fungsional | `admin.spec.js` |
| TC-014a | AlertModal sukses muncul setelah tambah tiket | Submit form tambah tiket → tunggu | AlertModal judul "Tiket Ditambahkan" muncul dan dapat ditutup | Fungsional | `admin.spec.js` |
| TC-015 | Tombol Edit membuka modal edit | Klik tombol "Edit" pada baris pertama | Modal form tampil dengan judul "Edit Tiket" dan field terisi | Fungsional | `admin.spec.js` |
| TC-016 | Dropdown status inline mengubah status | Ganti nilai dropdown status di baris pertama | Nilai dropdown berubah sesuai pilihan | Fungsional | `admin.spec.js` |
| TC-016a | AlertModal sukses muncul setelah update status | Ubah dropdown status → tunggu | AlertModal judul "Status Diperbarui" muncul | Fungsional | `admin.spec.js` |
| TC-017 | Tombol Hapus membuka dialog konfirmasi | Klik tombol "Hapus" pada baris pertama | Dialog konfirmasi "Hapus Tiket" tampil | Fungsional | `admin.spec.js` |
| TC-017a | AlertModal sukses muncul setelah hapus tiket | Konfirmasi hapus → tunggu | AlertModal judul "Tiket Dihapus" muncul, jumlah baris berkurang 1 | Fungsional | `admin.spec.js` |
| TC-018 | Batal hapus tidak mengurangi data | Buka dialog hapus → klik "Batal" | Jumlah baris tidak berubah | Fungsional | `admin.spec.js` |
| TC-019 | Logout mengarahkan ke halaman login | Klik tombol "Logout" | URL berubah ke `/login` | Fungsional | `admin.spec.js` |
| TC-VR-005 | Visual — kartu statistik | Buka dashboard → screenshot area stats | Diff ≤ 1% | Visual Regression | `admin.spec.js` |
| TC-VR-006 | Visual — halaman dashboard admin full | Buka dashboard → screenshot full page | Diff ≤ 1% | Visual Regression | `admin.spec.js` |
| TC-VR-007 | Visual — modal tambah tiket | Buka modal tambah → screenshot | Diff ≤ 1% | Visual Regression | `admin.spec.js` |
| TC-VR-008 | Visual — modal edit tiket | Buka modal edit → screenshot | Diff ≤ 1% | Visual Regression | `admin.spec.js` |
| TC-VR-009 | Visual — tabel setelah update status | Update status → screenshot tabel | Diff ≤ 2% | Visual Regression | `admin.spec.js` |
| TC-VR-010 | Visual — dialog konfirmasi hapus | Buka dialog hapus → screenshot | Diff ≤ 1% | Visual Regression | `admin.spec.js` |
| TC-VR-011 | Visual — AlertModal sukses CRUD | Submit tiket → tunggu AlertModal → screenshot | Diff ≤ 2% | Visual Regression | `admin.spec.js` |
| TC-VR-012 | Visual — halaman login setelah logout | Klik logout → screenshot | Diff ≤ 1% | Visual Regression | `admin.spec.js` |

---

## Modul: Portal User

| ID | Deskripsi | Langkah | Ekspektasi | Tipe | Spec |
|---|---|---|---|---|---|
| TC-020 | Halaman portal dapat diakses di URL root | Buka `localhost:3000` | Halaman portal tampil | Fungsional | `portal.spec.js` |
| TC-021 | Navbar menampilkan judul dashboard | Buka portal | Header berisi "Dashboard Tiket IT Internal" | Fungsional | `portal.spec.js` |
| TC-022 | Tombol "Login Admin" tersedia di navbar | Buka portal | Link ke `/login` ada di navbar | Fungsional | `portal.spec.js` |
| TC-023 | Form laporan memiliki semua field | Buka portal | Field nama, judul, kategori, prioritas, dan tombol kirim ada | Fungsional | `portal.spec.js` |
| TC-024 | Submit tiket menampilkan pesan sukses | Isi form lengkap → klik "Kirim Laporan" | Pesan sukses (background hijau) tampil | Fungsional | `portal.spec.js` |
| TC-025 | Daftar tiket menampilkan data | Buka portal setelah ada tiket | Minimal 1 baris di tabel status tiket | Fungsional | `portal.spec.js` |
| TC-026 | Daftar tiket bersifat read-only | Buka portal → lihat tabel tiket | Tidak ada tombol Edit atau Hapus pada baris | Fungsional | `portal.spec.js` |
| TC-VR-013 | Visual — halaman portal user full | Buka portal → screenshot full page | Diff ≤ 1% | Visual Regression | `portal.spec.js` |
| TC-VR-014 | Visual — form laporan tiket | Buka portal → screenshot | Diff ≤ 1% | Visual Regression | `portal.spec.js` |
| TC-VR-015 | Visual — pesan sukses setelah submit | Submit tiket → screenshot | Diff ≤ 2% | Visual Regression | `portal.spec.js` |
| TC-VR-016 | Visual — daftar status tiket (tabel) | Buka portal → scroll ke tabel → screenshot | Diff ≤ 2% | Visual Regression | `portal.spec.js` |
| TC-VR-017 | Visual — tampilan mobile 375×812 | Set viewport 375px → buka portal → screenshot | Diff ≤ 1% | Visual Regression | `portal.spec.js` |

---

## Ringkasan

| Modul | Fungsional | Visual Regression | Total |
|---|---|---|---|
| Login Admin | 10 | 4 | **14** |
| Dashboard Admin | 14 | 8 | **22** |
| Portal User | 7 | 5 | **12** |
| **Total** | **31** | **17** | **48** |

---

## Komponen AlertModal

AlertModal adalah komponen overlay modal yang menggantikan inline error message. Muncul sebagai overlay terpusat dengan ikon, judul, pesan, dan tombol OK.

**Selector CSS:**
- Overlay: `div.fixed.inset-0.z-50`
- Judul: `h2.text-center` (membedakan dari TicketModal/DeleteConfirm)
- Pesan: `p.text-center.text-sm.text-gray-500`
- Tombol OK: `button` dengan text "OK" di dalam overlay

**Skenario yang dicover:**
| Aksi | Tipe | Judul AlertModal |
|---|---|---|
| Login dengan kredensial salah | Error | Login Gagal |
| Password < 6 karakter | Error | Password Terlalu Pendek |
| Tambah tiket berhasil | Sukses | Tiket Ditambahkan |
| Edit tiket berhasil | Sukses | Tiket Diperbarui |
| Hapus tiket berhasil | Sukses | Tiket Dihapus |
| Update status berhasil | Sukses | Status Diperbarui |

---

## Status Test (Diisi saat eksekusi)

| ID | Status | Catatan |
|---|---|---|
| TC-001 | — | |
| TC-002 | — | |
| TC-003 | — | |
| TC-004 | — | |
| TC-005 | — | |
| TC-006 | — | |
| TC-007 | — | |
| TC-007a | — | |
| TC-007b | — | |
| TC-008 | — | |
| TC-VR-001 | — | |
| TC-VR-002 | — | |
| TC-VR-003 | — | |
| TC-VR-004 | — | |
| TC-009 | — | |
| TC-010 | — | |
| TC-011 | — | |
| TC-012 | — | |
| TC-013 | — | |
| TC-014 | — | |
| TC-014a | — | |
| TC-015 | — | |
| TC-016 | — | |
| TC-016a | — | |
| TC-017 | — | |
| TC-017a | — | |
| TC-018 | — | |
| TC-019 | — | |
| TC-VR-005 | — | |
| TC-VR-006 | — | |
| TC-VR-007 | — | |
| TC-VR-008 | — | |
| TC-VR-009 | — | |
| TC-VR-010 | — | |
| TC-VR-011 | — | |
| TC-VR-012 | — | |
| TC-020 | — | |
| TC-021 | — | |
| TC-022 | — | |
| TC-023 | — | |
| TC-024 | — | |
| TC-025 | — | |
| TC-026 | — | |
| TC-VR-013 | — | |
| TC-VR-014 | — | |
| TC-VR-015 | — | |
| TC-VR-016 | — | |
| TC-VR-017 | — | |
