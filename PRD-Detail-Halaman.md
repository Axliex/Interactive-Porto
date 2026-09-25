# PRD Tambahan — Halaman Detail Proyek (PC, Phone, Paper, Book)

## 0. Konteks

Dokumen ini melengkapi `PRD Porto Desk.md` yang sudah ada di repo (proyek React "3D Desk Portfolio").
Bagian 10 dari PRD asli menyatakan bahwa halaman detail proyek untuk state `Book`, `Phone`, `PC`, dan `Paper` **masih placeholder** (layar hitam polos berteks `'<state> Detail'`).

PRD ini mendefinisikan isi sebenarnya dari keempat halaman detail tersebut, mengikuti fitur yang sudah ada di portofolio lama milik user (`https://portofolio.isalikhwan165.workers.dev/`), untuk diimplementasikan ulang ke dalam struktur proyek React yang baru ("3D Desk").

**Referensi struktur project saat ini (repo `DeskProfilePort`):**
- `src/App.jsx` — state machine utama (INTRO, HERO, TRANSITION_*, OBJECT, DETAIL)
- `src/components/ProjectDetail.jsx` — komponen yang dirender saat `appState === 'DETAIL'`, menerima props `objectKey` (`'Book' | 'Phone' | 'PC' | 'Paper'`) dan `objectData` (dari `src/data/objectsData.js`)
- `src/components/ObjectOverlay.jsx` — tombol "Lihat Detail Proyek" yang memicu transisi ke `ProjectDetail`
- `src/styles/index.css` — utility class custom: `.glass-panel`, `.sonar-wave`, `.zoom-in-enter/.zoom-out-exit`, `.no-scrollbar`
- Font: **Plus Jakarta Sans**, hanya weight `ExtraLight` (200) dan `Regular` (400)
- Icon: `lucide-react`
- Styling: Tailwind CSS, tema dasar hitam (`bg-black`) + teks putih, aksen glassmorphism

Keempat halaman detail berikut **menggantikan isi `ProjectDetail.jsx`** sesuai `objectKey`-nya masing-masing, tapi tetap memakai header yang sama (tombol "Kembali ke Objek" + label objek) dan animasi masuk/keluar (`zoom-in-enter` / `zoom-out-exit`) yang sudah ada.

---

## 1. Detail PC — "Web Development & UI Design"

### 1.1 Tujuan
Menampilkan portofolio proyek dalam dua kategori, dipilih langsung di layar yang sama (bukan pindah halaman/tab baru).

### 1.2 User Flow
```
[Detail PC dibuka]
        v
[Layar Pilih Kategori]
  UI/UX Design      Front-end Web
        |                     |
        v                     v
[Daftar Proyek UI/UX]   [Daftar Proyek Front-end]
        |                     |
        +--- ‹ Kembali -------+
              (balik ke layar pilih kategori)
```

### 1.3 Detail Layar
- **Layar pilih kategori:** dua kartu/tombol besar berdampingan — "🎨 UI/UX Design" dan "🧩 Front-end Web" — masing-masing dengan deskripsi singkat 1 baris.
- **Layar daftar proyek per kategori:**
  - Tombol "‹ Kembali" di kiri atas, kembali ke layar pilih kategori (bukan ke Hero — tombol "Kembali ke Objek" di header global tetap terpisah dan tetap ke Hero/Object state).
  - Grid kartu proyek (2 kolom di desktop, 1 kolom di mobile). Tiap kartu berisi: tag kategori kecil, judul proyek, deskripsi singkat, tombol "Buka tab baru ↗" yang membuka link eksternal (`target="_blank"`).

### 1.4 Struktur Data
```js
// PC_CATEGORIES = {
//   uiux:     { id, label: 'UI/UX Design', emoji: '🎨', description, items: [{ id, title, tag, desc, url }] },
//   frontend: { id, label: 'Front-end Web', emoji: '🧩', description, items: [{ id, title, tag, desc, url }] },
// }
```
Isi `items` diisi manual oleh user sesuai proyek asli (judul, tag, deskripsi, link ke live demo/repo/case study).

