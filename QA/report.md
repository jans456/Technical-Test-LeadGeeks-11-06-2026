# Laporan Hasil Pengujian — Dashboard Tiket IT Internal

**PT Lead Geeks Indonesia**  
**Tanggal Eksekusi:** 11 Juni 2026  
**Penguji:** Janji Nur S  
**Versi Aplikasi:** 1.1  
**Framework:** Mocha + Selenium WebDriver + Allure

---

## Ringkasan Eksekusi

| Metrik | Nilai |
|---|---|
| Total Test Case | 48 |
| Lulus (Pass) | 44 |
| Gagal (Fail) | 2 |
| Dilewati (Skip) | 2 |
| Durasi Total | ± 4 menit 38 detik |
| Browser | Google Chrome (visible mode) |
| Environment | Windows 11 / localhost |

---

## Hasil per Suite

### Suite 1: Login Admin (`login.spec.js`)

| # | Test Case | Status | Durasi | Catatan |
|---|---|---|---|---|
| TC-001 | Menampilkan judul "Login Admin" | PASS | 1.2s | |
| TC-002 | Menampilkan field email, password, tombol masuk | PASS | 0.9s | |
| TC-003 | Kotak akun demo berisi kredensial | PASS | 0.8s | |
| TC-004 | Password tersembunyi secara default | PASS | 1.1s | |
| TC-005 | Eye toggle — klik sekali menampilkan password | PASS | 1.3s | |
| TC-006 | Eye toggle — klik dua kali menyembunyikan kembali | PASS | 1.5s | |
| TC-007 | Login invalid → AlertModal "Login Gagal" | PASS | 3.8s | API response timeout normal |
| TC-007a | Password < 6 karakter → AlertModal "Password Terlalu Pendek" | PASS | 1.4s | |
| TC-007b | AlertModal dapat ditutup dengan tombol OK | PASS | 1.6s | |
| TC-008 | Login valid redirect ke /admin | PASS | 4.2s | |
| TC-VR-001 | Visual — halaman login | PASS (baseline) | 2.1s | Baseline baru dibuat |
| TC-VR-002 | Visual — password visible | PASS (baseline) | 2.0s | Baseline baru dibuat |
| TC-VR-003 | Visual — AlertModal error login | PASS (baseline) | 2.3s | Baseline baru dibuat |
| TC-VR-004 | Visual — dashboard setelah login | PASS (baseline) | 2.5s | Baseline baru dibuat |

**Hasil Suite Login: 14 PASS / 0 FAIL**

---

### Suite 2: Dashboard Admin (`admin.spec.js`)

| # | Test Case | Status | Durasi | Catatan |
|---|---|---|---|---|
| TC-009 | Dashboard dapat diakses setelah login | PASS | 1.0s | |
| TC-010 | Menampilkan tepat 4 kartu statistik | PASS | 1.2s | |
| TC-011 | Label kartu statistik benar | PASS | 1.4s | |
| TC-012 | Tabel tiket menampilkan data minimal 1 baris | PASS | 1.8s | Seeder berhasil |
| TC-013 | Tombol "+ Tambah Tiket" membuka modal | PASS | 1.5s | |
| TC-014 | Tambah tiket baru berhasil — jumlah bertambah 1 | PASS | 5.2s | |
| TC-014a | AlertModal sukses setelah tambah tiket | PASS | 4.8s | |
| TC-015 | Tombol Edit membuka modal "Edit Tiket" | PASS | 2.1s | |
| TC-016 | Dropdown status inline mengubah status | PASS | 3.0s | |
| TC-016a | AlertModal sukses setelah update status | PASS | 3.5s | |
| TC-017 | Tombol Hapus membuka dialog konfirmasi | PASS | 1.6s | |
| TC-017a | AlertModal sukses setelah hapus tiket | PASS | 4.9s | |
| TC-018 | Batal hapus tidak mengurangi data | PASS | 2.2s | |
| TC-019 | Logout mengarahkan ke /login | PASS | 2.8s | |
| TC-VR-005 | Visual — kartu statistik | FAIL | 2.4s | Diff 1.8% > threshold 1% — font rendering |
| TC-VR-006 | Visual — dashboard admin full | PASS (baseline) | 2.6s | |
| TC-VR-007 | Visual — modal tambah tiket | PASS (baseline) | 2.3s | |
| TC-VR-008 | Visual — modal edit tiket | PASS (baseline) | 2.5s | |
| TC-VR-009 | Visual — tabel setelah update status | PASS (baseline) | 2.2s | |
| TC-VR-010 | Visual — dialog konfirmasi hapus | PASS (baseline) | 2.1s | |
| TC-VR-011 | Visual — AlertModal sukses CRUD | PASS (baseline) | 2.4s | |
| TC-VR-012 | Visual — halaman login setelah logout | PASS (baseline) | 2.8s | |

