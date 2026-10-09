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

> **Status terbaru (2026-09): semua preview PC berjalan di layar monitor, tanpa pindah halaman.**
> `src/components/screens/MonitorScreen.jsx` menggantikan halaman detail: pilih kategori → preview proyek (panah ‹ ›) → klik preview/tombol membuka **Figma atau website** (tab baru). `PCDetail.jsx` sudah **dihapus**, dan `ProjectDetail.jsx` tidak lagi punya kasus `PC`.

### 1.1 Tujuan
Menampilkan portofolio proyek dalam dua kategori — **UI Design** dan **Web Development** — sepenuhnya di atas layar monitor yang sudah ada (state PC), tanpa berpindah halaman.

### 1.2 User Flow
```
[Objek PC — layar monitor]
        v
[Layar 1 — Pilih Kategori]
  🎨 UI Design        🧩 Web Development
        |                     |
        v                     v
[Layar 2 — Preview Proyek]  ‹ ›  panah di sisi layar (juga ← → keyboard)
  tag · judul · deskripsi · thumbnail besar
  counter "n / total" · dot posisi
        |
  klik preview atau tombol "Buka di Figma ↗" / "Buka Website ↗"
        → window.open(url, '_blank') — sesuai `url` proyek
        |
  "‹ Kategori" (atau Esc) → balik ke Layar 1
```

### 1.3 Detail Layar
- **Layar 1 (`view='choice'`):** header "Monitor · Portofolio" + judul "Web Development & UI Design" (plus "2 kategori · 3 proyek" bila panel lebar). Dua kartu kategori berdampingan (kolom otomatis bila panel sempit/floating): emoji, label, deskripsi, **strip thumbnail proyek yang mengisi badan kartu**, dan baris "n proyek · klik untuk preview". Footer: "Pilih satu kategori — preview proyek tampil langsung di layar ini".
- **Layar 2 (`view='projects'`):**
  - Header: tombol **"‹ Kategori"** (kembali ke layar 1), emoji + nama kategori, counter **"n / total"**.
  - Kolom info (19em): pill tag, judul, deskripsi, dan tombol CTA **"Buka di Figma"** / **"Buka Website"** + catatan "Membuka … di tab baru". Di panel sempit, kolom ini jadi baris di atas preview (container query `.monitor-split` / `.monitor-info`, threshold 640px).
  - Area preview besar: thumbnail proyek — **klik = buka link**, saat hover muncul CTA apung; **panah ‹ › di sisi kiri/kanan layar** (hanya bila jumlah proyek > 1, posisi wrap: terakhir → pertama) + dot posisi proyek.
  - Keyboard: **← →** ganti proyek, **Esc** kembali ke pilihan kategori.
  - Tanpa latar panel saat menempel di monitor; latar hanya di mode floating.
- Catatan ukuran: font layar memakai container query `.screen-ui-monitor`, jadi seluruh `em` ikut mengecil/membesar mengikuti lebar panel monitor.

### 1.4 Struktur Data
```js
// PC_CATEGORIES = {
//   uiux:     { id, label: 'UI Design',       emoji: '🎨', description, items: [...] },
//   frontend: { id, label: 'Web Development', emoji: '🧩', description, items: [...] },
// }
// items[] = { id, title, tag, desc, thumbnail, type: 'figma' | 'live', url }
```
- `type: 'figma'` → label CTA "Buka di Figma"; selain itu "Buka Website" (keduanya membuka `url` di tab baru).
- Menambah proyek = menambah entri di `items` (thumbnail dari folder `public/assets/…`); panah ‹ › otomatis muncul bila proyek dalam kategori > 1.
- Isi `items` diisi manual oleh user sesuai proyek asli (judul, tag, deskripsi, thumbnail, link Figma/live demo/repo).

---

## 2. Detail Phone — "Socials Design"

