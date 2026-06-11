# Bug Report — Dashboard Tiket IT Internal

**PT Lead Geeks Indonesia**
**Tanggal Eksekusi:** 11 Juni 2026
**Versi Laporan:** v2
**Penguji:** Janji Nur S
**Versi Aplikasi:** 1.2
**Environment:** localhost (Next.js 3000 / Laravel 8000)

---

## Ringkasan

| Severity | Jumlah | Fixed | Open |
|---|---|---|---|
| Critical | 0 | — | — |
| Major | 4 | 4 | 0 |
| Minor | 4 | 3 | 1 |
| Trivial | 3 | 2 | 1 |
| **Total** | **11** | **9** | **2** |

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
Ketika operasi simpan tiket gagal karena error API, modal form `TicketModal` tetap menutup secara otomatis meskipun data belum berhasil disimpan.

**Root Cause:**
`handleSave` di `admin/page.tsx` menangkap error tanpa melempar ulang (`throw`). Akibatnya `onClose()` selalu dipanggil.

**Perbaikan:**
Tambahkan `throw new Error('save failed')` di blok `catch` pada `handleSave`. `TicketModal.handleSubmit` hanya memanggil `onClose()` di blok `try`.

---

### BUG-002 — Import `FormEvent` yang Usang

| Item | Detail |
|---|---|
| **ID** | BUG-002 |
| **Severity** | Major |
| **Status** | Fixed |
| **Modul** | Frontend — TicketModal.tsx, page.tsx |
| **TC Terkait** | TC-013, TC-014 |

**Deskripsi:**
Penggunaan `FormEvent` dari React pada Next.js 16 / React 19 menimbulkan peringatan TypeScript deprecated (kode 6385).

**Perbaikan:**
Ganti tipe parameter: `async (e: { preventDefault(): void })`.

---

### BUG-003 — Dropdown Status Bisa Terpicu Ganda Jika Diklik Cepat

| Item | Detail |
|---|---|
| **ID** | BUG-003 |
| **Severity** | Minor |
| **Status** | Fixed |
| **Modul** | Dashboard Admin — Tabel Tiket |
| **TC Terkait** | TC-016 |

**Deskripsi:**
Jika pengguna mengubah dropdown status dan langsung mengkliknya lagi sebelum respons API kembali, dua permintaan `PUT /api/tickets/{id}` dapat terkirim bersamaan menyebabkan inkonsistensi data.

**Perbaikan:**
Tambahkan state `updatingId` di `TicketTable.tsx`. Dropdown di-disable (`disabled={updatingId === t.id}`) selama API call berlangsung.

```tsx
const [updatingId, setUpdatingId] = useState<number | null>(null);

const handleStatusChange = async (ticket: Ticket, status: Status) => {
  if (updatingId !== null) return;
  setUpdatingId(ticket.id);
  try {
    await onStatusChange(ticket, status);
  } finally {
    setUpdatingId(null);
  }
};
```

---

### BUG-004 — Judul Tiket Panjang Meluap dari Sel Tabel

| Item | Detail |
|---|---|
| **ID** | BUG-004 |
| **Severity** | Minor |
| **Status** | Fixed |
| **Modul** | Frontend — TicketTable.tsx |
| **TC Terkait** | TC-012 |

**Deskripsi:**
Judul tiket > 80 karakter melebihi lebar kolom tabel dan mendorong kolom lain keluar dari layout.

**Perbaikan:**
Tambahkan `max-w-xs truncate` pada sel judul dan `title={t.title}` sebagai tooltip native.

```tsx
<td className="py-3 pr-4 max-w-xs truncate font-medium text-gray-800" title={t.title}>
```

---

### BUG-005 — Pesan Sukses Portal User Tidak Menghilang Otomatis

| Item | Detail |
|---|---|
| **ID** | BUG-005 |
| **Severity** | Minor |
| **Status** | Fixed |
| **Modul** | Portal User — Form Laporan |
| **TC Terkait** | TC-024 |

**Deskripsi:**
Setelah mengirim tiket, pesan sukses (background hijau) muncul tetapi tidak menghilang otomatis.

**Perbaikan:**
Tambahkan `setTimeout(() => setSubmitted(false), 4000)` setelah `setSubmitted(true)` di `handleSubmit` pada `app/page.tsx`.

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
Baseline screenshot dari Windows menghasilkan diff piksel > 1% saat dijalankan di Linux/macOS karena perbedaan font rendering dan anti-aliasing.

**Rekomendasi:**
Regenerasi baseline di environment yang sama dengan CI/CD, atau naikkan threshold diff ke 2%.

---

### BUG-007 — `setState` Sinkron di dalam `useEffect` (set-state-in-effect)

