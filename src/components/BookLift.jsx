import React, { useEffect, useRef, useState } from 'react';

/**
 * Animasi "mengambil buku dari meja".
 *
 * `origin` = kotak buku pada frame 16:9 (dalam piksel viewport) yang dihitung
 * dari `liftAnchor` di objectsData saat tombol diklik. Buku mulai tepat di atas
 * foto buku di meja, lalu terangkat ke tengah layar (translate + scale +
 * rotateX) — dilanjutkan halaman detail yang menampilkan buku 3D.
 *
 * phase 'up'   : meja → diangkat (dipakai saat membuka detail)
 * phase 'down' : diangkat → meja (dipakai saat kembali dari detail)
 */
const UP_MS = 780;
const DOWN_MS = 700;

export default function BookLift({ phase, origin, onDone }) {
  const [lifted, setLifted] = useState(phase === 'down');
  const [fading, setFading] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!origin) return undefined;
    let raf1 = 0;
    let raf2 = 0;
    const timers = [];

    if (phase === 'up') {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setLifted(true));
      });
      timers.push(setTimeout(() => setFading(true), UP_MS + 60));
      timers.push(setTimeout(() => onDoneRef.current?.(), UP_MS + 340));
    } else {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setLifted(false));
      });
      timers.push(setTimeout(() => onDoneRef.current?.(), DOWN_MS + 80));
    }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      timers.forEach(clearTimeout);
    };
  }, [phase, origin]);

  if (!origin) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const targetHeight = Math.min(vh * 0.64, (vw * 0.42 * origin.height) / Math.max(origin.width, 1));
  const scale = targetHeight / Math.max(origin.height, 1);
  const dx = vw / 2 - (origin.left + origin.width / 2);
  const dy = vh / 2 - (origin.top + origin.height / 2);

  const restTransform = 'translate(0px, 0px) scale(1) rotateX(0deg) rotateZ(-1.2deg)';
  const liftedTransform = `translate(${dx}px, ${dy}px) scale(${scale}) rotateX(-9deg) rotateZ(1.4deg)`;

  const duration = phase === 'up' ? UP_MS : DOWN_MS;
  const easing =
    phase === 'up'
      ? 'cubic-bezier(0.16, 1, 0.3, 1)'
      : 'cubic-bezier(0.5, 0, 0.2, 1)';

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{ perspective: '1500px' }}
      aria-hidden="true"
    >
      <div
        data-lift={phase}
        style={{
          position: 'absolute',
          left: origin.left,
          top: origin.top,
          width: origin.width,
          height: origin.height,
          transform: lifted ? liftedTransform : restTransform,
          transformOrigin: 'center center',
          transition: `transform ${duration}ms ${easing}, opacity 260ms ease-out`,
          opacity: fading ? 0 : 1,
        }}
      >
        {/* Bayangan di meja / di tangan */}
        <div
          className="absolute"
          style={{
            left: '-7%',
            right: '-7%',
            bottom: '-5%',
            height: '14%',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)',
            filter: 'blur(14px)',
            opacity: lifted ? 0.4 : 0.75,
            transition: `opacity ${duration}ms ${easing}`,
            transform: 'translateZ(-1px)',
          }}
        />

        {/* Sampul buku — meniru buku merah "BOOK OF BOOKS" di meja */}
        <div
          className="relative h-full w-full rounded-[3px] border border-black/60"
          style={{
            background:
              'linear-gradient(135deg, #6b1414 0%, #4a0b0b 45%, #330707 100%)',
            boxShadow:
              '0 26px 60px rgba(0,0,0,0.55), inset 0 0 40px rgba(0,0,0,0.35)',
          }}
        >
          {/* Tepi halaman di sisi kiri (block pages) */}
          <div
            className="absolute -left-[3px] bottom-[3px] top-[2px] w-[3px] rounded-l-[1px]"
            style={{
              background:
                'linear-gradient(90deg, #b9b1a2 0%, #f2ede2 60%, #d8d1c2 100%)',
            }}
          />

          {/* Label putih "BOOK OF BOOKS" */}
          <div
            className="absolute left-1/2 top-[13%] -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 sm:px-3 sm:py-1.5"
            style={{ boxShadow: '0 1px 5px rgba(0,0,0,0.4)' }}
          >
            <span className="text-[8px] font-normal uppercase tracking-[0.2em] text-black sm:text-[11px] sm:tracking-[0.24em]">
              Book of Books
            </span>
          </div>
        </div>
      </div>

      {/* Petunjuk kecil saat buku diangkat */}
      {phase === 'up' && (
        <div
          className="absolute bottom-[12%] left-1/2 -translate-x-1/2 text-[11px] font-extralight tracking-[0.25em] text-white/50"
          style={{
            opacity: lifted && !fading ? 1 : 0,
            transition: 'opacity 320ms ease-out',
            transitionDelay: lifted ? '420ms' : '0ms',
          }}
        >
          MENGAMBIL BUKU
        </div>
      )}
    </div>
  );
}
