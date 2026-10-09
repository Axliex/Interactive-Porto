import React, { useEffect, useRef, useState } from 'react';

// Gelombang: hover hanya PEMICU. Cincin pertama muncul saat hover mulai,
// lalu selama hover masih aktif satu cincin baru terus terbit tiap 1000ms
// (konstan). Saat kursor keluar spawn berhenti; cincin yang sudah ada
// dibiarkan habis animasinya sendiri.
const WAVE_INTERVAL = 1000; // jeda antar cincin selama hover (ms)
// Durasi animasi CSS per cincin = 5s (lihat @keyframes di index.css),
// tapi cincin sudah keluar layar jauh sebelum itu. Dipotong di 3600ms
// supaya tidak ada layer mati yang tetap diraster; jumlah cincin hidup
// jadi stabil di ~4 (3600/1000) alih-alih 13.
const RING_MS = 3600;
// Safety net kalau timer tertahan (tab background): cincin hidup dibatasi.
const MAX_RINGS = 12;

export default function IntroScreen({ onStart }) {
  const [hovered, setHovered] = useState(false);
  const [waves, setWaves] = useState([]);
  const hoveredRef = useRef(false);
  const nextIdRef = useRef(0);
  const timersRef = useRef([]);
  const activeRingsRef = useRef(0);
  const circleRef = useRef(null);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // Skala gelombang = (1.06 x diagonal layar) / diameter lingkaran.
  // Dipakai keyframes CSS untuk membesar lewat `transform: scale()` (murah,
  // di compositor) dan sekaligus membagi spread box-shadow supaya garis
  // makin tipis saat menjauh. Tanpa ini ukurannya harus lewat animasi
  // width/height yang memaksa layout+paint raksasa tiap frame.
  useEffect(() => {
    const updateWaveScale = () => {
      const el = circleRef.current;
      if (!el) return;
      // clientWidth = padding box = referensi `width: 100%` pada cincin,
      // jadi skala 1 benar-benar seukuran lingkaran.
      const base = el.clientWidth;
      if (!base) return;
      const diagonal = Math.hypot(window.innerWidth, window.innerHeight);
      el.style.setProperty('--wave-scale', ((diagonal * 1.06) / base).toFixed(4));
    };
    updateWaveScale();
    window.addEventListener('resize', updateWaveScale);
    return () => window.removeEventListener('resize', updateWaveScale);
  }, []);

  // Satu cincin, dihapus lagi setelah RING_MS (sudah di luar layar).
  const spawnWave = () => {
    if (activeRingsRef.current >= MAX_RINGS) return;
    const id = ++nextIdRef.current;
    activeRingsRef.current += 1;
    setWaves((list) => [...list, id]);
    const timer = setTimeout(() => {
      setWaves((list) => list.filter((w) => w !== id));
      timersRef.current = timersRef.current.filter((t) => t !== timer);
      activeRingsRef.current -= 1;
    }, RING_MS);
    timersRef.current.push(timer);
  };

  const handleEnter = () => {
    setHovered(true);
    if (!hoveredRef.current) {
      hoveredRef.current = true;
      spawnWave(); // cincin pertama langsung saat hover dimulai
    }
  };

  const handleLeave = () => {
    setHovered(false);
    hoveredRef.current = false;
  };

  // Selama hover: interval tetap 1000ms tanpa burst.
  useEffect(() => {
    if (!hovered) return undefined;
    const iv = setInterval(spawnWave, WAVE_INTERVAL);
    return () => clearInterval(iv);
  }, [hovered]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white px-6 py-12 select-none overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(40,40,50,0.4)_0%,rgba(0,0,0,0.95)_70%)] pointer-events-none" />

      {/* Center Content */}
      <main className="relative z-10 flex flex-col items-center my-auto">
        {/* Judul tetap sebagai h1 (a11y), tampilannya ada di dalam lingkaran */}
        <h1 className="sr-only">Profile &amp; Portfolio — Faisal Ikhwan</h1>

        {/* Lingkaran = tombol utama (klik -> onStart) */}
        <button
          type="button"
          ref={circleRef}
          onClick={onStart}
          onPointerEnter={handleEnter}
          onPointerLeave={handleLeave}
          onFocus={handleEnter}
          onBlur={handleLeave}
          aria-label="Mulai — masuk ke meja kerja"
          className={`intro-circle-btn relative grid aspect-square w-[min(74vmin,56vh,28rem)] place-items-center rounded-full border cursor-pointer active:scale-95 ${
            hovered
              ? 'border-white bg-white text-black shadow-[0_0_60px_rgba(255,255,255,0.35)]'
              : 'border-white/80 bg-transparent text-white'
          }`}
        >
          {/* Gelombang: satu cincin baru tiap 1000ms selama hover */}
          {waves.map((id) => (
            <span key={id} aria-hidden="true" className="intro-wave" />
          ))}

          {/* Label default */}
          <span
            aria-hidden="true"
            className={`px-[7%] text-center text-[min(5.9vmin,4.5vh,2.24rem)] font-extralight leading-[1.35] tracking-tight transition-opacity duration-200 ${
              hovered ? 'opacity-0' : 'opacity-100'
            }`}
          >
            Profile &amp; Portfolio
            <br />
            <span
              className={`font-normal transition-colors duration-200 ${
                hovered ? 'text-black' : 'text-neutral-200'
              }`}
            >
              Faisal Ikhwan
            </span>
          </span>

          {/* Label saat hover */}
          <span
            aria-hidden="true"
            className={`absolute inset-0 grid place-items-center text-[min(11vmin,8.5vh,4.4rem)] font-normal tracking-tight transition-opacity duration-200 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Go
          </span>
        </button>
      </main>
    </div>
  );
}
