 PRD — Portofolio Interaktif "3D Desk"

## 1. Overview
Website portofolio dengan hero page berupa render 3D fotorealistik meja kerja. Pengguna dapat menjelajahi beberapa objek di meja tersebut melalui transisi kamera berbasis video yang dipicu klik, dengan pola navigasi hub-and-spoke berpusat di state "Hero", lalu masuk ke halaman detail proyek untuk objek yang punya proyek terkait.

**Tech stack:** React JS.

## 2. Objek & Scene
Render hero menampilkan meja kerja dengan objek-objek berikut yang relevan sebagai titik navigasi:
- **Book** — buku merah (punya detail proyek)
- **Phone** — smartphone (punya detail proyek)
- **PC** — layar monitor + keyboard (punya detail proyek)
- **Paper** — notepad/kertas kosong (punya detail proyek)
- **Bike** — helm sepeda (belum ada detail proyek untuk saat ini)
- **Turntable** — turntable/pemutar piringan hitam + speaker (belum ada detail proyek untuk saat ini)

## 3. User Flow

```
[Layar Hitam + Tombol "Lanjut"]
            |
        (klik Lanjut)
            v
      [Intro → Hero]  (video transisi pembuka)
            v
         [ Hero ]  <---------------------+
        /  |  |  |  \                    |
    Book Phone Bike PC Turntable Paper    |
      |    |    |   |      |       |      |
      +----+----+---+------+-------+------+
         (semua kembali ke Hero, tidak ada
          perpindahan langsung antar objek)
            |
    (khusus Book, Phone, PC, Paper)
            v
   [Halaman Detail Proyek]
   (transisi: zoom-in dari gambar webp state terkait,
    bukan video)
```

**Aturan navigasi:**
- Dari state **Hero**, pengguna dapat memilih salah satu dari 6 objek.
- Dari state objek manapun, tombol **kembali ke Hero** selalu tersedia dengan posisi/desain konsisten.
- Tidak ada jalur langsung antar dua objek (mis. Book → Paper) — wajib melalui Hero sebagai hub.
- Selama berada di state objek (bukan Hero), tombol navigasi ke objek lain dinonaktifkan/disembunyikan.
- Untuk objek dengan detail proyek (Book, Phone, PC, Paper), tersedia aksi lanjutan menuju halaman detail proyek terpisah.
- Turntable dan Bike untuk saat ini berhenti di state objeknya saja (tidak ada halaman detail).

## 4. State Machine

**States (scene utama):** `Intro`, `Hero`, `Book`, `Phone`, `Bike`, `PC`, `Turntable`, `Paper`
**Halaman terpisah:** Detail proyek per objek (Book, Phone, PC, Paper)

**Transisi valid (video):**
- `Intro → Hero` (satu arah, hanya terjadi sekali di awal setelah tombol "Lanjut")
- `Hero → {Book, Phone, Bike, PC, Turntable, Paper}`
- `{Book, Phone, Bike, PC, Turntable, Paper} → Hero`

**Transisi ke halaman detail (bukan video):**
- Dari state `Book/Phone/PC/Paper` → halaman detail proyek terkait, berupa animasi **zoom-in dari gambar webp** state tersebut (bukan klip video terpisah).

## 5. Aset

### 5.1 Video
- Format: **WebM** (dikonversi dari MP4 sumber)
- Penamaan file: **`Asal-Tujuan.webm`**
  - Contoh: `Intro-Hero.webm`, `Hero-Intro.webm`, `Hero-Book.webm`, `Book-Hero.webm`, dst.
- Setiap objek memiliki 2 klip (arah masuk & arah keluar), kecuali Intro yang hanya perlu `Intro-Hero`.

### 5.2 Gambar frame akhir
- Format: **WebP**
- Satu file per state akhir (Hero, Book, Phone, Bike, PC, Turntable, Paper), ditampilkan setelah video transisi selesai diputar.
- Gambar WebP yang sama juga dipakai sebagai sumber animasi zoom-in menuju halaman detail proyek.

## 6. Desain Tombol Navigasi
- Bentuk **lingkaran** berisi gambar/tekstur (sesuai referensi yang diberikan).
- Animasi interaksi: **gelombang/ripple menyebar keluar dari tepi lingkaran** (seperti riak air/sonar ping), bukan animasi hover biasa.
- Style ini dipakai konsisten untuk seluruh tombol navigasi objek.

## 7. Tipografi
- Font: **Plus Jakarta Sans**
- Weight yang digunakan: **ExtraLight** dan **Regular** saja — tidak ada weight lain.

## 8. Kebutuhan Teknis Utama
- Elemen `<video>` tunggal yang berganti `src` sesuai transisi aktif (bukan menumpuk banyak elemen video).
- Preload video secara bertahap (misal saat hover tombol), bukan sekaligus di awal, untuk menjaga waktu muat.
- Event `onEnded` pada video memicu penggantian ke gambar WebP statis dan update state aplikasi.
- Tombol navigasi ke objek lain nonaktif selama tidak berada di state Hero.
- Tidak ada indikator loading untuk sementara (bisa ditambahkan kembali belakangan bila diperlukan).
- Fallback format MP4/H.264 dipertimbangkan untuk browser yang belum mendukung WebM secara penuh.

## 9. Bike & Turntable
- Objek Bike akan akan ada pilihan tombol lihat perjalanan
- Objek Turntable akan ada pilihan tombol pause&start dan juga slider volume

## 10. Halaman Detail 
- Transisi dari detail kembali ke state berupa reverse dari transisi state ke Detail
- Isi dari halaman Detail sementara masih kosong, sementara tetap buat halaman detail dari masing-masing state namun sementara hanya tampilkan halaman hitam polos dan teks '<state> Detail'
