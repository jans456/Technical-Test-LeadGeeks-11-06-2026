# QA — Dashboard Tiket IT Internal

Direktori ini berisi seluruh aset pengujian otomatis untuk proyek Dashboard Tiket IT Internal PT Lead Geeks Indonesia.

---

## Teknologi

| Tool | Peran |
|---|---|
| **Mocha** | Test runner — satu `describe`, banyak `it()` per file |
| **Chai** | Assertion library (`expect`) |
| **Selenium WebDriver** | Otomasi browser (Chrome visible by default) |
| **ChromeDriver** | Driver Chrome yang dikelola otomatis via `chromedriver` npm |
| **Allure Mocha** | Reporter HTML interaktif |
| **Pixelmatch + pngjs** | Visual regression — perbandingan piksel screenshot |

---

## Struktur Folder

```
QA/
├── helpers/
│   ├── browser.js          # Inisialisasi Selenium WebDriver
│   └── visualRegression.js # Screenshot & perbandingan piksel (Pixelmatch)
│
├── pageobject/             # Page Object Model — selectors & interaksi dasar
│   ├── LoginPage.js
│   ├── AdminPage.js
│   └── PortalPage.js
│
├── actions/                # High-level actions menggunakan page objects
│   ├── authActions.js
│   ├── ticketActions.js
│   └── portalActions.js
│
├── specs/                  # Test specs — 1 describe, banyak it()
│   ├── login.spec.js       # 14 test: tampilan, eye toggle, AlertModal, login
│   ├── admin.spec.js       # 22 test: statistik, CRUD, AlertModal, logout
│   └── portal.spec.js      # 12 test: form, submit, tabel, mobile
│
├── screenshots/
│   ├── baseline/           # Screenshot referensi (dibuat otomatis pertama kali)
│   ├── actual/             # Screenshot saat test dijalankan
│   ├── diff/               # Gambar diff piksel
│   └── failures/           # Screenshot otomatis saat test gagal
│
├── allure-results/         # Data mentah Allure
├── .mocharc.cjs            # Konfigurasi Mocha
├── package.json
├── testplan.md             # Rencana pengujian lengkap
├── testcase.md             # 48 test case beserta ekspektasi
├── report.md               # Laporan hasil eksekusi terakhir
└── bug report.md           # Daftar bug yang ditemukan
```

---

## Prasyarat

- Node.js 18+
- Google Chrome terinstal
- Backend Laravel berjalan di `http://localhost:8000`
- Frontend Next.js berjalan di `http://localhost:3000`
- Database sudah di-seed (`php artisan db:seed`)

---

## Instalasi

```bash
cd QA
npm install
```

---

## Menjalankan Test

### Semua test

```bash
npm test
```

### Per spec

```bash
npx mocha specs/login.spec.js
npx mocha specs/admin.spec.js
npx mocha specs/portal.spec.js
```

### Mode headless (tanpa UI browser)

```bash
HEADLESS=true npm test
```

---

## Laporan Allure

Setelah menjalankan test, generate laporan HTML:

```bash
# Install allure CLI (sekali saja)
npm install -g allure-commandline

# Generate dan buka laporan
allure generate allure-results --clean -o allure-report
allure open allure-report
```

---

## Visual Regression

Screenshot baseline dibuat **otomatis** saat pertama kali test dijalankan.
Jika UI berubah secara sengaja, hapus file di `screenshots/baseline/` untuk regenerasi baseline.

Threshold diff default: **1%** (visual statis), **2%** (setelah interaksi dinamis).

---

## Konvensi

| Folder | Isi |
|---|---|
| `pageobject/` | Selectors & aksi atomik (`findElement`, `getText`, `click`) |
| `actions/` | Alur pengguna level tinggi (kombinasi page object methods) |
| `specs/` | Test case aktual (`describe` + `it()` + `expect`) |

Aturan:
- Satu file spec = **satu** `describe`
- Nama `it` = kalimat pernyataan lengkap (Bahasa Indonesia)
- `beforeEach`: navigasi ke halaman + log nama test
- `afterEach`: log status, simpan screenshot jika gagal

---

## Environment Variables

| Variabel | Default | Keterangan |
|---|---|---|
| `BASE_URL` | `http://localhost:3000` | URL frontend |
| `HEADLESS` | `false` | `true` untuk mode tanpa UI |

---

## Akun Demo

| Field | Nilai |
|---|---|
| Email | `admin@leadgeeks.com` |
| Password | `admin123` |