> **Status terbaru (2026-09): jalur utama pindah ke layar HP di atas meja.**
> Feed, Grid Galeri, dan tiap postingan kini **diputar langsung di layar smartphone yang tergeletak di meja** (`src/components/screens/PhoneScreen.jsx`) — tidak ada halaman detail baru, tidak ada mock HP besar, dan tidak ada transisi zoom (rasa "mengambil HP"). Konten di dalamnya: beranda profil → view Feed (gambar 3:4, aksi sosial, keterangan) dan view Grid Galeri (2 kolom) — semuanya lewat state internal, kembali lewat tombol ‹ di kiri atas.
> **Navigasi feed:** panah ‹ › di view Feed kini **geser slide (gambar) dalam satu postingan**, bukan pindah postingan, dan **hanya muncul bila postingan punya banyak gambar** — postingan tunggal tidak menampilkan panah/dot. Pindah postingan dilakukan lewat Grid atau daftar postingan di beranda.
> **Pilih akun (2026-09):** baris avatar di beranda membuka view **Cari akun** — search ala Instagram (input yang memfilter username/nama/bio + daftar akun, akun aktif ditandai centang, memilih akun kembali ke beranda). Sumber data `accountsData` di `src/data/phoneData.js`: portofolio socials berikutnya cukup ditambah sebagai akun baru; field `avatar` boleh dihilangkan (otomatis jadi inisial berwarna).
> Rasio kartu/postingan: **3:4 (potret)** sesuai aset (`aspect-[3/4]`), bukan 1:1.
> `PhoneDetail.jsx` (mock HP besar, section di bawah) **tidak lagi dipanggil** dari jalur layar HP; file dipertahankan bila suatu saat dibuka lewat rute lain.

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
**Sekarang: 1 buku berisi banyak proyek**, dipisahkan dengan **pembatas halaman (divider)** — tiap pembatas mewakili satu proyek. Fitur bolak-balik halaman kini berupa **buku 3D sungguhan** (lihat 4.4), dan pembukaannya diawali **animasi mengambil buku dari meja**.

**Animasi ambil buku** (`src/components/BookLift.jsx`): saat tombol "Lihat Detail Proyek" diklik, replika sampul buku (maroon + label "BOOK OF BOOKS") muncul **tepat di posisi buku pada foto meja** (anchor: `liftAnchor` di `src/data/objectsData.js`, persen terhadap frame `Book.webp`), lalu terangkat ke tengah layar (translate + scale + rotateX, ±780 ms) sementara scene meja zoom-fade. Saat kembali dari detail, animasinya berjalan terbalik (buku diturunkan kembali ke meja) dan tombol overlay objek baru muncul setelah buku mendarat.

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
Seluruh halaman (pembatas + isi) digabung jadi satu deret linear ("leaves"), lalu dipetakan ke **lembar fisik dua muka**: lembar ke-k berisi `front = leaves[2k+1]` dan `back = leaves[2k+2]`, berporos di tulang buku. `turn` = jumlah lembar yang sudah dibalik; halaman kiri saat ini = `leaves[2*turn]`, halaman kanan = `leaves[2*turn+1]`.

### 4.3 User Flow
```
[Tombol "Lihat Detail Proyek"] → animasi buku diangkat dari meja → detail
        |
        |  buku "diletakkan" di layar (animasi bookPlace, 620 ms)
        |
  Seret halaman (drag) / klik tepi kiri-kanan / tombol ‹ › / panah keyboard
        → lembar fisik terbalik 3D (680 ms)
        |
  Sticky notes di tepi atas buku → lompat langsung ke awal proyek tsb
        |
  "Kembali ke Objek" → buku diturunkan kembali ke meja → scene Book
```