---

## 2. Detail Phone — "Socials Design"

### 2.1 Tujuan
Menampilkan mockup ponsel interaktif berisi desain sosial media, meniru pengalaman lock screen → home screen dari portofolio lama.

### 2.2 User Flow
```
[Detail Phone dibuka]
        v
[Lock Screen] — jam & tanggal live, teks "Geser ke atas untuk membuka"
        | (tap / klik)
        v
[Home Screen]
   Tab: [ Proyek ]  [ Postingan ]
        v
   Carousel gambar/desain, navigasi ‹ ›, indikator titik halaman
```

### 2.3 Detail Layar
- **Frame ponsel:** bingkai HP (rounded corner besar, notch di atas), status bar berisi jam real-time + ikon sinyal/baterai (`●●●📶🔋`).
- **Lock screen:** jam besar, tanggal (format Indonesia: "Senin, 1 Januari"), indikator swipe-up animasi (chevron memantul).
- **Home screen:** dua tab — **Proyek** dan **Postingan**. Tiap tab menampilkan satu carousel (1 item tampil penuh, panah kiri/kanan untuk pindah, dot indicator di bawah).
- Tombol kecil "‹ Kunci" untuk kembali ke lock screen (opsional, sesuai kebutuhan).

### 2.4 Struktur Data
```js
// PHONE_POSTS    = [{ id, title, desc, image }]   // tab "Postingan"
```
`image` = path ke asset desain sosial media asli (mis. `/assets/social/proyek-1.webp`). Selama asset belum ada, boleh fallback ke gradient warna sebagai placeholder visual.

---

## 3. Detail Paper — "Profile & Resume"

### 3.1 Tujuan
Menampilkan profil singkat + pilihan antara informasi "About Me" dan "Resume", sesuai portofolio lama.

### 3.2 User Flow
```
[Detail Paper dibuka]
        v
[Foto profil + Nama + Role]
        v
   Tab: [ About Me ]   [ Resume ]
        |                   |
        v                   v
 [Konten About Me]   [Konten Resume]
```

### 3.3 Detail Layar
- **Header:** foto profil (bulat), nama lengkap, role/jabatan (mis. "Desainer Grafis dan Layouter Buku"), lalu dua tombol tab: **About Me** dan **Resume**.
- **Tab About Me:**
  - Paragraf bio singkat.
  - Accordion 3 bagian: **🎓 Pendidikan**, **💼 Pengalaman**, **📜 Sertifikasi** — tiap bagian bisa diklik untuk expand/collapse ("Klik untuk membaca selengkapnya →" sesuai versi lama), isi tiap bagian berupa list item (judul + detail singkat).
  - Bagian tambahan "Hal Baru yang Sedang Saya Pelajari" — daftar skill yang sedang dipelajari (mis. UI/UX, React.js, dsb), ditampilkan sebagai chip/badge.
- **Tab Resume:**
  - Ringkasan singkat (1 paragraf).
  - Dua kolom: Pendidikan & Pengalaman (versi ringkas, gaya CV bukan naratif).
  - Daftar skill sebagai chip.
  - Tombol "Unduh Resume" yang membuka/mengunduh file PDF resume.

### 3.4 Struktur Data
```js
// PROFILE = { name, role, photo, about, learning: [{ emoji, label }] }
// ABOUT_SECTIONS = [{ id, emoji, label, items: [{ title, period, detail }] }]
// RESUME = { summary, education: [{ title, place }], experience: [{ title, place }], skills: [string], resumeFileUrl }
```
`photo` = path foto profil asli (mis. `/assets/profile-photo.jpg`, ditaruh di folder `public/assets/`). `resumeFileUrl` = link/PDF resume yang bisa diunduh.

---

## 4. Detail Book — "Book of Books" (konsep baru: 1 buku, banyak proyek)