**Hasil Suite Admin: 21 PASS / 1 FAIL**

---

### Suite 3: Portal User (`portal.spec.js`)

| # | Test Case | Status | Durasi | Catatan |
|---|---|---|---|---|
| TC-020 | Halaman portal di URL root | PASS | 1.1s | |
| TC-021 | Navbar menampilkan judul dashboard | PASS | 0.9s | |
| TC-022 | Tombol "Login Admin" di navbar | PASS | 1.0s | |
| TC-023 | Form laporan memiliki semua field | PASS | 1.3s | |
| TC-024 | Submit tiket → pesan sukses | PASS | 3.8s | |
| TC-025 | Daftar tiket minimal 1 baris | PASS | 2.1s | |
| TC-026 | Tabel bersifat read-only (no Edit/Hapus) | PASS | 1.4s | |
| TC-VR-013 | Visual — halaman portal full | PASS (baseline) | 2.2s | |
| TC-VR-014 | Visual — form laporan | PASS (baseline) | 2.0s | |
| TC-VR-015 | Visual — pesan sukses submit | FAIL | 2.3s | Diff 2.4% > threshold 2% — animasi |
| TC-VR-016 | Visual — daftar status tiket | PASS (baseline) | 2.1s | |
| TC-VR-017 | Visual — mobile 375×812 | SKIP | — | ChromeDriver tidak mendukung setRect di mode ini |

**Hasil Suite Portal: 10 PASS / 1 FAIL / 1 SKIP**

---

## Detail Kegagalan

### TC-VR-005 — Visual Kartu Statistik (FAIL)

**Pesan Error:**
```
AssertionError: Visual diff terlalu besar: 1.8% (137 piksel berbeda)
    expected 1.8 to be below 1
```

**Penyebab:**  
Perbedaan rendering font antar eksekusi. Nilai angka pada kartu statistik berubah (ada tiket baru yang ditambahkan oleh test sebelumnya), sehingga lebar teks berbeda dari baseline.

**Resolusi:**  
Naikkan threshold atau jalankan ulang untuk membuat baseline baru setelah data stabil. Lihat BUG-006.

---

### TC-VR-015 — Visual Pesan Sukses Portal (FAIL)

**Pesan Error:**
```
AssertionError: expected 2.4 to be below 2
```

**Penyebab:**  
Pesan sukses mengandung animasi CSS fade-in (`transition-opacity`). Screenshot diambil saat animasi belum selesai, menghasilkan diff piksel pada area opacity.

**Resolusi:**  
Tambahkan `driver.sleep(500)` setelah menunggu pesan sukses muncul, atau nonaktifkan animasi di test environment dengan mengatur `prefers-reduced-motion: reduce`.

---

### TC-VR-017 — Visual Mobile (SKIP)

**Alasan:**  
`driver.manage().window().setRect()` tidak berfungsi konsisten pada ChromeDriver versi 125 di Windows saat browser sudah dalam mode fullscreen. Test dilewati untuk mencegah false-positive.

---

## Kesimpulan

| Kategori | Hasil |
|---|---|
| Fitur Fungsional | **31/31 PASS (100%)** |
| Visual Regression | **13/16 PASS (81%)** — 2 fail threshold, 1 skip |
| Bug Ditemukan | 6 (2 Fixed, 4 Open) |
| Kesiapan Rilis | **CONDITIONAL PASS** — semua fitur fungsional lulus |

**Rekomendasi:**  
Sistem layak untuk dilanjutkan ke tahap deployment dengan catatan:
1. Perbaiki BUG-003 (double API call dropdown) sebelum produksi
2. Perbaiki BUG-004 (overflow judul panjang) sebelum produksi
3. Naikkan threshold visual regression ke 2% atau regenerasi baseline di environment CI/CD

---

*Laporan ini dihasilkan dari eksekusi otomatis test suite menggunakan Mocha + Selenium WebDriver pada 11 Juni 2026.*
