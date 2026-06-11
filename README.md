# Dashboard Tiket IT Internal
**PT Lead Geeks Indonesia**

---

## Gambaran Umum Proyek

Aplikasi web untuk melacak dan mengelola tiket dukungan IT internal. Sistem memiliki dua sisi:

- **Portal User** — karyawan dapat melaporkan masalah IT dan memantau status tiket tanpa login
- **Dashboard Admin** — tim IT dapat mengelola seluruh tiket (tambah, edit, update status, hapus) dengan akses yang dilindungi login

---

## Teknologi yang Digunakan

| Layer | Teknologi |
|---|---|
| Backend | Laravel 12 (REST API) |
| Frontend | Next.js 16 (React + TypeScript) |
| Database | MySQL |
| Styling | Tailwind CSS |
| Autentikasi | Laravel Sanctum (token-based) |
| QA Automation | Mocha + Selenium WebDriver + Allure + Pixelmatch |

---

## Fitur yang Diimplementasikan

### Autentikasi Admin
- Login dengan validasi client-side (format email, panjang password) dan validasi API
- Token disimpan di cookie (session 8 jam)
- Halaman admin otomatis redirect ke login jika belum masuk
- Tombol logout di navbar admin

### Manajemen Tiket (Admin)
- Tambah tiket baru melalui modal form
- Edit tiket yang sudah ada
- Perbarui status tiket langsung dari dropdown di tabel (tanpa form edit)
- Hapus tiket dengan konfirmasi dialog
- Lihat seluruh daftar tiket beserta nama pelapor

### Feedback & Validasi (AlertModal)
- Modal overlay terpusat untuk setiap aksi CRUD (sukses dan error)
- Validasi login: email format, password minimal 6 karakter
- Modal form tetap terbuka saat API gagal — pengguna dapat mencoba ulang

### Portal User (Publik)
- Form laporan masalah IT (nama, judul, kategori, prioritas)
- Tiket terkirim otomatis dengan status `Open`
- Lihat daftar dan status semua tiket (read-only)

### Dashboard Statistik
- Total Tiket
- Tiket Terbuka
- Tiket Sedang Dikerjakan
- Tiket Prioritas Tinggi

### Tampilan
- Layout responsif (desktop, tablet, mobile)
- Indikator warna pada status dan prioritas tiket
- Navigasi toggle antara Portal User dan Admin

---

## Panduan Instalasi

### Prasyarat
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL

### 1. Clone / Extract Proyek

```bash
cd it-ticket-dashboard
```

### 2. Setup Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` — sesuaikan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=it_ticket_dashboard
DB_USERNAME=root
DB_PASSWORD=
```

```bash
php artisan migrate
php artisan db:seed
php artisan serve
```

Backend berjalan di: `http://localhost:8000`

### 3. Setup Frontend (Next.js)

```bash
cd frontend
npm install
```

Buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

```bash
npm run dev
```

Frontend berjalan di: `http://localhost:3000`

### 4. Akun Admin Default

| Field | Value |
|---|---|
| Email | `admin@leadgeeks.com` |
| Password | `admin123` |

---

## Alur Penggunaan

| Pengguna | URL | Akses |
|---|---|---|
| Karyawan (User) | `http://localhost:3000/` | Publik — tidak perlu login |
| Admin IT | `http://localhost:3000/admin` | Wajib login terlebih dahulu |

---

## Struktur Proyek

```
it-ticket-dashboard/
├── backend/                          # Laravel REST API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php
│   │   │   └── TicketController.php
│   │   └── Models/Ticket.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │       ├── AdminUserSeeder.php
│   │       └── TicketSeeder.php
│   └── routes/api.php
│
├── frontend/                         # Next.js
│   ├── middleware.ts                 # Proteksi route /admin
│   ├── app/
│   │   ├── layout.tsx               # Root layout (Navbar global)
│   │   ├── page.tsx                 # Portal User (publik)
│   │   ├── admin/page.tsx           # Dashboard Admin (perlu login)
│   │   └── login/page.tsx           # Halaman Login
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── StatsCard.tsx
│   │   ├── TicketTable.tsx
│   │   ├── TicketModal.tsx
│   │   ├── DeleteConfirm.tsx
│   │   └── AlertModal.tsx           # Modal sukses/error untuk semua aksi
│   └── lib/
│       ├── api.ts
│       ├── auth.ts
│       └── types.ts
│
├── QA/                               # QA Automation
│   ├── specs/                        # 48 test cases (Mocha + Selenium)
│   ├── pageobject/                   # Page Object Model
│   ├── actions/                      # High-level test actions
│   ├── helpers/                      # Browser & visual regression
│   ├── testplan.md
│   ├── testcase.md
│   ├── report.md
│   └── bug report.md
│
├── deploy.md                         # Panduan deploy Vercel + cPanel + Cloudflare
└── BRD-Dashboard-Tiket-IT-Internal.md
```

---

## API Endpoint

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| POST | `/api/login` | Publik | Login admin, mengembalikan token |
| POST | `/api/logout` | Admin | Logout, revoke token |
| GET | `/api/tickets` | Publik | Ambil semua tiket |
| GET | `/api/tickets/stats` | Publik | Ambil statistik dashboard |
| POST | `/api/tickets` | Publik | Buat tiket baru |
| GET | `/api/tickets/{id}` | Publik | Ambil detail tiket |
| PUT | `/api/tickets/{id}` | Admin | Update tiket |
| DELETE | `/api/tickets/{id}` | Admin | Hapus tiket |

---

## QA Automation

Test otomatis tersedia di folder `QA/` dengan 48 test case menggunakan:
- **Mocha** sebagai test runner
- **Selenium WebDriver** (Chrome visible mode)
- **Pixelmatch** untuk visual regression
- **Allure** untuk laporan HTML

```bash
cd QA
npm install
npm test
```

Lihat `QA/README.md` untuk panduan lengkap.