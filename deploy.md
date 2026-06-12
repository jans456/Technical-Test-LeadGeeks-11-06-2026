# Panduan Deployment

Dokumen ini menjelaskan cara deploy **Frontend ke Vercel**, **Backend ke cPanel**, dan konfigurasi **Cloudflare** untuk domain.

---

## Gambaran Arsitektur

```
User Browser
    │
    ├──► Cloudflare ──► Vercel          → Next.js (frontend)
    │                    yourdomain.com
    │
    └──► Cloudflare ──► cPanel Hosting  → Laravel API (backend)
                         api.yourdomain.com
```

---

## 1. Backend — Laravel ke cPanel

### 1.1 Persiapan File

Di komputer lokal, buat zip file backend **tanpa** folder `vendor/`, `storage/logs/`, `.env`, dan `database/database.sqlite`:

```bash
cd backend
composer install --optimize-autoloader --no-dev
```

File yang perlu diupload ke cPanel:
```
backend/
├── app/
├── bootstrap/
├── config/
├── database/
├── public/
├── resources/
├── routes/
├── storage/
├── composer.json
├── composer.lock
├── artisan
└── .htaccess (jika ada di root)
```

> **Catatan:** Upload ke direktori yang bukan `public_html`. Contoh: `/home/username/laravel/`

### 1.2 Buat Database di cPanel

1. Login cPanel → **MySQL Databases**
2. Buat database baru: `username_it_ticket`
3. Buat user MySQL baru dan set password
4. Tambahkan user ke database dengan privilege **All Privileges**
5. Catat: nama database, username, dan password

### 1.3 Upload File

1. cPanel → **File Manager** → navigasi ke `/home/username/`
2. Buat folder baru: `laravel`
3. Upload semua file backend ke folder tersebut (bisa lewat **Upload** atau **FTP**)

### 1.4 Konfigurasi `public_html`

Laravel mengharuskan domain/subdomain mengarah ke folder `public/`. Ada dua cara:

**Cara A — Subdomain (Direkomendasikan)**
1. cPanel → **Subdomains** → buat `api.yourdomain.com`
2. Set **Document Root** ke `/home/username/laravel/public`

**Cara B — Addon Domain**
1. cPanel → **Addon Domains** → tambahkan domain
2. Set document root ke `/home/username/laravel/public`

### 1.5 Buat File `.env`

Di cPanel File Manager, buka folder `laravel/` dan buat file `.env`:

```env
APP_NAME="Dashboard Tiket IT"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=username_it_ticket
DB_USERNAME=username_dbuser
DB_PASSWORD=password_database

SANCTUM_STATEFUL_DOMAINS=yourdomain.com
SESSION_DOMAIN=.yourdomain.com
```

### 1.6 Jalankan Artisan via Terminal cPanel

cPanel → **Terminal** (atau SSH):

```bash
cd /home/username/laravel

# Generate app key
php artisan key:generate

# Jalankan migration
php artisan migrate --force

# Isi data seed (admin + sampel tiket)
php artisan db:seed --force

# Optimasi untuk production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

> Jika tidak ada akses Terminal, gunakan **PHP Script Runner** atau hubungi hosting provider.

### 1.7 Atur Izin Folder Storage

```bash
chmod -R 775 /home/username/laravel/storage
chmod -R 775 /home/username/laravel/bootstrap/cache
```

### 1.8 Update CORS untuk Domain Production

Edit `backend/config/cors.php`, ganti `allowed_origins`:

```php
'allowed_origins' => ['https://yourdomain.com'],
```

Lalu jalankan:
```bash
php artisan config:cache
```

---

## 2. Frontend — Next.js ke Vercel

### 2.1 Persiapan Repository

Pastikan repository sudah di-push ke GitHub (sudah dilakukan di langkah sebelumnya).

### 2.2 Import Project ke Vercel

1. Buka [vercel.com](https://vercel.com) → **Add New Project**
2. Klik **Import** pada repository `Technical-Test-LeadGeeks-11-06-2026`
3. Pada pengaturan project:
   - **Framework Preset**: Next.js (otomatis terdeteksi)
   - **Root Directory**: `frontend`
4. Buka bagian **Environment Variables**, tambahkan:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://api.yourdomain.com/api` |