### 4.1 Tujuan & Perubahan Konsep
Sebelumnya: **1 proyek = 1 buku**.
**Sekarang: 1 buku berisi banyak proyek**, dipisahkan dengan **pembatas halaman (divider)** — tiap pembatas mewakili satu proyek. Fitur bolak-balik halaman (flip) tetap dipertahankan seperti sebelumnya.

### 4.2 Struktur Buku
```
[Buku]
 ├─ Pembatas Halaman: Proyek A
 │    ├─ Halaman isi 1
 │    └─ Halaman isi 2
 ├─ Pembatas Halaman: Proyek B
 │    ├─ Halaman isi 1
 │    └─ Halaman isi 2
 └─ Pembatas Halaman: Proyek C
      └─ Halaman isi 1
```
Seluruh halaman (pembatas + isi) digabung jadi satu deret linear ("leaves"), ditampilkan berpasangan sebagai spread kiri-kanan (2 halaman per tampilan), seperti buku fisik terbuka.

### 4.3 User Flow
```
[Detail Book dibuka] → tampil spread pertama (pembatas Proyek A)
        |
  ‹ Sebelumnya   /   Berikutnya ›   → bolak-balik halaman satu per satu
        |
  Klik tab pembatas (di sisi buku) → lompat langsung ke awal proyek tsb
```

### 4.4 Detail Layar
- **Area buku:** dua halaman berdampingan (spread), tampilan seperti buku fisik, dengan garis lipatan di tengah.
  - **Halaman pembatas (divider):** warna khas per proyek, judul proyek + subtitle, ikon bookmark.
  - **Halaman isi:** background kertas terang, judul sub-halaman + isi teks/gambar proyek.
- **Tab pembatas di sisi buku:** daftar vertikal (desktop) / horizontal wrap (mobile) berupa label warna-warni menonjol dari sisi buku (meniru bookmark fisik), satu per proyek, tab proyek yang sedang aktif ditandai (misal sedikit menonjol/opacity penuh). Klik tab = lompat ke spread awal proyek tsb.
- **Navigasi halaman:** tombol panah kiri/kanan + indikator "halaman X / Y", dengan animasi flip halaman (transform rotate berbasis CSS, arah kiri untuk mundur, arah kanan untuk maju).

### 4.5 Struktur Data
```js
// BOOK_CHAPTERS = [
//   {
//     id, title, subtitle, color,   // data untuk halaman pembatas
//     pages: [{ title, body }]      // halaman isi milik proyek ini
//   },
//   ...
// ]
```
Urutan array `BOOK_CHAPTERS` = urutan proyek di dalam buku. Tiap proyek boleh punya jumlah halaman isi berbeda-beda.

---

## 5. Ringkasan Assets yang Dibutuhkan
| Fitur | Asset yang perlu disiapkan user |
|---|---|
| PC | Link eksternal (live demo/repo) per proyek UI/UX & Front-end |
| Phone | Gambar desain sosial media (webp/png) per item Proyek & Postingan |
| Paper | Foto profil, file PDF resume |
| Book | Tidak wajib gambar — bisa teks saja per halaman; gambar opsional bila mau ditambah nanti |

## 6. Catatan Implementasi
- Semua komponen baru sebaiknya dipisah per fitur (mis. `PCDetail.jsx`, `PhoneDetail.jsx`, `ProfileResumeDetail.jsx`, `BookDetail.jsx`) dan datanya dipisah ke file data tersendiri (`pcData.js`, `phoneData.js`, `profileData.js`, `bookData.js`) supaya mudah diedit user tanpa menyentuh logic komponen.
- `ProjectDetail.jsx` cukup berperan sebagai router: pilih komponen sesuai `objectKey`, tetap render header umum (tombol kembali + label objek) di luar komponen fitur.
- Ikuti gaya visual & class utility yang sudah ada di proyek (`.glass-panel`, font ExtraLight/Regular, warna aksen putih) agar konsisten dengan scene 3D meja kerja.