| Item | Detail |
|---|---|
| **ID** | BUG-007 |
| **Severity** | Major |
| **Status** | Fixed |
| **Modul** | Frontend — TicketModal.tsx |
| **TC Terkait** | TC-013, TC-015 |

**Deskripsi:**
`TicketModal.tsx` memanggil `setForm(...)` secara sinkron di dalam `useEffect([ticket])`. Ini melanggar aturan ESLint React `set-state-in-effect` dan menyebabkan render cycle berlebihan.

```tsx
// Sebelum — pelanggaran
useEffect(() => {
  setForm(ticket ? { ...ticketFields } : empty);
}, [ticket]);
```

**Perbaikan:**
Hapus `useEffect`. Gunakan lazy initializer dan `key` prop pada parent:

```tsx
// Sesudah — clean
const [form, setForm] = useState<TicketFormData>(() =>
  ticket ? { ...ticketFields } : empty
);

// admin/page.tsx — key memaksa remount saat ticket berubah
<TicketModal key={editingTicket?.id ?? 'new'} ticket={editingTicket} ... />
```

---

### BUG-008 — `React.ChangeEvent` Dipakai Tanpa Import Namespace `React`

| Item | Detail |
|---|---|
| **ID** | BUG-008 |
| **Severity** | Major |
| **Status** | Fixed |
| **Modul** | Frontend — TicketModal.tsx, app/page.tsx |
| **TC Terkait** | TC-013, TC-014 |

**Deskripsi:**
`field` helper function menggunakan `React.ChangeEvent<HTMLInputElement | HTMLSelectElement>` tanpa mengimport `React` sebagai namespace. Menghasilkan TypeScript error. Selain itu, `e.target.value` (string) di-assign ke field union type (`Priority`, `Status`) tanpa type cast.

**Perbaikan:**
Hapus `field` helper sepenuhnya. Gunakan `value` dan `onChange` inline per input/select dengan type cast eksplisit:

```tsx
onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as Priority }))}
```

---

### BUG-009 — QA Reporter Hanya `allure-mocha`, Tidak Ada Output Terminal

| Item | Detail |
|---|---|
| **ID** | BUG-009 |
| **Severity** | Minor |
| **Status** | Fixed |
| **Modul** | QA — .mocharc.cjs |
| **TC Terkait** | Semua TC |

**Deskripsi:**
Konfigurasi Mocha hanya menggunakan `allure-mocha` sebagai reporter. Seluruh output terminal (status test, `console.log` dari spec files) tidak muncul. Penguji tidak dapat melihat progres test secara real-time.

**Perbaikan:**
Install `mocha-multi-reporters` dan gunakan `spec` + `allure-mocha` secara bersamaan:

```js
// .mocharc.cjs
reporter: 'mocha-multi-reporters',
'reporter-option': ['configFile=reporter-config.json'],

// reporter-config.json
{ "reporterEnabled": "spec, allure-mocha" }
```

---

### BUG-010 — Env Var `HEADLESS` Tidak Terbaca di `browser.js`

| Item | Detail |
|---|---|
| **ID** | BUG-010 |
| **Severity** | Trivial |
| **Status** | Fixed |
| **Modul** | QA — helpers/browser.js |
| **TC Terkait** | Semua TC |

**Deskripsi:**
README mendokumentasikan `HEADLESS=true npm test` untuk mode tanpa UI, tetapi `browser.js` tidak membaca env var tersebut. Browser selalu diluncurkan dalam mode visible.

**Perbaikan:**
```js
// Sebelum
const { headless = false } = opts;

// Sesudah
const { headless = process.env.HEADLESS === 'true' } = opts;
```

---

### BUG-011 — Folder Runtime Screenshot dan Allure Tidak Di-gitignore

| Item | Detail |
|---|---|
| **ID** | BUG-011 |
| **Severity** | Trivial |
| **Status** | Fixed |
| **Modul** | QA — .gitignore |
| **TC Terkait** | — |

**Deskripsi:**
Folder `screenshots/actual/`, `screenshots/diff/`, `screenshots/failures/`, dan `allure-results/` adalah runtime artifact yang berubah setiap test run, tetapi tidak di-gitignore. Menyebabkan noise pada git diff dan potensi commit file biner yang besar.

**Perbaikan:**
Tambahkan ke `QA/.gitignore`:
```
screenshots/actual/*
!screenshots/actual/.gitkeep
screenshots/diff/*
!screenshots/diff/.gitkeep
screenshots/failures/*
!screenshots/failures/.gitkeep
allure-report/
```
Tambahkan `.gitkeep` di masing-masing folder agar struktur direktori tetap ada di repo.

---

*Laporan v2 ini mencakup semua bug dari v1 beserta bug tambahan yang ditemukan pada sesi review kode 11 Juni 2026.*