5. Klik **Deploy**

### 2.3 Set Custom Domain di Vercel

1. Project → **Settings** → **Domains**
2. Tambahkan `yourdomain.com`
3. Vercel akan memberikan instruksi DNS (CNAME atau A record)
4. Catat nilai DNS tersebut untuk dikonfigurasi di Cloudflare

---

## 3. Cloudflare — Konfigurasi DNS & SSL

### 3.1 Tambahkan Site ke Cloudflare

1. Login [cloudflare.com](https://cloudflare.com) → **Add a Site**
2. Masukkan domain → pilih plan **Free**
3. Cloudflare akan scan DNS yang ada

### 3.2 Update Nameserver di Registrar Domain

1. Salin 2 nameserver Cloudflare (contoh: `aria.ns.cloudflare.com`, `dom.ns.cloudflare.com`)
2. Login ke registrar domain (Niagahoster, Rumahweb, GoDaddy, dll)
3. Ganti nameserver lama dengan nameserver Cloudflare
4. Tunggu propagasi 5–30 menit

### 3.3 Tambahkan DNS Records

Di Cloudflare → **DNS** → **Records**:

| Type | Name | Content | Proxy |
|---|---|---|---|
| CNAME | `@` | `cname.vercel-dns.com` | ✅ Proxied |
| CNAME | `www` | `cname.vercel-dns.com` | ✅ Proxied |
| A | `api` | `IP_SERVER_CPANEL` | ✅ Proxied |

> Untuk IP server cPanel: cPanel → **Server Information** atau tanya hosting provider.  
> Nilai CNAME Vercel didapat dari langkah 2.3.

### 3.4 Konfigurasi SSL/TLS

Cloudflare → **SSL/TLS** → pilih mode **Full (strict)**

Pastikan cPanel juga sudah punya SSL:
- cPanel → **SSL/TLS** → **Let's Encrypt** → issue certificate untuk `api.yourdomain.com`

### 3.5 (Opsional) Tambahkan Security Rules

Cloudflare → **Security** → **WAF** → aktifkan rule dasar untuk proteksi API:
- Block bots
- Rate limiting ke `/api/login` (cegah brute force)

---

## 4. Verifikasi Deployment

Setelah semua selesai, uji endpoint berikut:

```bash
# Cek backend API
curl https://api.yourdomain.com/api/tickets

# Cek stats
curl https://api.yourdomain.com/api/tickets/stats

# Cek login
curl -X POST https://api.yourdomain.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@leadgeeks.com","password":"admin123"}'
```

Lalu buka browser:
- `https://yourdomain.com` → Portal User
- `https://yourdomain.com/admin` → Redirect ke Login
- `https://yourdomain.com/login` → Halaman Login

---

## 5. Checklist Deploy

### Backend (cPanel)
- [ ] File diupload ke `/home/username/laravel/`
- [ ] Subdomain `api.yourdomain.com` mengarah ke `/laravel/public`
- [ ] File `.env` dibuat dengan kredensial database yang benar
- [ ] `php artisan key:generate` dijalankan
- [ ] `php artisan migrate --force` berhasil
- [ ] `php artisan db:seed --force` berhasil
- [ ] CORS diupdate ke domain production
- [ ] SSL aktif untuk `api.yourdomain.com`

### Frontend (Vercel)
- [ ] Repository berhasil di-import di Vercel
- [ ] Root directory diset ke `frontend`
- [ ] Environment variable `NEXT_PUBLIC_API_URL` diisi URL API production
- [ ] Build berhasil (tidak ada error)
- [ ] Custom domain dikonfigurasi

### Cloudflare
- [ ] Nameserver domain sudah diganti ke Cloudflare
- [ ] DNS record untuk `@`, `www`, dan `api` sudah ditambahkan
- [ ] SSL/TLS mode **Full (strict)** aktif
- [ ] Proxy (orange cloud) aktif untuk semua record

---

## Catatan Penting

- Setelah deploy, **ganti password admin** dari `admin123` ke password yang lebih kuat via database atau endpoint update user.
- `APP_DEBUG=false` wajib di production agar error detail tidak terekspos ke publik.
- Jika hosting cPanel tidak support PHP 8.2+, hubungi provider untuk upgrade versi PHP di **MultiPHP Manager**.
