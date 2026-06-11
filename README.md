# Dashboard Tiket IT Internal
**PT Lead Geeks Indonesia**

---

## Gambaran Umum Proyek

Aplikasi web untuk melacak dan mengelola tiket dukungan IT internal. Sistem memiliki dua sisi:

- **Portal User** — karyawan dapat melaporkan masalah IT dan memantau status tiket
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

---

## Fitur yang Diimplementasikan

### Autentikasi Admin
- Login dengan email dan password
- Token disimpan di cookie (session 8 jam)
- Halaman admin otomatis redirect ke login jika belum masuk
- Tombol logout di navbar admin

### Manajemen Tiket (Admin)
- Tambah tiket baru
- Edit tiket yang sudah ada
- Perbarui status tiket langsung dari tabel (tanpa membuka form edit)
- Hapus tiket dengan konfirmasi
- Lihat seluruh daftar tiket beserta nama pelapor

### Portal User (Publik)
- Form laporan masalah IT (nama, judul, kategori, prioritas)
- Tiket terkirim otomatis dengan status `Open`
- Lihat daftar dan status semua tiket (read-only)

### Field Tiket
- Nama Pelapor
- Judul Tiket
- Kategori Masalah (Hardware, Software, Network, Access, Other)
- Prioritas (Low, Medium, High, Critical)
- Status (Open, In Progress, Resolved, Closed)
- Penanggung Jawab
- Tanggal Dibuat

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

# Install dependencies
composer install

# Salin file environment
cp .env.example .env

# Generate app key
php artisan key:generate
```

Edit file `.env` — sesuaikan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=it_ticket_dashboard
DB_USERNAME=root
DB_PASSWORD=
```

```bash
# Buat database di MySQL terlebih dahulu, lalu jalankan migration
php artisan migrate

# Isi data sampel dan akun admin
php artisan db:seed

# Jalankan server backend
php artisan serve
```

Backend berjalan di: `http://localhost:8000`

### 3. Setup Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install
```

Pastikan isi `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

```bash
# Jalankan server frontend
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
└── frontend/                         # Next.js
    ├── proxy.ts                      # Proteksi route /admin
    ├── app/
    │   ├── page.tsx                  # Portal User (publik)
    │   ├── admin/page.tsx            # Dashboard Admin (perlu login)
    │   └── login/page.tsx            # Halaman Login
    ├── components/
    │   ├── Navbar.tsx
    │   ├── StatsCard.tsx
    │   ├── TicketTable.tsx
    │   ├── TicketModal.tsx
    │   └── DeleteConfirm.tsx
    └── lib/
        ├── api.ts
        ├── auth.ts
        └── types.ts
```

---

## API Endpoint

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| POST | `/api/login` | Publik | Login admin, mengembalikan token |
| POST | `/api/logout` | Admin | Logout, revoke token |
| GET | `/api/tickets` | Publik | Ambil semua tiket |
| GET | `/api/tickets/stats` | Publik | Ambil statistik dashboard |
| POST | `/api/tickets` | Publik | Buat tiket baru (dari user/admin) |
| GET | `/api/tickets/{id}` | Publik | Ambil detail tiket |
| PUT | `/api/tickets/{id}` | Admin | Update tiket |
| DELETE | `/api/tickets/{id}` | Admin | Hapus tiket |
