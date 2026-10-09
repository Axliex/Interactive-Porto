// Posisi "layar" tiap objek di atas frame WebP state-nya, dalam satuan persen
// terhadap gambar 16:9 (Hero.webp / PC.webp / Paper.webp / Phone.webp, dst.).
// Angka ini diukur dari frame statis masing-masing state (flood-fill bbox objek,
// lalu sisakan inset bezel/tepi ~8-10px pada skala frame 1427.6x803):
//   - PC    : area hitam layar monitor (bbox hitam x260..1130, y170..660)
//   - Paper : permukaan kertas putih (bbox putih x536..823, y247..667)
//   - Phone : layar smartphone (bbox wajah hitam x543..735, y213..605)
export const SCREEN_RECTS = {
  PC: { left: 19.5, top: 24.6, width: 59.7, height: 55.4 },
  Paper: { left: 38.88, top: 31.76, width: 18.98, height: 50.31 },
  Phone: { left: 39.37, top: 27.77, width: 12.33, height: 45.33 },
};