### 4.4 Detail Layar
- **Buku 3D** (`src/components/details/FlipBook.jsx`): `perspective: 2600px`, tiap lembar `transform: rotateY()` berporos di sisi kiri (tulang buku) dengan dua muka `backface-visibility: hidden`, bayangan tulang di tengah, tepi halaman (page block) di sisi luar, serta sampul maroon di belakang. Buku sedikit dimiringkan (`rotateX(6deg)`) supaya terasa seperti diletakkan di meja.
- **Interaksi membalik:** seret halaman ke kiri/kanan (progress mengikuti pointer, lepas untuk menyelesaikan/mengembalikan), klik tepi kiri/kanan, tombol ‹ Sebelumnya / Berikutnya ›, dan panah ←/→ keyboard. Saat halaman terbang ada bayangan lembut (`flipShade`) di atas buku.
- **Sticky notes pemilih proyek:** 5 note pastel (kuning/pink/hijau/biru/ungu) dengan strip warna `spineColor`, menempel di tepi atas buku dan **setengah tertutup balik buku** (terlihat seperti catatan yang dijepit). Note proyek aktif terangkat + ring putih; hover mengangkat sedikit; klik = lompat ke bab proyek.
- **Divider:** warna khas per proyek, "Bab N", judul + subtitle, ikon bookmark, nomor halaman `n / total`.
- **Halaman isi:** gambar halaman buku (`object-contain`) + nomor halaman.
- **Navigasi:** indikator "Halaman X–Y dari Z" + judul proyek aktif.

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
| PC | Thumbnail preview + link Figma/website per proyek (UI Design & Web Development) |
| Phone | Gambar desain sosial media (webp/png) per item Proyek & Postingan |
| Paper | Foto profil, file PDF resume |
| Book | Tidak wajib gambar — bisa teks saja per halaman; gambar opsional bila mau ditambah nanti |

## 6. Catatan Implementasi
- Semua komponen baru sebaiknya dipisah per fitur (mis. `MonitorScreen.jsx`, `PhoneScreen.jsx`, `PaperScreen.jsx`, `BookDetail.jsx`) dan datanya dipisah ke file data tersendiri (`pcData.js`, `phoneData.js`, `profileData.js`, `bookData.js`) supaya mudah diedit user tanpa menyentuh logic komponen.
- `ProjectDetail.jsx` cukup berperan sebagai router: pilih komponen sesuai `objectKey`, tetap render header umum (tombol kembali + label objek) di luar komponen fitur. Kasus `PC` dan `Phone` sudah tidak lewat router ini — keduanya berjalan di layar objeknya masing-masing.
- Ikuti gaya visual & class utility yang sudah ada di proyek (`.glass-panel`, font ExtraLight/Regular, warna aksen putih) agar konsisten dengan scene 3D meja kerja.

---

## 7. Entry Langsung dari Layar Objek (tambahan implementasi)

Sebagian besar detail kini dibuka **dari "layar" objek itu sendiri**, bukan dari tombol overlay:

| Objek | Entry | Route (`detailRoute` di `App.jsx`) |
|---|---|---|
| PC | pilih kategori → preview proyek + panah ‹ › di layar monitor | **tidak lewat halaman detail** — berjalan di tempat (`MonitorScreen`); klik preview membuka Figma/website (`window.open`) |
| Paper | teks "About Me" / "Resume" di kertas | `{ tab: 'about' \| 'resume', section, focus }` |
| Phone | Feed / Grid / kartu postingan di layar HP | **tidak lewat halaman detail** — berjalan di tempat (`PhoneScreen`) |
| Book | tombol "Lihat Detail Proyek" di overlay | animasi **ambil buku dari meja** dulu, baru detail; `route` opsional `{ projectId }` untuk membuka langsung di bab proyek tsb |

- `src/data/objectsData.js` → `screenEntry: true` + `screenHint` menampilkan pill petunjuk (ikon `MousePointerClick`) di footer `ObjectOverlay`; tombol "Lihat Detail Proyek" hanya dirender bila `hasDetail && !screenEntry` (praktisnya: hanya Book).
- `src/data/screensLayout.js` → rect % frame WebP untuk area layar monitor/kertas/HP; `src/components/ObjectScreen.jsx` memetakkannya ke kanvas 16:9 dan otomatis **melepas (floating)** bila tidak muat di viewport.
- **Latar panel dihapus:** monitor dan kertas kini tanpa latar panel (hanya isi: grid kartu proyek; tombol About Me & Resume), agar menyatu dengan foto objek. Mode floating tetap diberi latar (`bg-[#05070a]/95` monitor, `bg-[#f7f4ec]/95` kertas) supaya teks tetap terbaca. Header/footer panel monitor (label PORTOFOLIO, pill hint, footer petunjuk) ikut dihapus.
- Route diteruskan `App.jsx` → `ProjectDetail` (`route`) → props `initial*` di tiap komponen detail (Paper & Book; PC dan Phone tidak lewat sini).
