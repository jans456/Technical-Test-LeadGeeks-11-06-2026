# Test Plan — Dashboard Tiket IT Internal

**PT Lead Geeks Indonesia**  
**Versi:** 1.0  
**Tanggal:** 2026-06-11  
**Disiapkan oleh:** QA Engineer

---

## 1. Informasi Proyek

| Item | Detail |
|---|---|
| Nama Proyek | Dashboard Tiket IT Internal |
| Scope Pengujian | Frontend Next.js (localhost:3000) |
| Backend | Laravel REST API (localhost:8000) |
| Tipe Pengujian | Fungsional + Visual Regression |

---

## 2. Tujuan Pengujian

- Memastikan seluruh fitur berjalan sesuai BRD
- Mendeteksi regresi tampilan antara versi lama dan baru menggunakan perbandingan piksel
- Memverifikasi perbedaan akses antara Portal User (publik) dan Dashboard Admin (login)

---

## 3. Ruang Lingkup

### Dalam Scope

| Modul | Fitur |
|---|---|
| Login | Tampilan form, validasi kredensial, toggle eye password, pesan error, redirect sukses |
| Dashboard Admin | Statistik (4 kartu), CRUD tiket, update status inline, konfirmasi hapus, logout |
| Portal User | Form submit tiket, daftar tiket read-only, tombol Login Admin di navbar |
| Visual Regression | Perbandingan screenshot baseline vs aktual (Pixelmatch) |
| Responsif | Tampilan mobile 375×812px pada portal user |

### Di Luar Scope

- Pengujian backend (API)
- Pengujian manajemen user / registrasi
- Load testing / performance testing
- Pengujian browser selain Chromium (Puppeteer default)

---

## 4. Strategi Pengujian

### 4.1 Pengujian Fungsional

Dilakukan dengan **Puppeteer** untuk simulasi interaksi pengguna nyata:
- Navigasi halaman
- Isi form dan submit
- Klik tombol dan verifikasi respons
- Validasi teks, URL, jumlah elemen

### 4.2 Visual Regression

1. **Run pertama** — Screenshot disimpan sebagai **baseline** di `screenshots/baseline/`
2. **Run berikutnya** — Screenshot aktual dibandingkan piksel per piksel dengan baseline menggunakan **Pixelmatch + pngjs**
3. **Ambang batas** — Perbedaan dinyatakan gagal jika melebihi **1% piksel** (2% untuk halaman dinamis)
4. **Diff image** — Perbedaan disimpan di `screenshots/diff/` untuk inspeksi manual
5. **Reset baseline** — Jalankan `npm run baseline:reset` jika perubahan UI disengaja

---

## 5. Toolset

| Tool | Versi | Fungsi |
|---|---|---|
| Mocha | ^10.4 | Test runner |
| Puppeteer | ^22.0 | Browser automation + screenshot |
| Pixelmatch | ^5.3 | Perbandingan piksel gambar |
| pngjs | ^6.0 | Baca/tulis file PNG |
| Chai | ^4.4 | Assertion library |
| Allure Mocha | ^2.15 | Reporter laporan HTML |

---

## 6. Lingkungan Pengujian

| Item | Nilai |
|---|---|
| URL Frontend | `http://localhost:3000` |
| URL Backend API | `http://localhost:8000/api` |
| Browser | Chromium (headless, via Puppeteer) |
| Viewport Default | 1280 × 720 px |
| Viewport Mobile | 375 × 812 px |
| OS | Windows / Linux / macOS |
| Node.js | ≥ 18 |

**Prasyarat sebelum menjalankan test:**
- Backend Laravel berjalan di `localhost:8000`
- Database sudah di-migrate dan di-seed (`php artisan migrate --seed`)
- Frontend Next.js berjalan di `localhost:3000`
- Akun admin tersedia: `admin@leadgeeks.com` / `admin123`

---

## 7. Struktur File Test

```
QA/
├── .mocharc.cjs              # Konfigurasi Mocha (reporter Allure)
├── package.json
├── helpers/
│   ├── browser.js            # Puppeteer launch/teardown
│   ├── visualRegression.js   # takeAndCompare() dengan Pixelmatch
│   └── resetBaseline.js      # Script hapus baseline
├── pageobject/               # Page Object Model — selector & interaksi dasar
│   ├── LoginPage.js
│   ├── AdminPage.js
│   └── PortalPage.js
├── actions/                  # Fungsi aksi tingkat tinggi — gunakan PageObject
│   ├── authActions.js
│   ├── ticketActions.js
│   └── portalActions.js
├── specs/                    # Test suite — 1 describe per file, banyak it()
│   ├── login.spec.js
│   ├── admin.spec.js
│   └── portal.spec.js
└── screenshots/
    ├── baseline/             # Gambar referensi (di-commit ke git)
    ├── actual/               # Hasil screenshot terbaru (gitignore)
    └── diff/                 # Gambar diff piksel (gitignore)
```

---

## 8. Cara Menjalankan Test

```bash
# Install dependensi
cd QA
npm install

# Jalankan semua test
npm test

# Jalankan per modul
npm run test:login
npm run test:admin
npm run test:portal

# Generate & buka laporan Allure
npm run allure:generate
npm run allure:open

# Reset baseline (jika ada perubahan UI yang disengaja)
npm run baseline:reset
```

---

## 9. Kriteria Pass / Fail

| Kondisi | Status |
|---|---|
| Semua assertion `expect()` lolos | PASS |
| Visual diff ≤ 1% piksel | PASS |
| Screenshot baseline baru dibuat (run pertama) | PASS (informational) |
| Assertion gagal atau exception tidak tertangani | FAIL |
| Visual diff > 1% piksel | FAIL |
| Halaman tidak dapat diakses (timeout navigasi) | FAIL |

---

## 10. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Backend tidak berjalan | Semua test gagal | Pastikan `php artisan serve` aktif sebelum test |
| Data seed berubah | Visual diff pada tabel tiket | Gunakan threshold 2% untuk halaman dengan data dinamis |
| Animasi CSS menyebabkan diff | False positive visual | Tambahkan `waitForTimeout` atau nonaktifkan animasi di test |
| Perubahan UI disengaja | Baseline mismatch | Jalankan `npm run baseline:reset` setelah review |
