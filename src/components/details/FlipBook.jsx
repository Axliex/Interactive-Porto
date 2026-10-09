import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

/**
 * Buku fisik dengan halaman yang benar-benar terbalik dalam 3D (CSS perspective).
 *
 * Model fisik: tiap "lembar" (sheet) punya dua muka — front = pages[2k+1],
 * back = pages[2k+2] — dan berporos di tulang buku (sisi kiri lembar).
 * `turn` = jumlah lembar yang sudah dibalik:
 *   - lembar k < turn  → sudah di kiri  (rotateY(-180deg), muka back menghadap atas)
 *   - lembar k > turn  → masih di kanan (rotateY(0deg), muka front menghadap atas)
 *   - lembar k === turn → lembar teratas di kanan (halaman kanan saat ini)
 * Halaman kiri statis pages[0] dipakai saat turn = 0 (sebelum lembar pertama dibalik).
 *
 * Interaksi: seret (drag) halaman untuk membalik sungguhan, klik tepi kiri/kanan,
 * tombol panah keyboard. Balikan otomatis (klik/tombol) memakai transisi CSS.
 */
const FLIP_MS = 680;

export default React.forwardRef(function FlipBook({ pages, turn, onChange }, ref) {
  const pageCount = pages.length;
  const sheetCount = Math.max(0, Math.floor(pageCount / 2));
  const maxTurn = Math.max(0, Math.floor((pageCount - 1) / 2));
  const current = Math.max(0, Math.min(maxTurn, turn));

  const stageRef = useRef(null);
  const dragRef = useRef(null); // { dir, startX, halfW, moved, progress, sheet }
  const lockRef = useRef(false);
  const prevTurnRef = useRef(current);

  const [drag, setDrag] = useState(null); // { sheet, dir, progress }
  const [flying, setFlying] = useState(null); // { sheet, dir } — sedang terbang
  const [instant, setInstant] = useState(false); // lompatan jauh: tanpa transisi

  const goTo = useCallback(
    (rawNext) => {
      const target = Math.max(0, Math.min(maxTurn, rawNext));
      if (target === current || lockRef.current || dragRef.current) return;
      onChange(target);
    },
    [current, maxTurn, onChange]
  );

  // Tombol navigasi di bawah buku memakai jalur ini agar tetap menghormati
  // kunci animasi (tidak ada balikan ganda di tengah halaman terbang).
  useImperativeHandle(
    ref,
    () => ({
      next: () => goTo(current + 1),
      prev: () => goTo(current - 1),
      get turn() {
        return current;
      },
      maxTurn,
    }),
    [goTo, current, maxTurn]
  );

  // Semua perubahan `turn` (dari klik, drag, tombol, maupun lompatan sticky note)
  // ditangani di sini agar status animasinya selalu konsisten.
  useLayoutEffect(() => {
    const prev = prevTurnRef.current;
    if (prev === current) return;
    const delta = current - prev;
    prevTurnRef.current = current;

    if (Math.abs(delta) === 1) {
      lockRef.current = true;
      setFlying({ sheet: Math.min(prev, current), dir: delta > 0 ? 1 : -1 });
      window.setTimeout(() => {
        lockRef.current = false;
        setFlying(null);
      }, FLIP_MS);
    } else {
      setInstant(true);
      window.setTimeout(() => setInstant(false), 120);
    }
  }, [current]);

  /* ---------------- Drag (seret halaman) ---------------- */
  const handlePointerDown = (event) => {
    if (lockRef.current || dragRef.current) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dir = event.clientX > rect.left + rect.width / 2 ? 1 : -1;
    if (dir === 1 && current >= maxTurn) return;
    if (dir === -1 && current <= 0) return;

    dragRef.current = {
      dir,
      startX: event.clientX,
      halfW: rect.width / 2,
      moved: false,
      progress: 0,
      sheet: dir === 1 ? current : current - 1,
    };
    setDrag({ dir, progress: 0, sheet: dragRef.current.sheet });
    // Pointer capture nyata bisa gagal pada event sintetis (uji otomatis)
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      /* abaikan */
    }
  };

  const handlePointerMove = (event) => {
    const state = dragRef.current;
    if (!state) return;
    const dx = event.clientX - state.startX;
    if (Math.abs(dx) > 5) state.moved = true;
    const raw = state.dir === 1 ? -dx / state.halfW : dx / state.halfW;
    state.progress = Math.max(0, Math.min(1, raw));
    setDrag({ dir: state.dir, sheet: state.sheet, progress: state.progress });
  };

  const finishDrag = () => {
    const state = dragRef.current;
    if (!state) return;
    dragRef.current = null;
    const { dir, moved, progress } = state;

    if (!moved) {
      // Klik biasa di atas halaman → balik satu lembar
      setDrag(null);
      goTo(dir === 1 ? current + 1 : current - 1);
      return;
    }
    setDrag(null);
    if (progress > 0.3) goTo(dir === 1 ? current + 1 : current - 1);
    // progress <= 0.3 → snap back (transform kembali ke posisi deklaratif)
  };

  /* ---------------- Keyboard ← → ---------------- */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(current + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(current - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goTo, current]);

  /* ---------------- Geometry ---------------- */
  const sheetZ = (k) => {
    if (drag && drag.sheet === k) return 4000;
    if (flying && flying.sheet === k) return 3000;
    if (k < current) return 100 + k;
    if (k > current) return 200 + (sheetCount - k);
    return 1000;
  };

  const sheetTransform = (k) => {
    if (drag && drag.sheet === k) {
      const base = drag.dir === 1 ? 0 : -180;
      const delta = drag.dir === 1 ? -180 * drag.progress : 180 * drag.progress;
      return `rotateY(${base + delta}deg)`;
    }
    return k < current ? 'rotateY(-180deg)' : 'rotateY(0deg)';
  };

  const rightPageIndex = current * 2 + 1;
  const hasRightPage = rightPageIndex < pageCount;
  const canGoBack = current > 0;
  const canGoForward = current < maxTurn;

  const cursorClass = !canGoForward
    ? 'cursor-w-resize'
    : !canGoBack
      ? 'cursor-e-resize'
      : 'cursor-grab active:cursor-grabbing';

  return (
    <div className="book-stage w-full">
      <div
        ref={stageRef}
        data-turn={current}
        data-flip={flying ? flying.dir : drag ? 'drag' : 'idle'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        className={`book-3d relative aspect-[16/10] w-full touch-none select-none overflow-visible ${cursorClass}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Sampul belakang / tumpukan tebal buku (di belakang semua lembar) */}
        <div
          className="pointer-events-none absolute -inset-[9px] rounded-[4px] border border-black/60"
          style={{
            transform: 'translateZ(-24px)',
            background:
              'linear-gradient(135deg, #6b1414 0%, #4a0b0b 45%, #330707 100%)',
            boxShadow:
              '0 28px 60px rgba(0,0,0,0.55), 0 4px 14px rgba(0,0,0,0.45)',
          }}
          aria-hidden="true"
        />

        {/* Tepi halaman (memberi ketebalan pada sisi luar) */}
        <div
          className="pointer-events-none absolute -right-[7px] top-[3px] bottom-[4px] w-[7px] rounded-r-[2px]"
          style={{
            transform: 'translateZ(-6px)',
            background:
              'linear-gradient(90deg, #d9d2c3 0%, #f4efe4 45%, #cfc7b6 100%)',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-[7px] top-[3px] bottom-[4px] w-[7px] rounded-l-[2px]"
          style={{
            transform: 'translateZ(-6px)',
            background:
              'linear-gradient(90deg, #cfc7b6 0%, #f4efe4 55%, #d9d2c3 100%)',
          }}
          aria-hidden="true"
        />

        {/* Halaman kiri statis saat turn = 0 (inside cover) */}
        {pages[0] && (
          <div
            className="absolute left-0 top-0 h-full w-1/2 overflow-hidden bg-neutral-100 shadow-[inset_-14px_0_22px_-14px_rgba(0,0,0,0.55)]"
            style={{ zIndex: 50 }}
          >
            {pages[0]}
          </div>
        )}

        {/* Semua lembar */}
        {Array.from({ length: sheetCount }, (_, k) => {
          const isDragging = drag && drag.sheet === k;
          const transition =
            isDragging || instant
              ? 'none'
              : `transform ${FLIP_MS}ms cubic-bezier(0.42, 0.05, 0.2, 1)`;
          return (
            <div
              key={k}
              data-sheet={k}
              className="absolute left-1/2 top-0 h-full w-1/2 origin-left"
              style={{
                transformStyle: 'preserve-3d',
                transform: sheetTransform(k),
                transformOrigin: 'left center',
                zIndex: sheetZ(k),
                transition,
                willChange: 'transform',
              }}
            >
              {/* Muka depan (halaman kanan saat lembar belum dibalik) */}
              <div
                className="absolute inset-0 overflow-hidden bg-neutral-100"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  boxShadow:
                    '0 14px 28px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.05)',
                }}
              >
                {pages[2 * k + 1]}
              </div>

              {/* Muka belakang (halaman kiri setelah lembar dibalik) */}
              {pages[2 * k + 2] && (
                <div
                  className="absolute inset-0 overflow-hidden bg-neutral-100"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    boxShadow:
                      '0 14px 28px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.05)',
                  }}
                >
                  {pages[2 * k + 2]}
                </div>
              )}
            </div>
          );
        })}

        {/* Sampul belakang bila halaman kanan sudah habis */}
        {!hasRightPage && (
          <div
            className="absolute right-0 top-0 flex h-full w-1/2 flex-col items-center justify-center overflow-hidden bg-neutral-100 shadow-[inset_14px_0_22px_-14px_rgba(0,0,0,0.55)]"
            style={{ zIndex: 60 }}
          >
            <div
              className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center"
              style={{
                backgroundColor: '#4a0b0b',
                backgroundImage:
                  'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(0,0,0,0.45))',
              }}
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">
                Selesai
              </span>
              <span className="max-w-[80%] text-sm font-extralight leading-relaxed text-white/85">
                Terima kasih telah membuka Book of Books
              </span>
            </div>
          </div>
        )}

        {/* Bayangan tulang buku */}
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 z-[3500] w-12 -translate-x-1/2"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 35%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.12) 65%, rgba(0,0,0,0.42) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Bayangan saat halaman terbang */}
        {flying && (
          <div
            className="pointer-events-none absolute inset-0 z-[3600]"
            style={{ animation: `flipShade ${FLIP_MS}ms ease-in-out` }}
            aria-hidden="true"
          />
        )}

        {/* Petunjuk tepi: muncul saat hover, menandai halaman bisa dibalik */}
        {canGoForward && (
          <div
            className="pointer-events-none absolute right-0 top-0 z-[3700] flex h-full w-[16%] items-center justify-end pr-2 opacity-0 transition-opacity duration-300 hover:opacity-100"
            style={{
              background:
                'linear-gradient(270deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 100%)',
            }}
            aria-hidden="true"
          >
            <span className="text-lg font-extralight text-black/45">›</span>
          </div>
        )}
        {canGoBack && (
          <div
            className="pointer-events-none absolute left-0 top-0 z-[3700] flex h-full w-[16%] items-center justify-start pl-2 opacity-0 transition-opacity duration-300 hover:opacity-100"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 100%)',
            }}
            aria-hidden="true"
          >
            <span className="text-lg font-extralight text-black/45">‹</span>
          </div>
        )}
      </div>
    </div>
  );
});
